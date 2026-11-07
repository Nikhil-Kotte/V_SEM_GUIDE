#include <stdio.h>
#include <sys/stat.h>

int main() {
    mkfifo("fifo", 0777); // create the named pipe with full permissions
    printf("Named pipe created\n");
    return 0;
}
