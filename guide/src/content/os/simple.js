// Simpler explanations of each topic, written by ChatGPT (via scripts/simplify-with-chatgpt.mjs).
// Stored verbatim; regenerate with:  node scripts/simplify-with-chatgpt.mjs <subject> [--only <id>]
export default {
  "os.u3.address-translation": {
    "summary": "A program uses **logical addresses** to refer to memory. A **physical address** is the actual location in RAM. With **dynamic mapping**, hardware called the **MMU (Memory Management Unit)** translates logical addresses into physical addresses while the program runs.",
    "points": [
      "**Address binding** means deciding where a program’s addresses point in RAM. Binding can happen before execution or while the program runs.",
      "**Static mapping** fixes addresses during compilation or loading. Once bound, the program must use that location. Moving it elsewhere requires changing those bindings.",
      "**Dynamic mapping** translates addresses during execution. The mapping can change when a process moves. It supports **swapping**, which moves processes out of RAM and back.",
      "In the simple **base-and-limit scheme**, logical addresses start at 0. The **relocation register**, also called the **base register**, stores the process’s starting physical address.",
      "The **limit register** stores the process’s memory size. First check that the logical address is below the limit. Then add the base. An invalid address causes a **trap**, meaning control passes to the operating system.",
      "For **paging**, address bits = page/frame number bits + **offset** bits. The offset identifies a position inside a page. With 1024 words per page, 64 pages need 6 + 10 = **16 logical bits**; 32 frames need 5 + 10 = **15 physical bits**."
    ],
    "analogy": "Think of the base as your row’s starting seat. Your logical address tells you how many seats beyond that start to go.",
    "example": "Base = 14000, limit = 1000: logical address 346 becomes **14346**. Address 1020 causes a **trap** because it exceeds the allowed range."
  },
  "os.u3.buffering": {
    "summary": "**Buffering** means temporarily holding data in a memory area called a **buffer** while it moves between a device and a **process**, a running program. It helps them exchange data smoothly.",
    "points": [
      "Buffers help because devices and the CPU work at different speeds. They also help when data arrives in chunks of a different size from what the program needs.",
      "**Copy semantics** means preserving the data given at the time of a write call. Copying it into an OS buffer lets the program change its own buffer later without changing that saved data.",
      "In **single buffering**, the device fills one operating system (OS) buffer. The OS then copies the data to the process.",
      "In **double buffering**, two buffers take turns: the device fills one while the process uses the other. **Circular buffering** uses a ring of buffers, reused in order, for a continuous flow.",
      "With **synchronous (blocking) I/O**, the process waits for input or output to finish. The CPU can run another process meanwhile.",
      "With **asynchronous I/O**, the process continues working and checks or receives notification of completion later. **Non-blocking I/O** also avoids waiting, but may simply report that data is not ready.",
      "**Caching** keeps data for faster reuse. **Spooling** queues jobs for a device, such as a printer, to handle one at a time."
    ],
    "analogy": "A buffer is like a serving tray between a cook and a waiter. Each can work at a different pace.",
    "example": "During audio playback, one buffer can supply sound while another receives the next chunk."
  },
  "os.u3.disk-management": {
    "summary": "**Disk management** is the operating system’s housekeeping for a disk. It prepares storage, helps start the computer, and handles damaged storage areas.",
    "points": [
      "**Low-level formatting** divides a disk into small storage units called **sectors**. Each has a header, a data area, and a trailer containing **ECC**. ECC detects and corrects small errors. This formatting usually happens at the factory.",
      "**Partitioning** splits a disk into sections called **partitions**. Each section is treated as a separate logical disk.",
      "**Logical formatting** creates a **file system**, the structure for organizing files. It includes a free-space map and an empty **root directory**, the top-level folder.",
      "A **bootstrap loader** is a small startup program stored in **ROM**, or read-only memory. It reads the disk’s **boot block**, whose code helps load the **kernel**, the OS’s core. In traditional systems, the **Master Boot Record** is in sector 0. A disk with a boot partition is a **boot disk**.",
      "**Bad blocks** are faulty storage areas. Simple systems can mark them unusable in the **FAT**, or File Allocation Table.",
      "Smarter disk controllers use **sector sparing** to replace a bad sector with a spare. **Sector slipping** shifts following sectors to skip the bad spot.",
      "The OS also handles data loss, **fragmentation**—scattered file pieces—and consistent **metadata**, information describing stored data. It chooses where **swap space**, disk space supporting memory, goes."
    ],
    "analogy": "Think of dividing a cupboard into sections, adding labels, and avoiding broken shelves.",
    "example": "If sector 25 fails, sector sparing redirects its requests to a spare sector."
  },
  "os.u3.disk-scheduling": {
    "summary": "**Disk scheduling** chooses which waiting disk request to serve next. It aims to reduce movement of the **disk head**, the part that reads and writes data, while keeping waiting times reasonable.",
    "points": [
      "**FCFS (First-Come, First-Served)** follows arrival order. Every request gets its turn, but the head may travel back and forth a lot.",
      "**SSTF (Shortest Seek Time First)** serves the nearest request next. It often reduces movement. But distant requests can face **starvation**: waiting indefinitely because other requests keep getting chosen.",
      "**SCAN**, the elevator algorithm, serves requests along one direction, reaches the disk end, then reverses. Middle cylinders can get more frequent service. A **cylinder** is a numbered disk location in these problems.",
      "**C-SCAN (Circular SCAN)** serves requests in one direction only. It reaches the disk end, returns to the opposite end without serving requests, then starts another sweep. Waiting times are generally more uniform.",
      "**LOOK** works like SCAN, but reverses at the last pending request in its direction. It avoids travelling unnecessarily to the disk end.",
      "**C-LOOK** works like C-SCAN, but stops at the last pending request. When serving upwards, it jumps to the lowest pending request and resumes upwards. The jump moves the head backwards; the service direction stays the same."
    ],
    "analogy": "Imagine an elevator: requests are floors, and scheduling decides the order in which people get served.",
    "example": "Head at 53; requests at 37 and 65. **SSTF** chooses 65: it is 12 cylinders away, while 37 is 16 away."
  },
  "os.u3.disk-structure": {
    "summary": "A **hard disk drive (HDD)** stores data on spinning disks. Its parts help the computer find and read the data it needs.",
    "points": [
      "A **platter** is a rigid disk with a magnetic coating that stores data. Each platter has two **surfaces**, or sides, which may be used for recording.",
      "Each surface contains **tracks**, which are circular paths. Each track is divided into **sectors**, small storage sections. Common sector sizes are 512 or 4096 bytes. Physical reads and writes happen in whole sectors.",
      "A **cylinder** is the collection of tracks at the same distance from the centre across all recording surfaces. Reaching these tracks does not require moving the arm.",
      "Each recording surface has a **read/write head**. It reads and changes data without touching the surface. The **disk arm** moves the heads between tracks. The heads move together.",
      "The **spindle** is the central shaft that spins the platters. **RPM**, or revolutions per minute, tells us how many full turns they make each minute.",
      "The OS sees a numbered sequence of **logical blocks**. The drive translates these block numbers into storage locations.",
      "**Access time = seek time + rotational latency + transfer time**. Seek time means moving to the correct cylinder. Rotational latency means waiting for the sector. Transfer time means reading or writing the data. **SSDs** have no mechanical seek or rotational delay."
    ],
    "analogy": "Imagine stacked circular racecourses: tracks are lanes, sectors are sections, and a cylinder groups matching lanes across the stack.",
    "example": "At 600 RPM, one rotation takes 100 milliseconds. Average **rotational latency** is half a rotation: 50 milliseconds."
  },
  "os.u3.linux-mm": {
    "summary": "**Linux memory management** shares RAM among programs and the kernel, the core of the operating system. It loads pages when needed and frees space when RAM becomes scarce.",
    "points": [
      "RAM is divided into fixed-size pieces called **pages**. **Zones**, such as DMA and NORMAL, group memory by hardware access limits. HIGHMEM exists on some systems.",
      "The **buddy system** allocates blocks of 1, 2, 4, 8 or more pages. It splits larger blocks and merges matching free buddies. This helps reduce **external fragmentation**, where free memory is scattered.",
      "The **slab allocator** keeps caches for small kernel objects. It makes allocation fast and reduces wasted space, but does not eliminate all **internal fragmentation**, or unused space inside allocations.",
      "Each process has a **virtual address space**, containing code, data, heap and stack regions described by **vm_area_struct**. **Multi-level page tables** translate virtual addresses into physical memory addresses.",
      "**Demand paging** loads pages only when needed. After **fork()**, **copy-on-write** lets parent and child share pages until either writes. **mmap** maps files into memory through the **page cache**.",
      "**LRU-like replacement** approximates removing least recently used pages. Traditional Linux uses active and inactive lists. Under memory pressure, **kswapd** reclaims pages: clean file pages are dropped, dirty file pages need file writeback, and anonymous pages may enter **swap space**.",
      "If memory cannot be recovered, the **OOM killer** may terminate a process."
    ],
    "analogy": "RAM is a study desk; storage holds material that need not stay on the desk.",
    "example": "A three-page buddy allocation receives a four-page block."
  },
  "os.u3.page-faults": {
    "summary": "A **page** is a fixed-size piece of a process’s memory. A **page fault** happens when a program tries to use a page that is missing from **RAM**, the computer’s main memory. For a legal access, the operating system (**OS**) brings the page in and retries the instruction.",
    "points": [
      "**Demand paging** means loading a page only when it is needed. **Pure demand paging** starts a process with no pages in RAM.",
      "The **page table** records where pages are stored in RAM. Its **valid–invalid bit** marks a page as valid if it is legal and present. Invalid means absent or outside the process’s allowed memory.",
      "Accessing an invalid page causes a **trap**, which hands control to the OS. The OS checks the address. If it is illegal, the process is terminated.",
      "For a legal address, the OS finds a **free frame**, a page-sized space in RAM. If necessary, **page replacement** removes another page to make room.",
      "The OS reads the required page from disk into that frame.",
      "It updates the page table with the frame number, marks the entry valid, and **restarts the instruction**.",
      "**Effective access time (EAT)** = (1 − p) × memory access time + p × page-fault service time. Here, p is the fault probability. Disk service takes milliseconds; RAM takes nanoseconds. Even rare faults can cause major delays."
    ],
    "analogy": "RAM is your study desk. Disk is a cupboard. A missing book must be fetched before you continue reading.",
    "example": "An instruction needs page 3. It is legal but absent. The OS loads it, then retries that instruction."
  },
  "os.u3.page-replacement": {
    "summary": "A **page** is a fixed-size piece of a program’s memory. A **frame** is a space in RAM that holds one page. A **page fault** happens when a needed page is missing from RAM. If all frames are full, a **page replacement algorithm** chooses a **victim page** to remove.",
    "points": [
      "**FIFO (First-In, First-Out)** removes the page loaded earliest. Using a page again does not change its place in the queue.",
      "**Belady’s anomaly** means that adding more frames can cause more page faults. FIFO can show this behaviour.",
      "**Optimal (OPT)** removes the page whose next use is farthest in the future. It gives the fewest faults, but needs future knowledge. It is a benchmark for comparison.",
      "**LRU (Least Recently Used)** removes the page that has gone longest without being used. It uses the past to approximate OPT.",
      "In an **LRU stack**, move each referenced page to the top. The bottom page is the victim. Finding the victim needs no search, but locating a referenced page may.",
      "A **working set** contains the pages used in the latest **Δ references**. Too few frames can cause **thrashing**: more time spent paging than executing.",
      "Control thrashing by providing enough frames for working sets, adjusting frames using **page-fault frequency**, or reducing the number of processes competing for memory."
    ],
    "analogy": "RAM is a small desk. When it fills up, you must remove one book before bringing another.",
    "example": "With three frames, requests 1, 2, 3, 1, 4 make FIFO remove 1. LRU removes 2 because 1 was used again recently."
  },
  "os.u3.paging": {
    "summary": "**Paging** splits a process’s logical memory into equal-sized **pages**. RAM is split into matching blocks called **frames**, so pages can fit into separate free frames.",
    "points": [
      "A **logical address**, used by a program, contains a **page number** and an **offset**: the position inside that page. The process’s **page table** maps the page number to a frame number. The offset stays unchanged.",
      "Paging avoids **external fragmentation**: scattered free gaps that cannot hold one continuous allocation. But **internal fragmentation** can waste space inside the process’s last page.",
      "The **TLB (Translation Look-aside Buffer)** is a tiny, fast cache of recent page-to-frame mappings. A **hit** finds the mapping there. A **miss** requires checking the page table.",
      "**Effective Access Time (EAT)** means average access time. With a 20 ns TLB, 100 ns memory, and 80% hits, EAT = 0.8 × 120 + 0.2 × 220 = **140 ns**, assuming a single-level page table.",
      "**ASIDs (address-space identifiers)** label TLB entries by process. This lets entries from different processes coexist safely.",
      "A **hierarchical page table** uses levels: an outer table points to inner tables. A **hashed page table** uses a hash calculation to locate candidate mappings, then checks for a match.",
      "An **inverted page table** has one entry per physical frame. Each entry identifies the process and page stored there."
    ],
    "analogy": "Think of pages as equal-sized boxes and frames as shelf slots. A directory tells you where each box sits.",
    "example": "With 4-byte pages, logical address 13 means page 3, offset 1. If page 3 occupies frame 2, the **physical address** is 2 × 4 + 1 = **9**."
  },
  "os.u3.segmentation": {
    "summary": "**Segmentation** divides a program into meaningful parts of different sizes. Each part is a **segment**, such as code, data, or the stack. This matches how programmers think about a program and helps control access to its parts.",
    "points": [
      "A **logical address**, the address used by a program, has two parts: **(segment number, offset)**. The segment number selects a segment. The **offset** tells how far inside it to go.",
      "The **segment table** stores one entry for each segment. Its **base** is the starting address in memory. Its **limit** is the segment’s length.",
      "For a non-negative offset, check whether **offset < limit**. If valid, the **physical address**, the actual memory location, is **base + offset**. Otherwise, a **trap** reports an addressing error.",
      "**Paging** uses fixed-size pieces. Segmentation uses variable-size pieces. Paging can waste space inside a page; this is **internal fragmentation**. Segmentation can leave scattered gaps between segments; this is **external fragmentation**.",
      "**Protection** controls access to a segment. **Sharing** lets programs use the same segment, such as shared code."
    ],
    "analogy": "Think of a building with rooms of different sizes. The segment number chooses a room. The offset tells how far to move from that room’s entrance. You must stay within the room.",
    "example": "Segment 0 has base 219 and limit 600. Address **(0, 430)** is valid because 430 < 600. Its physical address is **219 + 430 = 649**. Offset 600 would cause a trap."
  },
  "os.u3.sharing-permissions": {
    "summary": "With **paging**, a program’s memory is split into fixed-size blocks called **pages**. The OS controls which pages a **process** (a running program) can use and whether it can read, write, or run instructions from them.",
    "points": [
      "Each process has its own **page table**. It maps pages to **frames**, which are blocks of physical RAM. A process cannot reach another process’s private memory through its own table.",
      "Only the **kernel**, the trusted core of the OS, can change these mappings. A process must request more memory through a **system call**, a controlled request to the OS.",
      "The **valid/invalid bit** says whether a page belongs to the process’s allowed address space. **Read/write/execute permissions** control what it can do there. An illegal access causes a **trap**, which transfers control to the OS.",
      "Hardware checks permissions while translating addresses. **Page sharing** happens when page-table entries point to the same frame. The processes then use the same memory.",
      "**Re-entrant code** can be shared safely without changing its instructions. **Shared memory IPC** lets processes communicate through shared pages.",
      "With **copy-on-write (COW)** after **fork()**, which creates a child process, parent and child initially share private pages. Writes are blocked until the OS makes a separate copy of the affected page."
    ],
    "analogy": "Think of a page table as a library access list. Two students can access the same book, but their permissions may differ.",
    "example": "A and B map one writable shared frame. A changes a value from 5 to 9. B can read 9 from that same location."
  },
  "os.u3.swap-space": {
    "summary": "**Swap space** is disk space that the operating system uses when **RAM**, the computer’s working memory, becomes crowded. **Swap-space management** means organising this space so that moving data between RAM and disk is efficient.",
    "points": [
      "Memory is divided into small blocks called **pages**. The operating system can move some pages to swap space and bring them back when needed. Disk access is much slower than RAM access.",
      "Swap space can be a **swap file**, stored inside a normal **file system**, which organises files on disk. It is easy to create, but file-system work can add overhead.",
      "Another option is a **raw swap partition**. This is a separate disk section with no file system. The swap manager controls it directly, using simple methods designed for speed.",
      "Older systems swapped whole processes, meaning running programs. Modern systems usually swap individual **anonymous pages**, such as pages holding a program’s working data. Unchanged **code pages** can be read again from the program file.",
      "Swap must suit memory needs. Too little can contribute to memory shortages and processes being killed. Reserving too much wastes disk space.",
      "Linux tracks swap **slots**, each holding one page, using a **swap map**. Its counters track references: 0 means free; a positive count means in use. Shared pages can have multiple references."
    ],
    "analogy": "RAM is your study desk. Swap space is a cupboard where you temporarily move material when the desk gets crowded.",
    "example": "With 4 KB pages, moving three pages into free swap slots needs 12 KB of swap space."
  },
  "os.u3.swapping": {
    "summary": "**Swapping** moves a process, meaning a running program, between **RAM** and disk. RAM is the computer’s main working memory. Swapping lets the system manage more processes than RAM can hold at once.",
    "points": [
      "**Swap out** means moving a process from RAM to **backing store**, the disk space used to hold it. **Swap in** means bringing it back into RAM so it can continue.",
      "**Medium-term scheduling** temporarily removes processes from RAM and brings them back later. In **roll out, roll in**, a low-priority process leaves to make room for a high-priority one.",
      "**Dynamic binding**, or run-time address binding, translates memory addresses while a program runs. This lets a swapped-out process return to a different location in RAM.",
      "**Transfer time**, the time spent copying data, is the main swapping cost. Larger transfers take longer. Modern systems usually move smaller memory blocks called **pages**, rather than whole processes, when memory is scarce.",
      "**I/O** means input/output, such as reading from disk. Do not swap out a process while a device is writing directly into its memory buffer. That memory could be reassigned. **OS buffers** provide a safe alternative.",
      "**Overlays** kept only currently needed program parts in RAM. Programmers manually arranged for other parts to replace them. **Paging** removed the need for this manual arrangement."
    ],
    "analogy": "RAM is a desk. Disk is a cupboard. Put work away to free desk space; bring it back to continue.",
    "example": "At 50 MB/s, swapping 100 MB takes 2 seconds out and 2 seconds back: 4 seconds of transfer time."
  },
  "os.u4.classical": {
    "summary": "**Synchronization** means coordinating processes so they can safely share data or resources. Three **classical problems** test whether this coordination works: **bounded buffer**, **readers–writers**, and **dining philosophers**.",
    "points": [
      "The **bounded buffer** is a fixed-size storage area. **Producers** add items; **consumers** remove them. Producers must wait when it is full. Consumers must wait when it is empty.",
      "A **semaphore** controls access using a counter. **wait** takes a permit, or blocks until one is available. **signal** returns a permit. Here, **empty** counts free spaces, **full** counts available items, and **mutex** allows only one process to change the buffer at a time. Wait on empty or full before mutex.",
      "In **readers–writers**, several readers can read together. A writer needs exclusive access. **read_count** tracks readers: the first reader blocks writers, and the last lets them proceed. Another mutex protects this count.",
      "**Starvation** means waiting indefinitely while others keep getting access. Continually arriving readers can starve writers in this reader-preference solution. Taking several reader–writer locks in inconsistent orders can also cause **deadlock**: processes remain stuck waiting for one another.",
      "In **dining philosophers**, five philosophers each need two neighbouring chopsticks. Everyone taking their left chopstick causes deadlock. Prevent it by allowing only four to compete, reserving both chopsticks together, or using opposite pickup orders for odd and even philosophers.",
      "A **monitor** allows only one process inside at a time. Fair waiting rules are also needed to prevent starvation."
    ],
    "analogy": "The buffer is like a small tray between a cook and customers.",
    "example": "If a producer locks a full buffer and then waits for space, the consumer cannot enter to make space: deadlock."
  },
  "os.u4.deadlock-avoidance": {
    "summary": "**Deadlock** happens when processes wait for resources held by one another, so none can continue. **Deadlock avoidance** checks before giving resources. The **Banker’s Algorithm** grants a request only if there is still a way for every process to finish.",
    "points": [
      "A **safe state** has at least one finishing order called a **safe sequence**. An **unsafe state** means deadlock may happen; it does not mean deadlock has already happened.",
      "**Available** means free resources. **Max** is each process’s declared maximum demand. **Allocation** is what it already holds. **Need = Max − Allocation** is what it may still request.",
      "The **safety algorithm** runs an imaginary check. Set **Work = Available**. Mark every process unfinished using **Finish = false**.",
      "Pick an unfinished process whose **Need ≤ Work** for every resource type. Imagine it finishes. Add its original **Allocation** to Work and mark it finished. Repeat. If everyone finishes, the state is safe; otherwise, it is unsafe.",
      "For a new request, check each resource type. Exceeding **Need** is an error. Exceeding **Available** means the process must wait.",
      "Otherwise, pretend to grant it: reduce Available and Need, and increase Allocation. Run the safety check. If safe, grant it. Otherwise, undo the changes and make the process wait."
    ],
    "analogy": "Think of lending tools. Before lending more, you check whether everyone could finish their job and return the tools.",
    "example": "There is 1 free printer. P1 holds 1 and needs 1 more. P2 holds 1 and needs 2 more. Check P1 first: it finishes and releases both printers. P2 can then finish. **P1 → P2** is a safe sequence."
  },
  "os.u4.deadlock-intro": {
    "summary": "A **deadlock** happens when processes—programs being executed—are stuck waiting for resources held within the same group. Resources are things they need, like printers. Normally, processes follow **request → use → release**.",
    "points": [
      "All four **necessary conditions** must hold together: **mutual exclusion**, **hold and wait**, **no preemption**, and **circular wait**. Breaking any one prevents deadlock.",
      "**Mutual exclusion**: at least one resource can be used by only one process at a time.",
      "**Hold and wait**: a process keeps a resource while waiting for another. **No preemption**: that resource cannot be forcibly taken away; its holder must release it.",
      "**Circular wait**: processes form a waiting loop. Each waits for a resource held by the next. This also implies **hold and wait**, so the conditions are not fully independent.",
      "**Prevention** breaks a necessary condition. **Avoidance**, such as **Banker’s algorithm**, grants requests only when a safe completion order remains possible. **Detection and recovery** finds deadlocks and breaks them. The **ostrich approach** ignores the problem.",
      "**Starvation** means one process keeps waiting while others continue. In deadlock, the involved processes cannot proceed.",
      "One correction to the notes: a **single-threaded process** can deadlock itself by requesting a lock it already holds if that lock forbids repeated acquisition. Simply waiting for input is not necessarily deadlock."
    ],
    "analogy": "Four cars each wait for the car on their right to move. Nobody can move first.",
    "example": "P1 holds the printer and needs the scanner. P2 holds the scanner and needs the printer. Neither releases its resource, so both remain stuck."
  },
  "os.u4.deadlock-prevention": {
    "summary": "A **deadlock** happens when processes are stuck waiting for resources held by one another. **Deadlock prevention** sets rules so at least one of the four **necessary conditions** for deadlock can never hold.",
    "points": [
      "**Mutual exclusion** means only one process can use a resource at a time. Deny it by allowing sharing, as with read-only files. This cannot work for resources such as printers or mutex locks.",
      "**Hold and wait** means keeping resources while requesting more. Deny it by requesting everything at the start, or requesting only while holding nothing. Resources may sit unused. **Starvation**, or waiting indefinitely, can occur.",
      "**No preemption** means resources cannot be forcibly taken away. Deny it by making a process release its resources when a new request cannot be granted. This works only when resource state can be saved and restored, as with CPU registers and memory.",
      "**Circular wait** means a loop of processes waiting on one another. Use **resource ordering**: give resource types a fixed order, called **F(R)**, and request only in increasing order. Numbers cannot keep increasing around a loop.",
      "Ordering is practical and cheap. It uses a **static rule**, without a run-time safety check. Programmers must follow it. Resources may be held longer than needed.",
      "**Banker’s algorithm** uses **deadlock avoidance**. It checks safety for each request and needs maximum resource requirements beforehand. It can allow more concurrency, but costs more."
    ],
    "analogy": "Always collect shared kitchen tools in the same numbered order.",
    "example": "With locks numbered 1 and 2, acquire 1 before 2. Never hold 2 while requesting 1."
  },
  "os.u4.deadlock-recovery": {
    "summary": "**Deadlock** happens when processes are stuck waiting for resources held by one another. **Deadlock recovery** breaks this wait after it happens, so work can continue.",
    "points": [
      "**Process termination** means stopping processes. The system can **abort all** deadlocked processes. This breaks the deadlock quickly, but loses all their unfinished work.",
      "It can **abort one at a time** instead. This may waste less work. After each termination, the system must check whether any deadlock remains.",
      "To choose whom to abort, consider **priority**, time already spent, time still needed, resources held, and resources still needed. Also consider whether it is **interactive**, serving a user directly, or **batch**, running without user interaction.",
      "**Resource preemption** means taking a resource away from a process so another can use it. This works only for resources that can be taken away safely.",
      "**Selecting a victim** means choosing which process will lose resources. The system tries to minimise cost, considering resources held and work already done.",
      "**Rollback** returns the victim to an earlier saved state called a **checkpoint**. It can then repeat work from there. Sometimes, a complete restart is needed.",
      "**Starvation** happens if a process keeps being selected and never finishes. Counting previous rollbacks when choosing a victim helps prevent this."
    ],
    "analogy": "Two students each hold one book and need the other's. Asking one to return their book lets the other finish.",
    "example": "P1 holds resource A and waits for B. P2 holds B and waits for A. Aborting P2 releases B, allowing P1 to continue."
  },
  "os.u4.rag": {
    "summary": "A **Resource Allocation Graph (RAG)** is a picture of which processes hold resources and which are waiting for them. It helps us spot **deadlock**: a situation where processes remain stuck because each needs a resource held by another waiting process.",
    "points": [
      "A **process** is a program in execution. Draw it as a circle. Draw a **resource**, such as a printer, as a box. Each dot inside means one **instance**, or available unit of that resource type.",
      "A **request edge**, **P → R**, means process P has asked for resource R and is waiting for it.",
      "An **assignment edge**, **R → P**, means one instance of resource R is currently held by process P.",
      "A **cycle** is a path of arrows that leads back to its starting point. **No cycle means no deadlock**.",
      "With **single-instance resources**, a cycle means deadlock. With **multiple-instance resources**, a cycle means possible deadlock. Check whether a process can finish and release resources.",
      "A dashed **claim edge**, **P ⇢ R**, means P may request R later. For **deadlock avoidance** with single-instance resources, grant a request only if the resulting graph, including claim edges, has no cycle."
    ],
    "analogy": "Think of two students sharing one pen and one ruler. Each holds one item and waits for the other, refusing to release their own until they finish.",
    "example": "**P1** holds **R1** and requests **R2**. **P2** holds **R2** and requests **R1**. The cycle is **P1 → R2 → P2 → R1 → P1**. If each resource has one instance, this is **deadlock**."
  },
  "os.u4.sync-issues": {
    "summary": "A **thread** is a sequence of instructions running within a program. When threads share data, their steps can overlap in time. A **race condition** happens when the result depends on which steps happen first. **Synchronization** coordinates access to shared data.",
    "points": [
      "A **critical section** is the part of a program that accesses shared data. For example, it may update a shared counter.",
      "The usual order is: **entry section** requests access, **critical section** uses the data, **exit section** releases access, and **remainder section** does other work.",
      "**Mutual exclusion** means at most one thread enters the critical section for the same shared resource at a time.",
      "**Progress** means that when the critical section is empty and threads want to enter, choosing the next one cannot be delayed forever. Only threads wanting to enter participate.",
      "**Bounded waiting** limits how many times other threads can enter after a thread requests access, before it gets its turn.",
      "With two flags, each thread announces interest and waits for the other's flag to clear. If both announce interest before checking, both wait forever: **deadlock**. Mutual exclusion holds, but progress fails. **Peterson’s solution** combines these flags with a **turn** variable to resolve the conflict."
    ],
    "analogy": "Think of a shared bathroom. The door lock allows one person inside at a time, like mutual exclusion.",
    "example": "A counter starts at 5. Increasing and decreasing it should leave 5. But each update involves reading, changing, and writing. Both threads may read 5 and later write 6 and 4, leaving 4. An **atomic** operation acts as one indivisible step."
  },
  "os.u4.sync-solutions": {
    "summary": "A **critical section** is code that uses shared data. **Mutual exclusion** means only one process enters it at a time, preventing conflicting updates.",
    "points": [
      "**Peterson’s solution** protects two processes using flags meaning “I want to enter” and a turn variable to settle ties. It provides mutual exclusion, **progress** (entry is not postponed unnecessarily), and **bounded waiting** (waiting has a limit).",
      "**Dekker’s algorithm** is an earlier solution. Peterson’s is simpler. Both need memory-ordering safeguards on modern CPUs, which may rearrange memory operations.",
      "Hardware provides **atomic instructions**: operations that cannot be interrupted halfway by another process accessing the same value. **Test-and-set** sets a lock and returns its old value. **Compare-and-swap** changes a value only if it matches an expected value. Simple locks using these can allow unlimited waiting.",
      "A **mutex lock** uses **acquire()** to take the lock and **release()** to free it. A **spinlock** repeatedly checks while waiting. This is **busy waiting**, which consumes CPU time.",
      "Spinning wastes time on one CPU. With multiple cores, it can suit short waits because the lock holder can run elsewhere.",
      "A **semaphore** controls access using atomic **wait()** and **signal()** operations. A **binary semaphore** allows one permit; a **counting semaphore** allows several. Blocking implementations put waiters to sleep.",
      "Incorrect use can cause **deadlock**, where processes wait for each other, or **starvation**, where one keeps getting passed over."
    ],
    "analogy": "A lock is like one bathroom key: take it, use the room, return it.",
    "example": "With semaphore S = 1, a non-atomic check and decrement could let two processes enter together."
  },
  "os.u4.thread-apis": {
    "summary": "A **thread** is one path of work inside a program. **Thread APIs** are library calls that let a program create threads, wait for them, and manage them.",
    "points": [
      "**Pthreads** is a standard thread API used on Linux and Unix. **pthread_create()** starts a thread. **pthread_join()** makes the calling thread wait until another thread finishes.",
      "**pthread_exit()** ends the calling thread. **pthread_cancel()** requests cancellation; stopping is not necessarily immediate. A **mutex** is a lock: **pthread_mutex_lock()** and **pthread_mutex_unlock()** let threads take turns accessing shared data.",
      "On Windows, **CreateThread()** starts a thread. **WaitForSingleObject()** can wait for it to finish. **CloseHandle()** releases the program’s handle, or reference, to it; this does not stop the thread.",
      "In Java, extend **Thread** or implement **Runnable**, and put the work in **run()**. Call **start()** to launch a separate thread and **join()** to wait. Traditional Java platform threads map to operating-system threads.",
      "The **kernel**, the operating system’s core, schedules kernel threads. Each has a **TCB** (Thread Control Block) holding information such as saved registers, stack details, and state. Linux’s **clone()** creates a task with selected shared resources, which can include memory."
    ],
    "analogy": "Think of threads as cooks sharing one kitchen. Creating a thread adds a cook; joining means waiting for that cook to finish.",
    "example": "In your **fork()** question, process counts go 1 → 2 → 3 → 6. Two processes call thread_create(), so the answer is **6 processes and 2 explicitly created threads**. Those two exclude the processes’ main threads. Each fork copies only its calling thread."
  },
  "os.u4.threads": {
    "summary": "A **process** is a program that is running. A **thread** is one path of execution inside it. Threads share the process’s code, data and open files. Each has its own **stack** for function calls, **registers** for working values, and **program counter** for the next instruction.",
    "points": [
      "Processes usually have separate memory and need **IPC** (interprocess communication) to exchange data. Threads communicate through shared variables. A faulty thread can crash its whole process.",
      "**Responsiveness** keeps an application usable during long tasks. **Resource sharing** lets threads use common memory. **Economy** means threads usually cost less to create and switch between than processes.",
      "**Scalability** means using additional processor cores to do more work. A **multicore** processor has several processing cores, allowing threads to run in **parallel**—at the same time.",
      "**User-level threads (ULTs)** are managed by a library outside the kernel, the OS’s core. Switching is fast. In **many-to-one**, many ULTs use one kernel thread: a blocking system call can stop them all, and they cannot run in parallel.",
      "**Kernel-level threads (KLTs)** are managed by the OS. Management costs more, but one blocked thread need not stop others. **One-to-one** gives each user thread a kernel thread, as in Linux and Windows.",
      "**Many-to-many** maps many user threads onto an equal or smaller number of kernel threads. The **two-level model** also allows binding a particular user thread to a particular kernel thread.",
      "A **TCB (Thread Control Block)** stores a thread’s ID, state, program counter, registers and stack pointer."
    ],
    "analogy": "Threads are cooks sharing one kitchen, each following their own task.",
    "example": "One thread loads a file while another handles button clicks."
  },
  "os.u5.allocation": {
    "summary": "**Allocation methods** decide where a file’s blocks go on disk. **Organisation or access methods** decide how a program reads them. A **block** is a fixed-size unit of disk storage.",
    "points": [
      "**Sequential access** reads records in order. **Direct (relative) access** jumps to a numbered block. **Indexed access** searches an index, a list of keys and locations, then jumps to the matching location.",
      "**Contiguous allocation** keeps blocks together. The directory stores the starting block and file length. Reading in order or jumping is fast. Growth is difficult, and the required space must be planned. **External fragmentation** means free space is scattered into separate gaps.",
      "**Linked allocation** puts a pointer, or next-block address, in each block. The directory stores the first block, sometimes also the last. Sequential reading works well; jumping requires following pointers. Growth is easy. Pointers take space, and a broken pointer can make later blocks unreachable.",
      "**Indexed allocation** keeps data-block addresses in an **index block**. The directory points to it. Sequential reading and jumping are efficient. Growth is easy until the index fills.",
      "Linked and indexed allocation avoid **external fragmentation**.",
      "**FAT (File Allocation Table)** stores linked allocation’s next-block pointers together. Caching this table speeds traversal, but still requires following the chain.",
      "Large files can use chained index blocks or a **multilevel index**. A traditional Unix **inode**, containing metadata and block pointers, combines 12 direct pointers with single, double and triple indirect pointers."
    ],
    "analogy": "Allocation is where books sit; access is how you find and read them.",
    "example": "A 512-entry index for three data blocks leaves 509 entries unused. Inode direct pointers avoid a separate index block for small files."
  },
  "os.u5.caching": {
    "summary": "**Caching optimizations** help a file system avoid repeated, slow disk access. It keeps useful file data and **metadata**, meaning information about files, in a **cache**, a temporary storage area in fast RAM.",
    "points": [
      "The **buffer cache** holds recently used **disk blocks**, which are chunks of data stored on disk. Repeated requests can use the cached copies.",
      "The **page cache** holds file data in **pages**, fixed-size chunks used by the memory system. A **unified buffer cache** lets normal file reads and **memory-mapped files**, files accessed through memory addresses, share one cache. This avoids keeping duplicate cached copies.",
      "The **directory and inode caches** remember file-name lookups and file information. They help the system find files without repeatedly checking directory information on disk.",
      "**Read-ahead** fetches upcoming blocks before you request them. It helps with **sequential reads**, where you read a file in order.",
      "**Free-behind** releases pages already read during sequential reading. This leaves cache space for other useful data.",
      "**Delayed writes**, or **write-back**, change cached data first and save it to disk later. This is faster, but a crash can lose unsaved changes. **Synchronous writes** wait for data to reach permanent storage. **fsync** requests this for a file.",
      "**Disk controllers**, hardware that manages disk operations, can also have their own **track caches**."
    ],
    "analogy": "A cache is like keeping frequently used books on your desk instead of visiting the library each time.",
    "example": "When you read the same file twice, the second read may come from RAM, avoiding another disk read."
  },
  "os.u5.case-study": {
    "summary": "A **file system** is the way an operating system organises files on a disk. Different file systems use different methods to track data, manage access and recover after crashes.",
    "points": [
      "**ext2, ext3 and ext4** are Linux file systems. They divide the disk into **block groups**. Each group has tables and **bitmaps**, which mark used and free space. Backup copies of the **superblock**, the main file-system information, are stored in selected groups.",
      "An **inode** stores a file’s details and where its data is located. ext2 and ext3 use direct and indirect pointers: addresses that lead to data directly or through other pointer blocks. ext4 normally uses **extents**: consecutive blocks described by a starting location and length.",
      "A **directory** maps names to inode numbers. A **hard link** adds another name for the same inode and increases its link count.",
      "**FAT**, common on USB drives, stores chains of block references in a **File Allocation Table**. It has no built-in file permissions or journaling.",
      "**NTFS** uses a **Master File Table (MFT)** with records for files. Very small files can fit inside their records. It supports **ACL permissions** (rules controlling access), compression, encryption and journaling.",
      "**Journaling** records updates in a disk log before applying them. After a crash, committed updates are replayed and incomplete transactions are ignored. This helps ext3, ext4 and NTFS recover consistency quickly."
    ],
    "analogy": "A journal is like a notebook recording agreed changes before you update the main register.",
    "example": "If a crash interrupts a committed directory update, recovery can replay the logged update."
  },
  "os.u5.directory": {
    "summary": "A **directory** connects file names to the files they identify. A **directory structure** is the way directories are arranged, so we can organise and find files.",
    "points": [
      "**Single-level directory**: Everyone uses one directory. It is simple, but every file needs a unique name. There are no folders for grouping files.",
      "**Two-level directory**: Each user gets a separate directory. The **Master File Directory (MFD)** points to each **User File Directory (UFD)**. Users can reuse file names, but this scheme provides no sharing or subdirectories—folders inside folders.",
      "**Tree structure**: Directories branch into subdirectories from the top directory, called the **root**. Grouping is easy, but the basic tree does not allow a file to be shared between directories.",
      "**Acyclic graph**: **Links**, or references, allow sharing without circular routes. Deletion can leave **dangling pointers**—references to deleted files. **Aliasing** means different names reach the same file, so traversal may visit it repeatedly.",
      "**General graph**: Links can form **cycles**, or circular routes. Traversal can loop forever without safeguards. **Garbage collection** may be needed to reclaim storage that is no longer reachable.",
      "**Directory operations** include searching, creating, deleting, listing, renaming, and **traversing**—moving through directories.",
      "Implementation uses a **linear list**, with slow searching, or a **hash table**, with fast lookup. Hash tables must handle **collisions**, where names map to the same table position."
    ],
    "analogy": "A directory is like a library catalogue: names help you locate items.",
    "example": "An **absolute path** starts at the root: /college/notes.txt. A **relative path** starts at your current directory: notes.txt when inside /college."
  },
  "os.u5.file-concepts": {
    "summary": "A **file** is a named collection of related information saved on **secondary storage**, such as an SSD or hard disk. The OS manages its name, type, **attributes** (details such as size and permissions), and operations.",
    "points": [
      "**File operations** are actions on files. **Create** makes a file. **Open** prepares it for use. **Read** gets information; **write** stores information. **Seek** moves the current position without reading or writing. **Close** ends access. **Delete** removes the file. **Truncate** removes its contents but keeps the file.",
      "The **open-file table** tracks open files. It records details such as the **file pointer** (current position), open count, storage location, and access rights. This avoids repeatedly searching the directory.",
      "**Executable files** (.exe) contain ready-to-run programs. **Object files** (.o) contain compiled code awaiting linking, which combines program parts.",
      "**Source files** (.c, .java, .py) contain program instructions. **Scripts** (.bat, .sh) contain commands. **Text and document files** (.txt, .doc) hold written content.",
      "**Libraries** (.dll, .so) contain reusable routines. **Archives** (.zip, .tar) group files, sometimes with compression. **Multimedia files** (.mp3, .mp4, .jpg) hold sound, video, or images.",
      "Windows commonly uses the **extension**, the filename ending, to identify type. Unix tools can inspect a **magic number**: starting bytes that identify a format. Extensions are hints, and not every file has magic bytes.",
      "**Internal structure** means how contents are arranged: a **byte stream**, fixed-size **records** (data entries), or a tree of records found using a **key**."
    ],
    "analogy": "A file is like a labelled notebook: its name identifies it, and its pages hold related information.",
    "example": "Open notes.txt, write “Exam Friday,” then close it."
  },
  "os.u5.logging": {
    "summary": "**Logging** records what happens in a system. **Auditing** checks those records for problems. **Recovery** restores the system after damage or an attack.",
    "points": [
      "**Logging** automatically records events such as logins, file access, errors, and use of special permissions. It runs continuously. Records go into places like **/var/log** or **Windows Event Log**.",
      "**Auditing** reviews logs and settings periodically. It checks whether rules are followed and looks for misuse. Its results are findings that need attention.",
      "An **audit trail** is a time-ordered record of security events. Logs need **timestamps** and protection from changes. **Append-only** storage allows additions but prevents changing existing entries. A separate log server also helps protect records.",
      "Too much logging can slow the system. Too little can leave attacks unnoticed.",
      "**Signature-based detection** checks for known attack patterns. **Anomaly-based detection** flags unusual behaviour. **Tripwire** detects file changes by comparing **hashes**, which act like digital fingerprints.",
      "A **full backup** copies all selected data. An **incremental backup** copies changes since the last backup. A **differential backup** copies changes since the last full backup. Keep copies **off-site**, at another location.",
      "For **recovery**, restore a known-good backup. Replay available recovery logs or **journals**, which record changes. After a **rootkit**, malicious software that hides privileged access, reinstall from trusted media. Replace compromised passwords and keys, and fix the weakness."
    ],
    "analogy": "Think of a shop: logging keeps the diary, auditing checks it, and recovery repairs damage.",
    "example": "Repeated failed logins appear in logs. An audit may reveal attempted misuse."
  },
  "os.u5.malware": {
    "summary": "**Malware** is software designed to cause harm. **Taxonomy** means classification: grouping malware by how it spreads, what it does, or how it hides.",
    "points": [
      "A **virus** attaches to a host, such as a program or file. It spreads when infected code runs, often after someone opens the file.",
      "**File/parasitic viruses** infect programs. **Boot-sector viruses** infect disk areas used during startup. **Macro viruses** infect documents through embedded commands. **Source-code viruses** infect program source code.",
      "**Polymorphic viruses** change their code’s appearance between infections. **Encrypted viruses** conceal code using encryption. **Stealth viruses** hide infection changes. **Multipartite viruses** infect several types of targets. **Armored viruses** resist analysis.",
      "A **worm** is independent software that spreads automatically, often through network security flaws. The **Morris worm (1988)** disrupted the early Internet. Patching flaws, blocking unused network ports, dividing networks, limiting connections, and detecting suspicious activity reduce worm damage.",
      "A **Trojan horse** looks useful but performs harmful actions. A **backdoor**, or **trap door**, provides hidden access that bypasses normal identity checks.",
      "**Ransomware** commonly encrypts files and demands payment. **Spyware** secretly collects information; a **keylogger** records keystrokes. A **logic bomb** activates when a particular condition occurs.",
      "A **rootkit** hides an attacker’s presence. **User-mode rootkits** replace tools that list files or processes. **Kernel-mode rootkits** alter the OS core, making its reports unreliable. Detection can use trusted startup media or **integrity checking**: comparing files against known, trusted versions."
    ],
    "analogy": "A virus travels inside someone’s luggage. A worm travels independently. A rootkit hides evidence of the intruder.",
    "example": "Opening an infected document can run a macro virus that infects other documents."
  },
  "os.u5.mechanisms": {
    "summary": "**Basic security mechanisms** protect a computer and its data. They check who you are, limit what you can do, and protect information from being read without permission.",
    "points": [
      "**Authentication** checks identity. Passwords are stored as **hashes**, one-way scrambled values, with a **salt**, a random added value. Passwords can be guessed, watched, intercepted, or exposed through reuse.",
      "**One-time passwords** work once. **Multi-factor authentication** combines different types of proof: something you know, have, or are. **Biometrics** use physical traits, such as fingerprints.",
      "Last-login details, unusual-login alerts, and repeated failed attempts can reveal suspicious activity. Fake **honey accounts** help detect attackers.",
      "**Authorisation** decides allowed actions. **Permissions** control reading, writing, and running files. **Least privilege** means giving only necessary rights. **Privilege escalation** means gaining extra rights without permission. Patching and **sandboxing**, which restricts programs, help prevent it.",
      "**Encryption** makes data unreadable without a key. **Symmetric encryption**, such as AES, uses one shared secret key. **Asymmetric encryption**, such as RSA, uses public/private keys and helps exchange secrets securely, but is slower. **Hashes** help detect changes; **digital signatures** verify integrity and the signer.",
      "Encryption cannot stop **denial of service**, which makes services unavailable, malware using your rights, stolen passwords or keys, authorised-user misuse, or attacks on decrypted data.",
      "**User/kernel modes** restrict privileged operations. **Page tables** enforce memory access. **NX/DEP** prevents execution from marked data pages. **Firewalls** filter network traffic; **patches** fix vulnerabilities."
    ],
    "analogy": "Think of a hostel: authentication checks your identity; authorisation decides which rooms you may enter.",
    "example": "You can read a shared file, but permission settings prevent you from changing it."
  },
  "os.u5.metadata": {
    "summary": "**File-system metadata** is information about a file, such as its size, owner and permissions. It is stored separately from the file’s actual contents and helps the operating system find and manage the file.",
    "points": [
      "**File attributes** describe a file. They include its name, identifier, type, location, size, protection and timestamps. An **identifier** is a number that uniquely identifies the file within its file system.",
      "**Protection** controls who can read, write or execute a file. **Timestamps** record events such as modification and access. Creation time is also stored where supported.",
      "The **boot control block** stores information needed to boot, or start, the operating system from that volume.",
      "The **superblock**, or **volume control block**, describes the whole file system. It records details such as block size, total blocks and free blocks. Blocks are units of storage.",
      "The **directory structure** connects file names to their file records. A **file control block (FCB)** stores one file’s attributes and storage locations. Unix uses an **inode** for this role.",
      "An **inode** stores type, permissions, owner, size, timestamps and link count—the number of hard links to it. The **file name is in the directory entry**, not the inode.",
      "In the classic textbook layout, an inode has **12 direct pointers** to data blocks. **Single, double and triple indirect pointers** reach data through one, two or three levels of pointer blocks."
    ],
    "analogy": "Metadata is like a label on a parcel. It describes the parcel without being its contents.",
    "example": "For notes.txt, the directory stores its name and inode number. The inode stores its size and points to blocks containing the notes."
  },
  "os.u5.syscalls": {
    "summary": "A **system call** is a request to the operating system (**OS**). Programs use file system calls to access files. The OS checks permissions and performs the requested work.",
    "points": [
      "**open()** opens a file and can create one. **creat()** creates a file or empties an existing one. They return a **file descriptor**, a small integer identifying an entry in the process’s open-file table.",
      "**read()** gets bytes; **write()** stores bytes. Both advance the **file pointer**, the position for the next transfer, by the bytes transferred. **lseek()** moves this pointer for **random access**: accessing a chosen position.",
      "**close()** releases the descriptor and reduces the shared open-file entry’s reference count. The entry is removed when no references remain. Lock release depends on the lock type. Closing does not guarantee buffered data has reached disk.",
      "**stat() / fstat()** read **metadata**: size, owner and times. **chmod() / chown()** change permissions or ownership.",
      "**unlink()** removes a file name; **rename()** changes a name or location. **mkdir() / rmdir()** create or remove directories; rmdir requires an empty directory.",
      "**flock() / fcntl()** provide locking. **Advisory locks** require programs to cooperate. **Mandatory locks** are enforced by the OS. Ignored advisory locks risk corruption; mandatory locks can unexpectedly block access.",
      "A **hard link** is another name for the same **inode**, the file’s metadata record. Changes are shared; **copies** are independent. Hard links use a **link count**. **Symbolic links** point to paths and can become dangling when targets disappear."
    ],
    "analogy": "A file descriptor is like a claim ticket: use its number to access the opened file.",
    "example": "Read 10 bytes from position 0. The pointer becomes 10. Use **lseek()** to return to position 0, then read those bytes again."
  },
  "os.u5.threats": {
    "summary": "A **threat** is a possible danger to security. A **vulnerability** is a weakness that makes harm possible. An **attack** is an actual attempt to break security. Threats can come from programs or networks.",
    "points": [
      "**Confidentiality** means keeping information private. **Integrity** means protecting it from unauthorised changes. **Availability** means keeping services usable. **Theft of service** means using resources without permission.",
      "**Masquerading** means pretending to be another user. **Replay** means sending a captured valid message again. **Man-in-the-middle** means secretly intercepting, and possibly changing, communication. **Session hijacking** means taking over an active session, such as a logged-in connection.",
      "A **Trojan horse** looks useful but secretly performs harmful actions using your permissions. A **trap door**, or **backdoor**, is a hidden way around normal security checks. A **logic bomb** causes harm when a condition is met.",
      "A **buffer overflow** happens when a program writes beyond a memory area's limit. It can overwrite a **return address**, which tells the program where to continue, and redirect execution.",
      "Defences include checking size limits and using safer languages. **DEP/NX** marks memory as non-executable. **Stack canaries** detect overwriting using a checked marker. **ASLR** randomises memory locations.",
      "A **virus** attaches to another program or file. A **worm** spreads independently, often through networks.",
      "**Port scanning** checks for accessible network services. **Denial of service (DoS)** makes a service unavailable. **Distributed DoS (DDoS)** attacks come from many machines."
    ],
    "analogy": "An unlocked door is a vulnerability; a possible break-in is a threat; trying to enter is an attack.",
    "example": "A calculator app secretly stealing files is a **Trojan horse**."
  }
}
