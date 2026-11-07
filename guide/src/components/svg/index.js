// Hand-drawn SVG diagrams for things the notes don't illustrate (or illustrate wrongly).
// Keys are matched by scripts/check-content.mjs — keep one per line in the form  'id': {
import { TcpHandshake, TcpRelease, SlidingWindow, DnsResolution } from './network.jsx'
import { SixHats, AffinityDiagram, ValuePropositionCanvas } from './design.jsx'
import { ElbowChart } from './data.jsx'
import { ObjectOrientedArchitecture } from './se.jsx'
import { LibDfd0, LibDfd1, LibDfd2, LibUseCase, LibClass, LibActivity, LibSequence, LibState, LibComponent, LibDeployment } from './lab-se.jsx'

export const svgDiagrams = {
  'tcp-handshake': { Component: TcpHandshake, caption: 'TCP three-way handshake with sequence numbers and connection states.' },
  'tcp-release': { Component: TcpRelease, caption: 'TCP connection release: each side sends FIN and gets an ACK; the side that closes first waits in TIME_WAIT.' },
  'sliding-window': { Component: SlidingWindow, caption: 'The sender\'s view of the byte stream and the sliding window.' },
  'elbow': { Component: ElbowChart, caption: 'Elbow method: plot WCSS against k and pick the k where the curve bends (adding more clusters stops helping much).' },
  'six-hats': { Component: SixHats, caption: 'Edward de Bono\'s Six Thinking Hats: everyone wears the same hat at the same time.' },
  'affinity': { Component: AffinityDiagram, caption: 'Affinity diagram: each observation goes on a sticky note, then similar notes are clustered and each cluster gets a theme heading.' },
  'value-prop': { Component: ValuePropositionCanvas, caption: 'Value proposition canvas: match what you offer (left) to what the customer needs (right).' },
  'se-arch-oo': { Component: ObjectOrientedArchitecture, caption: 'Object-oriented architecture: each component (object) encapsulates its data and the operations on it; components cooperate by message passing.' },
  'dns-resolution': { Component: DnsResolution, caption: 'Typical DNS lookup: recursive between your PC and the local server, iterative from the local server to root, TLD and authoritative servers.' },
  'lab-dfd0': { Component: LibDfd0, caption: 'Level 0 (context) DFD: the whole library system is one process; only the external entities and the data they exchange are shown.' },
  'lab-dfd1': { Component: LibDfd1, caption: 'Level 1 DFD: process 0 split into its main processes, with the data stores they read and write.' },
  'lab-dfd2': { Component: LibDfd2, caption: 'Level 2 DFD: process 2.0 "Issue book" broken into its detailed steps. Inputs and outputs still match Level 1 (balancing).' },
  'lab-usecase': { Component: LibUseCase, caption: 'Use case diagram: actors outside the system boundary, use cases (goals) inside, with «include» and «extend».' },
  'lab-class': { Component: LibClass, caption: 'Class diagram: classes with attributes and operations, inheritance (hollow triangle), and associations with multiplicities.' },
  'lab-activity': { Component: LibActivity, caption: 'Activity diagram with swimlanes: the workflow of borrowing a book, including a decision and parallel actions (fork/join).' },
  'lab-sequence': { Component: LibSequence, caption: 'Sequence diagram: objects across the top, messages in time order going down, with an alt fragment for the two outcomes.' },
  'lab-state': { Component: LibState, caption: 'State chart of one Book object: its states and the events that move it from one state to another.' },
  'lab-component': { Component: LibComponent, caption: 'Component diagram: the software parts, the interfaces they provide (○) and which components use them.' },
  'lab-deployment': { Component: LibDeployment, caption: 'Deployment diagram: hardware nodes, the artifacts deployed on them, and the communication paths between them.' },
}
