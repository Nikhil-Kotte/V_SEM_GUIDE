// OS Unit IV model answers (concurrency, synchronisation, deadlocks). Keyed by PYQ id.
const U4 = 'OS Unit-4 slides'
const TB = 'Silberschatz, Operating System Concepts 8e'

const PVT_TABLE = { table: { head: ['Basis', 'Process', 'Thread'], rows: [
  ['Definition', 'A program in execution with its own resources', 'A lightweight unit of execution inside a process'],
  ['Address space', 'Separate for each process', 'Shared with other threads of the process'],
  ['Creation / termination', 'Heavy and slow (copy/allocate address space)', 'Light and fast'],
  ['Context switch', 'Slow (switch memory maps, flush TLB)', 'Fast (only registers, stack, PC)'],
  ['Communication', 'Needs IPC (pipes, message queues, shared memory)', 'Directly through shared variables'],
  ['Resources', 'Owns code, data, files, memory', 'Owns only stack, registers, PC, thread ID'],
  ['Failure isolation', 'A crash does not affect other processes', 'A crashing thread can bring down the whole process'],
  ['Control block', 'PCB', 'TCB'],
] } }

export default {
  'os-proc-vs-thread-short': {
    blocks: [
      'A **process** is a program in execution with its own address space and resources; a **thread** is a lightweight unit of execution within a process that shares the process\'s code, data and open files but has its own program counter, registers and stack.',
      { ul: ['Process creation and context switching are heavy; threads are cheap to create and switch.', 'Processes communicate via IPC; threads communicate through shared memory.', 'Processes are isolated; a fault in one thread can crash its whole process.'] },
    ],
    sources: [`${U4} slides 5–10`, `${TB} §4.1`],
  },

  'os-ult-klt': {
    blocks: [
      { compare: [
        { title: 'User-level threads (ULT)', items: ['Managed by a thread library in user space; the kernel sees only the process', 'Fast to create and switch (no system call)', 'Portable; custom scheduling possible', 'A blocking system call blocks **all** threads of the process', 'Cannot run in parallel on multiple CPUs (many-to-one)'] },
        { title: 'Kernel-level threads (KLT)', items: ['Created and scheduled by the OS kernel', 'Slower (system call and kernel data structures)', 'If one thread blocks, others continue', 'Threads run truly in parallel on multicore systems', 'Examples: Linux, Windows threads'] },
      ] },
    ],
    sources: [`${U4} slides 15–20`, `${TB} §4.2`],
  },

  'os-thread-benefits': {
    blocks: [
      { ol: ['**Responsiveness**: an interactive application keeps responding while one thread does a long operation (e.g. a browser loads an image while you scroll).', '**Resource sharing**: threads share the memory and resources of their process by default — no explicit IPC is needed.', '**Economy**: creating and context-switching threads is much cheaper than processes (in Solaris, creating a process is ~30× slower than a thread).', '**Scalability (multiprocessor utilisation)**: threads can run in parallel on different cores, speeding up a single application.'] },
    ],
    sources: [`${U4} slide 11`, `${TB} §4.1.2`],
  },

  'os-race': {
    blocks: [
      'A **race condition** is a situation where several processes or threads access and manipulate **shared data concurrently**, and the final result **depends on the particular order** in which the accesses take place.',
      'Example: `counter++` (load, add, store) by a producer and `counter--` by a consumer, interleaved, can leave counter = 4 or 6 instead of 5. Race conditions are prevented by making the code that touches shared data a **critical section** with mutual exclusion.',
    ],
    sources: [`${U4} slides 34–38`, `${TB} §6.1`],
  },

  'os-dekker-peterson': {
    blocks: [
      { compare: [
        { title: 'Dekker\'s algorithm', items: ['The first known correct software solution for two processes (1965)', 'Uses `flag[2]` and `turn`', 'When both want to enter, the process whose turn it isn\'t **withdraws its flag**, waits for its turn, then retries — more complex logic with nested loops'] },
        { title: 'Peterson\'s algorithm', items: ['A simpler solution (1981) with the same guarantees', 'Uses `flag[2]` and `turn`', 'Each process sets its flag, gives the turn to the other, and waits only while the other wants in **and** it is the other\'s turn'] },
      ] },
      'Both satisfy mutual exclusion, progress and bounded waiting; Peterson\'s is shorter and easier to prove correct. Both need memory barriers on modern CPUs.',
    ],
    sources: [`${U4} slides 44–46`, `${TB} §6.3`],
  },

  'os-semaphore-short': {
    blocks: [
      'A **semaphore** is an integer variable accessed only through two atomic operations: **wait()** (P — decrement, block if the value becomes negative / is zero) and **signal()** (V — increment, wake a waiting process).',
      { ul: ['**Mutual exclusion**: a binary semaphore `mutex = 1` with `wait(mutex); critical section; signal(mutex);`.', '**Counting resources**: a counting semaphore initialised to the number of instances (e.g. buffer slots).', '**Ordering**: S = 0; P1 executes S1 then `signal(S)`; P2 does `wait(S)` before S2, so S2 runs after S1.'] },
    ],
    sources: [`${U4} slides 51–54`, `${TB} §6.6`],
  },

  'os-mutex-features': {
    blocks: [
      { ul: ['**Binary state**: locked or unlocked.', '**Ownership**: only the thread that locked the mutex may unlock it (unlike a binary semaphore).', '**Mutual exclusion** for one critical section at a time.', 'Operations: `lock()`/`acquire()` and `unlock()`/`release()`; `trylock()` returns immediately if locked.', 'Often supports **priority inheritance** to avoid priority inversion (RTOS).', 'Can be recursive (the owner may lock it again) in some implementations.'] },
    ],
    sources: [`${TB} §6.5`, 'RTOS notes'],
  },

  'os-deadlock-conditions': {
    blocks: [
      'A deadlock can arise only if all four conditions hold **simultaneously** (Coffman conditions):',
      { ol: ['**Mutual exclusion** — at least one resource is non-sharable.', '**Hold and wait** — a process holds at least one resource while waiting to acquire more held by others.', '**No preemption** — a resource can only be released voluntarily by the holder.', '**Circular wait** — a set {P0, …, Pn} exists where P0 waits for P1, P1 for P2, …, Pn waits for P0.'] },
    ],
    sources: [`${U4} slides 80–82`, `${TB} §7.2.1`],
  },

  'os-rag-need': {
    blocks: [
      'The **resource-allocation graph** describes deadlocks precisely: processes are circles, resource types are boxes (with dots for instances), request edges go P → R and assignment edges go R → P.',
      { ul: ['It **visualises** which process holds and waits for which resource.', 'It lets us **detect deadlock**: no cycle → no deadlock; a cycle with single-instance resources → deadlock; a cycle with multiple instances → possible deadlock.', 'With **claim edges** it is used for **deadlock avoidance** with single-instance resources (grant a request only if no cycle forms).'] },
    ],
    sources: [`${U4} slides 83–86`, `${TB} §7.2.2`],
  },

  'os-single-thread-deadlock': {
    blocks: [
      '**No.** Deadlock requires **hold and wait** and **circular wait**: a set of at least two processes each waiting for a resource held by another. A single-threaded process can wait only for resources held by *other* processes (who are not in the cycle), so a circular wait involving only itself cannot form. (It can still block forever, for example by waiting for input that never arrives, but that is not a deadlock.)',
    ],
    sources: [`${TB} §7.2`, "OS Nov '25 paper Q4"],
  },

  'os-concurrency-overhead': {
    blocks: [
      '**Partly agree — it depends on the system.**',
      { ul: [
        'On a **single-processor** system, threads run interleaved, not in parallel. Creating, scheduling and switching them adds overhead, so a **CPU-bound** program gets **no speedup** and may even slow down. In that sense the statement holds.',
        'But concurrency still helps on one CPU when the program does **I/O**: while one thread waits for I/O, another computes, improving throughput and responsiveness.',
        'On a **multiprocessor/multicore** system, threads run truly in parallel, so a well-parallelised program **does** speed up (up to the limit given by Amdahl\'s law), despite the extra scheduling cost.',
      ] },
      'So the statement is false in general: concurrency gives speedup on multicore systems and for I/O-bound work.',
    ],
    sources: [`${TB} §4.1`, 'OS Dec \'23 paper Q2'],
  },

  'os-multithread': {
    blocks: [
      'A **thread** is a basic unit of CPU utilisation. It has a thread ID, a program counter, a register set and a stack, and shares with other threads of the same process the code section, data section, open files and signals.',
      { img: 'os-one-to-one' },
      { h: 'Multithreading concept' },
      'A traditional (heavyweight) process has a single thread of control. A **multithreaded** process has several threads, so it can perform more than one task at a time. Example: a web server creates a thread per client request instead of a new process; a word processor uses one thread for typing, one for spell-checking and one for auto-save.',
      { h: 'Benefits' },
      { ul: ['Responsiveness', 'Resource sharing', 'Economy (cheap creation and switching)', 'Scalability on multicore systems'] },
      { h: 'Types and models' },
      'User-level and kernel-level threads, mapped by the many-to-one, one-to-one or many-to-many model. Libraries: Pthreads, Windows threads, Java threads.',
      { h: 'Challenges' },
      'Dividing work, balancing load, splitting data, managing data dependencies, and testing/debugging concurrent code (race conditions).',
    ],
    sources: [`${U4} slides 4–14`, `${TB} §4.1`],
  },

  'os-proc-vs-thread': {
    blocks: [
      PVT_TABLE,
      'In short: processes are isolated, heavyweight containers of resources; threads are lightweight execution paths that share their process\'s resources.',
    ],
    sources: [`${U4} slide 10`, `${TB} §4.1`],
  },

  'os-mt-models': {
    blocks: [
      'User threads must be mapped to kernel threads. There are three models:',
      { h: '1. Many-to-one' },
      { img: 'os-many-to-one' },
      'Many user threads map to one kernel thread. Thread management is done by the user library, so it is efficient. But a blocking system call blocks the entire process, and threads cannot run in parallel on multiprocessors. Example: Solaris Green Threads, GNU Portable Threads.',
      { h: '2. One-to-one' },
      { img: 'os-one-to-one' },
      'Each user thread maps to its own kernel thread. More concurrency (another thread can run when one blocks) and true parallelism on multiprocessors. Drawback: creating a user thread requires creating a kernel thread, so many systems limit the number of threads. Examples: Linux, Windows.',
      { h: '3. Many-to-many' },
      { img: 'os-many-to-many' },
      'Many user threads are multiplexed onto a smaller or equal number of kernel threads. Developers can create as many user threads as needed, and the kernel threads run in parallel. The **two-level model** also allows a user thread to be bound to a kernel thread. Examples: older Solaris, IRIX, HP-UX.',
    ],
    sources: [`${U4} slides 15–23`, `${TB} §4.2`],
  },

  'os-kernel-threads': {
    blocks: [
      'Kernel threads are supported and managed directly by the OS kernel.',
      { ul: [
        '**Data structures**: the kernel keeps a **thread control block (TCB)** for each thread — thread ID, saved registers and program counter, kernel and user stack pointers, state, priority, and a pointer to the owning process\'s PCB (which holds the shared address space, open files, etc.).',
        '**Creation**: a system call (e.g. Linux `clone()` with flags CLONE_VM, CLONE_FS, CLONE_FILES, CLONE_SIGHAND; Windows `CreateThread`) allocates a TCB and a kernel stack and **shares** the parent\'s address space instead of copying it.',
        '**Scheduling**: the scheduler schedules threads, not processes; each thread can be placed on a different CPU.',
        '**Context switch** between threads of the same process only saves/restores registers and stack pointers; the memory map need not change.',
        '**Blocking**: when one thread makes a blocking call, the kernel blocks only that thread and runs another.',
        '**Synchronisation and termination**: kernel provides mutexes, condition variables, and join/exit services.',
      ] },
      'Cost: every thread operation is a system call (slower than user threads), and each thread uses kernel memory.',
    ],
    sources: [`${TB} §4.2, §4.5.2 (Linux clone)`],
  },

  'os-linux-threads': {
    blocks: [
      'Linux threads are **kernel-level threads** (one-to-one model).',
      { ul: [
        'Linux makes no strong distinction between processes and threads: both are **tasks** (`task_struct`) scheduled by the kernel.',
        'A thread is created with the `clone()` system call, passing flags (CLONE_VM, CLONE_FILES, CLONE_FS, CLONE_SIGHAND) that make the new task **share** the parent\'s address space, open files and signal handlers.',
        'The kernel schedules each such task independently, so threads of one process can run on different CPUs simultaneously, and a blocking call blocks only the calling thread.',
        'The NPTL Pthreads library maps each `pthread_create` to one kernel task — one-to-one.',
      ] },
    ],
    sources: [`${TB} §4.5.2`],
  },

  'os-ult-multiprocessor': {
    blocks: [
      'It depends on how user threads are mapped to kernel threads.',
      { ul: [
        '**Many-to-one model**: all user threads of the process are mapped to a single kernel thread, so the OS sees one schedulable entity. Only one thread runs at a time even if several processors are free; there is **no performance gain** on a multiprocessor.',
        '**One-to-one or many-to-many model**: each user thread (or group) has its own kernel thread, which the kernel can schedule on different processors at the same time. A multithreaded program can then run threads in **parallel** and achieve better performance than on a single processor.',
      ] },
      'So purely user-level threads (many-to-one) do not benefit; threads backed by multiple kernel threads do.',
    ],
    sources: [`${TB} §4.2`, "OS Dec '22–Jan '23 paper"],
  },

  'os-thread-libs': {
    blocks: [
      'A **thread library** gives the programmer an API for creating and managing threads.',
      { h: 'Two ways to implement a library' },
      { ul: ['Entirely in **user space**: calls are local function calls (fast), no kernel support.', '**Kernel-level** library supported by the OS: calls are system calls.'] },
      { h: 'Main libraries' },
      { table: { head: ['Library', 'Key calls'], rows: [['POSIX Pthreads', 'pthread_create, pthread_join, pthread_exit, pthread_mutex_lock'], ['Windows threads', 'CreateThread, WaitForSingleObject, CloseHandle'], ['Java threads', 'extend Thread / implement Runnable, start(), join()']] } },
      { h: 'Why they matter' },
      { ul: ['**Portability**: the same Pthreads code runs on Linux, macOS and Unix.', '**Abstraction**: hide the details of kernel threads and scheduling.', '**Synchronisation primitives**: mutexes, condition variables, semaphores, barriers.', '**Productivity and correctness**: tested, standard thread management instead of hand-written low-level code.', '**Performance**: user-level libraries give very cheap thread operations; kernel libraries give true parallelism.'] },
      { code: `#include <pthread.h>
void *runner(void *param) { /* work */ pthread_exit(0); }
int main() {
    pthread_t tid;
    pthread_create(&tid, NULL, runner, NULL);
    pthread_join(tid, NULL);
}` },
    ],
    sources: [`${U4} slides 24–33`, `${TB} §4.3`],
  },

  'os-peterson': {
    blocks: [
      'Peterson\'s solution is a classic **software** solution to the critical-section problem for **two processes** (P0 and P1, with j = 1 − i). They share:',
      { code: `int turn;          // whose turn it is to enter
boolean flag[2];   // flag[i] = true → Pi is ready to enter` },
      { code: `do {
    flag[i] = true;                 // I want to enter
    turn = j;                       // but let the other go first
    while (flag[j] && turn == j);   // wait while the other wants in and it is its turn
        /* critical section */
    flag[i] = false;                // I'm out
        /* remainder section */
} while (true);` },
      { h: 'Proof of correctness' },
      { ol: [
        '**Mutual exclusion**: Pi enters only if flag[j] == false or turn == i. If both were in the CS, both flags would be true, so both would have needed turn == own index — impossible, since turn holds a single value.',
        '**Progress**: if Pj is not interested (flag[j] = false), Pi enters immediately; if both are interested, turn decides, so the choice is never postponed indefinitely.',
        '**Bounded waiting**: when Pj leaves it sets flag[j] = false; if it tries again it sets turn = i, so Pi enters after **at most one** entry by Pj.',
      ] },
      'Limitation: works only for two processes, and needs memory barriers on modern processors that reorder loads and stores.',
    ],
    sources: [`${U4} slides 44–46`, `${TB} §6.3`],
  },

  'os-busy-waiting': {
    blocks: [
      '**Busy waiting** is when a process repeatedly checks a condition in a loop (e.g. `while (lock) ;` or `while (S <= 0) ;`) while waiting to enter its critical section, consuming CPU cycles without doing useful work. A lock that busy-waits is called a **spinlock**.',
      { h: 'Can it be avoided altogether?' },
      { ul: [
        'It can be **largely avoided** by blocking: semaphores with a waiting queue — `wait()` puts the process to sleep (`block()`) and `signal()` wakes it (`wakeup()`), so the CPU is used by other processes meanwhile.',
        'But it **cannot be eliminated completely**: the wait and signal operations themselves must be executed atomically, which on multiprocessors requires short spinlocks (test-and-set) around the semaphore\'s own data. Busy waiting is thus moved from the application\'s critical sections (long) to the semaphore code (very short).',
        'On multiprocessors, short busy waits are actually preferred when the expected wait is shorter than two context switches.',
      ] },
    ],
    sources: [`${U4} slides 51–56`, `${TB} §6.6.2`],
  },

  'os-spinlock': {
    blocks: [
      'A **spinlock** makes a waiting thread loop ("spin") continuously, testing the lock until it becomes free.',
      { h: 'Single-processor system — not appropriate' },
      { ul: ['Only one thread runs at a time. If a thread spins waiting for a lock, the **lock holder cannot run** to release it until the spinner is preempted.', 'The spinner wastes its whole time slice doing nothing useful.', 'Worse, if the holder has lower priority, the spinner may spin forever (priority inversion).', 'So on a uniprocessor it is better to **block** the waiting thread (yield the CPU) so the holder can run.'] },
      { h: 'Multiprocessor system — often used' },
      { ul: ['The lock holder runs **in parallel** on another CPU and will usually release the lock very soon.', 'Spinning briefly is cheaper than blocking, which needs **two context switches** (sleep and wake-up).', 'So for **short critical sections**, spinlocks give lower latency and are widely used inside OS kernels (protected by disabling preemption while held).'] },
    ],
    sources: [`${TB} §6.5–6.6`, "OS Nov '25 paper Q12(a)"],
  },

  'os-semaphore-impl': {
    blocks: [
      'A **semaphore** S is an integer variable that, apart from initialisation, is accessed only through two standard **atomic** operations, **wait()** (P, from the Dutch *proberen*) and **signal()** (V, *verhogen*). It was introduced by Dijkstra.',
      { h: 'Initial (busy-waiting) implementation' },
      { code: `wait(S) {
    while (S <= 0)
        ;        // busy wait
    S--;
}

signal(S) {
    S++;
}` },
      'The test (S <= 0) and the decrement must be executed without interruption. This version wastes CPU time while waiting (a **spinlock**).',
      { h: 'Implementation without busy waiting' },
      { code: `typedef struct {
    int value;
    struct process *list;   // queue of waiting processes
} semaphore;

wait(semaphore *S) {
    S->value--;
    if (S->value < 0) {
        add this process to S->list;
        block();            // suspend the caller
    }
}

signal(semaphore *S) {
    S->value++;
    if (S->value <= 0) {
        remove a process P from S->list;
        wakeup(P);          // move P to the ready queue
    }
}` },
      'Here the value can be negative: |value| = number of waiting processes. A FIFO list gives bounded waiting.',
      { h: 'Types' },
      'Binary semaphore (0/1, like a mutex lock) and counting semaphore (any non-negative value, for resources with several instances).',
    ],
    sources: [`${U4} slides 51–55`, `${TB} §6.6`],
  },

  'os-wait-signal': {
    blocks: [
      { h: 'wait(S) (P / down)' },
      'Decrements the semaphore. If the value becomes negative (or, in the busy-wait version, while it is ≤ 0), the calling process waits; otherwise it continues. It is executed before entering a critical section or using a resource.',
      { h: 'signal(S) (V / up)' },
      'Increments the semaphore and, if any process is waiting, wakes one of them. Executed after leaving the critical section or releasing a resource.',
      'Both must be **atomic**.',
      { code: `wait(S)  { while (S <= 0) ; S--; }
signal(S) { S++; }` },
      { h: 'Applications of semaphores' },
      { ol: [
        '**Mutual exclusion**: `semaphore mutex = 1; wait(mutex); critical section; signal(mutex);`',
        '**Controlling access to a resource with n instances**: counting semaphore initialised to n (e.g. printers, database connections).',
        '**Process synchronisation / ordering**: S = 0; P1: `S1; signal(S);` P2: `wait(S); S2;` guarantees S1 runs before S2.',
        '**Classical problems**: bounded buffer (mutex, empty, full), readers–writers, dining philosophers.',
      ] },
    ],
    sources: [`${U4} slides 51–54`, `${TB} §6.6.1`],
  },

  'os-atomic': {
    blocks: [
      'Consider `wait(S)` implemented as: `while (S <= 0); S--;` with **S = 1** protecting a critical section, and two processes P0 and P1. Suppose wait() is **not atomic**:',
      { table: { head: ['Time', 'P0', 'P1', 'S'], rows: [['t1', 'tests S <= 0 → false (S is 1)', '', '1'], ['t2', '— preempted —', 'tests S <= 0 → false (S is still 1)', '1'], ['t3', '', 'S-- → enters critical section', '0'], ['t4', 'S-- → enters critical section', '', '−1']] } },
      'Both P0 and P1 are now in the critical section at the same time — **mutual exclusion is violated**.',
      'Even the decrement itself is not atomic at machine level (load S, subtract, store S): two concurrent decrements of S = 1 can both read 1 and store 0, letting both proceed. Similarly a non-atomic signal() can lose an increment, so a waiting process is never woken.',
      'Therefore the test-and-decrement in wait() and the increment in signal() must be executed **atomically** — by disabling interrupts on a uniprocessor, or with hardware instructions such as test_and_set / compare_and_swap (spinlocks) on multiprocessors.',
    ],
    sources: [`${TB} §6.6`, "OS Nov '25 paper Q12(b)"],
  },

  'os-mutex-ops': {
    blocks: [
      'A **mutex lock** (mutual-exclusion lock) protects a critical section. It has a boolean state (available / locked) and an **owner**.',
      { table: { head: ['Operation', 'What it does'], rows: [
        ['Create / init', '`pthread_mutex_init(&m, NULL)` — create the mutex in the unlocked state'],
        ['Lock (acquire)', '`pthread_mutex_lock(&m)` — if free, take it and become owner; otherwise block (or spin) until it is released'],
        ['Try lock', '`pthread_mutex_trylock(&m)` — take it if free, otherwise return immediately with an error'],
        ['Timed lock', 'wait for the lock only up to a timeout'],
        ['Unlock (release)', '`pthread_mutex_unlock(&m)` — only the owner may release; wakes one waiting thread'],
        ['Destroy', '`pthread_mutex_destroy(&m)` — free its resources'],
      ] } },
      { code: `acquire() { while (!available) ; /* busy wait */ available = false; }
release() { available = true; }

acquire(); /* critical section */ release();` },
      'acquire() and release() must be atomic (implemented with test_and_set/compare_and_swap). RTOS mutexes add **priority inheritance** and recursive locking.',
    ],
    sources: [`${TB} §6.5`],
  },

  'os-classic': {
    blocks: [
      '**The bounded-buffer (producer–consumer) problem.** A producer puts items into a shared buffer of *n* slots; a consumer removes them. The producer must wait when the buffer is full, the consumer when it is empty, and they must not update the buffer at the same time.',
      { img: 'os-bounded-buffer' },
      { h: 'Shared data' },
      { code: `int n;
semaphore mutex = 1;   // mutual exclusion on the buffer
semaphore empty = n;   // number of empty slots
semaphore full  = 0;   // number of full slots` },
      { h: 'Producer and consumer' },
      { code: `/* Producer */                  /* Consumer */
do {                             do {
  /* produce next_produced */      wait(full);
  wait(empty);                     wait(mutex);
  wait(mutex);                       /* remove item to next_consumed */
    /* add next_produced */        signal(mutex);
  signal(mutex);                   signal(empty);
  signal(full);                    /* consume next_consumed */
} while (true);                  } while (true);` },
      { h: 'Why it works' },
      { ul: ['**empty** blocks the producer when all n slots are full; **full** blocks the consumer when the buffer is empty.', '**mutex** ensures only one of them changes the buffer and its indices at a time.', 'The counting semaphore must be waited on **before** the mutex; reversing the order can deadlock (a producer holding mutex sleeps on empty while the consumer can\'t get mutex).'] },
    ],
    sources: [`${U4} slides 58–62`, `${TB} §6.7.1`],
  },

  'os-consumer': {
    blocks: [
      'In the bounded-buffer problem (semaphores mutex = 1, empty = n, full = 0), the consumer process is:',
      { code: `do {
    wait(full);        // 1. wait until at least one slot is full
    wait(mutex);       // 2. get exclusive access to the buffer
      next_consumed = buffer[out];   // 3. remove an item
      out = (out + 1) % n;
    signal(mutex);     // 4. release the buffer
    signal(empty);     // 5. one more empty slot for the producer
    /* consume the item in next_consumed */   // 6. use it outside the CS
} while (true);` },
      { h: 'Analysis of each step' },
      { ul: [
        '`wait(full)`: blocks the consumer if the buffer is **empty** (full = 0); otherwise decrements the count of full slots. It must come before `wait(mutex)` — if the consumer took the mutex first and then slept on full, the producer could never enter to add an item → deadlock.',
        '`wait(mutex)` / `signal(mutex)`: make the removal and the update of `out` a critical section, so a producer and consumer don\'t corrupt shared indices.',
        '`signal(empty)`: tells a waiting producer that a slot is free.',
        'Consuming the item happens **outside** the critical section so the buffer is locked for as little time as possible.',
      ] },
      'The consumer is symmetric to the producer: the producer waits on empty and signals full; the consumer waits on full and signals empty.',
    ],
    sources: [`${U4} slides 59–62`, `${TB} §6.7.1`],
  },

  'os-readers-writers': {
    blocks: [
      'A database is shared by **readers** (only read) and **writers** (update). Any number of readers may read at the same time, but a writer needs **exclusive** access (no other reader or writer).',
      { h: 'First readers–writers solution (readers preferred)' },
      { code: `semaphore rw_mutex = 1;   // exclusive access for writers (and the first/last reader)
semaphore mutex    = 1;   // protects read_count
int read_count = 0;       // number of readers currently reading` },
      { code: `/* Writer */                     /* Reader */
do {                              do {
  wait(rw_mutex);                   wait(mutex);
    /* writing is performed */        read_count++;
  signal(rw_mutex);                   if (read_count == 1)
} while (true);                          wait(rw_mutex);   // first reader locks out writers
                                    signal(mutex);
                                      /* reading is performed */
                                    wait(mutex);
                                      read_count--;
                                      if (read_count == 0)
                                         signal(rw_mutex); // last reader lets writers in
                                    signal(mutex);
                                  } while (true);` },
      { h: 'How it works' },
      { ul: ['A writer simply waits on rw_mutex, so it gets the database only when no reader or writer holds it.', 'Only the **first** reader waits on rw_mutex; later readers just increment read_count and read concurrently.', 'The **last** reader to leave signals rw_mutex.', 'If a writer is inside, the first reader blocks on rw_mutex and other readers queue on mutex.'] },
      { warn: 'Writers may **starve** if readers keep arriving. The second readers–writers problem gives writers priority (and may starve readers); reader–writer locks in Pthreads/Java implement these policies.' },
    ],
    sources: [`${U4} slides 63–66`, `${TB} §6.7.2`],
  },

  'os-dining': {
    blocks: [
      'Five philosophers sit at a round table, alternately **thinking** and **eating**. There is one bowl of rice and **five chopsticks**, one between each pair. To eat, a philosopher needs **both** the left and right chopsticks, picking them up one at a time; after eating he puts both down. The problem models allocating several resources among processes without deadlock and starvation.',
      { h: 'Semaphore solution' },
      { code: `semaphore chopstick[5];   // all initialised to 1

do {
    wait(chopstick[i]);             // left
    wait(chopstick[(i + 1) % 5]);   // right
        /* eat */
    signal(chopstick[i]);
    signal(chopstick[(i + 1) % 5]);
        /* think */
} while (true);` },
      'This guarantees that no two neighbours eat at once, but it can **deadlock**: if all five pick up their left chopstick at the same moment, every chopstick is taken and each waits forever for the right one.',
      { h: 'Remedies' },
      { ul: ['Allow at most **four** philosophers at the table at once (a counting semaphore initialised to 4).', 'Let a philosopher pick up chopsticks **only if both are available** (inside a critical section / monitor).', '**Asymmetric** solution: odd-numbered philosophers pick up left then right; even-numbered pick up right then left.'] },
      { h: 'Monitor solution' },
      'Each philosopher has a state (THINKING, HUNGRY, EATING) and a condition variable. `pickup(i)` sets HUNGRY and calls `test(i)`, which lets i eat only if neither neighbour is eating; otherwise i waits. `putdown(i)` sets THINKING and tests both neighbours. This is deadlock-free; starvation must still be considered.',
    ],
    sources: [`${U4} slides 67–72`, `${TB} §6.7.3, §6.8.2`],
  },

  'os-dining-deadlock': {
    blocks: [
      { h: 'Deadlock' },
      'With the simple solution (each philosopher does `wait(left); wait(right);`), if all five become hungry at the same time and each picks up the **left** chopstick, all five chopsticks are held and each philosopher waits forever for the right one. All four deadlock conditions hold: chopsticks are non-sharable (mutual exclusion), each holds one and waits for another (hold and wait), chopsticks cannot be taken away (no preemption), and the waits form a cycle around the table (circular wait).',
      { h: 'Avoiding deadlock' },
      { ul: ['Allow at most **4** philosophers to sit simultaneously — at least one of them can get both chopsticks.', 'Pick up both chopsticks **atomically** (only when both are free).', '**Asymmetric order** (odd: left then right; even: right then left) breaks the circular wait.'] },
      { h: 'Starvation' },
      'Even a deadlock-free solution may let a philosopher **starve**: e.g. with the monitor solution, philosopher 1 and philosopher 3 can alternate eating so that philosopher 2, between them, never finds both chopsticks free. Avoiding starvation needs fairness — e.g. a FIFO queue of hungry philosophers, or giving priority to a philosopher whose neighbours have both eaten since he became hungry, or using a waiter (arbitrator) who grants chopsticks in request order.',
    ],
    sources: [`${U4} slides 67–72`, `${TB} §6.7.3`],
  },

  'os-babies': {
    blocks: [
      'Model each **parent** as a process that wants to go out (leave home) and come back. The constraint: at least one parent must be at home at all times while the babies are present (babies cannot be left unattended).',
      { h: 'Shared data' },
      { code: `int at_home = 2;          // number of parents at home
semaphore mutex = 1;      // protects at_home
semaphore can_leave = 0;  // signalled when another parent comes home` },
      { h: 'Parent process' },
      { code: `Parent(i) {
  while (true) {
    /* --- wants to leave --- */
    wait(mutex);
    while (at_home == 1) {          // I'm the only one home → cannot leave
        signal(mutex);
        wait(can_leave);            // wait until the other parent returns
        wait(mutex);
    }
    at_home--;                      // leave the house
    signal(mutex);

    /* go to work / outside */

    /* --- comes back --- */
    wait(mutex);
    at_home++;
    signal(mutex);
    signal(can_leave);              // a parent waiting to leave may now go

    /* stay at home for a while */
  }
}` },
      { h: 'Correctness' },
      { ul: ['A parent leaves only if `at_home == 2`, so at_home never becomes 0: the babies are never unattended (**safety**).', '`mutex` makes the test-and-decrement atomic, so both parents cannot leave at the same instant (no race).', 'A parent who wants to leave while alone waits on `can_leave` and is woken when the other parent returns (**progress**).'] },
    ],
    sources: ["OS Jun '24 (AIML) paper", `${TB} §6.6 (semaphore usage)`],
  },

  'os-deadlock-define': {
    blocks: [
      'A **deadlock** is a situation in which a set of processes are blocked **forever** because each process holds a resource and waits for another resource that is held by another process in the same set. None of them can proceed, release its resources, or be awakened.',
      { analogy: 'Two trains approach each other on a single track; neither can move until the other backs up — and neither will.' },
      'Processes use resources in the sequence **request → use → release**.',
      { h: 'Necessary conditions (all four must hold simultaneously)' },
      { ol: [
        '**Mutual exclusion**: at least one resource must be held in a non-sharable mode; only one process at a time can use it (e.g. a printer, a mutex).',
        '**Hold and wait**: a process holds at least one resource while waiting to acquire additional resources held by other processes.',
        '**No preemption**: resources cannot be forcibly taken away; a resource is released only voluntarily by the process holding it, after it has finished.',
        '**Circular wait**: there exists a set {P0, P1, …, Pn} of waiting processes such that P0 waits for a resource held by P1, P1 waits for P2, …, and Pn waits for a resource held by P0.',
      ] },
      { img: 'os-rag-deadlock' },
      'If any one of the conditions is prevented, deadlock cannot occur.',
    ],
    sources: [`${U4} slides 80–86`, `${TB} §7.1–7.2`],
  },

  'os-deadlock-handle': {
    blocks: [
      { h: 'How deadlock occurs' },
      'Processes compete for a finite number of resources. A process requests resources; if they are not available it waits. If waiting processes hold resources requested by other waiting processes, and these waits form a cycle, the processes never change state — a deadlock. Example: P1 holds a tape drive and requests the printer; P2 holds the printer and requests the tape drive.',
      { h: 'Methods for handling deadlocks' },
      { ol: [
        '**Deadlock prevention**: ensure at least one necessary condition cannot hold — share resources where possible; request all resources at once (no hold-and-wait); preempt resources from waiting processes; impose a total ordering on resource types (no circular wait).',
        '**Deadlock avoidance**: require advance information (maximum needs) and grant a request only if the system stays in a **safe state** — resource-allocation-graph algorithm (single instances) or the **Banker\'s algorithm** (multiple instances).',
        '**Detection and recovery**: allow deadlocks, detect them (wait-for graph / detection algorithm), then recover by **terminating** processes or **preempting** resources (with rollback).',
        '**Ignore the problem** (ostrich algorithm): used by most OSes (Linux, Windows) because deadlocks are rare and the other methods are expensive; the user or administrator restarts things.',
      ] },
    ],
    sources: [`${U4} slides 80–120`, `${TB} §7.3`],
  },

  'os-circular-proof': {
    blocks: [
      'Claim: if **mutual exclusion**, **hold and wait** and **no preemption** all hold, a **circular wait** can arise (and if it does, the system is deadlocked).',
      { h: 'Argument' },
      { ol: [
        'Because of **hold and wait**, every blocked process Pi holds at least one resource and is waiting for some resource Ri held by another process.',
        'Because of **mutual exclusion**, Ri cannot be shared, so Pi must wait for the specific process P(i+1) that holds Ri.',
        'Because of **no preemption**, Pi cannot take Ri away; it waits until P(i+1) releases it — which P(i+1) will only do after it finishes.',
        'Follow the "waits for" relation: P0 → P1 → P2 → …. With a **finite** number of processes, this chain cannot go on forever with distinct processes. Either it ends at a process that is not waiting (which will finish and release resources — no deadlock yet), or some process repeats, i.e. Pk waits for a resource held by an earlier Pj — that is a **cycle**.',
        'Hence, with the first three conditions present, a set of mutually waiting processes must form a **circular wait**. Since no one in the cycle can release anything, they are deadlocked.',
      ] },
      'This is why circular wait is "implied" by the other three in a stuck system, and why breaking any one condition (e.g. ordering resources to prevent cycles) prevents deadlock.',
    ],
    sources: [`${TB} §7.2.1`, "OS Dec '24 paper"],
  },

  'os-hold-wait': {
    blocks: [
      { h: 'How hold-and-wait contributes' },
      'Hold and wait means a process keeps the resources it already has while waiting for more. If P1 holds R1 and waits for R2, and P2 holds R2 and waits for R1, neither will release what it holds, so both wait forever. Without hold-and-wait, a waiting process would hold nothing, so no other process could be waiting on it and no cycle could form.',
      { h: 'Preventing it — two protocols' },
      { ol: [
        '**Request everything at once**: a process must request and be allocated **all** its resources before it starts executing (e.g. a process copying from DVD to disk and then printing requests the DVD drive, disk file and printer at the start).',
        '**Request only when holding none**: a process may request resources only when it has **none**; to get more, it must first release everything it holds (e.g. copy DVD→disk, release both, then request disk file + printer).',
      ] },
      { h: 'Drawbacks' },
      { ul: ['**Low resource utilisation**: resources are allocated long before they are used (the printer sits idle during the whole copy).', '**Starvation**: a process needing several popular resources may wait indefinitely because at least one is always taken.'] },
    ],
    sources: [`${U4} slides 87–89`, `${TB} §7.4.2`],
  },

  'os-rag': {
    blocks: [
      'A **resource-allocation graph** G = (V, E) has two kinds of vertices — **processes** P (circles) and **resource types** R (rectangles, with a dot per instance) — and two kinds of edges:',
      { ul: ['**Request edge** Pi → Rj: Pi has requested an instance of Rj and is waiting.', '**Assignment edge** Rj → Pi: an instance of Rj has been allocated to Pi.'] },
      { img: 'os-rag' },
      'In the graph above there is no cycle, so no process is deadlocked.',
      { h: 'RAG with a deadlock' },
      { img: 'os-rag-deadlock' },
      'Top figure: P1 holds R2 and requests R1; P2 holds R1 and R2 and requests R3; P3 holds R3 and requests R2. Two cycles exist: P1 → R1 → P2 → R3 → P3 → R2 → P1 and P2 → R3 → P3 → R2 → P2. R2 and R3 have no free instances, so P1, P2 and P3 are deadlocked.',
      'Bottom figure: a cycle P1 → R1 → P3 → R2 → P1 exists, but P2 and P4 are not waiting; when P4 releases R2 or P2 releases R1, the cycle breaks — **a cycle without deadlock**.',
      { h: 'Rules' },
      { ul: ['No cycle → no deadlock.', 'Cycle + each resource has one instance → deadlock.', 'Cycle + multiple instances → deadlock possible but not certain.'] },
    ],
    sources: [`${U4} slides 83–86`, `${TB} §7.2.2`],
  },

  'os-bounded-buffer': {
    blocks: [
      'Bounded buffer with semaphores mutex = 1, empty = n, full = 0. The correct code waits on the counting semaphore **first**, then on mutex. Deadlock appears if the order is reversed:',
      { code: `/* Faulty producer */          /* Consumer */
wait(mutex);                    wait(mutex);
wait(empty);                    wait(full);
  add item                        remove item
signal(full);                   signal(empty);
signal(mutex);                  signal(mutex);` },
      { h: 'Scenario' },
      { ol: ['The buffer is **full** (empty = 0).', 'The producer executes `wait(mutex)` — succeeds, mutex = 0.', 'The producer executes `wait(empty)` — blocks, **while still holding mutex**.', 'The consumer executes `wait(mutex)` — blocks, because the producer holds it.', 'The producer waits for the consumer to free a slot; the consumer waits for the producer to release mutex → **deadlock**.'] },
      'The symmetric case: the buffer is **empty** and the consumer takes mutex then blocks on full, so the producer can never add an item.',
      'All four conditions hold: mutex is exclusive; each holds one semaphore and waits on another; semaphores aren\'t preempted; the waits are circular. **Fix**: always do `wait(empty)` / `wait(full)` before `wait(mutex)`, and keep the mutex only while touching the buffer.',
    ],
    sources: [`${TB} §6.7.1`, "OS Nov '25 paper Q13(a)"],
  },

  'os-rw-locks': {
    blocks: [
      '**Yes — deadlock is still possible.** Check the four conditions for a program using several reader–writer locks:',
      { ul: [
        '**Mutual exclusion**: holds for **writers** — a write lock is exclusive. (Read locks alone are shared, so if every thread only ever took read locks, there could be no deadlock.)',
        '**Hold and wait**: a thread can hold one lock (read or write) while requesting another.',
        '**No preemption**: locks are not taken away from their holders.',
        '**Circular wait**: possible if threads acquire locks in different orders.',
      ] },
      { h: 'Example' },
      'Locks L1 and L2. Thread T1 holds a **read** lock on L1 and requests a **write** lock on L2. Thread T2 holds a **read** lock on L2 and requests a **write** lock on L1. Each write request must wait for the other thread\'s read lock to be released → circular wait → **deadlock**.',
      'Even upgrading a read lock to a write lock on the **same** lock can deadlock if two readers both try to upgrade.',
      'Prevention: acquire locks in a fixed global order, avoid lock upgrades, or use try-lock with back-off.',
    ],
    sources: [`${TB} §7.2, §6.7.2`, "OS Nov '25 paper Q13(b)"],
  },

  'os-bankers': {
    blocks: [
      'The **Banker\'s algorithm** (Dijkstra) is a deadlock-**avoidance** algorithm for resources with **multiple instances**. Each process declares its **maximum** need in advance; a request is granted only if the system remains in a **safe state**. The name comes from a banker who never lends money in a way that he could not satisfy all customers.',
      { h: 'Data structures (n processes, m resource types)' },
      { table: { head: ['Structure', 'Meaning'], rows: [['Available[m]', 'Number of free instances of each type'], ['Max[n][m]', 'Maximum demand of each process'], ['Allocation[n][m]', 'Instances currently allocated'], ['Need[n][m]', 'Remaining need = Max − Allocation']] } },
      { h: 'Safety algorithm' },
      { steps: ['Work = Available; Finish[i] = false for all i.', 'Find an i such that Finish[i] == false and Need[i] ≤ Work. If none exists, go to step 4.', 'Work = Work + Allocation[i]; Finish[i] = true; go to step 2 (Pi finishes and returns its resources).', 'If Finish[i] == true for all i, the system is **safe** and the order found is a **safe sequence**; otherwise it is unsafe.'] },
      { h: 'Resource-request algorithm (Request_i)' },
      { steps: ['If Request_i ≤ Need_i, go on; otherwise error (exceeded maximum claim).', 'If Request_i ≤ Available, go on; otherwise Pi must wait.', 'Pretend to allocate: Available −= Request_i; Allocation_i += Request_i; Need_i −= Request_i.', 'Run the safety algorithm. If safe → grant. If unsafe → restore the old state; Pi waits.'] },
      { h: 'Illustrative example' },
      'Available (3,3,2); Max P0 (7,5,3), P1 (3,2,2), P2 (9,0,2), P3 (2,2,2), P4 (4,3,3); Allocation P0 (0,1,0), P1 (2,0,0), P2 (3,0,2), P3 (2,1,1), P4 (0,0,2). Need: P0 (7,4,3), P1 (1,2,2), P2 (6,0,0), P3 (0,1,1), P4 (4,3,1).',
      { ul: ['P1: Need (1,2,2) ≤ (3,3,2) → Work = (5,3,2)', 'P3: (0,1,1) ≤ (5,3,2) → Work = (7,4,3)', 'P4: (4,3,1) ≤ (7,4,3) → Work = (7,4,5)', 'P0: (7,4,3) ≤ (7,4,5) → Work = (7,5,5)', 'P2: (6,0,0) ≤ (7,5,5) → Work = (10,5,7)'] },
      'Safe sequence **<P1, P3, P4, P0, P2>**. If P1 now requests (1,0,2): (1,0,2) ≤ Need (1,2,2) and ≤ Available (3,3,2); pretend → Available (2,3,0); the safety check still finds <P1, P3, P4, P0, P2>, so the request is granted.',
      { img: 'os-safe-state' },
    ],
    sources: [`${U4} slides 92–109`, `${TB} §7.5.3`, "Verified with the Banker's simulator"],
  },

  'os-avoid-multi': {
    blocks: [
      'With several instances per resource type, the resource-allocation-graph method doesn\'t work; the **Banker\'s algorithm** is used. Each process declares its maximum needs; the OS keeps Available, Max, Allocation and Need = Max − Allocation, and grants a request only if the resulting state is **safe** (a safe sequence exists in which every process can obtain its remaining need and finish).',
      { h: 'Illustrative example' },
      'Resources A, B, C with 10, 5, 7 instances; Available = (3,3,2).',
      { table: { head: ['', 'Allocation', 'Max', 'Need'], rows: [['P0', '0 1 0', '7 5 3', '7 4 3'], ['P1', '2 0 0', '3 2 2', '1 2 2'], ['P2', '3 0 2', '9 0 2', '6 0 0'], ['P3', '2 1 1', '2 2 2', '0 1 1'], ['P4', '0 0 2', '4 3 3', '4 3 1']] } },
      'Safety check: P1 (Work → 5,3,2), P3 (→ 7,4,3), P4 (→ 7,4,5), P0 (→ 7,5,5), P2 (→ 10,5,7). The state is **safe** with sequence <P1, P3, P4, P0, P2>.',
      { h: 'Handling a request' },
      'P4 requests (3,3,0): it is ≤ Need (4,3,1) and ≤ Available (3,3,2), so pretend to allocate → Available becomes (0,0,2) and P4\'s Need becomes (1,0,1). Now **no** process has Need ≤ (0,0,2), so the new state would be **unsafe** → the request is denied and P4 waits, even though the resources are free. That is how avoidance keeps the system out of unsafe states.',
    ],
    sources: [`${U4} slides 100–109`, `${TB} §7.5.3`],
  },

  'os-bankers-granted': {
    blocks: [
      'Assumptions of the Banker\'s algorithm: every process declares its maximum need (≤ total resources), and every process, once it receives its maximum, **finishes in finite time** and releases everything.',
      { h: 'Argument' },
      { ol: [
        'The Banker\'s algorithm grants a request only if the resulting state is **safe**, so the system is **always** in a safe state.',
        'In a safe state there is a safe sequence ⟨Pa, Pb, …⟩: Pa\'s remaining need can be met from Available right now.',
        'Pa can therefore get all it needs (any request it makes keeps the state safe, so it is granted), run to completion in finite time, and release its resources. Available grows.',
        'Now Pb\'s need can be met; it finishes, and so on along the sequence. The state after each completion is still safe.',
        'Any process whose request is deferred is waiting only for processes **earlier** in the safe sequence to finish and release resources. Since there are finitely many processes, each with finite execution time, those processes all finish in finite time.',
        'Therefore every waiting request is eventually satisfiable without making the state unsafe, and it will be granted — no request waits forever (no deadlock, and with fair FIFO handling of waiting requests, no starvation).',
      ] },
    ],
    sources: [`${TB} §7.5.3, Exercise 7.x`, 'OS Dec \'23 paper Q9(a)'],
  },

  'os-circular-vs-bankers': {
    blocks: [
      { table: { head: ['Aspect', 'Circular-wait prevention (resource ordering)', 'Deadlock avoidance (Banker\'s)'], rows: [
        ['Idea', 'Number all resource types; processes request them only in increasing order, so no cycle can form', 'Check every request against a safety algorithm before granting'],
        ['Advance information', 'None needed', 'Each process must declare its maximum need'],
        ['Runtime overhead', '**Very low**: a simple comparison of resource numbers at request time', '**High**: safety algorithm is O(m × n²) on every request'],
        ['System throughput', 'Can be **lower**: processes may have to acquire resources earlier and hold them longer than needed (to respect the order), reducing concurrency', 'Usually **higher** concurrency: any request that keeps the state safe is granted, even out of order'],
        ['Flexibility', 'Rigid; programmers must follow the order', 'Flexible order, but conservative (may refuse requests in unsafe-but-not-deadlocked states)'],
        ['Use', 'Common in practice (e.g. lock ordering in kernels)', 'Rare in general-purpose OSes; used where max needs are known'],
      ] } },
      'Conclusion: resource ordering trades some throughput for almost zero overhead; the Banker\'s algorithm gives better resource utilisation at a significant runtime cost.',
    ],
    sources: [`${TB} §7.4.4, §7.5.3`, "OS May '25 paper"],
  },

  'os-recovery': {
    blocks: [
      { h: 'Why deadlocks occur' },
      'When processes compete for limited non-sharable resources, each holding some while waiting for others, and the waits form a cycle (the four conditions — mutual exclusion, hold and wait, no preemption, circular wait — hold together).',
      { h: 'Detection' },
      { ul: ['**Single instance per resource**: build a **wait-for graph** (Pi → Pj if Pi waits for a resource held by Pj) and search it for a cycle periodically; a cycle means deadlock.', '**Multiple instances**: a Banker-like detection algorithm with Available, Allocation and Request: find processes whose Request ≤ Work, let them "finish", and any process that cannot finish is deadlocked.', 'How often to run it depends on how often deadlocks occur and how many processes they affect (e.g. on every failed request, or when CPU utilisation drops below 40%).'] },
      { h: 'Recovery' },
      { h: '1. Process termination' },
      { ul: ['**Abort all deadlocked processes**: breaks the cycle at once, but much computation is lost.', '**Abort one process at a time** until the cycle is eliminated: less waste, but the detection algorithm must be rerun after each abort.', 'Choose the victim by: priority, how long it has run and how long it still needs, resources used and needed, number of processes to terminate, interactive vs batch.'] },
      { h: '2. Resource preemption' },
      { ul: ['**Selecting a victim**: which resources and which process to preempt to minimise cost.', '**Rollback**: return the victim to a safe state (a checkpoint) or restart it from the beginning (total rollback).', '**Starvation**: ensure the same process isn\'t always the victim — include the number of rollbacks in the cost factor.'] },
    ],
    sources: [`${U4} slides 110–120`, `${TB} §7.6–7.7`],
  },

  'os-num-fork': {
    blocks: [
      { code: `pid = fork();            // (1)
if (pid == 0) {          // child only
    fork();              // (2)
    thread_create(...);  // (3)
}
fork();                  // (4)` },
      { steps: ['(1) The parent P creates child C → **2 processes**.', '(2) Only C (pid == 0) executes the inner fork → C creates C1 → **3 processes**.', '(3) Both C and C1 execute `thread_create` → **2 threads** created.', '(4) All three processes P, C and C1 execute the last fork → each creates one child → **6 processes**.'] },
      'Answer: **(i) 6 unique processes** (including the original), **(ii) 2 unique threads** (created by thread_create). A forked child has only one thread (a copy of the calling thread), so the final fork does not create extra threads.',
    ],
    sources: ["OS May '25 paper", `${TB} Exercise 4.x`],
  },

  'os-num-wants': {
    blocks: [
      { code: `/* P1 */                    /* P2 */
while (true) {               while (true) {
  wants1 = true;               wants2 = true;
  while (wants2 == true) ;     while (wants1 == true) ;
  /* critical section */       /* critical section */
  wants1 = false;              wants2 = false;
  /* remainder */              /* remainder */
}                            }` },
      { h: 'Mutual exclusion — satisfied' },
      'P1 enters only after it has set wants1 = true and seen wants2 == false. At that moment P2 cannot be in its critical section (it would have needed wants1 == false, but wants1 is already true). The symmetric argument holds for P2. So both can never be inside together.',
      { h: 'Progress — NOT satisfied' },
      'Interleaving: P1 sets wants1 = true; P2 sets wants2 = true; now P1 loops on wants2 == true and P2 loops on wants1 == true. Both wait forever even though the critical section is free → **deadlock (livelock)**. Progress requires that the choice of who enters next is not postponed indefinitely.',
      { h: 'Bounded waiting — satisfied (when it doesn\'t deadlock)' },
      'After P2 leaves, it sets wants2 = false, so a waiting P1 gets in before P2 can enter again (P2 would see wants1 == true). So a process waits for at most one entry by the other. But because progress fails, the algorithm is **not** a correct solution. Adding a `turn` variable fixes it — that is Peterson\'s solution.',
    ],
    sources: ["OS Jan '23 (IT) paper", `${TB} §6.2–6.3`],
  },

  'os-num-bankers-dec21': {
    blocks: [
      { h: 'Step 1 — Need = Max − Allocation' },
      { table: { head: ['', 'Allocation A B C D', 'Max A B C D', 'Need A B C D'], rows: [['P0', '2 0 0 1', '4 2 1 2', '**2 2 1 1**'], ['P1', '3 1 2 1', '5 2 5 2', '**2 1 3 1**'], ['P2', '2 1 0 3', '2 3 1 6', '**0 2 1 3**'], ['P3', '1 3 1 2', '1 4 2 4', '**0 1 1 2**'], ['P4', '1 4 3 2', '3 6 6 5', '**2 2 3 3**']] } },
      { h: 'Step 2 — Safety algorithm, Work = Available = (3, 3, 2, 1)' },
      { table: { head: ['Check', 'Need ≤ Work?', 'New Work'], rows: [
        ['P0', '(2,2,1,1) ≤ (3,3,2,1) ✓', '(5,3,2,2)'],
        ['P1', '(2,1,3,1) ≤ (5,3,2,2)? C: 3 > 2 ✗', '—'],
        ['P2', '(0,2,1,3) ≤ (5,3,2,2)? D: 3 > 2 ✗', '—'],
        ['P3', '(0,1,1,2) ≤ (5,3,2,2) ✓', '(6,6,3,4)'],
        ['P1', '(2,1,3,1) ≤ (6,6,3,4) ✓', '(9,7,5,5)'],
        ['P2', '(0,2,1,3) ≤ (9,7,5,5) ✓', '(11,8,5,8)'],
        ['P4', '(2,2,3,3) ≤ (11,8,5,8) ✓', '(12,12,8,10)'],
      ] } },
      'All processes can finish, so the system is in a **safe state**. Safe sequence: **<P0, P3, P1, P2, P4>** (other orders, e.g. <P0, P3, P4, P1, P2>, are also valid).',
    ],
    sources: ["OS Dec '21 (CSE) paper", "Verified with the Banker's simulator"],
  },

  'os-num-bankers-jan23': {
    blocks: [
      { h: 'Need = Max − Allocation' },
      { table: { head: ['', 'Allocation', 'Max', 'Need'], rows: [['P0', '3 0 1 4', '5 1 1 7', '2 1 0 3'], ['P1', '2 2 1 0', '3 2 1 1', '1 0 0 1'], ['P2', '3 1 2 1', '3 3 2 1', '0 2 0 0'], ['P3', '0 5 1 0', '4 6 1 2', '4 1 0 2'], ['P4', '4 2 1 2', '6 3 2 5', '2 1 1 3']] } },
      { h: 'Safety algorithm, Work = (0, 3, 0, 1)' },
      { table: { head: ['Check', 'Need ≤ Work?', 'New Work'], rows: [
        ['P0', '(2,1,0,3) — A: 2 > 0 ✗', '—'],
        ['P1', '(1,0,0,1) — A: 1 > 0 ✗', '—'],
        ['P2', '(0,2,0,0) ≤ (0,3,0,1) ✓', '(3,4,2,2)'],
        ['P0', '(2,1,0,3) — D: 3 > 2 ✗', '—'],
        ['P1', '(1,0,0,1) ≤ (3,4,2,2) ✓', '(5,6,3,2)'],
        ['P3', '(4,1,0,2) ≤ (5,6,3,2) ✓', '(5,11,4,2)'],
        ['P0, P4', 'both need 3 of D, only 2 available ✗', '—'],
      ] } },
      'P0 and P4 can never finish, so the system is **NOT safe** (unsafe state; a deadlock may occur). P2, P1, P3 can complete, but no safe sequence exists for all five.',
      { note: 'This is a textbook exercise in two parts: with Available = (1,0,0,2) instead, the state is safe. Try both presets in the Banker\'s tool.' },
    ],
    sources: ["OS Jan '23 (IT) paper", `${TB} Exercise 7.x`, "Verified with the Banker's simulator"],
  },
}
