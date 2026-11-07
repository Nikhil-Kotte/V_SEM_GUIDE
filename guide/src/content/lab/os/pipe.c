#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <stdlib.h>
#include <sys/wait.h>

int main() {
    int fd[2]; // fd[0] = read end, fd[1] = write end
    pid_t pid;
    char write_msg[] = "Hello from parent via pipe!";
    char read_msg[100];

    // create the pipe
    if (pipe(fd) == -1) {
        perror("Pipe failed");
        exit(1);
    }

    // create the child process
    pid = fork();
    if (pid < 0) {
        perror("Fork failed");
        exit(1);
    }

    if (pid > 0) {
        // parent process: writes into the pipe
        close(fd[0]); // close the read end
        printf("Parent writing: %s\n", write_msg);
        fflush(stdout);
        write(fd[1], write_msg, strlen(write_msg) + 1);
        close(fd[1]); // close the write end
        wait(NULL);
    } else {
        // child process: reads from the pipe
        close(fd[1]); // close the write end
        read(fd[0], read_msg, sizeof(read_msg));
        printf("Child received: %s\n", read_msg);
        close(fd[0]); // close the read end
    }
    return 0;
}
