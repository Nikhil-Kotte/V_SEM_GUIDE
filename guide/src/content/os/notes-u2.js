// Operating Systems, Unit II: process management and IPC.
// Follows the Unit 2 slides and Silberschatz, Galvin & Gagne chapters 3, 5 (process, CPU scheduling).
export default {
  'os.u2.program-process': {
    oneLine: 'A program is a passive file of instructions on disk; a process is a program in execution, an active entity with a program counter, registers, a stack, a heap and an address space, and one program can give rise to many processes.',
    blocks: [
      { def: 'Program', text: 'A **passive entity**: a file containing a list of instructions stored on disk (an executable file). It does nothing by itself.' },
      { def: 'Process', text: 'A **program in execution**: an **active entity** with a **program counter** specifying the next instruction to execute and a set of associated resources (CPU registers, memory, open files). A program becomes a process when its executable file is **loaded into memory**.' },
      { h: 'Parts of a process' },
      { ul: ['**Text section**: the program code.', '**Program counter** and processor **registers**: the current activity.', '**Stack**: temporary data (function parameters, return addresses, local variables).', '**Data section**: global variables.', '**Heap**: memory dynamically allocated at run time.'] },
      { img: 'os-mem-layout' },
      { h: 'Differences between program and process' },
      { table: { head: ['Basis', 'Program', 'Process'], rows: [
        ['Nature', 'Passive (static)', 'Active (dynamic)'],
        ['Definition', 'Set of instructions stored in a file', 'An instance of a program being executed'],
        ['Lifetime', 'Exists until deleted from disk', 'Exists from creation to termination'],
        ['Resources', 'Needs only storage space', 'Needs CPU time, memory, I/O devices, files'],
        ['Location', 'Secondary storage (disk)', 'Main memory'],
        ['Control block', 'None', 'Has a PCB'],
        ['State', 'No state', 'New, ready, running, waiting, terminated'],
        ['Count', 'One program', 'Many processes can run the same program'],
      ] } },
      { example: 'Two users running the same browser, or one user opening three terminal windows, create **separate processes** of the **same program**: the text section is the same, but each has its own data, heap and stack.' },
      { h: 'Process management tasks of the OS (from the slides)' },
      { ul: ['Creating and deleting processes', 'Scheduling and switching between processes', 'Synchronisation and inter-process communication', 'Handling deadlocks'] },
    ],
    terms: [['Program counter', 'Register holding the address of the next instruction.'], ['Text section', 'The executable code of a process.'], ['Heap', 'Memory allocated dynamically while the process runs.']],
    exam: 'Define program and process, list the parts of a process with the memory layout diagram, and give a difference table of at least six points with an example.',
    revise: ['Program = passive file; process = program in execution', 'Text, data, heap, stack, PC, registers', 'One program, many processes'],
  },

  'os.u2.states': {
    oneLine: 'As a process executes it changes state: new, ready, running, waiting (blocked) and terminated; only one process runs on a CPU at a time, and transitions are caused by admission, dispatch, interrupts, I/O or event waits, their completion and exit.',
    blocks: [
      { def: 'Process state', text: 'The **current activity** of a process. As a process executes, it changes state; the state is stored in its PCB.' },
      { img: 'os-states' },
      { table: { head: ['State', 'Meaning'], rows: [['**New**', 'The process is being created.'], ['**Ready**', 'The process is waiting to be assigned to a processor (it has everything except the CPU).'], ['**Running**', 'Instructions are being executed.'], ['**Waiting (blocked)**', 'The process is waiting for some event to occur, such as an I/O completion or a signal.'], ['**Terminated**', 'The process has finished execution.']] } },
      { h: 'Transitions' },
      { table: { head: ['Transition', 'Cause'], rows: [['New → Ready', '**Admitted** by the long-term scheduler (resources allocated).'], ['Ready → Running', '**Scheduler dispatch**: the CPU scheduler picks this process.'], ['Running → Ready', '**Interrupt**: time slice expired or a higher-priority process arrived (preemption).'], ['Running → Waiting', '**I/O or event wait**: e.g. a read() from the keyboard or disk.'], ['Waiting → Ready', '**I/O or event completion**: the data arrived; the process can run again.'], ['Running → Terminated', '**Exit**: the process finished or was killed.']] } },
      'Only **one process can be running on any processor** at any instant; many may be ready or waiting.',
      { h: 'Worked example (Mid-1 question 1)' },
      { code: 'int main() {\n  int a;\n  scanf("%d", &a);   /* needs keyboard input */\n  exit(0);\n}' },
      { steps: ['The program is loaded and created: **New → Ready**, then dispatched: **Ready → Running**.', 'scanf() makes a **read system call** for keyboard input. The process cannot continue until input arrives: **Running → Waiting (blocked)**.', 'When the user types the number and presses Enter, the I/O completes (interrupt): **Waiting → Ready**.', 'The scheduler dispatches it again: **Ready → Running**; it stores the value in a.', 'exit(0): **Running → Terminated**.'] },
      { h: 'Suspended states (seven-state model)' },
      'When memory is short, the medium-term scheduler can **swap out** a process to disk: **ready-suspended** and **blocked-suspended** states are added. A suspended process is not in main memory until it is swapped back in.',
    ],
    terms: [['Dispatch', 'Giving the CPU to a ready process.'], ['Preemption', 'Taking the CPU away from a running process.'], ['Blocked', 'Another name for the waiting state.']],
    exam: 'Draw the five-state diagram with every transition labelled, define each state, and explain each transition with its cause. For the scanf() question, trace the states running → waiting → ready → running → terminated.',
    revise: ['New, ready, running, waiting, terminated', 'Running → waiting on I/O (scanf)', 'Running → ready on interrupt/time-out', 'One running process per CPU'],
  },

  'os.u2.pcb': {
    oneLine: 'The process control block (task control block) is the kernel data structure that represents a process, holding its state, PID, program counter, registers, scheduling, memory, accounting and I/O information, so the process can be stopped and later resumed exactly.',
    blocks: [
      { def: 'Process control block (PCB)', text: 'Each process is represented in the operating system by a **process control block**, also called a **task control block**: a data structure in the kernel that contains **all the information associated with a specific process**. It serves as the repository for anything that may vary from process to process.' },
      { img: 'os-pcb' },
      { table: { head: ['Field', 'What it holds'], rows: [
        ['**Process state**', 'New, ready, running, waiting, terminated.'],
        ['**Process number (PID)**', 'Unique identifier of the process (and its parent\'s PID).'],
        ['**Program counter**', 'Address of the next instruction to execute.'],
        ['**CPU registers**', 'Accumulators, index registers, stack pointer, general-purpose registers, condition codes; saved on an interrupt so the process can continue correctly later.'],
        ['**CPU-scheduling information**', 'Priority, pointers to scheduling queues, other scheduling parameters.'],
        ['**Memory-management information**', 'Base and limit registers, page tables or segment tables.'],
        ['**Accounting information**', 'CPU time used, real time used, time limits, account numbers.'],
        ['**I/O status information**', 'I/O devices allocated to the process, list of open files.'],
      ] } },
      { h: 'Why the PCB is important' },
      { ul: ['**Context switching**: on a switch, the state of the old process is saved into its PCB and the state of the new one is loaded from its PCB.', '**Scheduling**: the scheduler keeps PCBs in queues (ready queue, device queues) and reads their priority.', '**Resource tracking and protection**: memory limits and open files are known per process.', 'It lets a process be **interrupted and resumed** exactly where it left off.'] },
      'In Linux the PCB is the C structure **task_struct** (state, pid, parent, children, files, mm for memory, time slice …); all active processes are kept in a doubly linked list of task_structs.',
    ],
    terms: [['PCB / TCB', 'Kernel record describing one process.'], ['task_struct', 'Linux\'s PCB structure.'], ['Context', 'The process state saved in the PCB.']],
    exam: 'Define the PCB, draw it as a stacked block of fields, explain each field, and state its role in context switching and scheduling.',
    revise: ['State, PID, PC, registers, scheduling, memory, accounting, I/O', 'Saved/restored on context switch', 'Linux: task_struct'],
  },

  'os.u2.services': {
    oneLine: 'An operating system provides services to users (user interface, program execution, I/O, file manipulation, communication, error detection) and for efficient operation of the system itself (resource allocation, accounting, protection and security).',
    blocks: [
      { def: 'Operating-system services', text: 'The **functions an OS makes available to programs and to the users** of those programs. They make programming easier and help the system run efficiently.' },
      { h: 'Services helpful to the user' },
      { table: { head: ['Service', 'What it provides'], rows: [
        ['**User interface**', 'Command-line interface (CLI), graphical user interface (GUI), touch screen, or batch interface.'],
        ['**Program execution**', 'Load a program into memory, run it, and end its execution normally or abnormally (indicating errors).'],
        ['**I/O operations**', 'A running program may need I/O (files or devices); users cannot control devices directly, so the OS performs I/O for them.'],
        ['**File-system manipulation**', 'Read, write, create and delete files and directories; search; list file information; manage permissions.'],
        ['**Communications**', 'Exchange information between processes on the same computer or across a network, via **shared memory** or **message passing**.'],
        ['**Error detection**', 'Constantly aware of possible errors in the CPU, memory, I/O devices or user programs, and takes the right action (stop the program, retry, report).'],
      ] } },
      { h: 'Services for efficient operation of the system' },
      { table: { head: ['Service', 'What it provides'], rows: [
        ['**Resource allocation**', 'When multiple users or jobs run concurrently, resources (CPU cycles, memory, files, devices) must be allocated to each.'],
        ['**Accounting / logging**', 'Keep track of which users use how much and what kinds of resources (for billing or statistics).'],
        ['**Protection and security**', 'Protection: all access to system resources is controlled. Security: users authenticate (passwords); the system is defended against outsiders.'],
      ] } },
      { flow: ['User and other system programs', 'User interfaces (GUI, CLI, batch, touch)', 'System calls', 'Services (program execution, I/O, files, communication, resource allocation, accounting, error detection, protection)', 'Operating system', 'Hardware'], label: 'A view of OS services' },
      { tip: 'Functions vs services: functions are what the OS manages internally (process, memory, file, I/O management); services are what it offers to users and programs (UI, execution, I/O, file manipulation, communication, error detection, resource allocation, accounting, protection). Mid-1 Q4(a) asked for both.' },
    ],
    terms: [['CLI', 'Command-line interface.'], ['GUI', 'Graphical user interface.'], ['Accounting', 'Recording resource usage per user.']],
    exam: 'Define OS services and list them in two groups: for users (UI, program execution, I/O, file manipulation, communications, error detection) and for the system (resource allocation, accounting, protection and security), explaining each in one or two lines. Draw the services diagram.',
    revise: ['User: UI, execution, I/O, files, communication, error detection', 'System: resource allocation, accounting, protection/security', 'Accessed through system calls'],
  },

  'os.u2.syscalls': {
    oneLine: 'A system call is the programming interface to the services of the OS: a user program traps into the kernel to request a service; fork creates a child process, exec replaces its program, wait makes a parent wait for a child, exit ends a process, and getpid/getppid return process IDs.',
    blocks: [
      { def: 'System call', text: 'A **programmatic way in which a program requests a service from the kernel** of the operating system. It is the interface between a running process and the OS, usually reached through an **API** (e.g. the POSIX API in the C library) rather than called directly.' },
      { h: 'Purpose of system calls' },
      { ul: ['User programs run in **user mode** and cannot access hardware or kernel data directly; a system call is the **controlled entry point** into the kernel.', 'They let programs **use OS services**: create processes, read and write files, use devices, allocate memory, communicate.', 'They provide **protection**: the kernel checks every request before doing it.'] },
      { h: 'How a system call works' },
      { img: 'os-syscall' },
      { steps: ['The program calls a library function (e.g. open()) in the API.', 'The library puts the **system call number** in a register and the parameters in registers, a memory block, or on the stack.', 'It executes a **trap** (software interrupt) instruction, switching to **kernel mode**.', 'The kernel uses the number to index the **system call table** and runs the handler.', 'The result (or an error code) is returned, and the CPU switches back to **user mode**.'] },
      'Three ways to pass parameters: in **registers**; in a **block (table) in memory** whose address is passed in a register (Linux, Solaris); or **pushed onto the stack** and popped by the OS.',
      { h: 'Types of system calls' },
      { table: { head: ['Type', 'Examples (UNIX)'], rows: [['**Process control**', 'fork(), exec(), exit(), wait(), kill()'], ['**File management**', 'open(), read(), write(), close(), lseek()'], ['**Device management**', 'ioctl(), read(), write()'], ['**Information maintenance**', 'getpid(), alarm(), sleep(), time()'], ['**Communication**', 'pipe(), shmget(), mmap(), socket()'], ['**Protection**', 'chmod(), umask(), chown()']] } },
      { h: 'Process system calls in detail' },
      { table: { head: ['Call', 'What it does', 'Returns'], rows: [
        ['**fork()**', 'Creates a **new child process** that is a copy of the parent (code, data, open files); both continue after fork.', '0 in the child; the child\'s PID in the parent; −1 on failure'],
        ['**exec()** family (execl, execv, execvp …)', '**Replaces** the calling process\'s memory image with a **new program**; the PID stays the same.', 'Does not return on success; −1 on failure'],
        ['**wait()**', 'The parent **waits until a child terminates** and collects its exit status (removing the zombie).', 'PID of the terminated child'],
        ['**exit()**', '**Terminates** the calling process, releases its resources, and passes a status to the parent.', 'Does not return'],
        ['**getpid()**', 'Returns the **process ID** of the calling process.', 'PID'],
        ['**getppid()**', 'Returns the **parent\'s process ID**.', 'PPID'],
      ] } },
      { img: 'os-fork' },
      { code: `#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>
int main() {
    pid_t pid = fork();                 /* create a child */
    if (pid < 0) { perror("fork"); return 1; }
    if (pid == 0) {                     /* child */
        printf("child %d, parent %d\\n", getpid(), getppid());
        execlp("ls", "ls", "-l", NULL); /* replace with ls */
    } else {                            /* parent */
        wait(NULL);                     /* wait for the child */
        printf("child finished\\n");
    }
    return 0;
}` },
      { tip: 'Counting processes: n fork() calls in sequence create **2ⁿ** processes in total (2ⁿ − 1 children).' },
    ],
    terms: [['API', 'Application programming interface: library functions that wrap system calls.'], ['Trap', 'Software interrupt that enters kernel mode.'], ['System call table', 'Kernel table mapping call numbers to handlers.']],
    exam: 'Define a system call and its purpose, draw how open() is handled (trap, table, kernel, return), list the types with examples, and explain fork, exec, wait, exit, getpid and getppid with a C program. Mid-1 asked "purpose of system calls and how they provide OS services".',
    revise: ['Trap into kernel mode via the system call table', 'Parameters: registers, memory block, stack', 'fork: child gets 0, parent gets PID', 'exec replaces the program; wait collects the child'],
  },

  'os.u2.syscalls-vs-programs': {
    oneLine: 'System calls are the kernel\'s low-level programming interface used inside programs, while system programs (utilities) are ready-made applications shipped with the OS, such as file managers, compilers, editors and shells, that users run and that themselves use system calls.',
    blocks: [
      { def: 'System call', text: 'A **request from a program to the kernel** for a service, executed in kernel mode (e.g. read(), fork()).' },
      { def: 'System program (system utility)', text: 'A program shipped with the OS that provides a **convenient environment for program development and execution**. Users run them like applications; internally they make system calls.' },
      { h: 'Categories of system programs' },
      { table: { head: ['Category', 'Examples'], rows: [['**File management**', 'Create, delete, copy, rename, list files: cp, mv, rm, ls, File Explorer'], ['**Status information**', 'Date, time, free memory and disk, users, performance: date, top, df, Task Manager'], ['**File modification**', 'Text editors: vi, nano, Notepad; search tools: grep'], ['**Programming-language support**', 'Compilers, assemblers, debuggers, interpreters: gcc, gdb, python'], ['**Program loading and execution**', 'Loaders, linkers, dynamic linkers'], ['**Communications**', 'Connections between processes, users and computers: ssh, ftp, mail, browsers'], ['**Background services (daemons)**', 'Services that run all the time: network daemons, print spooler, cron']] } },
      { h: 'Differences' },
      { table: { head: ['Basis', 'System call', 'System program'], rows: [
        ['What it is', 'An interface (entry point) into the kernel', 'An executable program'],
        ['Level', 'Low level', 'High level'],
        ['Runs in', 'Kernel mode', 'User mode (calls into the kernel when needed)'],
        ['Used by', 'Programmers, inside programs', 'End users and programmers'],
        ['Invoked by', 'A function call in a program (API)', 'Typing a command or clicking'],
        ['Purpose', 'Request a single OS service', 'Perform a complete task'],
        ['Example', 'open(), read(), fork()', 'ls, cp, gcc, a file manager'],
      ] } },
      { example: 'The cp command (a system program) copies a file by calling open() on the source and destination, then read() and write() in a loop, then close(): it makes many system calls to do one user-level task.' },
    ],
    terms: [['Daemon', 'A background system program that runs continuously.'], ['Utility', 'Another name for a system program.']],
    exam: 'Define both, list the categories of system programs with examples, and give a difference table; illustrate with cp using open/read/write/close.',
    revise: ['System call = kernel interface; system program = utility application', 'System programs use system calls', 'cp → open, read, write, close'],
  },

  'os.u2.context-switch': {
    oneLine: 'Process scheduling selects which process runs next using long-term, short-term and medium-term schedulers and their queues; a context switch saves the state of the running process into its PCB and loads the saved state of the next, and is pure overhead.',
    blocks: [
      { def: 'Process scheduling', text: 'The activity of the OS that **selects an available process for execution on the CPU** so as to keep the CPU busy (multiprogramming) and to switch often enough that users can interact (time-sharing).' },
      { h: 'Scheduling queues' },
      { ul: ['**Job queue**: all processes in the system.', '**Ready queue**: processes in main memory, ready and waiting to execute (a linked list of PCBs).', '**Device (wait) queues**: processes waiting for a particular I/O device.'] },
      { img: 'os-queues' },
      { h: 'Schedulers' },
      { table: { head: ['Scheduler', 'Also called', 'Job', 'Frequency'], rows: [
        ['**Long-term**', 'Job scheduler', 'Selects processes from the disk pool and **loads them into memory** (ready queue); controls the **degree of multiprogramming**; should pick a good mix of I/O-bound and CPU-bound jobs', 'Infrequent (minutes)'],
        ['**Short-term**', 'CPU scheduler', 'Selects a process from the **ready queue** and **allocates the CPU**', 'Very frequent (every ~100 ms), so it must be fast'],
        ['**Medium-term**', 'Swapper', 'Temporarily **removes processes from memory (swapping out)** to reduce multiprogramming, and brings them back later', 'In between'],
      ] } },
      'An **I/O-bound** process spends more time doing I/O than computation; a **CPU-bound** process spends most of its time computing.',
      { h: 'Context switching' },
      { def: 'Context switch', text: 'Switching the CPU to another process by **saving the state (context) of the current process** in its PCB and **restoring the saved state of the new process** from its PCB.' },
      { img: 'os-context-switch' },
      { steps: ['An interrupt or system call occurs while P0 is running.', 'The OS saves P0\'s context (program counter, registers, state, memory information) into **PCB0** and moves P0 to the ready or a waiting queue.', 'The scheduler selects P1.', 'The OS reloads P1\'s context from **PCB1** (and switches the memory map).', 'P1 resumes exactly where it left off.'] },
      { ul: ['Context-switch time is **pure overhead**: the system does no useful work while switching.', 'Its speed depends on hardware: memory speed, number of registers, special instructions (some CPUs have several register sets, so a switch just changes a pointer). Typically a few microseconds.', 'Causes: time-slice expiry, an interrupt, a system call that blocks (I/O), a higher-priority process becoming ready.'] },
      { analogy: 'Like bookmarking your place in one book (saving into the PCB) before picking up another; when you return, the bookmark tells you exactly where to continue.' },
    ],
    terms: [['Ready queue', 'Processes in memory waiting for the CPU.'], ['Degree of multiprogramming', 'Number of processes in memory.'], ['Dispatcher', 'Module that gives the CPU to the selected process (switches context, user mode, jumps).'], ['Dispatch latency', 'Time taken by the dispatcher to stop one process and start another.']],
    exam: 'Define process scheduling, describe the queues with the queueing diagram, compare long-, short- and medium-term schedulers in a table, then define a context switch, draw P0 → P1 → P0 with PCB saves and loads, and state that it is overhead.',
    revise: ['Job, ready, device queues', 'Long-term: degree of multiprogramming; short-term: CPU; medium-term: swapping', 'Context switch = save to PCB, load from PCB; overhead'],
  },

  'os.u2.criteria': {
    oneLine: 'CPU scheduling algorithms are compared on CPU utilisation and throughput (maximise) and on turnaround, waiting and response time (minimise); turnaround = completion − arrival and waiting = turnaround − burst.',
    blocks: [
      { def: 'Scheduling criteria', text: 'The measures used to **compare CPU-scheduling algorithms** and choose the best one for a given system.' },
      { table: { head: ['Criterion', 'Meaning', 'Goal'], rows: [
        ['**CPU utilisation**', 'Percentage of time the CPU is busy (40% lightly loaded to 90% heavily loaded)', 'Maximise'],
        ['**Throughput**', 'Number of processes completed per time unit', 'Maximise'],
        ['**Turnaround time**', 'Time from submission of a process to its completion: waiting to get into memory + waiting in the ready queue + executing + doing I/O', 'Minimise'],
        ['**Waiting time**', 'Total time a process spends **waiting in the ready queue**', 'Minimise'],
        ['**Response time**', 'Time from submission of a request until the **first response** is produced (not the whole output); important for interactive systems', 'Minimise'],
      ] } },
      { h: 'Formulas used in numericals' },
      { formula: 'Turnaround time (TAT) = Completion time − Arrival time' },
      { formula: 'Waiting time (WT) = Turnaround time − Burst time' },
      { formula: 'Response time (RT) = Time of first CPU allocation − Arrival time' },
      { formula: 'Average WT = (sum of all WT) / n        Throughput = n / total time' },
      { example: 'P1 arrives at 0 with burst 5 and completes at 12. TAT = 12 − 0 = 12. WT = 12 − 5 = 7. If it first got the CPU at time 0, RT = 0.' },
      { h: 'Other terms' },
      { ul: ['**CPU burst / I/O burst**: process execution alternates between CPU execution and I/O wait (the CPU–I/O burst cycle).', '**Preemptive scheduling**: the CPU can be taken away from a running process (on a timer interrupt or a higher-priority arrival). **Non-preemptive**: once a process has the CPU it keeps it until it terminates or blocks.', 'Scheduling decisions happen when a process: (1) switches from running to waiting, (2) running to ready, (3) waiting to ready, (4) terminates. Only 1 and 4: non-preemptive.', '**Fairness** and avoiding **starvation** are also important.'] },
    ],
    terms: [['Burst time', 'CPU time a process needs.'], ['Turnaround time', 'Completion − arrival.'], ['Waiting time', 'Time spent in the ready queue.'], ['Response time', 'Time until the first response.']],
    exam: 'Define each criterion with its goal (maximise or minimise), write the TAT, WT and RT formulas, and explain preemptive vs non-preemptive scheduling.',
    revise: ['Maximise utilisation and throughput', 'Minimise turnaround, waiting, response', 'TAT = CT − AT; WT = TAT − BT'],
  },

  'os.u2.algorithms': {
    oneLine: 'CPU scheduling algorithms decide which ready process gets the CPU: FCFS (arrival order), SJF and its preemptive form SRTF (shortest burst first, optimal waiting time), priority (highest priority first, with aging against starvation), round robin (time slices) and multilevel (feedback) queues.',
    blocks: [
      { def: 'CPU scheduling algorithm', text: 'The rule the **short-term scheduler** uses to decide **which process in the ready queue is allocated the CPU** next.' },
      { h: '1. First-come, first-served (FCFS)' },
      'The process that requests the CPU first gets it first; implemented with a **FIFO queue**. **Non-preemptive**.',
      { img: 'os-gantt-fcfs' },
      'Waiting times: P1 = 0, P2 = 24, P3 = 27; average = **17 ms**. If the order were P2, P3, P1, the average would be (0 + 3 + 6)/3 = 3 ms. Problem: the **convoy effect**: short processes wait behind one long process. Simple, but average waiting time is often long.',
      { h: '2. Shortest-job-first (SJF)' },
      'Allocates the CPU to the process with the **smallest next CPU burst**; ties are broken by FCFS. It is **provably optimal**: it gives the minimum average waiting time for a given set of processes. Difficulty: the length of the next burst is not known; it is **predicted** by exponential averaging: τₙ₊₁ = α tₙ + (1 − α) τₙ.',
      { example: 'P1 = 6, P2 = 8, P3 = 7, P4 = 3, all arriving at 0. SJF order: P4 (0–3), P1 (3–9), P3 (9–16), P2 (16–24). Waiting: P1 3, P2 16, P3 9, P4 0 → average **7 ms** (FCFS would give 10.25).' },
      { h: '3. Shortest-remaining-time-first (SRTF): preemptive SJF' },
      'When a new process arrives with a burst **shorter than the remaining time** of the running process, the running process is **preempted**.',
      { h: 'Worked example (Mid-1 question 6)' },
      { table: { head: ['Process', 'Burst', 'Arrival'], rows: [['P1', '5', '0'], ['P2', '3', '1'], ['P3', '3', '2'], ['P4', '1', '4']] } },
      { img: 'os-gantt-sjf-mid' },
      { img: 'os-gantt-srtf-mid' },
      { table: { head: ['Process', 'SJF TAT', 'SJF WT', 'SRTF TAT', 'SRTF WT'], rows: [['P1', '5', '0', '12', '7'], ['P2', '8', '5', '3', '0'], ['P3', '10', '7', '6', '3'], ['P4', '2', '1', '1', '0'], ['**Average**', '**6.25**', '**3.25**', '**5.5**', '**2.5**']] } },
      { h: '4. Priority scheduling' },
      'Each process has a **priority** number (here a smaller number = higher priority); the CPU goes to the highest-priority process. Can be preemptive or non-preemptive (SJF is priority scheduling with priority = predicted burst). Problem: **starvation** (indefinite blocking) of low-priority processes. Solution: **aging**, gradually increasing the priority of processes that wait a long time.',
      { h: '5. Round robin (RR)' },
      'Designed for **time-sharing**: like FCFS but **preemptive**. Each process gets a small unit of CPU time, the **time quantum** (10–100 ms); when it expires the process is preempted and put at the **tail of the ready queue**. With n processes and quantum q, no process waits more than (n − 1) q.',
      { img: 'os-gantt-rr' },
      'With q = 4 on bursts 24, 3, 3: waiting P1 = 6, P2 = 4, P3 = 7 → average **5.66 ms**. If q is very large RR becomes FCFS; if q is very small, context-switch overhead dominates. Rule of thumb: 80% of CPU bursts should be shorter than q.',
      { h: '6. Multilevel queue and multilevel feedback queue' },
      { img: 'os-multilevel' },
      { ul: ['**Multilevel queue**: the ready queue is split into separate queues (e.g. foreground/interactive and background/batch), each with its own algorithm (RR for foreground, FCFS for background), with fixed-priority or time-slice scheduling between queues. A process stays in its queue.', '**Multilevel feedback queue**: processes can **move between queues** based on their behaviour: a process that uses too much CPU moves to a lower-priority queue; one that waits too long moves up (aging). The most general, and most complex, scheme.'] },
      { h: 'Comparison' },
      { table: { head: ['Algorithm', 'Preemptive?', 'Advantage', 'Problem'], rows: [['FCFS', 'No', 'Simple, fair in order', 'Convoy effect, long average wait'], ['SJF', 'No', 'Minimum average waiting time', 'Burst unknown; starvation of long jobs'], ['SRTF', 'Yes', 'Even lower average wait', 'Overhead; starvation'], ['Priority', 'Either', 'Important work first', 'Starvation (fix: aging)'], ['Round robin', 'Yes', 'Good response; fair; time-sharing', 'Higher turnaround; depends on quantum'], ['Multilevel feedback', 'Yes', 'Adapts to behaviour', 'Complex to tune']] } },
      { h: 'Design question (Mid-1 question 7a): 128 static priority levels' },
      'Keep **an array of 128 FIFO queues**, one per priority level, plus a **128-bit bitmap** where bit i is set if queue i is non-empty. To pick the next process, find the **first set bit** (lowest number = highest priority) with a find-first-set instruction and take the head of that queue: **O(1)**. Insertion appends to the tail of the queue for the process\'s fixed priority (FCFS within a level): O(1). Because priorities never change, no re-sorting is needed. (This is the idea of Linux\'s O(1) scheduler.)',
    ],
    terms: [['Convoy effect', 'Short jobs waiting behind a long job in FCFS.'], ['Time quantum', 'The CPU time slice in round robin.'], ['Starvation', 'A process waiting indefinitely.'], ['Aging', 'Raising the priority of long-waiting processes.']],
    exam: 'For numericals: draw a Gantt chart per algorithm, then a table of completion, turnaround and waiting time with averages. For theory: define each algorithm, preemptive or not, advantages, disadvantages and an example.',
    revise: ['FCFS: convoy effect', 'SJF optimal average wait; SRTF preemptive', 'Priority: starvation → aging', 'RR: quantum q; large q → FCFS', 'Multilevel feedback: queues with movement'],
  },

  'os.u2.linux-process': {
    oneLine: 'Linux manages processes as task_structs organised in a tree from init/systemd (PID 1); processes are created with fork() or clone() and exec(), ended with exit(), reaped by the parent with wait(), and controlled with signals and commands like ps, top, kill and nice; a dead child not yet reaped is a zombie and a child whose parent died is an orphan.',
    blocks: [
      { def: 'Process management in UNIX/Linux', text: 'The set of mechanisms by which UNIX/Linux **creates, schedules, controls and terminates processes**, each identified by a **PID** and represented by a **task_struct**.' },
      { h: 'The process tree' },
      'Every process except the first is created by another process (its **parent**). The first user process is **init / systemd (PID 1)**, started by the kernel at boot; all others descend from it. pstree shows the tree.',
      { tree: { root: 'systemd (PID 1)', kids: ['sshd → bash → vim', 'login → bash → ls', 'cron', 'NetworkManager'] } },
      { h: 'Creating and ending processes' },
      { ul: ['**fork()**: duplicate the caller; **copy-on-write** makes this cheap (pages are copied only when written).', '**exec()**: load a new program into the process.', '**clone()**: Linux call that creates a process or a **thread**, sharing chosen resources.', '**exit()**: terminate, returning a status; **wait() / waitpid()**: the parent collects the child\'s status.'] },
      { h: 'Zombie and orphan processes (Mid-1 question 2)' },
      { def: 'Zombie process', text: 'A process that has **terminated (called exit) but whose parent has not yet called wait()** to read its exit status. Its resources are freed, but its **entry in the process table remains**. ps shows it with state Z (defunct).' },
      { ul: ['**How it enters**: the child exits before the parent calls wait().', '**How it comes out**: when the **parent calls wait()/waitpid()**, the entry is removed (reaped). If the parent terminates without waiting, the zombie becomes an **orphan**, is **adopted by init/systemd**, which periodically calls wait() and removes it. Killing the zombie itself has no effect (it is already dead); one can kill or fix the parent.', 'Many zombies waste process-table slots and can stop new processes being created.'] },
      { def: 'Orphan process', text: 'A process whose **parent has terminated** while it is still running. It is adopted by init/systemd (PID 1).' },
      { h: 'Process states in Linux (ps STAT column)' },
      { table: { head: ['Code', 'State'], rows: [['R', 'Running or runnable (on the run queue)'], ['S', 'Interruptible sleep (waiting for an event)'], ['D', 'Uninterruptible sleep (usually I/O)'], ['T', 'Stopped (by a signal such as SIGSTOP or by a debugger)'], ['Z', 'Zombie (defunct)']] } },
      { h: 'Commands for managing processes' },
      { table: { head: ['Command', 'Use'], rows: [['ps, ps -ef, ps aux', 'List processes'], ['top / htop', 'Live view of processes and CPU/memory use'], ['pstree', 'Show the process tree'], ['kill PID, kill -9 PID', 'Send a signal (SIGTERM, SIGKILL)'], ['nice, renice', 'Start a process with / change its priority (nice value −20 to 19)'], ['jobs, fg, bg, &', 'Job control: run in background, bring to foreground'], ['nohup', 'Keep a process running after logout']] } },
      'Scheduling in Linux: the **Completely Fair Scheduler (CFS)** gives each runnable task a fair share of CPU using virtual runtime; real-time tasks use SCHED_FIFO or SCHED_RR.',
    ],
    terms: [['PID', 'Process identifier.'], ['Zombie', 'Terminated process not yet reaped by its parent.'], ['Orphan', 'Running process whose parent has died; adopted by PID 1.'], ['Copy-on-write', 'Pages shared after fork and copied only when written.'], ['CFS', 'Linux\'s Completely Fair Scheduler.']],
    exam: 'Explain Linux process management: process tree from PID 1, fork/exec/exit/wait (and clone), zombie and orphan processes (how they arise and how they are cleaned up), process states, and management commands.',
    revise: ['PID 1 = init/systemd', 'Zombie: exited, parent has not called wait()', 'Orphan: parent died; adopted by PID 1', 'ps, top, kill, nice'],
  },

  'os.u2.ipc': {
    oneLine: 'Inter-process communication lets cooperating processes exchange data, through shared memory or message passing; Linux provides pipes, named pipes (FIFOs), message queues, shared memory, semaphores, signals and sockets.',
    blocks: [
      { def: 'Inter-process communication (IPC)', text: 'A mechanism that allows **cooperating processes to exchange data and information**. Processes cooperate for **information sharing**, **computation speed-up** (parallel subtasks), **modularity** and **convenience**.' },
      { h: 'Two models of IPC' },
      { img: 'os-ipc' },
      { compare: [
        { title: 'Shared memory', items: ['A region of memory is shared by the processes; they read and write it directly', 'System calls only to set up the region', '**Fast**: no kernel involvement for each exchange', 'Processes must **synchronise** themselves (e.g. producer-consumer with a bounded buffer)'] },
        { title: 'Message passing', items: ['Processes exchange messages with **send(message)** and **receive(message)** through the kernel', 'Easier to implement; no conflicts', 'Useful for small amounts of data and **distributed systems**', 'Slower: a system call per message'] },
      ] },
      { h: 'Message-passing design issues' },
      { ul: ['**Naming: direct communication**: processes name each other explicitly: send(P, message), receive(Q, message); a link is set up automatically between exactly one pair.', '**Indirect communication**: messages go to **mailboxes (ports)**: send(A, message), receive(A, message); a mailbox can be shared by several processes.', '**Synchronisation**: send and receive can be **blocking (synchronous)** or **non-blocking (asynchronous)**; if both block, it is a **rendezvous**.', '**Buffering**: the queue of messages has **zero capacity** (sender blocks until received), **bounded capacity** (n messages; sender blocks when full) or **unbounded capacity** (sender never blocks).'] },
      { h: 'Linux IPC mechanisms' },
      { table: { head: ['Mechanism', 'How it works', 'Example'], rows: [
        ['**Pipe**', 'One-way (half-duplex) byte stream between **related** processes (parent and child); created with pipe(fd)', 'ls | grep txt'],
        ['**Named pipe (FIFO)**', 'Like a pipe but has a **name in the file system**, so **unrelated** processes can use it', 'mkfifo mypipe'],
        ['**Message queue**', 'Processes send typed messages to a kernel queue that others read (msgsnd, msgrcv)', 'A logger process reading requests'],
        ['**Shared memory**', '**Fastest**: processes map the same memory region (shmget, shmat, or mmap)', 'Video frames shared between processes'],
        ['**Semaphore**', 'Synchronisation counter controlling access to shared resources (semget, semop)', 'Only one process uses the printer at a time'],
        ['**Signal**', 'Software interrupt notifying a process of an event', 'SIGINT (Ctrl+C), SIGKILL, SIGSTOP, SIGCONT'],
        ['**Socket**', 'Communication endpoint between processes on the **same or different machines** (network)', 'Web browser ↔ web server'],
      ] } },
      { code: `int fd[2];
pipe(fd);                       /* fd[0] = read end, fd[1] = write end */
if (fork() == 0) {              /* child reads */
    close(fd[1]);
    char buf[32];
    read(fd[0], buf, sizeof buf);
} else {                        /* parent writes */
    close(fd[0]);
    write(fd[1], "hello", 6);
}` },
    ],
    terms: [['Cooperating process', 'A process that can affect or be affected by others.'], ['Mailbox / port', 'A kernel object used for indirect messaging.'], ['Rendezvous', 'Blocking send and blocking receive together.'], ['FIFO', 'A named pipe.']],
    exam: 'Define IPC and why processes cooperate, compare shared memory and message passing with the diagram, explain naming, synchronisation and buffering, and list the Linux IPC mechanisms (pipe, FIFO, message queue, shared memory, semaphore, signal, socket) with one line each.',
    revise: ['Shared memory (fast) vs message passing (simple)', 'Direct vs indirect (mailbox); blocking vs non-blocking', 'Zero, bounded, unbounded buffers', 'Pipe, FIFO, message queue, shared memory, semaphore, signal, socket'],
  },

  'os.u2.rpc': {
    oneLine: 'A remote procedure call lets a program call a procedure on another computer as if it were local: a client stub marshals the parameters into a message, the RPC runtime sends it, the server stub unmarshals it and calls the procedure, and the result travels back the same way.',
    blocks: [
      { def: 'Remote procedure call (RPC)', text: 'A communication mechanism that allows a program to **call a procedure (function) located on another computer as if it were a local function**, without having to understand the network details. It follows the **client-server** model.' },
      { img: 'os-rpc' },
      { h: 'Components' },
      { ul: ['**Client**: the program that calls the remote procedure.', '**Client stub**: a local proxy for the remote procedure; it **marshals** (packs) the parameters into a message and sends it.', '**RPC runtime**: handles the transmission over the network, retransmissions and acknowledgements.', '**Server stub (skeleton)**: receives the message, **unmarshals** (unpacks) the parameters, and calls the real procedure.', '**Server**: hosts the actual implementation.'] },
      { h: 'Execution of RPC: step by step' },
      { steps: ['The client calls the client stub as a normal local procedure call.', 'The client stub marshals the procedure ID and parameters into a message (using a machine-independent format such as **XDR**, external data representation, to handle different byte orders).', 'The RPC runtime sends the message to the server machine (to a **port** bound to the service; found by a fixed port or a **matchmaker/portmapper**).', 'The server stub receives it, unmarshals the parameters and calls the procedure.', 'The procedure executes and returns the result to the server stub.', 'The server stub marshals the result and sends it back.', 'The client stub unmarshals the result and returns it to the client, which continues as if it had made a local call.'] },
      { h: 'Types of RPC' },
      { ul: ['**Synchronous RPC**: the client **blocks** until the reply arrives (the usual case).', '**Asynchronous RPC**: the client continues without waiting for the result.', '**Callback RPC**: the server calls back the client during processing.', '**Broadcast RPC**: the request goes to all servers on the network.', '**Batch-mode RPC**: requests are queued and sent together.'] },
      { compare: [
        { title: 'Advantages', items: ['Hides network details: easy to program', 'Same model as local calls', 'Good for client-server and distributed systems'] },
        { title: 'Disadvantages', items: ['No shared memory: pointers cannot be passed directly', 'Network failures and delays', 'Slower than local calls; security issues'] },
      ] },
      'Examples: Sun ONC RPC (NFS uses it), gRPC, Java RMI, Microsoft DCOM.',
    ],
    terms: [['Stub', 'Local proxy that marshals and unmarshals parameters.'], ['Marshalling', 'Packing parameters into a message.'], ['XDR', 'Machine-independent data representation.'], ['Portmapper', 'Service that tells clients which port an RPC service uses.']],
    exam: 'Define RPC, draw the client/stub/runtime/server diagram, explain the execution steps, list the types, and give advantages and disadvantages.',
    revise: ['Call a remote procedure like a local one', 'Client stub marshals; server stub unmarshals', 'XDR for data; portmapper for ports', 'Synchronous, asynchronous, callback, broadcast, batch'],
  },

  'os.u2.rpc-issues': {
    oneLine: 'RPC must cope with failures a local call never sees (lost requests or replies, server or client crashes, timeouts) using retransmission, duplicate detection and call semantics (at-least-once, at-most-once, exactly-once), and must be secured against eavesdropping, tampering, spoofing and denial of service.',
    blocks: [
      { def: 'RPC exception handling', text: 'Detecting and dealing with **errors and failures that occur during a remote call**, because the client and server are on different machines connected by an unreliable network.' },
      { h: 'Common RPC exceptions' },
      { table: { head: ['Exception', 'What happens'], rows: [['**Lost request message**', 'The server never gets the call'], ['**Lost reply message**', 'The server executed the call, but the client never gets the result'], ['**Server crash**', 'Before or after executing the procedure; the client cannot tell which'], ['**Client crash**', 'The server\'s work becomes an **orphan computation** with no one to receive the result'], ['**Timeout**', 'No reply within the expected time (slow network or server)'], ['**Network failure**', 'Server unreachable'], ['**Invalid parameters / binding failure**', 'Wrong procedure, version or arguments; server not found']] } },
      { h: 'Exception-handling methods' },
      { ul: ['**Timeouts and retransmission**: the client resends the request if no reply arrives in time.', '**Sequence numbers / timestamps**: each request is numbered; the server keeps a history and **detects duplicates**, replying from its saved result instead of executing twice.', '**Acknowledgements (ACK)**: the client acknowledges replies so the server can discard saved results.', '**Exception reporting**: the stub returns an error code or raises an exception to the caller.', '**Orphan handling**: extermination (kill orphans after a client reboot), expiration (each call gets a time limit).'] },
      { h: 'Call semantics' },
      { table: { head: ['Semantics', 'Meaning', 'How'], rows: [['**Maybe**', 'The call may or may not run; no retries', 'Send once'], ['**At-least-once**', 'Runs one or more times', 'Retransmit until a reply; suitable for **idempotent** operations (reading a value)'], ['**At-most-once**', 'Runs zero or one time', 'Retransmit, but the server filters duplicates using timestamps/sequence numbers'], ['**Exactly-once**', 'Runs exactly once', 'Ideal; at-most-once plus acknowledgements and stable storage; hard to guarantee']] } },
      { h: 'Security issues in RPC' },
      { table: { head: ['Threat', 'Defence'], rows: [['**Eavesdropping** (reading messages on the network)', 'Encryption (TLS)'], ['**Message tampering / modification**', 'Integrity checks: MACs, digital signatures'], ['**Spoofing / impersonation** (fake client or server)', 'Authentication (Kerberos, certificates, passwords)'], ['**Replay attacks** (resending old valid messages)', 'Nonces, timestamps, sequence numbers'], ['**Unauthorised access**', 'Authorisation and access-control lists'], ['**Denial of service** (flooding the server)', 'Rate limiting, firewalls']] } },
    ],
    terms: [['Idempotent', 'An operation that gives the same result if repeated.'], ['Orphan computation', 'Server work for a client that has crashed.'], ['At-most-once', 'The server runs a call no more than once.'], ['Replay attack', 'Resending captured valid messages.']],
    exam: 'List the RPC exceptions, explain the handling methods (timeouts, retransmission, sequence numbers, ACKs), describe the call semantics (at-least-once, at-most-once, exactly-once), and tabulate the security threats with defences.',
    revise: ['Lost request/reply, server/client crash, timeout', 'Retransmit + duplicate detection', 'At-least-once vs at-most-once vs exactly-once', 'Eavesdropping, tampering, spoofing, replay, DoS'],
  },
}
