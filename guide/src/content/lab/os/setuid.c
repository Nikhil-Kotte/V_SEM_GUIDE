#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>

int main() {
    uid_t uid;
    uid = getuid();

    printf("Current user ID: %d\n", uid);

    if (setuid(1000) == 0) {
        printf("User ID successfully changed to 1000 \n");
    } else {
        printf("UID cannot be changed (Privileges required)\n");
    }
    return 0;
}
