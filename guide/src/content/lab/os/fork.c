#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <sys/wait.h>

int main() {
    pid_t pid;
    pid = fork();

    if (pid < 0) {
        printf("Fork failed");
    }
    else if (pid == 0) {
        printf("Child process is created \n");
        printf("Parent pid:%d \nChild pid:%d\n", getppid(), getpid());
        printf("Child process waiting for 5 seconds \n");
        sleep(5);
        printf("Child process is exiting \n");
    }
    else {
        // parent process
        printf("Parent pid :%d \nchild pid:%d \n", getpid(), pid);
        wait(NULL);
        printf("Parent process is exiting.. \n");
    }
    return 0;
}
