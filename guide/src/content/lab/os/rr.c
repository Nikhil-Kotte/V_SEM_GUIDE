#include <stdio.h>

int main() {
    int n, tq;
    int pid[20], at[20], bt[20], rt[20], wt[20], tat[20], ct[20];
    int time = 0, remain, i, front = 0, rear = 0, queue[100];
    int inQueue[20] = {0};
    float avg_wt = 0, avg_tat = 0;

    printf("Enter number of processes: ");
    scanf("%d", &n);
    remain = n;

    printf("Enter Arrival Time and Burst Time for each process:\n");
    for (i = 0; i < n; i++) {
        pid[i] = i + 1;
        printf("P%d AT BT: ", i + 1);
        scanf("%d %d", &at[i], &bt[i]);
        rt[i] = bt[i];
    }

    printf("Enter Time Quantum: ");
    scanf("%d", &tq);

    // start from the earliest arrival
    int min_at = at[0];
    for (i = 1; i < n; i++)
        if (at[i] < min_at) min_at = at[i];
    time = min_at;

    // add the first arrivals to the ready queue
    for (int atime = min_at; atime <= time; atime++)
        for (i = 0; i < n; i++)
            if (at[i] == atime && !inQueue[i] && rt[i] > 0) {
                queue[rear++] = i;
                inQueue[i] = 1;
            }

    printf("\nGantt Chart: ");
    while (remain > 0) {
        if (front == rear) {
            time++; // CPU idle
            for (int atime = min_at; atime <= time; atime++)
                for (i = 0; i < n; i++)
                    if (at[i] == atime && !inQueue[i] && rt[i] > 0) {
                        queue[rear++] = i;
                        inQueue[i] = 1;
                    }
            continue;
        }

        int idx = queue[front++]; // take the first process in the queue
        int exec = (rt[idx] > tq) ? tq : rt[idx];
        printf("| P%d ", pid[idx]);

        time += exec;
        rt[idx] -= exec;

        // processes that arrived meanwhile join the queue first
        for (int atime = min_at; atime <= time; atime++)
            for (i = 0; i < n; i++)
                if (at[i] == atime && !inQueue[i] && rt[i] > 0) {
                    queue[rear++] = i;
                    inQueue[i] = 1;
                }

        if (rt[idx] > 0) {
            queue[rear++] = idx; // unfinished: back to the end of the queue
        } else {
            ct[idx] = time;
            tat[idx] = ct[idx] - at[idx];
            wt[idx] = tat[idx] - bt[idx];
            avg_wt += wt[idx];
            avg_tat += tat[idx];
            remain--;
        }
    }

    printf("|\n\nProcess\tAT\tBT\tCT\tWT\tTAT\n");
    for (i = 0; i < n; i++)
        printf("P%d\t%d\t%d\t%d\t%d\t%d\n", pid[i], at[i], bt[i], ct[i], wt[i], tat[i]);

    printf("\nAverage Waiting Time: %.2f", avg_wt / n);
    printf("\nAverage Turnaround Time: %.2f\n", avg_tat / n);
    return 0;
}
