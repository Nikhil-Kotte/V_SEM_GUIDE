#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>

int main() {
    pid_t pid;

    pid = fork();

    if (pid < 0) {
        perror("fork failed");
    }
    else if (pid == 0) {
        printf("Child process\n");
        printf("Child ID: %d\nParent ID: %d\n", getpid(), getppid());
        exit(0);
    }
    else {
        printf("Parent process: PID %d\n", getpid());
        printf("Child process ID = %d\n", pid);
        printf("Sleeping for 30 seconds without calling wait()...\n");
        sleep(30); // gives time to observe the zombie process using ps
        printf("Parent exiting after sleep\n");
    }
    return 0;
}
