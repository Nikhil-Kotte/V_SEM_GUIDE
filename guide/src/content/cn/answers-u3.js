// CN Unit III model answers (routing, QoS, IPv4, addressing, IPv6). Keyed by PYQ id.
const N3 = 'CN Notes3.pdf'
const T = 'Tanenbaum, Computer Networks'
const F = 'Forouzan, Data Communications and Networking'

export default {
  // ---------------- Routing ----------------
  'cn-link-state': {
    blocks: [
      'In **link state routing**, every router learns the **complete topology** of the network and computes the best paths itself. (Distance vector routing was replaced by link state in the ARPANET in 1979 because it converged too slowly: the count-to-infinity problem.) Each router must do **five things**:',
      { steps: [
        '**Discover its neighbours** and learn their network addresses: on boot, send a special **HELLO** packet on each point-to-point line; the router at the other end replies with its globally unique name.',
        '**Set the distance or cost metric** to each neighbour: commonly inversely proportional to bandwidth, or measured as delay by sending an **ECHO** packet that the other side returns immediately (round-trip time ÷ 2).',
        '**Construct a link state packet (LSP)** containing: the identity of the sender, a **sequence number**, an **age**, and the list of neighbours with the cost to each. Packets are built periodically or when a significant event occurs (a line goes down or comes up).',
        '**Distribute the packet to all other routers** by **flooding**. The sequence number lets routers discard duplicates and older packets (a router forwards a packet only if it is new); the **age** field is decremented every second and the packet is discarded at 0, so stale information disappears. Packets are acknowledged to make flooding reliable.',
        '**Compute the shortest path** to every other router: each router builds the full graph from all the LSPs and runs **Dijkstra\'s algorithm** locally, giving a shortest-path tree and its routing table.',
      ] },
      { h: 'Example' },
      { img: 'cn-p7' },
      'In network (a), router B\'s link state packet is: **B, seq, age; A 4, C 2, F 6**. Similarly E sends **E; A 5, C 1, F 8**, and so on. Every router floods its packet, so all six routers hold the same six packets = the full map. Each then runs Dijkstra from itself. For example from B: C (2), A (4), E via C (2 + 1 = 3), D via C (2 + 3 = 5), F via B directly (6) or via C–E (2 + 1 + 8 = 11) → choose B–F (6).',
      { h: 'Advantages and disadvantages' },
      { compare: [
        { title: 'Advantages', items: ['Fast convergence after a change', 'No count-to-infinity (every router has the whole map)', 'Each router computes its own routes: loop-free', 'Supports multiple metrics and large networks (with hierarchy)'] },
        { title: 'Disadvantages', items: ['More memory to store the topology database', 'More CPU to run Dijkstra', 'Flooding uses bandwidth', 'More complex to implement'] },
      ] },
      'Protocols that use link state: **OSPF** (Internet, inside an AS) and **IS-IS** (large ISPs).',
    ],
    sources: [`${N3} p7–8`, `${T} §5.2.5`],
  },

  'cn-dv-vs-ls': {
    blocks: [
      { table: { head: ['Basis', 'Distance vector routing', 'Link state routing'], rows: [
        ['Knowledge', 'Each router knows only the distance to every destination via each neighbour', 'Each router knows the complete topology'],
        ['What is shared', 'Its whole routing table (distance vector)', 'Only its own links (link state packet)'],
        ['Shared with', 'Only its neighbours', 'All routers (flooding)'],
        ['When', 'Periodically (e.g. every 30 s)', 'When something changes (+ periodic refresh)'],
        ['Algorithm', 'Bellman–Ford (distributed)', 'Dijkstra (local, on the full map)'],
        ['Convergence', 'Slow; suffers **count-to-infinity** ("good news travels fast, bad news slowly")', 'Fast; no count-to-infinity'],
        ['Resources', 'Little memory and CPU; less control traffic per update', 'More memory and CPU; flooding traffic'],
        ['Scalability', 'Small networks (max 15 hops in RIP)', 'Large networks with areas'],
        ['Loops', 'Possible during convergence', 'Rare'],
        ['Example protocols', '**RIP**, IGRP', '**OSPF**, IS-IS'],
      ] } },
      { h: 'Example' },
      'If link B–C fails: with DV, B only learns from neighbours\' tables and may believe A\'s stale route through B itself, slowly counting up to infinity. With LS, B floods a new packet saying "B–C is down"; every router immediately recomputes with Dijkstra and finds the alternative path.',
      { img: 'cn-p7' },
    ],
    sources: [`${N3} p5–8`, `${T} §5.2.4–5.2.5`],
  },

  'cn-ospf': {
    blocks: [
      '**OSPF (Open Shortest Path First)** is the Internet\'s main **intra-domain (interior gateway) routing protocol**. It is a **link state** protocol: routers flood link state advertisements (LSAs) and compute shortest paths with Dijkstra. An AS can be divided into **areas** with a backbone area 0.',
      { h: 'Basis of classification of the four link types' },
      'OSPF classifies a link by **what it connects to**: how many routers are attached and whether it carries transit traffic.',
      { table: { head: ['Link type', 'Connects', 'Example'], rows: [
        ['**Point-to-point**', 'Two routers directly, with no other host or router in between', 'A leased serial line between two routers'],
        ['**Transient**', 'A network with **several routers** attached; data can enter through one router and leave through another (transit traffic). A designated router represents the network', 'An Ethernet LAN with three routers'],
        ['**Stub**', 'A network connected to **only one router**; packets enter and leave through the same router', 'A department LAN behind a single router'],
        ['**Virtual**', 'A logical link created by the administrator when a physical link is broken, or to connect an area to the backbone through another area', 'Joining a disconnected area 0'],
      ] } },
      { img: 'cn-p37' },
      { h: 'Why OSPF messages propagate faster than RIP messages' },
      { ul: [
        '**RIP** (distance vector) sends its whole table to neighbours **every 30 seconds**. A change reaches a router n hops away only after each router in between receives the update, **recomputes** its own table and waits for its next timer: it moves one hop per update cycle.',
        '**OSPF** floods a **link state update immediately** when a link changes. Each router **forwards the LSA to its other neighbours at once**, before (or while) recomputing its routes. So the news crosses the whole area in about the time it takes to forward the packet hop by hop: milliseconds, not minutes.',
        'OSPF updates are small (only changed links), acknowledged, and do not depend on neighbours\' calculations; RIP also suffers count-to-infinity.',
      ] },
    ],
    sources: [`${N3} p35–37, p47–48`, `${F} ch. 20 (OSPF)`, `${T} §5.7.6`],
  },

  'cn-bgp': {
    blocks: [
      '**BGP (Border Gateway Protocol, version 4)** is the **inter-domain (exterior gateway) routing protocol** of the Internet: it exchanges routing information **between autonomous systems** (ASes), such as different ISPs.',
      { h: 'Uses' },
      { ul: [
        '**Reachability**: tells each AS which networks (prefixes) can be reached through its neighbours.',
        '**Policy-based routing**: lets an AS choose routes by business policy, e.g. never carry a competitor\'s transit traffic, prefer a cheaper provider, avoid certain countries.',
        '**Loop prevention**: BGP is a **path-vector** protocol: each advertisement carries the full list of ASes (AS path). A router rejects a route whose path already contains its own AS.',
        'Connects the Internet\'s thousands of ASes into one network: it is "the glue that holds the Internet together".',
      ] },
      { img: 'cn-bgp' },
      'BGP runs over **TCP (port 179)**. eBGP sessions are between routers of different ASes; iBGP distributes the learned routes inside an AS.',
    ],
    sources: [`${N3} p37–38`, `${T} §5.7.7`],
  },

  'cn-intra-inter': {
    blocks: [
      'The Internet is a collection of **autonomous systems (ASes)**: networks under one administration (an ISP, a university). Routing is therefore split into two levels.',
      { table: { head: ['Basis', 'Intra-AS (intra-domain) routing', 'Inter-AS (inter-domain) routing'], rows: [
        ['Scope', 'Inside one AS', 'Between ASes'],
        ['Also called', 'Interior gateway protocol (IGP)', 'Exterior gateway protocol (EGP)'],
        ['Protocols', 'RIP, OSPF, IS-IS', 'BGP-4'],
        ['Main goal', '**Performance**: shortest/fastest paths', '**Policy**: business, political, security rules decide routes'],
        ['Administration', 'One administrator, one policy, trusted routers', 'Many independent administrators; routers do not trust each other fully'],
        ['Metric', 'Hop count, cost, delay', 'AS path length + policy attributes'],
        ['Scale', 'Hundreds of routers', 'Whole Internet (hundreds of thousands of prefixes)'],
        ['Algorithm type', 'Distance vector or link state', 'Path vector'],
      ] } },
      { h: 'Why two levels?' },
      { ul: ['**Scale**: one protocol for the whole Internet would need impossibly large tables and too much traffic.', '**Administrative autonomy**: each organisation runs its network its own way and hides internal details.', '**Policy**: between ASes, routes must follow contracts, not just shortest distance.'] },
      'Border (gateway) routers run both: an IGP inside the AS and BGP towards neighbouring ASes.',
    ],
    sources: [`${N3} p32, p37–38`, `${T} §5.7.6–5.7.7`],
  },

  // ---------------- QoS ----------------
  'cn-traffic-shaping': {
    blocks: [
      '**Traffic shaping** is a technique for **regulating the average rate and burstiness** of a data flow entering the network. The user and the network agree on a traffic pattern (a service-level agreement); shaping makes the traffic conform, and **traffic policing** checks it. Shaping reduces congestion and helps the network meet its QoS guarantees. Two methods:',
      { h: '1. Leaky bucket' },
      'Imagine a bucket with a small hole in the bottom. Water poured in at any rate leaves the hole at a **constant rate**; if the bucket is full, extra water is spilled.',
      { steps: ['Each host is connected to the network through a **finite queue** (the bucket).', 'Packets arriving when the queue is full are **discarded**.', 'Packets leave the queue at a **constant rate**: one packet per clock tick (or, for variable-size packets, a fixed number of bytes per tick).'] },
      'Result: a bursty input becomes a **smooth, constant-rate output**. Drawback: it does not allow bursts even when the network is idle, and it loses packets when the bucket overflows.',
      { h: '2. Token bucket' },
      'The bucket holds **tokens** instead of packets.',
      { steps: ['Tokens are generated at a fixed rate **r** (one token every ΔT) and stored in a bucket of capacity **b** tokens; extra tokens are discarded when it is full.', 'To send a packet (or a fixed number of bytes) the host must **remove a token**.', 'If no token is available, the packet waits (it is not discarded).'] },
      'Result: an idle host **saves up tokens** (up to b), so it can later send a **burst** of up to b packets at once; the long-term average rate is still r. Maximum burst output for time S: b + r·S ≤ M·S (M = line rate) → burst length **S = b / (M − r)**.',
      { compare: [
        { title: 'Leaky bucket', items: ['Holds packets', 'Constant output rate, no bursts', 'Discards packets when full', 'Simple'] },
        { title: 'Token bucket', items: ['Holds tokens', 'Allows bursts up to bucket size, average rate r', 'Discards tokens, not packets (packets wait)', 'More flexible; often combined: token bucket followed by a leaky bucket to cap the peak rate'] },
      ] },
      { tip: 'Two numericals use these: the token-rate one (data rate = token rate × packet size) and the leaky-bucket gallons one.' },
    ],
    sources: [`${N3} p17–19`, `${T} §5.4.2`, `${F} ch. 30`],
  },

  'cn-leaky-qos': {
    blocks: [
      'The **leaky bucket** converts **bursty traffic into a uniform, fixed-rate flow** before it enters the network. This improves QoS because:',
      { ul: [
        '**Less congestion**: routers never receive sudden bursts larger than agreed, so their queues stay short.',
        '**Lower delay and jitter**: packets arrive at regular intervals, so queueing delay inside the network is small and predictable, important for voice and video.',
        '**Predictable bandwidth use**: the network knows each flow uses at most the agreed rate, so it can do admission control and reserve resources reliably.',
        '**Fairness**: one host cannot flood the network and starve others.',
        '**Policing**: excess packets are dropped at the edge (when the bucket overflows) instead of inside the network.',
      ] },
      'Example: a host sends 2 MB bursts at 25 MB/s; a leaky bucket with output 2 MB/s sends the same data as a steady 2 MB/s stream, which the network can carry without loss.',
      'Limitation: the output is rigid even when the network is idle; the token bucket relaxes this by allowing controlled bursts.',
    ],
    sources: [`${N3} p17–19`, `${T} §5.4.2`],
  },

  'cn-qos': {
    blocks: [
      '**Quality of Service (QoS)** is the set of techniques and mechanisms that give a flow of packets the **service it needs**: guarantees about the four characteristics below. A **flow** is a stream of packets from a source to a destination; its needs are characterised by four primary parameters.',
      { h: 'Characteristics (parameters) of QoS' },
      { ol: [
        '**Reliability**: lack of reliability means losing a packet or acknowledgement, which forces retransmission. E-mail, file transfer and web access need high reliability; telephony and audio/video conferencing can tolerate some loss.',
        '**Delay** (latency): source-to-destination delay. Telephony, video conferencing and remote login need low delay; e-mail and file transfer are not sensitive.',
        '**Jitter**: variation in delay among packets of the same flow. Real-time audio and video are very sensitive (playback becomes choppy); file transfer is not.',
        '**Bandwidth**: the data rate the flow needs. Video conferencing needs millions of bits/s; e-mail very little.',
      ] },
      { img: 'cn-p18' },
      { h: 'Techniques to achieve good QoS' },
      { ul: ['**Over-provisioning**: enough capacity for everything (expensive).', '**Buffering** at the receiver to smooth jitter.', '**Traffic shaping**: leaky bucket, token bucket.', '**Packet scheduling**: FIFO, priority queuing, fair queuing, weighted fair queuing.', '**Admission control and resource reservation**: Integrated Services with RSVP.', '**Differentiated Services**: per-class treatment marked in the IP header (expedited forwarding, assured forwarding).'] },
    ],
    sources: [`${N3} p17`, `${T} §5.4`, `${F} ch. 30`],
  },

  'cn-qos-notes': {
    blocks: [
      'These are three of the characteristics used to describe the needs of a **data flow** (QoS parameters).',
      { h: '(i) Reliability' },
      'Reliability is the ability of the network to deliver packets **without loss or corruption**. Lack of reliability means losing a packet or acknowledgement, which requires retransmission (more delay and load). Sensitivity varies: e-mail, file transfer and web access need high reliability (every bit must arrive correctly); telephony and audio/video can tolerate occasional loss. It is achieved with checksums and retransmission (TCP), error-correcting codes, and redundant paths.',
      { h: '(ii) Jitter' },
      '**Jitter** is the **variation in delay** for packets belonging to the same flow. If packets leave at 0, 1, 2, 3 ms and arrive at 20, 21, 22, 23 ms, delay is constant (20 ms) and there is no jitter. If they arrive at 21, 23, 21, 28 ms, the delays differ: high jitter. Real-time audio and video are very sensitive: speech becomes choppy and video freezes. It is reduced by **playback buffers** at the receiver, timestamps, and scheduling that gives priority to packets that are behind schedule.',
      { h: '(iii) Bandwidth' },
      '**Bandwidth** is the **data rate** (bits per second) a flow needs or a link can carry. Different applications need different bandwidths: a video conference may need several Mbps while e-mail needs very little. If the available bandwidth is less than the flow needs, packets queue and are lost. It is managed with resource reservation (RSVP), admission control, traffic shaping and over-provisioning.',
      { table: { head: ['Application', 'Reliability', 'Delay', 'Jitter', 'Bandwidth'], rows: [['E-mail', 'High', 'Low', 'Low', 'Low'], ['File transfer', 'High', 'Low', 'Low', 'Medium'], ['Web access', 'High', 'Medium', 'Low', 'Medium'], ['Telephony', 'Low', 'High', 'High', 'Low'], ['Video conferencing', 'Low', 'High', 'High', 'High']] } },
      'Sensitivity of applications (High = very sensitive).',
    ],
    sources: [`${N3} p17`, `${F} ch. 30`, `${T} §5.4.1`],
  },

  'cn-avg-peak': {
    blocks: [
      'A flow\'s traffic is described by its **traffic descriptors**:',
      { ul: ['**Average data rate** = amount of data ÷ time over a long period. It indicates the average bandwidth the flow needs.', '**Peak data rate** = the **maximum** data rate of the traffic, i.e. the highest rate during a burst. It indicates the peak bandwidth the network must provide for the traffic to pass without changing its flow.', '**Maximum burst size** = the maximum length of time the traffic is generated at the peak rate.', '**Effective bandwidth** = the bandwidth the network must allocate, a function of the three above.'] },
      { h: 'Relationship' },
      'Peak rate ≥ average rate. The ratio **peak / average** measures burstiness: **constant bit rate (CBR)** traffic has peak = average; **variable bit rate (VBR)** traffic has peak > average; **bursty** traffic jumps suddenly from 0 to the peak rate.',
      { h: 'Impact on performance and bandwidth allocation' },
      { ul: [
        'Allocating bandwidth equal to the **average** rate is efficient but bursts at the peak rate overflow queues → **delay, jitter and loss**.',
        'Allocating bandwidth equal to the **peak** rate guarantees no loss but **wastes** capacity most of the time.',
        'The network therefore allocates an **effective bandwidth** between the two and uses **traffic shaping** (token bucket limits bursts, leaky bucket smooths them) to bring the peak closer to the average.',
        'Multiplexing many independent bursty flows lets the network allocate close to the sum of averages (statistical multiplexing).',
      ] },
      'Example: a video stream averages 2 Mbps but peaks at 8 Mbps during scene changes. Reserving 8 Mbps wastes 75% of the time; reserving 2 Mbps causes stalls; reserving ~3 Mbps with a playback buffer is a practical compromise.',
    ],
    sources: [`${F} ch. 30 (flow characteristics, traffic descriptors)`, `${T} §5.4`],
  },

  'cn-rsvp': {
    blocks: [
      '**Integrated Services (IntServ)** is a **flow-based** QoS architecture for IP: an application must **reserve resources** (bandwidth, buffers) along the whole path **before** it sends data, and routers keep per-flow state. IP is connectionless, so IntServ needs a **signalling protocol** to make those reservations: that protocol is **RSVP (Resource Reservation Protocol)**.',
      { h: 'How they are related' },
      'IntServ defines **what** service a flow gets (guaranteed service or controlled-load service) and what the flow must declare (Tspec: traffic, Rspec: requirements); RSVP is **how** the request is carried to every router on the path so each can perform **admission control** and reserve resources.',
      { h: 'How RSVP works' },
      { steps: ['The sender sends a **Path** message toward the receiver(s); each router records the previous hop, so the reverse path is known.', 'The **receiver** decides the resources it needs and sends a **Resv** message back along the reverse path (receiver-based reservation).', 'Each router checks whether it has the resources (admission control); if yes, it reserves bandwidth and buffer space and forwards Resv upstream.', 'Reservations are **soft state**: they must be refreshed periodically or they time out.'] },
      'RSVP works well with **multicast**: reservations from several receivers are merged at branch points, so each link reserves only the largest request needed below it.',
      { h: 'Example' },
      'A video lecture streamed to three campuses: each campus host sends Resv for 4 Mbps; routers along the multicast tree reserve 4 Mbps on each link (merged, not 12 Mbps on shared links), so the lecture plays without stalls even when other traffic is heavy.',
      { h: 'Problems with IntServ' },
      'Per-flow state at every router does not scale to the Internet core; that led to **Differentiated Services** (class-based).',
    ],
    sources: [`${T} §5.4.5`, `${F} ch. 30 (IntServ, RSVP)`, `${N3} p17`],
  },

  'cn-num-token': {
    blocks: [
      { ul: ['Token rate = 1 token per 5 µs = 1 / (5 × 10⁻⁶) = **200,000 tokens/s**.', 'Each token lets one 48-byte packet through → 200,000 × 48 = **9,600,000 bytes/s**.'] },
      { formula: 'Maximum sustainable rate = 9.6 × 10⁶ bytes/s × 8 = 76.8 × 10⁶ bits/s = 76.8 Mbps' },
      'The sustainable (long-term) rate equals the token generation rate; a full bucket would allow a short burst above it.',
    ],
    sources: ["CN Jun '23 paper (bank Q32)", `${T} §5.4.2`],
  },

  'cn-num-leaky': {
    blocks: [
      { ul: ['Input: 100 gal/min for 12 s = 100 × 12/60 = **20 gallons** in.', 'Output: constant 5 gal/min = 1 gallon per 12 s.', 'After 12 s: 20 − 1 = **19 gallons** in the bucket.', 'Next 48 s: no input; 5 × 48/60 = 4 gallons leak out → **15 gallons** left at the end of the minute.', 'Total output during the minute = 5 gallons, at a steady rate.'] },
      { table: { head: ['Time', 'In', 'Out', 'In bucket'], rows: [['0–12 s', '20', '1', '19'], ['12–60 s', '0', '4', '15'], ['Next 3 min', '0', '15', '0 (empties at 4 min)']] } },
      'The bursty input (100 gal/min) became a smooth 5 gal/min output. That is exactly what a leaky bucket does for packets: bursts are absorbed (or dropped if the bucket overflows) and leave at a constant rate.',
    ],
    sources: ["CN Jun '24 paper (bank Q33)", `${F} ch. 30 (traffic shaping)`],
  },

  // ---------------- IPv4 ----------------
  'cn-ipv4-header': {
    blocks: [
      'An IPv4 datagram has a **header of 20–60 bytes** (20 fixed + up to 40 bytes of options) followed by the data.',
      { img: 'cn-p40' },
      { table: { head: ['Field', 'Bits', 'Purpose'], rows: [
        ['Version (VER)', '4', 'IP version = 4'],
        ['Header length (HLEN)', '4', 'Header size in 4-byte words (5 → 20 bytes, 15 → 60 bytes)'],
        ['Service type / DS', '8', 'Differentiated services: priority/class of the datagram'],
        ['Total length', '16', 'Header + data in bytes (max 65,535)'],
        ['Identification', '16', 'Same for all fragments of one datagram'],
        ['Flags', '3', 'Reserved, **DF** (do not fragment), **MF** (more fragments)'],
        ['Fragmentation offset', '13', 'Position of the fragment\'s data in the original datagram, in 8-byte units'],
        ['Time to live (TTL)', '8', 'Hop limit, decremented by each router; datagram discarded at 0 (prevents looping forever)'],
        ['Protocol', '8', 'Upper-layer protocol: 6 = TCP, 17 = UDP, 89 = OSPF'],
        ['Header checksum', '16', 'Error check on the header only'],
        ['Source IP address', '32', 'Original sender'],
        ['Destination IP address', '32', 'Final receiver'],
        ['Options + padding', '0–320', 'Record route, source routing, timestamp, security'],
      ] } },
      { h: 'Key fields (short answer)' },
      'Source and destination addresses (where from/to), TTL (prevents loops), protocol (which upper layer gets the data), total length, identification/flags/offset (fragmentation), and header checksum (header integrity).',
      { img: 'cn-ipv4' },
    ],
    sources: [`${N3} p24–26`, `${F} ch. 19`, `${T} §5.6.1`],
  },

  'cn-ipv4-options': {
    blocks: [
      'The IPv4 header has a 20-byte fixed part and up to **40 bytes of options**. Options are not required for every datagram; they are used for **network testing, debugging and special control**, and they let new features be added without changing the fixed header.',
      { h: 'Need for options' },
      { ul: ['Diagnose and debug routes (record the path, add timestamps).', 'Let the source control the route (source routing) for testing or policy.', 'Carry security or handling information.', 'Keep the common header small: only datagrams that need extra information pay for it.'] },
      { h: 'Format' },
      'Each option: **type** (1 byte: copy flag, class, number), **length** (1 byte), **value** (variable). Single-byte options have only the type.',
      { h: 'Options' },
      { table: { head: ['Option', 'Description'], rows: [
        ['**No operation (NOP)**', '1-byte filler used to align the next option on a word boundary'],
        ['**End of option (EOO)**', '1-byte padding at the end of the options field'],
        ['**Record route**', 'Each router on the path adds its IP address (up to 9 addresses): shows the route taken'],
        ['**Strict source route**', 'The source lists **every** router the datagram must visit, in order; no other router may be used'],
        ['**Loose source route**', 'The source lists some routers that must be visited; others may be used in between'],
        ['**Timestamp**', 'Each router records the time it processed the datagram (in ms since midnight UT): measures delays'],
        ['**Security**', 'Security and handling restrictions (rarely used)'],
      ] } },
      'In IPv6, options moved to **extension headers**, so routers do not have to parse them for every packet.',
    ],
    sources: [`${N3} p25–26`, `${F} ch. 19 (options)`, `${T} §5.6.1`],
  },

  'cn-ip-checksum': {
    blocks: [
      'IPv4 uses the **Internet checksum**: a 16-bit one\'s-complement sum over the header.',
      { h: 'Calculation at the sender' },
      { steps: ['Set the checksum field to **0**.', 'Divide the header into **16-bit words**.', 'Add all words using **one\'s-complement arithmetic** (wrap any carry out of the top bit back into the sum).', '**Complement** the final sum: that is the checksum; put it in the checksum field.'] },
      { h: 'Verification at the receiver' },
      { steps: ['Divide the received header (including the checksum) into 16-bit words.', 'Add them with one\'s-complement arithmetic.', 'Complement the result. If it is **0** (the sum is all 1s), the header is accepted; otherwise the datagram is **discarded**.'] },
      { h: 'Example' },
      'Words 4500, 001C, 0001, 0000, 0411, 0000 (checksum 0), 0A0C, 0E05, 0C06, 0702 (hex). Sum = 4500 + 1C + 1 + 411 + A0C + E05 + C06 + 702 = 7447. Checksum = complement = **8BB8**. The receiver adds everything including 8BB8 → FFFF → complement 0 → OK.',
      { h: 'What is covered and why' },
      { ul: ['**Only the header** is covered, not the data.', 'The header **changes at every router** (TTL is decremented, options like record-route are updated), so each router must recompute the checksum: checking only the 20–60 header bytes keeps that fast.', 'The **data is already protected** by upper-layer checksums (TCP and UDP cover their own header and data).', 'An error in the header (e.g. a corrupted destination address) could deliver the datagram to the wrong host, so the header must be checked hop by hop.'] },
      { h: 'Are options included?' },
      '**Yes.** Options are part of the header, so they are included in the checksum calculation.',
    ],
    sources: [`${N3} p25`, `${F} ch. 19 (checksum)`],
  },

  'cn-fragmentation': {
    blocks: [
      'Each data-link network has a **Maximum Transfer Unit (MTU)**: the largest payload one frame can carry (Ethernet 1500 bytes). A datagram larger than the MTU of the next link must be **fragmented**: divided into smaller datagrams, each with its own IP header, that travel independently.',
      { h: 'Fields used' },
      { ul: ['**Identification** (16 bits): all fragments of one datagram carry the same value, so the receiver knows which fragments belong together.', '**Flags**: **DF** (do not fragment): if set and the datagram is too big, the router discards it; **MF** (more fragments): 1 on all fragments except the last.', '**Fragmentation offset** (13 bits): the position of this fragment\'s data in the original datagram, in **units of 8 bytes**. So every fragment except the last must carry a multiple of 8 data bytes.', '**Total length** of each fragment is set to its own size.'] },
      { h: 'Rules' },
      { ul: ['Fragmentation can be done by the **source** or by any **router** on the path; a fragment can be fragmented again.', '**Reassembly** is done only by the **final destination**, because fragments may take different routes.', 'If any fragment is lost, the whole datagram is discarded after a reassembly timer expires.'] },
      { h: 'Example' },
      'A 4000-byte datagram (20-byte header + 3980 data) crossing an Ethernet (MTU 1500): data per fragment = 1480 bytes.',
      { table: { head: ['Fragment', 'Data bytes', 'Offset (×8)', 'MF'], rows: [['1', '0–1479', '0', '1'], ['2', '1480–2959', '185', '1'], ['3', '2960–3979', '370', '0']] } },
      'IPv6 removes fragmentation by routers: only the source fragments, after path-MTU discovery.',
    ],
    sources: [`${N3} p25–26`, `${F} ch. 19 (fragmentation)`, `${T} §5.5.5`],
  },

  'cn-num-fragments': {
    blocks: [
      { ul: ['Data in the datagram = 1000 − 20 = **980 bytes**.', 'Each fragment carries its own 20-byte header, so it can carry at most 100 − 20 = **80 data bytes**; 80 is a multiple of 8, so that is allowed.', '980 ÷ 80 = 12.25 → **13 fragments**: 12 fragments of 80 data bytes (100-byte packets) and a last one of 20 data bytes (40-byte packet).'] },
      { table: { head: ['Fragment', 'Data bytes', 'Offset (×8)', 'MF'], rows: [['1', '0–79', '0', '1'], ['2', '80–159', '10', '1'], ['…', '…', '…', '1'], ['12', '880–959', '110', '1'], ['13', '960–979', '120', '0']] } },
      '**Answer: 13 fragments.**',
    ],
    sources: ["CN Dec '23 (IT) paper (bank Q40)", `${F} ch. 19 (fragmentation)`],
  },

  // ---------------- Addresses ----------------
  'cn-nat': {
    blocks: [
      '**Network Address Translation (NAT)** lets a site use a set of **private addresses** internally and one (or a few) **global public addresses** to talk to the Internet. The NAT router (on the boundary) rewrites addresses in packets that cross it.',
      { h: 'Private address ranges (not routed on the Internet)' },
      '10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16.',
      { h: 'How it works' },
      { steps: ['A host 10.0.0.5 sends a packet to a web server, from port 5000.', 'The NAT router replaces the **source address** with its public address (e.g. 200.24.5.8) and, with port translation (NAPT/PAT), the source port with a unique port (e.g. 40001). It records the mapping in its **translation table**.', 'The reply comes back to 200.24.5.8:40001.', 'The router looks up the table and replaces the **destination** with 10.0.0.5:5000, then forwards it inside.'] },
      { table: { head: ['Private address', 'Private port', 'Public port', 'External address', 'Protocol'], rows: [['10.0.0.5', '5000', '40001', '25.8.3.2:80', 'TCP'], ['10.0.0.7', '5000', '40002', '25.8.3.2:80', 'TCP']] } },
      { h: 'How NAT helps with address depletion' },
      'IPv4 has only about 4.3 billion addresses. With NAT, a whole home, office or campus (hundreds or thousands of hosts) shares **one public address**: using the port numbers to tell connections apart, one address can serve tens of thousands of simultaneous connections. ISPs also use carrier-grade NAT. This greatly slowed the exhaustion of IPv4 addresses.',
      { h: 'Situations where NAT is essential' },
      { ul: ['A home or small office whose ISP gives only one public IP for many devices.', 'An organisation that has more hosts than public addresses allocated.', 'Changing ISPs without renumbering all internal hosts (only the NAT\'s public address changes).', 'Hiding internal addresses and structure from outside (a basic security benefit: unsolicited inbound connections are blocked).', 'Mobile networks and carrier-grade NAT for millions of subscribers.'] },
      { h: 'Drawbacks' },
      'Breaks end-to-end connectivity (outside hosts cannot initiate connections without port forwarding), problems with protocols that carry addresses inside the data (FTP, some VoIP), extra processing in the router.',
    ],
    sources: [`${N3} p30`, `${F} ch. 18 (NAT)`, `${T} §5.6.2`],
  },

  'cn-addr-format': {
    blocks: [
      { h: 'Number of bits' },
      'An **IPv4** address is **32 bits** (4 bytes); an **IPv6** address is **128 bits** (16 bytes).',
      { h: 'IPv4 format' },
      { img: 'cn-p27a' },
      { ul: ['**Binary**: 32 bits, e.g. 01110101 10010101 00011101 00000010.', '**Dotted-decimal**: each byte written in decimal (0–255), separated by dots: **117.149.29.2**.', '**Hexadecimal**: 0x75951D02.', 'Address = **prefix (network) + suffix (host)**; the prefix length is given by the class or the CIDR /n.'] },
      '**Address space** = 2³² = **4,294,967,296** (≈ 4.3 billion) addresses.',
      { h: 'IPv6 format' },
      { ul: ['128 bits written as **8 groups of 4 hexadecimal digits** separated by colons (colon hexadecimal): FDEC:0074:0000:0000:0000:B0FF:0000:FFF0.', '**Abbreviation**: leading zeros in a group can be dropped (0074 → 74), and **one** run of consecutive all-zero groups can be replaced by **::** → FDEC:74::B0FF:0:FFF0.', 'CIDR prefix notation: 2001:DB8::/32.', 'Types: unicast, multicast, anycast (no broadcast).'] },
      '**Address space** = 2¹²⁸ ≈ **3.4 × 10³⁸** addresses: about 5 × 10²⁸ for each person on Earth.',
      { table: { head: ['', 'IPv4', 'IPv6'], rows: [['Bits', '32', '128'], ['Notation', 'Dotted decimal', 'Colon hexadecimal'], ['Groups', '4 bytes', '8 × 16-bit groups'], ['Space', '2³² ≈ 4.3 × 10⁹', '2¹²⁸ ≈ 3.4 × 10³⁸']] } },
    ],
    sources: [`${N3} p27–34`, `${F} ch. 18, 22`],
  },

  'cn-classful': {
    blocks: [
      { h: 'Classful addressing' },
      'The IPv4 address space is divided into **five fixed classes** by the first bits of the address. The class fixes the network/host split.',
      { img: 'cn-p28' },
      { table: { head: ['Class', 'First byte', 'Network bits / default mask', 'Use'], rows: [['A', '0–127', '8 / 255.0.0.0', 'Very large networks (16.7 M hosts)'], ['B', '128–191', '16 / 255.255.0.0', 'Medium (65,534 hosts)'], ['C', '192–223', '24 / 255.255.255.0', 'Small (254 hosts)'], ['D', '224–239', '–', 'Multicast'], ['E', '240–255', '–', 'Reserved']] } },
      { h: 'Classless addressing (CIDR)' },
      'Classes are abolished; an organisation gets a **block** of any size 2ⁿ, written **a.b.c.d/n**, where n (the prefix length) can be any value 0–32. The first address has host bits all 0, the last all 1.',
      { img: 'cn-p31' },
      { table: { head: ['Basis', 'Classful', 'Classless (CIDR)'], rows: [
        ['Network/host split', 'Fixed by class (8, 16, 24 bits)', 'Any prefix length /n'],
        ['Block sizes', 'Only 2²⁴, 2¹⁶, 2⁸', 'Any power of 2'],
        ['Address waste', 'Huge (a firm needing 2,000 addresses gets a class B of 65,536)', 'Little: block matches need (a /21 = 2,048)'],
        ['Mask', 'Implied by class', 'Written explicitly (/n)'],
        ['Routing tables', 'Many entries', 'Route aggregation (supernetting) shrinks tables'],
        ['Subnetting', 'Added later on top', 'Built in'],
        ['Status', 'Obsolete', 'Used today'],
      ] } },
    ],
    sources: [`${N3} p27–29`, `${F} ch. 18`],
  },

  'cn-subnetting': {
    blocks: [
      { h: 'Subnetting' },
      'An organisation divides its single large block into several **smaller sub-blocks (subnets)**, e.g. one per department. Bits are **borrowed from the host part** to create a subnet ID. Outside routers still see one network; internal routers use the subnet mask to route to the right subnet.',
      'Example: class B 141.14.0.0 (default mask /16) divided into 4 subnets by borrowing 2 bits → subnet mask **255.255.192.0 (/18)**: subnets 141.14.0.0, 141.14.64.0, 141.14.128.0, 141.14.192.0, each with 2¹⁴ addresses.',
      { h: 'Supernetting' },
      'The opposite: several **contiguous smaller blocks are combined** into one larger block. Bits are **taken from the network part** (the mask gets shorter). Used when an organisation needs more addresses than one class C, and for **route aggregation** (one routing entry instead of many).',
      'Example: four class C blocks 198.47.32.0, 198.47.33.0, 198.47.34.0, 198.47.35.0 combined → **198.47.32.0/22**, supernet mask **255.255.252.0**.',
      'Conditions: number of blocks a power of 2; blocks contiguous; the first block\'s third byte divisible by the number of blocks.',
      { h: 'How the masks differ from the default mask' },
      { table: { head: ['Mask', 'Number of 1s compared with the default', 'Example (class C default /24)'], rows: [['Default mask', 'Fixed by class: /8, /16, /24', '255.255.255.0'], ['**Subnet mask**', '**More** 1s (longer): host bits turned into subnet bits', '255.255.255.192 (/26): 4 subnets'], ['**Supernet mask**', '**Fewer** 1s (shorter): network bits turned into host bits', '255.255.252.0 (/22): 4 class C blocks combined']] } },
    ],
    sources: [`${N3} p29`, `${F} ch. 18 (subnetting, supernetting)`],
  },

  'cn-ip-vs-ethernet': {
    blocks: [
      { compare: [
        { title: 'IP address (logical)', items: ['Has a **hierarchical** structure: network prefix + host part', 'The prefix says **where** the host is attached', 'Routers forward on the prefix only, so routing tables stay small', 'Must change when the host moves to another network'] },
        { title: 'Ethernet (MAC) address (physical)', items: ['**Flat**: 48 bits = manufacturer ID + serial number', 'Burned into the NIC at the factory', 'Says **who** the interface is, not where it is', 'Stays the same wherever the card goes'] },
      ] },
      { h: 'Why' },
      { ul: ['**Routing scalability**: the Internet can route only if addresses are aggregated by location. If IP addresses were not tied to networks, every router would need an entry for every host in the world. Hence the IP address must reflect the network the host is on.', '**Ethernet works within one LAN** only: delivery is by broadcast medium or switch learning, so no location information is needed; flat, globally unique numbers assigned by manufacturers are enough and avoid configuration.', 'Ethernet addresses are assigned at **manufacture**, when nobody knows which network the card will be used in, so they cannot be tied to a network.'] },
      'ARP maps between the two: IP is used to reach the right network; the MAC address delivers the frame on the final LAN.',
    ],
    sources: [`${T} §5.6.2, §4.3`, `${F} ch. 18`],
  },

  'cn-num-cidr28': {
    blocks: [
      { ul: ['/28 → mask **255.255.255.240** (last byte 11110000); 32 − 28 = 4 host bits.', 'Last byte of the address: 39 = **0010 0111**.'] },
      { table: { head: ['', 'Last byte (binary)', 'Address'], rows: [['Given', '0010 0111', '205.16.37.39'], ['AND mask → first (host bits 0)', '0010 0000', '**205.16.37.32**'], ['OR ¬mask → last (host bits 1)', '0010 1111', '**205.16.37.47**']] } },
      { formula: 'Number of addresses = 2^(32 − 28) = 2⁴ = 16' },
      'Block: 205.16.37.32 to 205.16.37.47 (16 addresses; 14 usable for hosts, as .32 is the network address and .47 the broadcast address).',
    ],
    sources: ["CN Nov '25 paper Q10(a)", `${F} ch. 18`, 'Verified with the CIDR calculator'],
  },

  'cn-num-same-net': {
    blocks: [
      'Apply each host\'s mask to its own address (bitwise AND):',
      { ul: ['C1: 203.197.2.53 AND 255.255.128.0 → third byte: 2 (00000010) AND 128 (10000000) = 0 → network **203.197.0.0/17**.', 'C2: 203.197.75.201 AND 255.255.192.0 → third byte: 75 (01001011) AND 192 (11000000) = 64 → network **203.197.64.0/18**.'] },
      'The network addresses differ (203.197.0.0 vs 203.197.64.0) and the prefix lengths differ (/17 vs /18), so **C1 and C2 are not on the same network**.',
      { note: 'Check from each side: with C1\'s mask, C2 gives 75 AND 128 = 0 → C1 would think C2 is local; with C2\'s mask, C1 gives 2 AND 192 = 0 ≠ 64 → C2 thinks C1 is remote. The masks are inconsistent, which is itself a configuration error.' },
    ],
    sources: ["CN Dec '22–Jan '23 (IT) paper", 'Verified with the CIDR calculator'],
  },

  'cn-num-classes': {
    blocks: [
      'The class is decided by the **first byte** (or its leading bits).',
      { table: { head: ['Address', 'First byte', 'Leading bits', 'Class'], rows: [['208.34.54.12', '208 (192–223)', '110', '**C**'], ['238.34.2.1', '238 (224–239)', '1110', '**D** (multicast)'], ['114.34.2.8', '114 (0–127)', '0', '**A**'], ['129.14.6.8', '129 (128–191)', '10', '**B**']] } },
    ],
    sources: ["CN Jun '24 paper (bank Q51)", `${F} ch. 18`],
  },

  'cn-num-binary': {
    blocks: [
      'Convert each 8-bit group to decimal (place values 128 64 32 16 8 4 2 1):',
      { table: { head: ['Binary', 'Decimal'], rows: [['10000001', '128 + 1 = 129'], ['00001011', '8 + 2 + 1 = 11'], ['00001011', '11'], ['11101111', '128 + 64 + 32 + 8 + 4 + 2 + 1 = 239']] } },
      '→ **129.11.11.239**',
      { table: { head: ['Binary', 'Decimal'], rows: [['11000001', '128 + 64 + 1 = 193'], ['10000011', '128 + 2 + 1 = 131'], ['00011011', '16 + 8 + 2 + 1 = 27'], ['11111111', '255']] } },
      '→ **193.131.27.255**',
    ],
    sources: ["CN Dec '23 (IT) paper (bank Q52)"],
  },

  // ---------------- IPv6 ----------------
  'cn-ipv6-why': {
    blocks: [
      { h: 'How IPv6 solves address exhaustion' },
      'IPv4 has 2³² ≈ 4.3 billion addresses, far fewer than the world\'s phones, PCs and IoT devices; the regional registries ran out of free IPv4 blocks (2011–2019), and NAT and CIDR were only stop-gaps. IPv6 uses **128-bit addresses** → 2¹²⁸ ≈ 3.4 × 10³⁸ addresses, enough to give every device a globally unique address **without NAT**, restoring end-to-end connectivity.',
      { h: 'Why IPv6 is preferred over IPv4' },
      { ol: [
        '**Larger address space**: 128-bit addresses.',
        '**Better header format**: a simpler **fixed 40-byte base header**; options moved into **extension headers**, so routers process packets faster.',
        '**No header checksum** and **no fragmentation by routers** (only the source fragments) → less work per hop.',
        '**New options and extensibility** via extension headers.',
        '**Support for resource allocation / QoS**: the **flow label** and traffic class fields identify real-time flows.',
        '**More security**: IPsec authentication and encryption are part of the design.',
        '**Auto-configuration** (SLAAC): hosts configure their own addresses (plug and play).',
        'Better **multicast and anycast** support; no broadcast storms.',
      ] },
      { h: 'Scalability: IPv4 vs IPv6 in modern networks' },
      { table: { head: ['Aspect', 'IPv4', 'IPv6'], rows: [
        ['Devices supported', 'Limited; relies on NAT layers', 'Practically unlimited'],
        ['Routing tables', 'Fragmented allocations → large, growing tables', 'Hierarchical allocation → aggregated routes, smaller tables'],
        ['Router processing', 'Variable header, checksum recomputed each hop, fragmentation', 'Fixed header, no checksum, no router fragmentation'],
        ['Configuration', 'Manual or DHCP', 'Stateless auto-configuration'],
        ['IoT / mobile', 'Struggles (NAT breaks peer-to-peer)', 'Each sensor/phone gets its own address'],
      ] } },
      'So IPv6 scales far better for cloud data centres, 5G and IoT, where billions of devices must be directly addressable.',
    ],
    sources: [`${N3} p31–34`, `${T} §5.6.3`, `${F} ch. 22`],
  },

  'cn-ipv6-transition': {
    blocks: [
      { h: 'Why the transition is required' },
      { ul: ['IPv4 addresses are exhausted; new devices and networks need IPv6.', 'But the Internet is huge: all systems **cannot switch at once** ("no flag day"). Billions of IPv4-only hosts, routers and applications must keep working while IPv6 is rolled out.', 'IPv4 and IPv6 headers are **incompatible**: an IPv4-only router cannot forward an IPv6 packet.', 'So mechanisms are needed to let the two **coexist** and interoperate during a long migration.'] },
      { h: 'Three transition strategies' },
      { ol: [
        '**Dual stack**: a host or router runs **both IPv4 and IPv6** protocol stacks. To talk to a destination, the source asks DNS: if it gets an AAAA (IPv6) record it uses IPv6, else IPv4.',
        '**Tunnelling**: when two IPv6 hosts must communicate across a region that only supports IPv4, the IPv6 packet is **encapsulated inside an IPv4 packet** (protocol field = 41) at the tunnel entry and decapsulated at the exit.',
        '**Header translation**: when one side uses only IPv6 and the other only IPv4 (e.g. most of the Internet has moved to IPv6 but some systems still use IPv4), a translator (NAT64) **converts the header** format from one version to the other.',
      ] },
      { img: 'cn-p21' },
      { h: 'Tunnelling vs dual stack' },
      { table: { head: ['', 'Dual stack', 'Tunnelling'], rows: [['Idea', 'Each node speaks both versions natively', 'IPv6 packets carried inside IPv4 packets across an IPv4 region'], ['Needs', 'Both stacks on every node; both kinds of addresses', 'Tunnel endpoints that run both; IPv4-only routers in between'], ['Overhead', 'Memory/configuration for two stacks', 'Extra 20-byte header; MTU reduced; tunnel setup'], ['When used', 'Early and middle phases, wherever devices can be upgraded; the usual default today', 'When IPv6 islands are separated by IPv4-only networks that cannot be upgraded yet']] } },
    ],
    sources: [`${N3} p33–34`, `${F} ch. 22 (transition)`, `${T} §5.6.3`],
  },

  'cn-ipv6-header': {
    blocks: [
      'An IPv6 datagram = a **40-byte fixed base header** + zero or more **extension headers** + upper-layer data (payload up to 65,535 bytes).',
      { img: 'cn-ipv6' },
      { table: { head: ['Field', 'Bits', 'Purpose'], rows: [
        ['Version', '4', 'IP version = 6'],
        ['Traffic class', '8', 'Priority / differentiated-services class of the packet'],
        ['Flow label', '20', 'Identifies a flow of packets needing special handling (e.g. real-time audio/video): routers can treat all packets of the flow the same way'],
        ['Payload length', '16', 'Length of everything after the 40-byte base header (extension headers + data)'],
        ['Next header', '8', 'Type of the next header: an extension header or the transport protocol (TCP = 6, UDP = 17)'],
        ['Hop limit', '8', 'Same purpose as IPv4 TTL: decremented by each router, discarded at 0'],
        ['Source address', '128', 'Sender\'s IPv6 address'],
        ['Destination address', '128', 'Final destination (or next router with routing header)'],
      ] } },
      { h: 'Extension headers' },
      'Chained using the next-header field: hop-by-hop options, destination options, routing (like source routing), fragmentation (source-only), authentication (AH), encrypted security payload (ESP).',
      { h: 'What was removed from IPv4' },
      'Header length (fixed size), identification/flags/offset (moved to the fragmentation extension header), header checksum (left to upper layers and link layer), options (extension headers). This makes router processing faster.',
    ],
    sources: [`${N3} p31–34`, `${T} §5.6.3`, `${F} ch. 22`],
  },

  'cn-ipv4-vs-ipv6': {
    blocks: [
      { table: { head: ['Basis', 'IPv4', 'IPv6'], rows: [
        ['Address size', '32 bits', '128 bits'],
        ['Address space', '2³² ≈ 4.3 × 10⁹', '2¹²⁸ ≈ 3.4 × 10³⁸'],
        ['Notation', 'Dotted decimal: 192.168.1.10', 'Colon hexadecimal: 2001:db8::1'],
        ['Header size', '20–60 bytes (variable)', '40 bytes fixed'],
        ['Header fields', '12 basic fields + options', '8 fields'],
        ['Checksum', 'Header checksum', 'None'],
        ['Fragmentation', 'By source and routers', 'Only by the source'],
        ['Options', 'In the header', 'Extension headers'],
        ['QoS support', 'Type of service (DS) field', 'Traffic class + flow label'],
        ['Security', 'IPsec optional', 'IPsec designed in'],
        ['Configuration', 'Manual or DHCP', 'Stateless auto-configuration (SLAAC) or DHCPv6'],
        ['Address types', 'Unicast, multicast, broadcast', 'Unicast, multicast, anycast (no broadcast)'],
        ['Address resolution', 'ARP', 'Neighbour discovery'],
        ['NAT', 'Widely needed', 'Not needed'],
        ['DNS record', 'A', 'AAAA'],
      ] } },
      { img: 'cn-ipv6' },
    ],
    sources: [`${N3} p24–34`, `${F} ch. 19, 22`],
  },
}
