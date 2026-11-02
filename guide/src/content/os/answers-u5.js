// OS Unit V model answers (file systems & security). Keyed by PYQ id.
const U5 = 'OS Unit-5 slides'
const TB = 'Silberschatz, Operating System Concepts 8e'

export default {
  'os-file-attributes': {
    blocks: [
      { table: { head: ['Attribute', 'Meaning'], rows: [
        ['Name', 'Symbolic, human-readable name'], ['Identifier', 'Unique number within the file system (e.g. inode number)'], ['Type', 'Needed on systems that support different types'],
        ['Location', 'Pointer to the device and the file\'s blocks'], ['Size', 'Current size (and maybe the maximum)'], ['Protection', 'Access control: who may read, write, execute'],
        ['Time, date, user id', 'Creation, last modification and last access; owner — used for protection, security and usage monitoring'],
      ] } },
      'Attributes are kept in the directory entry / file control block (inode in Unix).',
    ],
    sources: [`${U5} slide 4`, `${TB} §10.1.1`],
  },

  'os-mounting': {
    blocks: [
      'A file system must be **mounted** before it can be accessed. Mounting attaches a file system (on a disk partition, USB drive or network share) to a directory of the existing directory tree, called the **mount point**.',
      { steps: ['The OS is given the device name and the mount point (e.g. `mount /dev/sdb1 /mnt/usb`).', 'It verifies the device contains a valid file system (reads the superblock).', 'It records the mount in the mount table; afterwards, accessing `/mnt/usb/notes.txt` traverses into the mounted file system.'] },
      'Whatever was in the mount-point directory is hidden until unmount. Windows mounts volumes as drive letters (C:, D:). Unmounting (`umount`) flushes buffers and detaches the file system.',
    ],
    sources: [`${TB} §10.4`],
  },

  'os-two-vs-single': {
    blocks: [
      'In a **single-level** directory all files of all users are in one directory, so every file name must be unique system-wide and users cannot group their files. A **two-level** directory gives each user a **separate user file directory (UFD)** under a master file directory (MFD), so:',
      { ul: ['Different users can use the **same file names** (no naming conflicts).', 'Users are **isolated** from each other — better protection.', 'Searching is faster (only the user\'s own directory is searched).'] },
    ],
    sources: [`${U5} slides 33–36`, `${TB} §10.3.3`],
  },

  'os-journaling': {
    blocks: [
      '**Journaling** (log-based transaction-oriented file system) records every metadata change as a **transaction** in a sequential **log (journal)** on disk *before* applying it to the actual file-system structures. Once the transaction is committed in the log, the changes are applied; after a crash, the system **replays** committed transactions and discards uncommitted ones. This restores consistency in seconds without a full `fsck` scan. Examples: ext3, ext4, NTFS, XFS.',
    ],
    sources: [`${TB} §11.7.2`],
  },

  'os-locks': {
    blocks: [
      { compare: [
        { title: 'Mandatory locks — advantages', items: ['Enforced by the OS on every access: a process cannot read/write a locked file even if it ignores locking', 'Protects data from careless or malicious programs'] },
        { title: 'Mandatory locks — disadvantages', items: ['A process holding a lock (or crashing with it) can block all others, causing deadlocks or denial of service', 'Overhead of checking locks on every I/O', 'Less flexible: unrelated programs (e.g. a backup tool) may be blocked'] },
      ] },
      'Advisory locks (Unix) leave it to the programs to check the lock: cheaper and flexible, but unsafe if some program ignores them.',
    ],
    sources: [`${TB} §10.1.2`, "OS Nov '25 paper Q5"],
  },

  'os-threat-attack': {
    blocks: [
      { compare: [
        { title: 'Threat', items: ['The **potential** for a security violation', 'e.g. the possibility that a weak password could be guessed', 'May never happen'] },
        { title: 'Attack', items: ['An **actual attempt** to break security', 'e.g. someone running a password-cracking program', 'Can be accidental or malicious'] },
      ] },
    ],
    sources: [`${TB} §15.1`],
  },

  'os-vuln-threat-attack': {
    blocks: [
      { table: { head: ['Term', 'Meaning', 'Example'], rows: [
        ['Vulnerability', 'A **weakness** in the system that could be exploited', 'A program that copies input into a buffer without checking its length'],
        ['Threat', 'A **potential** violation that could exploit a vulnerability', 'An attacker could overflow the buffer to run their own code'],
        ['Attack', 'An **actual attempt** to exploit a vulnerability', 'Sending a crafted long input that overwrites the return address'],
      ] } },
    ],
    sources: [`${TB} §15.1`],
  },

  'os-password-vuln': {
    blocks: [
      'Passwords are the most common authentication method but are vulnerable to:',
      { ul: ['**Guessing**: users pick easy passwords (names, dates, "123456"); brute-force or dictionary attacks.', '**Shoulder surfing**: watching someone type.', '**Sniffing**: capturing passwords sent over the network in clear text.', '**Exposure**: written down, shared, or reused across sites.', '**Stolen password files**: if stored unhashed or weakly hashed.'] },
      'Countermeasures: strong password rules, salted hashes, one-time passwords, multi-factor authentication, limited login attempts.',
    ],
    sources: [`${TB} §15.5.1–15.5.2`],
  },

  'os-encryption-limits': {
    blocks: [
      'Encryption protects confidentiality (and, with signatures, integrity) of data in transit and at rest. It **cannot** prevent:',
      { ul: ['**Denial-of-service** attacks (flooding the server).', '**Malware / trojans** running with the user\'s own privileges (they see data after decryption).', '**Insider misuse** by authorised users who hold the keys.', '**Stolen keys or passwords**, social engineering and phishing.', '**Replay** attacks (unless timestamps/nonces are used) and **traffic analysis** (who talks to whom, how much).', 'Attacks on endpoints (keyloggers, buffer overflows).'] },
    ],
    sources: [`${TB} §15.4`, "OS Dec '24 Q, Dec '23 Q4"],
  },

  'os-privilege': {
    blocks: [
      'A **privilege-escalation** attack gains **more rights than the attacker was granted** — e.g. a normal user becoming root/administrator, typically by exploiting a bug in a privileged (setuid) program, a kernel vulnerability, or misconfigured permissions. Effect on OS security: the attacker can bypass all protection — read or modify any file, install rootkits, disable logging and take full control. Defences: least privilege, patching, sandboxing, DEP/ASLR.',
    ],
    sources: [`${TB} §15.2`],
  },

  'os-capability': {
    blocks: [
      'In a **capability-based system**, access rights are attached to **subjects (domains/processes)** as **capabilities** — protected, unforgeable tokens that name an object and the operations allowed on it (e.g. ⟨file F, read⟩). Possessing a capability is the proof of access; the OS checks only the capability, not an access list. The capability list for a domain is kept by the OS (or tagged/protected memory) so user processes cannot forge or modify it. Examples: Hydra, CAP, seL4.',
    ],
    sources: [`${TB} §14.5.3, §14.8`],
  },

  'os-protection-goals': {
    blocks: [
      { ul: ['Prevent **mischievous, intentional violation** of access restrictions by users.', 'Ensure each program component uses resources only in ways **consistent with stated policies**.', 'Detect **latent errors** at interfaces between subsystems early, before a faulty component contaminates a healthy one.', 'Provide **mechanisms** to enforce policies, separate from the policies themselves (so policies can change).', 'Distinguish between **authorised and unauthorised** usage.'] },
    ],
    sources: [`${TB} §14.1`],
  },

  'os-file-types': {
    blocks: [
      'The OS (or applications) can recognise a file\'s **type** to treat it appropriately — e.g. refuse to print a binary object file, or run an executable. Common method: an **extension** after the name (Windows), or a **magic number** stored at the start of the file (Unix).',
      { table: { head: ['File type', 'Usual extensions', 'Function'], rows: [
        ['Executable', 'exe, com, bin, none', 'Ready-to-run machine-language program'],
        ['Object', 'obj, o', 'Compiled machine code, not linked'],
        ['Source code', 'c, cc, java, py, asm', 'Source code in various languages'],
        ['Batch / script', 'bat, sh', 'Commands to the command interpreter'],
        ['Text', 'txt, doc', 'Textual data, documents'],
        ['Word processor', 'docx, rtf, tex', 'Formatted documents'],
        ['Library', 'lib, a, so, dll', 'Libraries of routines for programmers'],
        ['Print or view', 'pdf, ps, jpg', 'Files for printing or viewing'],
        ['Archive', 'zip, tar, rar', 'Related files grouped into one, often compressed'],
        ['Multimedia', 'mpeg, mov, mp3, mp4', 'Audio/video'],
      ] } },
      'Unix also has special file types: directories, symbolic links, character/block device files, named pipes and sockets.',
    ],
    sources: [`${U5} slide 6`, `${TB} §10.1.3`],
  },

  'os-file-org': {
    blocks: [
      'File organisation (access methods) decides how records in a file are arranged and accessed.',
      { h: '1. Sequential access' },
      'Records are processed **in order**, one after another; a file pointer advances automatically on each read/write (`read_next`, `write_next`, `reset`). Based on the tape model. Example: compilers and editors reading a source file; a payroll run over all employee records.',
      { h: '2. Direct (relative) access' },
      'The file is a numbered sequence of fixed-length **blocks/records**; any block can be read or written directly in any order (`read n`, `write n`). Based on the disk model. Example: a database or airline-reservation system jumping straight to record 2047.',
      { h: '3. Indexed (indexed-sequential) access' },
      'An **index** holds keys and pointers to blocks. To find a record, search the index (possibly kept in memory), then access the block directly. For big files a multi-level index is used. Example: IBM ISAM — a master index points to secondary index blocks, which point to data blocks; a student database indexed by roll number.',
      { h: '4. Hashed / direct-file organisation' },
      'A hash function on the key gives the block address directly.',
      { table: { head: ['Method', 'Best for', 'Drawback'], rows: [['Sequential', 'Processing every record', 'Slow to reach a particular record'], ['Direct', 'Random lookup by record number', 'Need to know the record number'], ['Indexed', 'Lookup by key + sequential processing', 'Index storage and maintenance']] } },
    ],
    sources: [`${U5} slides 7–13`, `${TB} §10.2`],
  },

  'os-allocation': {
    blocks: [
      'Allocation methods decide how disk blocks are assigned to files so that space is used effectively and files are accessed quickly.',
      { h: '1. Contiguous allocation' },
      'Each file occupies a set of **contiguous blocks**. The directory entry holds the **starting block and the length** (e.g. file "mail": start 19, length 6 → blocks 19–24).',
      { img: 'os-contiguous' },
      { ul: ['Supports sequential and direct access easily (block i = start + i); minimal seeks.', 'Suffers **external fragmentation**; the file size must be known in advance; files are hard to grow (may need relocation). First/best fit to choose holes; compaction may be needed.'] },
      { h: '2. Linked allocation' },
      'Each file is a **linked list of blocks** scattered anywhere; each block contains a pointer to the next. The directory holds pointers to the **first and last** blocks.',
      { img: 'os-linked' },
      { ul: ['No external fragmentation; files grow easily.', 'Only sequential access is efficient (to reach block i, follow i pointers); pointers use space; a damaged pointer loses the rest of the file. Clustering blocks reduces overhead.', '**FAT** variant: all next-pointers are kept in a **File Allocation Table** at the start of the volume, indexed by block number (entry = next block, end-of-file marker, or 0 for free). Directory entry: name + first block. Caching the FAT makes random access fast.'] },
      { h: '3. Indexed allocation' },
      'All the pointers of a file are brought together in an **index block**. The i-th entry points to the i-th block. The directory entry holds the **address of the index block**.',
      { img: 'os-indexed' },
      { ul: ['Direct access without external fragmentation.', 'Overhead of the index block (wasted for small files). Large files use a **linked scheme** (chained index blocks), **multilevel index**, or the Unix **combined scheme**: 12 direct pointers + single, double and triple indirect pointers in the inode.'] },
      { table: { head: ['Method', 'Directory entry / table format'], rows: [['Contiguous', 'file name | start block | length'], ['Linked', 'file name | start block | end block (each block holds the next pointer)'], ['FAT', 'file name | start block; FAT[b] = next block of b'], ['Indexed', 'file name | index block number; index block = list of data blocks']] } },
    ],
    sources: [`${U5} slides 14–25`, `${TB} §11.4`],
  },

  'os-indexed-partial': {
    blocks: [
      'Normally every block of a sequential file except the last is full. Here the system allows blocks in the middle of a file to be **partially full**, with the index entry recording how much of each block is used.',
      { compare: [
        { title: 'Advantages', items: ['**Insertions and deletions in the middle** are cheap: data can be inserted into a partially full block or a new block can be linked into the index without shifting the rest of the file', 'Appending small records doesn\'t force rewriting full blocks', 'Records need not span block boundaries'] },
        { title: 'Disadvantages', items: ['**Wasted space** (internal fragmentation) inside partially full blocks', 'Each index entry must store the **byte count** of its block, so the index is larger', 'Direct access by byte offset is harder: the OS can\'t compute "offset ÷ block size"; it must scan the counts', 'Sequential reads may need more blocks (and more disk I/O) for the same data'] },
      ] },
    ],
    sources: [`${TB} §11.4.3, Exercise 11.x`, 'OS Dec \'23 paper Q11(a)'],
  },

  'os-free-space': {
    blocks: [
      'The file system keeps a **free-space list** to record free disk blocks.',
      { h: '1. Bit vector (bitmap)' },
      'One bit per block: 1 = free, 0 = allocated (e.g. 001111001111110…). Simple, and finding the first free block or n contiguous free blocks is fast with bit-manipulation instructions. Needs space (1 TB disk with 4 KB blocks → 32 MB bitmap), which must be cached for speed.',
      { h: '2. Linked list' },
      'All free blocks are linked together; a pointer to the first free block is kept in a special location (and cached). No wasted space, but traversing the list is slow (each block read). FAT includes free-block accounting in the table.',
      { h: '3. Grouping' },
      'The first free block stores the addresses of n free blocks; the last of these holds the addresses of the next n free blocks, and so on. Large numbers of free blocks can be found quickly.',
      { h: '4. Counting' },
      'Since contiguous blocks are often freed together, store (address of first free block, number n of free contiguous blocks). The list is shorter. Used by extent-based systems.',
      { h: '5. Space maps (ZFS)' },
      'Divide the disk into metaslabs, each with a log of allocations/frees, replayed into an in-memory balanced tree.',
    ],
    sources: [`${TB} §11.5`],
  },

  'os-logical-physical': {
    blocks: [
      'The file system is organised in **layers**, each using the services of the layer below, to map the logical view of files to physical disk blocks.',
      { steps: [
        '**Application programs** call open/read/write on file names.',
        '**Logical file system**: manages metadata — directory structure, file control blocks (inodes), protection and security. It turns a file name into an FCB.',
        '**File-organisation module**: knows the file\'s allocation method; translates **logical block numbers** (0, 1, 2… within the file) into **physical block numbers**; manages free space.',
        '**Basic file system**: issues generic commands to the device driver to read/write physical blocks (e.g. drive 1, cylinder 73, track 2, sector 10); manages buffers and caches.',
        '**I/O control**: device drivers and interrupt handlers transfer data between memory and the disk.',
        '**Devices**: the physical disk.',
      ] },
      'Example: `read(fd, buf, 4096)` at file offset 8192 → logical block 2 → the file-organisation module looks up the inode / FAT / index → physical block 1456 → basic file system requests block 1456 from the driver → the disk controller reads it.',
    ],
    sources: [`${TB} §11.1–11.2`],
  },

  'os-close': {
    blocks: [
      'When a process calls `close(fd)` on a file it has been writing:',
      { steps: [
        'The system call checks that **fd** is a valid descriptor in the **per-process open-file table**.',
        'Any **buffered, modified data** for the file (in the page/buffer cache) is scheduled to be written to disk (flushed on close for some systems, or later by the cache daemon; `fsync` forces it).',
        'The entry is removed from the **per-process open-file table**, and the descriptor number becomes free for reuse.',
        'The **open count** in the **system-wide open-file table** entry is decremented.',
        'If the count reaches **0** (no process has the file open), the system-wide entry is removed; updated metadata (size, modification time, block pointers) in the in-memory FCB/inode is written back to disk.',
        'Any **locks** the process held on the file are released.',
        'If the file had been deleted (unlinked) while open and this was the last reference, its blocks and inode are now freed.',
      ] },
      { h: 'Example' },
      'Process A and B both open `notes.txt` (open count = 2). A writes and closes: A\'s descriptor is freed, count becomes 1, data is flushed. When B closes, count becomes 0, the system-wide entry is removed and the inode (new size, mtime) is written back.',
    ],
    sources: [`${TB} §10.1.2, §11.2`],
  },

  'os-directory': {
    blocks: [
      'A directory holds information about files (name, location, size, type). Operations: search, create, delete, list, rename, traverse. Common logical structures:',
      { h: '1. Single-level directory' },
      { img: 'os-dir-single' },
      'All files in one directory. Simple, but every file name must be unique, and with many users and files it becomes impossible to manage.',
      { h: '2. Two-level directory' },
      { img: 'os-dir-two' },
      'A **master file directory (MFD)**, indexed by user name, points to a separate **user file directory (UFD)** per user. Users can reuse names and are isolated, but sharing is hard and users cannot create subdirectories. A file is named by a path: /user/file.',
      { h: '3. Tree-structured directory' },
      { img: 'os-dir-tree' },
      'Generalises to arbitrary depth: directories contain files and subdirectories. Each process has a **current directory**; paths are **absolute** (from root) or **relative**. Efficient searching and grouping, but no sharing of a file between directories.',
      { h: '4. Acyclic-graph directory' },
      { img: 'os-dir-acyclic' },
      'Allows shared subdirectories and files through **links** (hard links or symbolic links), with no cycles. Problems: a file has several names (aliasing) and deleting may leave **dangling pointers** — solved with reference counts (hard links) or by leaving dangling symbolic links.',
      { h: '5. General-graph directory' },
      { img: 'os-dir-general' },
      'Links may create **cycles**. Traversal algorithms must avoid infinite loops, and a self-referencing directory may have a non-zero reference count even when unreachable, so **garbage collection** is needed. Most systems disallow links to directories to avoid this.',
    ],
    sources: [`${U5} slides 31–41`, `${TB} §10.3`],
  },

  'os-two-level-dir': {
    blocks: [
      { img: 'os-dir-two' },
      'In a **two-level directory**, each user has a separate **user file directory (UFD)**. A **master file directory (MFD)**, indexed by user name or account number, points to each UFD.',
      { h: 'How it works' },
      { ul: ['When a user logs in, the system searches the MFD to find that user\'s UFD.', 'File operations (create, delete, search) work only within the current user\'s UFD, so names need be unique only per user.', 'A file is identified by a path name: user name + file name (e.g. /user2/test).', 'System files (compilers, libraries) are placed in a special user directory that is searched when a file is not found in the user\'s own UFD (the **search path**).'] },
      { compare: [
        { title: 'Advantages', items: ['Solves the name-collision problem of single-level directories', 'Isolates users from one another (protection)', 'Efficient searching'] },
        { title: 'Disadvantages', items: ['Hard for users to cooperate and share files (must name another user\'s directory, if allowed at all)', 'No grouping of a user\'s files into subdirectories', 'Only two levels — doesn\'t scale for users with many files'] },
      ] },
    ],
    sources: [`${U5} slides 35–36`, `${TB} §10.3.3`],
  },

  'os-dir-caching': {
    blocks: [
      { h: 'Directory structure' },
      'Directories map names to file control blocks. Logical structures: single-level, two-level, tree, acyclic graph, general graph (see the directory answer). Implementation: a **linear list** of (name, pointer) entries — simple but searching is O(n) — or a **hash table** keyed on the name — fast lookup, needs collision handling and a fixed or growable table size. Many systems use B-trees for large directories.',
      { img: 'os-dir-tree' },
      { h: 'Caching optimisations' },
      { ul: [
        '**Directory/name cache (dentry cache)**: recently used path components and their inodes are cached so path lookups (e.g. /home/user/a.txt) avoid re-reading directories.',
        '**Inode / FCB cache**: recently used file metadata stays in memory.',
        '**Buffer cache**: recently used disk blocks are kept in memory.',
        '**Page cache**: file data cached as virtual-memory pages; a **unified buffer cache** lets both read()/write() and memory-mapped I/O use the same pages, avoiding double caching.',
        '**Read-ahead** and **free-behind** for sequential access: fetch the next blocks early and drop pages already read.',
        '**Delayed (write-back) writes**: write to the cache and flush later, batching disk I/O (synchronous writes used for metadata to keep consistency).',
        'Disk controllers also have on-board track caches.',
      ] },
    ],
    sources: [`${TB} §11.3, §11.6`, "OS Nov '25 paper Q14(b)"],
  },

  'os-fs-caching': {
    blocks: [
      '**File-system caching** keeps recently or frequently used disk data — file contents and metadata — in **main memory**, so that later accesses are served from RAM instead of the much slower disk.',
      { h: 'Kinds of cache' },
      { ul: ['**Buffer cache**: holds disk blocks.', '**Page cache**: holds file data as memory pages (also used for memory-mapped files); modern systems use a **unified** buffer/page cache.', '**Metadata caches**: inode cache, directory-entry (name lookup) cache.'] },
      { h: 'Benefits in file access' },
      { ol: ['**Speed**: memory access is ~100,000× faster than a disk seek; repeated reads hit the cache.', '**Fewer disk I/Os**: hits avoid I/O completely; writes can be **delayed and batched** (write-back), turning many small writes into fewer large ones.', '**Read-ahead**: for sequential reads, upcoming blocks are prefetched, hiding disk latency.', '**Faster path resolution** through cached directory entries and inodes.', '**Sharing**: several processes reading the same file share the cached pages.', '**Smoother performance** and lower disk wear.'] },
      { warn: 'Risk: data in a write-back cache is lost if the system crashes before it is flushed. Remedies: periodic sync, `fsync()`, synchronous metadata writes and journaling.' },
    ],
    sources: [`${TB} §11.6`],
  },

  'os-journaling-fs': {
    blocks: [
      'A **journaling (log-structured) file system** writes every metadata update first as a **transaction** to a circular **journal (log)**; once committed, the changes are applied to the file-system structures, and the log entry is removed when complete.',
      { h: 'Main advantages' },
      { ol: [
        '**Fast crash recovery**: after a crash, only the journal is replayed — committed transactions are redone, incomplete ones discarded. Recovery takes seconds instead of a full `fsck`/`chkdsk` scan of the whole disk (minutes to hours).',
        '**Consistency**: metadata updates are atomic — either fully applied or not at all — so structures (free maps, inodes, directories) don\'t end up half-updated.',
        '**Reliability / reduced data loss**: optional data journaling (ext3/ext4 "journal" mode) protects file contents too.',
        '**Performance**: journal writes are sequential and fast; actual updates can be applied asynchronously.',
        '**Scalability**: suitable for very large volumes where full scans would be impractical.',
      ] },
      { table: { head: ['File system', 'Notes'], rows: [['ext3', 'Adds a journal to ext2; journal / ordered / writeback modes'], ['ext4', 'Journaling + extents, delayed allocation, journal checksums, larger files/volumes'], ['NTFS', 'Logs metadata changes in $LogFile; master file table; ACLs, compression, encryption']] } },
    ],
    sources: [`${TB} §11.7.2`],
  },

  'os-inode': {
    blocks: [
      'In Unix, every file is described by an **inode** (index node) stored in the inode table; directories map **names to inode numbers**.',
      { h: 'Contents of an inode' },
      { ul: ['File type and mode (permission bits rwx for owner, group, others; setuid/setgid)', 'Owner UID and group GID', 'File size in bytes', 'Timestamps: last access, last modification, last inode change', 'Link count (number of directory entries / hard links)', 'Block pointers — the **combined scheme**:'] },
      { table: { head: ['Pointer', 'Points to', 'Reach (4 KB blocks, 4-byte pointers)'], rows: [['12 direct', 'data blocks directly', '48 KB'], ['1 single indirect', 'a block of 1024 pointers to data blocks', '+ 4 MB'], ['1 double indirect', 'a block of pointers to single-indirect blocks', '+ 4 GB'], ['1 triple indirect', 'a block of pointers to double-indirect blocks', '+ 4 TB']] } },
      'Small files are accessed through direct pointers only (fast); huge files use indirection. The inode does **not** contain the file name — that is in the directory entry, which is why one inode can have several names (hard links).',
    ],
    sources: [`${TB} §11.4.3, §A.7 (Unix inode)`, 'OS Dec \'23 paper Q15(b)'],
  },

  'os-links-copies': {
    blocks: [
      { h: '(a) Links from every user\'s home directory' },
      { compare: [
        { title: 'Advantages', items: ['Only **one copy** on disk — saves space', 'Any update is immediately seen by all users (consistency)', 'Easy to maintain one master file'] },
        { title: 'Drawbacks', items: ['Concurrent updates need locking/coordination', 'Deletion problems: with hard links the file persists until the last link is removed; with symbolic links, deleting the original leaves **dangling links**', 'One user can damage or delete it for everyone (needs careful protection)', 'Traversal/backup tools may count it multiple times'] },
      ] },
      { h: '(b) Copying data into every home directory' },
      { compare: [
        { title: 'Advantages', items: ['Each user can modify their copy freely without affecting others', 'No sharing/locking issues; a damaged copy affects only one user', 'Access may be faster (local)'] },
        { title: 'Drawbacks', items: ['Wastes disk space (n copies)', 'Copies become **inconsistent** as soon as one is updated; propagating changes is hard', 'More effort to maintain'] },
      ] },
      'For a frequently accessed file that should stay the same for everyone, **links** are better; copies are better only if each user needs a private, independently modified version.',
    ],
    sources: [`${TB} §10.3.4`, "OS Dec '24 paper"],
  },

  'os-std-attacks': {
    blocks: [
      'Standard security attacks against systems and their communication:',
      { ul: [
        '**Masquerading**: one participant pretends to be another (e.g. a forged login) to gain privileges.',
        '**Replay attack**: a valid data transmission (e.g. a money transfer) is captured and re-sent maliciously.',
        '**Message modification**: the content of a message is changed in transit.',
        '**Man-in-the-middle**: the attacker sits between sender and receiver, impersonating each to the other and reading/altering the traffic.',
        '**Session hijacking**: an active communication session is taken over.',
        '**Denial of service (DoS/DDoS)**: preventing legitimate use by flooding the system.',
      ] },
      { img: 'os-attacks' },
      'Security violations they cause: breach of **confidentiality** (unauthorised reading), **integrity** (unauthorised modification), **availability** (destruction), **theft of service**, and **denial of service**.',
      'Defence must be taken at four levels: physical, human (social engineering, phishing), operating system, and network.',
    ],
    sources: [`${U5} slides 46–51`, `${TB} §15.1`],
  },

  'os-sys-net-threats': {
    blocks: [
      'System and network threats misuse system services and network connections, often attacking many machines.',
      { h: '1. Worms' },
      'Standalone programs that **spawn copies of themselves** across the network using vulnerabilities, consuming resources. The Morris worm (1988) used a `finger` daemon buffer overflow, `sendmail`\'s debug option and trusted `rsh` hosts, and shut down thousands of systems.',
      { h: '2. Port scanning' },
      'Not an attack in itself but a reconnaissance method: automatically connecting to a range of ports on a range of hosts to find services and known-vulnerable versions (tools like nmap). Often launched from compromised "zombie" systems to hide the attacker.',
      { h: '3. Denial of service (DoS)' },
      { ul: ['Disrupts legitimate use rather than stealing information.', 'Examples: SYN flooding (half-open TCP connections exhaust the server), downloading huge files repeatedly, a program that keeps forking processes.', '**Distributed DoS (DDoS)**: launched from many compromised machines (botnets) at once — hard to block.'] },
      { h: '4. Other system threats' },
      'Viruses spreading through shared files and email, exploitation of setuid programs (privilege escalation), and using a compromised machine to attack others.',
      'Defences: firewalls, intrusion detection/prevention systems, patching, disabling unused services, rate limiting.',
    ],
    sources: [`${U5} slides 58–63`, `${TB} §15.3`],
  },

  'os-program-threats': {
    blocks: [
      'Program threats are programs written to cause harm or to misuse other programs.',
      { h: '1. Trojan horse' },
      'A code segment that **misuses its environment**: it looks useful but performs hidden malicious actions with the rights of the user who runs it. Examples: a fake login program that records passwords; spyware bundled with free software; a game that deletes files.',
      { h: '2. Trap door (back door)' },
      'A hidden entry point left by the programmer that **bypasses normal authentication** (e.g. a special user name accepted without a password). Very hard to detect, especially if inserted into a compiler.',
      { h: '3. Logic bomb' },
      'Code that does harm only when a **condition** occurs — a date, a user being removed from payroll. Example: a programmer\'s code that deletes data if his name disappears from the employee list.',
      { h: '4. Stack and buffer overflow' },
      'Exploits a program that copies input into a fixed buffer without checking length. The attacker supplies data that overwrites the **return address** on the stack so the function returns into attacker code (shellcode), often spawning a privileged shell.',
      { h: '5. Viruses' },
      'Code fragments embedded in legitimate programs that self-replicate and spread (file, boot, macro, polymorphic, stealth, etc.).',
    ],
    sources: [`${U5} slides 52–57`, `${TB} §15.2`],
  },

  'os-malware-taxonomy': {
    blocks: [
      '**Malware** is software designed to exploit, disable or damage a computer system. It can be classified by **how it spreads** and by **what it does**.',
      { h: 'By propagation' },
      { ul: ['**Virus**: attaches to a host program or file and replicates when the host runs; needs user action (opening a file, running a program).', '**Worm**: standalone; spreads automatically over networks by exploiting vulnerabilities.', '**Trojan horse**: disguised as legitimate software; the user installs it willingly.'] },
      { h: 'By payload / behaviour' },
      { table: { head: ['Type', 'Description'], rows: [
        ['Backdoor / trap door', 'Secret access bypassing authentication'],
        ['Rootkit', 'Hides itself and other malware by modifying OS tools or the kernel; maintains root access'],
        ['Logic bomb', 'Triggers harm on a condition or date'],
        ['Spyware / keylogger', 'Secretly collects information or keystrokes'],
        ['Adware', 'Displays unwanted advertising'],
        ['Ransomware', 'Encrypts the victim\'s files and demands payment'],
        ['Bot / zombie', 'Remote-controlled machine in a botnet (used for DDoS, spam)'],
        ['Dropper / downloader', 'Installs other malware'],
      ] } },
      { h: 'Virus subtypes' },
      'File, boot-sector, macro, source-code, polymorphic (changes signature), encrypted, stealth (hides its changes), tunnelling (bypasses antivirus by installing in interrupt chains), multipartite (infects several parts), armored (hard to analyse).',
      'Defences: antivirus (signature and behaviour-based), patching, least privilege, sandboxing, user education, backups.',
    ],
    sources: [`${U5} slides 46–63`, `${TB} §15.2`],
  },

  'os-virus-worm': {
    blocks: [
      { h: 'Viruses' },
      'A **virus** is a fragment of code **embedded in a legitimate program** (or document/boot sector). When the host runs, the virus executes, **infects other programs**, and may deliver a payload (delete files, display messages, crash the system). Viruses need a user action to spread (sharing files, email attachments).',
      { ul: ['Phases: dormant → propagation → triggering → execution.', 'Types: file/parasitic, boot (infects the boot sector, runs before the OS), macro (in Word/Excel documents), source-code, **polymorphic** (changes its code each infection to avoid signatures), encrypted, **stealth** (intercepts system calls to hide its changes), multipartite, armored.'] },
      { h: 'Worms' },
      'A **worm** is a **standalone** program that uses network vulnerabilities to **copy itself** to other machines automatically, without attaching to another program or needing user action. It consumes bandwidth and resources and may carry a payload. Example: the Morris worm used a grappling-hook program via rsh, a finger buffer overflow and sendmail; Code Red and WannaCry are later examples.',
      { compare: [
        { title: 'Virus', items: ['Needs a host program', 'Spreads by user action', 'Infects files'] },
        { title: 'Worm', items: ['Standalone', 'Spreads by itself over networks', 'Consumes network/system resources'] },
      ] },
      { h: 'Rootkits' },
      'A **rootkit** hides an attacker\'s presence and keeps privileged access: **user-mode** rootkits replace tools like `ls`, `ps`, `netstat` to hide files/processes; **kernel-mode** rootkits modify the system-call table or kernel data structures so even the OS cannot see them. Detection needs integrity checking from trusted media (comparing file hashes) or memory forensics; recovery usually means reinstalling the OS.',
    ],
    sources: [`${U5} slides 55–63`, `${TB} §15.2.5, §15.3.1`],
  },

  'os-trojan': {
    blocks: [
      { h: 'Trojan horses' },
      'A **trojan** is a program that **appears useful** (a game, a codec, a "free antivirus", a cracked app) but secretly performs malicious actions. It runs with the **privileges of the user** who executes it, so it can do anything that user can.',
      { ul: ['**Credential theft**: a fake login screen records the user\'s name and password, then shows "login incorrect" and passes control to the real login (the reason for the secure attention key Ctrl+Alt+Del).', '**Spyware/keyloggers**: send keystrokes, browsing data or files to the attacker.', '**Installing other malware**: acts as a dropper for ransomware or bots.', '**Path attacks**: a program named like a common command (e.g. `ls`) placed in the search path runs instead of the real one.', 'It **opens backdoors** for later remote access.'] },
      { h: 'Backdoors (trap doors)' },
      'A **backdoor** is a hidden way to **bypass authentication or security checks** — e.g. a programmer\'s secret user ID, a hard-coded password, or a listening network service installed by malware.',
      { ul: ['Gives the attacker **remote control** at any time, even after the original vulnerability is fixed.', 'Can be inserted into the **compiler** so every program it builds contains the backdoor (Thompson\'s "Reflections on Trusting Trust") — undetectable by reading the program\'s source.', 'Lets the attacker escalate privileges, steal data and hide activity.'] },
      { h: 'Impact and defence' },
      'Both break **confidentiality, integrity and availability**. Defences: install software only from trusted sources, code signing, least privilege, antivirus/behaviour monitoring, firewalls blocking unexpected listening ports, code reviews and audits.',
    ],
    sources: [`${TB} §15.2.1–15.2.2`],
  },

  'os-worm-limit': {
    blocks: [
      { h: 'Measures to limit worm damage' },
      { ul: [
        '**Patch quickly**: worms exploit known vulnerabilities; automated, prompt patching closes the holes.',
        '**Firewalls**: block all ports and services not explicitly needed, both inbound and outbound.',
        '**Disable unnecessary services** (e.g. finger, rsh) and use least privilege for network daemons.',
        '**Network segmentation**: split the network so an infection in one segment cannot spread everywhere.',
        '**Rate-limit outbound connections** (throttling): a worm trying to contact thousands of hosts per second is slowed dramatically.',
        '**Intrusion detection/prevention systems** that recognise worm signatures or anomalous traffic.',
        '**Diversity**: not running identical software everywhere reduces the number of hosts one exploit can reach.',
      ] },
      { h: 'Drawbacks' },
      { ul: ['Firewalls and disabled services reduce **functionality and convenience** for legitimate users.', 'Rapid patching can **break** existing applications and needs testing.', 'Rate limiting can slow legitimate high-traffic applications.', 'Segmentation and IDS add **cost, complexity and administration** effort, and IDS produce false alarms.', 'Diversity increases maintenance cost.'] },
    ],
    sources: [`${TB} §15.3.1, Exercise 15.x`, "OS Dec '22–Jan '23 paper"],
  },

  'os-buffer-overflow': {
    blocks: [
      { h: 'The attack' },
      'A program copies input into a fixed-size buffer on the stack without checking its length (e.g. `strcpy(buffer, argv[1])`). Overly long input overwrites adjacent stack memory, including the function\'s **return address**. The attacker places machine code (shellcode) in the input and sets the return address to point to it, so when the function returns, the attacker\'s code runs with the program\'s privileges.',
      { h: '1. Better programming methodology' },
      { ul: [
        '**Bounds checking**: use safe functions (`strncpy`, `snprintf`, `fgets`) instead of `strcpy`, `sprintf`, `gets`, and always check input lengths.',
        '**Safe languages**: Java, Python, Rust, C# check array bounds automatically.',
        '**Compiler protections**: **stack canaries** (StackGuard / `-fstack-protector`) — a random value placed before the return address is checked before returning; if changed, the program aborts.',
        '**Static analysis and code review**, fuzz testing.',
        'Run programs with **least privilege** so a successful exploit gains little.',
      ] },
      { h: '2. Special hardware support' },
      { ul: [
        '**NX / XD bit (no-execute)**: pages are marked non-executable; stack and heap data cannot be executed, so injected shellcode fails. Software name: **DEP** (Data Execution Prevention).',
        '**ASLR** (address space layout randomisation, OS + hardware): randomises the location of stack, heap and libraries so the attacker cannot predict addresses.',
        'Shadow stacks / control-flow enforcement (Intel CET) keep a protected copy of return addresses.',
      ] },
      'These defences complement each other: attackers bypass NX with return-oriented programming, which ASLR and canaries make much harder.',
    ],
    sources: [`${TB} §15.2.4`, "OS Nov '25 paper Q15(a)"],
  },

  'os-dep': {
    blocks: [
      'Many memory attacks (buffer overflows, heap sprays) work by **injecting machine code as data** into the stack or heap and then redirecting execution to it.',
      { h: 'How DEP works' },
      { ul: [
        'Memory pages are marked as either **executable** (program code) or **non-executable** (stack, heap, data), using the processor\'s **NX/XD (no-execute) bit** in page-table entries.',
        'If the CPU tries to fetch an instruction from a page marked non-executable, the hardware raises an **access violation** and the OS terminates the process.',
        'So even if an attacker overflows a buffer and overwrites the return address to point at injected shellcode on the stack, the shellcode **cannot run**.',
        'Software DEP additionally checks exception handlers (SafeSEH) on Windows.',
        'Policy: **W⊕X** — a page may be writable or executable, never both.',
      ] },
      { h: 'Limitations' },
      'Attackers may reuse existing code (return-to-libc, **return-oriented programming**), so DEP is combined with **ASLR**, stack canaries and control-flow integrity. JIT compilers that need writable-and-executable memory must be handled carefully.',
    ],
    sources: [`${TB} §15.2.4`],
  },

  'os-security-levels': {
    blocks: [
      'To protect a system, security measures must be taken at four **levels** — a weakness at any level lets attackers bypass the others:',
      { ol: ['**Physical**: secure the machines, terminals and data centres against armed or surreptitious entry.', '**Human**: authorise users carefully and guard against social engineering, phishing and dumpster diving.', '**Operating system**: protect against accidental or purposeful breaches — runaway processes (DoS), stack overflows, weak passwords, misconfiguration.', '**Network**: protect data on private lines, the Internet, wireless links, against interception and interruption.'] },
      { h: 'Evaluation levels (TCSEC "Orange Book")' },
      { table: { head: ['Division', 'Meaning'], rows: [['D', 'Minimal protection'], ['C1 / C2', 'Discretionary protection; C2 adds individual accountability and auditing (e.g. Windows NT certified C2)'], ['B1 / B2 / B3', 'Mandatory protection with sensitivity labels, structured protection, security domains'], ['A1', 'Verified design using formal methods']] } },
      'Modern equivalent: Common Criteria evaluation assurance levels EAL1–EAL7.',
    ],
    sources: [`${TB} §15.1, §15.8`],
  },

  'os-crypto': {
    blocks: [
      '**Cryptography** constrains the potential senders and/or receivers of a message using **keys**, so that security does not depend on trusting the network.',
      { h: 'Encryption' },
      { ul: [
        '**Symmetric encryption**: the same key encrypts and decrypts (DES, 3DES, **AES**, RC4). Fast, but the key must be shared secretly (key-distribution problem).',
        '**Asymmetric (public-key) encryption**: each user has a public key (published) and a private key (secret). Anyone encrypts with the receiver\'s public key; only the private key decrypts (**RSA**). Solves key distribution; slower, so used to exchange symmetric session keys.',
      ] },
      { h: 'Authentication and integrity' },
      { ul: ['**Hash functions** (SHA-2) produce a fixed-size message digest; any change in the message changes the digest.', '**MAC** (message-authentication code): hash with a shared secret key.', '**Digital signatures**: sign the digest with the sender\'s private key; anyone verifies with the public key — gives authentication, integrity and **non-repudiation**.', '**Certificates** issued by certificate authorities bind public keys to identities.'] },
      { h: 'Uses in the OS and networks' },
      'Storing passwords as salted hashes, encrypted file systems (BitLocker, LUKS), secure network protocols (SSL/TLS for HTTPS, IPsec, SSH), signed software updates and code signing.',
      { warn: 'Cryptography cannot prevent DoS, insider misuse, malware running with user privileges, or stolen keys.' },
    ],
    sources: [`${TB} §15.4`],
  },

  'os-protection-principles': {
    blocks: [
      { h: 'Goals of protection' },
      { ul: ['Prevent malicious or accidental violation of access restrictions.', 'Ensure every program component uses system resources only as allowed by policy.', 'Detect errors at interfaces between components early (improves reliability).', 'Provide mechanisms that can enforce many different policies (fixed in design, set by management, or defined by users).'] },
      { h: 'Principles' },
      { ul: [
        '**Principle of least privilege**: programs, users and systems get **just enough** privileges to perform their tasks — limits damage from bugs or attacks (e.g. separate admin and normal accounts, setuid only when needed).',
        '**Need-to-know**: at any time a process may access only the objects it currently requires.',
        '**Separation of mechanism and policy**: the OS provides mechanisms; policies decide how they are used.',
        '**Domains of protection** and **compartmentalisation**: each process runs in a domain defining its access rights.',
        '**Defence in depth**, auditing, and fail-safe defaults.',
      ] },
    ],
    sources: [`${TB} §14.1–14.2`],
  },

  'os-access-matrix-impl': {
    blocks: [
      'The **access matrix** has rows = **domains**, columns = **objects**, and entry access(i, j) = the set of operations a process in domain Di may invoke on object Oj. The matrix is large and sparse, so it is implemented in one of these ways:',
      { h: '1. Global table' },
      'A single table of triples ⟨domain, object, rights-set⟩. Simple, but huge (can\'t be kept in memory), and grouping is hard (an object readable by everyone needs an entry for every domain).',
      { h: '2. Access lists for objects (columns)' },
      'Each object keeps a list of ⟨domain, rights⟩ pairs (plus a default set). Corresponds to user needs (owner decides who accesses the file) — e.g. Unix rwx bits and ACLs in Windows/Linux. Revocation is easy, but determining all rights of a domain requires scanning every object, and checking on every access is costly.',
      { h: '3. Capability lists for domains (rows)' },
      'Each domain has a list of ⟨object, rights⟩ capabilities. Possession of a capability means access is allowed. Efficient for a given process, but revocation is hard; capabilities must be protected from forgery (kept by the OS or in tagged memory).',
      { h: '4. Lock–key mechanism' },
      'Each object has a list of unique bit patterns (**locks**); each domain has a list of bit patterns (**keys**). A process can access an object only if its domain has a key matching one of the object\'s locks. A compromise between access lists and capability lists; revocation is effective.',
      { h: 'In practice' },
      'Most systems combine access lists and capabilities: the access list is checked when a file is **opened**, then a capability (the file descriptor / open-file table entry) is used for subsequent accesses.',
    ],
    sources: [`${TB} §14.4–14.5`],
  },

  'os-access-matrix-ops': {
    blocks: [
      'Besides ordinary rights (read, write, execute), the access matrix itself is an object that can be modified using special rights. Operations:',
      { table: { head: ['Right / operation', 'Effect'], rows: [
        ['**Switch**', 'A process may switch from domain Di to Dj only if *switch* ∈ access(i, j) — domains are also objects'],
        ['**Copy** (written R*)', 'A process in Di can copy the right R within the same column (to another domain for the same object). Variants: *transfer* (copy and remove from the original) and limited copy (copy R without the *)'],
        ['**Owner**', 'If access(i, j) includes *owner*, a process in Di can add and remove any right in column j'],
        ['**Control**', 'If access(i, j) includes *control* (and Dj is a domain), a process in Di can **remove** any right from row j'],
      ] } },
      'These let the protection state change dynamically while keeping the changes controlled; e.g. a file owner grants read to a teammate (owner right), or a supervisor domain revokes rights from a sub-domain (control right). Unrestricted copying is limited to avoid the "confinement problem" (information leaking out of a domain).',
    ],
    sources: [`${TB} §14.4`],
  },

  'os-access-control-right': {
    blocks: [
      'The **control** right applies only to **domain objects** in the access matrix. If access(i, j) contains *control*, a process executing in domain **Di can remove any access right from row j** (i.e. from domain Dj).',
      'Example: if D2 has *control* over D4, a process in D2 can revoke D4\'s *read* right on file F1 or its *print* right on the printer.',
      { table: { head: ['Domain', 'F1', 'F2', 'Printer', 'D4'], rows: [['D2', '', '', 'print', 'control'], ['D4', 'read, write', 'read', 'print', '']] } },
      'Purpose: lets a supervisory domain manage and restrict the rights of subordinate domains, complementing the *copy* and *owner* rights (which work on columns). Together with *switch*, they make the access matrix a dynamic protection model.',
    ],
    sources: [`${TB} §14.4`],
  },

  'os-capability-lists': {
    blocks: [
      'With capabilities, each **domain** has a list of ⟨object, rights⟩ pairs; a process presents a capability to access an object.',
      { compare: [
        { title: 'Strengths', items: ['**Efficient access checks**: possession of the capability is enough; no list search on each access', 'Rights for a domain are **localised** in one list — easy to see what a process can do', 'Supports **least privilege** naturally: a process gets exactly the capabilities it needs', 'Easy to pass rights (delegation) by giving a capability'] },
        { title: 'Weaknesses', items: ['**Revocation is hard**: capabilities are spread across many domains; finding and invalidating them all is difficult (solutions: re-acquisition, back-pointers, indirection, keys)', 'Hard to answer "who can access object X?" (must scan every domain)', 'Capabilities must be **protected** from forgery/tampering — needs OS-managed lists or tagged/segregated memory', 'Uncontrolled copying of capabilities can leak rights'] },
      ] },
    ],
    sources: [`${TB} §14.5.3, §14.7`, "OS Nov '25 paper Q15(b)"],
  },

  'os-password-leak': {
    blocks: [
      'Yes — a simple method is to **tell the user when and from where the account was last used**.',
      { ul: [
        'At each login, display "Last login: Mon 3 Nov 10:42 from 10.0.3.17". If the user didn\'t log in then (or from that place), the password has been compromised. Unix `lastlog` and banking sites use this.',
        'Keep an **audit log** of successful and failed logins; alert on logins at unusual times/places, many failed attempts, or two simultaneous sessions.',
        '**Notify** the user by e-mail/SMS on every new login or password change.',
        'Plant **honey accounts / honeytokens**: any use of a fake credential proves a leak.',
      ] },
      'It is not foolproof — an attacker who logs in just after the user, from the same place, may go unnoticed — so it should be combined with password ageing, salted hashes and two-factor authentication.',
    ],
    sources: [`${TB} §15.5, Exercise 15.x`, 'OS Dec \'23 paper Q12(a)'],
  },

  'os-logging-auditing': {
    blocks: [
      { compare: [
        { title: 'Logging', items: ['**Recording** of security-relevant events as they happen: logins and logouts, failed authentications, file accesses, privilege use, configuration changes, errors', 'Done automatically and continuously by the OS and services (syslog, Windows Event Log, auditd)', 'Produces raw records with timestamps, user, event, outcome'] },
        { title: 'Auditing', items: ['**Systematic review and analysis** of the logs (and settings) to check compliance with security policy and to detect intrusions or misuse', 'Done periodically or on demand by administrators/tools (log analysers, SIEM)', 'Produces findings, reports and corrective actions'] },
      ] },
      'In short, logging collects evidence; auditing examines it. Logging without auditing is useless, and auditing is impossible without logs.',
      { h: 'Good practice' },
      { ul: ['Protect logs from tampering: append-only storage, remote log servers, hashing/signing.', 'Log enough but not too much (performance and storage).', 'Synchronise clocks so events can be correlated.'] },
      { h: 'Role in recovery' },
      'Logs and audits reveal **what happened, when and through which account**, help find the vulnerability that was exploited, determine what data was affected, and support restoring from backups and legal action.',
    ],
    sources: [`${TB} §15.6.3`, "OS Jun '24 (AIML) paper"],
  },
}
