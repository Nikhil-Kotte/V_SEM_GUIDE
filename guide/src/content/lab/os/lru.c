#include <stdio.h>

int main() {
    int framesCount, pagesCount, i, j, k, hit = 0, miss = 0;

    printf("Enter frame size: ");
    scanf("%d", &framesCount);

    printf("Enter number of pages: ");
    scanf("%d", &pagesCount);

    int pages[pagesCount];
    printf("Enter the pages:\n");
    for (i = 0; i < pagesCount; i++)
        scanf("%d", &pages[i]);

    int frames[framesCount], recent[framesCount]; // recent[j] = when frame j was last used
    for (i = 0; i < framesCount; i++) {
        frames[i] = -1;
        recent[i] = 0;
    }

    int time = 0;

    for (i = 0; i < pagesCount; i++) {
        int found = 0;
        time++;

        // check if the page is already in a frame
        for (j = 0; j < framesCount; j++) {
            if (frames[j] == pages[i]) {
                found = 1;
                hit++;
                recent[j] = time; // mark it as just used
                break;
            }
        }

        // page fault
        if (!found) {
            int lruIndex = 0, emptyFound = 0;

            // use an empty frame if there is one
            for (j = 0; j < framesCount; j++) {
                if (frames[j] == -1) {
                    lruIndex = j;
                    emptyFound = 1;
                    break;
                }
            }

            // otherwise replace the least recently used page
            if (!emptyFound) {
                int min = recent[0];
                lruIndex = 0;
                for (k = 1; k < framesCount; k++) {
                    if (recent[k] < min) {
                        min = recent[k];
                        lruIndex = k;
                    }
                }
            }

            frames[lruIndex] = pages[i];
            recent[lruIndex] = time;
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
