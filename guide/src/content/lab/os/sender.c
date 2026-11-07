#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>

int main() {
    int fd;
    char msg[100];
    fd = open("fifo", O_WRONLY); // waits here until a receiver opens the pipe
    printf("Enter a message: ");
    fflush(stdout);
    fgets(msg, sizeof(msg), stdin);
    write(fd, msg, sizeof(msg));
    close(fd);
    return 0;
}
