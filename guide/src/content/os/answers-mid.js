// Model answers for the OS class-test (mid-term) questions that had none, written for the marks given.
// The Banker's numerical was computed by script and checked against the paper. The 2-mark class-test
// questions take their answers from bank-2m.js.
const N = 'OS unit slides'
const TB = 'Silberschatz, Galvin & Gagne, Operating System Concepts'
const MID = 'OS class tests (PYQs/OS MIDS.pdf)'

export default {
  'os-mid-functions-services': {
    blocks: [
      'An **operating system** is a program that acts as an intermediary between the user and the computer hardware; it manages the hardware and provides an environment in which programs run conveniently and efficiently.',
      { h: 'Functions of an OS (what it manages)' },
      { table: { head: ['Function', 'What the OS does'], rows: [
        ['**Process management**', 'Creates and deletes processes, schedules them on the CPU, suspends and resumes them, and provides synchronisation and communication'],
        ['**Memory management**', 'Tracks which parts of memory are used and by whom, allocates and frees memory, decides which processes to load (virtual memory)'],
        ['**File management**', 'Creates and deletes files and directories, maps files onto secondary storage, backs them up'],
        ['**Secondary-storage management**', 'Free-space management, storage allocation, disk scheduling'],
        ['**I/O system management**', 'Device drivers, buffering, caching and spooling; hides device details'],
        ['**Protection and security**', 'Controls access of processes and users to resources; defends against attacks'],
        ['**Networking / communication**', 'Lets processes on different machines exchange data'],
      ] } },
      { h: 'Services of an OS (what it offers users and programs)' },
      { img: 'os-system-layers' },
      { ul: ['**User interface**: CLI, GUI, touch screen, batch.', '**Program execution**: load a program into memory, run it and end it normally or abnormally.', '**I/O operations**: programs cannot do I/O directly; the OS does it for them.', '**File-system manipulation**: create, delete, read, write, search files and directories; permissions.', '**Communication**: between processes, by shared memory or message passing.', '**Error detection**: in the CPU, memory, I/O devices and programs, with appropriate action.', 'For the system itself: **resource allocation**, **accounting** (usage statistics), **protection and security**.'] },
      'Services fall into two groups: those **helpful to the user** (UI, execution, I/O, files, communication, error detection) and those that keep the **system efficient** (resource allocation, accounting, protection). Users reach the services through **system calls**.',
    ],
    sources: [`${N} (Unit 1)`, `${TB} §1.1, §2.1`, MID],
  },

  'os-layered-adv': {
    blocks: [
      'In the **layered approach**, the OS is divided into a number of layers: layer 0 is the hardware and the highest layer is the user interface. Each layer uses only the functions and services of the **layers below it**.',
      { img: 'os-layered' },
      { h: 'Main advantage' },
      '**Simplicity of construction and debugging.** The first layer can be debugged without concern for the rest, because it uses only the (assumed correct) hardware; once it works, the second layer is debugged, and so on. If an error is found while debugging a layer, it must be in that layer. Each layer hides its data structures and hardware details from higher layers (**information hiding, modularity**), so a layer can be changed without affecting others.',
      { h: 'Disadvantages' },
      { ul: ['**Defining the layers is difficult**: each layer can use only lower ones, so careful planning is needed (e.g. the backing-store driver must be below memory management, but it may need the CPU scheduler, which may need memory).', '**Less efficient**: a request passes through several layers, each adding overhead (parameters copied and modified at every layer), so system calls take longer than in a non-layered system.', 'Tightly coupled components are hard to separate into layers.'] },
    ],
    sources: [`${N} (Unit 1)`, `${TB} §2.7.2`, MID],
  },

  'os-system-call': {
    blocks: [
      'A **system call** is the programmatic **interface between a running program and the operating system**: a request to the kernel for a service, usually made through a library API (the C library, Win32 API, POSIX).',
      { h: 'Purpose' },
      { ul: ['User programs run in **user mode** and cannot directly access hardware or kernel data; system calls are the **only controlled entry point** into the kernel (mode switch user → kernel through a trap).', 'They give programs access to OS services: process control, file and device manipulation, information maintenance, communication and protection.', 'They provide **protection** (the kernel checks every request) and **abstraction** (programs do not need hardware details) and **portability** through the API.'] },
      { h: 'How system calls provide OS services' },
      { img: 'os-syscall' },
      { steps: ['The program calls an API function (e.g. open() or printf()).', 'The library places the **system-call number** in a register and the parameters in registers, a memory block or on the stack.', 'It executes a **trap (software interrupt)**; the CPU switches to **kernel mode**.', 'The kernel uses the number to index the **system-call table** and runs the service routine.', 'The result (or an error code) is returned, the mode switches back to user mode and the program continues.'] },
      { example: 'Copying a file uses a sequence of system calls: write the prompt and read the file names (write, read), open the input file (open), create the output file (creat), loop read from input and write to output, then close both files and exit, with error handling (abort) at every step.' },
      { table: { head: ['Type', 'Examples (UNIX)'], rows: [['Process control', 'fork(), exec(), exit(), wait()'], ['File manipulation', 'open(), read(), write(), close()'], ['Device manipulation', 'ioctl(), read(), write()'], ['Information maintenance', 'getpid(), alarm(), sleep()'], ['Communication', 'pipe(), shmget(), mmap(), socket()'], ['Protection', 'chmod(), umask(), chown()']] } },
    ],
    sources: [`${N} (Unit 2)`, `${TB} §2.3`, MID],
  },

  'os-structures': {
    blocks: [
      { h: '(i) MS-DOS: simple structure' },
      { img: 'os-msdos' },
      'MS-DOS was written to give the most functionality in the least space, so it is **not divided into modules** and its interfaces and levels of functionality are not well separated. Application programs can access the basic I/O routines and **write directly to the display and disk drives**. Layers: application programs → resident system program → MS-DOS device drivers → ROM BIOS device drivers. Drawback: errant programs can crash the whole system, since the Intel 8088 had no dual mode or hardware protection.',
      { h: '(ii) Microkernel' },
      { img: 'os-kernels' },
      'The microkernel approach **removes all non-essential components from the kernel** and implements them as system and user-level programs (servers). The kernel keeps only minimal process and memory management and **inter-process communication (message passing)**. Clients and services (file server, device drivers) communicate **through the microkernel by messages**. Examples: Mach, QNX, MINIX.',
      { ul: ['Advantages: easy to **extend** (new services in user space), easy to **port**, more **reliable and secure** (a failing service does not crash the kernel).', 'Disadvantage: **performance overhead** of message passing between user space and kernel space.'] },
      { h: '(iii) iOS: layered hybrid' },
      { flow: ['Cocoa Touch (UI frameworks, touch, gestures)', 'Media services (graphics, audio, video)', 'Core services (cloud, databases)', 'Core OS (Darwin kernel: Mach + BSD)'], label: 'iOS architecture' },
      'Apple\'s mobile OS is structured in **layers** on top of the **Darwin** core (the Mach microkernel plus BSD UNIX, a hybrid kernel). **Cocoa Touch** provides the Objective-C/Swift API for apps (touch UI); **media services** handle graphics, audio and video; **core services** provide cloud computing and databases; the **core OS** provides the kernel environment. Apps cannot access the kernel directly, which improves security.',
    ],
    sources: [`${N} (Unit 1)`, `${TB} §2.7`, MID],
  },

  'os-mid-128-priority': {
    blocks: [
      'Requirements: 128 fixed priority levels (1 = highest), strict priority between levels, FCFS within a level, and choosing the next process **efficiently**.',
      { h: 'Design: multilevel ready queue with a bitmap' },
      { img: 'os-multilevel' },
      { ul: ['Keep an **array of 128 FIFO queues** (linked lists with head and tail pointers), queue[i] holding the ready processes of priority i.', 'Keep a **128-bit bitmap** (e.g. four 32-bit words): bit i is 1 if queue[i] is non-empty.', '**Insert** a process that becomes ready: append it at the **tail** of queue[priority] and set bit priority: **O(1)**. Since priorities are static, the queue index is fixed at creation.', '**Select** the next process: find the **first set bit** in the bitmap (lowest index = highest priority) using a find-first-set instruction, and remove the **head** of that queue: **O(1)**. If the queue becomes empty, clear its bit.'] },
      { h: 'Justification' },
      { ul: ['**Strict priority** is guaranteed: the lowest set bit is always the highest-priority non-empty level.', '**FCFS within a level**: each level is a FIFO queue (insert at tail, remove from head).', '**Efficiency**: both operations are constant time, independent of the number of processes, unlike a single list sorted by priority (O(n) insertion) or a heap (O(log n), and it does not preserve FCFS order among equals without extra time stamps).', 'Memory cost is small: 128 head/tail pairs and 16 bytes of bitmap. Linux\'s O(1) scheduler used exactly this structure (140 priority queues with a bitmap).'] },
      { warn: 'Low-priority processes can **starve** under strict static priorities; the question fixes priorities, but mention ageing as the usual remedy.' },
    ],
    sources: [`${N} (Unit 2)`, `${TB} §5.3.6, §5.7`, MID],
  },

  'os-mid-memory-view': {
    blocks: [
      'Each process sees its own **logical (virtual) address space**, laid out in segments from low to high addresses. The MMU maps it to physical memory.',
      { img: 'os-mem-layout' },
      { table: { head: ['Segment', 'Contents', 'Notes'], rows: [
        ['**Text (code)**', 'Machine instructions of the program', 'Read-only, fixed size, shareable'],
        ['**Initialised data**', 'Global and static variables with initial values (int x = 10;)', 'Read-write, fixed size'],
        ['**BSS**', 'Uninitialised global and static variables (int y;)', 'Zero-filled at load time'],
        ['**Heap**', 'Dynamically allocated memory (malloc, new)', 'Grows **upward**; managed by brk/sbrk and mmap'],
        ['**Stack**', 'Function frames: parameters, local variables, return addresses', 'Grows **downward**; one frame per call'],
        ['**Kernel space**', 'OS code and data', 'Top of the address space, not accessible in user mode'],
      ] } },
      'The free gap between heap and stack lets both grow and holds memory-mapped regions (shared libraries, mmap\'d files). Example: in int g = 5; int main() { int l; int *p = malloc(4); }, g is in data, l on the stack, the malloc block on the heap and main\'s code in text.',
    ],
    sources: [`${N} (Unit 3)`, `${TB} §3.1`, MID],
  },

  'os-mid-fragmentation': {
    blocks: [
      '**Fragmentation** is memory that is free but cannot be used effectively. It comes in two forms:',
      { img: 'os-fragmentation' },
      { table: { head: ['Basis', 'Internal fragmentation', 'External fragmentation'], rows: [
        ['Definition', 'Unused memory **inside an allocated block** (partition or page)', 'Free memory **between allocated blocks**, scattered in small non-contiguous holes'],
        ['Cause', 'Memory is allocated in **fixed-size** units larger than requested', 'Memory is allocated in **variable-size** pieces; processes load and leave'],
        ['Occurs in', 'Fixed partitioning, **paging** (last page of a process)', 'Variable (dynamic) partitioning, **segmentation**'],
        ['Example', 'A 72,766-byte process with 2,048-byte pages needs 35 pages + 1,086 bytes, so 36 frames; the last frame wastes 2,048 − 1,086 = 962 bytes', 'Holes of 40 KB, 30 KB and 30 KB = 100 KB free, but a 60 KB process cannot be loaded'],
        ['Solution', 'Smaller block/page sizes; best-fit partition sizes', '**Compaction**, paging, segmentation with paging'],
      ] } },
      'Statistically, with first fit, for every N allocated blocks about 0.5 N blocks are lost to external fragmentation (the **50-percent rule**).',
    ],
    sources: [`${N} (Unit 3)`, `${TB} §8.3.3`, MID],
  },

  'os-mid-producer-consumer': {
    blocks: [
      'In the **producer–consumer (bounded-buffer) problem**, a producer puts items into a shared buffer of **n** slots and a consumer takes them out. The solution must ensure: the producer waits when the buffer is **full**, the consumer waits when it is **empty**, and only one process changes the buffer at a time.',
      { img: 'os-bounded-buffer' },
      { table: { head: ['Semaphore', 'Initial value', 'Role'], rows: [['mutex', '1', 'Mutual exclusion on the buffer'], ['empty', 'n', 'Number of empty slots'], ['full', '0', 'Number of full slots']] } },
      { code: `/* Producer */                       /* Consumer */
do {                                  do {
    /* produce next_produced */           wait(full);    /* wait for an item */
    wait(empty);   /* wait for a slot */  wait(mutex);
    wait(mutex);                          /* remove item into next_consumed */
    /* add next_produced to buffer */     signal(mutex);
    signal(mutex);                        signal(empty); /* one more free slot */
    signal(full);  /* one more item */    /* consume next_consumed */
} while (true);                       } while (true);` },
      { ul: ['**Full buffer**: empty reaches 0, so the producer blocks on wait(empty) until the consumer signals empty.', '**Empty buffer**: full is 0, so the consumer blocks on wait(full) until the producer signals full.', '**Mutual exclusion**: mutex lets only one of them change the buffer and its in/out pointers at a time.', 'The order wait(empty) then wait(mutex) matters: reversing it can **deadlock** (a producer holding mutex sleeps on a full buffer, and the consumer can never get mutex to empty it).'] },
    ],
    sources: [`${N} (Unit 4)`, `${TB} §5.7.1`, MID],
  },

  'os-mid-raid': {
    blocks: [
      '**RAID (redundant array of independent disks)** combines several disks to improve **performance** through striping and **reliability** through redundancy (mirroring or parity).',
      { img: 'os-raid' },
      { table: { head: ['Level', 'Technique', 'Advantages', 'Limitations'], rows: [
        ['RAID 0', 'Block striping, no redundancy', 'Highest throughput; all capacity usable', 'No fault tolerance; one failure loses everything'],
        ['RAID 1', 'Mirroring', 'Survives a disk failure; fast reads; simple recovery', 'Only 50% capacity; costly'],
        ['RAID 2', 'Bit striping + Hamming-code disks', 'On-the-fly error correction', 'Many check disks; obsolete'],
        ['RAID 3', 'Byte striping + one parity disk', 'Good for large sequential I/O', 'Handles one request at a time'],
        ['RAID 4', 'Block striping + one parity disk', 'Good reads; survives one failure', 'Parity disk is a write bottleneck'],
        ['RAID 5', 'Block striping + distributed parity', 'Survives one failure; good reads; n − 1 disks of capacity', 'Slow small writes (read-modify-write of parity); long rebuild'],
        ['RAID 6', 'Distributed double parity (P + Q)', 'Survives two failures', 'Slower writes; two disks of overhead'],
        ['RAID 10', 'Mirror pairs, then stripe', 'Fast and reliable; quick rebuild', '50% capacity; at least four disks'],
      ] } },
      'In practice RAID 1/10 is used for performance-critical, reliable storage (databases) and RAID 5/6 for large storage where capacity matters.',
    ],
    sources: [`${N} (Unit 3)`, `${TB} §10.7`, MID],
  },

  'os-num-bankers-ct2': {
    blocks: [
      { h: 'Need matrix (Need = Max − Allocation)' },
      { table: { head: ['Thread', 'Allocation A B C D', 'Max A B C D', 'Need A B C D'], rows: [['T0', '2 1 0 6', '6 3 2 7', '**4 2 2 1**'], ['T1', '3 3 1 3', '5 4 1 5', '**2 1 0 2**'], ['T2', '2 3 1 2', '6 6 1 4', '**4 3 0 2**'], ['T3', '1 2 3 4', '4 3 4 5', '**3 1 1 1**'], ['T4', '3 0 3 0', '7 2 6 1', '**4 2 3 1**']] } },
      { h: 'Safety algorithm, Work = Available = (3, 5, 2, 1)' },
      { table: { head: ['Thread', 'Need ≤ Work?', 'Work = Work + Allocation'], rows: [
        ['T0', '4 2 2 1 ≤ 3 5 2 1? No (A)', '—'],
        ['T1', '2 1 0 2 ≤ 3 5 2 1? No (D)', '—'],
        ['T2', '4 3 0 2 ≤ 3 5 2 1? No', '—'],
        ['T3', '3 1 1 1 ≤ 3 5 2 1? **Yes**', '3 5 2 1 + 1 2 3 4 = **4 7 5 5**'],
        ['T4', '4 2 3 1 ≤ 4 7 5 5? **Yes**', '4 7 5 5 + 3 0 3 0 = **7 7 8 5**'],
        ['T0', '4 2 2 1 ≤ 7 7 8 5? **Yes**', '7 7 8 5 + 2 1 0 6 = **9 8 8 11**'],
        ['T1', '2 1 0 2 ≤ 9 8 8 11? **Yes**', '9 8 8 11 + 3 3 1 3 = **12 11 9 14**'],
        ['T2', '4 3 0 2 ≤ 12 11 9 14? **Yes**', '12 11 9 14 + 2 3 1 2 = **14 14 10 16**'],
      ] } },
      'Every thread can finish (Finish[i] = true for all i), so the system is in a **SAFE** state. Safe sequence: **⟨T3, T4, T0, T1, T2⟩**. The final Work, 14 14 10 16, equals the total resources (Available + all Allocation), a useful check.',
      { tip: 'Load this snapshot into the Banker\'s tool in the Numericals tab to replay the steps.' },
    ],
    sources: [`${N} (Unit 4)`, `${TB} §7.5.3`, MID, "Verified with the Banker's simulator"],
  },

  'os-mid-logging': {
    blocks: [
      { h: '(i) Logging' },
      '**Logging** is recording system events in **log files**, with a time stamp and the user or process involved: logins and failed logins, file accesses, privilege changes, errors, service starts and stops, network connections. Linux uses **syslog/rsyslog** and **journald** (/var/log/auth.log, journalctl); Windows uses the **Event Viewer** (Security, System and Application logs). Logs must be protected against tampering (append-only, sent to a separate log server) and rotated to control their size. Uses: troubleshooting, monitoring and forensic evidence.',
      { h: '(ii) Auditing' },
      '**Auditing** is the **systematic review of logs and system activity** to verify that security policies are followed, detect suspicious or unauthorised actions (intrusions, misuse of privileges) and make users **accountable**. An **audit trail** records who did what, when, where and with what result. Tools: Linux **auditd** (auditctl rules, ausearch, aureport), Windows audit policies. Auditing must be selective, since recording everything costs disk space and performance. Logging *records*; auditing *analyses* those records.',
      { h: '(iii) Recovery' },
      '**Recovery** restores the system and its data to a **consistent state** after a crash, power failure, disk failure or attack:',
      { ul: ['**Consistency checking**: fsck (UNIX) or chkdsk (Windows) compare metadata with data blocks and repair inconsistencies.', '**Journaling (log-structured) file systems**: metadata updates are first written to a journal as transactions; after a crash, committed transactions are replayed and incomplete ones discarded, so recovery is fast.', '**Backup and restore**: full, incremental and differential backups, kept partly off-site; restore lost files or the whole system.', '**Snapshots and RAID** protect against accidental deletion and disk failure.', 'After an attack: isolate, remove malware, patch, restore from clean backups and use the logs and audit trail to find the cause.'] },
      'Together: logs feed audits that detect problems, and logs, journals and backups make recovery possible.',
    ],
    sources: [`${N} (Unit 5)`, `${TB} §11.7, §15.6`, MID],
  },

  'os-mid-monitors': {
    blocks: [
      'A **monitor** is a high-level synchronisation construct: an abstract data type that groups **shared variables**, the **procedures** that operate on them and **initialisation code**, with the guarantee that **only one process at a time is active inside the monitor**. Programmers therefore do not have to place wait/signal calls for mutual exclusion themselves.',
      { code: `monitor ResourceAllocator {
    boolean busy = false;
    condition x;
    void acquire() { if (busy) x.wait(); busy = true; }
    void release() { busy = false; x.signal(); }
}` },
      { h: 'Condition variables' },
      '**x.wait()** suspends the calling process (releasing the monitor) until another process calls **x.signal()**, which resumes exactly one suspended process; if none is waiting, signal has no effect (unlike a semaphore\'s signal).',
      { h: 'Implementation using semaphores' },
      { ul: ['A semaphore **mutex = 1** guards the monitor: every external procedure F is replaced by wait(mutex); body of F; if (next_count > 0) signal(next); else signal(mutex);', 'A semaphore **next = 0** and an integer **next_count** hold processes that have signalled and are suspended (signal-and-wait).', 'For each condition x: a semaphore **x_sem = 0** and an integer **x_count = 0**.', '**x.wait()**: x_count++; if (next_count > 0) signal(next); else signal(mutex); wait(x_sem); x_count--;', '**x.signal()**: if (x_count > 0) { next_count++; signal(x_sem); wait(next); next_count--; }'] },
      'Monitors are supported by languages such as Java (synchronized methods with wait/notify), C# and Concurrent Pascal. They avoid the timing errors of hand-placed semaphore operations.',
    ],
    sources: [`${N} (Unit 4)`, `${TB} §5.8`, MID],
  },
}
