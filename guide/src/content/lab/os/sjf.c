#include <stdio.h>
#include <stdlib.h>

int main() {
    int n, bt[10], wt[10], ct[10], tat[10], temp;
    float totaltat = 0, totalwt = 0;
    char names[10], tempc;

    printf("Enter number of processes: ");
    scanf("%d", &n);

    // input: process name and burst time only (all processes arrive at time 0)
    for (int a = 0; a < n; a++) {
        printf("Enter process name and burst time: ");
        scanf(" %c %d", &names[a], &bt[a]);
    }

    // sort by burst time (SJF, non-preemptive)
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (bt[j] > bt[j + 1]) {
                temp = bt[j]; bt[j] = bt[j + 1]; bt[j + 1] = temp;
                tempc = names[j]; names[j] = names[j + 1]; names[j + 1] = tempc;
            }
        }
    }

    // completion time
    int sum = 0;
    for (int k = 0; k < n; k++) {
        sum += bt[k];
        ct[k] = sum;
    }

    // turnaround time = completion time (arrival time is 0)
    for (int l = 0; l < n; l++) {
        tat[l] = ct[l];
        totaltat += tat[l];
    }

    // waiting time = TAT - BT
    for (int m = 0; m < n; m++) {
        wt[m] = tat[m] - bt[m];
        totalwt += wt[m];
    }

    printf("\nPs\tBT\tCT\tTAT\tWT\n");
    for (int f = 0; f < n; f++)
        printf("%c\t%d\t%d\t%d\t%d\n", names[f], bt[f], ct[f], tat[f], wt[f]);

    printf("Avg TAT = %.2f ms\n", totaltat / n);
    printf("Avg WT = %.2f ms\n", totalwt / n);
    return 0;
}
