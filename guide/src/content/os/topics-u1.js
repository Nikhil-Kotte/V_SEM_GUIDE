// Operating Systems, Unit I: introduction and OS architectures. Keys are syllabus ids.
export default {
  'os.u1.system-overview': {
    oneLine: 'A computer system is hardware, the operating system, application programs and users; the OS sits between hardware and programs and manages the CPU, memory, storage and devices.',
    blocks: [
      { stack: ['**Users** (people, other machines)', '**Application programs** (browser, compiler, games)', '**Operating system** (controls and coordinates the hardware)', '**Hardware** (CPU, memory, I/O devices)'], label: 'Components of a computer system, top to bottom' },
      { h: 'How the hardware works together' },
      { ul: [
        'One or more **CPUs** and **device controllers** share a common **bus** to memory.',
        'Each device controller has a local **buffer**; a **device driver** in the OS talks to it.',
        'When a device finishes, it raises an **interrupt**; the CPU stops, runs the interrupt service routine (found through the **interrupt vector**), then resumes.',
        'A **trap** (exception) is a software-generated interrupt caused by an error (divide by zero) or a request for an OS service (system call).',
        '**DMA** (direct memory access) moves whole blocks between a device and memory with one interrupt per block, not per byte.',
      ] },
      { h: 'Storage hierarchy' },
      { stack: ['Registers (fastest, smallest, most costly)', 'Cache', 'Main memory (RAM)', 'Solid-state disk / non-volatile memory', 'Hard disk', 'Optical disk, magnetic tape (slowest, largest, cheapest)'], label: 'Storage hierarchy, fastest at the top' },
      'Going down: **speed falls**, **size grows**, **cost per byte falls**. Registers, cache and RAM are **volatile** (lose data without power).',
      { h: 'Dual-mode operation' },
      'A **mode bit** in hardware separates **kernel mode** (0) from **user mode** (1). **Privileged instructions** (I/O, timer, interrupt control) run only in kernel mode. A system call switches to kernel mode; returning switches back. This protects the OS from faulty or malicious programs. A **timer** interrupts a program that runs too long, so the OS regains control.',
      { h: 'Types of computer systems by processors' },
      { table: { head: ['Type', 'Idea'], rows: [
        ['Single-processor', 'One general-purpose CPU'],
        ['Multiprocessor (tightly coupled)', 'Several CPUs share memory and clock; more throughput, economy of scale, reliability. **Symmetric (SMP)**: every CPU runs OS tasks; **asymmetric**: one master CPU'],
        ['Clustered (loosely coupled)', 'Separate computers joined by a network; high availability if one fails'],
      ] } },
    ],
    terms: [['Interrupt', 'A signal from hardware that makes the CPU pause and run a handler.'], ['Trap', 'A software interrupt caused by an error or a system call request.'], ['Kernel mode', 'The privileged CPU mode in which the OS runs.'], ['DMA', 'Direct memory access: a device transfers a block to memory without the CPU copying each byte.']],
    exam: 'Draw the four-layer view of a computer system and the storage hierarchy pyramid, explain interrupts and dual-mode operation with the mode-bit diagram.',
    revise: ['Users, applications, OS, hardware', 'Interrupt = hardware; trap = software', 'Mode bit: 0 kernel, 1 user'],
  },

  'os.u1.functions': {
    oneLine: 'An operating system manages processes, memory, storage, files, I/O devices and security, and gives users a convenient way to run programs.',
    blocks: [
      'An OS has two goals: **convenience** for the user and **efficient use** of the hardware. It acts as a **resource allocator** and a **control program**.',
      { tree: { root: 'Functions of an OS', kids: ['Process management', 'Memory management', 'File management', 'Storage (disk) management', 'I/O device management', 'Protection and security', 'User interface'] } },
      { table: { head: ['Function', 'What the OS does'], rows: [
        ['Process management', 'Create and delete processes, schedule them, suspend and resume, provide synchronisation and communication, handle deadlock'],
        ['Memory management', 'Track which memory is used by whom, decide which process gets memory, allocate and free it'],
        ['File management', 'Create and delete files and directories, map files to storage, back them up'],
        ['Storage management', 'Free-space management, storage allocation, disk scheduling'],
        ['I/O management', 'Device drivers, buffering, caching, spooling'],
        ['Protection and security', 'Control access to resources, defend against attacks'],
      ] } },
      { h: 'User view vs system view' },
      { compare: [
        { title: "User's view", items: ['Ease of use and performance', 'For a PC: one user, convenient', 'For a phone: touch, battery life'] },
        { title: "System's view", items: ['Resource allocator: shares CPU, memory, I/O fairly', 'Control program: prevents errors and misuse'] },
      ] },
      { h: 'Multiprogramming and time-sharing' },
      { compare: [
        { title: 'Multiprogramming', items: ['Several jobs in memory', 'When one waits for I/O, the CPU runs another', 'Goal: keep the CPU busy'] },
        { title: 'Time-sharing (multitasking)', items: ['CPU switches between jobs very often', 'Each user feels they have the machine', 'Goal: fast response time'] },
      ] },
      { h: 'Spooling' },
      '**SPOOL** (Simultaneous Peripheral Operations On-Line) uses the disk as a large buffer: jobs are written to the disk queue and the slow device (a printer) takes them one by one, so the CPU need not wait. **Online** operation is under direct CPU control; **offline** operation happens without it.',
    ],
    terms: [['Resource allocator', 'The OS role of sharing CPU, memory and devices among programs.'], ['Multiprogramming', 'Keeping several jobs in memory so the CPU always has work.'], ['Time-sharing', 'Switching the CPU among users so fast that each gets quick response.'], ['Spooling', 'Queuing jobs on disk for a slow device such as a printer.']],
    exam: 'Define an OS, list its functions with one line each (process, memory, file, storage, I/O, security), then compare user and system views.',
    revise: ['Goals: convenience and efficiency', 'Process, memory, file, storage, I/O, security', 'Multiprogramming keeps CPU busy; time-sharing gives fast response'],
  },

  'os.u1.types': {
    oneLine: 'OS types differ by what they optimise: batch for throughput, time-sharing for response, real-time for deadlines, desktop for the user, mobile for battery and touch, distributed for many machines.',
    blocks: [
      { tree: { root: 'Types of operating systems', kids: ['Batch', 'Multiprogrammed', 'Time-sharing', 'Real-time (RTOS)', 'Desktop', 'Mobile', 'Distributed', 'Embedded'] } },
      { table: { head: ['Type', 'Main goal', 'Example'], rows: [
        ['Batch', 'Run similar jobs in groups without user interaction', 'Early IBM mainframes'],
        ['Time-sharing', 'Fast response for many users', 'Unix servers'],
        ['Real-time (RTOS)', 'Meet strict deadlines', 'VxWorks, FreeRTOS in cars and medical devices'],
        ['Desktop', 'Convenience for one user, rich GUI', 'Windows, macOS, Ubuntu'],
        ['Mobile', 'Touch interface, battery life, apps, sensors', 'Android, iOS'],
        ['Distributed', 'Many networked computers look like one system', 'Cluster and cloud systems'],
      ] } },
      { h: 'Real-time operating systems' },
      'An **RTOS** must finish tasks within a fixed time. **Hard real-time**: missing a deadline is a failure (airbag, pacemaker). **Soft real-time**: a missed deadline lowers quality but is tolerated (video streaming).',
      { ul: ['Features: priority-based pre-emptive scheduling, small and predictable kernel, fast interrupt handling, minimal latency.', 'Main difficulty when writing one: guaranteeing **timing**: every operation, including scheduling and interrupts, must have a known worst-case time.'] },
      { compare: [
        { title: 'General-purpose OS (GPOS)', items: ['Optimises average throughput and fairness', 'Response time not guaranteed', 'Large, feature-rich'] },
        { title: 'RTOS', items: ['Optimises meeting deadlines', 'Deterministic (predictable) timing', 'Small kernel, priority scheduling'] },
      ] },
      { h: 'Desktop vs mobile' },
      { compare: [
        { title: 'Desktop', items: ['Keyboard and mouse', 'Plenty of power and memory', 'Many windows at once'] },
        { title: 'Mobile', items: ['Touch, gestures, sensors (GPS, camera)', 'Battery and memory are limited', 'Apps sandboxed for security, one app in front'] },
      ] },
    ],
    terms: [['RTOS', 'A real-time OS that guarantees tasks finish within deadlines.'], ['Hard real-time', 'A missed deadline is a system failure.'], ['Soft real-time', 'A missed deadline reduces quality but is tolerated.'], ['Distributed OS', 'An OS that makes many networked computers act as one.']],
    exam: 'List the OS types with goal and example in a table, then compare GPOS and RTOS, and desktop and mobile.',
    revise: ['Batch, time-sharing, real-time, desktop, mobile, distributed', 'Hard vs soft real-time', 'RTOS = deterministic timing'],
  },

  'os.u1.distributions': {
    oneLine: 'An OS distribution packages a kernel with system software and applications; families like Windows, macOS, Linux (Ubuntu, Fedora, Debian), Android and iOS are released in numbered versions.',
    blocks: [
      'The **kernel** alone is not a usable system. A **distribution** (distro) adds a shell, libraries, a package manager, a desktop and applications.',
      { table: { head: ['Family', 'Examples of distributions and versions', 'Licence'], rows: [
        ['Linux', 'Ubuntu (22.04 LTS, 24.04 LTS), Fedora, Debian, Red Hat Enterprise Linux, Linux Mint', 'Open source (GPL)'],
        ['Windows', 'Windows 10, Windows 11, Windows Server', 'Proprietary'],
        ['macOS', 'Ventura, Sonoma, Sequoia', 'Proprietary (Darwin core is open)'],
        ['Android', 'Android 13, 14, 15 (Linux kernel)', 'Open source (AOSP) plus Google apps'],
        ['iOS', 'iOS 17, 18', 'Proprietary'],
      ] } },
      { h: 'Open-source vs closed-source' },
      { compare: [
        { title: 'Open source: advantages', items: ['Free to use and change', 'Many people review the code, so bugs are found', 'Students and researchers can learn from it'] },
        { title: 'Open source: disadvantages', items: ['Support may be informal', 'Attackers can read the code too', 'Hardware drivers sometimes missing'] },
      ] },
      'A company may see open source as a disadvantage (competitors read their changes), while a student, researcher or small business sees it as an advantage (free, customisable).',
      { h: 'iOS vs Android' },
      { compare: [
        { title: 'Similar', items: ['Layered architecture with a kernel at the base', 'App sandboxing and permissions', 'Touch UI frameworks and app stores'] },
        { title: 'Different', items: ['Android: Linux kernel, open source, Java/Kotlin apps on ART runtime', 'iOS: Darwin/XNU kernel, closed source, Swift/Objective-C apps', 'Android runs on many vendors\' phones; iOS only on Apple devices'] },
      ] },
    ],
    terms: [['Distribution', 'A kernel packaged with system tools and applications.'], ['LTS', 'Long Term Support: a version that gets updates for several years.'], ['AOSP', 'Android Open Source Project: the open-source base of Android.']],
    exam: 'Explain what a distribution is, give a table of OS families with versions, and compare open-source and closed-source systems.',
    revise: ['Distro = kernel + tools + apps', 'Linux distros: Ubuntu, Fedora, Debian, RHEL'],
  },

  'os.u1.microkernel': {
    oneLine: 'A microkernel keeps only the bare minimum (IPC, basic scheduling, low-level memory) in the kernel and runs everything else as user-space servers that talk by message passing.',
    blocks: [
      { stack: ['User space: applications, file server, device drivers, network server', '↕ message passing', 'Microkernel: inter-process communication, CPU scheduling, basic memory management', 'Hardware'], label: 'Microkernel structure' },
      'A user program that wants to read a file sends a **message** through the microkernel to the **file server**; the reply comes back as another message. The program and the service never call each other directly.',
      { compare: [
        { title: 'Advantages', items: ['Easy to extend: add a service without changing the kernel', 'Portable: small kernel to move to new hardware', 'Reliable and secure: a crashed driver does not crash the kernel'] },
        { title: 'Disadvantages', items: ['Slower: message passing and extra mode switches cost time', 'More complex design of services'] },
      ] },
      { h: 'Microkernel vs monolithic (macro) kernel' },
      { table: { head: ['', 'Monolithic', 'Microkernel'], rows: [
        ['What runs in kernel', 'Everything: file system, drivers, scheduler', 'Only IPC, scheduling, basic memory'],
        ['Speed', 'Fast (direct function calls)', 'Slower (messages)'],
        ['Reliability', 'One bug can crash all', 'Faults isolated in servers'],
        ['Examples', 'Linux, traditional Unix, MS-DOS', 'Mach, QNX, MINIX 3'],
      ] } },
    ],
    terms: [['Microkernel', 'A small kernel that provides only IPC, scheduling and basic memory management.'], ['Message passing', 'Processes communicate by sending and receiving messages through the kernel.'], ['Monolithic kernel', 'A kernel with all OS services in one large program in kernel space.']],
    exam: 'Draw the microkernel diagram (user-space servers above, small kernel below, messages between them), state its main advantage (extensibility) and its main drawback (performance), and compare with a monolithic kernel.',
    revise: ['Kernel keeps IPC, scheduling, basic memory', 'Services run in user space', 'Pro: extensible, reliable; con: slower'],
  },

  'os.u1.layered': {
    oneLine: 'The layered approach builds the OS as a stack of layers: layer 0 is hardware, the top layer is the user interface, and each layer uses only the services of the layers below it.',
    blocks: [
      { stack: ['Layer N: user interface', 'Layer N−1: user programs, I/O management', '…', 'Layer 2: memory management', 'Layer 1: CPU scheduling', 'Layer 0: hardware'], label: 'Layered OS' },
      { compare: [
        { title: 'Advantages', items: ['Simple to build and **debug** one layer at a time', 'Each layer hides its details from the layers above', 'Easy to verify correctness layer by layer'] },
        { title: 'Disadvantages', items: ['Hard to decide the order of layers', 'Each layer adds overhead, so it is slower', 'Components that depend on each other do not fit a strict order'] },
      ] },
      { h: 'When layering is unclear (asked)' },
      'The **memory manager** needs the **disk driver** to page memory in and out, but the **disk driver** needs memory for its buffers. Which goes lower? Similarly, the scheduler needs to know about processes waiting for I/O, and the I/O system needs the scheduler. Tightly coupled parts like these make strict layering hard.',
      { h: 'Other structures (for comparison)' },
      { ul: ['**Simple structure** (MS-DOS): no clear separation; applications could access hardware directly.', '**Monolithic** (original Unix): kernel and system programs in two big pieces.', '**Modular** (Linux, Solaris): a core kernel plus loadable kernel modules.', '**Hybrid** (Windows, macOS, iOS, Android): mixes these ideas.'] },
    ],
    terms: [['Layered approach', 'An OS design where each layer uses only the services of the layers below.'], ['Layer 0', 'The hardware, at the bottom of a layered OS.']],
    exam: 'Draw the layered OS as rings or a stack, give the main advantage (simple construction and debugging) and the disadvantages, and give one example of tightly coupled components.',
    revise: ['Each layer uses only lower layers', 'Pro: easy debugging; con: overhead, hard to order'],
  },

  'os.u1.kernel-approaches': {
    oneLine: 'Kernels are built in four main ways: monolithic (everything in one), microkernel (minimum in kernel), modular (core plus loadable modules) and hybrid (a mix), each trading speed against safety and flexibility.',
    blocks: [
      { tree: { root: 'Kernel approaches', kids: ['Monolithic: Linux, Unix', 'Microkernel: Mach, QNX', 'Modular: Linux modules, Solaris', 'Hybrid: Windows, macOS, iOS'] } },
      { table: { head: ['Approach', 'Idea', 'Strength', 'Weakness'], rows: [
        ['Monolithic', 'All services run in kernel space as one program', 'Fast', 'Hard to maintain; a bug can crash everything'],
        ['Microkernel', 'Only essentials in kernel; services as user processes', 'Reliable, extensible', 'Message-passing overhead'],
        ['Modular', 'Core kernel loads modules (drivers, file systems) at run time', 'Flexible and still fast', 'Modules run in kernel space, so a bad one can crash it'],
        ['Hybrid', 'Mostly monolithic for speed, with some microkernel ideas', 'Balance of speed and structure', 'Complex'],
      ] } },
      { h: 'Why the kernel matters' },
      'The kernel is the part of the OS always in memory and running in kernel mode. It manages processes, memory, devices and system calls, and enforces protection. Its design decides how fast, reliable and secure the whole system is.',
      { h: 'Examples' },
      { ul: ['**Mac OS X / iOS**: Darwin, which combines the Mach microkernel with BSD Unix parts (hybrid).', '**Android**: a modified Linux kernel, with libraries, the Android runtime (ART) and the application framework on top.', '**Windows**: hybrid, with a layered structure and subsystems in user mode.'] },
      { h: 'Linux loadable kernel modules' },
      'Linux can load and unload modules while running. Its **conflict-resolution mechanism** has three goals: stop modules from clashing over the same hardware, stop **autoprobe** drivers from interfering with existing devices, and resolve conflicts between drivers that want the same hardware resource.',
    ],
    terms: [['Kernel', 'The core of the OS that always runs in kernel mode.'], ['Loadable kernel module', 'Code that can be added to or removed from a running kernel.'], ['Hybrid kernel', 'A kernel that mixes monolithic and microkernel ideas.']],
    exam: 'Compare monolithic, microkernel, modular and hybrid kernels in a table with an example each, and state why the kernel is important.',
    revise: ['Monolithic: fast, fragile', 'Micro: safe, slower', 'Modular: core + modules', 'Hybrid: Windows, macOS'],
  },

  'os.u1.unix-arch': {
    oneLine: 'Unix/Linux is built as hardware, kernel, shell and utilities, and user applications; the kernel is monolithic but modular, and everything is accessed through system calls and files.',
    blocks: [
      { stack: ['Users and applications', 'Shell and utilities (bash, ls, gcc)', 'System call interface', 'Kernel: process management, memory, file system, device drivers, networking', 'Hardware'], label: 'Unix/Linux architecture' },
      { h: 'Design ideas' },
      { ul: ['**Everything is a file**: devices, pipes and sockets appear as files.', 'Small tools that do one job well, joined by **pipes** (ls | grep txt).', 'Written mostly in **C**, so it is portable.', 'Multi-user and multitasking from the start.'] },
      { h: 'Components of a Linux system (asked: list four)' },
      { ol: ['**Kernel**: manages hardware and core services.', '**System libraries** (glibc): functions programs call instead of making raw system calls.', '**System utilities**: programs for management tasks (init/systemd, daemons).', '**Shell**: command interpreter between user and kernel.', '**User applications**.'] },
      { h: 'Android architecture (asked)' },
      { stack: ['Applications', 'Application framework (activity manager, content providers)', 'Libraries (SQLite, WebKit, OpenGL) and Android runtime (ART)', 'Hardware abstraction layer', 'Linux kernel (drivers, power management)'], label: 'Android, top to bottom' },
    ],
    terms: [['Shell', 'The command interpreter that reads user commands and asks the kernel to run them.'], ['System call interface', 'The boundary through which programs request kernel services.'], ['glibc', 'The GNU C library used by Linux programs.']],
    exam: 'Draw the Unix layers (hardware, kernel, shell and utilities, applications), list the components of a Linux system, and add the Android stack if asked.',
    revise: ['Hardware, kernel, system calls, shell, apps', 'Everything is a file; pipes join small tools'],
  },
}
