// Hand-drawn SVG diagrams for things the notes don't illustrate (or illustrate wrongly).
// Keys are matched by scripts/check-content.mjs — keep one per line in the form  'id': {
import { TcpHandshake, TcpRelease, SlidingWindow, DnsResolution } from './network.jsx'
import { SixHats, AffinityDiagram, ValuePropositionCanvas } from './design.jsx'
import { ElbowChart } from './data.jsx'

export const svgDiagrams = {
  'tcp-handshake': { Component: TcpHandshake, caption: 'TCP three-way handshake with sequence numbers and connection states.' },
  'tcp-release': { Component: TcpRelease, caption: 'TCP connection release: each side sends FIN and gets an ACK; the side that closes first waits in TIME_WAIT.' },
  'sliding-window': { Component: SlidingWindow, caption: 'The sender\'s view of the byte stream and the sliding window.' },
  'elbow': { Component: ElbowChart, caption: 'Elbow method: plot WCSS against k and pick the k where the curve bends (adding more clusters stops helping much).' },
  'six-hats': { Component: SixHats, caption: 'Edward de Bono\'s Six Thinking Hats: everyone wears the same hat at the same time.' },
  'affinity': { Component: AffinityDiagram, caption: 'Affinity diagram: each observation goes on a sticky note, then similar notes are clustered and each cluster gets a theme heading.' },
  'value-prop': { Component: ValuePropositionCanvas, caption: 'Value proposition canvas: match what you offer (left) to what the customer needs (right).' },
  'dns-resolution': { Component: DnsResolution, caption: 'Typical DNS lookup: recursive between your PC and the local server, iterative from the local server to root, TLD and authoritative servers.' },
}
