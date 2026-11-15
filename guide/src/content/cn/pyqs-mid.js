import { Q } from '../pyq-helpers.js'

// Questions from the two CN class tests (mid-terms) of this semester, PYQs/CN MIDS.pdf:
// Class Test I (3 Sep 2026) and Class Test II (6 Nov 2026), in their original wording.
// Class-test questions that were near-identical to an older paper's question are not repeated here:
// the class test is added to that question's papers instead (see pyqs-u12.js and pyqs.js).
export default [
  // ---- Class Test I ----
  Q('cn-mid-ecc-list', 'cn.u2.error-correction', 'List the various error correction codes.', ['cn-ct1:2']),
  Q('cn-num-mesh12', 'cn.u1.topologies', 'A full mesh network has 12 computers. Find the number of links and the number of ports required.', ['cn-ct1:3'], { numerical: true }),
  Q('cn-num-crc-1101011011', 'cn.u2.error-detection', 'Given data message 1101011011 and generator polynomial x⁴ + x + 1, find the cyclic redundancy check (CRC) bits and the final codeword to be transmitted.', ['cn-ct1:4'], { numerical: true }),
  Q('cn-num-dijkstra-ct1', 'cn.u3.shortest-path', 'Find the shortest paths from the source node A to all the destinations in the given network (links: A–B 4, A–C 5, B–C 11, B–D 9, B–E 7, C–E 3, D–E 13, D–F 2, E–F 6).', ['cn-ct1:3'], { numerical: true }),
  // ---- Class Test II ----
  Q('cn-mid-qos-priority', 'cn.u3.qos', 'How does QoS ensure the prioritisation of specific types of traffic on a network?', ['cn-ct2:2']),
  Q('cn-mid-piggyback', 'cn.u2.sliding-window', 'What is piggybacking? How does it improve network efficiency?', ['cn-ct2:2']),
  Q('cn-mid-dns-ip', 'cn.u5.dns', 'A website is accessible through its IP address but not through its domain name. Identify the service responsible for resolving this issue and state its role.', ['cn-ct2:2']),
  Q('cn-mid-leaky-vs-token', 'cn.u3.qos', 'Compare the leaky bucket and token bucket algorithms based on their traffic-handling capabilities.', ['cn-ct2:3']),
  Q('cn-mid-3way', 'cn.u4.tcp-connect', 'Explain the three-way handshake mechanism used by TCP to establish a connection. Illustrate the sequence of segments with a neat diagram.', ['cn-ct2:4']),
  Q('cn-mid-mime', 'cn.u5.formats', 'Describe the role of MIME in supporting multimedia attachments in electronic mail.', ['cn-ct2:3']),
  Q('cn-mid-nvt', 'cn.u5.telnet', 'Describe how the Network Virtual Terminal (NVT) enables communication between different computer systems.', ['cn-ct2:4']),
  Q('cn-num-dv-ct2', 'cn.u3.distance-vector', 'Four routers with link costs A–B 2, A–C 5, B–C 1, B–D 4, C–D 2. Apply the distance vector routing algorithm to find the shortest distance from router A to all other routers. Construct the final routing table at A and identify the next hop for reaching D from A.', ['cn-ct2:3'], { numerical: true }),
]
