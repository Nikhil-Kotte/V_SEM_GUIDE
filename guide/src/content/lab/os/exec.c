#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <sys/wait.h>

int main() {
    pid_t pid1, pid2;

    pid1 = fork();

    if (pid1 < 0) {
        perror("Fork failed");
        exit(1);
    }
    else if (pid1 == 0) {
        printf("Child 1: Running 'ls -l' using execlp()\n");
        fflush(stdout);
        execlp("ls", "ls", "-l", NULL);
        perror("execlp failed");
        exit(1);
    }
    else {
        wait(NULL);

        pid2 = fork();

        if (pid2 < 0) {
            perror("Fork failed");
            exit(1);
        }
        else if (pid2 == 0) {
            printf("Child 2: Running 'ls -a' using execv()\n");
            fflush(stdout);
            char *args[] = {"ls", "-a", NULL};
            execv("/bin/ls", args);
            perror("execv failed");
            exit(1);
        }
        else {
            wait(NULL);
        }
    }
    return 0;
}
