// Operating Systems: a 2-mark question bank for each unit, with full-mark answers.
//   from:  the PYQ this question was asked as (its papers and class tests are shown and drive the order:
//          class-test questions first, then the most-asked); omitted for likely questions.
//   q:     the question as it would be set for 2 marks.
//   a:     the answer: a definition plus the points an examiner looks for (content blocks).
// Answers for questions linked with `from` also serve as that PYQ's model answer when it has none.
export default [
  {
    unit: 'I',
    items: [
      { id: 'o1-why-os', from: 'os-why-os', q: 'Why do we require operating systems?', a: [
        'An **operating system** is a program that acts as an **intermediary between the user and the computer hardware**. We need it because it:',
        { ul: ['provides a **convenient environment** to run programs (user interface, program execution, file system);', '**manages resources** (CPU, memory, I/O devices, files) and allocates them efficiently and fairly among programs and users;', 'acts as a **control program** that prevents errors and improper use and **protects** programs and users from each other.'] },
      ] },
      { id: 'o1-objectives', from: 'os-objectives', q: 'Mention the objectives and functions of an operating system.', a: [
        '**Objectives**: **convenience** (make the computer easy to use), **efficiency** (use resources well) and **ability to evolve** (allow new functions without disturbing service).',
        '**Functions**: process management, memory management, file management, secondary-storage management, I/O device management, protection and security, networking, and the user interface.',
      ] },
      { id: 'o1-trap', from: 'os-trap', q: 'Define a trap.', a: [
        'A **trap (exception)** is a **software-generated interrupt** caused either by an **error** (division by zero, invalid memory access) or by a **specific request from a user program** for an OS service (a **system call**). It switches the CPU from user mode to **kernel mode** and transfers control to the OS handler.',
      ] },
      { id: 'o1-purposes-rtos', from: 'os-rtos-difficulty', q: 'What are the three main purposes of an operating system? What is the main difficulty in writing an OS for a real-time environment?', a: [
        { ol: ['Provide an **environment for users to run programs** conveniently and efficiently.', '**Allocate the computer\'s resources** among users and programs fairly and efficiently.', 'Act as a **control program**: supervise program execution to prevent errors and improper use.'] },
        'Main difficulty in a **real-time OS**: every task must complete within **fixed, strict time constraints (deadlines)**; the programmer must keep the OS from causing unpredictable delays (e.g. long non-pre-emptible kernel sections, virtual-memory paging), otherwise the system fails.',
      ] },
      { id: 'o1-layered', from: 'os-layered-outline', q: 'Outline the layered approach.', a: [
        'In the **layered approach** the OS is broken into **layers (levels)**: layer 0 is the hardware and the highest layer (N) is the user interface. Each layer is built on top of lower layers and **uses only the functions and services of the layers below it**.',
        'Advantage: **simple construction and debugging** (each layer is debugged in turn). Disadvantage: hard to define the layers, and requests pass through many layers, so it is **less efficient**.',
      ] },
      { id: 'o1-desktop-mobile', from: 'os-desktop-mobile', q: 'Compare desktop systems and mobile systems.', a: [
        { table: { head: ['Desktop systems', 'Mobile systems'], rows: [['Personal computers with large screens, keyboard and mouse', 'Handheld devices (phones, tablets) with touch screens'], ['Plentiful power, memory and processing', 'Limited battery, memory and CPU; power management is critical'], ['OS: Windows, macOS, Linux', 'OS: Android, iOS'], ['Focus on performance and multitasking', 'Focus on battery life, responsiveness, sensors (GPS, camera) and wireless connectivity']] } },
      ] },
      { id: 'o1-kernel', from: 'os-kernel-importance', q: 'Discuss the importance of the kernel in an operating system.', a: [
        'The **kernel** is the **core of the OS** that runs at all times in **kernel (privileged) mode**. It is important because it:',
        { ul: ['manages the **CPU** (process scheduling), **memory**, **devices** (drivers) and **files**;', 'provides **system calls**, the only interface through which programs get OS services;', 'handles **interrupts** and enforces **protection** between processes and between users and the hardware.'] },
      ] },
      { id: 'o1-linux', from: 'os-linux-components', q: 'List any four components of the Linux system.', a: [
        { ul: ['**Kernel**: manages processes, memory, files and devices (monolithic, with loadable modules).', '**System libraries** (glibc): functions through which applications request kernel services.', '**System utilities**: programs that perform management tasks (ls, cp, ps, daemons).', '**Shell**: the command interpreter (bash) between the user and the kernel.', '(Also: hardware layer, device drivers / loadable kernel modules, user applications.)'] },
      ] },
      { id: 'o1-modes', from: 'os-modes-uses', q: 'Some CPUs provide more than two modes of operation. What are two possible uses of these multiple modes?', a: [
        { ul: ['**Finer-grained protection** of the OS: e.g. separate modes for the kernel core, for device drivers and for user code, so a faulty driver cannot corrupt the kernel (Intel has four rings).', '**Virtualisation**: an extra mode for the **virtual machine manager (hypervisor)**, with more privileges than guest kernels but fewer than the hardware.', 'Also: distinguishing different classes of users or of services.'] },
      ] },
      { id: 'o1-storage', from: 'os-storage-hierarchy', q: 'Sketch the hierarchy of storage devices.', a: [
        { stack: ['Registers', 'Cache', 'Main memory (RAM)', 'Solid-state disk', 'Hard disk', 'Optical disk', 'Magnetic tape'], label: 'Fastest and costliest at the top; largest and cheapest at the bottom' },
        'Moving down the hierarchy, **access time and capacity increase** and **cost per bit decreases**. The top levels are **volatile**; from SSD downwards storage is non-volatile.',
      ] },
      { id: 'o1-timesharing', from: 'os-timesharing-response', q: 'Response time is the major requirement of a multiuser time-sharing OS. What needs to be improved to meet it?', a: [
        { ul: ['**CPU scheduling**: a short time quantum and round-robin / priority scheduling that favours interactive processes.', '**Fast context switching** and low interrupt-handling overhead.', '**Memory management**: enough memory and efficient virtual memory/swapping so interactive processes are resident (avoid thrashing).', '**Fast I/O**: buffering, caching and efficient disk scheduling.'] },
      ] },
      { id: 'o1-rtos', from: 'os-what-rtos', q: 'What is an RTOS?', a: [
        'A **real-time operating system (RTOS)** is an OS used when there are **rigid time requirements** on the operation of a processor or the flow of data: processing **must be done within defined time constraints** or the system fails. **Hard real-time** systems guarantee deadlines (airbag control, pacemakers); **soft real-time** systems give critical tasks priority (multimedia). Examples: VxWorks, FreeRTOS, QNX.',
      ] },
      { id: 'o1-rtos-features', from: 'os-rtos-features', q: 'Outline the features of an RTOS.', a: [
        { ul: ['**Deterministic** behaviour: predictable, bounded response and interrupt latency.', '**Priority-based pre-emptive scheduling** (e.g. rate-monotonic, EDF).', 'Fast **context switching** and small memory footprint.', 'Synchronisation with **priority inheritance** (to avoid priority inversion).', 'Little or no virtual memory; reliability and fault tolerance.'] },
      ] },
      { id: 'o1-microkernel', q: 'What is a microkernel? Give one advantage and one disadvantage.', a: [
        'A **microkernel** keeps only the minimum in the kernel (basic process and memory management and **inter-process communication**) and moves other services (file system, device drivers) into **user-space servers** that communicate by **message passing**. Advantage: easy to extend and port, more reliable and secure. Disadvantage: message-passing overhead lowers **performance**. Examples: Mach, QNX.',
      ] },
      { id: 'o1-dual-mode', q: 'What is dual-mode operation? Why is it needed?', a: [
        'The hardware provides a **mode bit**: **kernel mode (0)** and **user mode (1)**. **Privileged instructions** (I/O, timer, interrupt management) can be executed only in kernel mode. User programs run in user mode and switch to kernel mode only through a **trap/system call or interrupt**. It is needed to **protect the OS and other users** from errant or malicious programs.',
      ] },
    ],
  },
  {
    unit: 'II',
    items: [
      { id: 'o2-scanf', from: 'os-scanf-transition', q: 'What state transition occurs due to the scanf() system call in a program that reads an integer and then calls exit(0)?', a: [
        { flow: ['New', 'Ready', 'Running', 'Waiting (scanf)', 'Ready', 'Running', 'Terminated (exit)'], label: 'Process states' },
        'After admission (**New → Ready**) and dispatch (**Ready → Running**), scanf() issues a **read system call** for keyboard input, so the process moves **Running → Waiting (blocked)**. When the user types and the I/O completes, the interrupt moves it **Waiting → Ready**; it is dispatched again (**Ready → Running**) and exit(0) moves it to **Terminated**.',
      ] },
      { id: 'o2-zombie', from: 'os-mid-zombie', q: 'When can a process enter a zombie state? How can it come out of it?', a: [
        'A process becomes a **zombie (defunct)** when it has **terminated (called exit())** but its **parent has not yet called wait()** to read its exit status. Its memory is freed, but its **entry in the process table (PID and exit status)** remains.',
        'It comes out when the **parent calls wait() / waitpid()**, which collects the status and removes the entry (the zombie is **reaped**). If the parent terminates without waiting, the zombie becomes an orphan and is **adopted by init/systemd (PID 1)**, which calls wait() periodically and reaps it. (Sending SIGCHLD to the parent or killing the parent also leads to reaping.)',
      ] },
      { id: 'o2-fork', from: 'os-fork-purpose', q: 'What is the purpose of the fork() system call?', a: [
        '**fork()** creates a **new process (the child)** that is a **copy of the calling process (the parent)**: same code, data, open files, running from the instruction after fork(). It returns **0 in the child**, the **child\'s PID in the parent**, and −1 on error. The child usually calls **exec()** to run a new program, and the parent may **wait()** for it.',
      ] },
      { id: 'o2-cmd', from: 'os-cmd-interpreter', q: 'What is the purpose of the command interpreter? Why is it usually separate from the kernel?', a: [
        'The **command interpreter (shell)** reads commands from the user (or a script) and **executes them**, usually by creating processes and making system calls (e.g. bash, cmd).',
        'It is kept **separate from the kernel** because it is subject to **frequent changes** (different shells, user preferences); a bug in it should not crash the system; and it does not need kernel privileges since it can do its work through system calls.',
      ] },
      { id: 'o2-aging', from: 'os-aging', q: 'What is aging? Identify the scheduling algorithm that suffers from the problem aging solves.', a: [
        '**Aging** is the technique of **gradually increasing the priority of processes that wait in the system for a long time**, so they eventually run. It solves **starvation (indefinite blocking)**, which occurs in **priority scheduling** (and SJF/SRTF), where low-priority processes may wait forever while higher-priority ones keep arriving.',
      ] },
      { id: 'o2-indefinite', from: 'os-indefinite-block', q: 'Name the solution to the problem of indefinite blocking of low-priority processes.', a: [
        '**Aging**: the priority of a waiting process is **increased gradually** (e.g. by 1 every 15 minutes), so even a process with the lowest priority eventually becomes the highest priority and is executed. This prevents **starvation** in priority scheduling.',
      ] },
      { id: 'o2-preemptive', from: 'os-preemptive-diff', q: 'Explain the difference between pre-emptive and non-pre-emptive scheduling.', a: [
        { table: { head: ['Pre-emptive', 'Non-pre-emptive'], rows: [['The CPU **can be taken away** from a running process (on a time-out or a higher-priority arrival)', 'Once given the CPU, a process **keeps it until it terminates or blocks**'], ['Better response time; suited to time-sharing and real-time', 'Simple, low overhead, but a long job delays others'], ['Needs synchronisation of shared data; more context switches', 'No race conditions from pre-emption'], ['RR, SRTF, pre-emptive priority', 'FCFS, SJF, non-pre-emptive priority']] } },
      ] },
      { id: 'o2-high-low', from: 'os-high-low-priority', q: 'Compare high-priority and low-priority scheduling.', a: [
        'In priority scheduling the CPU goes to the **highest-priority** ready process. **High-priority processes** (interactive, system, real-time tasks) get the CPU first and get good response time; **low-priority processes** (batch, background jobs) run only when no higher-priority process is ready, so they may **starve**. Aging raises the priority of long-waiting low-priority processes.',
      ] },
      { id: 'o2-queues', from: 'os-queues', q: 'What are the uses of job queues, ready queues and device queues?', a: [
        { ul: ['**Job queue**: all processes in the system (on entry); the long-term scheduler selects from it.', '**Ready queue**: processes in main memory that are **ready and waiting to run**; the short-term (CPU) scheduler picks from it.', '**Device queues**: processes **waiting for a particular I/O device**; one queue per device.'] },
        'Processes migrate among these queues during their lifetime.',
      ] },
      { id: 'o2-cs-diagram', from: 'os-cs-diagram', q: 'Provide the diagram showing a context switch from process to process.', a: [
        { img: 'os-context-switch' },
        'On an interrupt or system call, the OS **saves the state of P0 into PCB0**, **reloads the state of P1 from PCB1**, and P1 runs; later the reverse happens. While saving and reloading, neither process executes, so context-switch time is pure overhead.',
      ] },
      { id: 'o2-cs-overhead', from: 'os-cs-overhead', q: 'Context-switch time is pure overhead. What factors can increase this overhead?', a: [
        { ul: ['Number of **registers** to save and restore (and special registers, FPU state).', '**Memory speed** and the work of switching the **address space** (page tables, flushing the **TLB** and caches).', 'Complexity of the OS and the **PCB**; how much state must be copied.', '**Hardware support**: without multiple register sets the switch is slower.', 'Frequent switches (too small a time quantum).'] },
      ] },
      { id: 'o2-fork-exec', from: 'os-fork-exec-vfork', q: 'When is fork() followed by exec() most appropriate? When is vfork() preferable?', a: [
        '**fork() + exec()** is appropriate when a process wants to **run a different program** in a new process (a shell running a command): fork creates the child, exec replaces its image with the new program.',
        '**vfork()** is preferable when the child will **call exec() (or exit) immediately**: it does not copy the parent\'s address space; the child borrows it and the parent is suspended until the child execs, which saves time and memory. (With copy-on-write fork, the benefit is smaller.)',
      ] },
      { id: 'o2-ipc', from: 'os-ipc-use', q: 'What is the use of inter-process communication?', a: [
        '**IPC** is the mechanism by which **cooperating processes exchange data and synchronise**. Uses: **information sharing** (several processes using the same file), **computation speed-up** (subtasks running in parallel), **modularity** (dividing a system into separate processes) and **convenience** (a user doing several tasks at once). Two models: **shared memory** and **message passing** (pipes, message queues, sockets).',
      ] },
      { id: 'o2-rr', from: 'os-rr-short', q: 'Discuss time-sliced round-robin scheduling.', a: [
        '**Round robin** gives each ready process the CPU for a small **time quantum** q (10–100 ms) in circular FIFO order. If the process does not finish within q, it is **pre-empted** and put at the tail of the ready queue. It is designed for **time-sharing** and gives good response time; no process waits more than (n − 1) × q. If q is very large, RR becomes FCFS; if very small, context-switch overhead dominates.',
      ] },
      { id: 'o2-signals', from: 'os-unix-signals', q: 'What are the interesting signals in Unix process management?', a: [
        'A **signal** is a software notification sent to a process that an event occurred. Important ones:',
        { ul: ['**SIGINT** (Ctrl+C, interrupt), **SIGTERM** (polite termination request), **SIGKILL** (forced kill, cannot be caught).', '**SIGSTOP / SIGTSTP** (stop, Ctrl+Z) and **SIGCONT** (continue).', '**SIGCHLD** (child stopped or terminated), **SIGSEGV** (invalid memory access), **SIGALRM** (timer), **SIGHUP** (terminal hung up).'] },
      ] },
      { id: 'o2-pcb', q: 'What is a PCB? List its contents.', a: [
        'A **process control block (PCB)** is the kernel data structure that **represents a process** and stores everything needed to manage and resume it.',
        { ul: ['Process **state** and **PID**; **program counter**; **CPU registers**.', '**CPU-scheduling information** (priority, queue pointers).', '**Memory-management information** (base/limit, page tables).', '**Accounting information** (CPU time used); **I/O status** (open files, devices).'] },
      ] },
    ],
  },
  {
    unit: 'III',
    items: [
      { id: 'o3-logical-physical', from: 'os-mid-logical-physical', q: 'Define logical address and physical address.', a: [
        '**Logical (virtual) address**: the address **generated by the CPU** while a program runs; the user program deals only with logical addresses.',
        '**Physical address**: the address **seen by the memory unit**, the actual location in RAM, loaded into the memory-address register.',
        'The **MMU** maps logical to physical addresses at run time, e.g. with relocation register 14000, logical address 346 → physical **14346**. With compile- or load-time binding they are the same; with execution-time binding they differ.',
      ] },
      { id: 'o3-mm-syscalls', from: 'os-mid-mm-syscalls', q: 'Describe the role of any two of the system calls mmap(), munmap(), sbrk() and mprotect() in memory management.', a: [
        { ul: ['**mmap()**: creates a **new mapping** in the process\'s virtual address space, either **anonymous** (zero-filled memory, used by malloc for large blocks) or **file-backed** (a file\'s contents appear in memory); physical frames are allocated on first access. e.g. mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0).', '**munmap()**: **removes a mapping**; the virtual pages are released and their physical frames freed. munmap(p, 4096).', '**sbrk()**: moves the **program break** (end of the heap) by n bytes to **grow or shrink the heap**; used by malloc for small allocations.', '**mprotect()**: changes the **read/write/execute permissions** of pages; a violating access causes SIGSEGV (guard pages, read-only data).'] },
      ] },
      { id: 'o3-page-fault', from: 'os-page-fault-handle', q: 'How does an operating system handle a page fault?', a: [
        { img: 'os-page-fault' },
        { ol: ['The reference finds the **invalid bit** set in the page table → **trap** to the OS.', 'The OS checks the reference: illegal → terminate the process; legal but not in memory → continue.', 'Find a **free frame** (or select a victim with page replacement).', 'Read the page from disk (backing store) into the frame.', '**Update the page table** (frame number, valid bit).', '**Restart the instruction** that caused the fault.'] },
      ] },
      { id: 'o3-what-paging', from: 'os-what-paging', q: 'What is paging?', a: [
        '**Paging** is a memory-management scheme that allows a process\'s physical address space to be **non-contiguous**. Physical memory is divided into fixed-size **frames**, logical memory into **pages** of the same size; a **page table** maps each page number to a frame number. The logical address = **page number (p) + offset (d)**; physical address = frame × page size + d. It avoids external fragmentation.',
      ] },
      { id: 'o3-page-table', from: 'os-page-table-purpose', q: 'What is the purpose of page tables in paging?', a: [
        'The **page table** stores, for each page of a process, the **frame number** where it is loaded, so the MMU can **translate logical addresses to physical addresses** (the page number indexes the table). Each entry also holds **valid–invalid** and **protection (R/W/X)** bits, and dirty/reference bits used for page replacement.',
      ] },
      { id: 'o3-paging-ext', from: 'os-paging-ext-frag', q: 'How does paging eliminate external fragmentation?', a: [
        'In paging, memory is allocated in **fixed-size frames**, and **any free frame can hold any page**: a process\'s pages need not be contiguous. So every free frame is usable and there are no unusable holes between allocations: **no external fragmentation**. Only **internal fragmentation** remains (on average half of the last page).',
      ] },
      { id: 'o3-frag', from: 'os-frag-reasons', q: 'What are the reasons for internal fragmentation and external fragmentation?', a: [
        { ul: ['**Internal fragmentation**: memory is allocated in **fixed-size blocks** (fixed partitions, pages) and a process gets a block **larger than it needs**; the unused part inside the block is wasted.', '**External fragmentation**: memory is allocated in **variable-size pieces** (variable partitions, segmentation); as processes load and leave, free memory is broken into **small non-contiguous holes**, so a request may fail even though the total free space is enough.'] },
      ] },
      { id: 'o3-tlb', from: 'os-tlb-role', q: 'Interpret the role of the TLB in paging.', a: [
        'Without help, each memory access needs **two accesses** (page table + data). The **translation look-aside buffer (TLB)** is a small, fast **associative cache** of recent page → frame translations. On a **TLB hit**, the frame is obtained at once; on a **miss**, the page table is read and the entry added. It reduces the effective access time: EAT = h(t + m) + (1 − h)(t + 2m).',
      ] },
      { id: 'o3-eat', from: 'os-eat', q: 'How do you calculate effective access time?', a: [
        { formula: 'EAT = h × (t + m) + (1 − h) × (t + 2m)' },
        'where h = TLB hit ratio, t = TLB lookup time, m = memory access time. Example: m = 100 ns, t = 20 ns, h = 0.8: EAT = 0.8 × 120 + 0.2 × 220 = **140 ns**. With page faults: EAT = (1 − p) × m + p × page-fault service time.',
      ] },
      { id: 'o3-thrashing', from: 'os-thrashing', q: 'What is thrashing?', a: [
        '**Thrashing** is a situation in which a process (or the system) spends **more time paging than executing**: it does not have enough frames for its active pages (working set), so it page-faults continuously, CPU utilisation drops, the OS increases multiprogramming, and things get worse. Remedies: the **working-set model**, **page-fault-frequency** control, reducing the degree of multiprogramming, adding memory.',
      ] },
      { id: 'o3-sync-async', from: 'os-sync-async-io', q: 'Write the difference between synchronous and asynchronous I/O.', a: [
        { table: { head: ['Synchronous I/O', 'Asynchronous I/O'], rows: [['The process **waits (blocks)** until the I/O completes', 'The call **returns immediately**; the process continues and is notified on completion'], ['Simple to program', 'Overlaps computation with I/O; more complex (callbacks, signals, polling)'], ['e.g. a normal read()', 'e.g. aio_read(), overlapped I/O in Windows']] } },
      ] },
      { id: 'o3-disk-access', from: 'os-disk-access-ways', q: 'Categorise the ways of accessing disk storage by computers.', a: [
        { ul: ['**Host-attached storage**: accessed through local I/O ports/buses (SATA, SCSI, USB).', '**Network-attached storage (NAS)**: accessed remotely over a data network using file protocols (NFS, CIFS/SMB).', '**Storage-area network (SAN)**: a private high-speed network connecting servers and storage units (Fibre Channel, iSCSI).'] },
      ] },
      { id: 'o3-belady', q: 'What is Belady\'s anomaly?', a: [
        '**Belady\'s anomaly** is the situation in which **increasing the number of page frames increases the number of page faults**. It occurs with **FIFO** page replacement. Example: reference string 1 2 3 4 1 2 5 1 2 3 4 5 gives **9 faults with 3 frames but 10 with 4**. Stack algorithms (LRU, Optimal) never suffer from it.',
      ] },
      { id: 'o3-swapping', q: 'What is swapping?', a: [
        '**Swapping** temporarily moves a process (or its pages) **out of main memory to a backing store** (disk) and later **brings it back** to continue execution. It lets the total memory of processes exceed physical memory. The main cost is **transfer time** (100 MB at 50 MB/s ≈ 2 s each way); modern systems swap pages rather than whole processes.',
      ] },
      { id: 'o3-seek-latency', q: 'Define seek time and rotational latency.', a: [
        '**Seek time**: the time for the disk arm to move the heads to the **cylinder** containing the desired sector. **Rotational latency**: the additional time for the desired **sector to rotate under the head** (on average half a rotation; 4.17 ms at 7,200 RPM). Access time = seek time + rotational latency + transfer time.',
      ] },
    ],
  },
  {
    unit: 'IV',
    items: [
      { id: 'o4-semaphore', from: 'os-semaphore-short', q: 'What are semaphores? How are they used in synchronization?', a: [
        'A **semaphore** is an **integer variable** that, apart from initialisation, is accessed only through two **atomic** operations: **wait() (P)**, which decrements it and blocks the caller if the value is not positive, and **signal() (V)**, which increments it and wakes a waiting process.',
        { ul: ['**Mutual exclusion**: a binary semaphore mutex = 1: wait(mutex); critical section; signal(mutex).', '**Counting resources**: a counting semaphore initialised to the number of instances.', '**Ordering**: synch = 0; P1 does S1; signal(synch); P2 does wait(synch); S2, so S2 runs after S1.'] },
      ] },
      { id: 'o4-race', from: 'os-race', q: 'What is a race condition?', a: [
        'A **race condition** occurs when **several processes access and manipulate shared data concurrently** and the **final result depends on the order** in which the accesses happen. Example: two processes executing count++ and count-- on count = 5 may leave 4 or 6 instead of 5. It is prevented by making the code a **critical section** with mutual exclusion.',
      ] },
      { id: 'o4-conditions', from: 'os-deadlock-conditions', q: 'Summarise the necessary conditions for a deadlock to occur.', a: [
        { ol: ['**Mutual exclusion**: at least one resource is non-sharable.', '**Hold and wait**: a process holds resources while waiting for others.', '**No pre-emption**: resources are released only voluntarily.', '**Circular wait**: P0 waits for P1, P1 for P2, …, Pn for P0.'] },
        'All four must hold **simultaneously**.',
      ] },
      { id: 'o4-thread-benefits', from: 'os-thread-benefits', q: 'List the benefits of threads.', a: [
        { ul: ['**Responsiveness**: the program keeps running while part of it is blocked.', '**Resource sharing**: threads share the process\'s memory and resources.', '**Economy**: cheaper to create and switch than processes.', '**Scalability**: threads run in parallel on multicore processors.'] },
      ] },
      { id: 'o4-ult-klt', from: 'os-ult-klt', q: 'Distinguish between user-level threads and kernel-level threads.', a: [
        { table: { head: ['User-level threads', 'Kernel-level threads'], rows: [['Managed by a **thread library** in user space', 'Managed by the **OS kernel**'], ['Fast creation and switching (no system call)', 'Slower (system calls, kernel involvement)'], ['A blocking system call **blocks the whole process**', 'Other threads continue when one blocks'], ['Cannot run in parallel on multiple cores', 'Can be scheduled on different cores'], ['e.g. Green threads', 'e.g. Linux, Windows threads']] } },
      ] },
      { id: 'o4-proc-thread', from: 'os-proc-vs-thread-short', q: 'Compare process and thread.', a: [
        { table: { head: ['Process', 'Thread'], rows: [['A program in execution; heavyweight', 'A unit of execution within a process; lightweight'], ['Own address space and resources', 'Shares code, data and files with sibling threads; own stack, registers, PC'], ['Creation and context switch are costly', 'Cheap to create and switch'], ['Communicate via IPC', 'Communicate via shared memory directly']] } },
      ] },
      { id: 'o4-mutex', from: 'os-mutex-features', q: 'List the features of a mutex semaphore.', a: [
        { ul: ['Has two states: **locked and unlocked** (binary); initial value 1.', '**Ownership**: only the task that locked it can unlock it.', 'Provides **mutual exclusion** for a critical section.', 'Often supports **priority inheritance** to avoid priority inversion, and recursive locking.', 'acquire()/release() (lock/unlock) are atomic.'] },
      ] },
      { id: 'o4-peterson-dekker', from: 'os-dekker-peterson', q: 'What is the difference between Dekker\'s solution and Peterson\'s solution?', a: [
        'Both are **software solutions** to the two-process critical-section problem that satisfy mutual exclusion, progress and bounded waiting. **Dekker\'s algorithm** (the first correct one) uses flag[2] and turn with a more complex entry protocol: a process that finds the other interested **backs off** (clears its flag) when it is not its turn and retries. **Peterson\'s algorithm** is simpler: a process sets flag[i] = true and **gives the turn to the other** (turn = j), then waits while flag[j] && turn == j.',
      ] },
      { id: 'o4-rag', from: 'os-rag-need', q: 'Identify the need for the resource-allocation graph (RAG) in deadlock.', a: [
        'A **RAG** shows processes (circles), resources (rectangles with instance dots), **request edges** P → R and **assignment edges** R → P. It is needed to **describe and detect deadlocks**: no cycle means no deadlock; a cycle with single-instance resources means deadlock; with multiple instances it means a possible deadlock. With **claim edges** it is also used for **deadlock avoidance**.',
      ] },
      { id: 'o4-single-thread', from: 'os-single-thread-deadlock', q: 'Is it possible to have a deadlock involving only one single-threaded process?', a: [
        '**No.** Deadlock needs **circular wait** among **two or more** processes, each holding a resource the next one needs. A single-threaded process can hold and request resources, but there is no other process in a cycle that holds what it waits for. (It can block itself, e.g. by locking a non-recursive mutex it already holds, but that is a programming error, not a deadlock by definition.)',
      ] },
      { id: 'o4-concurrency', from: 'os-concurrency-overhead', q: '"Concurrency increases scheduling overhead without providing any speedup." Do you agree?', a: [
        '**Partly.** On a **single CPU**, concurrency adds context-switch and scheduling overhead without parallel speed-up for CPU-bound work. But it still improves **throughput and responsiveness** by overlapping **I/O with computation**, and on **multiprocessors/multicore** systems concurrent threads run **in parallel** and give real speed-up. So the statement is not true in general.',
      ] },
      { id: 'o4-dining', from: 'os-dining-deadlock', q: 'Explain the deadlock and starvation problems in the dining-philosophers problem.', a: [
        { ul: ['**Deadlock**: if all five philosophers get hungry at once and each picks up the **left chopstick**, no right chopstick is free; each waits forever.', '**Starvation**: a philosopher may never get both chopsticks because the neighbours keep eating alternately.', 'Remedies: allow only four at the table; pick up both chopsticks only if both are free; odd philosophers pick left first and even ones right first.'] },
      ] },
      { id: 'o4-critical', q: 'What is the critical-section problem? State its requirements.', a: [
        'A **critical section** is the code in which a process accesses shared data. The **critical-section problem** is to design a protocol so that **no two processes execute their critical sections simultaneously**. Requirements: **mutual exclusion**, **progress** (the decision on who enters next cannot be postponed indefinitely) and **bounded waiting** (a limit on how many times others enter before a waiting process does).',
      ] },
      { id: 'o4-safe-state', q: 'What is a safe state?', a: [
        'A state is **safe** if the system can allocate resources to every process (up to its maximum) in some order and still avoid deadlock, i.e. there is a **safe sequence** ⟨P1, …, Pn⟩ in which each Pi\'s remaining need can be met by the available resources plus those held by all Pj before it. A safe state has no deadlock; an unsafe state may lead to one. The Banker\'s algorithm keeps the system safe.',
      ] },
      { id: 'o4-monitor', q: 'What is a monitor?', a: [
        'A **monitor** is a high-level synchronisation construct: an abstract data type that encapsulates **shared data and the procedures** operating on it, with the guarantee that **only one process is active in the monitor at a time**. **Condition variables** (x.wait(), x.signal()) let processes wait inside it for a condition. Examples: Java synchronized methods.',
      ] },
    ],
  },
  {
    unit: 'V',
    items: [
      { id: 'o5-file-syscalls', from: 'os-mid-file-syscalls', q: 'What are the different file handling system calls?', a: [
        { ul: ['**open(path, flags, mode)**: open or create a file; returns a **file descriptor**.', '**read(fd, buf, n)** / **write(fd, buf, n)**: transfer n bytes at the current offset.', '**lseek(fd, offset, whence)**: reposition the file offset.', '**close(fd)**: release the descriptor.', 'Also: **creat()**, **unlink()** (delete), **stat()** (metadata), **dup()**, **rename()**, **chmod()**.'] },
        { code: 'int fd = open("a.txt", O_RDONLY);  n = read(fd, buf, 100);  close(fd);' },
      ] },
      { id: 'o5-attributes', from: 'os-file-attributes', q: 'List the basic attributes of a file.', a: [
        '**Name**, **identifier** (unique number, e.g. inode number), **type**, **location** (device and block pointers), **size**, **protection** (read/write/execute permissions), and **time, date and user identification** (creation, last modification, last access, owner).',
      ] },
      { id: 'o5-two-single', from: 'os-two-vs-single', q: 'Why is a two-level directory better than a single-level directory?', a: [
        'In a **single-level directory** all users\' files are in one directory, so every file needs a **unique name** and files cannot be grouped. A **two-level directory** gives each user a separate **user file directory (UFD)** under a master file directory, so **different users can use the same file names**, searching is faster (only the user\'s directory) and users are **isolated** from each other.',
      ] },
      { id: 'o5-mounting', from: 'os-mounting', q: 'Explain file-system mounting.', a: [
        '**Mounting** makes a file system available: the OS is given the **device** and a **mount point** (an empty directory in the existing tree), checks that the device has a valid file system, and records it in the **mount table**. Its files then appear under the mount point (e.g. mount /dev/sdb1 /mnt/usb); **unmounting** detaches it.',
      ] },
      { id: 'o5-journaling', from: 'os-journaling', q: 'What is journaling?', a: [
        'A **journaling (log-based) file system** writes every **metadata change to a log (journal)** as a transaction **before** applying it to the file system. After a crash, **committed transactions are replayed** and incomplete ones discarded, so the file system becomes consistent quickly without a full fsck. Examples: ext3, ext4, NTFS, XFS.',
      ] },
      { id: 'o5-locks', from: 'os-locks', q: 'What are the advantages and disadvantages of mandatory locks over advisory locks?', a: [
        '**Mandatory locks** are enforced by the OS on every access. Advantage: **safety**: no process can bypass a lock, protecting data from careless or malicious programs. Disadvantages: **overhead** of checking every access, less flexibility, and a process holding a lock can block others (even the administrator) indefinitely. **Advisory locks** rely on processes cooperating: faster and flexible but not enforced.',
      ] },
      { id: 'o5-threat-attack', from: 'os-threat-attack', q: 'Differentiate threat and attack.', a: [
        { table: { head: ['Threat', 'Attack'], rows: [['A **potential** security violation', 'An **actual attempt** to violate security'], ['Exists because of a vulnerability, intentional or accidental', 'Always intentional, carried out by an attacker'], ['e.g. the possibility of password theft', 'e.g. running a password-cracking program on the system']] } },
      ] },
      { id: 'o5-vta', from: 'os-vuln-threat-attack', q: 'Differentiate between vulnerability, threat and attack.', a: [
        { ul: ['**Vulnerability**: a **weakness** in a system (bug, weak password, open port) that can be exploited.', '**Threat**: a **potential** violation: the possibility that someone exploits a vulnerability.', '**Attack**: an **actual attempt** to exploit a vulnerability and break security.'] },
        'Example: an unpatched buffer overflow (vulnerability) → a worm could use it (threat) → the worm infects the server (attack).',
      ] },
      { id: 'o5-password', from: 'os-password-vuln', q: 'What do you mean by password vulnerabilities?', a: [
        'Weaknesses that let passwords be discovered: **guessing** (common words, personal details), **brute-force / dictionary attacks**, **shoulder surfing**, **sniffing** them on the network, users **writing them down or reusing** them, and theft of the **password file**. Defences: strong passwords, hashing with salt, limited login attempts, one-time passwords and multi-factor authentication.',
      ] },
      { id: 'o5-encryption', from: 'os-encryption-limits', q: 'List the security attacks that cannot be prevented by encryption.', a: [
        { ul: ['**Denial-of-service** attacks (flooding the system or network).', 'Attacks on the **end points**: malware, keyloggers or trojans on the sender\'s or receiver\'s machine, and **stolen keys**.', '**Insider** misuse by authorised users and **social engineering / phishing**.', 'Exploits of **software bugs** such as buffer overflows; traffic analysis of who talks to whom.'] },
      ] },
      { id: 'o5-privilege', from: 'os-privilege', q: 'What is a privilege-escalation attack? How does it affect OS security?', a: [
        'A **privilege-escalation attack** lets an attacker gain **more privileges than granted**: **vertical** (an ordinary user becomes root/administrator, e.g. through a buffer overflow in a setuid program or kernel bug) or **horizontal** (accessing another user\'s resources). It breaks OS security because the attacker can then read or modify any data, install rootkits, disable logging and take full control.',
      ] },
      { id: 'o5-capability', from: 'os-capability', q: 'What are capability-based systems?', a: [
        'In a **capability-based system**, access rights are held as **capabilities**: unforgeable tokens, each naming an **object and the operations allowed** on it. A process (domain) has a **capability list** and must **present a capability** to access an object; possession implies permission. Capabilities are protected by the OS/hardware so they cannot be forged. Examples: Hydra, Cambridge CAP.',
      ] },
      { id: 'o5-protection-goals', from: 'os-protection-goals', q: 'List the goals of protection.', a: [
        { ul: ['Prevent **malicious, intentional violation** of access restrictions by users.', 'Ensure each program component uses resources **only as stated in the policy**.', '**Detect latent errors** at interfaces between subsystems to improve reliability.', 'Provide **mechanisms** that enforce flexible **policies** (separation of policy and mechanism), following the **principle of least privilege**.'] },
      ] },
      { id: 'o5-virus-worm', q: 'Differentiate a virus and a worm.', a: [
        { table: { head: ['Virus', 'Worm'], rows: [['Attaches to a **host program** or file', '**Standalone** program'], ['Spreads when the infected program is run or shared (needs user action)', 'Spreads **automatically over the network** by exploiting vulnerabilities'], ['Mainly damages files on the host', 'Consumes bandwidth and resources; spreads very fast'], ['e.g. macro virus', 'e.g. Morris worm, WannaCry']] } },
      ] },
      { id: 'o5-inode', q: 'What is an inode?', a: [
        'An **inode** is the UNIX **file control block**: a structure on disk that holds a file\'s **metadata** (type, permissions, owner, size, time stamps, link count) and **pointers to its data blocks**: 12 direct pointers plus single, double and triple indirect pointers. The file name is not in the inode; the directory entry maps the name to the inode number.',
      ] },
      { id: 'o5-logging-auditing', q: 'Distinguish logging and auditing.', a: [
        '**Logging** is the continuous **recording** of system events (logins, file accesses, errors) in log files (syslog, Event Viewer). **Auditing** is the **review and analysis** of those records to check policy compliance, detect intrusions and make users accountable (auditd). Logging produces the data; auditing uses it.',
      ] },
    ],
  },
]
