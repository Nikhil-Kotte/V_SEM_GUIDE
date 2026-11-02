// Hand-drawn SVG diagrams for things the notes don't illustrate (or illustrate wrongly).
// Keys are matched by scripts/check-content.mjs — keep one per line in the form  'id': {
import { TcpHandshake, TcpRelease, SlidingWindow, DnsResolution } from './network.jsx'

export const svgDiagrams = {
  'tcp-handshake': { Component: TcpHandshake, caption: 'TCP three-way handshake with sequence numbers and connection states.' },
  'tcp-release': { Component: TcpRelease, caption: 'TCP connection release: each side sends FIN and gets an ACK; the side that closes first waits in TIME_WAIT.' },
  'sliding-window': { Component: SlidingWindow, caption: 'The sender\'s view of the byte stream and the sliding window.' },
  'dns-resolution': { Component: DnsResolution, caption: 'Typical DNS lookup: recursive between your PC and the local server, iterative from the local server to root, TLD and authoritative servers.' },
}
