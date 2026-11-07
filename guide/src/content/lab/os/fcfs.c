#include <stdio.h>
#include <stdlib.h>

int main() {
    int n, at[10], bt[10], wt[10], ct[10], tat[10], temp;
    float totaltat = 0, totalwt = 0;
    char names[10], tempc;

    printf("Enter no. of processes: ");
    scanf("%d", &n);

    for (int a = 0; a < n; a++) {
        printf("Process name, AT, BT: ");
        scanf(" %c %d %d", &names[a], &at[a], &bt[a]);
    }

    // sort the processes by arrival time
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (at[j] > at[j + 1]) {
                temp = at[j]; at[j] = at[j + 1]; at[j + 1] = temp;
                temp = bt[j]; bt[j] = bt[j + 1]; bt[j + 1] = temp;
                tempc = names[j]; names[j] = names[j + 1]; names[j + 1] = tempc;
            }
        }
    }

    int sum = 0;
    for (int k = 0; k < n; k++) {
        if (sum < at[k]) sum = at[k]; // CPU stays idle until the process arrives
        sum += bt[k];
        ct[k] = sum;
    }

    for (int l = 0; l < n; l++) {
        tat[l] = ct[l] - at[l];
        totaltat += tat[l];
    }

    for (int m = 0; m < n; m++) {
        wt[m] = tat[m] - bt[m];
        totalwt += wt[m];
    }

    printf("\nPs\tAT\tBT\tCT\tTAT\tWT\n");
    for (int f = 0; f < n; f++)
        printf("%c\t%d\t%d\t%d\t%d\t%d\n", names[f], at[f], bt[f], ct[f], tat[f], wt[f]);

    printf("Avg TAT = %.2f ms\n", totaltat / n);
    printf("Avg WT = %.2f ms\n", totalwt / n);
    return 0;
}
