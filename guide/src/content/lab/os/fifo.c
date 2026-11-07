#include <stdio.h>

int main() {
    int framesCount, pagesCount, i, j, hit = 0, miss = 0;

    printf("Enter frame size: ");
    scanf("%d", &framesCount);

    printf("Enter number of pages: ");
    scanf("%d", &pagesCount);

    int pages[pagesCount];
    printf("Enter the pages:\n");
    for (i = 0; i < pagesCount; i++)
        scanf("%d", &pages[i]);

    int frames[framesCount];
    for (i = 0; i < framesCount; i++)
        frames[i] = -1;

    int index = 0; // the frame that was filled first (the oldest page)

    for (i = 0; i < pagesCount; i++) {
        int found = 0;

        // check if the page is already in a frame
        for (j = 0; j < framesCount; j++) {
            if (frames[j] == pages[i]) {
                found = 1;
                hit++;
                break;
            }
        }

        // page fault: replace the oldest page (FIFO)
        if (!found) {
            frames[index] = pages[i];
            index = (index + 1) % framesCount;
            miss++;
        }

        // show the frames after this reference
        printf("Page %d -> ", pages[i]);
        for (j = 0; j < framesCount; j++) {
            if (frames[j] == -1) printf("- ");
            else printf("%d ", frames[j]);
        }
        printf(found ? "(HIT)\n" : "(MISS)\n");
    }

    float hitRatio = (float)hit / pagesCount;
    float missRatio = (float)miss / pagesCount;

    printf("\nTotal Hits = %d", hit);
    printf("\nTotal Misses = %d", miss);
    printf("\nHit Ratio = %.2f", hitRatio);
    printf("\nMiss Ratio = %.2f\n", missRatio);
    return 0;
}
