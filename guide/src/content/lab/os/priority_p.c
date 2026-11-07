#include <stdio.h>
#include <limits.h>

int main() {
    int n;
    int pid[20], at[20], bt[20], pr[20];
    int rt[20], ct[20], wt[20], tat[20];
    int time = 0, remain, i, highest_pr;
    float avg_wt = 0, avg_tat = 0;

    printf("Enter number of processes: ");
    scanf("%d", &n);
    remain = n;

    printf("Enter Arrival Time, Burst Time, and Priority (lower number = higher priority):\n");
    for (i = 0; i < n; i++) {
        pid[i] = i + 1;
        printf("P%d AT BT PR: ", i + 1);
        scanf("%d %d %d", &at[i], &bt[i], &pr[i]);
        rt[i] = bt[i]; // remaining time
    }

    // start from the earliest arrival
    int min_at = at[0];
    for (i = 1; i < n; i++)
        if (at[i] < min_at) min_at = at[i];
    time = min_at;

    while (remain > 0) {
        highest_pr = -1;
        int min_priority = INT_MAX;

        // pick the highest-priority process among those that have arrived
        for (i = 0; i < n; i++) {
            if (at[i] <= time && rt[i] > 0 && pr[i] < min_priority) {
                min_priority = pr[i];
                highest_pr = i;
            }
        }

        if (highest_pr == -1) {
            time++; // no process has arrived yet
            continue;
        }

        rt[highest_pr]--; // run it for 1 time unit, then choose again
        time++;

        if (rt[highest_pr] == 0) { // the process has finished
            ct[highest_pr] = time;
            tat[highest_pr] = ct[highest_pr] - at[highest_pr];
            wt[highest_pr] = tat[highest_pr] - bt[highest_pr];
            avg_wt += wt[highest_pr];
            avg_tat += tat[highest_pr];
            remain--;
        }
    }

    printf("\nProcess\tAT\tBT\tPR\tCT\tWT\tTAT\n");
    for (i = 0; i < n; i++)
        printf("P%d\t%d\t%d\t%d\t%d\t%d\t%d\n", pid[i], at[i], bt[i], pr[i], ct[i], wt[i], tat[i]);

    printf("\nAverage Waiting Time: %.2f", avg_wt / n);
    printf("\nAverage Turnaround Time: %.2f\n", avg_tat / n);
    return 0;
}
