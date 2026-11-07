#include <stdio.h>
#include <limits.h>

int main() {
    int n;
    int pid[50], at[50], bt[50], pr[50];
    int ct[50], wt[50], tat[50], done[50] = {0};
    int time = 0, completed = 0;
    float avg_wt = 0.0f, avg_tat = 0.0f;

    printf("Enter number of processes: ");
    scanf("%d", &n);

    printf("Enter Arrival Time, Burst Time, and Priority (lower = higher priority):\n");
    for (int i = 0; i < n; i++) {
        pid[i] = i + 1;
        printf("P%d AT BT PR: ", i + 1);
        scanf("%d %d %d", &at[i], &bt[i], &pr[i]);
    }

    // start at the earliest arrival (the CPU may be idle before that)
    int min_at = at[0];
    for (int i = 1; i < n; i++)
        if (at[i] < min_at) min_at = at[i];
    time = min_at;

    while (completed < n) {
        int idx = -1;
        int best_pr = INT_MAX, best_at = INT_MAX, best_pid = INT_MAX;

        // highest priority among arrived, unfinished processes (ties: earlier arrival, then lower id)
        for (int i = 0; i < n; i++) {
            if (!done[i] && at[i] <= time) {
                if (pr[i] < best_pr ||
                    (pr[i] == best_pr && at[i] < best_at) ||
                    (pr[i] == best_pr && at[i] == best_at && pid[i] < best_pid)) {
                    best_pr = pr[i];
                    best_at = at[i];
                    best_pid = pid[i];
                    idx = i;
                }
            }
        }

        if (idx == -1) {
            time++; // CPU idle: nothing has arrived yet
            continue;
        }

        // non-preemptive: run the selected process to completion
        time += bt[idx];
        ct[idx] = time;
        tat[idx] = ct[idx] - at[idx];
        wt[idx] = tat[idx] - bt[idx];
        avg_wt += wt[idx];
        avg_tat += tat[idx];
        done[idx] = 1;
        completed++;
    }

    printf("\nProcess\tAT\tBT\tPR\tCT\tWT\tTAT\n");
    for (int i = 0; i < n; i++)
        printf("P%d\t%d\t%d\t%d\t%d\t%d\t%d\n", pid[i], at[i], bt[i], pr[i], ct[i], wt[i], tat[i]);

    printf("\nAverage Waiting Time: %.2f", avg_wt / n);
    printf("\nAverage Turnaround Time: %.2f\n", avg_tat / n);
    return 0;
}
