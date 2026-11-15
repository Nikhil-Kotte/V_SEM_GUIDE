// Computer Networks: a 2-mark question bank for each unit, with full-mark answers.
//   from:  the PYQ this question was asked as (its papers and class tests are shown and drive the order:
//          class-test questions first, then the most-asked); omitted for likely questions.
//   q:     the question as it would be set for 2 marks.
//   a:     the answer: a definition plus the points an examiner looks for (content blocks).
// Answers for questions linked with `from` also serve as that PYQ's model answer when it has none.
export default [
  {
    unit: 'I',
    items: [
      { id: 'b1-topologies', from: 'cn-four-topologies', q: 'Show the different network topologies using neat sketches.', a: [
        '**Topology** is the geometric arrangement of the links and nodes of a network. The four basic topologies:',
        { img: 'cn-topologies' },
        { ul: ['**Mesh**: every device has a dedicated link to every other (n(n − 1)/2 links).', '**Star**: every device is linked to a central hub or switch.', '**Bus**: all devices tap into one backbone cable.', '**Ring**: each device is linked to its two neighbours, forming a loop.'] },
      ] },
      { id: 'b1-mesh7', from: 'cn-num-mesh7', q: '7 devices are arranged in a mesh topology. How many cables are needed, and how many ports does each device need?', a: [
        { formula: 'Cables = n(n − 1) / 2        Ports per device = n − 1' },
        'n = 7: cables = 7 × 6 / 2 = **21**; ports per device = 7 − 1 = **6**. (For 12 devices, asked in Class Test I: 66 cables, 11 ports.)',
      ] },
      { id: 'b1-protocol', from: 'cn-define-protocol', q: 'Define (i) computer network (ii) protocol.', a: [
        '**Computer network**: a set of devices (nodes) such as computers and printers connected by communication links so that they can share data and resources.',
        '**Protocol**: a set of rules that governs data communication: **what** is communicated, **how** and **when**. Its key elements are **syntax** (format of the data), **semantics** (meaning of each field) and **timing** (when and how fast to send). Example: TCP, IP, HTTP.',
      ] },
      { id: 'b1-host-client', from: 'cn-host-client', q: 'Distinguish between host and client.', a: [
        { table: { head: ['Host', 'Client'], rows: [['Any end device on a network that runs applications and has an address (PC, server, phone)', 'A host (or program) that **requests** a service from a server'], ['A role-neutral term: a host may be a client, a server or both', 'Defined by its role in the client-server model'], ['Example: every computer on the college LAN', 'Example: a browser requesting a web page from a web server']] } },
      ] },
      { id: 'b1-nic', from: 'cn-nic', q: 'What is the purpose of a NIC?', a: [
        'A **network interface card (NIC)** is the hardware that connects a computer to the network medium. It:',
        { ul: ['converts data between the computer\'s parallel form and the serial signals on the cable or radio;', 'holds the unique 48-bit **physical (MAC) address** of the device;', 'performs data link functions such as framing, error detection (CRC) and medium access (e.g. CSMA/CD in Ethernet).'] },
      ] },
      { id: 'b1-guided', from: 'cn-guided-unguided', q: 'How do guided media differ from unguided media?', a: [
        { table: { head: ['Guided (wired)', 'Unguided (wireless)'], rows: [['Signal travels along a **physical conductor** that directs it', 'Signal is broadcast through **free space** (air) as electromagnetic waves'], ['Twisted pair, coaxial cable, optical fibre', 'Radio waves, microwaves, infrared'], ['More secure, less interference, point-to-point', 'Mobility and easy deployment, but more interference and less secure']] } },
      ] },
      { id: 'b1-twist', from: 'cn-twisted-interference', q: 'How does a twisted-pair cable reduce interference?', a: [
        'In twisted pair, the two wires are **twisted around each other**. Along the cable, each wire is alternately closer to and farther from any noise source, so **both wires pick up the same noise**. The receiver uses the **difference** between the two wires, so the equal noise **cancels out**. Twisting also reduces crosstalk between neighbouring pairs; more twists per metre give better protection.',
      ] },
      { id: 'b1-multipoint', from: 'cn-multipoint', q: 'What are the advantages of a multipoint connection over a point-to-point connection?', a: [
        'In a **multipoint** (multidrop) connection more than two devices share one link. Advantages:',
        { ul: ['**Less cabling and fewer ports**, so lower cost.', 'Easy to **add a device**: just tap into the existing link.', 'The link\'s capacity is **shared** (spatially or by time), so it is used more fully when traffic is bursty.'] },
      ] },
      { id: 'b1-layers', from: 'cn-layered-reasons', q: 'Name any two reasons for using layered protocols.', a: [
        { ul: ['**Divides a complex problem into smaller, manageable parts**: each layer does one well-defined job.', '**Modularity / independence**: a layer\'s implementation can change (e.g. Wi-Fi instead of Ethernet) without affecting the other layers, as long as the interface stays the same.', 'Also: **standardisation** and **interoperability** between vendors, and easier design, testing and teaching.'] },
      ] },
      { id: 'b1-internet', from: 'cn-internet', q: 'Explain briefly about the Internet.', a: [
        'The **Internet** is a worldwide **network of networks**: millions of LANs and WANs interconnected by routers and run by many ISPs, all using the **TCP/IP** protocol suite. It is organised hierarchically: customers connect to local ISPs, which connect to regional ISPs and then to national **backbone** networks, joined at Internet exchange points. Services include the Web, e-mail, file transfer and streaming.',
      ] },
      { id: 'b1-circuit', from: 'cn-circuit-points', q: 'Write any four important points about circuit switching.', a: [
        { ul: ['A **dedicated path** is set up between the two ends before data is sent.', 'Three phases: **setup, data transfer, teardown**.', 'Resources (bandwidth) are **reserved** for the whole call, even when idle.', 'Data flows continuously, **in order**, with constant delay; there is no addressing per message. Used by the telephone network (physical layer).'] },
      ] },
      { id: 'b1-fibre', from: 'cn-fiber-side', q: 'Draw a side view of a fibre-optic cable and name its parts.', a: [
        { img: 'cn-fiber' },
        'Parts: the **core** (thin glass that carries the light), the **cladding** (glass of lower refractive index that reflects light back into the core), a **buffer** coating, **strength fibres** (Kevlar) and the outer **jacket**. Light stays in the core by **total internal reflection**.',
      ] },
      { id: 'b1-dataflow', q: 'What are simplex, half-duplex and full-duplex modes?', a: [
        { ul: ['**Simplex**: data flows in **one direction only** (keyboard → computer).', '**Half-duplex**: both sides can send, but **not at the same time** (walkie-talkie).', '**Full-duplex**: both sides send and receive **at the same time** (telephone call).'] },
        { img: 'cn-dataflow' },
      ] },
      { id: 'b1-components', q: 'List the five components of a data communication system.', a: [
        { ol: ['**Message**: the information to be sent.', '**Sender**: the device that sends it.', '**Receiver**: the device that receives it.', '**Transmission medium**: the physical path (cable, fibre, radio).', '**Protocol**: the rules that govern the communication.'] },
      ] },
      { id: 'b1-encap', q: 'What is encapsulation in the layered model?', a: [
        'As data moves **down** the layers at the sender, each layer adds its own **header** (and the data link layer a **trailer**) to the data unit it receives from the layer above, treating that whole unit as its payload. This wrapping is **encapsulation**. At the receiver each layer removes its own header as the data moves up (decapsulation). Example: segment → packet → frame → bits.',
      ] },
      { id: 'b1-osi-tcpip', q: 'Give any two differences between the OSI and TCP/IP models.', a: [
        { table: { head: ['OSI', 'TCP/IP'], rows: [['7 layers', '4 layers'], ['Model defined before the protocols', 'Protocols came first'], ['Network layer: connection-oriented and connectionless', 'Network layer: connectionless only'], ['Separate session and presentation layers', 'Merged into the application layer']] } },
      ] },
    ],
  },
  {
    unit: 'II',
    items: [
      { id: 'b2-ecc', from: 'cn-mid-ecc-list', q: 'List the various error correction codes.', a: [
        'Error-correcting (forward error correction) codes add enough redundancy for the receiver to work out the original data:',
        { ul: ['**Hamming code** (single-bit correction; check bits at positions 1, 2, 4, 8, …).', '**Binary convolutional codes** (used in Wi-Fi, mobile networks).', '**Reed-Solomon codes** (good for burst errors: CDs, DVDs, DSL).', '**LDPC (low-density parity check) codes** (used in 10 Gbps Ethernet, Wi-Fi, 5G).', 'Also simple **repetition codes** and **two-dimensional parity** (can correct a single error).'] },
      ] },
      { id: 'b2-piggyback', from: 'cn-mid-piggyback', q: 'What is piggybacking? How does it improve network efficiency?', a: [
        '**Piggybacking** is delaying an outgoing **acknowledgement** so that it can be attached to the **next outgoing data frame** (in its ack field), instead of sending a separate ACK frame.',
        { ul: ['It saves bandwidth: the ACK costs only a few header bits instead of a whole frame with its own header and checksum.', 'Fewer frames mean fewer interrupts and buffers at the receiver.', 'If no data frame is ready within a short time (the ack timer), a separate ACK is sent so the sender does not time out.'] },
      ] },
      { id: 'b2-framing', from: 'cn-framing', q: 'Discuss framing in the data link layer.', a: [
        '**Framing** is breaking the bit stream from the physical layer into **discrete frames** so the receiver can find where each frame starts and ends and check it with a checksum. Methods:',
        { ul: ['**Character count**: a header field gives the length.', '**Flag bytes with byte stuffing**: FLAG at both ends; an ESC byte is inserted before accidental FLAG/ESC in the data.', '**Flags with bit stuffing**: flag 01111110; a 0 is stuffed after five 1s in the data.', '**Physical layer coding violations**: unused signal patterns mark boundaries.'] },
      ] },
      { id: 'b2-services', from: 'cn-dll-services', q: 'What are the services provided by the data link layer to the network layer?', a: [
        { ul: ['**Unacknowledged connectionless service**: frames sent without acknowledgement or connection; used on low-error lines (Ethernet) and for real-time traffic.', '**Acknowledged connectionless service**: each frame acknowledged individually, no connection; used on unreliable links (wireless).', '**Acknowledged connection-oriented service**: connection set up, frames numbered, each delivered exactly once and in order.'] },
      ] },
      { id: 'b2-error-why', from: 'cn-error-why', q: 'Why is error detection important in the data link layer?', a: [
        'Transmission media are noisy (especially wireless and copper local loops), so **bits can be flipped** by interference, attenuation or crosstalk, often in bursts. If damaged frames were passed up, the network layer would receive **corrupt data** without knowing it. Error detection (parity, checksum, CRC) lets the receiver **discard bad frames and ask for retransmission**, so the link appears error-free to the layer above, hop by hop.',
      ] },
      { id: 'b2-seq-timers', from: 'cn-seq-timers', q: 'In reliable data transfer protocols, why do we need sequence numbers and timers?', a: [
        { ul: ['**Timers**: a frame or its acknowledgement may be **lost completely**. Without a timer the sender would wait forever; when the timer expires it **retransmits**.', '**Sequence numbers**: a retransmission after a lost ACK creates a **duplicate**. The sequence number lets the receiver tell a **new frame from a duplicate** and discard the copy, and lets ACKs say which frame they confirm.'] },
      ] },
      { id: 'b2-hamming-dist', from: 'cn-hamming-distance', q: 'What is Hamming distance? What is the minimum Hamming distance?', a: [
        '**Hamming distance** d(x, y) between two codewords is the **number of bit positions in which they differ**, found by XOR-ing them and counting the 1s. Example: 10001001 ⊕ 10110001 = 00111000, so d = 3.',
        'The **minimum Hamming distance** of a code is the smallest distance between any two valid codewords. To **detect** s errors it must be at least **s + 1**; to **correct** t errors at least **2t + 1**.',
      ] },
      { id: 'b2-crc-use', from: 'cn-crc-use', q: 'Outline the use of the cyclic redundancy check.', a: [
        'CRC is a powerful **error-detection** method used in Ethernet, Wi-Fi and HDLC. The sender appends r zeros to the data, divides by an agreed **generator polynomial** G(x) of degree r using modulo-2 division, and appends the **remainder** (the CRC). The receiver divides the received frame by G(x): **remainder 0 = accept**, otherwise discard. It detects all single-bit errors, all odd numbers of errors (if G has the factor x + 1) and all bursts of length ≤ r.',
      ] },
      { id: 'b2-burst', from: 'cn-single-burst', q: 'Explain single-bit errors and burst errors with examples.', a: [
        { ul: ['**Single-bit error**: only **one bit** of the data unit changes. Sent 00000010, received 00001010 (one bit flipped).', '**Burst error**: **two or more bits** change; the burst length is counted from the first corrupted bit to the last. Sent 0100010001000011, received 0101110101000011: burst of length 8. Bursts are common because noise usually lasts longer than one bit time.'] },
      ] },
      { id: 'b2-sr-adv', from: 'cn-sr-advantage', q: 'What is the advantage of Selective Repeat ARQ over Go-Back-N ARQ?', a: [
        'In **Go-Back-N**, one lost frame forces the sender to retransmit that frame **and all frames after it**, even those received correctly. In **Selective Repeat**, the receiver **buffers** correctly received out-of-order frames and only the **lost frame is retransmitted** (often after a NAK). So selective repeat **wastes far less bandwidth** on noisy links, at the cost of more receiver buffers and complexity.',
      ] },
      { id: 'b2-slotted', from: 'cn-slotted-aloha-adv', q: 'Mention the advantages of the slotted ALOHA protocol.', a: [
        { ul: ['Frames start only at slot boundaries, so the **vulnerable time halves** from 2t to t.', '**Double the maximum throughput** of pure ALOHA: 36.8% (at G = 1) instead of 18.4%.', 'Still simple and fully decentralised; a single active station can use the whole channel.'] },
      ] },
      { id: 'b2-ma', from: 'cn-multiple-access', q: 'What are the various multiple access protocols?', a: [
        { ul: ['**Random access (contention)**: ALOHA (pure, slotted), CSMA (1-persistent, non-persistent, p-persistent), CSMA/CD, CSMA/CA.', '**Controlled access (collision-free)**: reservation (bit-map), polling, token passing, binary countdown.', '**Channelisation**: FDMA, TDMA, CDMA.'] },
      ] },
      { id: 'b2-minframe', from: 'cn-num-min-frame', q: 'Bandwidth 20 × 10⁶ bps, CSMA/CD, maximum propagation time 40 µs. Find the minimum frame size in bytes.', a: [
        'A station must still be transmitting when news of a collision returns, i.e. for **2τ**.',
        { formula: 'Minimum frame size = 2 × τ × bandwidth' },
        '= 2 × 40 × 10⁻⁶ s × 20 × 10⁶ bps = **1600 bits = 200 bytes**.',
      ] },
      { id: 'b2-bitstuff', q: 'What is bit stuffing? Give an example.', a: [
        'In bit-oriented framing each frame begins and ends with the flag **01111110**. To stop the flag appearing inside the data, the sender **inserts a 0 after every five consecutive 1s** in the data; the receiver removes it.',
        'Example: data **01111110** (which looks like the flag) is sent on the line as **011111**0**10**: a 0 is stuffed after the five 1s. The receiver sees five 1s followed by a 0 and deletes that 0.',
      ] },
      { id: 'b2-aloha-vuln', q: 'What is the vulnerable time in pure and slotted ALOHA?', a: [
        'The **vulnerable time** is the period during which another transmission would collide with a frame. With frame time t: **pure ALOHA = 2t** (any start from t₀ − t to t₀ + t collides), **slotted ALOHA = t** (only frames in the same slot collide). Maximum throughputs are S = Ge⁻²ᴳ = 18.4% and S = Ge⁻ᴳ = 36.8%.',
      ] },
      { id: 'b2-csmacd', q: 'What is CSMA/CD?', a: [
        '**Carrier sense multiple access with collision detection**: a station **listens** before sending and sends when the channel is idle; while sending it **keeps listening**, and if it detects a **collision** it stops at once, sends a short **jam signal**, waits a random **binary exponential backoff** time and tries again. Used in classic Ethernet; a collision is always detected within 2τ.',
      ] },
    ],
  },
  {
    unit: 'III',
    items: [
      { id: 'b3-optimality', from: 'cn-optimality', q: 'Define the optimality principle.', a: [
        '**Optimality principle**: if router J is on the optimal path from router I to router K, then the optimal path from J to K also falls along the same route.',
        'Proof: if a better route from J to K existed, joining it to the I-to-J part would give a better I-to-K route, a contradiction. Consequence: the optimal routes from all sources to one destination form a **sink tree** with no loops.',
      ] },
      { id: 'b3-qos-priority', from: 'cn-mid-qos-priority', q: 'How does QoS ensure the prioritisation of specific types of traffic on a network?', a: [
        '**Quality of service** gives each flow the bandwidth, delay, jitter and loss it needs. Prioritisation is done by:',
        { ul: ['**Classifying and marking** packets (e.g. the DiffServ field in the IP header: voice marked expedited forwarding).', '**Packet scheduling** at routers: priority queues or weighted fair queueing serve high-priority (real-time) traffic first.', '**Traffic shaping and policing** (leaky/token bucket) keep each flow within its agreed rate.', '**Resource reservation and admission control** (IntServ/RSVP) reserve bandwidth and buffers for important flows and refuse flows the network cannot carry.'] },
      ] },
      { id: 'b3-bgp', from: 'cn-bgp', q: 'What is the use of BGP?', a: [
        '**BGP (Border Gateway Protocol)** is the **exterior gateway protocol** used to route packets **between autonomous systems** (ISPs, large organisations) in the Internet. It is a **path vector** protocol: routers exchange the full list of ASes on the path to each destination over TCP, reject paths that loop back through themselves, and choose routes according to **policies** (politics, cost, security, no transit traffic).',
      ] },
      { id: 'b3-routing', from: 'cn-routing-define', q: 'Define routing algorithms in computer networks.', a: [
        'A **routing algorithm** is the part of the network layer software that decides **which output line an incoming packet should be sent on**, by building and maintaining routing tables. Desirable properties: correctness, simplicity, robustness, stability, fairness and optimality. Classes: **non-adaptive (static)**, e.g. shortest path computed offline, flooding; and **adaptive (dynamic)**, e.g. distance vector and link state.',
      ] },
      { id: 'b3-nat', from: 'cn-nat', q: 'What is NAT?', a: [
        '**Network Address Translation** lets many hosts with **private addresses** (10/8, 172.16/12, 192.168/16) share **one public IP address**. The NAT box at the network edge replaces the private source address and port of each outgoing packet with its public address and a new port, records the mapping in a table, and reverses the change for replies. It eases **IPv4 address depletion** and hides internal addresses.',
      ] },
      { id: 'b3-nl-functions', from: 'cn-nl-functions', q: 'What are the two most important network-layer functions in a datagram network? What are the three in a virtual-circuit network?', a: [
        { ul: ['**Datagram network**: (1) **routing**: computing the routes (tables); (2) **forwarding**: sending each packet to the right output line using the table.', '**Virtual-circuit network**: (1) **routing** and (2) **forwarding**, plus (3) **call setup**: establishing the virtual circuit (and tearing it down) before data flows.'] },
      ] },
      { id: 'b3-tunnel', from: 'cn-tunneling', q: 'State the tunnelling concept.', a: [
        '**Tunnelling** carries packets of one protocol **inside packets of another** across a network that does not understand the first. Example: to send IPv6 packets across an IPv4-only network, the router at the entry **encapsulates** each IPv6 packet in an IPv4 packet addressed to the router at the exit, which removes the IPv4 header and forwards the IPv6 packet.',
        { img: 'cn-p21' },
      ] },
      { id: 'b3-cti', from: 'cn-count-infinity-two', q: 'What is count-to-infinity in distance vector routing? List two ways to overcome it.', a: [
        'When a link or router fails, neighbours keep advertising old routes to each other, so distances to the unreachable destination **rise by one per exchange** until they reach "infinity": **bad news travels slowly**.',
        'Remedies: **split horizon** (do not advertise a route back on the line it was learned from), **poisoned reverse** (advertise it back with distance ∞), **hold-down timers**, and a small value for infinity (16 in RIP).',
      ] },
      { id: 'b3-flooding', from: 'cn-flooding-example', q: 'What is flooding?', a: [
        '**Flooding** is a static routing algorithm in which **every incoming packet is sent out on every outgoing line except the one it arrived on**. It always finds the shortest path and is very robust, but generates huge numbers of duplicates, which are limited by a **hop counter** or by remembering packets already seen. Used in military networks, for distributing link state packets and at start-up.',
      ] },
      { id: 'b3-classful', from: 'cn-classful', q: 'Differentiate classful and classless addressing in IPv4.', a: [
        { table: { head: ['Classful', 'Classless (CIDR)'], rows: [['Address space divided into fixed classes A, B, C (D, E)', 'No classes'], ['Prefix length fixed by class: /8, /16, /24', 'Any prefix length, written a.b.c.d/n'], ['Wastes addresses (blocks too big or too small)', 'Blocks sized to need; route aggregation keeps tables small'], ['Class found from the first bits', 'Prefix length must be given (slash notation)']] } },
      ] },
      { id: 'b3-ip-eth', from: 'cn-ip-vs-ethernet', q: 'IP addresses are tied to specific networks, but Ethernet addresses are not. Why?', a: [
        'An **IP address** has a **network prefix** that identifies the network the interface is attached to, so routers can forward packets by looking at the prefix only; if a host moves to another network it needs a new IP address. An **Ethernet (MAC) address** is a flat 48-bit number burned into the NIC by the manufacturer; it only identifies the interface on the local link, is not used for routing, and stays the same wherever the card goes.',
      ] },
      { id: 'b3-sink', q: 'What is a sink tree?', a: [
        'The set of **optimal routes from all routers to one destination** forms a tree rooted at that destination, called a **sink tree** (a consequence of the optimality principle). It has **no loops**, so every packet reaches the destination in a bounded number of hops. Routing algorithms aim to discover and use the sink tree of every router.',
        { img: 'cn-sink-tree' },
      ] },
      { id: 'b3-cidr', q: 'For the address 167.199.170.82/27, find the number of addresses and the first and last address of the block.', a: [
        { ul: ['Number of addresses = 2^(32 − 27) = 2⁵ = **32**.', 'Last byte 82 = 01010010; keep the first 3 bits (27 − 24): **first** = 01000000 = **167.199.170.64**.', 'Set the last 5 bits to 1: 01011111 = **167.199.170.95** (**last**). Mask = 255.255.255.224.'] },
      ] },
      { id: 'b3-frag', q: 'What is fragmentation in IPv4?', a: [
        'When a datagram is larger than the **MTU** of the next network (e.g. 1500 bytes for Ethernet), it is split into smaller **fragments**, each with its own IP header. The **Identification** field (same in all fragments), the **MF** (more fragments) flag and the **Fragment offset** (in 8-byte units) let the **destination** reassemble them. The **DF** flag forbids fragmentation.',
      ] },
      { id: 'b3-jitter', q: 'Define jitter. Why does it matter for audio and video?', a: [
        '**Jitter** is the **variation in packet arrival times** (delay variation) within a flow. Audio and video must be played out at a steady rate; if packets arrive irregularly, the playback stutters or has gaps. Even a few milliseconds of jitter is audible in voice, so real-time traffic needs low jitter (achieved with buffering at the receiver and QoS scheduling in the network).',
      ] },
    ],
  },
  {
    unit: 'IV',
    items: [
      { id: 'b4-tcp-udp', from: 'cn-tcp-vs-udp', q: 'Compare TCP and UDP (any four points).', a: [
        { table: { head: ['TCP', 'UDP'], rows: [['Connection-oriented (three-way handshake)', 'Connectionless'], ['Reliable: ACKs, retransmission, in-order delivery', 'Unreliable: no ACKs, no ordering'], ['Flow and congestion control', 'None'], ['20–60 byte header; byte stream', '8-byte header; datagrams'], ['HTTP, FTP, SMTP', 'DNS, RTP (voice/video), SNMP, DHCP']] } },
      ] },
      { id: 'b4-fast', from: 'cn-fast-transaction', q: 'For the fastest possible remote transaction, would you use UDP or TCP? Why?', a: [
        '**UDP**. A remote transaction (one request, one reply) over TCP needs a **three-way handshake** before the request and a connection release afterwards, adding at least one extra round trip. UDP sends the request immediately in one datagram and gets the reply in one datagram; if it is lost, the application simply retries. That is why DNS and RPC use UDP.',
      ] },
      { id: 'b4-why-tcp', from: 'cn-why-tcp-apps', q: 'Why do HTTP, FTP, SMTP and POP3 run on top of TCP rather than UDP?', a: [
        'These applications transfer web pages, files and mail that must arrive **complete, correct and in order**: a single lost or reordered byte corrupts the file or message. TCP provides **reliable, ordered byte-stream delivery** with retransmission, flow control and congestion control, so the applications do not have to implement reliability themselves. Their data is not so time-critical that retransmission delay matters.',
      ] },
      { id: 'b4-events', from: 'cn-three-events', q: 'The transport layer creates a connection between the source and destination. What are the three events involved?', a: [
        { ol: ['**Connection establishment**: the two ends agree to communicate and set initial parameters (TCP three-way handshake: SYN, SYN + ACK, ACK).', '**Data transfer**: data is exchanged in both directions with sequencing, acknowledgement and flow control.', '**Connection release (termination)**: both sides close the connection (TCP: FIN and ACK in each direction).'] },
      ] },
      { id: 'b4-udp-size', from: 'cn-udp-size', q: 'What are the maximum and minimum sizes of process data that can be encapsulated in a UDP datagram?', a: [
        'The UDP length field is 16 bits, so a UDP datagram can be at most 65,535 bytes, and it must also fit in one IP packet: 65,535 − 20 (IP header) − 8 (UDP header) = **65,507 bytes** of data at most (Tanenbaum quotes 65,515 for the UDP length). The **minimum** is **0 bytes** of data (an 8-byte datagram with only the header).',
      ] },
      { id: 'b4-udp-adds', from: 'cn-udp-adds', q: 'What does UDP provide that is not provided by IP?', a: [
        'IP delivers packets **host to host**. UDP adds: **port numbers**, so data is delivered **process to process** and many applications can share one IP address (multiplexing and demultiplexing); and an **end-to-end checksum** over the header and data (plus pseudoheader). Otherwise UDP is as unreliable as IP: no acknowledgements, ordering or flow control.',
      ] },
      { id: 'b4-credit', from: 'cn-flow-control', q: 'Briefly describe the credit scheme used for flow control in TCP.', a: [
        'The receiver tells the sender how much buffer space it has: every segment carries an **acknowledgement number** and a **window (credit)**, the number of bytes, starting at the acknowledged byte, that the sender may still send. The sender never has more than that many unacknowledged bytes outstanding. A window of 0 stops the sender; the persistence timer and window probes prevent deadlock if a window update is lost.',
      ] },
      { id: 'b4-fourway', from: 'cn-four-way', q: 'What is four-way handshaking? In which protocol is it used?', a: [
        'It is the way **TCP releases a connection**. Because TCP is full-duplex, each direction is closed separately: (1) host A sends **FIN**, (2) B replies **ACK** (A → B closed, B may still send), (3) B sends its own **FIN**, (4) A replies **ACK**. A then waits in **TIME_WAIT** (2 × MSL) before closing. (Steps 2 and 3 are often combined.)',
        { img: 'tcp-release' },
      ] },
      { id: 'b4-conn', from: 'cn-conn-vs-connless', q: 'Differentiate connection-oriented and connectionless protocols.', a: [
        { table: { head: ['Connection-oriented', 'Connectionless'], rows: [['Connection set up before data, released after', 'No setup: each packet sent independently'], ['Reliable, ordered delivery; acknowledgements', 'No guarantee of delivery or order'], ['More overhead and delay', 'Low overhead; faster for short exchanges'], ['TCP', 'UDP, IP']] } },
        'Connectionless is more efficient for short, one-shot exchanges (DNS); connection-oriented is more efficient for long, reliable transfers, since lost data is recovered automatically.',
      ] },
      { id: 'b4-socket', q: 'What is a socket? List the TCP socket primitives.', a: [
        'A **socket** is an endpoint of communication: an **IP address plus a port number**. A TCP connection is identified by the pair of sockets at its two ends.',
        'Primitives: **SOCKET** (create), **BIND** (attach a local address), **LISTEN** (be willing to accept), **ACCEPT** (wait for and accept a connection), **CONNECT** (open a connection), **SEND**, **RECEIVE**, **CLOSE**.',
      ] },
      { id: 'b4-tsap', q: 'Define TSAP and NSAP.', a: [
        '**TSAP (transport service access point)**: a transport-layer endpoint that a process attaches to so others can connect to it; in the Internet it is a **port**. **NSAP (network service access point)**: a network-layer address; in the Internet it is an **IP address**. A transport connection runs from a TSAP on one host to a TSAP on another, through the hosts\' NSAPs.',
      ] },
      { id: 'b4-silly', q: 'What is silly window syndrome? How is it avoided?', a: [
        'When the receiving application reads data **one byte at a time**, the receiver advertises a **1-byte window** each time, and the sender sends 1-byte segments: huge overhead (40+ header bytes per data byte). **Clark\'s solution**: the receiver advertises new space only when it can take a **maximum segment** or its buffer is **half empty**. On the sender side, **Nagle\'s algorithm** batches small writes.',
      ] },
      { id: 'b4-slowstart', q: 'What is slow start in TCP?', a: [
        'TCP\'s way of probing the network at the start of a connection (and after a timeout): the **congestion window** begins at **1 MSS** and grows by 1 MSS for every acknowledged segment, so it **doubles every round-trip time** (1, 2, 4, 8 …) until it reaches the **slow start threshold**; after that it grows by only 1 MSS per RTT (congestion avoidance). On a timeout the threshold is halved and slow start restarts.',
      ] },
      { id: 'b4-timewait', q: 'Why does TCP use the TIME_WAIT state?', a: [
        'The side that closes first waits **2 × MSL** (maximum segment lifetime) in TIME_WAIT before deleting the connection, so that (1) if its **final ACK was lost**, it can resend it when the other side retransmits its FIN, and (2) **old duplicate segments** of this connection die out before the same pair of sockets is reused by a new connection.',
      ] },
      { id: 'b4-flags', q: 'List the TCP header flags and their use.', a: [
        { ul: ['**URG**: urgent pointer is valid.', '**ACK**: acknowledgement number is valid.', '**PSH**: deliver the data to the application at once.', '**RST**: reset (abort) the connection or reject a segment.', '**SYN**: used to establish connections (synchronise sequence numbers).', '**FIN**: sender has finished; used to release the connection.'] },
      ] },
    ],
  },
  {
    unit: 'V',
    items: [
      { id: 'b5-dns-ip', from: 'cn-mid-dns-ip', q: 'A website is accessible through its IP address but not through its domain name. Identify the service responsible and state its role.', a: [
        'The service is **DNS (Domain Name System)**. Since the IP address works, the network path and server are fine; the failure is in **resolving the name to an address** (DNS server unreachable, wrong DNS settings, missing or wrong A record, stale cache).',
        'Role of DNS: a hierarchical, distributed database that **maps domain names to IP addresses** (A/AAAA records) and other information (MX for mail). The client\'s resolver sends a query (UDP port 53) to its DNS server, which returns the IP address so the browser can connect.',
      ] },
      { id: 'b5-fqdn', from: 'cn-fqdn', q: 'What are FQDN and PQDN? Give an example of each.', a: [
        { ul: ['**FQDN (fully qualified domain name)**: the complete name from the host up to the root, ending with a dot (the null root label). Example: **challenger.atc.fhda.edu.**', '**PQDN (partially qualified domain name)**: a name that does not reach the root; the resolver completes it by adding a **suffix**. Example: **challenger** (completed to challenger.atc.fhda.edu.).'] },
      ] },
      { id: 'b5-ddns', from: 'cn-ddns', q: 'Why was there a need for Dynamic DNS (DDNS)?', a: [
        'Originally the DNS master file was changed **manually** whenever a host was added, removed or changed address. With **DHCP**, addresses change often, so manual updates cannot keep up. **DDNS** lets the DHCP server send the new name–address binding to the **primary DNS server**, which updates the zone **automatically** and notifies the secondary servers. Security (authentication) is needed so others cannot change records.',
      ] },
      { id: 'b5-rr', from: 'cn-dns-rr', q: 'What is a domain resource record in DNS?', a: [
        'A **resource record** is an entry in the DNS database associated with a domain; a lookup returns the records for a name. It is a five-tuple: **(Domain_name, Time_to_live, Class, Type, Value)**. Common types: **A** (IPv4 address), **AAAA** (IPv6 address), **MX** (mail server), **NS** (name server), **CNAME** (alias), **PTR** (reverse lookup), **SOA** (zone parameters).',
      ] },
      { id: 'b5-hier', from: 'cn-hier-flat', q: 'What is the advantage of a hierarchical name space over a flat name space for the Internet?', a: [
        'In a **flat** name space every name must be unique and assigned by one **central authority**, which cannot scale to the Internet and is a bottleneck. In a **hierarchical** name space names have several parts (host.dept.org.tld), so authority can be **decentralised**: a central body assigns top-level and organisation names, and each organisation names its own hosts without conflicts. It also makes the **distributed DNS database** possible.',
      ] },
      { id: 'b5-ua', from: 'cn-ua', q: 'In electronic mail, what are the tasks of a user agent?', a: [
        'The **user agent** is the mail program the user interacts with. Its tasks: **composing** messages, **reading** messages (showing an inbox summary), **replying** to messages, **forwarding** messages, and **handling mailboxes** (inbox, outbox and folders on the user\'s computer). It hands outgoing mail to the mail server (SMTP) and fetches incoming mail (POP3/IMAP).',
      ] },
      { id: 'b5-pop-imap', from: 'cn-pop-imap', q: 'Differentiate POP3 and IMAP.', a: [
        { table: { head: ['POP3', 'IMAP4'], rows: [['TCP port 110', 'TCP port 143'], ['Downloads mail to the client, usually deleting it from the server', 'Keeps mail on the server'], ['No server-side folders', 'Create, rename, delete folders on the server'], ['No partial download or search', 'Check headers, search and partially download before downloading'], ['Best for one computer', 'Best when reading from several devices (phone and laptop)']] } },
      ] },
      { id: 'b5-ftp-cmds', from: 'cn-ftp-commands', q: 'List the FTP commands.', a: [
        { ul: ['Access: **USER**, **PASS**, **QUIT**.', 'Directory: **CWD**, **CDUP**, **PWD**, **MKD**, **RMD**, **LIST**, **NLST**.', 'File transfer: **RETR** (download), **STOR** (upload), **DELE** (delete), **RNFR/RNTO** (rename).', 'Settings: **TYPE** (A = ASCII, I = image), **MODE**, **STRU**, **PORT** (active) / **PASV** (passive).'] },
      ] },
      { id: 'b5-sftp', from: 'cn-sftp', q: 'Differentiate FTP and SFTP.', a: [
        { table: { head: ['FTP', 'SFTP'], rows: [['File Transfer Protocol', 'SSH File Transfer Protocol'], ['Sends user name, password and data in **plain text**', 'Everything is **encrypted** through SSH'], ['Two connections: control (21) and data (20 or a passive port)', 'One connection on port 22'], ['No built-in authentication beyond passwords', 'Supports key-based authentication']] } },
      ] },
      { id: 'b5-app', from: 'cn-app-protocols', q: 'List the application-layer protocols.', a: [
        { ul: ['**HTTP/HTTPS**: the Web (ports 80/443).', '**SMTP**: sending mail (25); **POP3** (110) and **IMAP** (143): reading mail.', '**FTP**: file transfer (20, 21); **TFTP**.', '**DNS**: name resolution (53).', '**TELNET** (23) and **SSH** (22): remote login.', '**SNMP**: network management (161/162); **DHCP**: address assignment.'] },
      ] },
      { id: 'b5-mx', q: 'What is an MX record?', a: [
        'An **MX (mail exchange)** resource record names the **mail server that accepts e-mail for a domain**, with a **priority** number. When mail is sent to user@cbit.ac.in, the sender\'s mail server looks up the MX records of cbit.ac.in and delivers to the listed server with the **lowest priority number** first, falling back to the others if it is unavailable.',
      ] },
      { id: 'b5-ftp-two', q: 'Why does FTP use two connections?', a: [
        'FTP separates **commands** from **data**. The **control connection** (port 21) stays open for the whole session and carries short commands and replies, which need low delay. A **data connection** (port 20 in active mode) is opened **for each file or listing**, needs high throughput, and its closing marks the end of the file. Separating them makes FTP simpler and more efficient.',
      ] },
      { id: 'b5-smtp-codes', q: 'What do SMTP reply codes 220, 250, 354 and 221 mean?', a: [
        { ul: ['**220**: service ready (sent when the connection opens).', '**250**: requested action completed (OK).', '**354**: start mail input; end with a line containing only ".".', '**221**: service closing the transmission channel (after QUIT).'] },
        'The first digit gives the class: 2xx success, 3xx more input needed, 4xx temporary failure, 5xx permanent failure.',
      ] },
      { id: 'b5-snmp', q: 'What are a manager, an agent and a Trap in SNMP?', a: [
        { ul: ['**Manager**: a host running the SNMP client that monitors and controls devices.', '**Agent**: a router or host running the SNMP server; it keeps performance variables in its **MIB**.', '**Trap**: a message the **agent sends on its own** to warn the manager of an unusual event (link down, reboot), without being asked.'] },
        'SNMP uses UDP: port 161 for requests to agents, 162 for traps.',
      ] },
      { id: 'b5-mib-smi', q: 'What are MIB and SMI?', a: [
        { ul: ['**SMI (Structure of Management Information)**: the rules for **naming** managed objects (object identifiers such as 1.3.6.1.2.1), defining their **types** (integer, counter, gauge, IP address, string) and **encoding** them.', '**MIB (Management Information Base)**: the actual **set of objects** each managed device must keep, grouped into categories such as system, interface, ip, tcp, udp.'] },
        'SNMP then reads and writes these objects.',
      ] },
    ],
  },
]
