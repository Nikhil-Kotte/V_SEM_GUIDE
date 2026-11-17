// Hand-drawn SVG diagrams for things the notes don't illustrate (or illustrate wrongly).
// Keys are matched by scripts/check-content.mjs — keep one per line in the form  'id': {
import { SixHats, AffinityDiagram, ValuePropositionCanvas } from './design.jsx'
import { ElbowChart } from './data.jsx'
import { ObjectOrientedArchitecture } from './se.jsx'
import {
  OsSystemLayers, OsLayered, OsKernels, OsMsdos, OsUnix, OsStates, OsPcb, OsFork, OsSyscall, OsQueues, OsContextSwitch, OsGanttSjfMid, OsGanttSrtfMid, OsGanttFcfs, OsGanttRr, OsMultilevel, OsIpc, OsRpc, OsMemLayout, OsBinding, OsFragmentation, OsRaid, OsThreads, OsCriticalSection, OsDining, OsInode, OsSecurityLevels,
} from './os.jsx'

export const svgDiagrams = {
  'elbow': { Component: ElbowChart, caption: 'Elbow method: plot WCSS against k and pick the k where the curve bends (adding more clusters stops helping much).' },
  'six-hats': { Component: SixHats, caption: 'Edward de Bono\'s Six Thinking Hats: everyone wears the same hat at the same time.' },
  'affinity': { Component: AffinityDiagram, caption: 'Affinity diagram: each observation goes on a sticky note, then similar notes are clustered and each cluster gets a theme heading.' },
  'value-prop': { Component: ValuePropositionCanvas, caption: 'Value proposition canvas: match what you offer (left) to what the customer needs (right).' },
  'se-arch-oo': { Component: ObjectOrientedArchitecture, caption: 'Object-oriented architecture: each component (object) encapsulates its data and the operations on it; components cooperate by message passing.' },
  'os-system-layers': { Component: OsSystemLayers, caption: "Abstract view of the components of a computer system: users, application programs, the operating system and the hardware." },
  'os-layered': { Component: OsLayered, caption: "Layered approach: the OS is broken into layers; layer 0 is the hardware and each layer uses only the services of the layer below." },
  'os-kernels': { Component: OsKernels, caption: "Kernel approaches: everything in kernel mode (monolithic), a minimal kernel with services as user processes (microkernel), or a mix (hybrid)." },
  'os-msdos': { Component: OsMsdos, caption: "MS-DOS structure: layers exist, but application programs can reach the hardware directly." },
  'os-unix': { Component: OsUnix, caption: "UNIX/Linux architecture: hardware, kernel, shell and utilities, and user applications." },
  'os-states': { Component: OsStates, caption: "Diagram of process states (five-state model)." },
  'os-pcb': { Component: OsPcb, caption: "The process control block (PCB): everything the OS keeps about one process." },
  'os-fork': { Component: OsFork, caption: "Process creation with fork(), a new program with exec(), and the parent collecting the child with wait()." },
  'os-syscall': { Component: OsSyscall, caption: "How a user application invokes the open() system call." },
  'os-queues': { Component: OsQueues, caption: "Queueing-diagram representation of process scheduling." },
  'os-context-switch': { Component: OsContextSwitch, caption: "A context switch from process P0 to P1 and back." },
  'os-gantt-sjf-mid': { Component: OsGanttSjfMid, caption: "Mid-1 question 6(a): non-preemptive SJF." },
  'os-gantt-srtf-mid': { Component: OsGanttSrtfMid, caption: "Mid-1 question 6(a): SRTF (preemptive SJF)." },
  'os-gantt-fcfs': { Component: OsGanttFcfs, caption: "FCFS with burst times 24, 3, 3." },
  'os-gantt-rr': { Component: OsGanttRr, caption: "Round robin with time quantum 4 on the same processes." },
  'os-multilevel': { Component: OsMultilevel, caption: "Multilevel queue scheduling." },
  'os-ipc': { Component: OsIpc, caption: "Communication models: (a) shared memory, (b) message passing." },
  'os-rpc': { Component: OsRpc, caption: "Execution of a remote procedure call through stubs and the RPC runtime." },
  'os-mem-layout': { Component: OsMemLayout, caption: "Layout of a process in memory." },
  'os-binding': { Component: OsBinding, caption: "Multistep processing of a user program and when addresses are bound." },
  'os-fragmentation': { Component: OsFragmentation, caption: "Internal versus external fragmentation." },
  'os-raid': { Component: OsRaid, caption: "RAID levels 0, 1 and 5." },
  'os-threads': { Component: OsThreads, caption: "Single-threaded and multithreaded processes." },
  'os-critical-section': { Component: OsCriticalSection, caption: "General structure of a typical process in the critical-section problem." },
  'os-dining': { Component: OsDining, caption: "The dining-philosophers problem." },
  'os-inode': { Component: OsInode, caption: "The UNIX inode." },
  'os-security-levels': { Component: OsSecurityLevels, caption: "Levels at which security measures must be taken." },
}
