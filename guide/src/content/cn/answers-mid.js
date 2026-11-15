// Model answers for the CN class-test (mid-term) questions that had none, written for the marks given.
// Numericals were computed by script (CRC by mod-2 division, Dijkstra and distance vector by search)
// and checked by hand. The 2-mark class-test questions take their answers from bank-2m.js.
const N = 'CN unit notes'
const TB = 'Tanenbaum, Computer Networks 5e'
const FZ = 'Forouzan, Data Communications and Networking'
const MID = 'CN class tests (PYQs/CN MIDS.pdf)'

export default {
  'cn-osi-vs-tcpip': {
    blocks: [
      'The **OSI model** is ISO\'s seven-layer reference model for designing open systems; the **TCP/IP model** is the four-layer model of the protocols the Internet actually uses.',
      { img: 'cn-osi-tcpip' },
      { table: { head: ['Basis', 'OSI model', 'TCP/IP model'], rows: [
        ['Layers', '7: physical, data link, network, transport, session, presentation, application', '4: host-to-network, internet, transport, application'],
        ['Developed by', 'ISO (International Standards Organization)', 'US Department of Defense (ARPANET)'],
        ['Approach', 'Model defined first, protocols later', 'Protocols came first; the model describes them'],
        ['Concepts', 'Clearly separates service, interface and protocol', 'No clear separation'],
        ['Network layer', 'Connection-oriented and connectionless', 'Connectionless only (IP)'],
        ['Transport layer', 'Connection-oriented only', 'Both: TCP (connection-oriented) and UDP (connectionless)'],
        ['Session and presentation', 'Separate layers', 'Merged into the application layer'],
        ['Physical and data link', 'Separate layers', 'One host-to-network layer'],
        ['Generality', 'General: can describe other networks', 'Specific to the TCP/IP suite'],
        ['Use', 'Reference and teaching model', 'Used on the real Internet'],
      ] } },
      { tip: 'For 4 marks: draw the two stacks side by side with mapping lines and write at least six rows of differences.' },
    ],
    sources: [N, `${TB} §1.4`, MID],
  },

  'cn-switching-three': {
    blocks: [
      'Switching connects devices through intermediate **switches** instead of linking every pair directly.',
      { img: 'cn-switching' },
      { ul: [
        '**Circuit switching**: a **dedicated path** is reserved through the switches before any data flows. Three phases: setup, data transfer, teardown. Data flows continuously and in order with a fixed delay, but the reserved bandwidth is wasted when idle. Used by the telephone network.',
        '**Packet switching (datagram)**: data is split into packets, each carrying the **full destination address** and routed **independently**. No setup; packets may take different routes and arrive out of order. Bandwidth is shared on demand. Used by the Internet (IP).',
        '**Virtual circuit switching**: a **path is set up first**, then data is sent as packets that all follow it, each carrying a short **VC identifier**. Packets arrive in order; resources can be reserved. Used by ATM and Frame Relay.',
      ] },
      { table: { head: ['Point', 'Circuit', 'Packet (datagram)', 'Virtual circuit'], rows: [
        ['Setup phase', 'Yes', 'No', 'Yes'],
        ['Dedicated path', 'Yes', 'No', 'No (shared links, fixed route)'],
        ['Header per packet', 'None', 'Full destination address', 'Small VC number'],
        ['Routing', 'Once per call', 'Each packet', 'Once per connection'],
        ['Order', 'In order', 'May be out of order', 'In order'],
        ['Bandwidth use', 'Wasteful when idle', 'Efficient', 'Efficient'],
        ['Node failure', 'Call lost', 'Packets rerouted', 'VCs through it lost'],
        ['Example', 'Telephone', 'Internet', 'ATM, Frame Relay'],
      ] } },
    ],
    sources: [N, `${FZ} ch. 8`, `${TB} §2.6, §5.1`, MID],
  },

  'cn-guided-all': {
    blocks: [
      '**Guided media** carry signals along a physical conductor that directs and contains them: **twisted-pair cable**, **coaxial cable** and **fibre-optic cable**.',
      { img: 'cn-cables' },
      { ul: [
        '**Twisted pair**: two insulated copper wires twisted together. Twisting makes noise affect both wires equally, so it cancels at the receiver. **UTP** (unshielded; telephone lines, Ethernet LANs with RJ45) and **STP** (with a metal foil or braid shield). Cheap and flexible, but limited bandwidth and distance.',
        '**Coaxial cable**: a central copper conductor, an insulating layer, a braided outer conductor (shield) and a plastic jacket. Higher bandwidth and better noise immunity than twisted pair. RG-59 for cable TV, RG-58 for thin Ethernet; BNC connectors.',
        '**Fibre-optic cable**: a glass core surrounded by cladding of lower refractive index; light is kept in the core by **total internal reflection**. Modes: multimode step-index, multimode graded-index, single-mode. Very high bandwidth, low loss, immune to electromagnetic interference, but costly and harder to install.',
      ] },
      { img: 'cn-fiber' },
    ],
    sources: [N, `${FZ} ch. 7`, MID],
  },

  'cn-nl-design': {
    blocks: [
      'The network layer delivers packets from the source host to the destination host. Its design issues are:',
      { ol: [
        '**Store-and-forward packet switching**: a host sends a packet to the nearest router; each router stores the whole packet, verifies its checksum, then forwards it to the next router until it reaches the destination.',
        '**Services provided to the transport layer**, designed so that (i) they are independent of the router technology, (ii) the transport layer is shielded from the number, type and topology of routers, and (iii) network addresses use a uniform numbering plan across LANs and WANs.',
        '**Implementation of connectionless service**: packets (datagrams) are routed independently using each router\'s table of destination → outgoing line (datagram subnet).',
        '**Implementation of connection-oriented service**: a virtual circuit is set up first; each packet carries a VC identifier, and routers keep a table entry per VC (virtual-circuit subnet).',
        '**Comparison of the two**: datagram subnets need no setup and survive router failures; VC subnets need setup and router state but make QoS and congestion control easier.',
      ] },
      { flow: ['Host H1', 'Router A (store, check, forward)', 'Router C', 'Router F', 'Host H2'] },
    ],
    sources: [N, `${TB} §5.1`, MID],
  },

  'cn-gbn-operation': {
    blocks: [
      'In a **sliding window protocol** every frame has a sequence number (0 to 2ⁿ − 1). The sender may have a **window** of several unacknowledged frames outstanding at once (pipelining) instead of waiting after every frame.',
      '**Go-Back-N** (Protocol 5): the sender\'s window is up to **2ⁿ − 1** frames; the **receiver\'s window is 1**, so it accepts frames only in order.',
      { img: 'cn-gbn' },
      { steps: [
        'The sender sends frames 0, 1, 2, … without waiting, keeping a copy and a timer for each, while fewer than 2ⁿ − 1 are outstanding.',
        'The receiver accepts each frame that arrives in order and acknowledges it (cumulative ACK).',
        'If frame 2 is lost, frames 3, 4, 5 arrive **out of order**: the receiver **discards** them and does not acknowledge them.',
        'Frame 2\'s timer expires; the sender **goes back** and retransmits frame 2 and **every frame after it** (2, 3, 4, 5).',
        'As ACKs arrive, the window slides forward and new frames can be sent.',
      ] },
      { ul: ['**Advantage**: simple receiver with one buffer; much better line use than stop-and-wait.', '**Disadvantage**: one error forces retransmission of many good frames, wasting bandwidth on noisy links.', 'Window ≤ 2ⁿ − 1 so that an old acknowledgement cannot be mistaken for a new one.'] },
    ],
    sources: [N, `${TB} §3.4.2`, MID],
  },

  'cn-num-mesh12': {
    blocks: [
      'In a full mesh, every device has a dedicated link to every other device.',
      { formula: 'Links = n(n − 1) / 2        Ports per device = n − 1' },
      { steps: ['n = 12.', 'Links = 12 × 11 / 2 = 132 / 2 = **66 links (cables)**.', 'Ports per computer = 12 − 1 = **11 ports**.', 'Total ports in the network = 12 × 11 = 132 (each link uses two ports).'] },
      '**Answer: 66 links, and 11 I/O ports on each computer.**',
    ],
    sources: [N, `${FZ} ch. 1`, MID],
  },

  'cn-num-crc-1101011011': {
    blocks: [
      'Generator x⁴ + x + 1 = **10011** (degree r = 4), so append **four 0s** to the data: 1101011011 → **11010110110000**, and divide by 10011 using modulo-2 (XOR) division.',
      { table: { head: ['Step', 'Bits under the divisor', 'XOR with', 'Result'], rows: [
        ['1', '11010', '10011', '01001'],
        ['2', '10011', '10011', '00000'],
        ['3', '00001', '00000', '00001'],
        ['4', '00010', '00000', '00010'],
        ['5', '00101', '00000', '00101'],
        ['6', '01011', '00000', '01011'],
        ['7', '10110', '10011', '00101'],
        ['8', '01010', '00000', '01010'],
        ['9', '10100', '10011', '00111'],
        ['10', '01110', '00000', '01110'],
      ] } },
      'At each step the leftmost bit decides: if it is 1, XOR with 10011; if 0, XOR with 00000. Then drop the leading bit and bring down the next bit. Quotient = 1100001010.',
      { ul: ['**CRC (remainder) = 1110**.', 'Codeword to transmit = data followed by the CRC = 1101011011 **1110** = **11010110111110**.', 'Check: dividing 11010110111110 by 10011 gives remainder **0000**, so the receiver accepts it.'] },
    ],
    sources: [N, `${TB} §3.2.2 (this is the textbook's example)`, MID],
  },

  'cn-num-dijkstra-ct1': {
    blocks: [
      'Apply **Dijkstra\'s algorithm** from A: make the smallest tentative label permanent each round and relabel its neighbours.',
      { img: 'cn-dijkstra-ct1' },
      { table: { head: ['Step', 'Permanent node', 'Distance', 'Via', 'Neighbours relabelled'], rows: [
        ['1', 'A', '0', '-', 'B = 4 (A), C = 5 (A)'],
        ['2', 'B', '4', 'A', 'D = 4 + 9 = 13 (B), E = 4 + 7 = 11 (B); C stays 5 (4 + 11 = 15)'],
        ['3', 'C', '5', 'A', 'E = 5 + 3 = 8 (C), better than 11'],
        ['4', 'E', '8', 'C', 'F = 8 + 6 = 14 (E); D stays 13 (8 + 13 = 21)'],
        ['5', 'D', '13', 'B', 'F stays 14 (13 + 2 = 15)'],
        ['6', 'F', '14', 'E', '-'],
      ] } },
      { table: { head: ['Destination', 'Shortest distance', 'Path'], rows: [['B', '4', 'A → B'], ['C', '5', 'A → C'], ['D', '13', 'A → B → D'], ['E', '8', 'A → C → E'], ['F', '14', 'A → C → E → F']] } },
    ],
    sources: [N, `${TB} §5.2.2`, MID],
  },

  'cn-mid-leaky-vs-token': {
    blocks: [
      { table: { head: ['Basis', 'Leaky bucket', 'Token bucket'], rows: [
        ['Idea', 'Packets enter a bucket (queue) and leave through a hole at a **constant rate**', 'Tokens are added to a bucket at rate R; a packet is sent only by **spending a token**'],
        ['Output rate', 'Always constant, whatever the input', 'Can be bursty: up to the bucket size B at once, then rate R'],
        ['Bursts', 'Smoothed out completely; a burst cannot be sent faster', 'Allowed: an idle host can **save tokens** and later send a burst of up to B'],
        ['When the bucket is full', '**Packets** are discarded', '**Tokens** are discarded; packets are not lost (they wait for tokens)'],
        ['Idle periods', 'Do not help later traffic', 'Build up credit for later bursts'],
        ['Flexibility', 'Rigid', 'More flexible, better for bursty data traffic'],
        ['Burst length', '-', 'S = B / (M − R), M = line rate'],
      ] } },
      '**Conclusion**: the leaky bucket gives a perfectly smooth, constant-rate output but wastes capacity and drops bursts; the token bucket allows controlled bursts and never drops packets for lack of credit, so it suits real (bursty) traffic better. They are often combined: a token bucket followed by a leaky bucket to cap the peak rate.',
    ],
    sources: [N, `${TB} §5.4.2`, MID],
  },

  'cn-mid-3way': {
    blocks: [
      'TCP establishes a connection with a **three-way handshake**, so that both sides agree on their **initial sequence numbers** and old duplicate segments cannot create a false connection.',
      { img: 'tcp-handshake' },
      { steps: [
        'The server does a **passive open** (LISTEN, ACCEPT) and waits. State: LISTEN.',
        '**Segment 1 (SYN)**: the client does an active open (CONNECT) and sends SYN = 1, ACK = 0, **seq = x** (its initial sequence number). State: SYN_SENT.',
        '**Segment 2 (SYN + ACK)**: if a process is listening on that port, the server replies SYN = 1, ACK = 1, **seq = y, ack = x + 1**. State: SYN_RCVD. (If not, it replies RST.)',
        '**Segment 3 (ACK)**: the client acknowledges with ACK = 1, **seq = x + 1, ack = y + 1**. Both are now ESTABLISHED and data can flow in both directions.',
      ] },
      { ul: ['A SYN consumes one sequence number, so the acknowledgement is x + 1.', 'Why three: the third segment confirms the server\'s sequence number. If an old duplicate SYN arrives, the client will not confirm it (it sends RST), so no false connection is made.'] },
    ],
    sources: [N, `${TB} §6.5.5`, MID],
  },

  'cn-mid-mime': {
    blocks: [
      '**MIME (Multipurpose Internet Mail Extensions)** extends the RFC 5322 mail format, which allowed only 7-bit ASCII text, so that e-mail can carry **non-ASCII text, images, audio, video and binary attachments**.',
      'Role of MIME in multimedia attachments:',
      { ul: [
        '**MIME-Version: 1.0** tells the user agent the message uses MIME.',
        '**Content-Type** gives the type/subtype of each part: text/plain, text/html, image/jpeg, audio/mpeg, video/mp4, application/pdf. **multipart/mixed** lets one message hold several parts (text + attachments), separated by a **boundary** string; multipart/alternative gives the same content in different formats.',
        '**Content-Transfer-Encoding** converts binary data to ASCII so SMTP can carry it: **base64** (every 24 bits become four 6-bit printable characters) or **quoted-printable** (mostly-ASCII text).',
        '**Content-Description** and **Content-Id** describe and label each part.',
      ] },
      { flow: ['Sender UA: attach file, encode (base64)', 'SMTP carries 7-bit ASCII', 'Receiver UA: read headers, decode, display or save'] },
    ],
    sources: [N, `${TB} §7.2.3`, MID],
  },

  'cn-mid-nvt': {
    blocks: [
      'Different computers use **different character sets** and different keys for the same action (end of line, interrupt). TELNET solves this with a universal interface, the **Network Virtual Terminal (NVT)**.',
      { img: 'cn-telnet' },
      { steps: [
        'The user types on the **local terminal**; the terminal driver passes the keystrokes to the **TELNET client**.',
        'The client **translates** the local characters into the **NVT character set** and sends them over the Internet (TCP port 23).',
        'The **TELNET server** on the remote computer translates NVT characters into the form the remote system understands and passes them, through a **pseudo-terminal driver**, to the remote operating system as if typed locally.',
        'Responses travel back the same way: remote format → NVT → local format.',
      ] },
      { ul: ['**NVT data characters**: 8-bit with the highest bit 0 (like 7-bit ASCII).', '**NVT control characters**: highest bit 1, e.g. IAC (255, "interpret as control") introduces commands.', 'Client and server negotiate **options** (echo, binary, terminal type) with WILL, WONT, DO, DONT.'] },
      'So each side only needs to translate between its own format and NVT, and **any terminal can work with any host**.',
    ],
    sources: [N, `${FZ} ch. 26`, MID],
  },

  'cn-num-dv-ct2': {
    blocks: [
      'Distance vector rule: each router sets D(dest) = min over neighbours X of [cost to X + X\'s distance to dest], using its neighbours\' vectors from the previous exchange.',
      { img: 'cn-dv-ct2' },
      { h: 'Initial tables (direct links only)' },
      { table: { head: ['Router', 'to A', 'to B', 'to C', 'to D'], rows: [['A', '0', '2', '5', '∞'], ['B', '2', '0', '1', '4'], ['C', '5', '1', '0', '2'], ['D', '∞', '4', '2', '0']] } },
      { h: 'After exchange 1 (router A)' },
      { table: { head: ['To', 'via B (2 + B)', 'via C (5 + C)', 'Best'], rows: [['B', '2 + 0 = 2', '5 + 1 = 6', '2 (B)'], ['C', '2 + 1 = 3', '5 + 0 = 5', '3 (B)'], ['D', '2 + 4 = 6', '5 + 2 = 7', '6 (B)']] } },
      'In the same exchange B learns D = 3 via C (1 + 2 < 4).',
      { h: 'After exchange 2 (router A, final)' },
      { table: { head: ['To', 'via B', 'via C', 'Best'], rows: [['B', '2', '5 + 1 = 6', '2 (B)'], ['C', '2 + 1 = 3', '5', '3 (B)'], ['D', '2 + 3 = **5**', '5 + 2 = 7', '**5 (B)**']] } },
      { h: 'Final routing table at A' },
      { table: { head: ['Destination', 'Distance', 'Next hop'], rows: [['A', '0', '-'], ['B', '2', 'B'], ['C', '3', 'B'], ['D', '5', 'B']] } },
      '**Next hop from A to D is B** (route A → B → C → D, cost 2 + 1 + 2 = 5). The tables stop changing after the second exchange.',
    ],
    sources: [N, `${TB} §5.2.4`, MID],
  },
}
