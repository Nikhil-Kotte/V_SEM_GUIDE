// Operating Systems, Unit IV: threads, synchronization and deadlocks.
// Follows the Unit 4 slides and Silberschatz, Galvin & Gagne chapters 4, 6, 7 and 8.
export default {
  'os.u4.threads': {
    oneLine: 'A thread is the basic unit of CPU utilisation inside a process, with its own thread ID, program counter, registers and stack but sharing the process\'s code, data and open files; threads give responsiveness, resource sharing, economy and scalability, and are mapped from user level to kernel level by the many-to-one, one-to-one or many-to-many model.',
    blocks: [
      { def: 'Thread', text: 'A **basic unit of CPU utilisation** (a "lightweight process"). It has its own **thread ID, program counter, register set and stack**, and **shares** with the other threads of the same process its **code section, data section and OS resources** such as open files and signals.' },
      { img: 'os-threads' },
      'A traditional (**heavyweight**) process has a single thread of control. A **multithreaded** process can do several tasks at once: a word processor may display text, read keystrokes and check spelling in separate threads; a web server creates a thread per client request.',
      { h: 'Benefits of multithreading' },
      { table: { head: ['Benefit', 'Meaning'], rows: [
        ['**Responsiveness**', 'A program keeps running even if part of it is blocked or doing a lengthy operation (e.g. the UI stays responsive)'],
        ['**Resource sharing**', 'Threads share the memory and resources of their process by default, unlike processes, which need shared memory or message passing'],
        ['**Economy**', 'Creating and context-switching threads is much cheaper than processes (in Solaris, creating a process is about 30 times slower)'],
        ['**Scalability**', 'Threads can run in parallel on multiple cores; a single-threaded process uses only one core'],
      ] } },
      { h: 'Process vs thread' },
      { table: { head: ['Process', 'Thread'], rows: [['Heavyweight; own address space', 'Lightweight; shares the address space'], ['Creation and context switch are costly', 'Creation and switch are cheap'], ['Communicate by IPC', 'Communicate through shared data'], ['One process blocking does not block others', 'With user threads, one blocking call may block all'], ['Isolated: a crash affects only itself', 'A faulty thread can corrupt the whole process']] } },
      { h: 'Types of threads' },
      { compare: [
        { title: 'User-level threads', items: ['Managed by a **thread library** in user space, without kernel support', 'Fast to create and switch (no system call)', 'Kernel sees only one process: a **blocking system call blocks all threads**; cannot use multiple cores', 'E.g. early Green threads, GNU Portable Threads'] },
        { title: 'Kernel-level threads', items: ['Supported and managed **directly by the OS**', 'The kernel can schedule threads on different cores; one blocking thread does not block others', 'Slower: creation and switching need system calls', 'E.g. Windows, Linux, macOS threads'] },
      ] },
      { h: 'Multithreading models (user → kernel threads)' },
      { img: 'os-many-to-one' },
      { ul: ['**Many-to-one**: many user threads mapped to one kernel thread. Efficient, but the whole process blocks if one thread makes a blocking call, and threads cannot run in parallel (Solaris Green threads).'] },
      { img: 'os-one-to-one' },
      { ul: ['**One-to-one**: each user thread maps to its own kernel thread. More concurrency and parallelism; the drawback is that creating a user thread creates a kernel thread, so the number may be limited (Linux, Windows).'] },
      { img: 'os-many-to-many' },
      { ul: ['**Many-to-many**: many user threads multiplexed onto a smaller or equal number of kernel threads; combines the advantages. A variation, the **two-level model**, also allows a user thread to be bound to a kernel thread.'] },
      { h: 'Threading issues' },
      { ul: ['Semantics of fork() and exec() in a multithreaded program (duplicate all threads or only the caller?).', '**Signal handling**: which thread receives a signal.', '**Thread cancellation**: asynchronous (immediately) or deferred (at cancellation points).', '**Thread pools**: create a number of threads in advance and reuse them.', '**Thread-local storage** and scheduler activations (LWPs).'] },
    ],
    terms: [['Thread', 'Unit of CPU use within a process.'], ['Multithreading', 'Several threads of control in one process.'], ['User thread', 'Managed by a library in user space.'], ['Kernel thread', 'Managed and scheduled by the OS.'], ['Thread pool', 'Pre-created threads reused for tasks.']],
    exam: 'Define a thread with the single- vs multithreaded process diagram, list the four benefits, compare process and thread and user vs kernel threads, and draw the three multithreading models with their pros and cons.',
    revise: ['Own: TID, PC, registers, stack; shared: code, data, files', 'Benefits: responsiveness, sharing, economy, scalability', 'Many-to-one, one-to-one, many-to-many'],
  },

  'os.u4.thread-apis': {
    oneLine: 'Programs create and manage threads through thread libraries: POSIX Pthreads (pthread_create, pthread_join, pthread_exit, mutexes), the Windows API (CreateThread, WaitForSingleObject) and Java threads (extending Thread or implementing Runnable, then start and join).',
    blocks: [
      { def: 'Thread library (thread API)', text: 'A library that gives the programmer an **API for creating and managing threads**. It may be implemented entirely in user space (user-level threads) or as a kernel-level library supported by the OS (system calls). The three main libraries are **POSIX Pthreads, Windows threads and Java threads**.' },
      { h: 'Strategies for creating threads' },
      { ul: ['**Asynchronous threading**: the parent creates a child thread and both run concurrently and independently.', '**Synchronous threading**: the parent creates children and waits for **all** of them to finish (fork–join) before continuing.'] },
      { h: '1. POSIX Pthreads' },
      'A **specification** (IEEE 1003.1c), not an implementation, for thread creation and synchronisation, common on UNIX, Linux and macOS.',
      { code: `#include <pthread.h>
#include <stdio.h>
int sum;                                 /* shared by the threads */
void *runner(void *param) {              /* the thread function */
    int upper = atoi(param);
    sum = 0;
    for (int i = 1; i <= upper; i++) sum += i;
    pthread_exit(0);
}
int main(int argc, char *argv[]) {
    pthread_t tid;                       /* thread identifier */
    pthread_attr_t attr;                 /* thread attributes */
    pthread_attr_init(&attr);            /* default attributes */
    pthread_create(&tid, &attr, runner, argv[1]);
    pthread_join(tid, NULL);             /* wait for the thread */
    printf("sum = %d\\n", sum);
}` },
      { table: { head: ['Function', 'Purpose'], rows: [['pthread_create()', 'Create a thread running a given function'], ['pthread_join()', 'Wait for a thread to terminate'], ['pthread_exit()', 'Terminate the calling thread'], ['pthread_self()', 'Return the caller\'s thread ID'], ['pthread_mutex_lock() / unlock()', 'Mutual exclusion locks'], ['pthread_cond_wait() / signal()', 'Condition variables'], ['pthread_cancel()', 'Request cancellation of a thread']] } },
      { h: '2. Windows threads' },
      { code: `DWORD WINAPI Summation(LPVOID Param) { /* … */ return 0; }
HANDLE th = CreateThread(NULL, 0, Summation, &Param, 0, &ThreadId);
WaitForSingleObject(th, INFINITE);    /* like pthread_join */
CloseHandle(th);` },
      'CreateThread() takes security attributes, stack size, the function, its parameter and creation flags; WaitForMultipleObjects() waits for several threads.',
      { h: '3. Java threads' },
      'Every Java program has at least one thread (main). Threads are created by **extending the Thread class** or, more commonly, **implementing the Runnable interface**; start() creates the new thread and calls run(); join() waits for it. Java also offers the Executor framework and thread pools.',
      { code: `class Task implements Runnable {
    public void run() { System.out.println("I am a thread"); }
}
Thread t = new Thread(new Task());
t.start();      // creates the thread and calls run()
t.join();       // wait for it to finish` },
      { h: 'Implicit threading' },
      'Thread pools, **fork–join**, **OpenMP** (#pragma omp parallel) and Grand Central Dispatch let the compiler or run-time library create and manage threads instead of the programmer.',
    ],
    terms: [['Pthreads', 'POSIX standard thread API.'], ['pthread_join', 'Wait for a thread to finish.'], ['Runnable', 'Java interface with a run() method.'], ['Fork–join', 'Parent waits for all child threads.']],
    exam: 'Define a thread library, explain asynchronous vs synchronous threading, write a Pthreads program with pthread_create and pthread_join, list the main Pthreads functions, and outline Windows (CreateThread) and Java (Runnable, start, join) threads.',
    revise: ['Pthreads: create, join, exit, mutex, cond', 'Windows: CreateThread, WaitForSingleObject', 'Java: Runnable / Thread, start(), join()'],
  },

  'os.u4.sync-issues': {
    oneLine: 'When cooperating processes or threads share data, concurrent access can leave it inconsistent (a race condition); the critical-section problem is to design a protocol so that only one process at a time runs its critical section, satisfying mutual exclusion, progress and bounded waiting.',
    blocks: [
      { def: 'Race condition', text: 'A situation in which **several processes access and manipulate the same data concurrently** and the **outcome depends on the particular order** in which the accesses take place.' },
      { example: 'Producer and consumer share count = 5. count++ is really register1 = count; register1 = register1 + 1; count = register1, and count-- likewise. If the six instructions interleave as: producer loads 5, consumer loads 5, producer stores 6, consumer stores 4, count ends as **4** (or 6), though the correct value is 5.' },
      { def: 'Critical section', text: 'A segment of code in which a process **accesses shared data** (variables, tables, files). The **critical-section problem** is to design a protocol so that **no two processes execute their critical sections at the same time**.' },
      { img: 'os-critical-section' },
      { code: `do {
    entry section        /* request permission */
        critical section
    exit section         /* release */
        remainder section
} while (true);` },
      { h: 'Requirements of a solution' },
      { table: { head: ['Requirement', 'Meaning'], rows: [
        ['**Mutual exclusion**', 'If one process is executing in its critical section, no other process may be in its critical section'],
        ['**Progress**', 'If no process is in its critical section, only processes not in their remainder section take part in choosing the next one, and the choice cannot be postponed indefinitely'],
        ['**Bounded waiting**', 'There is a limit on how many times other processes may enter their critical sections after a process has requested entry and before it is granted'],
      ] } },
      { h: 'Other synchronisation issues' },
      { ul: ['**Deadlock**: two or more processes wait forever for each other (e.g. each holds one semaphore and waits for the other).', '**Starvation (indefinite blocking)**: a process waits indefinitely, e.g. never removed from a semaphore queue served in LIFO order.', '**Priority inversion**: a high-priority process waits for a lock held by a low-priority one, which is pre-empted by a medium-priority process; solved by **priority inheritance**.', 'In the kernel: **pre-emptive kernels** must protect kernel data structures; non-pre-emptive kernels are free of kernel race conditions.'] },
    ],
    terms: [['Race condition', 'Result depends on the interleaving of accesses.'], ['Critical section', 'Code that touches shared data.'], ['Mutual exclusion', 'Only one process in the critical section.'], ['Priority inversion', 'High-priority task blocked by a lower one.']],
    exam: 'Define a race condition with the count++ / count-- example, define the critical section with the entry/exit structure, and explain the three requirements: mutual exclusion, progress and bounded waiting. Mention deadlock, starvation and priority inversion.',
    revise: ['Race: outcome depends on order', 'Entry → critical → exit → remainder', 'Mutual exclusion, progress, bounded waiting'],
  },

  'os.u4.sync-solutions': {
    oneLine: 'The critical-section problem is solved in software by Peterson\'s algorithm, in hardware by atomic instructions such as test_and_set and compare_and_swap, and by higher-level tools built on them: mutex locks, semaphores (wait/signal on an integer) and monitors (an abstract type whose procedures run with mutual exclusion and use condition variables).',
    blocks: [
      { h: '1. Software solution: Peterson\'s algorithm' },
      'For **two processes** Pi and Pj sharing int turn and boolean flag[2]. flag[i] = true means Pi is ready; turn says whose turn it is.',
      { code: `do {
    flag[i] = true;
    turn = j;                         /* let the other go first */
    while (flag[j] && turn == j);     /* busy wait */
        /* critical section */
    flag[i] = false;
        /* remainder section */
} while (true);` },
      'It satisfies **mutual exclusion, progress and bounded waiting**, but may fail on modern architectures that reorder memory operations.',
      { h: '2. Hardware solutions' },
      { ul: ['**Disabling interrupts** (uniprocessor only): no pre-emption during the critical section; unsuitable for multiprocessors.', '**test_and_set()**: atomically returns the old value of a boolean and sets it to true.', '**compare_and_swap()**: atomically sets a value to a new value only if it equals the expected value.', '**Atomic variables** built on these (atomic increment).'] },
      { code: `boolean test_and_set(boolean *target) {   /* executed atomically */
    boolean rv = *target;
    *target = true;
    return rv;
}
do {
    while (test_and_set(&lock));   /* spin until lock was false */
        /* critical section */
    lock = false;
        /* remainder section */
} while (true);` },
      { h: '3. Mutex locks' },
      'A **mutex** (mutual exclusion) lock has a boolean available; acquire() waits until it is available and takes it, release() frees it. Both are atomic. A lock that busy-waits is a **spinlock**: wasteful on one CPU but useful on multiprocessors for short waits (no context switch).',
      { h: '4. Semaphores' },
      { def: 'Semaphore', text: 'An **integer variable** S that, apart from initialisation, is accessed only through two **atomic** operations: **wait() (P)** and **signal() (V)**. Proposed by Dijkstra.' },
      { code: `wait(S) {               /* P: proberen, "to test" */
    while (S <= 0);     /* busy wait (or block) */
    S--;
}
signal(S) {             /* V: verhogen, "to increment" */
    S++;
}` },
      { ul: ['**Binary semaphore** (0 or 1): behaves like a mutex lock; used for mutual exclusion (initialise mutex = 1; wait(mutex); critical section; signal(mutex)).', '**Counting semaphore** (any value): controls access to a resource with a **finite number of instances**; initialised to the number of instances.', '**Ordering**: to make S2 in P2 run after S1 in P1, initialise synch = 0; P1: S1; signal(synch); P2: wait(synch); S2.'] },
      'Implementation without busy waiting: each semaphore has a value and a **list of waiting processes**. wait() decrements and, if the value is negative, adds the process to the list and **blocks** it; signal() increments and, if processes are waiting, removes one and **wakes it up**. A negative value gives the number of waiting processes.',
      { code: `typedef struct { int value; struct process *list; } semaphore;
wait(semaphore *S)   { S->value--; if (S->value < 0) { add this process to S->list; block(); } }
signal(semaphore *S) { S->value++; if (S->value <= 0) { remove P from S->list; wakeup(P); } }` },
      { warn: 'Incorrect use of semaphores, such as swapping wait and signal, or calling wait twice, breaks mutual exclusion or causes deadlock. Monitors were designed to avoid these errors.' },
      { h: '5. Monitors' },
      { def: 'Monitor', text: 'A **high-level synchronisation construct**: an abstract data type that encapsulates **shared variables** with the **procedures** that operate on them and **initialisation code**. Only **one process at a time can be active inside the monitor**, so mutual exclusion is automatic.' },
      { code: `monitor monitor_name {
    /* shared variable declarations */
    condition x, y;
    procedure P1(...) { ... }
    procedure P2(...) { ... }
    initialization_code(...) { ... }
}` },
      { ul: ['**Condition variables** let a process wait inside the monitor: **x.wait()** suspends the caller until another process calls **x.signal()**, which resumes exactly one waiting process (no effect if none is waiting, unlike a semaphore signal).', '**Signal and wait** (the signaller waits) vs **signal and continue** (the resumed process waits until the signaller leaves).', '**Implementation with semaphores**: a semaphore mutex (= 1) guards entry to the monitor; each procedure is wrapped in wait(mutex) … signal(mutex); a semaphore next (= 0) and next_count hold signalling processes; each condition x has a semaphore x_sem (= 0) and a count x_count.', 'Languages: Java synchronized methods with wait()/notify(), C# and Concurrent Pascal.'] },
      { compare: [
        { title: 'Semaphore', items: ['Low-level integer with wait/signal', 'Programmer must place the calls correctly', 'signal() is remembered (increments)', 'Can be used anywhere'] },
        { title: 'Monitor', items: ['High-level language construct', 'Mutual exclusion is automatic', 'x.signal() is lost if nobody waits', 'Safer, less error-prone'] },
      ] },
      { tip: 'Class Test II asked "What are semaphores and how are they used in synchronization?" (2M) and "Write a short note on the implementation of monitors" (3M). Both come straight from this topic.' },
    ],
    terms: [['Peterson\'s algorithm', 'Two-process software solution using flag and turn.'], ['test_and_set', 'Atomic hardware instruction for locks.'], ['Spinlock', 'A lock that busy-waits.'], ['Semaphore', 'Integer accessed by atomic wait and signal.'], ['Monitor', 'ADT whose procedures run with mutual exclusion.'], ['Condition variable', 'Queue inside a monitor with wait and signal.']],
    exam: 'Explain Peterson\'s solution and show it meets the three requirements, the hardware instructions test_and_set and compare_and_swap, mutex locks, semaphores (definition, wait/signal code, binary vs counting, blocking implementation) and monitors (structure, condition variables, implementation with semaphores, comparison).',
    revise: ['Peterson: flag[i] + turn', 'Hardware: test_and_set, compare_and_swap', 'Semaphore: wait (P) −, signal (V) +; binary vs counting', 'Monitor: one active process; condition x.wait / x.signal'],
  },

  'os.u4.classical': {
    oneLine: 'Three classical problems are used to test synchronisation schemes: the bounded-buffer (producer–consumer) problem solved with mutex, empty and full semaphores; the readers–writers problem where readers may share but writers need exclusive access; and the dining-philosophers problem, where naive solutions deadlock or starve.',
    blocks: [
      { h: '1. Bounded-buffer (producer–consumer) problem' },
      { def: 'Producer–consumer problem', text: 'A **producer** process puts items into a buffer of **n slots** and a **consumer** removes them. The producer must not add to a **full** buffer, the consumer must not remove from an **empty** one, and both must not update the buffer at the same time.' },
      { img: 'os-bounded-buffer' },
      { table: { head: ['Semaphore', 'Initial value', 'Purpose'], rows: [['**mutex**', '1', 'Mutual exclusion on the buffer'], ['**empty**', 'n', 'Counts empty slots'], ['**full**', '0', 'Counts full slots']] } },
      { code: `/* Producer */                     /* Consumer */
do {                                do {
    /* produce an item */               wait(full);
    wait(empty);                        wait(mutex);
    wait(mutex);                        /* remove an item from buffer */
    /* add the item to buffer */        signal(mutex);
    signal(mutex);                      signal(empty);
    signal(full);                       /* consume the item */
} while (true);                     } while (true);` },
      { ul: ['The producer waits on **empty** (blocks when the buffer is full); the consumer waits on **full** (blocks when it is empty).', '**mutex** ensures only one of them changes the buffer at a time.', 'Order matters: calling wait(mutex) **before** wait(empty) could deadlock, since a producer holding mutex would sleep on a full buffer and the consumer could never get in.'] },
      { h: '2. Readers–writers problem' },
      'A shared database: **readers** only read, **writers** update. Many readers may read at once, but a writer needs **exclusive access**. The **first readers–writers problem** gives readers priority (writers may starve); the second gives writers priority.',
      { code: `semaphore rw_mutex = 1, mutex = 1;  int read_count = 0;
/* Writer */                    /* Reader */
wait(rw_mutex);                 wait(mutex);
  /* writing */                   read_count++;
signal(rw_mutex);                 if (read_count == 1) wait(rw_mutex);   /* first reader locks out writers */
                                signal(mutex);
                                  /* reading */
                                wait(mutex);
                                  read_count--;
                                  if (read_count == 0) signal(rw_mutex); /* last reader lets writers in */
                                signal(mutex);` },
      'Many systems provide **reader–writer locks** that can be acquired in read mode or write mode.',
      { h: '3. Dining-philosophers problem' },
      { img: 'os-dining' },
      { def: 'Dining philosophers', text: 'Five philosophers sit at a round table, alternately **thinking and eating**. There are **five chopsticks**, one between each pair. To eat, a philosopher needs **both** the left and right chopsticks, picking up one at a time. It models allocating several resources among several processes without deadlock and starvation.' },
      { code: `semaphore chopstick[5];   /* all initialised to 1 */
do {
    wait(chopstick[i]);
    wait(chopstick[(i + 1) % 5]);
        /* eat */
    signal(chopstick[i]);
    signal(chopstick[(i + 1) % 5]);
        /* think */
} while (true);` },
      { h: 'Deadlock and starvation in the dining philosophers' },
      { ul: ['**Deadlock**: if all five become hungry at once and each picks up their **left** chopstick, every chopstick is taken; each waits forever for the right one. All four conditions hold (mutual exclusion on chopsticks, hold and wait, no pre-emption, circular wait).', '**Starvation**: even without deadlock, a philosopher may never get both chopsticks because the neighbours keep eating alternately; the philosopher waits indefinitely.'] },
      { h: 'Remedies' },
      { ul: ['Allow at most **four** philosophers at the table at once.', 'Pick up chopsticks **only if both are available** (inside a critical section / monitor).', '**Asymmetric** solution: odd philosophers pick left first, even ones right first (breaks circular wait).', '**Monitor solution**: states THINKING, HUNGRY, EATING; a philosopher eats only if neither neighbour is eating (deadlock-free, but starvation is still possible unless a fairness rule is added).'] },
      { tip: 'Class Test II: producer–consumer with semaphores (4M) and deadlock and starvation in dining philosophers (3M). Write the semaphore table and code for the first; for the second, explain both problems with the "everyone picks up the left chopstick" scenario and give remedies.' },
    ],
    terms: [['Bounded buffer', 'Fixed-size buffer shared by producer and consumer.'], ['empty / full', 'Counting semaphores for free and used slots.'], ['read_count', 'Number of readers currently reading.'], ['Asymmetric solution', 'Odd and even philosophers pick chopsticks in different orders.']],
    exam: 'For producer–consumer give the semaphores, their initial values and the producer and consumer code and explain how each condition is enforced; for readers–writers give the code and the priority issue; for dining philosophers give the setup and code, explain deadlock and starvation, and list remedies.',
    revise: ['mutex = 1, empty = n, full = 0', 'Producer: wait(empty), wait(mutex) … signal(mutex), signal(full)', 'Readers share; writer exclusive; first reader locks rw_mutex', 'Dining: all pick left → deadlock; remedies: 4 seats, both-or-none, asymmetric'],
  },

  'os.u4.deadlock-intro': {
    oneLine: 'A deadlock is a state in which a set of processes each wait for a resource held by another process in the set, so none can proceed; it can arise only if mutual exclusion, hold and wait, no pre-emption and circular wait all hold at the same time.',
    blocks: [
      { def: 'Deadlock', text: 'A set of processes is in a **deadlocked state** when **every process in the set is waiting for an event (the release of a resource) that can be caused only by another process in the set**. None of them can ever proceed.' },
      { h: 'System model' },
      'Resources (CPU cycles, memory, files, I/O devices, locks) are of types R1 … Rm, each with Wi instances. A process uses a resource in the sequence: **request → use → release**. Requests and releases are system calls (open/close, allocate/free, wait/signal).',
      { example: 'Process P1 holds the printer and requests the scanner; P2 holds the scanner and requests the printer. Both wait forever. In code: two threads lock mutexes in opposite orders (T1: lock A, lock B; T2: lock B, lock A).' },
      { h: 'Necessary conditions (Coffman conditions)' },
      { table: { head: ['Condition', 'Meaning'], rows: [
        ['**Mutual exclusion**', 'At least one resource is held in a non-sharable mode: only one process can use it at a time'],
        ['**Hold and wait**', 'A process holds at least one resource and waits to acquire more that are held by others'],
        ['**No pre-emption**', 'A resource can be released only voluntarily by the process holding it, after it has finished'],
        ['**Circular wait**', 'A set {P0, P1, …, Pn} exists where P0 waits for P1, P1 for P2, …, and Pn for P0'],
      ] } },
      'All four must hold **simultaneously** for a deadlock to occur; circular wait implies hold and wait, so the conditions are not completely independent.',
      { h: 'Methods for handling deadlocks' },
      { ul: ['**Prevention**: ensure at least one of the four conditions can never hold.', '**Avoidance**: use advance information about maximum needs to keep the system in a safe state (Banker\'s algorithm).', '**Detection and recovery**: allow deadlocks, detect them and recover.', '**Ignore the problem** (the ostrich approach), used by most OSes including Linux and Windows; the programmer must prevent deadlock.'] },
      { compare: [
        { title: 'Deadlock', items: ['Processes wait for each other in a cycle', 'No process can ever proceed', 'Caused by the four conditions'] },
        { title: 'Starvation', items: ['A process waits indefinitely while others proceed', 'Others make progress', 'Caused by unfair scheduling; fixed by ageing'] },
      ] },
    ],
    terms: [['Deadlock', 'Processes waiting forever on each other.'], ['Hold and wait', 'Holding resources while waiting for more.'], ['Circular wait', 'A cycle of processes each waiting on the next.'], ['Ostrich approach', 'Ignoring deadlocks.']],
    exam: 'Define deadlock with an example, describe the request–use–release model, explain the four necessary conditions, list the four handling methods, and distinguish deadlock from starvation.',
    revise: ['Mutual exclusion, hold and wait, no pre-emption, circular wait', 'All four simultaneously', 'Prevent, avoid, detect + recover, ignore'],
  },

  'os.u4.rag': {
    oneLine: 'A resource-allocation graph has process nodes (circles) and resource nodes (rectangles with dots for instances), request edges P → R and assignment edges R → P; no cycle means no deadlock, and a cycle means deadlock if each resource has a single instance but only a possibility of deadlock otherwise.',
    blocks: [
      { def: 'Resource-allocation graph (RAG)', text: 'A directed graph that describes deadlocks precisely. Vertices are of two kinds: **processes** P = {P1, …, Pn} drawn as circles, and **resource types** R = {R1, …, Rm} drawn as rectangles with one **dot per instance**.' },
      { ul: ['**Request edge** Pi → Rj: Pi has requested an instance of Rj and is waiting.', '**Assignment edge** Rj → Pi: an instance of Rj has been allocated to Pi (drawn from the dot).', 'When a request is granted, the request edge becomes an assignment edge; on release, the assignment edge is deleted.'] },
      { img: 'os-rag' },
      { h: 'Reading a RAG' },
      { table: { head: ['Graph', 'Conclusion'], rows: [['**No cycle**', 'No process is deadlocked'], ['**Cycle, single instance per resource type**', 'A deadlock **exists** (cycle is necessary and sufficient)'], ['**Cycle, several instances**', 'A deadlock **may** exist (cycle is necessary but not sufficient)']] } },
      { img: 'os-rag-deadlock' },
      { example: 'P1 → R1 → P2 → R3 → P3 → R2 → P1 with single instances of R1 and R3 and R2 fully held: P1, P2 and P3 are deadlocked. But in a graph P1 → R1 → P3 → R2 → P1 where P2 and P4 also hold instances of R1 and R2, P4 can release R2 and break the cycle: there is a cycle but **no deadlock**.' },
      { h: 'Uses of the RAG' },
      { ul: ['**Deadlock avoidance** (single instances): add **claim edges** Pi ⇢ Rj (dashed) for future requests; grant a request only if converting it to an assignment edge does not create a cycle.', '**Deadlock detection** (single instances): collapse resource nodes to get a **wait-for graph** (Pi → Pj if Pi waits for a resource held by Pj) and search it for cycles (O(n²)).'] },
    ],
    terms: [['Request edge', 'P → R: process waits for the resource.'], ['Assignment edge', 'R → P: resource allocated to the process.'], ['Claim edge', 'Dashed P ⇢ R: may request in future.'], ['Wait-for graph', 'RAG with resource nodes removed.']],
    exam: 'Define the RAG with its node and edge types, draw a graph with and without deadlock, state the cycle rules for single and multiple instances, and mention claim edges (avoidance) and wait-for graphs (detection).',
    revise: ['Circle = process, box with dots = resource', 'P → R request; R → P assignment', 'No cycle → no deadlock; cycle + single instances → deadlock'],
  },

  'os.u4.deadlock-prevention': {
    oneLine: 'Deadlock prevention ensures that at least one of the four necessary conditions can never hold: share what can be shared, make processes request all resources at once or release before requesting, pre-empt resources, or impose a total ordering on resource types so circular wait is impossible.',
    blocks: [
      { def: 'Deadlock prevention', text: 'A set of methods that **ensure at least one of the necessary conditions cannot hold**, by constraining how requests can be made. It is static and simple but can lower device utilisation and throughput.' },
      { table: { head: ['Condition', 'How to break it', 'Drawback'], rows: [
        ['**Mutual exclusion**', 'Use **sharable** resources where possible (read-only files need no exclusive access)', 'Some resources are intrinsically non-sharable (printers, mutex locks), so this cannot always be denied'],
        ['**Hold and wait**', '(a) Request and be allocated **all resources before execution starts**, or (b) request resources **only when holding none** (release all first)', 'Low resource utilisation; **starvation** of processes needing many popular resources'],
        ['**No pre-emption**', 'If a process holding resources requests one that cannot be granted, **all its held resources are pre-empted** (released) and it restarts when it can regain them all; or pre-empt from a waiting process', 'Only works for resources whose state can be saved and restored (CPU registers, memory), not printers or locks'],
        ['**Circular wait**', 'Impose a **total ordering** of resource types; every process requests resources in **increasing order** of enumeration (F(Ri)). If it needs a lower one, it must first release the higher ones', 'Programmer must follow the order; can reduce flexibility'],
      ] } },
      { example: 'Ordering: F(tape drive) = 1, F(disk drive) = 5, F(printer) = 12. A process that wants the tape drive and the printer must request the tape drive first, then the printer. Since everyone climbs the same order, no cycle can form. Proof: if a cycle existed, F(R0) < F(R1) < … < F(Rn) < F(R0), which is impossible.' },
      'Breaking **circular wait** is the most practical method; lock-order checkers (e.g. witness in BSD) help programmers follow the ordering.',
      { compare: [
        { title: 'Prevention', items: ['Constrains how requests are made', 'No run-time information needed', 'Low utilisation and throughput'] },
        { title: 'Avoidance', items: ['Decides each request dynamically', 'Needs maximum needs in advance', 'Better utilisation, run-time overhead'] },
      ] },
    ],
    terms: [['Total ordering', 'Numbering resource types to request in increasing order.'], ['Pre-emption', 'Taking a resource away from a process.']],
    exam: 'Define deadlock prevention, then for each of the four conditions explain how to deny it and its drawback (a table works well), with the resource-ordering example and why it prevents circular wait.',
    revise: ['Mutual exclusion: sharable resources (not always possible)', 'Hold and wait: all at once / release first', 'No pre-emption: take resources away', 'Circular wait: request in increasing order'],
  },

  'os.u4.deadlock-avoidance': {
    oneLine: 'Deadlock avoidance needs each process to declare its maximum need; the system grants a request only if the resulting state is safe, meaning a safe sequence exists in which every process can finish. The Banker\'s algorithm checks this with the Available, Max, Allocation and Need matrices.',
    blocks: [
      { def: 'Deadlock avoidance', text: 'Each process declares the **maximum number of resources of each type** it may need. On every request the system decides whether granting it keeps the system in a **safe state**; if not, the process waits, even if the resources are free.' },
      { def: 'Safe state', text: 'A state is **safe** if there is a **safe sequence** ⟨P1, P2, …, Pn⟩ such that, for each Pi, the resources Pi can still request can be satisfied by the currently available resources plus those held by all Pj with j < i. A safe state has no deadlock; an unsafe state **may** lead to deadlock.' },
      { img: 'os-safe-state' },
      'For single-instance resources the **RAG algorithm** with claim edges is used; for **multiple instances**, the **Banker\'s algorithm** (named after a banker who never lends so that he cannot satisfy all customers).',
      { h: 'Data structures (n processes, m resource types)' },
      { table: { head: ['Structure', 'Meaning'], rows: [['**Available[m]**', 'Number of free instances of each type'], ['**Max[n][m]**', 'Maximum demand of each process'], ['**Allocation[n][m]**', 'Instances currently allocated to each process'], ['**Need[n][m]**', 'Remaining need: **Need = Max − Allocation**']] } },
      { h: 'Safety algorithm' },
      { steps: ['Work = Available; Finish[i] = false for all i.', 'Find an i with Finish[i] = false and **Need[i] ≤ Work**. If none, go to step 4.', 'Work = Work + Allocation[i]; Finish[i] = true (Pi finishes and releases its resources). Go to step 2.', 'If Finish[i] is true for all i, the system is **safe**; otherwise it is unsafe.'] },
      { h: 'Resource-request algorithm (for a request Request_i)' },
      { steps: ['If Request_i ≤ Need[i] go on; otherwise error (exceeded the maximum claim).', 'If Request_i ≤ Available go on; otherwise Pi must wait.', 'Pretend to allocate: Available −= Request_i; Allocation[i] += Request_i; Need[i] −= Request_i.', 'Run the safety algorithm: if safe, grant the request; if unsafe, Pi waits and the old state is restored.'] },
      { h: 'Worked example (Class Test II, question 5b)' },
      'Resources A B C D, Available = (3, 5, 2, 1).',
      { table: { head: ['Thread', 'Allocation', 'Max', 'Need = Max − Allocation'], rows: [['T0', '2 1 0 6', '6 3 2 7', '**4 2 2 1**'], ['T1', '3 3 1 3', '5 4 1 5', '**2 1 0 2**'], ['T2', '2 3 1 2', '6 6 1 4', '**4 3 0 2**'], ['T3', '1 2 3 4', '4 3 4 5', '**3 1 1 1**'], ['T4', '3 0 3 0', '7 2 6 1', '**4 2 3 1**']] } },
      { table: { head: ['Check', 'Need ≤ Work?', 'Work after it finishes'], rows: [['Start', '—', '3 5 2 1'], ['T0: 4 2 2 1 ≤ 3 5 2 1', 'No (A: 4 > 3), skip', '3 5 2 1'], ['T1: 2 1 0 2 ≤ 3 5 2 1', 'No (D: 2 > 1), skip', '3 5 2 1'], ['T2: 4 3 0 2 ≤ 3 5 2 1', 'No, skip', '3 5 2 1'], ['T3: 3 1 1 1 ≤ 3 5 2 1', '**Yes**', '3521 + 1234 = **4 7 5 5**'], ['T4: 4 2 3 1 ≤ 4 7 5 5', '**Yes**', '4755 + 3030 = **7 7 8 5**'], ['T0: 4 2 2 1 ≤ 7 7 8 5', '**Yes**', '7785 + 2106 = **9 8 8 11**'], ['T1: 2 1 0 2 ≤ 9 8 8 11', '**Yes**', '+ 3313 = **12 11 9 14**'], ['T2: 4 3 0 2 ≤ 12 11 9 14', '**Yes**', '+ 2312 = **14 14 10 16**']] } },
      'All threads can finish, so the system is in a **safe state** with safe sequence **⟨T3, T4, T0, T1, T2⟩**. (Other safe sequences may also exist.)',
      'Try any snapshot and request in the tool:',
      { sim: 'os-bankers' },
    ],
    terms: [['Safe sequence', 'An order in which all processes can finish.'], ['Need', 'Max − Allocation.'], ['Work', 'Resources available during the safety check.']],
    exam: 'Define avoidance, safe state and safe sequence (with the safe/unsafe/deadlock diagram), list the Banker\'s data structures, write the safety and resource-request algorithms, then solve the numerical: Need matrix, step-by-step Work table, the safe sequence and the conclusion.',
    revise: ['Need = Max − Allocation', 'Pick Need ≤ Work; Work += Allocation', 'All finish → safe', 'CT2: safe, ⟨T3, T4, T0, T1, T2⟩'],
  },

  'os.u4.deadlock-recovery': {
    oneLine: 'When a deadlock is detected (with a wait-for graph or a detection algorithm), the system recovers either by terminating processes (all deadlocked ones, or one at a time until the cycle breaks) or by pre-empting resources, choosing a victim at minimum cost, rolling it back and avoiding starvation.',
    blocks: [
      { h: 'Deadlock detection (needed before recovery)' },
      { ul: ['**Single instance of each resource**: maintain a **wait-for graph** and periodically search it for a cycle; a cycle means deadlock.', '**Several instances**: a detection algorithm like the safety algorithm, but using **Request** (current requests) instead of Need: processes whose Request ≤ Work are assumed to finish; any process left unfinished is deadlocked.', '**When to run it**: on every request that cannot be granted (costly), at fixed intervals, or when CPU utilisation drops (e.g. below 40%).'] },
      { def: 'Deadlock recovery', text: 'Breaking a deadlock after it has been detected, either by **aborting processes** or by **pre-empting resources** from some processes.' },
      { h: '1. Process termination' },
      { ul: ['**Abort all deadlocked processes**: certainly breaks the cycle, but at great expense: long computations are lost.', '**Abort one process at a time** until the cycle is eliminated: less waste, but the detection algorithm must run after each abort.'] },
      'Choosing which process to abort (minimum cost) depends on: its **priority**; how long it has computed and how much longer it needs; the **resources** it has used and needs; how many processes would have to be terminated; whether it is **interactive or batch**.',
      { h: '2. Resource pre-emption' },
      { table: { head: ['Issue', 'Meaning'], rows: [['**Selecting a victim**', 'Which resources and which process to pre-empt, to minimise cost (number of resources held, time consumed)'], ['**Rollback**', 'The pre-empted process cannot continue normally; it is rolled back to a **safe state** (total rollback: abort and restart; or partial rollback to a checkpoint)'], ['**Starvation**', 'The same process may always be picked as the victim; include the **number of rollbacks** in the cost factor so a process is chosen only a small, finite number of times']] } },
      { compare: [
        { title: 'Process termination', items: ['Simple', 'Loses the work of aborted processes', 'Can leave files or data inconsistent (e.g. half-printed output)'] },
        { title: 'Resource pre-emption', items: ['Keeps processes alive', 'Needs rollback and checkpointing', 'Risk of starvation'] },
      ] },
    ],
    terms: [['Wait-for graph', 'Graph of which process waits for which.'], ['Victim', 'Process chosen to abort or pre-empt.'], ['Rollback', 'Returning a process to a safe earlier state.'], ['Checkpoint', 'Saved state used for partial rollback.']],
    exam: 'Explain detection (wait-for graph, detection algorithm, when to invoke), then recovery by process termination (two methods, factors for choosing) and by resource pre-emption (victim selection, rollback, starvation).',
    revise: ['Detect: wait-for graph / detection algorithm', 'Terminate all, or one at a time (by cost)', 'Pre-empt: victim, rollback, avoid starvation'],
  },
}
