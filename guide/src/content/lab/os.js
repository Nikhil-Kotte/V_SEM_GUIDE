// OS lab external guide. Code lives in ./os, real terminal transcripts in ./os-out.
// Every transcript was produced by compiling and running the program with the input shown.
const CODE = import.meta.glob('./os/*', { query: '?raw', import: 'default', eager: true })
const OUT = import.meta.glob('./os-out/*.txt', { query: '?raw', import: 'default', eager: true })

const code = (file) => ({ file, code: CODE[`./os/${file}`] })
const out = (name, title = 'Expected output') => ({ terminal: OUT[`./os-out/${name}.txt`], title })
const run = (cmds) => ({ terminal: cmds, title: 'Compile and run' })

const c = (file, bin, extra = '') => run(`gcc ${file} -o ${bin}${extra}\n./${bin}`)
const sh = (file) => run(`chmod +x ${file}\n./${file}        # or: bash ${file}`)

export default {
  label: 'Experiment',
  intro: [
    'Each experiment has the **program**, the exact **commands** to compile and run it, **what to type** when it asks for input, and the **output you should see**. Every C program here was compiled and run with that input, so if your screen matches, your code is correct.',
    { tip: [
      'In the external: type the code, then run it with the **same test input** given here first. If the output matches, try one more input of your own to show the examiner it works in general.',
      { ul: [
        'Save C files with `gedit fcfs.c` (or `nano` / `vi`), compile with `gcc fcfs.c -o fcfs`, run with `./fcfs`.',
        'Programs that use threads or semaphores need `-lpthread` at the end of the gcc command (`-lrt` too for shared memory on older systems).',
        'Shell scripts: `chmod +x prime.sh` once, then `./prime.sh`. Or simply `bash prime.sh`.',
        'Process IDs (PIDs) and times will be different on your machine. Everything else should match.',
      ] },
    ] },
  ],
  experiments: [
    {
      id: 'commands', num: 1, short: 'Linux commands', title: 'Linux, network and process commands',
      aim: 'Explore basic Linux commands, network commands and process-management commands.',
      blocks: [
        { h: 'If this is asked' },
        { steps: [
          'Write the difference between Unix and Linux (table below), then demonstrate commands in this order: files → text → permissions → network → processes.',
          'For each command write **syntax, one-line description, and one example** with its output, exactly like your record.',
          'Do it live in the terminal: make a folder with your roll number and work inside it, so every example is self-contained.',
        ] },
        { table: { head: ['', 'Linux', 'Unix'], rows: [
          ['Origin', '1991, Linus Torvalds', '1970s, Bell Labs (AT&T)'],
          ['Licence', 'Free and open source', 'Proprietary, needs a licence'],
          ['Kernel', 'Lightweight, modular', 'Monolithic and complex'],
          ['Used on', 'Servers, PCs, phones (Android), embedded', 'Mostly enterprise servers and workstations'],
        ] } },
        { h: 'File and directory commands' },
        { table: { head: ['Command', 'Example', 'What it does'], rows: [
          ['`mkdir`', '`mkdir 1234567`', 'Make a directory'],
          ['`cd`', '`cd 1234567`', 'Change directory (`cd ..` goes up one level)'],
          ['`pwd`', '`pwd` → `/home/student/1234567`', 'Print the current directory'],
          ['`rmdir`', '`rmdir 1234567`', 'Remove an **empty** directory'],
          ['`ls`', '`ls -l`', 'List files (`-l` long format, `-a` show hidden)'],
          ['`touch`', '`touch text1.txt`', 'Create an empty file'],
          ['`cp`', '`cp text1.txt text2.txt`', 'Copy a file'],
          ['`mv`', '`mv text1.txt text3.txt`', 'Move or rename'],
          ['`rm`', '`rm text3.txt`', 'Delete a file (`rm -r dir` deletes a folder)'],
          ['`cat`', '`cat text2.txt`', 'Print a file'],
          ['`head` / `tail`', '`head -n 5 a.txt`, `tail -n 10 a.txt`', 'First / last lines of a file'],
          ['`cmp`', '`cmp text1.txt text2.txt`', 'Compare byte by byte; prints `differ: byte 3, line 1`'],
          ['`paste`', '`paste a.txt b.txt`', 'Join files side by side, tab separated'],
          ['`grep`', '`grep --color "use" text1.txt`', 'Print the lines that contain a word'],
          ['`chmod`', '`chmod 755 run.sh`, `chmod u+x run.sh`', 'Change permissions: r=4, w=2, x=1 for owner/group/others'],
          ['`chown`', '`sudo chown student:student a.txt`', 'Change owner and group'],
          ['`echo`', '`echo "hello"`', 'Print text'],
          ['`date`, `clear`, `man`', '`man ls`', 'Date and time, clear screen, manual page'],
        ] } },
        { terminal: `student@cselab:~$ mkdir 1234567
student@cselab:~$ cd 1234567
student@cselab:~/1234567$ pwd
/home/student/1234567
student@cselab:~/1234567$ echo "first line" > text1.txt
student@cselab:~/1234567$ echo "fizzy line" > text2.txt
student@cselab:~/1234567$ ls
text1.txt  text2.txt
student@cselab:~/1234567$ cmp text1.txt text2.txt
text1.txt text2.txt differ: byte 3, line 1
student@cselab:~/1234567$ chmod 754 text1.txt
student@cselab:~/1234567$ ls -l text1.txt
-rwxr-xr-- 1 student student 11 Nov  7 10:15 text1.txt`, title: 'Sample session' },
        { h: 'Network commands' },
        { table: { head: ['Command', 'Example', 'What it shows'], rows: [
          ['`ping`', '`ping -c 4 127.0.0.1`', 'Is the host reachable? `64 bytes from … time=0.03 ms`. Ctrl+C to stop'],
          ['`ifconfig` / `ip a`', '`ifconfig`', 'Your interfaces, IP address, MAC address'],
          ['`netstat`', '`netstat -tuln`', 'Open connections and listening ports'],
          ['`nslookup`', '`nslookup google.com`', 'Ask DNS for the IP of a name'],
          ['`traceroute`', '`traceroute google.com`', 'Every router (hop) on the way to the host'],
          ['`telnet`', '`telnet towel.blinkenlights.nl 23`', 'Open a text session to a remote host and port'],
        ] } },
        { h: 'Process commands' },
        { table: { head: ['Command', 'Example', 'What it does'], rows: [
          ['`ps`', '`ps -ef` or `ps aux`', 'List processes with PID, PPID and state'],
          ['`top`', '`top` (press `q` to quit)', 'Live view of processes, CPU and memory use'],
          ['`kill`', '`kill -9 1234`', 'Send a signal to a process; 9 = SIGKILL (force stop)'],
          ['`nice`', '`nice -n 10 ./a.out`', 'Start a program with a lower priority (−20 highest … 19 lowest)'],
          ['`renice`', '`renice -n 5 -p 1234`', 'Change the priority of a running process'],
        ] } },
        { exam: 'Viva favourites: `chmod 755` means owner rwx (7), group r-x (5), others r-x (5). `kill -9` cannot be caught by the program; plain `kill` sends SIGTERM (15), which the program can handle.' },
      ],
    },
    {
      id: 'shell', num: 2, short: 'Shell scripts', title: 'Shell scripts',
      aim: 'Write shell scripts for even/odd, prime, factorial, Armstrong, palindrome and Fibonacci.',
      blocks: [
        'All six scripts read a number with `read -p`, so you **type the number after the prompt and press Enter**. Run each one twice: once with a "yes" case and once with a "no" case.',
        { warn: 'Inside `$(( ))` there must be no spaces around `=` in assignments (`n=5`, not `n = 5`). In `[ ]` tests you **need** spaces: `[ $n -gt 1 ]`.' },
      ],
      parts: [
        { title: 'a) Even or odd', blocks: [code('evenodd.sh'), sh('evenodd.sh'), 'Input: type `10`, then run again with `111`.', out('evenodd-1', 'Run 1'), out('evenodd-2', 'Run 2')] },
        { title: 'b) Prime or not', blocks: [code('prime.sh'), sh('prime.sh'), 'Input: `10` (not prime), `313` (prime), `-89` (negative: neither).', out('prime-1', 'Run 1'), out('prime-2', 'Run 2'), out('prime-3', 'Run 3')] },
        { title: 'c) Factorial', blocks: [code('factorial.sh'), sh('factorial.sh'), 'Input: `5` → 120. Also show `12` and a negative number.', out('factorial-1', 'Run 1'), out('factorial-2', 'Run 2'), out('factorial-3', 'Run 3')] },
        { title: 'd) Armstrong number', blocks: [
          'An Armstrong number equals the sum of its digits each raised to the number of digits: 153 = 1³ + 5³ + 3³; 1634 = 1⁴ + 6⁴ + 3⁴ + 4⁴.',
          code('armstrong.sh'), sh('armstrong.sh'), 'Input: `153`, `1634` (both yes), `79` (no).',
          out('armstrong-1', 'Run 1'), out('armstrong-2', 'Run 2'), out('armstrong-3', 'Run 3'),
        ] },
        { title: 'e) Palindrome number', blocks: [code('palindrome.sh'), sh('palindrome.sh'), 'Input: `1441` (yes), `143` (no).', out('palindrome-1', 'Run 1'), out('palindrome-2', 'Run 2')] },
        { title: 'f) Fibonacci series', blocks: [code('fibonacci.sh'), sh('fibonacci.sh'), 'Input: `10` → prints the first 10 terms.', out('fibonacci-1')] },
      ],
    },
    {
      id: 'syscalls', num: 3, short: 'Process system calls', title: 'Process system calls',
      aim: 'Demonstrate fork(), getpid(), getppid(), wait(), getuid()/setuid(), exec family, zombie and orphan processes.',
      blocks: [
        { terms: [
          ['fork()', 'Creates a copy of the calling process. Returns 0 in the child, the child\'s PID in the parent, −1 on failure.'],
          ['wait()', 'Parent blocks until a child ends, and collects its exit status.'],
          ['exec', 'Replaces the current program with a new one (same PID). Code after a successful exec never runs.'],
          ['Zombie', 'A child that has finished but whose parent has not called wait(). Shows as `Z` / `<defunct>` in `ps`.'],
          ['Orphan', 'A child whose parent finished first. It is adopted by init/systemd (PID 1).'],
        ] },
        'None of these programs take input. Just compile and run.',
      ],
      parts: [
        { title: 'a) fork(), getpid(), getppid(), wait()', blocks: [code('fork.c'), c('fork.c', 'fork'), out('fork'), 'Parent and child run at the same time, so their first lines may come in either order. "Parent process is exiting.." is **always last**, because the parent is stuck in `wait()` until the child exits (about 5 s). Both report the same two PIDs: the parent\'s `getpid()` equals the child\'s `getppid()`. Your PIDs will differ.'] },
        { title: 'b) getuid() and setuid()', blocks: [
          code('setuid.c'), c('setuid.c', 'setuid'),
          out('setuid', 'Output when your user ID is 1000 (the usual first user on Ubuntu)'),
          out('setuid-2', 'Output when your user ID is something else'),
          'A normal user may only "change" to their own ID. To really switch to another user the program must run as root: `sudo ./setuid` prints `Current user ID: 0` and then succeeds. Check your ID with the `id -u` command.',
        ] },
        { title: 'c) execlp() and execv()', blocks: [
          code('exec.c'), run('gcc exec.c\n./a.out'),
          out('exec'),
          'Child 1 is replaced by `ls -l`, child 2 by `ls -a`. The file list is whatever is in your folder.',
        ] },
        { title: 'd) Zombie process', blocks: [
          code('zombie.c'), c('zombie.c', 'zombie'), out('zombie'),
          { h: 'How to show the zombie to the examiner' },
          { steps: [
            'Run `./zombie &` (the `&` gives the terminal back while it sleeps), or open a second terminal.',
            'Within 30 seconds run `ps -el | grep zombie` or `ps aux | grep defunct`.',
            'The child shows state **Z** and the name `[zombie] <defunct>`: it has exited, but the parent has not called `wait()`, so its entry stays in the process table.',
            'When the parent exits after 30 s, init adopts and reaps the zombie, and the entry disappears.',
          ] },
          { terminal: `$ ./zombie &
$ ps -el | grep zombie
0 S  1000  1045  1012  0  80   0 -   624 hrtime pts/0    00:00:00 zombie
1 Z  1000  1046  1045  0  80   0 -     0 -      pts/0    00:00:00 zombie <defunct>`, title: 'ps while the parent sleeps' },
        ] },
        { title: 'e) Orphan process', blocks: [
          code('orphan.c'), c('orphan.c', 'orphan'), out('orphan'),
          'The parent exits at once, so the shell prompt comes back **before** the child\'s last two lines. That is expected. On Ubuntu with a desktop the new parent may be a `systemd --user` process (some PID other than 1). Both answers mean "adopted".',
        ] },
      ],
    },
    {
      id: 'scheduling', num: 4, short: 'CPU scheduling', title: 'CPU scheduling algorithms',
      aim: 'Simulate FCFS, SJF, Round Robin, and Priority (preemptive and non-preemptive) scheduling. Find CT, TAT and WT.',
      blocks: [
        { formula: 'TAT = CT − AT   ·   WT = TAT − BT' },
        'Type each process on its own line, values separated by spaces, exactly in the order the prompt asks for. Check one row by hand to prove the program is right.',
      ],
      parts: [
        { title: 'a) FCFS (with arrival times)', blocks: [
          code('fcfs.c'), c('fcfs.c', 'fcfs'),
          'Input: `4`, then one process per line: `A 0 5`, `B 1 3`, `C 2 8`, `D 3 6` (name, arrival time, burst time).',
          out('fcfs'),
          'Gantt: A 0–5, B 5–8, C 8–16, D 16–22. Check row D: TAT = 22 − 3 = 19, WT = 19 − 6 = 13.',
          { note: 'This version also handles an idle CPU: if the next process arrives after the CPU is free, the clock jumps to its arrival time.' },
        ] },
        { title: 'b) SJF (non-preemptive, all arrive at 0)', blocks: [
          code('sjf.c'), c('sjf.c', 'sjf'),
          'Input: `4`, then `A 6`, `B 8`, `C 7`, `D 3` (name, burst time).',
          out('sjf'),
          'Sorted by burst: D(3) A(6) C(7) B(8). Average WT = (0 + 3 + 9 + 16) / 4 = 7.',
        ] },
        { title: 'c) Round Robin', blocks: [
          code('rr.c'), c('rr.c', 'rr'),
          'Input: `4`, then `0 5`, `1 4`, `2 2`, `4 1` (arrival time, burst time), then time quantum `2`.',
          out('rr'),
          'Gantt: P1 0–2, P2 2–4, P3 4–6, P1 6–8, P4 8–9, P2 9–11, P1 11–12.',
        ] },
        { title: 'd) Priority, preemptive (lower number = higher priority)', blocks: [
          code('priority_p.c'), c('priority_p.c', 'prio_p'),
          'Input: `4`, then `0 5 3`, `1 3 1`, `2 4 4`, `3 2 2` (AT, BT, priority).',
          out('priority_p'),
          'P2 arrives at 1 with a better priority and **interrupts** P1. Gantt: P1 0–1, P2 1–4, P4 4–6, P1 6–10, P3 10–14.',
        ] },
        { title: 'e) Priority, non-preemptive', blocks: [
          code('priority_np.c'), c('priority_np.c', 'prio_np'),
          'Use the **same input** as preemptive so the examiner can see the difference.',
          out('priority_np'),
          'P1 runs to completion first because nothing can interrupt it. Gantt: P1 0–5, P2 5–8, P4 8–10, P3 10–14.',
        ] },
      ],
    },
    {
      id: 'paging', num: 5, short: 'Page replacement', title: 'Page replacement: FIFO and LRU',
      aim: 'Simulate FIFO and LRU page replacement and count page faults (misses).',
      blocks: [
        'Input for both: frame size `3`, number of pages `12`, then the reference string on one line: `7 0 1 2 0 3 0 4 2 3 0 3`.',
      ],
      parts: [
        { title: 'a) FIFO: replace the page that came in first', blocks: [code('fifo.c'), c('fifo.c', 'fifo'), out('fifo'), 'Frames are replaced in a circular order (slot 1, 2, 3, 1, …): that is FIFO.'] },
        { title: 'b) LRU: replace the page not used for the longest time', blocks: [
          code('lru.c'), c('lru.c', 'lru'), out('lru'),
          'Same string, **9 misses** instead of 10. At page 3 (6th reference) LRU throws out 1 (unused longest) where FIFO threw out 0.',
          { exam: 'If asked for OPT as well: on the same string OPT gives 7 misses. Use the Page replacement simulator in the Learn tab to check any string.' },
        ] },
      ],
    },
    {
      id: 'ipc', num: 6, short: 'IPC', title: 'Inter-process communication',
      aim: 'IPC using an unnamed pipe, a named pipe (FIFO), and the producer–consumer problem with shared memory and semaphores.',
      parts: [
        { title: 'a) Pipe between parent and child', blocks: [
          code('pipe.c'), c('pipe.c', 'pipe'), out('pipe'),
          '`fd[0]` is the read end, `fd[1]` is the write end. The parent closes the read end and writes; the child closes the write end and reads.',
        ] },
        { title: 'b) Named pipe (FIFO) between two unrelated programs', blocks: [
          code('npc.c'), code('sender.c'), code('receiver.c'),
          { steps: [
            'Terminal 1: create the FIFO once.',
            'Terminal 1: start the sender. It **waits** at `open()` until someone opens the other end.',
            'Terminal 2: start the receiver. Now the sender shows its prompt; type a message and press Enter.',
            'Terminal 2 prints the message.',
          ] },
          out('fifo-create', 'Terminal 1: create the FIFO'),
          'The `p` at the start of `prwxrwxrwx` means "pipe".',
          out('fifo-sender', 'Terminal 1: sender (type the message)'),
          out('fifo-receiver', 'Terminal 2: receiver'),
          { tip: 'If the receiver is started first, it waits instead. Either order works; the first one simply blocks until the second opens the FIFO.' },
        ] },
        { title: 'c) Producer–consumer (bounded buffer)', blocks: [
          code('prodcons.c'), c('prodcons.c', 'prodcons', ' -lpthread -lrt'), out('prodcons'),
          { ul: [
            '`empty` starts at the buffer size (8): free slots. The producer waits on it.',
            '`full` starts at 0: filled slots. The consumer waits on it.',
            '`mutex` (starts at 1) lets only one process touch the buffer at a time.',
          ] },
          'The order of the lines changes from run to run. What must always hold: every item is consumed after it is produced, in order 1…10, and the slot numbers wrap around after 7.',
        ] },
      ],
    },
    {
      id: 'threads', num: 7, short: 'Threads', title: 'Threads and mutual exclusion',
      aim: 'Create threads with pthreads, pass arguments, and protect shared data with a mutex.',
      blocks: ['Compile **every** thread program with `-lpthread`, or the linker will say "undefined reference to pthread_create".'],
      parts: [
        { title: 'a) Passing an argument to a thread', blocks: [code('thread_arg.c'), c('thread_arg.c', 'targ', ' -lpthread'), out('thread_arg'), '`pthread_join` makes main wait, so the main line always comes last.'] },
        { title: 'b) Sum of first n numbers in a thread', blocks: [code('thread_sum.c'), c('thread_sum.c', 'tsum', ' -lpthread'), 'Input: `10`.', out('thread_sum'), 'Check: n(n+1)/2 = 10 × 11 / 2 = 55.'] },
        { title: 'c) Mutex protects a shared counter', blocks: [
          code('mutex.c'), c('mutex.c', 'mutex', ' -lpthread'), out('mutex'),
          'Two threads each add 1000. With the lock the answer is always 2000. Comment out the lock/unlock lines and run it a few times: you may get less than 2000, which is a **race condition**.',
        ] },
      ],
    },
    {
      id: 'dining', num: 8, short: 'Dining philosophers', title: 'Dining philosophers',
      aim: 'Solve the dining philosophers problem with semaphores, without deadlock.',
      blocks: [
        code('dining.c'), c('dining.c', 'dining', ' -lpthread'),
        'No input. Each philosopher eats 3 rounds and then leaves.',
        out('dining'),
        'The order changes every run. What must always hold: two **neighbours** never eat at the same time (e.g. 2 and 4 can, 2 and 3 cannot), and the program always reaches "All philosophers are done", so there is no deadlock.',
        { exam: 'Why no deadlock: each chopstick is a semaphore (value 1). Philosophers 0–3 pick up the left chopstick first, but philosopher 4 picks up the **right** one first. That breaks the circular wait (one of the four Coffman conditions), so the five can never all hold one chopstick and wait for the next.' },
      ],
    },
    {
      id: 'bankers', num: 9, short: "Banker's algorithm", title: "Banker's algorithm: deadlock detection and avoidance",
      aim: 'Find whether the system is safe or deadlocked, and give the safe sequence.',
      blocks: [
        'Input format for both programs: number of processes and resources on one line, then each matrix **row by row** (one process per line), then the Available vector on one line.',
        { formula: 'Need = Max − Allocation' },
      ],
      parts: [
        { title: 'a) Deadlock detection (uses the Request matrix)', blocks: [
          code('bankers_detect.c'), c('bankers_detect.c', 'detect'),
          'Test 1 (textbook example, 5 processes, 3 resources, Available `0 0 0`):',
          out('bankers_detect-1', 'Test 1: no deadlock'),
          'Test 2: same input, but P3 now requests `0 0 1`:',
          out('bankers_detect-2', 'Test 2: deadlock'),
          'Only P1 can finish (it needs nothing). It releases `0 1 0`, which is not enough for anyone else, so P2–P5 are deadlocked.',
          { note: 'The program compares **Request** with Work. (A common mistake in copies of this program is comparing Request − Allocation, which gives wrong answers.)' },
        ] },
        { title: 'b) Deadlock avoidance (safety algorithm)', blocks: [
          code('bankers_avoid.c'), c('bankers_avoid.c', 'avoid'),
          'Input: the classic Silberschatz example, Available `3 3 2`.',
          out('bankers_avoid'),
          'Check by hand: Work 3 3 2 → P2 (needs 1 2 2) runs → Work 5 3 2 → P4 → 7 4 3 → P5 → 7 4 5 → P1 → 7 5 5 → P3 → 10 5 7.',
        ] },
      ],
    },
    {
      id: 'allocation', num: 10, short: 'File allocation', title: 'File allocation strategies',
      aim: 'Simulate contiguous, linked and indexed file allocation.',
      blocks: [
        'Each program asks for the disk size and files, prints the allocation table, then lets you look up a file by name. Type `exit` to stop.',
      ],
      parts: [
        { title: 'a) Contiguous', blocks: [
          code('alloc_contiguous.c'), c('alloc_contiguous.c', 'contig'),
          'Input: `10` blocks, `2` files: `f1` start `0` length `3`; `f2` start `5` length `4`. Then look up `f1`, `f3` (missing), `exit`.',
          out('alloc_contiguous'),
          'The blocks of a file are side by side, so only the start and length are needed.',
        ] },
        { title: 'b) Linked', blocks: [
          code('alloc_linked.c'), c('alloc_linked.c', 'linked'),
          'Input: `10` blocks, `2` files: `f1` with `3` blocks `2 5 8`; `f2` with `2` blocks `1 9`. Then `f1`, `exit`.',
          out('alloc_linked'),
          'Blocks can be anywhere; each block points to the next one (2 → 5 → 8).',
        ] },
        { title: 'c) Indexed', blocks: [
          code('alloc_indexed.c'), c('alloc_indexed.c', 'indexed'),
          'Input: `10` blocks, `2` files: `f1` index block `0`, `3` data blocks `2 5 8`; `f2` index block `1`, `2` data blocks `3 9`. Then `f1`, `exit`.',
          out('alloc_indexed'),
          'The index block holds the list of all the file\'s data blocks, so any block can be reached directly.',
        ] },
      ],
    },
  ],
}
