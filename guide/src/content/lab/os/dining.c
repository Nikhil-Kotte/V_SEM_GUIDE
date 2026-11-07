#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>
#include <stdlib.h>

#define NUM_PHILOSOPHERS 5
#define EAT_COUNT 3 // each philosopher eats 3 times before leaving

sem_t chopsticks[NUM_PHILOSOPHERS];

void *philosopher(void *num) {
    int id = *(int *)num;
    for (int i = 0; i < EAT_COUNT; i++) {
        printf("Philosopher %d is thinking\n", id);
        sleep(1);

        // the last philosopher picks up the right chopstick first: this breaks the
        // circular wait, so the philosophers can never deadlock
        if (id == NUM_PHILOSOPHERS - 1) {
            sem_wait(&chopsticks[(id + 1) % NUM_PHILOSOPHERS]);
            sem_wait(&chopsticks[id]);
        } else {
            sem_wait(&chopsticks[id]);
            sem_wait(&chopsticks[(id + 1) % NUM_PHILOSOPHERS]);
        }

        printf("Philosopher %d is eating (Round %d)\n", id, i + 1);
        sleep(2);

        sem_post(&chopsticks[id]);
        sem_post(&chopsticks[(id + 1) % NUM_PHILOSOPHERS]);

        printf("Philosopher %d finished eating and put down chopsticks\n", id);
        sleep(1);
    }

    printf("Philosopher %d is done eating and leaves the table\n", id);
    return NULL;
}

int main() {
    pthread_t philosophers[NUM_PHILOSOPHERS];
    int ids[NUM_PHILOSOPHERS];

    for (int i = 0; i < NUM_PHILOSOPHERS; i++)
        sem_init(&chopsticks[i], 0, 1); // each chopstick is free (value 1)

    for (int i = 0; i < NUM_PHILOSOPHERS; i++) {
        ids[i] = i;
        pthread_create(&philosophers[i], NULL, philosopher, &ids[i]);
    }

    for (int i = 0; i < NUM_PHILOSOPHERS; i++)
        pthread_join(philosophers[i], NULL);

    for (int i = 0; i < NUM_PHILOSOPHERS; i++)
        sem_destroy(&chopsticks[i]);

    printf("\nAll philosophers are done. Program exiting gracefully...\n");
    return 0;
}
