#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

int sharedvalue = 0;
pthread_mutex_t lock;

void *threadFunction(void *arg) {
    for (int i = 0; i < 1000; i++) {
        pthread_mutex_lock(&lock);   // only one thread may enter at a time
        sharedvalue++;               // critical section
        pthread_mutex_unlock(&lock);
    }
    return NULL;
}

int main() {
    if (pthread_mutex_init(&lock, NULL) != 0) {
        perror("Mutex initialize failed");
        return 1;
    }

    pthread_t t1, t2;
    pthread_create(&t1, NULL, threadFunction, NULL);
    pthread_create(&t2, NULL, threadFunction, NULL);

    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    pthread_mutex_destroy(&lock);

    printf("Final shared value = %d\n", sharedvalue);
    return 0;
}
