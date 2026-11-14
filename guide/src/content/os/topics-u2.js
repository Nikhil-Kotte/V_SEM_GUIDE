// Operating Systems, Unit II (processes, scheduling, IPC) and the start of Unit III (a process's
// memory and the memory system calls). Keys are syllabus ids.
export default {
  'os.u2.program-process': {
    oneLine: 'A program is a passive file on disk; a process is that program in execution, with its own memory, program counter, registers and resources.',
    blocks: [
      { compare: [
        { title: 'Program', items: ['Passive: a file of instructions on disk', 'Exists until deleted', 'No resources of its own'] },
        { title: 'Process', items: ['Active: the program running', 'Created and terminated', 'Has CPU state, memory, open files'] },
      ] },
      'One program can become **many processes**: two users running the same browser create two processes from one program file.',
      { h: 'A process in memory' },
      { stack: ['Stack: function parameters, return addresses, local variables (grows down)', '↕ free space', 'Heap: memory allocated at run time (grows up)', 'Data: global variables', 'Text: the program code'], label: 'Process memory layout, high address at the top' },
    ],
    terms: [['Process', 'A program in execution.'], ['Program counter', 'The register holding the address of the next instruction to run.']],
    exam: 'Define program and process, give a comparison table and draw the process memory layout (text, data, heap, stack).',
    revise: ['Program = passive; process = active', 'Text, data, heap, stack'],
  },

  'os.u2.states': {
    oneLine: 'A process moves between five states: new, ready, running, waiting (blocked) and terminated; the scheduler and events such as I/O and interrupts cause each change.',
    blocks: [
      { flow: ['New', 'Ready', 'Running', 'Terminated'], loop: 'Running → Waiting on an I/O or event wait; Waiting → Ready when it completes; Running → Ready on an interrupt or time-out' },
      { table: { head: ['Transition', 'Cause'], rows: [
        ['New → Ready', 'Process admitted by the long-term scheduler'],
        ['Ready → Running', 'Dispatcher picks it (scheduler dispatch)'],
        ['Running → Waiting', 'It requests I/O or waits for an event (e.g. scanf waits for input)'],
        ['Waiting → Ready', 'The I/O or event completes'],
        ['Running → Ready', 'Interrupt or time slice expires (pre-emption)'],
        ['Running → Terminated', 'Process calls exit()'],
      ] } },
      { h: 'Suspended states (with swapping)' },
      'When memory is short, the medium-term scheduler **swaps out** processes. This adds **Ready-suspended** (swapped, ready to run) and **Blocked-suspended** (swapped, still waiting). Example path to blocked-suspended: New → Ready → Running → Blocked → Blocked-suspended (swapped out). From there to ready: event occurs → Ready-suspended → swapped in → Ready; or swapped in first → Blocked → event occurs → Ready. So more than one sequence is possible.',
      { tip: 'scanf() question (asked): the process goes **Running → Waiting** when scanf asks the keyboard for input, then **Waiting → Ready** when the input arrives, then back to Running, and finally **Running → Terminated** at exit(0).' },
    ],
    terms: [['Ready', 'Waiting for the CPU.'], ['Waiting (blocked)', 'Waiting for an I/O or other event.'], ['Dispatcher', 'The module that gives the CPU to the process the scheduler chose.']],
    exam: 'Draw the five-state diagram with every arrow labelled with its cause; add the two suspended states if the question mentions swapping.',
    revise: ['New, ready, running, waiting, terminated', 'I/O: running → waiting; completion: waiting → ready; time-out: running → ready'],
  },

  'os.u2.pcb': {
    oneLine: 'The Process Control Block is the OS record for one process: its state, program counter, registers, scheduling, memory, accounting and I/O information.',
    blocks: [
      { stack: ['Process state', 'Process number (PID)', 'Program counter', 'CPU registers', 'CPU scheduling info (priority, queue pointers)', 'Memory-management info (base/limit, page table)', 'Accounting info (CPU time used, time limits)', 'I/O status (open files, devices allocated)'], label: 'Fields of a PCB' },
      { table: { head: ['Field', 'Used for'], rows: [
        ['Process state', 'Scheduler knows if it can run'],
        ['Program counter and registers', 'Saved on a context switch so the process resumes exactly where it stopped'],
        ['Scheduling information', 'Priority and queue links decide when it runs'],
        ['Memory information', 'MMU and page tables translate its addresses'],
        ['Accounting', 'Billing, limits, statistics'],
        ['I/O status', 'Closing files and freeing devices when it ends'],
      ] } },
      'PCBs are linked into **queues**: the **job queue** (all processes), the **ready queue** (in memory, ready to run) and **device queues** (waiting for each device).',
    ],
    terms: [['PCB', 'Process Control Block: the data structure holding everything about a process.'], ['PID', 'Process identifier, a unique number for each process.'], ['Ready queue', 'The list of PCBs of processes ready to run.']],
    exam: 'Draw the PCB as a box of fields and explain how each field is used, then mention the job, ready and device queues.',
    revise: ['State, PID, PC, registers, scheduling, memory, accounting, I/O'],
  },

  'os.u2.services': {
    oneLine: 'OS services are of two kinds: helpful to the user (UI, program execution, I/O, file systems, communication, error detection) and for efficient system operation (resource allocation, accounting, protection).',
    blocks: [
      { tree: { root: 'OS services', kids: ['User interface (CLI, GUI, touch)', 'Program execution', 'I/O operations', 'File-system manipulation', 'Communication', 'Error detection', 'Resource allocation', 'Accounting (logging)', 'Protection and security'] } },
      { compare: [
        { title: 'For the user', items: ['UI, program execution, I/O, file systems, communication, error detection', 'Make the computer convenient'] },
        { title: 'For the system', items: ['Resource allocation, accounting, protection and security', 'Make sharing efficient and safe'] },
      ] },
      { h: 'Why user programs cannot do these themselves (asked)' },
      { ul: ['**Program execution** and **I/O**: need privileged instructions only the kernel may run.', '**File systems**: a user program could corrupt other users\' files without OS checks.', '**Communication**: needs kernel-managed shared memory or messages between protected address spaces.', '**Error detection**: hardware errors are reported only to the kernel.'] },
      { h: 'Command interpreter' },
      'The **shell** reads a command and runs it. It is kept **separate from the kernel** because commands change often and different users want different shells; a buggy shell must not crash the kernel.',
    ],
    terms: [['Command interpreter (shell)', 'A program that reads user commands and runs them.'], ['Accounting', 'Recording which user uses how much of each resource.']],
    exam: 'List the OS services in two groups (user and system), explain each in a line, and say why the command interpreter is separate from the kernel.',
    revise: ['User: UI, execution, I/O, files, communication, errors', 'System: allocation, accounting, protection'],
  },

  'os.u2.syscalls': {
    oneLine: 'A system call is how a program asks the kernel for a service; fork() creates a child, exec() replaces its program, wait() waits for a child, and getpid()/getppid() return process ids.',
    blocks: [
      { flow: ['Program calls a library function (e.g. printf)', 'Library puts the call number in a register and traps', 'CPU switches to kernel mode', 'Kernel looks up the system-call table and runs the handler', 'Result returned; back to user mode'] },
      { h: 'Process system calls' },
      { table: { head: ['Call', 'What it does'], rows: [
        ['fork()', 'Creates a child that is a copy of the parent. Returns 0 in the child, the child\'s PID in the parent, −1 on error'],
        ['exec() family (execl, execvp…)', 'Replaces the current process\'s program with a new one; the PID stays the same'],
        ['wait()', 'Parent waits until a child terminates and collects its exit status'],
        ['exit()', 'Ends the process and returns a status'],
        ['getpid() / getppid()', 'Return the process\'s own PID / its parent\'s PID'],
      ] } },
      { code: 'pid_t pid = fork();\nif (pid == 0) {              /* child */\n    execlp("ls", "ls", NULL);\n} else if (pid > 0) {        /* parent */\n    wait(NULL);\n    printf("child done\\n");\n}' },
      'fork() then exec() is the normal way to start a new program: the shell forks a child, and the child execs the command. **vfork()** shares the parent\'s memory instead of copying it and is preferable when the child calls exec() immediately, since copying would be wasted.',
      { h: 'Types of system calls' },
      { ul: ['Process control (fork, exit, wait)', 'File management (open, read, write, close)', 'Device management (ioctl, read, write)', 'Information maintenance (getpid, time)', 'Communication (pipe, shmget, socket)', 'Protection (chmod, umask)'] },
    ],
    terms: [['System call', 'A request from a program to the kernel for a service.'], ['fork()', 'Creates a child process as a copy of the caller.'], ['exec()', 'Replaces the process image with a new program.'], ['Zombie', 'A finished child whose parent has not yet called wait().']],
    exam: 'Define a system call, draw the user-to-kernel flow, explain fork, exec, wait, getpid with the code fragment, and list the six types.',
    revise: ['fork returns 0 to child, PID to parent', 'exec replaces the program, same PID', 'wait collects the child'],
  },

  'os.u2.syscalls-vs-programs': {
    oneLine: 'System calls are the kernel\'s programming interface; system programs are ready-made utilities (file managers, compilers, shells) built on top of those calls for users.',
    blocks: [
      { stack: ['Users', 'Application programs', 'System programs (shell, ls, cp, compilers, editors)', 'System call interface', 'Kernel'] },
      { table: { head: ['', 'System call', 'System program'], rows: [
        ['What', 'Function into the kernel', 'An ordinary program'],
        ['Used by', 'Programmers (through libraries)', 'Users directly'],
        ['Runs in', 'Kernel mode', 'User mode'],
        ['Example', 'open(), read(), fork()', 'cp, ls, gcc, a text editor'],
      ] } },
      { h: 'Categories of system programs' },
      { ul: ['File management (cp, mv, ls)', 'Status information (date, df, top)', 'File modification (editors)', 'Programming-language support (compilers, debuggers)', 'Program loading and execution (loaders, linkers)', 'Communications (ssh, mail, browsers)', 'Background services (daemons)'] },
    ],
    terms: [['System program', 'A utility that provides a convenient environment for program development and execution.'], ['Daemon', 'A background service process.']],
    exam: 'Draw where system programs and system calls sit, compare them in a table, and list categories of system programs.',
    revise: ['Call = kernel interface; program = user utility built on calls'],
  },

  'os.u2.context-switch': {
    oneLine: 'Scheduling decides which process runs next; a context switch saves the running process\'s state in its PCB and loads the next one\'s, and this time is pure overhead.',
    blocks: [
      { h: 'Three schedulers' },
      { table: { head: ['Scheduler', 'Chooses', 'How often'], rows: [
        ['Long-term (job)', 'Which jobs enter memory; controls the degree of multiprogramming', 'Seldom (seconds, minutes)'],
        ['Short-term (CPU)', 'Which ready process gets the CPU next', 'Very often (milliseconds)'],
        ['Medium-term', 'Which process to swap out and later back in', 'In between'],
      ] } },
      'A good long-term scheduler mixes **I/O-bound** and **CPU-bound** processes so neither the CPU nor the devices sit idle.',
      { h: 'Context switch' },
      { flow: ['Interrupt or system call', 'Save P0\'s registers and PC into PCB0', 'Load P1\'s state from PCB1', 'P1 runs', 'Later: save into PCB1, reload PCB0'] },
      { h: 'What increases the overhead (asked)' },
      { ul: ['More registers to save and restore', 'Memory-management work (switching page tables, flushing the TLB)', 'Cache contents of the new process not present (cold cache)', 'Slow memory speed and complex OS'] },
      'Some CPUs have **several register sets**. If the next context is already in a register set, the switch is just changing a pointer, very fast. If it is in memory and all sets are in use, one set must be saved to memory first, as in an ordinary switch.',
    ],
    terms: [['Context switch', 'Saving one process\'s CPU state and loading another\'s.'], ['Degree of multiprogramming', 'The number of processes in memory.'], ['I/O-bound process', 'Spends more time doing I/O than computing.']],
    exam: 'Describe the three schedulers, draw the context-switch diagram between two processes with their PCBs, and list what affects the switch time.',
    revise: ['Long, short, medium-term schedulers', 'Switch = save PCB, load PCB; pure overhead'],
  },

  'os.u2.criteria': {
    oneLine: 'Scheduling algorithms are judged by CPU utilisation and throughput (maximise) and turnaround, waiting and response time (minimise).',
    blocks: [
      { table: { head: ['Criterion', 'Meaning', 'Goal'], rows: [
        ['CPU utilisation', 'Percentage of time the CPU is busy', 'Maximise'],
        ['Throughput', 'Processes completed per unit time', 'Maximise'],
        ['Turnaround time', 'Completion time − arrival time', 'Minimise'],
        ['Waiting time', 'Turnaround time − burst time (time in the ready queue)', 'Minimise'],
        ['Response time', 'First time on CPU − arrival time', 'Minimise'],
      ] } },
      { formula: 'TAT = CT − AT    WT = TAT − BT    RT = first run − AT' },
      { h: 'Pre-emptive vs non-pre-emptive' },
      { compare: [
        { title: 'Non-pre-emptive', items: ['Once on the CPU, a process keeps it until it ends or blocks', 'Simple, less overhead', 'FCFS, SJF, non-pre-emptive priority'] },
        { title: 'Pre-emptive', items: ['The OS can take the CPU away (interrupt, higher priority, time-out)', 'Better response time', 'SRTF, RR, pre-emptive priority'] },
      ] },
      { tip: 'Best response time: **Round Robin**, because every process gets the CPU within (n−1) × quantum.' },
    ],
    terms: [['Turnaround time', 'Total time from arrival to completion.'], ['Waiting time', 'Time spent in the ready queue.'], ['Response time', 'Time from arrival until the process first gets the CPU.']],
    exam: 'Define the five criteria with formulas, say which to maximise and minimise, and contrast pre-emptive and non-pre-emptive scheduling.',
    revise: ['Max: utilisation, throughput', 'Min: turnaround, waiting, response', 'TAT = CT − AT; WT = TAT − BT'],
  },

  'os.u2.algorithms': {
    oneLine: 'CPU scheduling algorithms pick the next process: FCFS by arrival, SJF/SRTF by shortest burst, priority by priority number, Round Robin by time slices, and multilevel queues by class.',
    blocks: [
      { table: { head: ['Algorithm', 'Rule', 'Pre-emptive?', 'Note'], rows: [
        ['FCFS', 'First come, first served', 'No', 'Simple; **convoy effect**: short jobs wait behind a long one'],
        ['SJF', 'Shortest next burst first', 'No', 'Minimum average waiting time; needs burst estimate'],
        ['SRTF', 'Shortest remaining time first', 'Yes', 'Pre-emptive SJF'],
        ['Priority', 'Highest priority first', 'Either', '**Starvation** of low priority; fixed by **aging**'],
        ['Round Robin', 'Each gets a time quantum in turn', 'Yes', 'Best response; quantum too small gives too many switches'],
        ['Multilevel queue', 'Separate queues (system, interactive, batch), each with its own algorithm', 'Yes', 'Feedback version lets processes move between queues'],
      ] } },
      { h: 'Worked example: SJF and SRTF' },
      { table: { head: ['Process', 'Arrival', 'Burst'], rows: [['P1', '0', '5'], ['P2', '1', '3'], ['P3', '2', '3'], ['P4', '4', '1']] } },
      { flow: ['0 P1 5', '5 P4 6', '6 P2 9', '9 P3 12'], label: 'SJF (non-pre-emptive) Gantt chart' },
      'SJF: completion P1 = 5, P4 = 6, P2 = 9, P3 = 12. TAT = 5, 8, 10, 2 → average **6.25**. WT = 0, 5, 7, 1 → average **3.25**.',
      { flow: ['0 P1 1', '1 P2 4', '4 P4 5', '5 P3 8', '8 P1 12'], label: 'SRTF (pre-emptive) Gantt chart' },
      'SRTF: P2 pre-empts P1 at t = 1 (3 < 4 left). Completion P2 = 4, P4 = 5, P3 = 8, P1 = 12. TAT = 12, 3, 6, 1 → average **5.5**. WT = 7, 0, 3, 0 → average **2.5**.',
      { tip: 'Always draw the Gantt chart first, write completion times under it, then make a table with AT, BT, CT, TAT = CT − AT, WT = TAT − BT, and average the last two columns.' },
      { h: 'Starvation and aging' },
      'In priority scheduling a low-priority process may wait forever (**indefinite blocking**). **Aging** slowly raises the priority of processes that wait a long time, so they eventually run.',
      { h: 'Multilevel queue' },
      'Needed because processes differ (interactive need fast response, batch jobs need throughput). Drawback: a fixed queue assignment is inflexible and lower queues can starve; **multilevel feedback queues** fix this by moving processes between queues.',
    ],
    terms: [['Convoy effect', 'Short processes stuck behind one long process in FCFS.'], ['Time quantum', 'The fixed CPU time slice in Round Robin.'], ['Aging', 'Raising the priority of long-waiting processes to prevent starvation.']],
    exam: 'For numericals: Gantt chart, then a table of CT, TAT and WT, then averages. For theory: a comparison table of the algorithms with their pre-emption and weaknesses.',
    revise: ['FCFS, SJF, SRTF, priority, RR, multilevel', 'SJF gives minimum average waiting time', 'Aging cures starvation'],
  },

  'os.u2.linux-process': {
    oneLine: 'In Unix/Linux every process is created by fork() from a parent (init/systemd is the ancestor), runs a program with exec(), is tracked by its PID, and talks to the kernel through signals and system calls.',
    blocks: [
      { flow: ['init / systemd (PID 1)', 'login shell', 'fork() a child', 'child exec()s the command', 'parent wait()s', 'child exit()s'] },
      { ul: [
        'Commands to see processes: **ps**, **top**, **pstree**; send signals with **kill**.',
        'Process states in Linux: running/runnable (R), interruptible sleep (S), uninterruptible sleep (D), stopped (T), zombie (Z).',
        'A **zombie** is a finished child not yet waited for; an **orphan** is a child whose parent died (it is adopted by init).',
        'The Linux scheduler is the **Completely Fair Scheduler (CFS)**: it gives each process a fair share of CPU using virtual run time.',
      ] },
      { h: 'Signals' },
      { table: { head: ['Signal', 'Meaning'], rows: [
        ['SIGINT', 'Interrupt from keyboard (Ctrl+C)'],
        ['SIGKILL', 'Kill immediately; cannot be caught'],
        ['SIGTERM', 'Polite request to terminate'],
        ['SIGCHLD', 'A child stopped or ended'],
        ['SIGSTOP / SIGCONT', 'Pause / resume'],
        ['SIGSEGV', 'Invalid memory access'],
      ] } },
      { tip: 'Terminating a parent with two children (asked): the OS can terminate the children first (cascading termination) or let them become orphans adopted by init. A child waiting for I/O is woken and killed when its I/O returns; the running child is pre-empted and killed.' },
    ],
    terms: [['init / systemd', 'The first process (PID 1), ancestor of all others.'], ['Signal', 'A software notification sent to a process (e.g. SIGKILL).'], ['Orphan', 'A process whose parent has ended; init adopts it.']],
    exam: 'Explain process creation with fork, exec, wait and exit, draw a small process tree, list Linux process states and important signals.',
    revise: ['fork, exec, wait, exit', 'Zombie vs orphan', 'Signals: SIGINT, SIGKILL, SIGTERM, SIGCHLD'],
  },

  'os.u2.ipc': {
    oneLine: 'Processes exchange data through IPC: shared memory (fast, needs synchronisation) or message passing via pipes, FIFOs, message queues and sockets; signals and semaphores coordinate them.',
    blocks: [
      { compare: [
        { title: 'Shared memory', items: ['A region both processes map into their address space', 'Fast: no kernel copy after setup', 'Processes must synchronise (semaphores)', 'shmget(), shmat()'] },
        { title: 'Message passing', items: ['send() and receive() through the kernel', 'Slower, but no shared data to protect', 'Works across a network', 'Pipes, message queues, sockets'] },
      ] },
      { h: 'Linux IPC mechanisms' },
      { table: { head: ['Mechanism', 'Idea', 'Example'], rows: [
        ['Pipe', 'One-way byte stream between related processes', 'ls | wc -l'],
        ['Named pipe (FIFO)', 'A pipe with a file name, so unrelated processes can use it', 'mkfifo myfifo'],
        ['Message queue', 'List of messages with types, read in any order by type', 'msgsnd(), msgrcv()'],
        ['Shared memory', 'Common memory segment', 'shmget(), shmat()'],
        ['Semaphore', 'Counter used to synchronise access', 'semop()'],
        ['Signal', 'Asynchronous notification', 'kill(pid, SIGUSR1)'],
        ['Socket', 'Two-way endpoint, same machine or over a network', 'socket(), connect()'],
      ] } },
      { h: 'Message queues vs shared memory (asked)' },
      'Message queues are easier and safe (the kernel copies and orders messages) but each message costs system calls. Shared memory is the fastest but the programmer must prevent race conditions. **Mailboxes** (indirect communication) are message queues that several processes can send to and receive from; **pipes** suit a producer-consumer chain.',
      { h: 'Security challenges in IPC' },
      { ul: ['Unauthorised processes reading shared memory: set permissions (shmget mode bits).', 'Spoofed messages: authenticate the sender.', 'Denial of service by filling a queue: set limits.', 'Data leaks over sockets: encrypt with TLS.'] },
    ],
    terms: [['IPC', 'Inter-process communication: ways processes exchange data.'], ['Pipe', 'A one-way communication channel between processes.'], ['Socket', 'An endpoint for two-way communication, possibly over a network.']],
    exam: 'Explain the two IPC models with a diagram, list the Linux mechanisms with one example each, and compare message queues and shared memory.',
    revise: ['Shared memory vs message passing', 'Pipe, FIFO, message queue, shared memory, semaphore, signal, socket'],
  },

  'os.u2.rpc': {
    oneLine: 'A Remote Procedure Call lets a program call a function on another machine as if it were local; stubs pack the arguments into a message (marshalling), send it, and unpack the reply.',
    blocks: [
      { flow: ['Client calls the procedure', 'Client stub marshals parameters', 'Message sent over the network', 'Server stub unmarshals and calls the real procedure', 'Result marshalled and sent back', 'Client stub returns the result'] },
      { ul: [
        '**Stub**: a small proxy that hides the network; one on the client, one on the server.',
        '**Marshalling**: converting parameters to a standard, machine-independent format (e.g. **XDR**, External Data Representation), because machines may store data differently (big-endian vs little-endian).',
        '**Binding**: the client finds the server\'s port, either fixed or through a **matchmaker** (rendezvous) daemon.',
      ] },
    ],
    terms: [['RPC', 'Remote Procedure Call: calling a procedure on another computer.'], ['Stub', 'Client- or server-side proxy that packs and unpacks messages.'], ['Marshalling', 'Packing parameters into a transmittable, standard format.']],
    exam: 'Draw the RPC flow from client to server stubs and back, and explain stubs, marshalling (XDR) and binding.',
    revise: ['Call, stub, marshal, send, unmarshal, execute, reply'],
  },

  'os.u2.rpc-issues': {
    oneLine: 'RPC can fail in ways a local call cannot (lost messages, crashed servers), so it uses timeouts, retries and message ids for "exactly once" semantics, and must be secured with authentication and encryption.',
    blocks: [
      { h: 'Exception handling' },
      { table: { head: ['Problem', 'Handling'], rows: [
        ['Request lost', 'Client times out and resends'],
        ['Reply lost', 'Server keeps a history by message id, so a repeated request is not run twice'],
        ['Server crashes', 'Client gets an error after timeouts; may retry with another server'],
        ['Client crashes', 'Orphan computations on the server are cleaned up'],
      ] } },
      { compare: [
        { title: 'At most once', items: ['Each message has a timestamp/id', 'Server ignores duplicates', 'Call runs once or not at all'] },
        { title: 'Exactly once', items: ['At most once plus acknowledgements', 'Client resends until it gets an ACK', 'Call runs exactly once'] },
      ] },
      { h: 'Security issues' },
      { ul: ['**Authentication**: is the caller allowed? (e.g. Kerberos, secure RPC)', '**Integrity**: messages may be altered in transit; use checksums or signatures.', '**Confidentiality**: encrypt arguments and results (TLS).', '**Replay attacks**: use timestamps and nonces.'] },
    ],
    terms: [['At-most-once semantics', 'A remote call runs no more than once, even if requests are repeated.'], ['Exactly-once semantics', 'A remote call runs once, guaranteed by ACKs and duplicate detection.']],
    exam: 'List the RPC failure cases and how each is handled, explain at-most-once and exactly-once semantics, and the security issues.',
    revise: ['Timeouts, retries, message ids', 'At most once vs exactly once', 'Authenticate, encrypt, prevent replay'],
  },

  'os.u3.memory-view': {
    oneLine: 'Each process sees its own private, contiguous virtual address space (text, data, heap, stack), which the OS and MMU map onto scattered physical memory.',
    blocks: [
      { stack: ['Kernel space (not accessible in user mode)', 'Stack (grows down)', 'Memory-mapped region (shared libraries, mmap files)', 'Heap (grows up, via brk/sbrk or mmap)', 'BSS (uninitialised globals)', 'Data (initialised globals)', 'Text (code, read-only)'], label: 'Virtual address space of a Linux process, high addresses at the top' },
      { ul: ['Every process believes it starts at address 0 and owns all of memory.', 'The **MMU** translates each virtual address to a physical frame through the page table.', 'Pages not in RAM may be on disk; touching them causes a page fault.', 'On Linux, cat /proc/<pid>/maps shows a process\'s regions and their permissions.'] },
    ],
    terms: [['Virtual address space', 'The range of addresses a process can use, private to it.'], ['BSS', 'The segment for uninitialised global and static variables.']],
    exam: 'Draw the virtual address space with all segments and explain how it is mapped to physical memory.',
    revise: ['Text, data, BSS, heap, mmap region, stack, kernel'],
  },

  'os.u3.memory-requirements': {
    oneLine: 'A process needs memory for its code, globals, heap and stack; its total (virtual size) is usually much larger than what is actually in RAM (resident set).',
    blocks: [
      { table: { head: ['Need', 'Size known when?', 'Region'], rows: [
        ['Code', 'Compile time', 'Text'],
        ['Global variables', 'Compile time', 'Data / BSS'],
        ['Dynamic data (malloc, new)', 'Run time', 'Heap'],
        ['Function calls, local variables', 'Run time', 'Stack'],
        ['Shared libraries, mapped files', 'Load or run time', 'Memory-mapped region'],
      ] } },
      { compare: [
        { title: 'Virtual size (VSZ)', items: ['All memory the process has asked for', 'Includes pages never touched'] },
        { title: 'Resident set size (RSS)', items: ['Pages actually in RAM now', 'What really uses physical memory'] },
      ] },
      'Supporting **dynamic growth**: with contiguous allocation the OS may have to move the whole process to a bigger hole; with paging it just adds new pages anywhere.',
    ],
    terms: [['Resident set', 'The pages of a process currently in physical memory.'], ['Working set', 'The pages a process is actively using over a recent time window.']],
    exam: 'List what a process needs memory for, which region each goes in, and explain virtual size vs resident set.',
    revise: ['Static: text, data; dynamic: heap, stack', 'VSZ ≥ RSS'],
  },

  'os.u3.mm-syscalls': {
    oneLine: 'Linux programs manage memory with system calls: brk/sbrk grow the heap, mmap/munmap map and unmap regions, and mprotect changes a region\'s read, write and execute permissions.',
    blocks: [
      { table: { head: ['Call', 'What it does', 'Typical use'], rows: [
        ['sbrk(n) / brk(addr)', 'Move the end of the heap (program break) up or down', 'malloc() for small blocks'],
        ['mmap(addr, len, prot, flags, fd, off)', 'Map a file or anonymous memory into the address space', 'Large malloc, shared memory, reading files fast'],
        ['munmap(addr, len)', 'Remove a mapping', 'Free an mmap region'],
        ['mprotect(addr, len, prot)', 'Change permissions: PROT_READ, PROT_WRITE, PROT_EXEC, PROT_NONE', 'Guard pages, read-only data, JIT compilers'],
      ] } },
      { code: '#include <sys/mman.h>\nchar *p = mmap(NULL, 4096, PROT_READ | PROT_WRITE,\n               MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);\np[0] = \'A\';                       /* allowed */\nmprotect(p, 4096, PROT_READ);      /* now read-only */\n/* p[0] = \'B\';  would cause SIGSEGV */\nmunmap(p, 4096);' },
      { ul: ['These calls work on whole **pages** (usually 4 KB).', 'Writing to a page without write permission raises **SIGSEGV** (segmentation fault).', 'MAP_SHARED makes changes visible to other processes mapping the same file: a form of IPC.'] },
    ],
    terms: [['Program break', 'The current end of the heap, moved by brk/sbrk.'], ['mmap', 'System call that maps files or anonymous memory into a process.'], ['mprotect', 'System call that changes access permissions of memory pages.']],
    exam: 'Explain each call (sbrk, mmap, munmap, mprotect) with its purpose, and write the short mmap/mprotect example.',
    revise: ['sbrk = heap; mmap/munmap = mappings; mprotect = permissions'],
  },
}
