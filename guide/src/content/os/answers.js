// Model answers keyed by PYQ id. Written to be reproduced in an exam: points, a figure, and an example.
const U3 = 'OS Unit-3 slides'
const U4 = 'OS Unit-4 slides'
const U5 = 'OS Unit-5 slides'
const TB = 'Silberschatz, Operating System Concepts 8e'

export default {
  'os-mem-protection': {
    blocks: [
      '**Memory protection** stops one process from reading or writing memory that belongs to another process or to the OS.',
      { h: '1. Base and limit registers' },
      'Every address the process generates is compared with the limit register; if it is within range, the base (relocation) register is added. An out-of-range address causes a **trap** to the OS.',
      { img: 'os-addr-translation' },
      { h: '2. Paging: per-process page tables' },
      'Each process has its own page table, and it is the **only** path to physical memory. A process has no entry that points at another process\'s frames, so it simply cannot name that memory.',
      { h: '3. Protection bits in each page-table entry' },
      { ul: ['**Valid–invalid bit**: pages outside the process\'s address space are marked invalid → access traps.', '**Read / write / execute bits**: writing to a read-only (code) page traps.'] },
      { img: 'os-valid-bit' },
      { h: '4. Only the kernel can change the mapping' },
      'Page tables and base/limit registers are modified only by privileged instructions in kernel mode. A user process therefore cannot grant itself access.',
      { h: 'Allowing access to more memory' },
      'The OS can map extra frames into a process (e.g. `brk`, `mmap`) or set up **shared memory** by pointing two page tables at the same frame. It should do this only through checked system calls, because uncontrolled access would let one buggy or malicious process corrupt others.',
    ],
    sources: [`${U3} slides 34, 74`, `${TB} §8.3–8.5`],
  },

  'os-deadlock-conditions': {
    blocks: [
      'A **deadlock** is a situation where a set of processes are blocked forever because each one holds a resource and waits for a resource held by another process in the set.',
      { analogy: 'Two people on a narrow bridge from opposite ends: each holds half the bridge and waits for the other to back off.' },
      { h: 'Four necessary conditions (all must hold together)' },
      { ol: [
        '**Mutual exclusion**: at least one resource is non-sharable; only one process can use it at a time.',
        '**Hold and wait**: a process holds at least one resource and is waiting to acquire more that are held by others.',
        '**No preemption**: a resource can be released only voluntarily by the process holding it.',
        '**Circular wait**: there is a chain P0 → P1 → … → Pn → P0 in which each process waits for a resource held by the next.',
      ] },
      { img: 'os-rag-deadlock' },
      'If any one condition is prevented, deadlock cannot occur. That is the basis of deadlock prevention.',
      { note: 'Single single-threaded process: it cannot deadlock by itself, because hold-and-wait and circular wait need at least two parties waiting on each other.' },
    ],
    sources: [`${U4} slides 80–86`, `${TB} §7.2`],
  },

  'os-bankers': {
    blocks: [
      'The **Banker\'s algorithm** avoids deadlock by granting a request only if the system stays in a **safe state**, meaning there is an order in which every process can finish. It works with multiple instances of each resource type.',
      { h: 'Data structures (n processes, m resource types)' },
      { table: { head: ['Name', 'Meaning'], rows: [['Available[m]', 'Free instances of each type'], ['Max[n][m]', 'Maximum demand of each process'], ['Allocation[n][m]', 'Instances currently held'], ['Need[n][m]', 'Max − Allocation']] } },
      { h: 'Safety algorithm' },
      { steps: ['Work = Available; Finish[i] = false for all i.', 'Find i such that Finish[i] = false and Need[i] ≤ Work. If none, go to step 4.', 'Work = Work + Allocation[i]; Finish[i] = true; go to step 2.', 'If Finish[i] is true for all i, the state is safe.'] },
      { h: 'Resource-request algorithm (request Req for Pi)' },
      { steps: ['If Req > Need[i] → error (process exceeded its maximum claim).', 'If Req > Available → Pi waits.', 'Pretend to allocate: Available −= Req; Allocation[i] += Req; Need[i] −= Req.', 'Run the safety algorithm. Safe → grant. Unsafe → restore the old state and Pi waits.'] },
      { h: 'Example (textbook)' },
      'Available = (3,3,2). Need: P0 (7,4,3), P1 (1,2,2), P2 (6,0,0), P3 (0,1,1), P4 (4,3,1). P1 can run (Work → 5,3,2), then P3 (→ 7,4,3), P4 (→ 7,4,5), P0 (→ 7,5,5), P2 (→ 10,5,7). Safe sequence **<P1, P3, P4, P0, P2>**.',
      { img: 'os-safe-state' },
    ],
    sources: [`${U4} slides 92–109`, `${TB} §7.5.3`],
  },

  'os-num-bankers-dec21': {
    blocks: [
      { h: 'Step 1 — Need = Max − Allocation' },
      { table: { head: ['', 'Allocation', 'Max', 'Need'], rows: [['P0', '2 0 0 1', '4 2 1 2', '**2 2 1 1**'], ['P1', '3 1 2 1', '5 2 5 2', '**2 1 3 1**'], ['P2', '2 1 0 3', '2 3 1 6', '**0 2 1 3**'], ['P3', '1 3 1 2', '1 4 2 4', '**0 1 1 2**'], ['P4', '1 4 3 2', '3 6 6 5', '**2 2 3 3**']] } },
      { h: 'Step 2 — Safety algorithm, Work = (3, 3, 2, 1)' },
      { steps: [
        'P0: Need (2,2,1,1) ≤ (3,3,2,1) ✓ → Work = (5,3,2,2)',
        'P1: Need (2,1,3,1) ≤ (5,3,2,2)? No (3 > 2) → skip. P2: (0,2,1,3) ≤ (5,3,2,2)? No (3 > 2). P3: (0,1,1,2) ≤ (5,3,2,2) ✓ → Work = (6,6,3,4)',
        'P1: (2,1,3,1) ≤ (6,6,3,4) ✓ → Work = (9,7,5,5)',
        'P2: (0,2,1,3) ≤ (9,7,5,5) ✓ → Work = (11,8,5,8)',
        'P4: (2,2,3,3) ≤ (11,8,5,8) ✓ → Work = (12,12,8,10)',
      ] },
      'All processes finish, so the system is **safe** with safe sequence **<P0, P3, P1, P2, P4>**.',
      { tip: 'Check your own working in the Banker\'s tool on the Numericals tab (preset "Dec \'21").' },
    ],
    sources: ['OS compiled question bank (Dec \'21 CSE)', 'Verified with the Banker\'s simulator'],
  },

  'os-num-bankers-jan23': {
    blocks: [
      'Need = Max − Allocation: P0 (2,1,0,3), P1 (1,0,0,1), P2 (0,2,0,0), P3 (4,1,0,2), P4 (2,1,1,3).',
      'Work = Available = (0,3,0,1).',
      { steps: [
        'P2: Need (0,2,0,0) ≤ (0,3,0,1) ✓ → Work = (3,4,2,2)',
        'P1: Need (1,0,0,1) ≤ (3,4,2,2) ✓ → Work = (5,6,3,2)',
        'P3: Need (4,1,0,2) ≤ (5,6,3,2) ✓ → Work = (5,11,4,2)',
        'P0: Need (2,1,0,3) — needs 3 of D, only 2 free ✗. P4: Need (2,1,1,3) — also needs 3 of D ✗.',
      ] },
      'No remaining process can finish, so the state is **unsafe**: P0 and P4 may deadlock.',
      { note: 'With Available = (1,0,0,2) instead (the other half of the textbook exercise), the state is safe. Try both presets in the Banker\'s tool.' },
    ],
    sources: ['OS compiled question bank (Jan \'23 IT)', `${TB} Exercise 7.x`, 'Verified with the Banker\'s simulator'],
  },

  'os-malware': {
    blocks: [
      '**Malware** is software designed to damage, disrupt or gain unauthorised access to a system.',
      { table: { head: ['Type', 'Key idea'], rows: [
        ['Virus', 'Fragment of code inside a host program/file; activates when the host runs; needs user action to spread'],
        ['Worm', 'Standalone; copies itself across the network by exploiting vulnerabilities, without user action'],
        ['Trojan horse', 'Appears useful but performs hidden malicious actions'],
        ['Trap door / backdoor', 'Secret entry that bypasses normal authentication'],
        ['Rootkit', 'Hides its presence by modifying OS tools or the kernel; keeps privileged access'],
        ['Logic bomb', 'Malicious code triggered by a condition or date'],
        ['Ransomware / spyware', 'Encrypts files for ransom / secretly collects information'],
      ] } },
      { h: 'Viruses' },
      'Lifecycle: dormant → propagation → triggering → execution. Types: file, boot-sector, macro, source-code, polymorphic, encrypted, stealth, multipartite, armored.',
      { h: 'Worms' },
      'Example: the Morris worm (1988) used a `finger` buffer overflow, `sendmail` debug mode and trusted `rsh` hosts. Limiting damage: patch quickly, firewall unused ports, segment networks, rate-limit outbound connections, use intrusion detection.',
      { h: 'Rootkits' },
      'User-mode rootkits replace `ls`, `ps`, `netstat`; kernel-mode rootkits alter system-call tables or kernel structures. Detect by booting from trusted media and checking file hashes; recover by reinstalling.',
    ],
    sources: [`${U5} slides 46–63`, `${TB} §15.2`],
  },

  'os-paging': {
    blocks: [
      '**Paging** is a memory-management scheme that lets a process\'s physical memory be non-contiguous. Logical memory is divided into fixed-size **pages**, physical memory into frames of the same size.',
      { img: 'os-paging-model' },
      { h: 'Paging hardware' },
      'Every logical address is split into **page number (p)** and **offset (d)**. *p* indexes the **page table** to get the frame number *f*; the physical address is *f* combined with *d*.',
      { img: 'os-paging-hw' },
      { h: 'Example' },
      'Page size 4 bytes, page table [5, 6, 1, 2]. Logical address 13 → p = 3, d = 1 → frame 2 → physical 2 × 4 + 1 = **9**.',
      { img: 'os-paging-example' },
      { h: 'TLB' },
      'To avoid two memory accesses per reference, a TLB caches recent page-table entries: EAT = h(t + m) + (1 − h)(t + 2m).',
      { h: 'Advantages / disadvantages' },
      { ul: ['No external fragmentation; any free frame can be used.', 'Easy sharing and protection per page.', 'Internal fragmentation in the last page; page-table memory overhead.'] },
    ],
    sources: [`${U3} slides 56–76`, `${TB} §8.5`],
  },

  'os-page-fault': {
    blocks: [
      'A **page fault** occurs when a process references a page whose page-table entry is marked **invalid**, i.e. the page is not currently in main memory (demand paging).',
      { h: 'Steps to handle it' },
      { steps: [
        'The reference to an invalid page causes a **trap** to the OS.',
        'The OS checks an internal table: if the reference is illegal, terminate the process; if legal, the page is just not loaded yet.',
        'Find a free frame (run page replacement if none is free).',
        'Schedule a disk operation to read the page into that frame.',
        'When the read completes, update the page table (frame number, valid bit).',
        'Restart the instruction that was interrupted.',
      ] },
      { img: 'os-page-fault' },
      { formula: 'EAT = (1 − p) × ma + p × page-fault time' },
      'Because page-fault service takes milliseconds, the fault rate *p* must be kept extremely low.',
    ],
    sources: [`${U3} slides 77–80`, `${TB} §9.2`],
  },

  'os-semaphores': {
    blocks: [
      'A **semaphore** S is an integer variable that, apart from initialisation, is accessed only through two **atomic** operations, `wait()` (P) and `signal()` (V). It was proposed by Dijkstra.',
      { code: `wait(S) {               signal(S) {
    while (S <= 0) ;   // busy wait      S++;
    S--;                              }
}` },
      { h: 'Types' },
      { ul: ['**Binary semaphore** (0 or 1): mutual exclusion, like a mutex lock.', '**Counting semaphore**: initialised to the number of resource instances.'] },
      { h: 'Using it for the critical section' },
      { code: `semaphore mutex = 1;
wait(mutex);
    /* critical section */
signal(mutex);` },
      { h: 'Implementation without busy waiting' },
      'Each semaphore has a value and a waiting list. `wait` decrements; if the value becomes negative, the process is added to the list and **blocked**. `signal` increments; if the value is ≤ 0, one process is removed from the list and **woken up**.',
      { h: 'Why wait and signal must be atomic' },
      'With S = 1, if two processes execute `wait(S)` at once without atomicity, both may read S = 1, both decrement and both enter the critical section, which violates mutual exclusion.',
      { warn: 'Problems: deadlock (P0: wait(S); wait(Q) while P1: wait(Q); wait(S)) and starvation (LIFO queues).' },
    ],
    sources: [`${U4} slides 51–57`, `${TB} §6.6`],
  },

  'os-allocation': {
    blocks: [
      'File allocation methods decide how disk blocks are assigned to files.',
      { h: '1. Contiguous allocation' },
      'Each file occupies a set of consecutive blocks. The directory stores the **start block and length**.',
      { img: 'os-contiguous' },
      { ul: ['+ Fast sequential and direct access.', '− External fragmentation; file size must be known in advance; hard to grow.'] },
      { h: '2. Linked allocation' },
      'Each block contains a pointer to the next block. The directory stores the start (and end) block. **FAT** keeps all pointers in a table.',
      { img: 'os-linked' },
      { ul: ['+ No external fragmentation; files grow easily.', '− Only efficient for sequential access; pointer space; a lost pointer breaks the file.'] },
      { h: '3. Indexed allocation' },
      'All pointers are brought together in an **index block**; the directory stores the index block address.',
      { img: 'os-indexed' },
      { ul: ['+ Direct access without external fragmentation.', '− Index-block overhead (wasted for small files). Large files use linked index blocks, multilevel index, or the Unix combined scheme.'] },
    ],
    sources: [`${U5} slides 14–25`, `${TB} §11.4`],
  },

  'os-directory': {
    blocks: [
      'A directory is a symbol table that translates file names into their directory entries. Common structures:',
      { h: 'Single-level' },
      { img: 'os-dir-single' },
      'All files in one directory. Simple, but names must be unique and users can\'t group files.',
      { h: 'Two-level' },
      { img: 'os-dir-two' },
      'A master file directory (MFD) points to one user file directory (UFD) per user. Solves name collisions between users; no sharing, no subdirectories.',
      { h: 'Tree-structured' },
      { img: 'os-dir-tree' },
      'Arbitrary depth, absolute and relative path names, current directory. No sharing between branches.',
      { h: 'Acyclic graph' },
      { img: 'os-dir-acyclic' },
      'Files/subdirectories can be shared via links. Problems: aliasing and dangling links on delete (solved with reference counts).',
      { h: 'General graph' },
      { img: 'os-dir-general' },
      'Cycles allowed; traversals must avoid infinite loops and garbage collection is needed to reclaim space.',
    ],
    sources: [`${U5} slides 31–41`, `${TB} §10.3`],
  },

  'os-process-vs-thread': {
    blocks: [
      { table: { head: ['Basis', 'Process', 'Thread'], rows: [
        ['Definition', 'Program in execution', 'Lightweight unit of execution within a process'],
        ['Memory', 'Own address space', 'Shares code, data, files of its process'],
        ['Creation time', 'More', 'Less'],
        ['Context switch', 'Slower (switch address space)', 'Faster'],
        ['Communication', 'IPC needed', 'Shared variables'],
        ['Isolation', 'One process crashing doesn\'t affect others', 'One thread crashing can kill the whole process'],
      ] } },
      { h: 'Benefits of threads' },
      { ol: ['**Responsiveness**: part of an application keeps running while another part is blocked.', '**Resource sharing**: threads share memory and resources by default.', '**Economy**: cheaper to create and switch than processes.', '**Scalability**: threads can run in parallel on multiple cores.'] },
      { img: 'os-one-to-one' },
    ],
    sources: [`${U4} slides 5–14`, `${TB} §4.1`],
  },

  'os-num-pr-optimal': {
    blocks: [
      'Reference string: 7, 2, 3, 1, 2, 5, 3, 4, 6, 7, 7, 1, 0, 5, 4, 6, 2, 3, 0, 1 — 3 frames, Optimal (replace the page used farthest in the future).',
      { table: { head: ['Ref', '7', '2', '3', '1', '2', '5', '3', '4', '6', '7', '7', '1', '0', '5', '4', '6', '2', '3', '0', '1'], rows: [
        ['F1', '7', '7', '7', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
        ['F2', '', '2', '2', '2', '2', '5', '5', '5', '5', '5', '5', '5', '5', '5', '4', '6', '2', '3', '3', '3'],
        ['F3', '', '', '3', '3', '3', '3', '3', '4', '6', '7', '7', '7', '0', '0', '0', '0', '0', '0', '0', '0'],
        ['', 'F', 'F', 'F', 'F', 'H', 'F', 'H', 'F', 'F', 'F', 'H', 'H', 'F', 'H', 'F', 'F', 'F', 'F', 'H', 'H'],
      ] } },
      'Total page faults (Optimal) = **13**. For comparison: FIFO = 17, LRU = 18.',
      { tip: 'The step-by-step tool on the Numericals tab is preloaded with this exact string.' },
    ],
    sources: ["OS Nov '25 paper Q11(b)", 'Verified with the page-replacement simulator'],
  },

  'os-num-pr-fifo-opt': {
    blocks: [
      'String 1,2,3,4,1,2,3,4,2,1,3,4 with 3 frames.',
      { h: 'FIFO' },
      { table: { head: ['Ref', '1', '2', '3', '4', '1', '2', '3', '4', '2', '1', '3', '4'], rows: [
        ['F1', '1', '1', '1', '4', '4', '4', '3', '3', '3', '3', '3', '3'],
        ['F2', '', '2', '2', '2', '1', '1', '1', '4', '4', '4', '4', '4'],
        ['F3', '', '', '3', '3', '3', '2', '2', '2', '2', '1', '1', '1'],
        ['', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'H', 'F', 'H', 'H'],
      ] } },
      'FIFO faults = **9**.',
      { h: 'Optimal' },
      { table: { head: ['Ref', '1', '2', '3', '4', '1', '2', '3', '4', '2', '1', '3', '4'], rows: [
        ['F1', '1', '1', '1', '1', '1', '1', '3', '3', '3', '3', '3', '3'],
        ['F2', '', '2', '2', '2', '2', '2', '2', '2', '2', '1', '1', '1'],
        ['F3', '', '', '3', '4', '4', '4', '4', '4', '4', '4', '4', '4'],
        ['', 'F', 'F', 'F', 'F', 'H', 'H', 'F', 'H', 'H', 'F', 'H', 'H'],
      ] } },
      'Optimal faults = **6**. (At "4", page 3 is replaced because it is needed last; at the second "3", page 1 is needed last; at the last "1", page 2 is never needed again.)',
    ],
    sources: ["OS Dec '22–Jan '23 paper", 'Verified with the page-replacement simulator'],
  },

  'os-num-disk-5000': {
    blocks: [
      'Cylinders 0–4999, head at 2150, previous request 1805 → the head is moving **up** (towards 4999). Queue: 2069, 1212, 2296, 2800, 544, 1618, 356, 1523, 4965, 3681.',
      { table: { head: ['Algorithm', 'Order served', 'Total'], rows: [
        ['FCFS', '2069, 1212, 2296, 2800, 544, 1618, 356, 1523, 4965, 3681', '**13011**'],
        ['SSTF', '2069, 2296, 2800, 3681, 4965, 1618, 1523, 1212, 544, 356', '**7586**'],
        ['SCAN', '2296, 2800, 3681, 4965, (4999), 2069, 1618, 1523, 1212, 544, 356', '**7492**'],
        ['LOOK', '2296, 2800, 3681, 4965, 2069, 1618, 1523, 1212, 544, 356', '**7424**'],
        ['C-SCAN', '2296, 2800, 3681, 4965, (4999 → 0), 356, 544, 1212, 1523, 1618, 2069', '**9917** (incl. jump)'],
        ['C-LOOK', '2296, 2800, 3681, 4965, → 356, 544, 1212, 1523, 1618, 2069', '**9137** (incl. jump)'],
      ] } },
      'Example working, SCAN: (4999 − 2150) + (4999 − 356) = 2849 + 4643 = 7492.',
    ],
    sources: ["OS compiled bank (May '25, Dec '21)", `${TB} Exercise 12.x`, 'Verified with the disk-scheduling simulator'],
  },

  'os-num-disk-40': {
    blocks: [
      'Head at 40; requests 68, 78, 42, 32, 93, 35, 82.',
      { ul: [
        '**FCFS**: 40→68→78→42→32→93→35→82 = 28 + 10 + 36 + 10 + 61 + 58 + 47 = **250**.',
        '**SSTF**: 40→42→35→32→68→78→82→93 = 2 + 7 + 3 + 36 + 10 + 4 + 11 = **73**.',
      ] },
    ],
    sources: ["OS Dec '22–Jan '23 paper", 'Verified with the disk-scheduling simulator'],
  },

  'os-num-addr-bits': {
    blocks: [
      { ul: ['Pages = 64 = 2⁶ → 6 bits for page number.', 'Page size = 1024 words = 2¹⁰ → 10 bits offset.', '**Logical address = 6 + 10 = 16 bits.**', 'Frames = 32 = 2⁵ → 5 bits for frame number.', '**Physical address = 5 + 10 = 15 bits.**'] },
    ],
    sources: ["OS Nov '25 paper Q3", `${TB} Exercise 8.x`],
  },

  'os-peterson': {
    blocks: [
      'Peterson\'s solution is a classic software solution to the critical-section problem for **two processes** P0 and P1. They share `int turn` and `boolean flag[2]`.',
      { code: `do {
    flag[i] = true;
    turn = j;
    while (flag[j] && turn == j) ;   /* busy wait */
        /* critical section */
    flag[i] = false;
        /* remainder section */
} while (true);` },
      { h: 'Why it is correct' },
      { ul: ['**Mutual exclusion**: Pi enters only if flag[j] is false or turn == i. If both are trying, turn can be only i or j, so only one enters.', '**Progress**: a process not interested has flag = false and does not block the other.', '**Bounded waiting**: after Pj exits and tries again, it sets turn = i, so Pi enters after at most one turn of Pj.'] },
      { compare: [
        { title: 'Dekker\'s algorithm', items: ['First correct software solution', 'Uses flags + turn, more complex back-off logic'] },
        { title: 'Peterson\'s algorithm', items: ['Simpler, same guarantees', 'Both need memory barriers on modern CPUs'] },
      ] },
    ],
    sources: [`${U4} slides 44–46`, `${TB} §6.3`],
  },

  'os-dining': {
    blocks: [
      'Five philosophers sit around a table with five chopsticks. To eat, a philosopher needs both the left and right chopstick. Each chopstick is a semaphore initialised to 1.',
      { code: `do {
    wait(chopstick[i]);
    wait(chopstick[(i + 1) % 5]);
        /* eat */
    signal(chopstick[i]);
    signal(chopstick[(i + 1) % 5]);
        /* think */
} while (true);` },
      { h: 'Deadlock' },
      'If all five pick up their left chopstick at the same time, each waits forever for the right one: a circular wait.',
      { h: 'Remedies' },
      { ul: ['Allow at most four philosophers to sit at the table at once.', 'Let a philosopher pick up chopsticks only if both are available (in a critical section or monitor).', 'Asymmetric solution: odd philosophers pick up left then right; even pick up right then left.'] },
      { h: 'Starvation' },
      'A deadlock-free solution can still starve a philosopher whose neighbours eat alternately. A monitor solution with states (THINKING, HUNGRY, EATING) and fair ordering avoids this.',
    ],
    sources: [`${U4} slides 67–72`, `${TB} §6.7.3`],
  },

  'os-readers-writers': {
    blocks: [
      'A shared database: many **readers** may read at the same time, but a **writer** needs exclusive access.',
      { code: `semaphore rw_mutex = 1;   // writer exclusion
semaphore mutex = 1;      // protects read_count
int read_count = 0;

Writer:                     Reader:
wait(rw_mutex);             wait(mutex);
   /* writing */              read_count++;
signal(rw_mutex);             if (read_count == 1) wait(rw_mutex);
                            signal(mutex);
                               /* reading */
                            wait(mutex);
                              read_count--;
                              if (read_count == 0) signal(rw_mutex);
                            signal(mutex);` },
      'The first reader locks writers out and the last reader lets them in. This **first readers–writers** solution may starve writers; the second variant gives writers priority (and may starve readers).',
    ],
    sources: [`${U4} slides 63–66`, `${TB} §6.7.2`],
  },

  'os-tlb': {
    blocks: [
      'The **TLB** is a small, fast associative memory that caches recent page-number → frame-number translations.',
      { img: 'os-tlb' },
      { steps: ['The page number is looked up in the TLB (all entries in parallel).', '**TLB hit** → frame number available immediately.', '**TLB miss** → read the page table in memory, then add the entry to the TLB (replacing one if full).'] },
      { formula: 'EAT = h(t + m) + (1 − h)(t + 2m)' },
      'Example: t = 20 ns, m = 100 ns, h = 0.8 → EAT = 0.8(120) + 0.2(220) = 140 ns.',
      { h: 'Why ASIDs' },
      'An **address-space identifier** in each TLB entry names the process that owns it. The TLB can then hold entries from several processes at once, and a lookup matches only if the ASID matches the running process. Without ASIDs the TLB must be **flushed** on every context switch, which makes the first accesses after a switch slow.',
    ],
    sources: [`${U3} slide 70`, `${TB} §8.5.2`],
  },
}
