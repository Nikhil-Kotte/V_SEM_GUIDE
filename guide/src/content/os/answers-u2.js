// OS Unit II worked answers for the CPU-scheduling numericals. Keyed by PYQ id.
// Each solution: Gantt chart, then a table of CT, TAT = CT − AT and WT = TAT − BT, then averages.
const U2 = 'OS Unit-2 slides (CPU scheduling)'
const TB = 'Silberschatz, Operating System Concepts 8e §5.3'

const table = (rows) => ({ table: { head: ['Process', 'AT', 'BT', 'CT', 'TAT = CT − AT', 'WT = TAT − BT'], rows } })

export default {
  'os-num-fcfs-rr': {
    blocks: [
      { h: 'FCFS' },
      { flow: ['0 P1 5', '5 P2 14', '14 P3 21', '21 P4 23', '23 P5 27'], label: 'FCFS Gantt chart' },
      table([['P1', '0', '5', '5', '5', '0'], ['P2', '1', '9', '14', '13', '4'], ['P3', '2', '7', '21', '19', '12'], ['P4', '3', '2', '23', '20', '18'], ['P5', '4', '4', '27', '23', '19']]),
      'Average TAT = 80 / 5 = **16**. Average WT = 53 / 5 = **10.6**.',
      { h: 'Round Robin, quantum 2' },
      'Rule used: a process that arrives at the same moment another\'s quantum ends joins the queue **before** the pre-empted process.',
      { flow: ['0 P1 2', '2 P2 4', '4 P3 6', '6 P1 8', '8 P4 10', '10 P5 12', '12 P2 14', '14 P3 16', '16 P1 17', '17 P5 19', '19 P2 21', '21 P3 23', '23 P2 25', '25 P3 26', '26 P2 27'], label: 'Round Robin Gantt chart' },
      table([['P1', '0', '5', '17', '17', '12'], ['P2', '1', '9', '27', '26', '17'], ['P3', '2', '7', '26', '24', '17'], ['P4', '3', '2', '10', '7', '5'], ['P5', '4', '4', '19', '15', '11']]),
      'Average TAT = 89 / 5 = **17.8**. Average WT = 62 / 5 = **12.4**.',
      { tip: 'Check: the last completion time equals the total burst (5 + 9 + 7 + 2 + 4 = 27) because the CPU is never idle.' },
    ],
    sources: [U2, TB],
  },

  'os-num-sjf-srtf': {
    blocks: [
      { h: 'SJF (non-pre-emptive)' },
      { flow: ['0 P1 5', '5 P4 6', '6 P2 9', '9 P3 12'], label: 'SJF Gantt chart' },
      'At t = 0 only P1 has arrived, so it runs to completion. At t = 5, P4 (1) is shortest, then P2 and P3 (both 3; P2 arrived first).',
      table([['P1', '0', '5', '5', '5', '0'], ['P2', '1', '3', '9', '8', '5'], ['P3', '2', '3', '12', '10', '7'], ['P4', '4', '1', '6', '2', '1']]),
      'Average TAT = 25 / 4 = **6.25**. Average WT = 13 / 4 = **3.25**.',
      { h: 'SRTF (pre-emptive SJF)' },
      { flow: ['0 P1 1', '1 P2 4', '4 P4 5', '5 P3 8', '8 P1 12'], label: 'SRTF Gantt chart' },
      'At t = 1, P2 (3) is shorter than P1\'s remaining 4, so it pre-empts. At t = 4, P2 ends and P4 (1) is shortest; then P3 (3), then P1 (4).',
      table([['P1', '0', '5', '12', '12', '7'], ['P2', '1', '3', '4', '3', '0'], ['P3', '2', '3', '8', '6', '3'], ['P4', '4', '1', '5', '1', '0']]),
      'Average TAT = 22 / 4 = **5.5**. Average WT = 10 / 4 = **2.5**. SRTF does better because short jobs never wait behind P1.',
    ],
    sources: [U2, TB],
  },

  'os-num-srtf': {
    blocks: [
      { flow: ['0 P2 2', '2 P3 3', '3 P1 6', '6 P4 8'], label: 'SRTF Gantt chart' },
      'At t = 0, P2 (2) is shorter than P1 (3). At t = 2, P3 (1) arrives and is shortest. At t = 5, P4 (2) arrives but P1 has only 1 unit left, so P1 continues.',
      table([['P1', '0', '3', '6', '6', '3'], ['P2', '0', '2', '2', '2', '0'], ['P3', '2', '1', '3', '1', '0'], ['P4', '5', '2', '8', '3', '1']]),
      'Average TAT = 12 / 4 = **3**. Average WT = 4 / 4 = **1**.',
    ],
    sources: [U2, TB],
  },

  'os-num-sjf-idle': {
    blocks: [
      { h: '(i) SJF using only what has arrived' },
      { flow: ['0 P1 8', '8 P3 9', '9 P2 13'] },
      'At t = 0 only P1 is present, so non-pre-emptive SJF must run it. Turnaround: P1 = 8, P2 = 13 − 0.4 = 12.6, P3 = 9 − 1 = 8. Average = 28.6 / 3 = **9.53**.',
      { h: '(ii) CPU idle for the first unit, then SJF' },
      { flow: ['0 idle 1', '1 P3 2', '2 P2 6', '6 P1 14'] },
      'At t = 1 all three have arrived, so the shortest go first. Turnaround: P1 = 14, P2 = 6 − 0.4 = 5.6, P3 = 2 − 1 = 1. Average = 20.6 / 3 = **6.87**.',
      { tip: 'Waiting one unit with the CPU idle lowers the average because the long job P1 no longer blocks the two short ones. This "future-knowledge" scheduling is not possible in practice.' },
    ],
    sources: [U2, `${TB} (exercise 5.3)`],
  },

  'os-num-priority': {
    blocks: [
      'Larger number = higher priority, so the order is P4 (5), P1 (4), P5 (3), P3 (2), P2 (1).',
      { flow: ['0 P4 7', '7 P1 12', '12 P5 16', '16 P3 17', '17 P2 20'], label: 'Non-pre-emptive priority Gantt chart' },
      table([['P1', '0', '5', '12', '12', '7'], ['P2', '0', '3', '20', '20', '17'], ['P3', '0', '1', '17', '17', '16'], ['P4', '0', '7', '7', '7', '0'], ['P5', '0', '4', '16', '16', '12']]),
      'Average TAT = 72 / 5 = **14.4**. Average WT = 52 / 5 = **10.4**.',
    ],
    sources: [U2, TB],
  },

  'os-num-priority2': {
    blocks: [
      'The paper does not say which way priority runs. The textbook convention is **smaller number = higher priority**; equal priorities are served in arrival (index) order.',
      { flow: ['0 P2 3', '3 P3 4', '4 P4 11', '11 P5 15', '15 P1 20'], label: 'Smaller number = higher priority' },
      table([['P1', '0', '5', '20', '20', '15'], ['P2', '0', '3', '3', '3', '0'], ['P3', '0', '1', '4', '4', '3'], ['P4', '0', '7', '11', '11', '4'], ['P5', '0', '4', '15', '15', '11']]),
      'Average TAT = 53 / 5 = **10.6**. Average WT = 33 / 5 = **6.6**.',
      { note: 'If larger number = higher priority instead, the order is P1, P5, P3, P4, P2 (0–5, 5–9, 9–10, 10–17, 17–20): TAT 5, 20, 10, 17, 9 (average 12.2) and WT 0, 17, 9, 10, 5 (average 8.2). State your assumption in the exam.' },
    ],
    sources: [U2, TB],
  },

  'os-num-priority-rr': {
    blocks: [
      'Higher number = higher priority; a higher-priority arrival pre-empts at once; equal priorities share the CPU in Round Robin with quantum 10; a pre-empted process goes to the end of its queue.',
      { flow: ['0 P1 15', '15 P2 20', '20 P3 30', '30 P4 40', '40 P3 45', '45 P5 50', '50 P4 55', '55 P6 70', '70 P3 75', '75 P4 80', '80 P2 95'], label: 'Gantt chart' },
      { ul: [
        '0–15: P1 (priority 8) runs to completion.',
        '15–20: P2 (3) runs; at 20, P3 (4) arrives and pre-empts it (P2 has 15 left).',
        '20–30: P3 uses one quantum; P4 (4) arrived at 25, so they now alternate. 30–40: P4.',
        '40–45: P3 again until P5 (5) arrives and pre-empts. 45–50: P5 finishes.',
        '50–55: P4 until P6 (5) arrives. 55–70: P6 finishes (no other priority-5 process).',
        '70–75: P3 finishes; 75–80: P4 finishes; 80–95: P2 finishes.',
      ] },
      { table: { head: ['Process', 'AT', 'BT', 'CT', 'TAT', 'WT'], rows: [['P1', '0', '15', '15', '15', '0'], ['P2', '0', '20', '95', '95', '75'], ['P3', '20', '20', '75', '55', '35'], ['P4', '25', '20', '80', '55', '35'], ['P5', '45', '5', '50', '5', '0'], ['P6', '55', '15', '70', '15', '0']] } },
      'Average TAT = 240 / 6 = **40**. Average WT = 145 / 6 ≈ **24.17**.',
    ],
    sources: [U2, `${TB} (exercise 6.17, 9e)`],
  },

  'os-num-fcfs-rr-3': {
    blocks: [
      { h: 'FCFS' },
      { flow: ['0 P2 2', '2 P3 3', '3 P1 11'] },
      table([['P1', '1', '8', '11', '10', '2'], ['P2', '0', '2', '2', '2', '0'], ['P3', '0', '1', '3', '3', '2']]),
      'Average TAT = 15 / 3 = **5**. Average WT = 4 / 3 ≈ **1.33**.',
      { h: 'Round Robin, quantum 2' },
      { flow: ['0 P2 2', '2 P3 3', '3 P1 5', '5 P1 7', '7 P1 9', '9 P1 11'] },
      'P2 and P3 each finish within one quantum, and after t = 3 only P1 is left, so it gets every quantum. The completion times, and so the averages, are the same as FCFS: TAT **5**, WT **1.33**.',
    ],
    sources: [U2, TB],
  },
}
