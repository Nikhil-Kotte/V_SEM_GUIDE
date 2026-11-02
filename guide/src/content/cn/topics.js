// Computer Networks — Mid-2 notes. Keys are syllabus ids from content/syllabus.js.
export default {
  // ======================= UNIT III (rest) =======================
  'cn.u3.link-state': {
    oneLine: 'In link state routing every router learns the whole map of the network and computes its own shortest paths with Dijkstra\'s algorithm.',
    blocks: [
      { analogy: 'Distance vector is like asking your neighbours "how far is the station?" and trusting them. Link state is like everyone sharing their street map, so each person can draw the full city map and plan their own route.' },
      { h: 'Five steps every router follows' },
      { steps: [
        '**Discover neighbours**: send HELLO packets on each line; neighbours reply with their names.',
        '**Measure link cost**: send ECHO packets and time the reply (delay), or use bandwidth.',
        '**Build a link state packet (LSP)**: sender id, sequence number, age, and the list of neighbours with costs.',
        '**Flood the LSP** to all routers. The **sequence number** discards old/duplicate copies; the **age** field removes stale packets.',
        '**Compute shortest paths**: with the full topology, run **Dijkstra** to fill the routing table.',
      ] },
      { img: 'cn-p7' },
      { h: 'Distance vector vs link state' },
      { table: { head: ['', 'Distance vector', 'Link state'], rows: [
        ['Knowledge', 'Only neighbours\' distance tables', 'Whole topology'],
        ['Shares', 'Its routing table', 'Its link costs (LSP)'],
        ['With whom', 'Neighbours only', 'Everyone (flooding)'],
        ['Algorithm', 'Bellman-Ford', 'Dijkstra'],
        ['Convergence', 'Slow; count-to-infinity problem', 'Fast, no count-to-infinity'],
        ['Resources', 'Less memory and CPU', 'More memory and CPU'],
        ['Example', 'RIP', 'OSPF, IS-IS'],
      ] } },
      { h: 'Hierarchical routing' },
      'In big networks routers are grouped into **regions**; a router knows details of its own region and just one entry per other region. This shrinks tables a lot.',
      { img: 'cn-p9' },
    ],
    terms: [['LSP', 'Link state packet: a router\'s list of neighbours and link costs.'], ['Flooding', 'Sending a packet out on every line except the one it arrived on.'], ['Dijkstra', 'Shortest-path algorithm that builds a tree from the source outwards.']],
    exam: 'Five numbered steps + LSP figure + the DV vs LS table. Mention sequence number and age in the flooding step.',
    revise: ['Hello → cost → LSP → flood → Dijkstra', 'LS converges fast; DV has count-to-infinity', 'OSPF is link state'],
  },

  'cn.u3.ospf': {
    oneLine: 'OSPF (Open Shortest Path First) is the main link-state routing protocol used inside an autonomous system.',
    blocks: [
      { ul: [
        'Intra-domain (interior gateway) protocol, open standard, runs directly over IP (protocol 89).',
        'Splits an AS into **areas**; all areas connect to the **backbone (area 0)**. Area border routers summarise routes between areas.',
        'Supports multiple metrics, load balancing over equal-cost paths, authentication, and multicast.',
      ] },
      { h: 'OSPF messages' },
      { img: 'cn-p37' },
      { h: 'Types of links' },
      { ul: ['**Point-to-point**: two routers directly connected.', '**Transient**: a network with several routers (e.g. Ethernet); a designated router represents it.', '**Stub**: a network connected to only one router.', '**Virtual**: used when a direct link is broken and administrators create a logical link through another area.'] },
      { h: 'Why OSPF converges faster than RIP' },
      'RIP (distance vector) learns routes hop by hop through periodic table exchanges and can count to infinity. OSPF floods link-state changes immediately to everyone, and each router recomputes routes from the full topology, so it reacts in seconds and never loops through count-to-infinity.',
    ],
    terms: [['Area', 'Part of an OSPF AS; reduces flooding and table size.'], ['Designated router', 'Router chosen to represent a multi-access network.']],
    exam: 'Definition, areas/backbone, five message types, four link types, and the convergence comparison with RIP.',
    revise: ['OSPF = link state inside an AS', 'Areas + backbone area 0', 'Hello, LSU, LSAck, DD, LSR'],
  },

  'cn.u3.bgp': {
    oneLine: 'BGP (Border Gateway Protocol) routes between autonomous systems; it is a path-vector protocol that chooses routes by policy, not just by shortest distance.',
    blocks: [
      { compare: [
        { title: 'Intra-AS routing (interior)', items: ['Inside one organisation', 'Goal: best performance', 'RIP, OSPF', 'One administrator'] },
        { title: 'Inter-AS routing (exterior)', items: ['Between ISPs/organisations', 'Goal: obey policies (who may carry whose traffic)', 'BGP', 'Many administrators'] },
      ] },
      { h: 'How BGP works' },
      { ul: [
        'BGP routers exchange routing information over **TCP (port 179)** sessions.',
        '**eBGP** between routers in different ASes; **iBGP** to spread the routes inside an AS.',
        'Each advertisement carries the **prefix**, the **AS path** (list of ASes the route goes through), and the **next hop**.',
        'Path vector: a router rejects any route whose AS path already contains its own AS → **no loops**.',
        'Route choice uses policy (e.g. never carry a competitor\'s transit traffic), then the shortest AS path, then other tie-breakers.',
      ] },
      { img: 'cn-bgp' },
      'Use of BGP: it is the protocol that holds the Internet together, letting ISPs exchange reachability and enforce business policies.',
    ],
    terms: [['Autonomous system (AS)', 'A network under one administrative control.'], ['AS path', 'The list of ASes a route passes through.'], ['Path vector', 'Routing that advertises whole paths, not just distances.']],
    exam: 'Inter vs intra-AS comparison + BGP features (TCP, eBGP/iBGP, AS path, policy, loop avoidance) + the propagation figure.',
    revise: ['BGP: path vector, inter-AS, TCP 179', 'AS path prevents loops', 'Policy-based routing'],
  },

  'cn.u3.qos': {
    oneLine: 'Quality of Service is about giving each flow the reliability, delay, jitter and bandwidth it needs, using traffic shaping, scheduling, admission control and reservations.',
    blocks: [
      { h: 'Four QoS parameters' },
      { img: 'cn-p18' },
      { ul: ['**Reliability**: no loss or corruption (email, file transfer need high).', '**Delay**: source-to-destination time (telephony needs low).', '**Jitter**: variation in delay (audio/video streaming hates it).', '**Bandwidth**: bits per second the flow needs.'] },
      { h: 'Techniques' },
      { ul: ['Over-provisioning (just buy enough capacity).', 'Buffering at the receiver to smooth jitter.', '**Traffic shaping** (leaky bucket, token bucket).', '**Packet scheduling**: FIFO, fair queuing, weighted fair queuing.', '**Admission control**: accept a flow only if resources are available.', '**Resource reservation** (RSVP).'] },
      { h: 'Traffic shaping' },
      { compare: [
        { title: 'Leaky bucket', items: ['Packets pour in at any rate; leak out at a **constant** rate', 'Bucket full → packets dropped', 'Smooths bursts completely', 'Average rate = peak rate on output'] },
        { title: 'Token bucket', items: ['Tokens added at rate R; a packet needs a token to leave', 'Unused tokens are saved (up to bucket size B)', 'Allows **bursts** up to B', 'Max burst length S = B / (M − R)'] },
      ] },
      'The **average data rate** is total data ÷ time; the **peak data rate** is the highest rate over a short interval. Shaping controls both.',
      { h: 'Token bucket numerical (Jun \'23)' },
      'One token every 5 µs → 200,000 tokens/s. Each token sends one 48-byte packet → 200,000 × 48 = 9.6 MB/s = **76.8 Mbps** maximum sustainable rate.',
      { h: 'Leaky bucket numerical (Jun \'24)' },
      'Input 100 gal/min for 12 s = 20 gallons in. Output 5 gal/min = 1 gallon per 12 s. After 12 s: 20 − 1 = **19 gallons** in the bucket. Over the next 48 s, 4 more gallons leak out → **15 gallons** left at the end of the minute, while the output stayed steady at 5 gal/min. The burst was smoothed.',
      { h: 'Integrated Services & RSVP' },
      'IntServ gives per-flow guarantees. A receiver uses **RSVP** to reserve bandwidth and buffers along the path (PATH message from sender, RESV message back from receiver). Problem: routers must keep state for every flow, so it doesn\'t scale. **DiffServ** instead marks packets into a few classes (e.g. expedited forwarding) and treats each class differently.',
    ],
    terms: [['Jitter', 'Variation in packet delay.'], ['Token bucket', 'Shaper that allows bursts up to the saved tokens.'], ['RSVP', 'Resource reSerVation Protocol for IntServ.']],
    exam: 'Define QoS + the four parameters, then leaky vs token bucket with a sketch, then IntServ/RSVP. Show units in numericals.',
    revise: ['Reliability, delay, jitter, bandwidth', 'Leaky = constant output; token = allows bursts', 'IntServ (RSVP) per flow; DiffServ per class'],
  },

  'cn.u3.ipv4': {
    oneLine: 'IPv4 is the Internet\'s connectionless, best-effort network protocol; each datagram carries a 20–60 byte header with addresses, TTL, fragmentation fields and a header checksum.',
    blocks: [
      { img: 'cn-ipv4' },
      { table: { head: ['Field', 'Bits', 'Purpose'], rows: [
        ['Version', '4', '4 for IPv4'], ['IHL', '4', 'Header length in 32-bit words (5–15)'], ['Differentiated services', '8', 'QoS class'],
        ['Total length', '16', 'Header + data, max 65,535 bytes'], ['Identification', '16', 'Same for all fragments of a datagram'],
        ['Flags (DF, MF)', '3', 'Don\'t fragment / more fragments'], ['Fragment offset', '13', 'Position of this fragment, in 8-byte units'],
        ['Time to live', '8', 'Decremented at each hop; 0 → discard'], ['Protocol', '8', 'Upper layer: 6 = TCP, 17 = UDP'],
        ['Header checksum', '16', 'Covers the header only'], ['Source / destination address', '32 + 32', 'IP addresses'], ['Options', '0–40 bytes', 'Security, routing, timestamps…'],
      ] } },
      { h: 'Options' },
      { h: 'Fragmentation' },
      'If a datagram is bigger than a link\'s **MTU**, a router splits it. Each fragment gets the same identification, its own offset, and MF = 1 except the last. Reassembly happens only at the destination.',
      'Example (Dec \'23): 1000-byte datagram (20-byte header, 980 data bytes), MTU 100 → each fragment can carry 100 − 20 = 80 bytes (a multiple of 8) → 980 ÷ 80 = 12.25 → **13 fragments** (12 × 80 + one of 20 bytes).',
      { h: 'Header checksum' },
      'Divide the header into 16-bit words (checksum field = 0), add them with one\'s complement arithmetic, and complement the result. The receiver adds all words including the checksum; if the result is all 1s (i.e. complement = 0), the header is accepted. It is recomputed at every router because TTL changes. Data is **not** covered (that\'s the transport layer\'s job).',
    ],
    terms: [['MTU', 'Maximum transmission unit of a link.'], ['TTL', 'Hop limit preventing datagrams from looping forever.']],
    exam: 'Draw the header (32-bit rows) and describe each field in one line. For fragmentation numericals, show data per fragment (multiple of 8) and the offsets.',
    revise: ['Header 20–60 bytes', 'Offset counted in 8-byte units', 'Checksum covers header only'],
  },

  'cn.u3.ip-addresses': {
    oneLine: 'An IPv4 address is 32 bits split into a network part (prefix) and a host part (suffix); classes, CIDR and subnetting decide where that split is.',
    blocks: [
      { img: 'cn-p27a' },
      { h: 'Classful addressing' },
      { img: 'cn-p28' },
      { table: { head: ['Class', 'First byte', 'Default mask', 'Use'], rows: [['A', '0–127', '255.0.0.0 (/8)', 'Huge networks'], ['B', '128–191', '255.255.0.0 (/16)', 'Medium'], ['C', '192–223', '255.255.255.0 (/24)', 'Small'], ['D', '224–239', '—', 'Multicast'], ['E', '240–255', '—', 'Reserved']] } },
      'Problem: wasteful (a class B has 65,536 addresses even if you need 2,000). Hence **classless addressing (CIDR)**.',
      { h: 'CIDR (classless) — a.b.c.d/n' },
      { img: 'cn-p31' },
      { ul: ['n bits are the prefix; number of addresses = 2^(32 − n).', '**First address**: set the last 32 − n bits to 0 (AND with the mask).', '**Last address**: set them to 1 (OR with the inverted mask).'] },
      { h: 'Worked example (Nov \'25): 205.16.37.39/28' },
      { ul: ['Mask /28 = 255.255.255.240. Last byte 39 = 00100111.', 'First address: 00100000 = **205.16.37.32**', 'Last address: 00101111 = **205.16.37.47**', 'Number of addresses: 2^(32−28) = **16**'] },
      { sim: 'cn-cidr' },
      { h: 'Subnetting and supernetting' },
      { ul: ['**Subnetting**: borrow host bits to split one network into smaller subnets (mask gets *longer* than default). E.g. a /24 split into four /26 subnets of 64 addresses.', '**Supernetting**: combine several contiguous smaller networks into one bigger block (mask gets *shorter* than default), e.g. four class C networks → one /22. Used for route aggregation.'] },
      { h: '"Same network?" trick (Dec \'22)' },
      'C1 = 203.197.2.53, mask 255.255.128.0 → network 203.197.0.0. C2 = 203.197.75.201, mask 255.255.192.0 → 75 AND 192 = 64 → network 203.197.64.0. Different network addresses, so they are **not** on the same network. (C1 using its own mask would think C2 is local, but C2 would not think C1 is local: the masks are inconsistent.)',
      { h: 'Classes quick check (Jun \'24)' },
      '208.34.54.12 → **C**; 238.34.2.1 → **D**; 114.34.2.8 → **A**; 129.14.6.8 → **B**.',
      { h: 'NAT' },
      'Network Address Translation lets a whole private network (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) share one public IP. The NAT router rewrites the source address/port of outgoing packets and keeps a translation table to send replies back. It slowed IPv4 address exhaustion, but breaks the end-to-end principle and complicates incoming connections.',
      'IP addresses identify a **network attachment** so routers can route by prefix; Ethernet (MAC) addresses are flat, burned into the card, and only need to be unique, not routable.',
    ],
    terms: [['Prefix length', 'Number of network bits (/n).'], ['Subnet mask', '32-bit value with 1s in the network part.'], ['NAT', 'Maps private addresses to a public address and port.']],
    exam: 'For numericals, write the address in binary, apply the mask, and convert back. For theory, classful table + CIDR + subnetting vs supernetting + NAT.',
    revise: ['First = AND mask; last = OR inverted mask; count = 2^(32−n)', 'Subnetting lengthens the mask; supernetting shortens it', 'Private ranges: 10/8, 172.16/12, 192.168/16'],
  },

  'cn.u3.ipv6': {
    oneLine: 'IPv6 uses 128-bit addresses and a simpler 40-byte fixed header to solve IPv4\'s address shortage and make routing faster.',
    blocks: [
      { h: 'Why IPv6?' },
      { ul: ['IPv4\'s 2³² (~4.3 billion) addresses are exhausted; IPv6 has 2¹²⁸.', 'Simpler fixed header → faster router processing; no checksum; no fragmentation at routers.', 'Extension headers instead of options.', 'Built-in security (IPsec), better QoS (flow label), auto-configuration, no need for NAT.'] },
      { img: 'cn-ipv6' },
      { table: { head: ['Field', 'Bits', 'Purpose'], rows: [['Version', '4', '6'], ['Traffic class', '8', 'Priority / DiffServ'], ['Flow label', '20', 'Identifies a flow needing special handling'], ['Payload length', '16', 'Bytes after the 40-byte header'], ['Next header', '8', 'Type of next (extension or transport) header'], ['Hop limit', '8', 'Same job as TTL'], ['Source / destination', '128 + 128', 'Addresses']] } },
      { h: 'Address notation' },
      'Eight groups of four hex digits: `2001:0db8:0000:0000:0000:ff00:0042:8329`. Leading zeros can be dropped and one run of zero groups replaced by `::` → `2001:db8::ff00:42:8329`.',
      { h: 'IPv4 vs IPv6' },
      { table: { head: ['', 'IPv4', 'IPv6'], rows: [['Address size', '32 bits', '128 bits'], ['Header', '20–60 bytes, variable', '40 bytes fixed + extensions'], ['Checksum', 'Yes', 'No'], ['Fragmentation', 'Routers and sender', 'Sender only'], ['Options', 'In header', 'Extension headers'], ['Configuration', 'Manual / DHCP', 'Auto-configuration + DHCPv6'], ['Security', 'Optional', 'IPsec built in']] } },
      { h: 'Transition from IPv4' },
      { ul: ['**Dual stack**: hosts/routers run both IPv4 and IPv6 at once.', '**Tunnelling**: an IPv6 packet is carried inside an IPv4 packet across IPv4-only parts of the network.', '**Header translation**: when one side only speaks IPv4, a translator converts headers.'] },
      { img: 'cn-p21' },
    ],
    terms: [['Flow label', 'Marks packets of the same flow for consistent handling.'], ['Dual stack', 'Running IPv4 and IPv6 side by side.'], ['Tunnelling', 'Encapsulating IPv6 in IPv4.']],
    exam: 'Reasons for IPv6, the header diagram with fields, comparison table, and the three transition strategies.',
    revise: ['128-bit address, 40-byte header', 'No checksum, no router fragmentation', 'Dual stack, tunnelling, translation'],
  },

  // ======================= UNIT IV =======================
  'cn.u4.transport-service': {
    oneLine: 'The transport layer gives process-to-process delivery on top of IP\'s host-to-host delivery, and hides the network\'s unreliability from applications.',
    blocks: [
      { ul: ['**Process-to-process** communication using port numbers (IP only gets data to the right host).', 'Connection-oriented (TCP) or connectionless (UDP) service.', 'Reliability: error control, retransmission, ordering.', 'Flow control and congestion control.', 'Multiplexing and demultiplexing many applications over one network layer.'] },
      'The transport layer exists because the user has no control over the network layer (routers belong to the carrier), so reliability must be added end to end in the hosts.',
      { h: 'Transport service primitives' },
      { table: { head: ['Primitive', 'Packet sent', 'Meaning'], rows: [['LISTEN', '(none)', 'Block until some process tries to connect'], ['CONNECT', 'CONNECTION REQ.', 'Actively attempt to establish a connection'], ['SEND', 'DATA', 'Send information'], ['RECEIVE', '(none)', 'Block until a DATA packet arrives'], ['DISCONNECT', 'DISCONNECTION REQ.', 'Release the connection']] } },
      'The unit exchanged by transport entities is a **segment** (TPDU), which travels inside a network-layer packet inside a frame.',
      { h: 'Three events of a connection' },
      'Connection establishment → data transfer → connection release.',
    ],
    terms: [['Segment / TPDU', 'Transport protocol data unit.'], ['Port', '16-bit number identifying a process on a host.']],
    exam: 'Services list + the primitives table + "why a transport layer" paragraph.',
    revise: ['IP: host-to-host; transport: process-to-process', 'LISTEN, CONNECT, SEND, RECEIVE, DISCONNECT'],
  },

  'cn.u4.sockets': {
    oneLine: 'Berkeley sockets are the programming interface (API) that applications use to talk to TCP and UDP.',
    blocks: [
      { table: { head: ['Primitive', 'Meaning'], rows: [['SOCKET', 'Create a new communication endpoint'], ['BIND', 'Attach a local address (IP + port) to the socket'], ['LISTEN', 'Announce willingness to accept connections; give queue size'], ['ACCEPT', 'Block until a connection arrives; returns a new socket'], ['CONNECT', 'Actively try to establish a connection'], ['SEND', 'Send data'], ['RECEIVE', 'Receive data'], ['CLOSE', 'Release the connection']] } },
      { h: 'TCP socket flow' },
      { compare: [
        { title: 'Server', items: ['socket()', 'bind()', 'listen()', 'accept() — waits', 'recv() / send()', 'close()'] },
        { title: 'Client', items: ['socket()', 'connect() — three-way handshake', 'send() / recv()', 'close()'] },
      ] },
      { h: 'UDP socket flow' },
      'Server: socket() → bind() → recvfrom() / sendto(). Client: socket() → sendto() / recvfrom(). There is **no listen, accept or connect**, and every datagram carries its destination address.',
      { h: 'TCP vs UDP sockets' },
      { ul: ['TCP sockets are **connection-oriented** (SOCK_STREAM): handshake first, then a reliable ordered byte stream.', 'UDP sockets are **connectionless** (SOCK_DGRAM): each message is independent, may be lost or reordered, but message boundaries are kept.', 'A TCP server gets a new socket per client from accept(); a UDP server uses one socket for all clients.'] },
      { code: `# Python TCP echo server (sketch)
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(("", 5000)); s.listen(5)
conn, addr = s.accept()
data = conn.recv(1024); conn.sendall(data); conn.close()` },
    ],
    terms: [['Socket', 'Endpoint of communication: IP address + port + protocol.'], ['SOCK_STREAM / SOCK_DGRAM', 'TCP / UDP socket types.']],
    exam: 'The primitives table, the client/server call sequence for TCP (as a two-column flow), then UDP\'s shorter sequence and two differences.',
    revise: ['Server: socket, bind, listen, accept', 'Client: socket, connect', 'UDP: no listen/accept/connect; sendto/recvfrom'],
  },

  'cn.u4.elements': {
    oneLine: 'Every transport protocol must solve the same problems: addressing, setting up and tearing down connections reliably, error and flow control, multiplexing, and crash recovery.',
    blocks: [
      { h: '1. Addressing' },
      'Processes are found by **TSAPs (ports)**. Well-known ports for servers; a portmapper or process server can hand out others. A port must be unique on a host **per protocol** at a given time (TCP 80 and UDP 80 can coexist). Ports are only 16 bits because they only need to distinguish processes on one host, while IP addresses must distinguish every host on the Internet.',
      { img: 'cn-p70' },
      { h: '2. Connection establishment' },
      'The network can lose, delay and **duplicate** packets, so an old duplicate CONNECTION REQUEST could set up a bogus connection. Solution: sequence numbers that don\'t repeat within the packet lifetime + the **three-way handshake**.',
      { h: '3. Connection release' },
      'Asymmetric release (one side hangs up) can lose data; symmetric release needs both sides to agree, which runs into the **two-army problem**. Practical fix: three-way release with timers.',
      { h: '4. Error control and flow control' },
      'Sequence numbers, checksums, ACKs and retransmission; a **sliding window** with buffering at both ends so a fast sender doesn\'t swamp a slow receiver.',
      { h: '5. Multiplexing' },
      { img: 'cn-p61' },
      '**Multiplexing**: many transport connections share one network address. **Demultiplexing**: the receiver uses the port number to hand each segment to the right process. **Inverse multiplexing**: one connection spread across several network paths for more bandwidth.',
      { h: '6. Crash recovery' },
      'If a host or router crashes, connections must be rebuilt. No strategy can make the transport layer fully transparent to host crashes; recovery must be handled partly by the application (e.g. re-sending the last request).',
    ],
    terms: [['TSAP', 'Transport service access point (port).'], ['Demultiplexing', 'Delivering incoming segments to the right socket by port number.']],
    exam: 'Six headings with 2-3 lines each. For multiplexing questions, draw many processes → ports → one IP.',
    revise: ['Addressing, establishment, release, error/flow control, multiplexing, crash recovery', 'Ports are unique per host per protocol'],
  },

  'cn.u4.udp': {
    oneLine: 'UDP is a minimal, connectionless transport protocol: just ports, a length and a checksum on top of IP — fast, but no reliability, ordering or flow control.',
    blocks: [
      { img: 'cn-udp' },
      { ul: ['**Source port** (16 bits), **destination port** (16), **length** (16, header + data), **checksum** (16, optional in IPv4, covers a pseudo-header + header + data).', 'Header is always **8 bytes**.'] },
      { h: 'Data size' },
      'Maximum data = 65,535 (max IP datagram) − 20 (IP header) − 8 (UDP header) = **65,507 bytes**. Minimum = **0 bytes** (an 8-byte datagram with no data).',
      { h: 'What UDP adds over IP' },
      'Port numbers (process-to-process delivery) and an end-to-end checksum. Otherwise it is as unreliable as IP: no ACKs, no retransmission, no ordering. UDP and IP are equally "unreliable", but UDP can at least detect corruption.',
      { h: 'Message-oriented vs byte-oriented' },
      'UDP is **message-oriented**: each sendto() becomes one datagram and the receiver gets the same boundaries. TCP is a **byte stream**: two writes of 100 bytes may be read as one 200-byte chunk. So UDP preserves message boundaries.',
      { h: 'When to use UDP' },
      'DNS queries, DHCP, SNMP, streaming audio/video, online games, VoIP, and **RPC** (one request, one reply; the application retransmits if needed). RPC over UDP is faster but the application must handle loss and duplicates; RPC over TCP gets reliability for free but with connection overhead.',
      { h: 'TCP vs UDP' },
      { table: { head: ['', 'TCP', 'UDP'], rows: [
        ['Connection', 'Connection-oriented (handshake)', 'Connectionless'],
        ['Reliability', 'ACKs, retransmission, ordering', 'None'],
        ['Flow / congestion control', 'Yes', 'No'],
        ['Header', '20–60 bytes', '8 bytes'],
        ['Data unit', 'Byte stream', 'Messages'],
        ['Speed', 'Slower', 'Faster'],
        ['Uses', 'HTTP, FTP, SMTP, SSH', 'DNS, SNMP, VoIP, streaming'],
        ['Header fields missing in UDP', 'sequence no., ack no., header length, flags, window, urgent pointer, options', '—'],
      ] } },
    ],
    terms: [['Pseudo-header', 'Part of the IP header included in the UDP/TCP checksum to catch misdelivered packets.'], ['RPC', 'Remote procedure call.']],
    exam: 'Draw the 8-byte header, list features, and finish with the TCP vs UDP table. Size questions: show 65,535 − 20 − 8.',
    revise: ['UDP header 8 bytes', 'Max data 65,507 bytes', 'Keeps message boundaries'],
  },

  'cn.u4.tcp-intro': {
    oneLine: 'TCP gives applications a reliable, ordered, full-duplex byte stream between two processes, with flow and congestion control, over unreliable IP.',
    blocks: [
      { ul: [
        '**Connection-oriented**: three-way handshake before data.',
        '**Reliable**: every byte is numbered; cumulative ACKs and retransmission on timeout.',
        '**Ordered** delivery and duplicate removal — even when IP delivers fragments/segments out of order, TCP reorders them using sequence numbers before passing data up.',
        '**Full duplex**: data flows both ways at once.',
        '**Byte stream**: no message boundaries.',
        '**Flow control** (receiver window) and **congestion control** (congestion window).',
        'Point-to-point (no multicast).',
      ] },
      'Every connection is identified by the 4-tuple (source IP, source port, destination IP, destination port). Applications: HTTP, HTTPS, FTP, SMTP, SSH, TELNET.',
      { h: 'Why HTTP, FTP, SMTP use TCP' },
      'They transfer files or documents where every byte must arrive correctly and in order; TCP does that work so the application doesn\'t have to.',
    ],
    terms: [['Full duplex', 'Data in both directions at the same time.'], ['Cumulative ACK', 'ACK n means all bytes before n were received.']],
    exam: 'List the 6-7 features with one line each.',
    revise: ['Connection-oriented, reliable, ordered, full-duplex byte stream', 'Flow + congestion control'],
  },

  'cn.u4.tcp-header': {
    oneLine: 'Every TCP segment starts with a 20-byte (up to 60-byte) header holding ports, sequence and acknowledgement numbers, flags, window size, checksum and urgent pointer.',
    blocks: [
      { img: 'cn-tcp-header' },
      { table: { head: ['Field', 'Bits', 'Purpose'], rows: [
        ['Source port / destination port', '16 + 16', 'Identify the two processes'],
        ['Sequence number', '32', 'Number of the first byte in this segment'],
        ['Acknowledgement number', '32', 'Next byte expected from the other side'],
        ['Header length', '4', 'Header size in 32-bit words (5–15)'],
        ['Reserved', '4', 'Unused'],
        ['Flags', '8', 'CWR, ECE (congestion), URG, ACK, PSH, RST, SYN, FIN'],
        ['Window size', '16', 'How many bytes the receiver can accept (flow control)'],
        ['Checksum', '16', 'Covers pseudo-header + header + data'],
        ['Urgent pointer', '16', 'Offset of urgent data (when URG = 1)'],
        ['Options', '0–40 bytes', 'MSS, window scale, timestamps, SACK'],
      ] } },
      { h: 'The flags' },
      { ul: ['**SYN**: synchronise sequence numbers (connection setup).', '**ACK**: the acknowledgement field is valid.', '**FIN**: sender has finished sending.', '**RST**: reset the connection.', '**PSH**: deliver data to the application immediately.', '**URG**: urgent pointer is valid.', '**ECE / CWR**: explicit congestion notification.'] },
    ],
    terms: [['MSS', 'Maximum segment size, negotiated in options.'], ['Pseudo-header', 'IP addresses, protocol and length included in the checksum.']],
    exam: 'Draw the header in 32-bit rows exactly like the figure, then a line per field. This question is asked almost every year — practise drawing it.',
    revise: ['20–60 bytes', 'Seq = first byte; ACK = next expected byte', 'Flags: SYN, ACK, FIN, RST, PSH, URG (+ECE, CWR)'],
  },

  'cn.u4.tcp-connect': {
    oneLine: 'TCP opens a connection with a three-way handshake — SYN, SYN+ACK, ACK — so both sides agree on starting sequence numbers and old duplicate packets can be rejected.',
    blocks: [
      { img: 'tcp-handshake' },
      { steps: [
        'Client → server: **SYN**, seq = x (client\'s initial sequence number).',
        'Server → client: **SYN + ACK**, seq = y, ack = x + 1.',
        'Client → server: **ACK**, seq = x + 1, ack = y + 1. The connection is ESTABLISHED; data can now flow.',
      ] },
      { h: 'Why three ways, not two?' },
      { img: 'cn-p59' },
      'Packets can be delayed and duplicated. With only two messages, an **old duplicate CR** arriving late would make the server open a connection the client never asked for (and the server could wait forever for data, or both sides could wait on each other = deadlock). In the three-way handshake the server\'s SYN+ACK carries its own sequence number y; the client sees that it never sent that request and replies **REJECT/RST**, so the bogus connection is killed (cases b and c in the figure).',
      { h: 'Call collision' },
      'If both hosts send SYN at the same time, each replies with SYN+ACK and **only one** connection is created, because a connection is identified by its two endpoints.',
      { h: 'How the handshake gives reliability' },
      'Both sides learn and acknowledge each other\'s initial sequence numbers, buffers and options (MSS) are agreed, and stale duplicates are detected before any data is accepted.',
    ],
    terms: [['ISN', 'Initial sequence number chosen at connection setup.'], ['SYN flood', 'Attack sending many SYNs without completing the handshake.']],
    exam: 'Draw the timeline (two vertical host lines, three diagonal arrows with seq/ack values), then explain why two-way fails with the delayed-duplicate scenario.',
    revise: ['SYN(x) → SYN+ACK(y, x+1) → ACK(y+1)', 'Three-way handshake defeats delayed duplicates', 'Simultaneous open → one connection'],
  },

  'cn.u4.tcp-release': {
    oneLine: 'TCP closes each direction separately with FIN and ACK — four segments in all — and the side that closes first waits in TIME_WAIT to catch stragglers.',
    blocks: [
      { img: 'tcp-release' },
      { steps: [
        'Client sends **FIN** (seq = u): "I have no more data."',
        'Server replies **ACK** (ack = u + 1). The client→server direction is closed (half-close); the server may still send data.',
        'When finished, the server sends its own **FIN** (seq = w).',
        'Client replies **ACK** (ack = w + 1) and waits **2 × MSL** in TIME_WAIT before fully closing, in case its last ACK was lost.',
      ] },
      'Often steps 2 and 3 are combined (FIN+ACK), giving a three-segment release.',
      { h: 'Why release is hard: the two-army problem' },
      'Two armies must attack together, but messengers can be captured. Whoever sends the last message can never be sure it arrived, so no protocol over an unreliable channel can guarantee both sides agree. TCP sidesteps it: each side closes its own direction, and timers end the connection if replies stop.',
      { h: 'Abrupt release' },
      'If one side simply disconnects (RST), data still in transit is lost, which is why the graceful FIN-based release is used normally.',
    ],
    terms: [['Half-close', 'One direction closed, the other still open.'], ['TIME_WAIT', 'Wait of 2 × maximum segment lifetime before reusing a connection.'], ['Two-army problem', 'Agreement is impossible over an unreliable channel.']],
    exam: 'Draw the four-segment timeline with FIN/ACK and states (FIN_WAIT_1/2, CLOSE_WAIT, LAST_ACK, TIME_WAIT), then the two-army problem.',
    revise: ['FIN → ACK, FIN → ACK', 'TIME_WAIT = 2 MSL', 'Two-army problem'],
  },

  'cn.u4.tcp-window': {
    oneLine: 'TCP\'s sliding window lets the sender transmit several bytes ahead without waiting for ACKs, up to the window size the receiver advertises.',
    blocks: [
      { img: 'sliding-window' },
      { ul: [
        'Bytes are in four groups: sent and ACKed, sent but not ACKed, **can send** (inside the window), cannot send yet.',
        'The window size comes from the receiver\'s **window** field (free buffer space) — and from the congestion window.',
        'When ACKs arrive the left edge moves right (**window slides**); when the receiver frees buffer space the right edge moves right (**window opens**). If the receiver advertises 0, the sender stops (**window closed**) and uses the persist timer.',
        'ACKs are cumulative; the window is measured in bytes, not segments.',
      ] },
      { h: 'Silly window syndrome' },
      'If the receiving application reads one byte at a time and the receiver advertises a 1-byte window each time, the sender sends 1-byte segments with 40 bytes of headers. Fixes: **Clark\'s solution** (receiver doesn\'t advertise until it has room for an MSS or half its buffer) and **Nagle\'s algorithm** (sender buffers small writes until the previous data is ACKed).',
    ],
    terms: [['Advertised window (rwnd)', 'Free buffer space the receiver reports.'], ['Silly window syndrome', 'Tiny segments wasting bandwidth.']],
    exam: 'Draw a byte line with the window marked, explain sliding/opening/closing, then silly window syndrome with both fixes.',
    revise: ['Window = min(rwnd, cwnd)', 'Slides on ACK, opens when buffer frees', 'Clark (receiver) + Nagle (sender)'],
  },

  'cn.u4.tcp-timers': {
    oneLine: 'TCP uses several timers — retransmission, persistence, keepalive and TIME_WAIT — and adapts the retransmission timeout to the measured round-trip time.',
    blocks: [
      { table: { head: ['Timer', 'Purpose'], rows: [
        ['**Retransmission (RTO)**', 'Resend a segment if its ACK doesn\'t arrive in time'],
        ['**Persistence**', 'After a zero window, periodically send a probe so a lost window update doesn\'t deadlock both sides'],
        ['**Keepalive**', 'Check whether an idle connection\'s peer is still alive'],
        ['**TIME_WAIT**', 'Wait 2 × MSL after closing so old segments die out'],
      ] } },
      { h: 'Choosing the retransmission timeout (Jacobson)' },
      { formula: 'SRTT = α·SRTT + (1 − α)·R       (α = 7/8)' },
      { formula: 'RTTVAR = β·RTTVAR + (1 − β)·|SRTT − R|   (β = 3/4)' },
      { formula: 'RTO = SRTT + 4 × RTTVAR' },
      '**Karn\'s algorithm**: don\'t update RTT from retransmitted segments (you can\'t tell which copy was ACKed), and double the RTO after each timeout (exponential back-off).',
    ],
    terms: [['RTT', 'Round-trip time.'], ['Karn\'s algorithm', 'Ignore RTT samples from retransmissions; back off the timer.']],
    exam: 'Table of four timers, then the RTO formulas and Karn\'s algorithm.',
    revise: ['RTO, persistence, keepalive, TIME_WAIT', 'RTO = SRTT + 4·RTTVAR'],
  },

  'cn.u4.flow-control': {
    oneLine: 'Flow control stops a fast sender from overflowing a slow receiver: the receiver advertises how much buffer space it has, and the sender never has more unacknowledged data than that.',
    blocks: [
      { img: 'cn-p64' },
      { compare: [
        { title: 'Flow control', items: ['Protects the **receiver**', 'Receiver advertises window (rwnd)', 'End-to-end, sender ↔ receiver'] },
        { title: 'Congestion control', items: ['Protects the **network**', 'Sender keeps its own cwnd', 'Reacts to loss / delay in routers'] },
        { title: 'Error control', items: ['Makes data **correct and complete**', 'Checksums, ACKs, retransmission', 'Detects loss, corruption, duplicates'] },
      ] },
      { h: 'Credit scheme' },
      'The receiver grants the sender **credit** (the window field): "you may send up to byte n + w". As the application reads data, more credit is granted. Sending rate is effectively window ÷ RTT.',
      { formula: 'Effective window = min(rwnd, cwnd) − (bytes in flight)' },
    ],
    terms: [['Credit', 'Permission to send a number of bytes beyond the last ACK.']],
    exam: 'Define flow control, explain advertised window/credit, then the three-way comparison flow vs congestion vs error control.',
    revise: ['Flow control protects the receiver; congestion control the network', 'Window = min(rwnd, cwnd)'],
  },

  'cn.u4.congestion': {
    oneLine: 'Congestion is when too many packets are in the network and routers start dropping them; TCP controls it with a congestion window that grows slowly (slow start, then additive increase) and shrinks sharply on loss.',
    blocks: [
      'Congestion happens when the load is more than the routers can handle: queues fill, delay grows, packets are dropped, retransmissions add even more load, and throughput collapses.',
      { h: 'General approaches' },
      { compare: [
        { title: 'Open-loop (prevention)', items: ['Good design so congestion doesn\'t start', 'Retransmission, window, ACK, discard and admission policies', 'Traffic shaping'] },
        { title: 'Closed-loop (removal)', items: ['Monitor, then react', 'Back-pressure, choke packets', 'Implicit (loss/delay) or explicit (ECN) signalling'] },
      ] },
      'Network-layer methods: choke packets, hop-by-hop back-pressure, load shedding (drop packets, e.g. RED). Transport-layer methods: TCP adjusts its own sending rate end to end.',
      { h: 'TCP congestion control' },
      { ul: [
        '**cwnd** (congestion window) limits data in flight together with rwnd.',
        '**Slow start**: start with cwnd = 1 (or a small initial window) MSS and **double** it every RTT (exponential) until it reaches **ssthresh**.',
        '**Congestion avoidance (additive increase)**: above ssthresh, add **1 MSS per RTT** (linear).',
        '**On timeout**: ssthresh = cwnd / 2, cwnd back to 1 MSS (initial window), slow start again (TCP Tahoe).',
        '**Fast retransmit / fast recovery (Reno)**: 3 duplicate ACKs → retransmit at once; ssthresh = cwnd / 2, cwnd = ssthresh (multiplicative decrease), continue additive increase.',
      ] },
      'This **AIMD** (additive increase, multiplicative decrease) gives the classic saw-tooth curve.',
      { sim: 'cn-cwnd' },
      { h: 'Worked example (Dec \'22): initial window 2 MSS, ssthresh 8, timeout at the 5th transmission' },
      { ul: ['Transmissions 1–5: 2, 4, 8 (reaches threshold), 9, 10 → timeout at 10.', 'New ssthresh = 10 / 2 = 5; restart from the initial window 2.', 'Transmissions 6–10: 2, 4, 5 (capped at ssthresh), 6, 7.', 'Window at the end of the 10th transmission = **7 MSS**. (If you restart from 1 MSS instead: 1, 2, 4, 5, 6 → 6 MSS. State your convention.)'] },
    ],
    terms: [['cwnd', 'Congestion window kept by the sender.'], ['ssthresh', 'Slow-start threshold.'], ['AIMD', 'Additive increase, multiplicative decrease.']],
    exam: 'Define congestion, open vs closed loop, then slow start / congestion avoidance / reaction to loss with the saw-tooth graph. Numericals: tabulate transmission number vs cwnd.',
    revise: ['Slow start doubles until ssthresh', 'Then +1 MSS per RTT', 'Timeout: ssthresh = cwnd/2, cwnd = 1 (or initial)', '3 dup ACKs: fast retransmit, cwnd = ssthresh'],
  },

  // ======================= UNIT V =======================
  'cn.u5.dns': {
    oneLine: 'DNS is the Internet\'s distributed phone book: it maps human-friendly names like www.cbit.ac.in to IP addresses (and back), using a hierarchy of name servers.',
    blocks: [
      'People remember names; routers need numbers. Names also stay the same when a server moves to a new IP address. DNS runs over **UDP port 53** (TCP for big responses and zone transfers).',
      { h: 'Services DNS provides' },
      { ul: ['Host name → IP address (A / AAAA records).', 'IP address → name (reverse lookup, PTR).', '**Host aliasing** (CNAME).', '**Mail server aliasing** (MX records).', '**Load distribution**: one name can map to several server IPs.'] },
      { h: 'Key components' },
      'Domain name space (the tree), resource records (the data), name servers (the database, split into zones), and resolvers (the client side that asks).',
      { h: 'DNS messages: query and response' },
      'Both use the same format: a **header** (identification, flags such as QR/AA/RD/RA, and counts), a **question section**, and in responses **answer**, **authoritative** and **additional** sections.',
      { h: 'Dynamic DNS (DDNS)' },
      'With DHCP, a host\'s address may change often. DDNS lets the DHCP server (or host) **update** the DNS records automatically, instead of an administrator editing the zone file by hand.',
    ],
    terms: [['Resolver', 'Client software that sends DNS queries.'], ['DDNS', 'Dynamic DNS: automatic record updates.']],
    exam: 'Why DNS + services list + components + query/response message format.',
    revise: ['Name ↔ IP, aliasing, mail, load distribution', 'UDP 53', 'DDNS updates records automatically'],
  },

  'cn.u5.dns-namespace': {
    oneLine: 'The DNS name space is an inverted tree of labels; a node\'s full domain name is its labels read upward to the root, separated by dots.',
    blocks: [
      { img: 'cn-p96b' },
      { img: 'cn-p96a' },
      { ul: [
        'Up to 128 levels; each **label** is at most 63 characters; the root label is empty.',
        '**Domain name**: labels from the node up to the root, e.g. `voyager.fhda.edu.` has labels voyager, fhda, edu (3 levels below the root).',
        '**FQDN** (fully qualified): ends with a dot and names the host completely, e.g. `challenger.atc.fhda.edu.`',
        '**PQDN** (partially qualified): doesn\'t reach the root, e.g. `challenger` — the resolver adds a suffix such as `atc.fhda.edu.`',
        'A **domain** is a subtree; a domain can contain subdomains.',
      ] },
      { compare: [
        { title: 'Hierarchical name space', items: ['Names have parts (labels)', 'Authority delegated per domain', 'Scales to billions of names; no central bottleneck'] },
        { title: 'Flat name space', items: ['A name is one sequence of characters', 'Needs one central authority to avoid duplicates', 'Does not scale'] },
      ] },
      { h: 'Top-level domains' },
      'Generic (com, edu, org, net, gov…), country (in, uk, us…), and the inverse domain (in-addr.arpa) for reverse lookups.',
    ],
    terms: [['FQDN', 'Fully qualified domain name, ending at the root.'], ['PQDN', 'Partially qualified domain name.'], ['Label', 'One node name in the tree (≤ 63 characters).']],
    exam: 'Draw the tree with root → TLDs → domains, define label/domain name/FQDN/PQDN with examples.',
    revise: ['Label ≤ 63 chars; read upward to root', 'FQDN ends with a dot'],
  },

  'cn.u5.dns-rr': {
    oneLine: 'Resource records are the entries in DNS\'s database: each one is a five-tuple (domain name, TTL, class, type, value).',
    blocks: [
      { table: { head: ['Type', 'Meaning', 'Value'], rows: [
        ['A', 'IPv4 address of a host', '32-bit address'], ['AAAA', 'IPv6 address of a host', '128-bit address'], ['NS', 'Name server for a domain', 'Server name'],
        ['CNAME', 'Canonical name (alias)', 'Real domain name'], ['MX', 'Mail exchange for a domain', 'Priority + mail server'], ['SOA', 'Start of authority', 'Zone parameters (serial, refresh…)'],
        ['PTR', 'Pointer for reverse lookup', 'Domain name'], ['TXT', 'Descriptive text', 'ASCII text'], ['SRV', 'A service\'s host and port', 'Host, port'],
      ] } },
      { code: `cs.vu.nl.      86400  IN  SOA  star boss (9527,7200,7200,241920,86400)
cs.vu.nl.      86400  IN  MX   1 zephyr
www.cs.vu.nl.  86400  IN  CNAME star.cs.vu.nl.
star           86400  IN  A    130.37.56.201` },
      'TTL says how long a cached copy stays valid; class is IN for Internet.',
    ],
    terms: [['TTL', 'How long the record can be cached.'], ['MX', 'Mail exchanger record.']],
    exam: 'Write the 5-tuple, then a table of 6-8 record types with examples.',
    revise: ['(name, TTL, class, type, value)', 'A, AAAA, NS, CNAME, MX, SOA, PTR'],
  },

  'cn.u5.name-servers': {
    oneLine: 'The DNS database is split into zones held by many name servers — root, top-level-domain and authoritative — and resolved by recursive or iterative queries with caching.',
    blocks: [
      { ul: ['**Root servers** (13 named sets, replicated worldwide): know the TLD servers.', '**TLD servers**: know the servers for each domain under com, edu, in…', '**Authoritative servers**: hold the actual records of a zone (primary and secondary copies).', '**Local (recursive) name server**: the ISP\'s or campus server that resolves for clients and caches answers.'] },
      'A **zone** is the part of the tree a server is responsible for. The **primary** server loads it from a file; **secondary** servers copy it with zone transfers.',
      { h: 'Recursive vs iterative resolution' },
      { img: 'dns-resolution' },
      { compare: [
        { title: 'Recursive', items: ['Client asks the local server, which asks root → TLD → authoritative on the client\'s behalf', 'The final answer comes back down the chain', 'Burden on the servers'] },
        { title: 'Iterative', items: ['Each server replies with a **referral** ("ask this server next")', 'The asker contacts each server itself', 'Root/TLD servers usually only answer iteratively'] },
      ] },
      'In practice: the host asks its local server **recursively**; the local server queries root, TLD and authoritative servers **iteratively**. **Caching** (for the TTL) makes most lookups skip the root entirely.',
    ],
    terms: [['Zone', 'The part of the name space a server is authoritative for.'], ['Referral', 'An answer telling the client which server to ask next.']],
    exam: 'Hierarchy of servers + zones + the recursive vs iterative diagrams with numbered arrows + caching.',
    revise: ['Root → TLD → authoritative; local server caches', 'Recursive: server does the work; iterative: referrals'],
  },

  'cn.u5.email-arch': {
    oneLine: 'E-mail uses three kinds of agents: user agents to write and read mail, message transfer agents (SMTP) to move it between servers, and message access agents (POP3/IMAP) to fetch it from the mailbox.',
    blocks: [
      { img: 'cn-email' },
      { steps: [
        'Alice writes the message in her **user agent (UA)**.',
        'Her UA hands it to her mail server using an **MTA client** (SMTP).',
        'The message waits in the server\'s **spool** (queue).',
        'The server\'s MTA client sends it across the Internet to Bob\'s mail server (**SMTP**).',
        'Bob\'s server stores it in his **mailbox**.',
        'Bob\'s UA uses an **MAA client** (POP3 or IMAP) to pull the message from his mailbox.',
      ] },
      'Why so many steps? Bob\'s computer isn\'t always on, so mail must wait on an always-on server; SMTP is a **push** protocol, so a separate **pull** protocol (POP3/IMAP) is needed for the final step.',
      { h: 'Services' },
      'Composing, reading, replying, forwarding, mailboxes, mailing lists (aliases), attachments, delivery to several recipients.',
    ],
    terms: [['UA', 'User agent (Outlook, Thunderbird, Gmail web).'], ['MTA', 'Message transfer agent (SMTP).'], ['MAA', 'Message access agent (POP3, IMAP).']],
    exam: 'Draw the architecture (Alice UA → MTA → spool → Internet → MTA → mailbox → MAA → Bob UA) and number the steps.',
    revise: ['UA → MTA (SMTP push) → mailbox → MAA (POP3/IMAP pull) → UA'],
  },

  'cn.u5.user-agent': {
    oneLine: 'The user agent is the mail program you use: it composes, reads, replies to, forwards and files messages, and talks to the mail servers for you.',
    blocks: [
      { h: 'Tasks of a user agent' },
      { ul: ['**Composing** messages (editor, address book, attachments).', '**Reading** messages (inbox summary: sender, subject, flags).', '**Replying** and **forwarding**.', '**Handling mailboxes**: inbox, sent, folders, filtering, searching, deleting.'] },
      { h: 'Types' },
      'Command-driven (old Unix `mail`, `pine`) and GUI-based (Outlook, Thunderbird). **Web-based** mail (Gmail) runs the UA in the browser and uses HTTP between browser and server.',
      'Why e-mail needs its own setup on top of TCP: the UA and servers use SMTP/POP3/IMAP command–reply dialogues, so each step opens a TCP connection and exchanges these commands before any message moves.',
    ],
    terms: [['Webmail', 'User agent running in a browser over HTTP.']],
    exam: 'List and explain the four tasks, then the types of UA.',
    revise: ['Compose, read, reply/forward, manage mailboxes'],
  },

  'cn.u5.formats': {
    oneLine: 'An e-mail message is an envelope plus a message; the message has header lines (From, To, Subject…), a blank line and a body, and MIME extends it to carry non-ASCII text and attachments.',
    blocks: [
      { h: 'RFC 5322 message format' },
      { code: `From: alice@cbit.ac.in
To: bob@example.com
Subject: Lab report
Date: Mon, 2 Nov 2026 10:00:00 +0530

Hi Bob, the report is attached.` },
      { ul: ['**Envelope**: sender and receiver addresses used by the MTAs (SMTP MAIL FROM / RCPT TO).', '**Header** fields: To, Cc, Bcc, From, Sender, Reply-To, Date, Subject, Message-Id, Received.', 'A **blank line**, then the **body** (7-bit ASCII originally).'] },
      { h: 'MIME — Multipurpose Internet Mail Extensions' },
      'SMTP could only carry 7-bit ASCII text. MIME converts other data (images, audio, other languages, binary files) into 7-bit ASCII and back, and describes it with extra headers:',
      { table: { head: ['MIME header', 'Purpose'], rows: [
        ['MIME-Version', '1.0'],
        ['Content-Type', 'type/subtype: text/plain, text/html, image/jpeg, audio/mpeg, video/mp4, application/pdf, **multipart/mixed** (body with attachments)'],
        ['Content-Transfer-Encoding', '7bit, 8bit, binary, **base64** (any binary data → 6-bit groups → ASCII), **quoted-printable** (mostly-ASCII text)'],
        ['Content-Id', 'Unique id for the part'],
        ['Content-Description', 'Human-readable description'],
      ] } },
      'Example: a photo attachment is sent as part of a multipart/mixed message with Content-Type: image/jpeg and Content-Transfer-Encoding: base64.',
    ],
    terms: [['Envelope', 'Addressing information used by the mail transfer system.'], ['Base64', 'Encodes 3 bytes as 4 ASCII characters.']],
    exam: 'Show a header/blank line/body example, then MIME\'s five headers with content types and encodings.',
    revise: ['Message = header + blank line + body', 'MIME: Version, Content-Type, Transfer-Encoding, Id, Description', 'base64 for binary'],
  },

  'cn.u5.transfer': {
    oneLine: 'SMTP is the push protocol that moves mail from the sender\'s UA to its server and from server to server, using simple text commands over TCP port 25.',
    blocks: [
      { h: 'SMTP commands and replies' },
      { table: { head: ['Command', 'Purpose'], rows: [['HELO / EHLO', 'Identify the client'], ['MAIL FROM:', 'Sender (envelope)'], ['RCPT TO:', 'Recipient (one per command)'], ['DATA', 'Start of the message; ends with a line containing only "."'], ['QUIT', 'End the session'], ['RSET, VRFY, NOOP', 'Reset, verify a user, do nothing']] } },
      'Replies are 3-digit codes: **220** service ready, **250** OK, **354** start mail input, **221** closing, **550** mailbox unavailable.',
      { h: 'Three phases' },
      { steps: ['**Connection establishment**: TCP connect to port 25, server sends 220, client sends HELO.', '**Mail transfer**: MAIL FROM, RCPT TO, DATA … ".", each answered with 250/354.', '**Connection termination**: QUIT → 221.'] },
      { h: 'SMTP addressing' },
      'Addresses are `local-part@domain-name`. The sending MTA looks up the domain\'s **MX record** in DNS to find which mail server accepts mail for it.',
      { h: 'SMTP vs HTTP' },
      { table: { head: ['', 'SMTP', 'HTTP'], rows: [['Direction', 'Push (sender pushes to server)', 'Pull (client requests a page)'], ['Data', '7-bit ASCII (MIME for others)', 'Any binary data'], ['Objects', 'Whole message, parts in one body', 'One object per response'], ['Port', '25 (587 submission)', '80 / 443']] } },
    ],
    terms: [['MX record', 'DNS record naming a domain\'s mail server.'], ['Push protocol', 'The sender initiates the transfer.']],
    exam: 'SMTP role in the architecture, the commands table + reply codes, a sample dialogue, and the three phases.',
    revise: ['SMTP = push, TCP 25', 'HELO, MAIL FROM, RCPT TO, DATA, QUIT', '220, 250, 354, 221'],
  },

  'cn.u5.delivery': {
    oneLine: 'Final delivery pulls mail from the mail server to the user\'s device using a message access protocol — POP3 or IMAP (or webmail over HTTP).',
    blocks: [
      'SMTP can\'t be used for the last step because it is a push protocol and Bob\'s machine is not always on and is not a server. So Bob\'s UA **pulls** mail when he wants it.',
      { h: 'POP3 (port 110)' },
      { ul: ['Simple: authenticate (USER/PASS), list and download messages (LIST, RETR), delete (DELE), QUIT.', 'States: authorisation → transaction → update.', '**Delete mode** (remove from server after download) or **keep mode**.', 'Works well for one device; poor for many devices.'] },
      { h: 'IMAP (port 143)' },
      { ul: ['Mail stays on the **server**; the client sees folders there.', 'Check headers before downloading, download parts of a message, search on the server.', 'Create, delete, rename mailboxes on the server.', 'Ideal for several devices (phone + laptop).'] },
      { table: { head: ['', 'POP3', 'IMAP'], rows: [['Where mail lives', 'Downloaded to the client', 'Stays on the server'], ['Folders on server', 'No', 'Yes'], ['Partial download', 'No', 'Yes'], ['Multiple devices', 'Awkward', 'Natural'], ['Server storage', 'Low', 'High'], ['Example', 'Download office mail to one PC', 'Gmail on phone and laptop']] } },
      'Webmail uses HTTP between the browser and the server instead.',
    ],
    terms: [['MAA', 'Message access agent.'], ['Keep mode', 'POP3 leaves a copy on the server.']],
    exam: 'Why a pull protocol is needed, then POP3 and IMAP features and the comparison table with a real-time example.',
    revise: ['POP3 110: download (delete/keep)', 'IMAP 143: mail stays on server, folders, partial fetch'],
  },

  'cn.u5.ftp': {
    oneLine: 'FTP copies files between hosts using two TCP connections: a control connection for commands (port 21) and a separate data connection for each file (port 20).',
    blocks: [
      { img: 'cn-ftp' },
      { ul: ['Client parts: user interface, control process, data transfer process. Server parts: control process, data transfer process.', '**Control connection** stays open for the whole session; commands and replies are ASCII lines.', '**Data connection** is opened for each file transfer or directory listing and closed afterwards.', '**Active mode**: server connects back to the client from port 20. **Passive mode (PASV)**: client opens both connections (firewall-friendly).'] },
      { h: 'Common commands' },
      { table: { head: ['Command', 'Meaning'], rows: [['USER / PASS', 'Log in'], ['LIST', 'List directory'], ['RETR file', 'Download'], ['STOR file', 'Upload'], ['CWD / PWD', 'Change / show directory'], ['DELE', 'Delete a file'], ['TYPE A / I', 'ASCII or binary (image)'], ['PORT / PASV', 'Active / passive data connection'], ['QUIT', 'Log out']] } },
      { h: 'Communication over data' },
      { ul: ['**File types**: ASCII, EBCDIC, image (binary).', '**Data structures**: file, record, page.', '**Transmission modes**: **stream** (default, a continuous stream of bytes, end marked by closing the connection), **block** (data in blocks with headers), **compressed** (run-length compression).'] },
      { h: 'Anonymous FTP' },
      'Public sites let anyone log in as "anonymous". Risks: no authentication or encryption, servers can be abused to store/share illegal files, writable directories can be exploited, and passwords/data travel in clear text.',
      { h: 'FTP vs HTTP vs SFTP' },
      { table: { head: ['', 'FTP', 'HTTP', 'SFTP'], rows: [['Connections', 'Separate control + data', 'One connection', 'One SSH connection'], ['State', 'Stateful session (current directory)', 'Stateless', 'Stateful'], ['Security', 'Plain text', 'Plain (HTTPS encrypted)', 'Encrypted (SSH)'], ['Ports', '21 / 20', '80 / 443', '22']] } },
    ],
    terms: [['Control connection', 'Persistent TCP connection carrying FTP commands.'], ['Passive mode', 'Client opens the data connection to a server port.']],
    exam: 'Draw the FTP model with both connections, then commands, file types/structures/modes, anonymous FTP.',
    revise: ['Control 21 (whole session), data 20 (per file)', 'Modes: stream, block, compressed', 'FTP plain text; SFTP over SSH'],
  },

  'cn.u5.telnet': {
    oneLine: 'TELNET lets a user log in to a remote computer and use it as if their keyboard and screen were attached to it, using a Network Virtual Terminal over TCP port 23.',
    blocks: [
      { ul: [
        '**Local login**: keystrokes go straight to the local OS. **Remote login**: the TELNET client sends keystrokes over TCP to the TELNET server, which passes them to the remote OS through a pseudo-terminal.',
        '**NVT (Network Virtual Terminal)**: a universal character set and conventions. The client translates local characters to NVT; the server translates NVT to the remote system\'s format. This hides differences between computers.',
        '**Control characters**: special NVT codes preceded by **IAC** (Interpret As Command, byte 255), e.g. interrupt process, erase character.',
        '**Option negotiation**: WILL, WON\'T, DO, DON\'T (e.g. echo, terminal type, binary mode).',
        'Modes: default (line-by-line), character mode, line mode.',
      ] },
      { warn: 'TELNET sends everything, including passwords, in plain text. **SSH** (port 22) replaced it for remote login.' },
      { gap: 'No past questions yet; this follows Forouzan\'s TELNET section and CN Notes3 p91–92.' },
    ],
    terms: [['NVT', 'Network Virtual Terminal: standard character set for TELNET.'], ['IAC', 'Interpret As Command (byte 255).']],
    exam: 'Local vs remote login diagram, NVT, control characters, option negotiation, and the security note.',
    revise: ['TELNET = remote login, TCP 23', 'NVT hides terminal differences', 'Plain text → use SSH'],
  },

  'cn.u5.snmp': {
    oneLine: 'SNMP lets a network manager monitor and control routers, switches and servers: managers send requests to agents, which answer from their MIB and can send traps on events.',
    blocks: [
      { img: 'cn-snmp' },
      { h: 'Components' },
      { ul: ['**Manager**: station running the SNMP client; polls agents and sets values.', '**Agent**: SNMP server on each managed device; keeps data about the device.', '**MIB (Management Information Base)**: the collection of objects an agent manages (e.g. interface counters).', '**SMI (Structure of Management Information)**: rules for naming objects (OIDs in a tree), their types and encoding (BER).'] },
      { h: 'How it works (PDUs)' },
      { table: { head: ['PDU', 'Direction', 'Meaning'], rows: [['GetRequest', 'Manager → agent', 'Read a value'], ['GetNextRequest', 'Manager → agent', 'Read the next object (walk a table)'], ['GetBulkRequest', 'Manager → agent', 'Read a lot of data at once'], ['SetRequest', 'Manager → agent', 'Change a value'], ['Response', 'Agent → manager', 'Answer'], ['Trap', 'Agent → manager', 'Unsolicited event report (e.g. link down)'], ['InformRequest', 'Manager → manager', 'Acknowledged notification']] } },
      'SNMP uses **UDP**: port **161** for requests, **162** for traps.',
      { h: 'Fault management' },
      'Detect faults (traps, polling), isolate them, fix or work around them, and log them. SNMP supports **reactive** (respond to traps) and **proactive** (watch trends in counters) fault management.',
      { h: 'Issues' },
      'SNMPv1/v2c send the "community string" password in clear text (weak security; fixed by **SNMPv3** with authentication and encryption); polling many devices adds traffic; UDP means messages can be lost.',
    ],
    terms: [['MIB', 'Database of managed objects on an agent.'], ['Trap', 'Agent-initiated alert.'], ['OID', 'Object identifier in the MIB tree.']],
    exam: 'Manager/agent figure, MIB + SMI, the PDU table with ports, then issues/security.',
    revise: ['Manager, agent, MIB, SMI', 'Get, GetNext, GetBulk, Set, Response, Trap', 'UDP 161/162; SNMPv3 adds security'],
  },
}
