#include <stdio.h>

int main() {
    int n, m, i, j, k;

    // number of processes and resource types
    printf("Enter number of processes and resources: ");
    scanf("%d %d", &n, &m);

    int alloc[n][m], req[n][m], avail[m], finish[n], seq[n], idx = 0;

    printf("Enter Allocation Matrix (%d x %d):\n", n, m);
    for (i = 0; i < n; i++)
        for (j = 0; j < m; j++)
            scanf("%d", &alloc[i][j]);

    printf("Enter Request Matrix (%d x %d):\n", n, m);
    for (i = 0; i < n; i++)
        for (j = 0; j < m; j++)
            scanf("%d", &req[i][j]);

    printf("Enter Available Resources (%d values): ", m);
    for (i = 0; i < m; i++)
        scanf("%d", &avail[i]);

    // work = available, and no process has finished yet
    int work[m];
    for (i = 0; i < m; i++) work[i] = avail[i];
    for (i = 0; i < n; i++) finish[i] = 0;

    // deadlock detection: repeatedly look for a process whose request can be met
    for (k = 0; k < n; k++) {
        for (i = 0; i < n; i++) {
            if (finish[i] == 0) {
                for (j = 0; j < m; j++)
                    if (req[i][j] > work[j])
                        break; // this request cannot be met now
                if (j == m) {
                    for (j = 0; j < m; j++)
                        work[j] += alloc[i][j]; // it finishes and releases its resources
                    finish[i] = 1;
                    seq[idx++] = i;
                }
            }
        }
    }

    // any process that could not finish is deadlocked
    int dead = 0;
    for (i = 0; i < n; i++)
        if (finish[i] == 0) dead = 1;

    if (dead) {
        printf("\nSystem is in Deadlock.\nDeadlocked Processes: ");
        for (i = 0; i < n; i++)
            if (finish[i] == 0) printf("P%d ", i + 1);
        printf("\n");
    } else {
        printf("\nSystem is in Safe State.\nSafe Sequence: ");
        for (i = 0; i < n; i++) printf("P%d ", seq[i] + 1);
        printf("\n");
    }
    return 0;
}
