#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

void *threadFunction(void *arg) {
    printf("Hello from Thread! Argument passed = %d\n", *(int *)arg);
    return NULL;
}

int main() {
    pthread_t threadID;
    int arg = 19;

    if (pthread_create(&threadID, NULL, threadFunction, &arg) != 0) {
        perror("Thread creation failed!");
        return 1;
    }

    if (pthread_join(threadID, NULL) != 0) {
        perror("Thread Join failed!");
        return 1;
    }

    printf("Main Thread: The created thread has completed its execution.\n");
    return 0;
}
