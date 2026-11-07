#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>

int main() {
    int fd;
    char msg[100];
    fd = open("fifo", O_RDONLY); // waits here until a sender opens the pipe
    read(fd, msg, sizeof(msg));
    printf("Received message: %s", msg);
    close(fd);
    return 0;
}
