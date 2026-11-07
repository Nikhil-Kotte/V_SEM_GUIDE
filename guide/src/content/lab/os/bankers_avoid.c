#include <stdio.h>

int main() {
    int n, m, i, j, k;

    // number of processes and resource types
    printf("Enter number of processes and resources: ");
    scanf("%d %d", &n, &m);

    int alloc[n][m], max[n][m], need[n][m], avail[m], finish[n], seq[n], idx = 0;

    printf("Enter Allocation Matrix (%d x %d):\n", n, m);
    for (i = 0; i < n; i++)
        for (j = 0; j < m; j++)
            scanf("%d", &alloc[i][j]);

    printf("Enter Maximum Matrix (%d x %d):\n", n, m);
    for (i = 0; i < n; i++)
        for (j = 0; j < m; j++)
            scanf("%d", &max[i][j]);

    printf("Enter Available Resources (%d values): ", m);
    for (i = 0; i < m; i++)
        scanf("%d", &avail[i]);

    // Need = Max - Allocation
    for (i = 0; i < n; i++)
        for (j = 0; j < m; j++)
            need[i][j] = max[i][j] - alloc[i][j];

    printf("\nNeed Matrix:\n");
    for (i = 0; i < n; i++) {
        for (j = 0; j < m; j++) printf("%d ", need[i][j]);
        printf("\n");
    }

    // work = available, and no process has finished yet
    for (i = 0; i < n; i++) finish[i] = 0;
    int work[m];
    for (i = 0; i < m; i++) work[i] = avail[i];

    // safety algorithm: find a safe sequence
    for (k = 0; k < n; k++) {
        for (i = 0; i < n; i++) {
            if (finish[i] == 0) {
                for (j = 0; j < m; j++)
                    if (need[i][j] > work[j])
                        break; // its need cannot be met now
                if (j == m) {
                    for (j = 0; j < m; j++)
                        work[j] += alloc[i][j]; // it finishes and releases its resources
                    finish[i] = 1;
                    seq[idx++] = i;
                }
            }
        }
    }

    int unsafe = 0;
    for (i = 0; i < n; i++)
        if (finish[i] == 0) unsafe = 1;

    if (unsafe) {
        printf("\nSystem is in UNSAFE State (Deadlock may occur).\nUnfinished Processes: ");
        for (i = 0; i < n; i++)
            if (finish[i] == 0) printf("P%d ", i + 1);
        printf("\n");
    } else {
        printf("\nSystem is in SAFE State.\nSafe Sequence: ");
        for (i = 0; i < n; i++) printf("P%d ", seq[i] + 1);
        printf("\n");
    }
    return 0;
}
