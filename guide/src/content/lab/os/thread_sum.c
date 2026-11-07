#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

// thread function: sum of the first n natural numbers
void *calculate_sum(void *arg) {
    int n = *((int *)arg);
    int sum = 0;

    for (int i = 1; i <= n; i++)
        sum += i;

    printf("Sum of first %d natural numbers = %d\n", n, sum);
    pthread_exit(NULL);
}

int main() {
    pthread_t tid;
    int n;

    printf("Enter value of n: ");
    scanf("%d", &n);

    // create the thread
    if (pthread_create(&tid, NULL, calculate_sum, &n) != 0) {
        perror("pthread_create failed");
        return 1;
    }

    // wait for the thread to finish
    pthread_join(tid, NULL);

    printf("Main thread finished.\n");
    return 0;
}
