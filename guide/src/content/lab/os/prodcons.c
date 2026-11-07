#define _XOPEN_SOURCE 700
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <semaphore.h>
#include <errno.h>
#include <string.h>
#include <time.h>
#include <sys/wait.h>

#define SHM_NAME "/po_shm_example"
#define BUFFER_SIZE 8
#define ITEMS_TO_PRODUCE 10

typedef struct {
    int buffer[BUFFER_SIZE];
    int in;
    int out;
    sem_t mutex; // binary semaphore for mutual exclusion
    sem_t empty; // counts empty slots
    sem_t full;  // counts filled slots
} shared_t;

static void die(const char *msg) {
    perror(msg);
    exit(EXIT_FAILURE);
}

static void producer(shared_t *sh) {
    for (int item = 1; item <= ITEMS_TO_PRODUCE; ++item) {
        // wait for an empty slot, then lock the buffer
        if (sem_wait(&sh->empty) == -1) die("sem_wait empty");
        if (sem_wait(&sh->mutex) == -1) die("sem_wait mutex");

        // critical section: put the item
        sh->buffer[sh->in] = item;
        int slot = sh->in;
        sh->in = (sh->in + 1) % BUFFER_SIZE;

        // unlock, and signal that one more slot is full
        if (sem_post(&sh->mutex) == -1) die("sem_post mutex");
        if (sem_post(&sh->full) == -1) die("sem_post full");

        printf("[Producer] Produced %d at slot %d\n", item, slot);
        fflush(stdout);
    }
}

static void consumer(shared_t *sh) {
    for (int count = 0; count < ITEMS_TO_PRODUCE; ++count) {
        // wait for a full slot, then lock the buffer
        if (sem_wait(&sh->full) == -1) die("sem_wait full");
        if (sem_wait(&sh->mutex) == -1) die("sem_wait mutex");

        // critical section: take the item
        int item = sh->buffer[sh->out];
        int slot = sh->out;
        sh->out = (sh->out + 1) % BUFFER_SIZE;

        // unlock, and signal that one more slot is empty
        if (sem_post(&sh->mutex) == -1) die("sem_post mutex");
        if (sem_post(&sh->empty) == -1) die("sem_post empty");

        printf("[Consumer] Consumed %d from slot %d\n", item, slot);
        fflush(stdout);
    }
}

int main(void) {
    // create or open the shared memory object
    int fd = shm_open(SHM_NAME, O_CREAT | O_RDWR, 0666);
    if (fd == -1) die("shm_open");

    // resize it to fit the shared struct
    if (ftruncate(fd, sizeof(shared_t)) == -1) die("ftruncate");

    // map it into our address space (shared, read/write)
    void *addr = mmap(NULL, sizeof(shared_t), PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
    if (addr == MAP_FAILED) die("mmap");
    close(fd); // fd is no longer needed after mmap

    shared_t *sh = (shared_t *)addr;

    // initialise the shared region once, before fork
    sh->in = 0;
    sh->out = 0;
    if (sem_init(&sh->mutex, 1, 1) == -1) die("sem_init mutex");
    if (sem_init(&sh->empty, 1, BUFFER_SIZE) == -1) die("sem_init empty");
    if (sem_init(&sh->full, 1, 0) == -1) die("sem_init full");

    pid_t pid = fork();
    if (pid == -1) die("fork");

    if (pid == 0) {
        consumer(sh); // child: consumer
        exit(0);
    } else {
        producer(sh); // parent: producer

        int status = 0;
        if (waitpid(pid, &status, 0) == -1) die("waitpid");

        // clean up the semaphores
        if (sem_destroy(&sh->mutex) == -1) die("sem_destroy mutex");
        if (sem_destroy(&sh->empty) == -1) die("sem_destroy empty");
        if (sem_destroy(&sh->full) == -1) die("sem_destroy full");

        // unmap and unlink the shared memory
        if (munmap(sh, sizeof(shared_t)) == -1) die("munmap");
        if (shm_unlink(SHM_NAME) == -1) die("shm_unlink");

        printf("\nAll done. Cleaned up shared memory and semaphores.\n");
    }
    return 0;
}
