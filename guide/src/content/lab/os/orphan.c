#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main() {
    pid_t pid = fork();

    if (pid < 0) {
        perror("fork failed");
        exit(1);
    }
    else if (pid == 0) {
        // child process
        printf("Child: My PID = %d, My Parent PID = %d\n", getpid(), getppid());
        printf("Child: Sleeping for 10 seconds...\n");
        sleep(10); // wait for the parent to exit
        printf("Child: My new Parent PID = %d (should be 1 if orphaned)\n", getppid());
        printf("Child: Exiting.\n");
    }
    else {
        // parent process
        printf("Parent: My PID = %d\n", getpid());
        printf("Parent: Exiting immediately.\n");
        exit(0); // exit without waiting for the child
    }
    return 0;
}
