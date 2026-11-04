// OS Unit III model answers (memory management & secondary storage). Keyed by PYQ id.
const U3 = 'OS Unit-3 slides'
const TB = 'Silberschatz, Operating System Concepts 8e'

export default {
  'os-what-paging': {
    blocks: [
      '**Paging** is a memory-management scheme that allows the physical address space of a process to be **non-contiguous**. Logical memory is divided into fixed-size blocks called **pages**, physical memory into blocks of the same size called **frames**, and the OS keeps a **page table** for each process that records which frame holds each page.',
      'Every logical address is split into a page number *p* (index into the page table) and an offset *d*; the frame number from the table combined with *d* gives the physical address. Because any free frame can hold any page, paging removes external fragmentation.',
    ],
    sources: [`${U3} slides 56–65`, `${TB} §8.5`],
  },

  'os-page-table-purpose': {
    blocks: [
      'The **page table** is the per-process data structure that maps each **page number to a frame number**, so it is the heart of address translation in paging.',
      { ul: [
        '**Translation**: the page number *p* of a logical address indexes the table to find frame *f*; physical address = *f* × page size + offset.',
        '**Protection**: each entry carries a valid–invalid bit and read/write/execute bits, so illegal accesses trap.',
        '**Demand paging**: the valid bit tells the OS whether the page is in memory; an invalid entry causes a page fault.',
        '**Sharing**: two processes can share code by having entries point to the same frame.',
      ] },
      'The table lives in memory and is located through the **page-table base register (PTBR)**; a TLB caches recent entries to keep translation fast.',
    ],
    sources: [`${U3} slides 63–67`, `${TB} §8.5.1`],
  },

  'os-paging-ext-frag': {
    blocks: [
      'External fragmentation happens when free memory is split into many small holes, none large enough for a request. In paging, all frames are the **same size** and a process\'s pages can go into **any free frames anywhere** in memory, whether or not they are adjacent. So any free frame is always usable, and there are never "holes too small to use": external fragmentation disappears. Only a little **internal fragmentation** remains, in the unused part of each process\'s last page (on average half a page).',
    ],
    sources: [`${U3} slides 56–61`, `${TB} §8.5`],
  },

  'os-frag-reasons': {
    blocks: [
      { compare: [
        { title: 'Internal fragmentation', items: ['Unused space **inside** an allocated block', 'Cause: memory is given in fixed-size units (pages, fixed partitions) larger than the request', 'Example: a 72,766-byte process with 2,048-byte pages uses 36 pages and wastes 962 bytes in the last one'] },
        { title: 'External fragmentation', items: ['Unused space **between** allocated blocks', 'Cause: variable-size allocation (contiguous allocation, segmentation) — processes come and go, leaving scattered holes', 'Total free memory may be enough, but no single hole is large enough'] },
      ] },
      'Cures: compaction or non-contiguous allocation (paging) for external fragmentation; smaller allocation units for internal fragmentation.',
    ],
    sources: [`${U3} slides 45–50`, `${TB} §8.3.3`],
  },

  'os-tlb-role': {
    blocks: [
      'With paging, every memory reference would need two memory accesses: one to read the page-table entry and one for the data. The **Translation Look-aside Buffer (TLB)** is a small, fast, associative cache of recent page→frame translations that removes most of that cost.',
      { steps: ['The page number is presented to the TLB, which compares it with all entries at once.', '**TLB hit**: the frame number is obtained immediately (about 1 memory access in total).', '**TLB miss**: the page table in memory is read, the frame is used, and the entry is added to the TLB (replacing an old one).'] },
      { img: 'os-tlb' },
      'With a high hit ratio (98%+), paged memory runs almost as fast as unpaged memory.',
    ],
    sources: [`${U3} slide 70`, `${TB} §8.5.2`],
  },

  'os-eat': {
    blocks: [
      '**Effective access time (EAT)** is the average time per memory reference, taking TLB hits and misses into account.',
      { formula: 'EAT = h × (t + m) + (1 − h) × (t + 2m)' },
      'Here h = TLB hit ratio, t = TLB lookup time, m = memory access time. On a hit we pay the TLB lookup + one memory access; on a miss, the TLB lookup + the page-table access + the data access.',
      'Example: t = 20 ns, m = 100 ns, h = 0.80 → EAT = 0.8 × 120 + 0.2 × 220 = 96 + 44 = **140 ns** (a 40% slowdown). With h = 0.98 → 0.98 × 120 + 0.02 × 220 = **122 ns**.',
      'With demand paging and page faults, EAT = (1 − p) × ma + p × (page-fault service time).',
    ],
    sources: [`${TB} §8.5.2, §9.2.2`],
  },

  'os-page-fault-handle': {
    blocks: [
      'A page fault is a trap raised when a process references a page marked **invalid** (not in memory). The OS handles it in six steps:',
      { steps: ['Check an internal table (in the PCB) to decide if the reference was legal; if illegal, terminate the process.', 'If legal but not loaded, find a **free frame** (run page replacement if none).', 'Schedule a **disk read** of the page into the frame.', 'When the read finishes, **update the page table** (frame number, valid bit).', 'Restart the instruction that caused the trap; the process continues as if the page had always been there.'] },
      { img: 'os-page-fault' },
    ],
    sources: [`${U3} slides 79–80`, `${TB} §9.2.1`],
  },

  'os-thrashing': {
    blocks: [
      '**Thrashing** is a state where a process (or the whole system) spends more time **paging** (swapping pages in and out) than executing.',
      { h: 'Cause' },
      'If a process does not have enough frames to hold its **working set** (the pages it is actively using), it faults, replaces a page it will need again soon, faults again, and so on. CPU utilisation drops; a naive OS then raises the degree of multiprogramming, which takes even more frames away and makes thrashing worse.',
      { h: 'Remedies' },
      { ul: ['**Working-set model**: give each process enough frames for its working set; if the sum exceeds memory, suspend a process.', '**Page-fault frequency (PFF)**: set upper and lower bounds on the fault rate; add frames above the upper bound, remove frames below the lower bound.', 'Use local (per-process) replacement and reduce the degree of multiprogramming.'] },
    ],
    sources: [`${TB} §9.6`],
  },

  'os-num-addr-bits': {
    blocks: [
      { ul: ['Number of pages = 64 = 2⁶ → **6 bits** for the page number.', 'Page size = 1024 words = 2¹⁰ → **10 bits** for the offset.', '**Logical address = 6 + 10 = 16 bits.**', 'Number of frames = 32 = 2⁵ → **5 bits** for the frame number (frame size = page size = 2¹⁰).', '**Physical address = 5 + 10 = 15 bits.**'] },
    ],
    sources: ["OS Nov '25 paper Q3", `${TB} Exercise 8.x`],
  },

  'os-sync-async-io': {
    blocks: [
      { compare: [
        { title: 'Synchronous (blocking) I/O', items: ['The calling process waits until the I/O completes', 'The call returns with the data/result', 'Simple to program; the CPU runs other processes meanwhile', 'e.g. a normal read()'] },
        { title: 'Asynchronous (non-blocking) I/O', items: ['The call returns immediately; the I/O continues in the background', 'Completion is signalled later (signal, callback, polling, event)', 'Lets one process overlap computation and I/O', 'e.g. aio_read(), a UI loading a file while staying responsive'] },
      ] },
    ],
    sources: [`${TB} §13.3.5`],
  },

  'os-disk-access-ways': {
    blocks: [
      'Computers access disk storage in three ways:',
      { ol: ['**Host-attached storage**: disks connected directly through local I/O ports/buses (SATA, SCSI, USB, Fibre Channel).', '**Network-attached storage (NAS)**: a storage device reached over a LAN through a remote file-access protocol such as NFS or CIFS; clients see files.', '**Storage-area network (SAN)**: a private, high-speed network connecting servers to storage units, giving block-level access and flexible sharing.'] },
      'In addition, data on the disk can be accessed **sequentially** or **directly (randomly)** by block number.',
    ],
    sources: [`${TB} §12.3`],
  },

  'os-paging': {
    blocks: [
      '**Paging** is a non-contiguous memory-management scheme. Physical memory is divided into fixed-size **frames**, logical memory into same-size **pages**. When a process runs, its pages are loaded into any available frames, and a **page table** maps pages to frames.',
      { img: 'os-paging-model' },
      { h: 'Paging hardware' },
      'Every address generated by the CPU is divided into a **page number (p)** and a **page offset (d)**. If the logical address space is 2^m and the page size 2^n, the high m − n bits are *p* and the low n bits are *d*. The page number indexes the page table to get the frame number *f*; *f* combined with *d* is the physical address sent to memory.',
      { img: 'os-paging-hw' },
      { h: 'Paging model and example' },
      'With a 4-byte page and page table [5, 6, 1, 2]: logical address 0 (page 0, offset 0) → frame 5 → physical 20; logical 3 → 23; logical 4 (page 1) → frame 6 → 24; logical 13 (page 3, offset 1) → frame 2 → 9.',
      { img: 'os-paging-example' },
      { h: 'Implementation and TLB' },
      'The page table is kept in memory and pointed to by the page-table base register (PTBR). Because that means two memory accesses per reference, a **TLB** caches recent translations; EAT = h(t + m) + (1 − h)(t + 2m).',
      { img: 'os-tlb' },
      { h: 'Advantages and disadvantages' },
      { ul: ['No external fragmentation; any free frame can be used.', 'Easy sharing (shared code) and protection (bits per page).', 'Supports virtual memory / demand paging.', 'Internal fragmentation in the last page; memory needed for page tables; translation overhead without a TLB.'] },
    ],
    sources: [`${U3} slides 56–76`, `${TB} §8.5`],
  },

  'os-two-level': {
    blocks: [
      'A 32-bit address space with 4 KB pages would need 2²⁰ (1 million) page-table entries per process — 4 MB of contiguous memory. **Hierarchical (two-level) paging** pages the page table itself.',
      { h: 'Address format' },
      { table: { head: ['p1 (10 bits)', 'p2 (10 bits)', 'd (12 bits)'], rows: [['index into the outer page table', 'index into a page of the inner page table', 'offset within the page']] } },
      { steps: ['The **PTBR** points to the outer page table.', '**p1** selects an entry in the outer table; that entry gives the frame holding one page of the inner page table.', '**p2** selects the entry in that inner page, which gives the frame *f* of the data.', 'The physical address is *f* followed by the offset **d**.'] },
      'This is also called a **forward-mapped** page table. Only the parts of the inner table that are actually used need to exist, which saves a lot of memory for sparse address spaces. The cost is an extra memory access per translation (three instead of two), which the TLB hides.',
      'Example (VAX/x86-32): 32-bit address = 10 + 10 + 12 bits; each table fits exactly in one 4 KB page (1024 entries × 4 bytes).',
    ],
    sources: [`${TB} §8.6.1`],
  },

  'os-page-table-structures': {
    blocks: [
      'Large address spaces make simple page tables huge, so three structures are used.',
      { h: '(a) Hierarchical page table' },
      'The page number is split into p1, p2 (…); p1 indexes an outer table whose entry points to an inner page of the table, p2 indexes that inner page to get the frame. Only used parts of the table are allocated. Suitable for 32-bit systems; 64-bit would need too many levels.',
      { h: '(b) Hashed page table' },
      'The virtual page number is hashed into a hash table. Each slot holds a linked list of elements (virtual page number, frame number, next pointer). Translation: hash the page number, walk the chain comparing virtual page numbers, and use the matching frame. Common for address spaces larger than 32 bits. A **clustered** variant stores several pages per element.',
      { h: '(c) Inverted page table' },
      'One entry per **physical frame** (not per page), holding ⟨process-id, page number⟩. The logical address is ⟨pid, p, d⟩. The table is searched for the entry matching ⟨pid, p⟩; its index *i* is the frame number, and the physical address is ⟨i, d⟩. Memory for the table is small and fixed, but search is slow (a hash table is used), and sharing pages is hard.',
      { table: { head: ['', 'Hierarchical', 'Hashed', 'Inverted'], rows: [['Entries', 'Per page (in use)', 'Per page in use', 'Per frame'], ['Lookup', 'Multi-level index', 'Hash + chain walk', 'Search / hash'], ['Best for', '32-bit', '64-bit', 'Saving memory']] } },
    ],
    sources: [`${TB} §8.6`, 'OS Dec \'23 paper Q10(b)'],
  },

  'os-asid': {
    blocks: [
      'The TLB caches page→frame translations. Different processes use the **same virtual page numbers** for different physical frames, so a TLB entry belonging to one process would give a wrong translation for another.',
      { h: 'Without ASIDs' },
      'On every context switch the whole TLB must be **flushed** (all entries invalidated). The next process then starts with an empty TLB and suffers many misses, which slows down every context switch.',
      { h: 'With ASIDs' },
      { ul: [
        'Each TLB entry stores an **address-space identifier** that uniquely names the process owning the translation.',
        'On a lookup, the TLB matches both the virtual page number **and** the current process\'s ASID; a mismatch is treated as a miss.',
        'Entries for several processes can stay in the TLB at once, so no flush is needed on a context switch.',
        'It also gives **protection**: a process can never use another process\'s translation.',
      ] },
      'Result: faster context switches and better TLB hit ratios in multiprogrammed systems.',
    ],
    sources: [`${TB} §8.5.2`, "OS Nov '25 paper Q10(b)"],
  },

  'os-seg-vs-paging': {
    blocks: [
      '**Segmentation** is a memory-management scheme that supports the programmer\'s view of memory: a program is a collection of variable-sized **segments** (main program, functions, stack, global data, symbol table). A logical address is ⟨segment number *s*, offset *d*⟩.',
      { h: 'Segmentation hardware' },
      'The **segment table** has a base (starting physical address) and limit (length) for each segment, located by the segment-table base register. The offset is checked against the limit; if *d* < limit, physical address = base + *d*, otherwise the hardware traps.',
      { img: 'os-seg-hw' },
      { h: 'Segmentation vs paging' },
      { table: { head: ['Basis', 'Paging', 'Segmentation'], rows: [
        ['Division', 'Fixed-size pages', 'Variable-size logical segments'],
        ['Visible to the user?', 'No — done by the OS/hardware', 'Yes — reflects program structure'],
        ['Address', '(page, offset)', '(segment, offset)'],
        ['Table entry', 'Frame number', 'Base and limit'],
        ['Fragmentation', 'Internal', 'External'],
        ['Sharing/protection', 'Per page', 'Per logical unit (e.g. share the code segment)'],
        ['Size limit check', 'Implicit (offset bits)', 'Explicit limit comparison'],
      ] } },
      'Many systems combine them (segmentation with paging, e.g. Intel x86) to get the logical view of segments without external fragmentation.',
    ],
    sources: [`${U3} slides 81–89`, `${TB} §8.4`],
  },

  'os-free-hole': {
    blocks: [
      'In variable-partition (contiguous) allocation, memory contains a set of **holes**. To satisfy a request of size *n* the OS picks one of:',
      { ul: [
        '**First fit**: allocate the first hole that is big enough; search starts at the beginning (or where the last search ended — *next fit*). Fast.',
        '**Best fit**: allocate the smallest hole that is big enough; requires searching the whole list (unless sorted). Leaves the smallest leftover hole.',
        '**Worst fit**: allocate the largest hole; leaves the largest leftover, which may still be useful.',
      ] },
      'Simulations show first fit and best fit are better than worst fit in time and storage use; first fit is usually fastest. All three suffer external fragmentation (the **50-percent rule**: for N allocated blocks, about 0.5N blocks are lost to fragmentation). See the first/best/worst-fit numerical for a worked example.',
    ],
    sources: [`${U3} slides 47–50`, `${TB} §8.3.2`],
  },

  'os-dynamic-alloc': {
    blocks: [
      { h: 'Contiguous allocation' },
      { ul: ['The process occupies one block; to grow, the memory **immediately after it** must be free.', 'If not, the OS must **relocate** the whole process to a larger hole (copying it) — which requires dynamic (run-time) binding via a relocation register — or swap it out until space is available.', 'The limit register must be updated to the new size.', 'Leaves the problem of external fragmentation; compaction may be needed.'] },
      { h: 'Paging' },
      { ul: ['To grow, the OS simply allocates **new free frames** (anywhere) and adds entries to the page table, marking them valid.', 'No copying or contiguity needed; the page-table size limit (PTLR) or valid bits must be extended.', 'Heap and stack can grow towards each other in a sparse virtual address space, and pages can be allocated lazily on first touch (demand-zero pages).'] },
      'So paging supports dynamic growth far more easily.',
    ],
    sources: [`${TB} §8.3, §8.5`, "OS May '25 paper"],
  },

  'os-no-access': {
    blocks: [
      { h: 'Why a process cannot access memory it does not own' },
      'Every address a process generates is translated through **its own page table**. The page table contains entries only for frames allocated to that process; addresses beyond its pages hit **invalid** entries and cause a trap. There is simply no way to name another process\'s frame. The page table can only be changed by the OS in kernel mode, so a user process cannot add entries for itself.',
      { h: 'How the OS could allow access to additional memory' },
      { ul: ['Map extra frames into the process\'s page table (e.g. `brk`/`sbrk`, `mmap`).', 'Map the **same frame** into two processes\' page tables to create **shared memory** (e.g. `shmget`/`mmap` shared).', 'Set the protection bits (read-only / read-write) appropriately.'] },
      { h: 'Should it or should it not?' },
      { compare: [
        { title: 'Should (with control)', items: ['Shared memory is the fastest form of IPC', 'Shared libraries/code save memory', 'Programs legitimately need to grow'] },
        { title: 'Should not (uncontrolled)', items: ['Breaks isolation: one buggy or malicious process could corrupt another or the kernel', 'Security risk (reading private data)', 'So it should be allowed only through checked system calls with permissions'] },
      ] },
    ],
    sources: [`${TB} §8.5.3–8.5.4`, "OS Nov '25 paper Q10(a)"],
  },

  'os-page-sharing': {
    blocks: [
      { h: 'Effect' },
      'If two page-table entries (in one process or in two processes) point to the **same frame**, both pages map to the same physical memory: a read through either sees the same bytes, and they are effectively **shared**. This is how shared code (re-entrant code such as an editor or a library) and shared memory work.',
      { h: 'Reducing the time to copy a large region' },
      'Instead of copying the data byte by byte, the OS makes the destination page-table entries point to the **source frames** and marks both copies **read-only (copy-on-write)**. The "copy" completes instantly by updating page tables only. `fork()` uses exactly this. Only when either side **writes** to a page does a protection fault occur; the OS then copies **just that one page** and makes each mapping writable.',
      { h: 'Effect of updating a byte on one page' },
      { ul: ['With plain sharing (both entries writable): the change appears **immediately in both** pages, since they are the same physical memory.', 'With copy-on-write: the write traps, the OS gives the writer a private copy of that page, and the other "copy" keeps the **old** value.'] },
    ],
    sources: [`${TB} §8.5.4, §9.3`, "OS Nov '25 paper Q11(a)"],
  },

  'os-mem-protection': {
    blocks: [
      '**Memory protection** prevents a process from accessing memory outside its own address space — another process\'s memory or the OS.',
      { h: '1. Base and limit registers (contiguous allocation)' },
      'The **base (relocation) register** holds the smallest legal physical address; the **limit register** holds the size of the range. Every CPU-generated address is compared with the limit; if it is within range it is added to the base; otherwise the hardware **traps** to the OS ("addressing error"). Only the OS, in kernel mode, can load these registers.',
      { img: 'os-addr-translation' },
      { h: '2. Paging: protection bits in the page table' },
      { ul: ['**Valid–invalid bit**: valid means the page is in the process\'s logical address space; invalid entries trap. A **page-table length register (PTLR)** may also bound the table.', '**Read / write / execute bits**: an attempt to write to a read-only page (e.g. code) causes a protection trap.', 'Each process has its own page table, so it cannot even name another process\'s frames.'] },
      { img: 'os-valid-bit' },
      { h: '3. Segmentation' },
      'Each segment-table entry has a **limit** checked on every access, plus protection bits; read-only code segments can be shared safely.',
      { h: '4. Hardware modes' },
      'Dual-mode operation (user/kernel) ensures only the kernel can change base/limit registers or page tables. Modern hardware adds the **NX (no-execute) bit** so data pages cannot be executed.',
    ],
    sources: [`${U3} slides 33–34, 74`, `${TB} §8.1.1, §8.5.3`, 'OS Dec \'23 paper Q13(b)'],
  },

  'os-demand-paging': {
    blocks: [
      '**Demand paging** loads a page into memory **only when it is referenced**, not all at the start. It is implemented by a **lazy swapper (pager)**.',
      { ul: ['Each page-table entry has a **valid–invalid bit**: valid = in memory; invalid = not in memory (or not legal).', 'Accessing an invalid page causes a **page fault**; the OS brings the page in and restarts the instruction.', '**Pure demand paging**: start the process with no pages in memory.'] },
      { img: 'os-demand-paging' },
      { h: 'Example' },
      'A program has pages A–H; only A, C and F are needed to start, so only they are loaded (valid). When the program first touches page B, a fault loads B into a free frame and its entry becomes valid.',
      { h: 'Advantages' },
      'Less I/O at start-up, less memory per process, more processes in memory (higher multiprogramming), and programs can be larger than physical memory. Performance depends on a low page-fault rate: EAT = (1 − p) × ma + p × page-fault time.',
    ],
    sources: [`${U3} slides 77–78`, `${TB} §9.2`],
  },

  'os-page-fault': {
    blocks: [
      '**When page faults occur**: a page fault occurs when a process accesses a page whose page-table entry is marked **invalid**. This happens because (a) the page is legal but not currently in memory (demand paging, or it was replaced), or (b) the address is not part of the process at all (an illegal reference).',
      { h: 'Actions taken by the OS' },
      { steps: [
        'The reference to an invalid page **traps** to the OS (page-fault trap); the state of the process is saved.',
        'The OS checks an internal table (in the PCB): if the reference is **invalid**, terminate the process; if valid but not in memory, page it in.',
        'Find a **free frame** from the free-frame list (if none, run a page-replacement algorithm to free one, writing the victim to disk if it is dirty).',
        'Schedule a **disk operation** to read the page from the backing store into that frame (the process waits; the CPU is given to another process).',
        'When the I/O completes, **update the page table**: set the frame number and mark the entry valid.',
        '**Restart the instruction** that caused the fault; the process now accesses the page as if it had always been in memory.',
      ] },
      { img: 'os-page-fault' },
    ],
    sources: [`${U3} slides 79–80`, `${TB} §9.2.1`],
  },

  'os-need-replacement': {
    blocks: [
      'With demand paging the OS **over-allocates** memory: it runs more processes than would fit if all their pages were loaded. When a page fault occurs and **no frame is free**, the OS must free one — this is page replacement.',
      { steps: ['Find the location of the desired page on disk.', 'Find a free frame; if none, use a **page-replacement algorithm** to select a **victim** frame.', 'Write the victim to disk if it was modified (dirty bit), update its page-table entry to invalid.', 'Read the desired page into the freed frame; update the tables.', 'Restart the process.'] },
      { img: 'os-page-replacement' },
      { h: 'Example' },
      'Memory has 3 frames holding pages 7, 0, 1. The process now references page 2. Since no frame is free, the OS must evict one — with FIFO it evicts 7 (oldest); with Optimal it evicts the page not needed for the longest time.',
      'Using a **dirty (modify) bit** halves the work: clean pages need not be written back. Good algorithms aim for the lowest page-fault rate.',
    ],
    sources: [`${U3} slides 90–94`, `${TB} §9.4`],
  },

  'os-fifo': {
    blocks: [
      '**FIFO page replacement**: each page is stamped with the time it was brought in; when a page must be replaced, the **oldest page** is chosen. It can be implemented with a FIFO queue: pages enter at the tail, the victim is taken from the head.',
      { h: 'Example: 7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1 with 3 frames' },
      { table: { head: ['Ref', '7', '0', '1', '2', '0', '3', '0', '4', '2', '3', '0', '3', '2', '1', '2', '0', '1', '7', '0', '1'], rows: [
        ['F1', '7', '7', '7', '2', '2', '2', '2', '4', '4', '4', '0', '0', '0', '0', '0', '0', '0', '7', '7', '7'],
        ['F2', '', '0', '0', '0', '0', '3', '3', '3', '2', '2', '2', '2', '2', '1', '1', '1', '1', '1', '0', '0'],
        ['F3', '', '', '1', '1', '1', '1', '0', '0', '0', '3', '3', '3', '3', '3', '2', '2', '2', '2', '2', '1'],
        ['', 'F', 'F', 'F', 'F', 'H', 'F', 'F', 'F', 'F', 'F', 'F', 'H', 'H', 'F', 'F', 'H', 'H', 'F', 'F', 'F'],
      ] } },
      '**15 page faults.**',
      { h: 'Pros and cons' },
      'Easy to understand and implement, but the oldest page may still be heavily used (e.g. a variable initialised early and used throughout). FIFO also suffers **Belady\'s anomaly**: increasing the number of frames can increase faults (1,2,3,4,1,2,5,1,2,3,4,5 gives 9 faults with 3 frames but 10 with 4).',
    ],
    sources: [`${U3} slides 95–99`, `${TB} §9.4.2`, 'Verified with the page-replacement simulator'],
  },

  'os-lru': {
    blocks: [
      '**LRU (least recently used)**: replace the page that **has not been used for the longest time**. It uses the recent past as an approximation of the near future, approximating the Optimal algorithm.',
      { h: 'Example: 7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1 with 3 frames' },
      { table: { head: ['Ref', '7', '0', '1', '2', '0', '3', '0', '4', '2', '3', '0', '3', '2', '1', '2', '0', '1', '7', '0', '1'], rows: [
        ['F1', '7', '7', '7', '2', '2', '2', '2', '4', '4', '4', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1'],
        ['F2', '', '0', '0', '0', '0', '0', '0', '0', '0', '3', '3', '3', '3', '3', '3', '0', '0', '0', '0', '0'],
        ['F3', '', '', '1', '1', '1', '3', '3', '3', '2', '2', '2', '2', '2', '2', '2', '2', '2', '7', '7', '7'],
        ['', 'F', 'F', 'F', 'F', 'H', 'F', 'H', 'F', 'F', 'F', 'F', 'H', 'H', 'F', 'H', 'F', 'H', 'F', 'H', 'H'],
      ] } },
      '**12 page faults** (FIFO gives 15, Optimal 9).',
      { h: 'Implementation' },
      { ul: ['**Counters**: each page-table entry gets a time-of-use field copied from a logical clock on every reference; replace the page with the smallest time (needs a search).', '**Stack**: keep a stack of page numbers; on a reference move the page to the top; the bottom is the LRU page (no search; a doubly linked list makes moves O(1)).'] },
      'LRU is a **stack algorithm**, so it never suffers Belady\'s anomaly. Because exact LRU needs hardware help, real systems use approximations (reference bit, second-chance/clock).',
    ],
    sources: [`${U3} slides 100–106`, `${TB} §9.4.4`, 'Verified with the page-replacement simulator'],
  },

  'os-swapping': {
    blocks: [
      { h: '(a) Swapping' },
      'A process must be in memory to execute, but it can be **temporarily moved out** to a backing store (fast disk) and brought back later. This lets the total address space of all processes exceed physical memory.',
      { img: 'os-swapping' },
      { ul: ['**Swap out / roll out**: write a (lower-priority or idle) process to the backing store.', '**Swap in / roll in**: bring it back when it is to run.', 'With run-time address binding the process can come back to a different place in memory.', 'Cost is dominated by **transfer time**, proportional to the amount of memory swapped (e.g. 100 MB at 50 MB/s ≈ 2 s each way).', 'A process waiting for I/O into its own buffers must not be swapped (or I/O must go to OS buffers).', 'Modern systems swap **pages** rather than whole processes, and only when free memory is low.'] },
      { h: '(b) Overlays' },
      'Overlays let a program larger than memory run by keeping in memory **only the instructions and data needed at a given time**. When other parts are needed, they are loaded into the space occupied by parts no longer needed.',
      { ul: ['Example: a two-pass assembler — pass 1 (70 KB) and pass 2 (80 KB) share the symbol table (20 KB) and common routines (30 KB); with an overlay driver, only pass 1 or pass 2 is in memory at a time, so 140 KB is needed instead of 200 KB.', 'Implemented by the **programmer** (no OS support needed), which makes it complex and error-prone. Virtual memory replaced overlays.'] },
    ],
    sources: [`${U3} slides 28–31`, `${TB} §8.2`],
  },

  'os-linux-mm': {
    blocks: [
      { h: 'Physical memory management' },
      { ul: [
        'Memory is divided into **zones**: ZONE_DMA (for devices that can address only low memory), ZONE_NORMAL, and ZONE_HIGHMEM (not permanently mapped into the kernel).',
        'The **page allocator** uses the **buddy system**: free memory is kept in blocks of 2ᵏ pages. A request is rounded up to a power of two; larger blocks are split into two "buddies" until the size fits; when both buddies are free they are **coalesced**. This keeps large contiguous regions available.',
        'The **slab allocator** handles kernel objects (task_struct, inodes): each cache holds slabs of pre-initialised objects, so allocation is fast and there is no internal fragmentation.',
      ] },
      { h: 'Virtual memory' },
      { ul: [
        'Each process has an address space made of **regions** (`vm_area_struct`) — text, data, heap, stack, memory-mapped files — each with its own permissions.',
        'Linux uses **multi-level page tables** (4 or 5 levels on x86-64).',
        '**Demand paging** and **copy-on-write** after `fork()`; `exec()` maps the program file without reading it all.',
        'The **page cache** keeps file pages in memory; `mmap` maps files directly into the address space.',
      ] },
      { h: 'Page replacement and swapping' },
      { ul: ['Pages are kept on **active** and **inactive** LRU lists, using the reference bit (a second-chance/clock approximation of LRU).', 'The kernel thread **kswapd** wakes when free memory falls below a threshold, scans the inactive list, drops clean pages and writes dirty/anonymous pages to **swap space**.', 'If memory still cannot be found, the **OOM killer** terminates a process.'] },
    ],
    sources: [`${TB} §21.6 (Linux memory management)`],
  },

  'os-unix-replace-swap': {
    blocks: [
      { h: 'Swapping in early Unix' },
      'Early Unix (and System V) swapped **whole processes** between memory and a **swap device**. The swapper (process 0) periodically chose processes to swap out — those blocked for a long time or the largest/lowest priority — and swapped in ready processes that had been out the longest. The swap area was managed with a map of free blocks allocated contiguously, and the text (code) segment could be shared and not written back.',
      { h: 'Paging and page replacement in BSD Unix' },
      { ul: [
        'BSD introduced **demand paging**: pages are brought in on page faults.',
        'A kernel process, the **page daemon** (pagedaemon), keeps a minimum number of free frames (lotsfree). When free memory falls below the threshold, it runs a **two-handed clock** algorithm (an approximation of LRU): the front hand clears the reference bit of pages, the back hand (a fixed distance behind) frees pages whose reference bit is still clear.',
        'Freed pages go on a free list; dirty pages are written to swap first.',
        'If paging cannot keep up (thrashing), the **swapper** swaps out whole processes to reduce the load.',
      ] },
      { h: 'Modern Linux' },
      'Active/inactive LRU lists, the kswapd thread, swap partitions or swap files, and the OOM killer when no memory can be reclaimed.',
    ],
    sources: [`${TB} Appendix A (BSD), §21.6`, 'OS Dec \'23 paper Q15(a)'],
  },

  'os-moving-head': {
    blocks: [
      'A **moving-head disk** has one read–write head per platter surface, all mounted on a single **disk arm** that moves them together.',
      { img: 'os-disk-pack' },
      { ul: [
        '**Platters**: circular disks coated with magnetic material, spinning at 5,400–15,000 rpm.',
        '**Tracks**: concentric circles on each surface; **sectors**: subdivisions of a track (512 B or 4 KB) — the smallest unit of transfer.',
        '**Cylinder**: the set of tracks at one arm position across all surfaces.',
        '**Read–write heads** float just above each surface; a **head crash** (head touching the surface) destroys data.',
        '**Disk controller** and host controller manage transfers.',
      ] },
      { img: 'os-track-sector' },
      { h: 'Timing terminology' },
      { ul: ['**Seek time**: time to move the arm to the required cylinder.', '**Rotational latency**: time for the required sector to rotate under the head (average = half a rotation).', '**Transfer rate**: rate of data flow between the drive and the computer.', '**Positioning (random-access) time** = seek time + rotational latency.'] },
      { formula: 'Access time = seek time + rotational latency + transfer time' },
    ],
    sources: [`${U3} slides 111–118`, `${TB} §12.2.1`],
  },

  'os-disk-mgmt': {
    blocks: [
      'The OS is responsible for several aspects of disk management:',
      { h: '1. Disk formatting' },
      { ul: ['**Low-level (physical) formatting**: divide the disk into sectors, each with a header, a data area and a trailer containing the sector number and an **ECC** (error-correcting code). Usually done at the factory.', '**Partitioning**: split the disk into one or more groups of cylinders, each treated as a logical disk.', '**Logical formatting**: create a file system — free-space maps, an empty directory, metadata. Raw partitions without a file system are also possible (e.g. for databases or swap).'] },
      { h: '2. Boot block' },
      'A small **bootstrap loader** in ROM loads a full bootstrap program from the **boot blocks** at a fixed location on the disk (e.g. the Master Boot Record), which then loads the OS kernel. A disk with a boot partition is a **boot disk / system disk**.',
      { img: 'os-boot' },
      { h: '3. Bad blocks' },
      { ul: ['On simple disks, bad blocks are found during formatting or by `chkdsk`/`badblocks` and marked unusable in the FAT.', 'On SCSI-class disks, the controller keeps a **bad-block list** and uses **sector sparing (forwarding)** — remap a bad sector to a spare one — or **sector slipping** — shift sectors down by one to free a spare next to the bad one.'] },
      { h: '4. Other issues' },
      'Disk scheduling for performance, swap-space placement, free-space management, and reliability (backups, RAID).',
    ],
    sources: [`${U3} slides 147–154`, `${TB} §12.5`],
  },

  'os-disk-sched': {
    blocks: [
      'The OS orders pending disk requests to **minimise seek time** (head movement). All examples use the queue **98, 183, 37, 122, 14, 124, 65, 67** on cylinders 0–199 with the head at **53**.',
      { h: '1. FCFS' },
      'Serve requests in arrival order: 53→98→183→37→122→14→124→65→67. Total = 45 + 85 + 146 + 85 + 108 + 110 + 59 + 2 = **640 cylinders**. Fair, but wild swings.',
      { img: 'os-disk-fcfs' },
      { h: '2. SSTF (shortest seek time first)' },
      'Always go to the closest request: 53→65→67→37→14→98→122→124→183. Total = **236**. Much better, but can **starve** far requests.',
      { img: 'os-disk-sstf' },
      { h: '3. SCAN (elevator)' },
      'The arm moves towards one end serving requests, then reverses. Moving towards 0: 53→37→14→0→65→67→98→122→124→183. Total = 53 + 183 = **236**.',
      { h: '4. C-SCAN' },
      'Like SCAN but serves only in one direction; on reaching the end it jumps back to the beginning. Moving up: 53→65…183→199→0→14→37. Total = **382** (counting the return). More uniform waiting time.',
      { h: '5. LOOK and C-LOOK' },
      'Like SCAN/C-SCAN but the arm goes only as far as the **last request** in each direction. LOOK (up): 53→…→183→37→14 = 130 + 169 = **299**. C-LOOK (up): 53→…→183→14→37 = 130 + 169 + 23 = **322**.',
      { h: 'Choosing' },
      'SSTF is common and natural; SCAN/C-SCAN suit heavily loaded disks (no starvation); the request pattern and file-allocation method also matter.',
    ],
    sources: [`${U3} slides 119–146`, `${TB} §12.4`, 'Verified with the disk-scheduling simulator'],
  },

  'os-fcfs-disk': {
    blocks: [
      '**FCFS (first-come, first-served)** disk scheduling services requests **in the order they arrive**. It is the simplest algorithm and is intrinsically fair — no request is starved — but it does not try to reduce head movement.',
      { h: 'Example' },
      'Queue: 98, 183, 37, 122, 14, 124, 65, 67; head at 53 (cylinders 0–199).',
      { img: 'os-disk-fcfs' },
      { table: { head: ['Move', '53→98', '98→183', '183→37', '37→122', '122→14', '14→124', '124→65', '65→67'], rows: [['Cylinders', '45', '85', '146', '85', '108', '110', '59', '2']] } },
      'Total head movement = **640 cylinders**; average seek = 640 / 8 = 80 cylinders per request.',
      { compare: [
        { title: 'Advantages', items: ['Simple to implement', 'Fair; no starvation', 'Predictable order'] },
        { title: 'Disadvantages', items: ['Large total seek (wild swings from 122 to 14 to 124)', 'Poor throughput under heavy load'] },
      ] },
    ],
    sources: [`${U3} slides 129–131`, `${TB} §12.4.1`],
  },

  'os-clook-vs-look': {
    blocks: [
      { ul: ['**LOOK**: the head moves in one direction serving requests up to the last one, then **reverses** and serves requests on the way back.', '**C-LOOK**: the head serves requests in **one direction only**; after the last request it **jumps back** to the lowest pending request without serving anything on the return, then continues in the same direction.'] },
      { img: 'os-disk-clook' },
      { h: 'Why C-LOOK can increase average response time and lower throughput' },
      { ul: [
        '**Wasted return jump**: the jump from the highest to the lowest request is a long seek during which **no requests are served**. LOOK serves requests on the way back, so its head movement does useful work in both directions. Example (queue 98, 183, 37, 122, 14, 124, 65, 67, head 53 moving up): LOOK = 299 cylinders, C-LOOK = 322.',
        '**Lower throughput**: more total head movement for the same set of requests means fewer requests served per unit time.',
        '**Higher average response time**: requests just below the current head position must wait for the head to finish the upward sweep *and* the long jump back; under LOOK they would be served as soon as the head reversed.',
      ] },
      'C-LOOK\'s advantage is **uniform (more predictable) waiting time** — LOOK favours middle cylinders — so the trade-off is fairness/variance versus average response time and throughput.',
    ],
    sources: [`${U3} slides 141–145`, `${TB} §12.4.4–12.4.5`],
  },

  'os-num-relocation': {
    blocks: [
      'Hardware rule for relocation/limit registers: check the logical address against the limit; if legal, **physical = relocation register + logical address**.',
      { h: 'Computation' },
      { ul: ['Logical 990 K → 990 K < 31000 K (limit) → physical = 30010 K + 990 K = **31000 K**.', 'Logical 1020 K → 1020 K < 31000 K → physical = 30010 K + 1020 K = **31030 K**.'] },
      { h: 'But note the program size' },
      'The process\'s code is only **700 K**, so its legal logical addresses are 0–699 K. Logical addresses 990 K and 1020 K lie outside the process. If the limit register correctly held the process size (700 K), both addresses would fail the check (990 ≥ 700, 1020 ≥ 700) and the CPU would **trap with an addressing error**.',
      { tip: 'In the exam: show the formula, compute both physical addresses (31000 K and 31030 K), then add the remark that with a 700 K program both addresses are beyond the process and would trap. That covers both readings of the question.' },
    ],
    sources: ["OS Dec '24 paper", `${TB} §8.1.1–8.1.3`],
  },

  'os-num-16bit': {
    blocks: [
      { ul: ['Page size = 512 bytes = 2⁹ → **9 offset bits**.', 'Address = 16 bits → page number = 16 − 9 = **7 bits**.'] },
      'Logical address **0000010 | 001111101**:',
      { ul: ['Page number = 0000010₂ = **2**', 'Offset = 001111101₂ = 64 + 32 + 16 + 8 + 4 + 1 = **125**', 'Frame = 15 → physical address = 15 × 512 + 125 = 7680 + 125 = **7805**', 'In binary: 0001111 | 001111101'] },
    ],
    sources: ["OS Jun '24 (AIML) paper"],
  },

  'os-num-fit': {
    blocks: [
      'Partitions (in order): 300, 600, 350, 200, 750, 125 KB. Processes: 115, 500, 358, 200, 375 KB. (Leftover space in a partition stays usable as a hole.)',
      { table: { head: ['Process', 'First fit', 'Best fit', 'Worst fit'], rows: [
        ['115 KB', '300 → hole 185', '125 → hole 10', '750 → hole 635'],
        ['500 KB', '600 → hole 100', '600 → hole 100', '635 → hole 135'],
        ['358 KB', '750 → hole 392', '750 → hole 392', '600 → hole 242'],
        ['200 KB', '350 → hole 150', '200 → hole 0', '350 → hole 150'],
        ['375 KB', '392 → hole 17', '392 → hole 17', '**Cannot be allocated** (largest hole 300)'],
      ] } },
      { ul: ['**First fit**: all five processes placed.', '**Best fit**: all five placed, with tighter fits (an exact fit for 200 KB, only 10 KB left in the 125 KB partition).', '**Worst fit**: the 375 KB process must wait.'] },
      '**Best fit** makes the most efficient use of memory here (first fit also succeeds); worst fit wastes the large partition early.',
    ],
    sources: ["OS Dec '21 (CSE) paper", `${TB} Exercise 8.x`],
  },

  'os-num-segment': {
    blocks: [
      'Segmentation divides a program into variable-length logical segments; a logical address is ⟨s, d⟩ and is legal only if d < limit(s). Physical address = base(s) + d.',
      { table: { head: ['Segment', 'Base', 'Length'], rows: [['0', '219', '600'], ['1', '2300', '14'], ['2', '90', '100'], ['3', '1327', '580']] } },
      'The paper doesn\'t print the logical addresses; the standard textbook set is:',
      { table: { head: ['Logical (s, d)', 'Check', 'Physical'], rows: [['(0, 430)', '430 < 600 ✓', '219 + 430 = **649**'], ['(1, 10)', '10 < 14 ✓', '2300 + 10 = **2310**'], ['(2, 500)', '500 ≥ 100 ✗', '**Trap (addressing error)**'], ['(3, 400)', '400 < 580 ✓', '1327 + 400 = **1727**'], ['(4, 112)', 'no segment 4', '**Trap**']] } },
    ],
    sources: ["OS Jan '23 (IT) paper", `${TB} Exercise 8.x`],
  },

  'os-num-inverted': {
    blocks: [
      { ul: ['Page size = 2 KB = 2¹¹ bytes → offset = 11 bits.', '**Conventional single-level table**: one entry per virtual page = 2^(21 − 11) = 2¹⁰ = **1024 entries**.', '**Inverted page table**: one entry per physical frame = 2^(16 − 11) = 2⁵ = **32 entries**.'] },
      'The inverted table is much smaller because physical memory (64 KB) is far smaller than the virtual address space (2 MB).',
    ],
    sources: ["OS Dec '23 paper Q3", `${TB} Exercise 8.x`],
  },

  'os-num-lru-stack': {
    blocks: [
      'In the **stack implementation of LRU**, the page just referenced is moved to the **top** of the stack; the page at the **bottom** is always the least recently used one (the victim when a page must be replaced).',
      { table: { head: ['Reference', 'Stack (top → bottom)'], rows: [
        ['1', '1'], ['0', '0 1'], ['5', '5 0 1'], ['1', '1 5 0'], ['1', '1 5 0'], ['3', '3 1 5 0'], ['5', '5 3 1 0'], ['1', '1 5 3 0'], ['5', '5 1 3 0'], ['3', '3 5 1 0'],
        ['4', '4 3 5 1 0'], ['5', '5 4 3 1 0'], ['2', '2 5 4 3 1 0'], ['1', '1 2 5 4 3 0'], ['3', '3 1 2 5 4 0'], ['0', '0 3 1 2 5 4'], ['1', '1 0 3 2 5 4'], ['4', '4 1 0 3 2 5'], ['0', '0 4 1 3 2 5'], ['5', '5 0 4 1 3 2'],
      ] } },
      'With **3 frames**, the frames hold the top three entries of the stack; a fault occurs whenever the referenced page is not among the top three before the reference. Result: **11 page faults** (F F F H H F H H H H F H F F F F H F H F).',
      'Advantage: no search is needed to find the victim — it is always at the bottom (implemented as a doubly linked list with head and tail pointers).',
    ],
    sources: ["OS Dec '24 paper", `${TB} §9.4.4`, 'Verified with the page-replacement simulator'],
  },

  'os-num-lru3': {
    blocks: [
      'String: 5 0 2 1 0 3 0 2 4 3 0 3 2 1 3 0 1 5 — LRU, 3 frames.',
      { table: { head: ['Ref', '5', '0', '2', '1', '0', '3', '0', '2', '4', '3', '0', '3', '2', '1', '3', '0', '1', '5'], rows: [
        ['F1', '5', '5', '5', '1', '1', '1', '1', '2', '2', '2', '0', '0', '0', '1', '1', '1', '1', '1'],
        ['F2', '', '0', '0', '0', '0', '0', '0', '0', '0', '3', '3', '3', '3', '3', '3', '3', '3', '5'],
        ['F3', '', '', '2', '2', '2', '3', '3', '3', '4', '4', '4', '4', '2', '2', '2', '0', '0', '0'],
        ['', 'F', 'F', 'F', 'F', 'H', 'F', 'H', 'F', 'F', 'F', 'F', 'H', 'F', 'F', 'H', 'F', 'H', 'F'],
      ] } },
      'Total = **13 page faults**, 5 hits (hit ratio 5/18 ≈ 28%).',
    ],
    sources: ["OS Jun '24 (AIML) paper", 'Verified with the page-replacement simulator'],
  },

  'os-num-pr-optimal': {
    blocks: [
      '**Belady\'s anomaly**: for some algorithms (like FIFO) the page-fault rate can **increase** when the number of frames increases. Example: 1,2,3,4,1,2,5,1,2,3,4,5 → 9 faults with 3 frames but 10 with 4. Stack algorithms (Optimal, LRU) never show it.',
      { h: 'Optimal (replace the page used farthest in the future), 3 frames' },
      { table: { head: ['Ref', '7', '2', '3', '1', '2', '5', '3', '4', '6', '7', '7', '1', '0', '5', '4', '6', '2', '3', '0', '1'], rows: [
        ['F1', '7', '7', '7', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
        ['F2', '', '2', '2', '2', '2', '5', '5', '5', '5', '5', '5', '5', '5', '5', '4', '6', '2', '3', '3', '3'],
        ['F3', '', '', '3', '3', '3', '3', '3', '4', '6', '7', '7', '7', '0', '0', '0', '0', '0', '0', '0', '0'],
        ['', 'F', 'F', 'F', 'F', 'H', 'F', 'H', 'F', 'F', 'F', 'H', 'H', 'F', 'H', 'F', 'F', 'F', 'F', 'H', 'H'],
      ] } },
      'Optimal = **13 page faults**.',
      { h: 'FIFO, 3 frames' },
      { table: { head: ['Ref', '7', '2', '3', '1', '2', '5', '3', '4', '6', '7', '7', '1', '0', '5', '4', '6', '2', '3', '0', '1'], rows: [
        ['F1', '7', '7', '7', '1', '1', '1', '1', '1', '6', '6', '6', '6', '0', '0', '0', '6', '6', '6', '0', '0'],
        ['F2', '', '2', '2', '2', '2', '5', '5', '5', '5', '7', '7', '7', '7', '5', '5', '5', '2', '2', '2', '1'],
        ['F3', '', '', '3', '3', '3', '3', '3', '4', '4', '4', '4', '1', '1', '1', '4', '4', '4', '3', '3', '3'],
        ['', 'F', 'F', 'F', 'F', 'H', 'F', 'H', 'F', 'F', 'F', 'H', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
      ] } },
      'FIFO = **17 page faults** (LRU would give 18).',
    ],
    sources: ["OS Nov '25 paper Q11(b), Dec '21 (CSE)", 'Verified with the page-replacement simulator'],
  },

  'os-num-pr-textbook': {
    blocks: [
      'String 7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1 with 3 frames:',
      { table: { head: ['Algorithm', 'Rule', 'Page faults'], rows: [['FIFO', 'Replace the oldest page', '**15**'], ['LRU', 'Replace the least recently used page', '**12**'], ['Optimal', 'Replace the page not used for the longest future time', '**9**']] } },
      { h: 'Optimal trace' },
      { table: { head: ['Ref', '7', '0', '1', '2', '0', '3', '0', '4', '2', '3', '0', '3', '2', '1', '2', '0', '1', '7', '0', '1'], rows: [
        ['F1', '7', '7', '7', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '7', '7', '7'],
        ['F2', '', '0', '0', '0', '0', '0', '0', '4', '4', '4', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
        ['F3', '', '', '1', '1', '1', '3', '3', '3', '3', '3', '3', '3', '3', '1', '1', '1', '1', '1', '1', '1'],
        ['', 'F', 'F', 'F', 'F', 'H', 'F', 'H', 'F', 'H', 'H', 'F', 'H', 'H', 'F', 'H', 'H', 'H', 'F', 'H', 'H'],
      ] } },
      'The FIFO and LRU frame tables are given in the FIFO and LRU answers above. Conclusion: Optimal < LRU < FIFO; LRU is the practical approximation of Optimal.',
    ],
    sources: ["OS Dec '21 (IT) paper", `${TB} §9.4`, 'Verified with the page-replacement simulator'],
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
      'Optimal faults = **6**. (At "4", page 3 is needed last; at the second "3", page 1 is needed last; at the last "1", page 2 is never used again.)',
    ],
    sources: ["OS Dec '22–Jan '23 paper", 'Verified with the page-replacement simulator'],
  },

  'os-num-pr-multi': {
    blocks: [
      'String 1, 2, 3, 4, 2, 1, 5, 6, 2, 1, 2, 3, 7, 6, 3, 2, 1, 2, 3, 6 (20 references, 7 distinct pages).',
      { table: { head: ['Frames', 'LRU', 'FIFO', 'Optimal'], rows: [['1', '20', '20', '20'], ['2', '18', '18', '15'], ['3', '15', '16', '11'], ['4', '10', '14', '8'], ['5', '8', '10', '7'], ['6', '7', '10', '7'], ['7', '7', '7', '7']] } },
      { ul: ['With 1 frame every reference faults (20); with 7 frames only the 7 compulsory faults remain.', 'Optimal is always the lowest; LRU is close to it.', 'FIFO does not improve from 5 to 6 frames here; it is not a stack algorithm and can show Belady\'s anomaly on other strings.'] },
      { tip: 'Draw the full frame table for 3 or 4 frames in the exam and quote this table for the rest; use the page-replacement tool to check each column.' },
    ],
    sources: ["OS May '25 paper", `${TB} Exercise 9.x`, 'Verified with the page-replacement simulator'],
  },

  'os-num-disk-scan-sstf': {
    blocks: [
      'Cylinders 0–4999, head at 2150 moving towards 4999. Queue: 2069, 1212, 2296, 2800, 544, 1618, 356, 1523, 4965, 3681.',
      { h: 'SSTF' },
      'Order: 2150 → 2069 → 2296 → 2800 → 3681 → 4965 → 1618 → 1523 → 1212 → 544 → 356.',
      'Movement: 81 + 227 + 504 + 881 + 1284 + 3347 + 95 + 311 + 668 + 188 = **7586 cylinders**.',
      { h: 'SCAN (moving up, to the end of the disk)' },
      'Order: 2150 → 2296 → 2800 → 3681 → 4965 → 4999 → 2069 → 1618 → 1523 → 1212 → 544 → 356.',
      'Movement: (4999 − 2150) + (4999 − 356) = 2849 + 4643 = **7492 cylinders**.',
    ],
    sources: ["OS Dec '21 (CSE) paper", `${TB} Exercise 12.x`, 'Verified with the disk-scheduling simulator'],
  },

  'os-num-disk-5000': {
    blocks: [
      'Head at 2150; previous request 1805 → the head is moving **upward** (towards 4999).',
      { table: { head: ['Algorithm', 'Order of service', 'Total'], rows: [
        ['FCFS', '2069, 1212, 2296, 2800, 544, 1618, 356, 1523, 4965, 3681', '**13011**'],
        ['SCAN', '2296, 2800, 3681, 4965, (4999), 2069, 1618, 1523, 1212, 544, 356', '**7492**'],
        ['C-SCAN', '2296, 2800, 3681, 4965, (4999 → 0), 356, 544, 1212, 1523, 1618, 2069', '**9917**'],
      ] } },
      { ul: [
        'FCFS: 81 + 857 + 1084 + 504 + 2256 + 1074 + 1262 + 1167 + 3442 + 1284 = 13011.',
        'SCAN: (4999 − 2150) + (4999 − 356) = 2849 + 4643 = 7492.',
        'C-SCAN: (4999 − 2150) + 4999 (return jump) + (2069 − 0) = 2849 + 4999 + 2069 = 9917. Without counting the return jump: 4918.',
      ] },
      'For completeness: SSTF = 7586, LOOK = 7424, C-LOOK = 9137.',
    ],
    sources: ["OS May '25 paper", `${TB} Exercise 12.x`, 'Verified with the disk-scheduling simulator'],
  },

  'os-num-disk-40': {
    blocks: [
      'Head at 40; requests 68, 78, 42, 32, 93, 35, 82.',
      { h: 'FCFS' },
      '40 → 68 → 78 → 42 → 32 → 93 → 35 → 82 = 28 + 10 + 36 + 10 + 61 + 58 + 47 = **250 cylinders**.',
      { h: 'SSTF' },
      '40 → 42 (2) → 35 (7) → 32 (3) → 68 (36) → 78 (10) → 82 (4) → 93 (11) = **73 cylinders**.',
      'SSTF cuts head movement by about 71% compared with FCFS.',
    ],
    sources: ["OS Dec '22–Jan '23 paper", 'Verified with the disk-scheduling simulator'],
  },

  'os-num-disk-sstf': {
    blocks: [
      'Arm at 100; requests 30, 85, 90, 100, 105, 110, 135, 145. SSTF always picks the nearest pending request:',
      { table: { head: ['Step', 'From', 'Choices (distance)', 'Next'], rows: [['1', '100', '100 (0)', '100'], ['2', '100', '105 (5), 90 (10)', '105'], ['3', '105', '110 (5), 90 (15)', '110'], ['4', '110', '90 (20), 135 (25)', '**90**']] } },
      'Cylinder 90 is serviced **after 3 requests** (100, 105, 110), i.e. as the 4th request. (If the request at the current position 100 is not counted, it is served after 2 requests.)',
    ],
    sources: ["OS Jan '23 (IT) paper", 'Verified with the disk-scheduling simulator'],
  },

  'os-pred-swap-space': {
    blocks: [
      '**Swap space** is the area of disk that virtual memory uses as an extension of main memory. Because disk is far slower than RAM, the goal of swap-space management is the **best possible throughput** for the virtual-memory system.',
      { h: 'Use' },
      { ul: ['Old systems swapped **entire processes** to swap space; modern systems swap **pages** (paging).', 'Only **anonymous memory** (stack, heap, uninitialised data) needs swap; code pages are simply re-read from the executable file.', 'Sizing: too little → processes are aborted (out of memory); too much wastes disk. Linux once recommended 2× RAM; now it depends on workload. Multiple swap areas on different disks spread the I/O load.'] },
      { h: 'Location' },
      { compare: [
        { title: 'Swap file in the normal file system', items: ['Easy to create and resize', 'Slower: goes through directory lookups and file-allocation structures', 'External fragmentation possible'] },
        { title: 'Raw swap partition', items: ['Separate partition with **no file system**', 'A **swap-space manager** allocates blocks with algorithms optimised for **speed**, not space', 'Internal fragmentation accepted (data is short-lived); fixed size'] },
      ] },
      { h: 'Linux example' },
      'Each swap area consists of 4 KB **page slots**. A **swap map** — an array of integer counters, one per slot — tracks usage: 0 means free, n > 0 means the slot holds a page mapped by n processes (shared pages). Pages are swapped out by kswapd when free memory is low.',
    ],
    sources: [`${U3} slides 155–159`, `${TB} §12.6`],
  },

  'os-num-disk-track': {
    blocks: [
      { img: 'os-track-sector' },
      { ul: ['600 rpm → 600 / 60 = **10 rotations per second** → one rotation = **0.1 s = 100 ms**.', '(a) Reading an entire track takes one full rotation (once the head is positioned) = **100 ms**. (Average rotational latency to reach a given sector would be 50 ms.)', '(b) One track = 16 × 1024 B = **16 KB**; 10 tracks = 10 × 16 KB = **160 KB** (163,840 bytes).', 'Transfer rate = 16 KB per 100 ms = 160 KB/s.'] },
    ],
    sources: ["OS Jan '23 (IT) paper"],
  },
}
