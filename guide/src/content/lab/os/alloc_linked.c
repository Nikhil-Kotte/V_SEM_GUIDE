#include <stdio.h>
#include <string.h>

struct File {
    char name[20];
    int startBlock; // first block of the file
    int count;      // number of blocks
};

int main() {
    int totalBlocks, numFiles, i, j;

    printf("Enter total number of disk blocks: ");
    scanf("%d", &totalBlocks);

    int used[100] = {0}; // 0 = free, 1 = allocated
    int FAT[100];        // file allocation table: next block of each block
    for (i = 0; i < totalBlocks; i++)
        FAT[i] = -1;     // -1 means free / end of file

    printf("Enter number of files: ");
    scanf("%d", &numFiles);

    struct File files[10];
    int blocks[10][20]; // the blocks of each file, in order

    // step 1: read the files; their blocks may be anywhere on the disk
    for (i = 0; i < numFiles; i++) {
        printf("\nEnter file name: ");
        scanf("%s", files[i].name);
        printf("Enter number of blocks required: ");
        scanf("%d", &files[i].count);
        printf("Enter the block numbers (can be non-contiguous): ");

        for (j = 0; j < files[i].count; j++) {
            scanf("%d", &blocks[i][j]);
            if (blocks[i][j] >= totalBlocks || used[blocks[i][j]] == 1) {
                printf("Block %d invalid or already allocated! Try again.\n", blocks[i][j]);
                j--;
                continue;
            }
            used[blocks[i][j]] = 1;
        }

        files[i].startBlock = blocks[i][0];

        // link each block to the next one (the linked list)
        for (j = 0; j < files[i].count - 1; j++)
            FAT[blocks[i][j]] = blocks[i][j + 1];
        FAT[blocks[i][files[i].count - 1]] = -1; // last block
    }

    // step 2: show the FAT
    printf("\n File Allocation Table (FAT)\n");
    printf("Block#: Next Block\n");
    for (i = 0; i < totalBlocks; i++) {
        if (FAT[i] != -1) printf("%d: %d\n", i, FAT[i]);
        else printf("%d: NULL\n", i);
    }

    // step 3: look up files by name
    char query[20];
    int found;

    printf("\nEnter file name to display its allocation (type 'exit' to quit): ");
    scanf("%s", query);

    while (strcmp(query, "exit") != 0) {
        found = 0;
        for (i = 0; i < numFiles; i++) {
            if (strcmp(query, files[i].name) == 0) {
                found = 1;
                printf("\nFile Name: %s\n", files[i].name);
                printf("Blocks (traversing FAT): ");
                int b = files[i].startBlock;
                while (b != -1) {
                    printf("%d", b);
                    b = FAT[b];
                    if (b != -1) printf(" -> ");
                }
                printf(" -> NULL\n");
                break;
            }
        }
        if (!found) printf("File not found!\n");

        printf("\nEnter file name to display its allocation (type 'exit' to quit): ");
        scanf("%s", query);
    }

    printf("\nProgram ended.\n");
    return 0;
}
