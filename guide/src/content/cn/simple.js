// Computer Networks in simple words: a short summary, a picture of the idea, the key points,
// an everyday comparison and one example for every topic. Keys are syllabus ids.
export default {
  // ======================= UNIT I =======================
  'cn.u1.hardware': {
    summary: 'A **computer network** is devices connected so they can share data. Networks are grouped by size: PAN (around you), LAN (a building), MAN (a city), WAN (a country or the world).',
    picture: [{ flow: ['PAN: phone + earbuds', 'LAN: college lab', 'MAN: city cable network', 'WAN: bank across India', 'Internet: everything'] }],
    points: [
      'A **protocol** is the set of rules both sides follow, like a shared language.',
      'A **host** is an end device; a **client** asks for a service and a **server** gives it.',
      'A **NIC** connects a device to the network.',
      '**Broadcast** networks share one channel; **point-to-point** networks link pairs of machines.',
    ],
    analogy: 'Like a postal system: houses (hosts) connected by roads (links), with post offices (routers) and agreed address formats (protocols).',
    example: 'When you open a website on college Wi-Fi, your phone (client) uses the campus LAN, then the Internet (WAN), to reach a web server.',
  },
  'cn.u1.topologies': {
    summary: '**Topology** is the shape of a network: how the devices are wired together. The main shapes are bus, star, ring and mesh.',
    picture: [{ tree: { root: 'Topologies', kids: ['Bus: one shared cable', 'Star: everyone to a hub', 'Ring: a closed loop', 'Mesh: everyone to everyone'] } }],
    points: [
      'Bus is cheap but one cable break stops all.',
      'Star is easy to manage but the hub is a single point of failure.',
      'Mesh is very reliable but needs n(n − 1)/2 cables and n − 1 ports per device.',
    ],
    analogy: 'Star is like spokes on a bicycle wheel meeting at the hub; mesh is like every house having its own road to every other house.',
    example: 'A full mesh of 7 computers needs 7 × 6 / 2 = 21 cables, and each computer needs 6 ports.',
  },
  'cn.u1.osi': {
    summary: 'The **OSI model** splits networking into **7 layers**. Each layer does one job and serves the layer above it, from bits on a wire up to apps.',
    picture: [{ stack: ['7 Application: your app', '6 Presentation: format, encryption', '5 Session: start and manage the conversation', '4 Transport: reliable delivery between programs', '3 Network: addresses and routing', '2 Data link: frames between neighbours', '1 Physical: bits on the wire'] }],
    points: [
      'Remember top to bottom: **All People Seem To Need Data Processing**.',
      'Going down, each layer adds its own header (encapsulation); going up, each removes it.',
      'Data units: bits, frames, packets, segments, data.',
    ],
    analogy: 'Like sending a gift: you write a note (application), wrap it (presentation), address it (network), the courier boxes it (data link), and a truck carries it (physical).',
    example: 'Sending a WhatsApp message: the app creates it, it is encrypted, split into segments, given IP addresses, framed for Wi-Fi, and sent as radio signals.',
  },
  'cn.u1.tcpip': {
    summary: 'The **TCP/IP model** is the real Internet\'s model, with **4 layers**: link, internet, transport and application.',
    picture: [{ stack: ['Application: HTTP, DNS, SMTP', 'Transport: TCP or UDP', 'Internet: IP', 'Link: Ethernet, Wi-Fi'] }],
    points: [
      '**IP** gets packets across networks on a best-effort basis.',
      '**TCP** makes delivery reliable and ordered; **UDP** is quick and simple.',
      'Some books split the link layer into data link + physical, giving 5 layers.',
    ],
    analogy: 'Like sending a parcel by courier: you pack it (application), choose tracked or normal post (TCP or UDP), it gets a route by address (IP), and a van carries it (link).',
    example: 'Loading a web page uses HTTP over TCP over IP over Wi-Fi.',
  },
  'cn.u1.osi-vs-tcpip': {
    summary: '**OSI** has 7 layers and was designed as a model first. **TCP/IP** has 4 layers, came from working protocols, and is what the Internet actually uses.',
    picture: [{ table: { head: ['OSI', 'TCP/IP'], rows: [['Application, presentation, session', 'Application'], ['Transport', 'Transport'], ['Network', 'Internet'], ['Data link, physical', 'Link']] } }],
    points: [
      'OSI: model first, then protocols. TCP/IP: protocols first, then model.',
      'OSI is great for teaching; TCP/IP is used in practice.',
      'TCP/IP\'s network layer is connectionless only.',
    ],
    analogy: 'OSI is a detailed textbook map of a city; TCP/IP is the map people actually use on their phones.',
    example: 'Your laptop does not have separate session and presentation software; TCP/IP folds them into the application, like a browser doing TLS encryption itself.',
  },
  'cn.u1.switching': {
    summary: '**Circuit switching** reserves a whole path for a call. **Packet switching** chops data into packets that travel separately. **Virtual circuits** set a path first but still send packets.',
    picture: [{ table: { head: ['Type', 'Like'], rows: [['Circuit', 'A reserved lane for your whole trip'], ['Packet (datagram)', 'Each car finds its own road'], ['Virtual circuit', 'A planned route that many cars share']] } }],
    points: [
      'Circuit: setup delay, fixed bandwidth, wasted when silent (old phone calls).',
      'Packet: no setup, shares links efficiently, packets may arrive out of order (the Internet).',
      'Transmission delay = L / R; propagation delay = distance / speed.',
    ],
    analogy: 'Circuit switching is booking a whole train coach for your family; packet switching is everyone taking separate buses and meeting at the destination.',
    example: 'A 1000-byte packet on a 2 Mbps link takes 4 ms to send; crossing 2500 km at 2.5×10⁸ m/s adds 10 ms.',
  },
  'cn.u1.twisted-coax': {
    summary: '**Twisted pair** is two copper wires twisted together to cancel noise. **Coaxial cable** has a copper core inside a metal shield, so it carries higher frequencies further.',
    picture: [{ stack: ['Coax: outer jacket', 'Metal braid shield', 'Insulation', 'Copper core'] }],
    points: [
      'Twisting makes noise hit both wires equally, so it cancels out at the receiver.',
      'UTP (unshielded) is the common LAN cable (Cat 5e, Cat 6); STP adds a foil shield.',
      'Coax is used for cable TV and older Ethernet.',
    ],
    analogy: 'Twisting the wires is like two people walking side by side in the rain under one umbrella: both get the same splashes, so the difference between them stays clean.',
    example: 'The blue Ethernet cable in your lab is UTP Cat 6; the TV cable from the set-top box is coax.',
  },
  'cn.u1.fiber': {
    summary: '**Optical fibre** sends data as pulses of light through a thin glass core. Light bounces inside by **total internal reflection**, so it travels very far with little loss.',
    picture: [{ flow: ['Electrical signal', 'Laser / LED', 'Light bouncing in glass core', 'Light detector', 'Electrical signal'] }],
    points: [
      'Huge bandwidth, very low loss, immune to electrical noise, hard to tap.',
      'Single-mode (thin core, laser) for long distances; multimode for short links.',
      'Fragile and costly to join.',
    ],
    analogy: 'Like shouting through a long, perfectly mirrored pipe: the sound (light) keeps bouncing off the walls and arrives at the other end clearly.',
    example: 'Undersea internet cables between India and Europe are single-mode fibre.',
  },
  'cn.u1.wireless': {
    summary: '**Wireless (unguided) media** send signals through the air: **radio** waves go everywhere, **microwaves** go in a straight beam, **infrared** works only nearby.',
    picture: [{ table: { head: ['Wave', 'Goes', 'Used for'], rows: [['Radio', 'All directions, through walls', 'FM, Wi-Fi'], ['Microwave', 'Straight line of sight', 'Satellite, mobile towers'], ['Infrared', 'Short, blocked by walls', 'TV remote']] } }],
    points: [
      'Propagation: ground (follows the earth), sky (bounces off the ionosphere), line of sight.',
      'Omnidirectional antennas send everywhere; unidirectional (dish) antennas send a beam.',
      'Easy to set up and mobile, but faces interference and security issues.',
    ],
    analogy: 'Radio is like a loudspeaker everyone hears; microwave is like a torch beam aimed at one person.',
    example: 'Your TV remote (infrared) does not work from another room, but your FM radio (radio waves) does.',
  },

  // ======================= UNIT II =======================
  'cn.u2.dll-design': {
    summary: 'The **data link layer** turns a raw stream of bits into **frames** sent reliably between two neighbouring devices, with error and flow control.',
    picture: [{ flow: ['Packet from network layer', 'Frame it (header + trailer)', 'Add error check', 'Send to the next device'] }],
    points: [
      '**Framing** marks where each frame starts and ends (flags with byte or bit stuffing).',
      '**Error control** finds and fixes mistakes; **flow control** slows a fast sender.',
      'MAC addresses deliver across one link; IP addresses identify the final destination.',
    ],
    analogy: 'Like packing letters into numbered envelopes for one hop of a relay race: each runner checks the envelope is intact before passing it on.',
    example: 'Bit stuffing: the data 0111111 becomes 01111101 so it is never mistaken for the flag 01111110.',
  },
  'cn.u2.error-detection': {
    summary: 'To spot errors, the sender adds a few extra check bits. **Parity** catches single flips, **checksum** adds up the data, and **CRC** uses division to catch most errors.',
    picture: [{ flow: ['Message', 'Append r zeros', 'Divide by generator (XOR)', 'Remainder = CRC', 'Send message + CRC'] }],
    points: [
      'A single-bit error changes one bit; a burst error changes several.',
      'Receiver divides the whole frame by the same generator: remainder 0 means no error found.',
      'The transport layer checks again end to end, because routers can corrupt data too.',
    ],
    analogy: 'Like a shopkeeper\'s total at the bottom of a bill: if your items do not add up to the total, something was written wrong.',
    example: 'Message 10011101 with generator 1001 gives CRC 100, so 10011101100 is sent.',
  },
  'cn.u2.error-correction': {
    summary: '**Error correction** adds enough extra bits to **fix** a mistake without asking again. **Hamming code** puts parity bits at positions 1, 2, 4, 8… and the failed checks point to the wrong bit.',
    picture: [{ table: { head: ['Position', '1', '2', '3', '4', '5', '6', '7'], rows: [['Bit', 'p1', 'p2', 'd', 'p4', 'd', 'd', 'd']] } }],
    points: [
      '**Hamming distance** = number of places two codewords differ.',
      'To detect s errors you need distance s + 1; to correct t errors you need 2t + 1.',
      'Number of check bits r: 2^r ≥ data bits + r + 1.',
    ],
    analogy: 'Like a crossword: if one letter is wrong, the across and down clues that fail together point to exactly which square to fix.',
    example: 'Data 1011 becomes 0110011. If bit 5 flips, the checks give 101 = 5, so bit 5 is corrected.',
  },
  'cn.u2.simplex': {
    summary: 'The **simplex (utopian) protocol** is the simplest possible one: data goes one way, nothing is ever lost or damaged, and the receiver is always ready. So no acknowledgements are needed.',
    picture: [{ flow: ['Sender: take packet', 'Make frame', 'Send', 'Repeat'] }],
    points: [
      'It is unrealistic, but it is the starting point.',
      'Each later protocol removes one of its perfect assumptions.',
    ],
    analogy: 'Like throwing letters into a magic mailbox that never loses anything and never fills up.',
    example: 'Protocol 1 in Tanenbaum: the sender loops "get packet, send frame" forever, at full speed.',
  },
  'cn.u2.stop-wait': {
    summary: '**Stop-and-wait**: send one frame, then wait for an acknowledgement (ACK) before sending the next. This stops a slow receiver from being flooded.',
    picture: [{ flow: ['Send frame 0', 'Wait for ACK', 'Send frame 1', 'Wait for ACK'] }],
    points: [
      'On a noisy channel, add a **timer** (resend if no ACK) and a 1-bit **sequence number** (spot duplicates).',
      'Simple, but the link sits idle while waiting, so it is slow on long links.',
    ],
    analogy: 'Like passing notes in class one at a time and waiting for your friend to nod before passing the next.',
    example: 'If ACK 0 is lost, the sender times out and resends frame 0; the receiver sees sequence 0 again and discards the duplicate.',
  },
  'cn.u2.sliding-window': {
    summary: '**Sliding window** protocols let the sender have several frames "in flight" before getting ACKs. As ACKs arrive, the window slides forward.',
    picture: [{ flow: ['Window: frames 0 1 2 3', 'ACK 0 arrives', 'Window slides to 1 2 3 4', 'Send frame 4'] }],
    points: [
      'Keeps the link busy instead of waiting after every frame.',
      '**Piggybacking**: put the ACK inside a data frame going the other way.',
      'Two kinds: Go-Back-N and Selective Repeat.',
    ],
    analogy: 'Like a conveyor belt of 4 boxes: as soon as the first is confirmed received, a new box goes on the end.',
    example: 'With a window of 4 the sender sends frames 0 to 3 at once instead of waiting after each one.',
  },
  'cn.u2.gbn': {
    summary: 'In **Go-Back-N**, if a frame is lost, the receiver throws away everything after it, and the sender **goes back** and resends that frame and all the later ones.',
    picture: [{ flow: ['Send 0 1 2 3 4', 'Frame 2 lost', 'Receiver drops 3, 4', 'Resend 2 3 4'] }],
    points: [
      'Receiver window = 1: it accepts only frames in order.',
      'Sender window can be up to 2ⁿ − 1.',
      'Simple, but wastes bandwidth on noisy links.',
    ],
    analogy: 'Like a teacher who, when you miss one line of a poem, makes you start again from that line to the end.',
    example: 'Frames 0 to 4 sent, frame 2 lost: frames 2, 3 and 4 are all sent again.',
  },
  'cn.u2.sr': {
    summary: 'In **Selective Repeat**, the receiver keeps the good frames that came after a lost one, and the sender resends **only** the lost frame.',
    picture: [{ flow: ['Send 0 1 2 3', 'Frame 1 lost', 'Receiver keeps 2, 3', 'Resend only 1'] }],
    points: [
      'Both windows can be at most 2ⁿ⁻¹.',
      'Needs buffers at the receiver, and NAKs to ask for a specific frame.',
      'Much better on noisy links than Go-Back-N.',
    ],
    analogy: 'Like a teacher who, when you miss one line of a poem, asks you to say only that line again.',
    example: 'Frames 0 to 3 sent, frame 1 lost: only frame 1 is resent; frames 2 and 3 wait in the buffer.',
  },
  'cn.u2.channel-allocation': {
    summary: 'When many devices share one channel, someone must decide who talks when. It can be split **in advance** (fixed slots) or given **on demand** (whoever needs it).',
    picture: [{ tree: { root: 'Sharing a channel', kids: ['Fixed: FDM (frequency), TDM (time)', 'On demand: random access (ALOHA, CSMA)', 'On demand: controlled (token, polling)'] } }],
    points: [
      'Fixed splitting wastes capacity when users are idle.',
      'Computer traffic is bursty, so on-demand sharing works better.',
      'Two frames at once on the channel = a **collision**.',
    ],
    analogy: 'Fixed slots are like a timetable where each student gets 5 minutes even if they have nothing to say; on demand is raising your hand when you have a question.',
    example: 'An office Wi-Fi channel is shared on demand by laptops and phones that send data in bursts.',
  },
  'cn.u2.aloha': {
    summary: 'In **ALOHA**, devices send whenever they want; if a collision happens, they wait a random time and try again. **Slotted ALOHA** only allows sending at fixed time slots.',
    picture: [{ table: { head: ['', 'Pure ALOHA', 'Slotted ALOHA'], rows: [['Send', 'Any time', 'Start of a slot'], ['Risky window', '2 frame times', '1 frame time'], ['Best throughput', '18.4%', '36.8%']] } }],
    points: [
      'Pure ALOHA: S = G e^(−2G); slotted: S = G e^(−G).',
      'Slotting halves the chance of collision, doubling the best throughput.',
    ],
    analogy: 'Pure ALOHA is people talking whenever they like; slotted ALOHA is people allowed to start speaking only when a bell rings.',
    example: 'ALOHA was first used to link Hawaiian islands by radio in 1971.',
  },
  'cn.u2.csma': {
    summary: '**CSMA** means "listen before you talk". **CSMA/CD** (wired Ethernet) also stops at once if a collision happens; **CSMA/CA** (Wi-Fi) tries to avoid collisions in the first place.',
    picture: [{ flow: ['Listen to the channel', 'Idle? Send', 'Collision? Stop and send jam', 'Wait a random time', 'Try again'] }],
    points: [
      '**1-persistent**: send the moment it is free. **Non-persistent**: wait randomly, then check. **p-persistent**: send with probability p.',
      'Minimum frame for CSMA/CD = 2 × propagation time × bandwidth.',
      'Collision-free methods: bit-map, token passing, binary countdown.',
    ],
    analogy: 'Like polite people at a meeting: wait for silence before speaking, and if two start together, both stop, wait a moment and try again.',
    example: '20 Mbps and 40 µs propagation: the minimum frame is 2 × 40 µs × 20 Mbps = 1600 bits = 200 bytes.',
  },

  // ======================= UNIT III =======================
  'cn.u3.nl-design': {
    summary: 'The **network layer** gets packets from the source computer to the destination computer across many networks, choosing routes through routers.',
    picture: [{ table: { head: ['', 'Datagram', 'Virtual circuit'], rows: [['Setup', 'None', 'Needed'], ['Each packet', 'Routed alone', 'Follows the set path'], ['Router fails', 'Reroute', 'Circuit breaks']] } }],
    points: [
      'Routers store and forward whole packets.',
      'The Internet\'s IP is datagram (connectionless).',
      '**Tunnelling** wraps one network\'s packet inside another\'s to cross it.',
    ],
    analogy: 'Like courier hubs passing a parcel from city to city until it reaches the destination address.',
    example: 'An IPv6 packet is put inside an IPv4 packet to cross an IPv4-only network, then unwrapped on the other side.',
  },
  'cn.u3.optimality': {
    summary: 'The **optimality principle**: if the best path from I to K passes through J, then the part from J to K is also the best path from J to K.',
    picture: [{ flow: ['I', 'J', 'K'], label: 'Best I → K through J means best J → K too' }],
    points: [
      'So all best paths to one destination form a tree, the **sink tree**.',
      'Routing algorithms are static (fixed in advance) or adaptive (change with traffic).',
    ],
    analogy: 'If the fastest way from Hyderabad to Chennai goes through Vijayawada, then that same road is also the fastest way from Vijayawada to Chennai.',
    example: 'Every router\'s best path to the college server, drawn together, forms one tree rooted at the server.',
  },
  'cn.u3.shortest-path': {
    summary: '**Dijkstra\'s algorithm** finds the cheapest path from one router to all others. It repeatedly picks the nearest unfinished node and updates its neighbours.',
    picture: [{ flow: ['Source = 0, others = ∞', 'Pick the smallest unfinished', 'Mark it final', 'Update its neighbours'], loop: 'Until every node is final' }],
    points: [
      'Labels are tentative until the node is made permanent.',
      'Keep the "previous node" to read the path at the end.',
      'Costs can be distance, delay, hops or money.',
    ],
    analogy: 'Like spreading water from a source: it reaches the closest places first, and each place\'s arrival time is final once water gets there.',
    example: 'A–B 2, B–C 2, C–E 1, E–D 1: the best route A to D is A, B, C, E, D with cost 6, cheaper than the direct-looking A, B, D (cost 7).',
  },
  'cn.u3.flooding': {
    summary: '**Flooding** sends every incoming packet out on every other line. It always reaches the destination, but makes many duplicate copies.',
    picture: [{ flow: ['Packet arrives', 'Copy to every other line', 'Neighbours copy again'] }],
    points: [
      'Limit it with a **hop counter** or by remembering packets already seen.',
      'Very robust: works even if many routers fail.',
      'Used to spread link-state updates and in military networks.',
    ],
    analogy: 'Like forwarding a message to every friend, who forwards it to every friend: it surely reaches the person, but everyone gets it many times.',
    example: 'A hop count of 5 stops copies after they pass 5 routers.',
  },
  'cn.u3.distance-vector': {
    summary: 'In **distance vector routing** each router keeps a table of "best distance to every destination" and swaps it with its neighbours regularly. It is simple but can be slow to notice failures.',
    picture: [{ flow: ['Know cost to each neighbour', 'Get neighbours\' tables', 'Best = min(cost to neighbour + their distance)', 'Update and share'], loop: 'Repeat every few seconds' }],
    points: [
      'Uses the Bellman-Ford rule.',
      'Good news spreads fast; bad news spreads slowly (**count-to-infinity**).',
      'Fixes: split horizon, poison reverse, small "infinity" (16 in RIP).',
    ],
    analogy: 'Like asking neighbours "how far are you from the market?" and adding the distance to each neighbour, then picking the smallest.',
    example: 'J reaches H at cost 12 and H says G is 6 away, so J writes "G: 18 via H" if no neighbour offers better.',
  },
  'cn.u3.link-state': {
    summary: 'In **link state routing** every router learns the **whole map** of the network, then runs Dijkstra to find its own best paths.',
    picture: [{ flow: ['Discover neighbours', 'Measure link costs', 'Build a link-state packet', 'Flood it to all routers', 'Run Dijkstra on the full map'] }],
    points: [
      'Reacts quickly to changes; no count-to-infinity.',
      'Needs more memory and CPU than distance vector.',
      'OSPF and IS-IS are link-state protocols.',
    ],
    analogy: 'Distance vector is asking neighbours for directions; link state is everyone sharing a full map, so each person plans their own route.',
    example: 'When a link fails, the router next to it floods an update and every router recomputes paths within moments.',
  },
  'cn.u3.ospf': {
    summary: '**OSPF** (Open Shortest Path First) is the main link-state routing protocol used **inside** an organisation\'s network (an autonomous system).',
    picture: [{ tree: { root: 'OSPF autonomous system', kids: ['Backbone area 0', 'Area 1', 'Area 2'] } }],
    points: [
      'Splits big networks into **areas** joined by a backbone to keep maps small.',
      'Link types: point-to-point, transient (LAN), stub, virtual.',
      'Converges faster than RIP because changes are flooded immediately.',
    ],
    analogy: 'Like a company with departments (areas): each knows its own floor plan in detail and connects to others through the main corridor (backbone).',
    example: 'A university network uses OSPF so every router finds the fastest path between hostel, labs and library.',
  },
  'cn.u3.bgp': {
    summary: '**BGP** (Border Gateway Protocol) routes traffic **between** different organisations\' networks on the Internet. It chooses routes by policy, not just by distance.',
    picture: [{ flow: ['AS 1 (Jio)', 'BGP', 'AS 2 (Airtel)', 'BGP', 'AS 3 (Google)'] }],
    points: [
      'It is a **path-vector** protocol: routes carry the list of networks they pass through, which prevents loops.',
      'Intra-AS routing (OSPF) finds the best path inside; inter-AS routing (BGP) follows business rules between.',
    ],
    analogy: 'Like countries agreeing which airlines may fly through their airspace: the route chosen depends on agreements, not just the shortest distance.',
    example: 'An ISP may prefer sending traffic through a partner it does not have to pay, even if another path is shorter.',
  },
  'cn.u3.qos': {
    summary: '**Quality of Service** means giving each kind of traffic what it needs: enough bandwidth, low delay, low jitter and reliability.',
    picture: [{ table: { head: ['Traffic', 'Needs most'], rows: [['Video call', 'Low delay and jitter'], ['File download', 'Reliability'], ['Streaming', 'Steady bandwidth']] } }],
    points: [
      '**Leaky bucket**: smooths bursts into a steady output rate.',
      '**Token bucket**: allows short bursts if tokens are saved up.',
      'Also: scheduling, admission control, resource reservation (RSVP).',
    ],
    analogy: 'A leaky bucket lets water drip out at a fixed rate however fast you pour; a token bucket is a pass card that lets you go faster if you saved credits.',
    example: 'A video call app marks its packets as high priority so they skip ahead of a background download.',
  },
  'cn.u3.ipv4': {
    summary: '**IPv4** is the Internet\'s main packet protocol. Each packet has a header (20 to 60 bytes) with source and destination addresses, a time-to-live, fragmentation fields and a checksum.',
    picture: [{ stack: ['Version, header length, type of service, total length', 'Identification, flags, fragment offset', 'TTL, protocol, header checksum', 'Source IP address', 'Destination IP address', 'Options (if any)'] }],
    points: [
      'Connectionless, best effort: no guarantee of delivery or order.',
      '**TTL** stops packets looping forever.',
      'Big packets are **fragmented** to fit smaller networks (MTU).',
    ],
    analogy: 'Like a shipping label: from, to, weight, how many hops it may take, and a note if the parcel was split into boxes.',
    example: 'A 1000-byte datagram sent over a link with MTU 100 is split into fragments of 80 data bytes each (multiple of 8) plus a 20-byte header.',
  },
  'cn.u3.ip-addresses': {
    summary: 'An **IPv4 address** is 32 bits, written as four numbers like 192.168.1.10. It has a **network part** and a **host part**; the mask or prefix says where the split is.',
    picture: [{ flow: ['192.168.1.10/24', 'Network: 192.168.1', 'Host: .10'] }],
    points: [
      'Classes A, B, C were the old fixed splits; **CIDR** allows any split (/22, /27…).',
      '**Subnetting** divides a network into smaller ones; supernetting combines them.',
      '**NAT** lets many devices share one public address.',
    ],
    analogy: 'Like a postal address: the city and street (network part) get you to the area, and the house number (host part) finds the house.',
    example: '200.1.1.0/26 gives 64 addresses per subnet, 62 usable for hosts.',
  },
  'cn.u3.ipv6': {
    summary: '**IPv6** uses much longer **128-bit** addresses, solving IPv4\'s address shortage, and has a simpler fixed 40-byte header that routers handle faster.',
    picture: [{ table: { head: ['', 'IPv4', 'IPv6'], rows: [['Address', '32 bits', '128 bits'], ['Header', '20 to 60 bytes', '40 bytes fixed'], ['Checksum', 'Yes', 'No'], ['Written as', '192.168.1.1', '2001:db8::1']] } }],
    points: [
      'No fragmentation by routers; extension headers for options.',
      'Transition methods: dual stack, tunnelling, translation.',
    ],
    analogy: 'IPv4 was a phone system with 4-digit numbers that ran out; IPv6 moved to numbers so long that every grain of sand could have one.',
    example: '2001:0db8:0000:0000:0000:0000:0000:0001 can be shortened to 2001:db8::1.',
  },

  // ======================= UNIT IV =======================
  'cn.u4.transport-service': {
    summary: 'The **transport layer** delivers data between **programs** (processes), not just between computers, and hides the network\'s unreliability.',
    picture: [{ flow: ['App on host A (port 5000)', 'Transport', 'Network', 'Transport', 'App on host B (port 80)'] }],
    points: [
      'IP delivers host to host; ports deliver to the right process.',
      'Services: connection-oriented (TCP) or connectionless (UDP).',
    ],
    analogy: 'IP gets a letter to the right building; the transport layer gets it to the right person inside using the flat number (port).',
    example: 'Your browser on port 52000 talks to a web server on port 443.',
  },
  'cn.u4.sockets': {
    summary: '**Berkeley sockets** are the programming functions apps use to talk over the network: create a socket, connect, send, receive, close.',
    picture: [{ flow: ['Server: socket, bind, listen, accept', 'Client: socket, connect', 'Both: send / recv', 'close'] }],
    points: [
      'A socket = IP address + port.',
      'TCP sockets need listen/accept/connect; UDP sockets just sendto/recvfrom.',
    ],
    analogy: 'A socket is like a phone: the server waits for calls (listen, accept), the client dials (connect), and both talk (send, recv).',
    example: 'A chat server binds to port 9000, listens, and accepts each new client connection.',
  },
  'cn.u4.elements': {
    summary: 'Every transport protocol must handle the same problems: **addressing**, **setting up and closing connections** safely, **error and flow control**, **multiplexing**, and **crash recovery**.',
    picture: [{ tree: { root: 'Elements of transport protocols', kids: ['Addressing (ports)', 'Connection setup', 'Connection release', 'Error and flow control', 'Multiplexing', 'Crash recovery'] } }],
    points: [
      'Old delayed packets can confuse a new connection, hence the three-way handshake.',
      'Releasing a connection safely is hard (two-army problem).',
    ],
    analogy: 'Like a formal phone call: dial the right extension, both say hello, talk with checks ("did you get that?"), and both say goodbye.',
    example: 'TCP uses random starting sequence numbers so a delayed packet from an old connection is not accepted.',
  },
  'cn.u4.udp': {
    summary: '**UDP** is a simple, fast transport protocol: it just adds ports, a length and a checksum. No connection, no guarantee of delivery or order.',
    picture: [{ stack: ['Source port (16)', 'Destination port (16)', 'Length (16)', 'Checksum (16)', 'Data'] }],
    points: [
      'Header is only 8 bytes.',
      'Good for DNS, video calls, online games, where speed matters more than perfect delivery.',
    ],
    analogy: 'Like dropping postcards in a postbox: quick and cheap, but no tracking and no receipt.',
    example: 'A DNS lookup sends one small UDP request and gets one reply; if it is lost, the app simply asks again.',
  },
  'cn.u4.tcp-intro': {
    summary: '**TCP** gives apps a **reliable, ordered** two-way stream of bytes over an unreliable network, with flow control and congestion control.',
    picture: [{ flow: ['Connect (handshake)', 'Send numbered bytes', 'Receiver ACKs', 'Resend anything lost', 'Close'] }],
    points: [
      'Connection-oriented and full duplex.',
      'Every byte has a sequence number.',
      'Used by web, e-mail, file transfer.',
    ],
    analogy: 'Like a registered courier: tracked, signed for, and resent if lost.',
    example: 'Downloading a PDF uses TCP so not a single byte is missing or out of order.',
  },
  'cn.u4.tcp-header': {
    summary: 'Every TCP segment starts with a **header** of 20 to 60 bytes: ports, sequence number, ACK number, flags, window size, checksum and urgent pointer.',
    picture: [{ stack: ['Source port, destination port', 'Sequence number', 'Acknowledgement number', 'Header length, flags (SYN, ACK, FIN, RST, PSH, URG), window', 'Checksum, urgent pointer', 'Options'] }],
    points: [
      'SYN starts, FIN ends, ACK confirms, RST resets.',
      'The window field tells the sender how much the receiver can take.',
    ],
    analogy: 'Like the form stuck on a parcel: from, to, parcel number, "received up to", and special stamps like URGENT.',
    example: 'A segment with SYN set and sequence number 1000 is the first step of opening a connection.',
  },
  'cn.u4.tcp-connect': {
    summary: 'TCP opens a connection with a **three-way handshake**: SYN, SYN+ACK, ACK. Both sides agree on their starting sequence numbers.',
    picture: [{ flow: ['Client: SYN (seq = x)', 'Server: SYN + ACK (seq = y, ack = x + 1)', 'Client: ACK (ack = y + 1)', 'Connected'] }],
    points: [
      'Three steps (not two) so old duplicate packets cannot open a fake connection.',
      'States: LISTEN, SYN-SENT, SYN-RECEIVED, ESTABLISHED.',
    ],
    analogy: 'Like a phone call: "Hello, can you hear me?" "Yes, can you hear me?" "Yes." Then the conversation starts.',
    example: 'Client sends SYN 100, server replies SYN 300 ACK 101, client replies ACK 301.',
  },
  'cn.u4.tcp-release': {
    summary: 'TCP closes each direction separately with **FIN** and **ACK**, four messages in all. The side that closes first waits a while (**TIME_WAIT**) to catch late packets.',
    picture: [{ flow: ['A: FIN', 'B: ACK', 'B: FIN', 'A: ACK, then TIME_WAIT'] }],
    points: [
      'A half-closed connection can still receive data in one direction.',
      'TIME_WAIT lasts 2 × maximum segment lifetime.',
    ],
    analogy: 'Like ending a call: "I am done." "OK." "I am done too." "OK, bye", then holding the phone a moment in case the other person adds something.',
    example: 'After a web page loads, the browser sends FIN and the server ACKs, then sends its own FIN.',
  },
  'cn.u4.tcp-window': {
    summary: 'TCP\'s **sliding window** lets the sender send several bytes ahead without waiting, up to the window size the receiver allows. The window moves forward as ACKs come back.',
    picture: [{ flow: ['Sent and ACKed', 'Sent, waiting for ACK', 'Can send now', 'Cannot send yet'] }],
    points: [
      'Window size is advertised by the receiver in every ACK.',
      'A zero window pauses the sender until space frees up.',
    ],
    analogy: 'Like a teacher saying "you may hand in up to 3 pages before I check them": you keep writing while she checks.',
    example: 'Receiver advertises 4000 bytes: sender can have 4000 unacknowledged bytes in flight.',
  },
  'cn.u4.tcp-timers': {
    summary: 'TCP uses **timers**: to resend lost data (retransmission), to probe a zero window (persistence), to check an idle connection (keepalive), and to wait before closing (TIME_WAIT).',
    picture: [{ tree: { root: 'TCP timers', kids: ['Retransmission', 'Persistence', 'Keepalive', 'TIME_WAIT'] } }],
    points: [
      'The retransmission timeout adapts to the measured round-trip time (Jacobson\'s algorithm).',
      'Karn\'s rule: do not measure RTT on resent segments.',
    ],
    analogy: 'Like waiting for a friend\'s reply: you learn how long they usually take and only resend if they take much longer than usual.',
    example: 'If RTT is usually 100 ms, the timeout is set a bit higher; a segment not ACKed in that time is resent.',
  },
  'cn.u4.flow-control': {
    summary: '**Flow control** stops a fast sender from overflowing a slow receiver. The receiver says how much buffer space it has left, and the sender never sends more than that.',
    picture: [{ flow: ['Receiver: "I have 2 KB free"', 'Sender sends at most 2 KB', 'Receiver app reads data', 'Receiver: "Now 4 KB free"'] }],
    points: [
      'Uses the window field in TCP ACKs.',
      'Different from congestion control, which protects the network, not the receiver.',
    ],
    analogy: 'Like filling a glass: you pour only as much as the glass can hold, and wait for someone to drink before pouring more.',
    example: 'A slow phone downloading a file advertises a small window, so the server slows down.',
  },
  'cn.u4.congestion': {
    summary: '**Congestion** is when too much traffic overloads routers and packets get dropped. TCP controls it with a **congestion window** that starts small, grows, and halves when loss happens.',
    picture: [{ flow: ['Slow start: double each RTT', 'Reach threshold', 'Congestion avoidance: +1 each RTT', 'Loss: cut window, restart'] }],
    points: [
      'Slow start grows fast (exponential) up to the threshold.',
      'Then additive increase, multiplicative decrease (AIMD).',
      'Timeout: window back to 1; three duplicate ACKs: halve it (fast recovery).',
    ],
    analogy: 'Like merging into traffic: start slowly, speed up while the road is clear, and brake hard when you see a jam.',
    example: 'cwnd goes 1, 2, 4, 8 (slow start) to a threshold of 8, then 9, 10, 11… until a loss.',
  },

  // ======================= UNIT V =======================
  'cn.u5.dns': {
    summary: '**DNS** is the Internet\'s phone book: it turns names like www.cbit.ac.in into IP addresses that computers use.',
    picture: [{ flow: ['You type www.cbit.ac.in', 'Ask DNS resolver', 'Resolver finds the IP', 'Browser connects to that IP'] }],
    points: [
      'Distributed across many servers worldwide.',
      'Uses UDP port 53 for most queries.',
      'Answers are cached to save time.',
    ],
    analogy: 'Like saving a friend\'s name in your phone: you tap the name, and the phone dials the number for you.',
    example: 'www.google.com resolves to an address such as 142.250.183.4.',
  },
  'cn.u5.dns-namespace': {
    summary: 'The **DNS name space** is an upside-down tree: the root at the top, then top-level domains (.com, .in), then names below them.',
    picture: [{ tree: { root: 'Root (.)', kids: ['com', 'org', 'in → ac.in → cbit.ac.in', 'edu'] } }],
    points: [
      'A full name is read from the bottom up: www.cbit.ac.in.',
      'Generic domains (.com, .org) and country domains (.in, .uk).',
    ],
    analogy: 'Like a postal address read backwards: country, state, city, street, house.',
    example: 'In www.cbit.ac.in, "in" is the top level, "ac" is academic, "cbit" is the college, "www" is the web server.',
  },
  'cn.u5.dns-rr': {
    summary: '**Resource records** are the entries in DNS: each says "for this name, here is this type of information".',
    picture: [{ table: { head: ['Type', 'Gives'], rows: [['A', 'IPv4 address'], ['AAAA', 'IPv6 address'], ['MX', 'Mail server'], ['NS', 'Name server'], ['CNAME', 'Alias'], ['PTR', 'Name for an IP (reverse)']] } }],
    points: [
      'Five parts: domain name, time to live, class, type, value.',
      'TTL says how long others may cache the record.',
    ],
    analogy: 'Like rows in a contact list: name, and then phone, e-mail or home address depending on the field.',
    example: 'cbit.ac.in. 3600 IN MX 10 mail.cbit.ac.in. means mail for cbit.ac.in goes to mail.cbit.ac.in.',
  },
  'cn.u5.name-servers': {
    summary: 'DNS is split among many **name servers**: root servers, top-level-domain servers, and authoritative servers for each organisation. Your resolver asks them in turn.',
    picture: [{ flow: ['Resolver', 'Root server: ask .in', '.in server: ask ac.in', 'cbit.ac.in server: here is the IP'] }],
    points: [
      '**Recursive** query: the server does all the work and returns the answer.',
      '**Iterative** query: each server says "ask that one instead".',
      'Caching avoids asking again.',
    ],
    analogy: 'Like asking for directions: one helper walks you there (recursive), or each person points you to the next person (iterative).',
    example: 'Your laptop asks the college DNS recursively; the college DNS asks root, .in and cbit.ac.in servers iteratively.',
  },
  'cn.u5.email-arch': {
    summary: 'E-mail uses three kinds of helpers: a **user agent** to write and read, **SMTP servers** to carry mail between servers, and **POP3/IMAP** to fetch it into your inbox.',
    picture: [{ flow: ['Sender\'s app (UA)', 'SMTP to sender\'s server', 'SMTP to receiver\'s server', 'POP3 / IMAP to receiver\'s app'] }],
    points: [
      'SMTP pushes mail; POP3 and IMAP pull it.',
      'The mail server keeps your mailbox even when your laptop is off.',
    ],
    analogy: 'Like the post: you write a letter (UA), post offices carry it (SMTP), and you collect it from your post box (POP3/IMAP).',
    example: 'Sending from Gmail to Outlook: Gmail\'s server uses SMTP to deliver to Outlook\'s server; the receiver reads it through IMAP.',
  },
  'cn.u5.user-agent': {
    summary: 'The **user agent** is your mail program: it lets you compose, read, reply, forward and organise mail, and talks to mail servers for you.',
    picture: [{ tree: { root: 'User agent', kids: ['Compose', 'Read', 'Reply', 'Forward', 'Folders'] } }],
    points: [
      'Can be an app (Outlook, Thunderbird) or webmail (Gmail in a browser).',
      'Command-line agents (mail) and GUI agents.',
    ],
    analogy: 'Like your writing desk and letter tray: where you write, read and file letters.',
    example: 'The Gmail app on your phone is a user agent.',
  },
  'cn.u5.formats': {
    summary: 'An e-mail has **headers** (From, To, Subject, Date), a blank line, and the **body**. **MIME** lets mail carry other languages, images and attachments.',
    picture: [{ stack: ['From:, To:, Cc:, Subject:, Date:', '(blank line)', 'Body text', 'MIME attachments'] }],
    points: [
      'RFC 5322 defines the headers.',
      'MIME adds Content-Type and encodings like base64.',
    ],
    analogy: 'Like a letter: the envelope details on top, then the letter, with photos clipped to it (attachments).',
    example: 'A PDF attachment is sent as Content-Type: application/pdf, encoded in base64.',
  },
  'cn.u5.transfer': {
    summary: '**SMTP** carries mail from the sender\'s app to its server and from server to server, using simple text commands over TCP port 25.',
    picture: [{ flow: ['HELO', 'MAIL FROM', 'RCPT TO', 'DATA (message, ends with .)', 'QUIT'] }],
    points: [
      'SMTP only **pushes** mail; it cannot fetch it.',
      'Servers reply with codes like 250 OK.',
    ],
    analogy: 'Like a courier hand-over: introduce yourself, say who it is from and to, hand over the parcel, and leave.',
    example: 'MAIL FROM:<ravi@cbit.ac.in> RCPT TO:<anu@gmail.com> then DATA sends the message.',
  },
  'cn.u5.delivery': {
    summary: '**Final delivery** pulls mail from your mail server to your device using **POP3** (download it) or **IMAP** (keep it on the server and sync).',
    picture: [{ table: { head: ['', 'POP3', 'IMAP'], rows: [['Mail stays on server', 'Usually no', 'Yes'], ['Many devices', 'Hard', 'Easy, synced'], ['Folders on server', 'No', 'Yes']] } }],
    points: [
      'POP3 port 110; IMAP port 143.',
      'Webmail uses HTTP instead.',
    ],
    analogy: 'POP3 is collecting your letters from the post office and taking them home; IMAP is reading them at the post office so you can see them from anywhere.',
    example: 'Reading the same Gmail on phone and laptop works because both use IMAP-style syncing.',
  },
  'cn.u5.ftp': {
    summary: '**FTP** copies files between computers using **two TCP connections**: one for commands (port 21) and a separate one for each file (port 20).',
    picture: [{ flow: ['Control connection (port 21): commands like USER, LIST, RETR', 'Data connection (port 20): the actual file'] }],
    points: [
      'Active and passive modes decide who opens the data connection.',
      'Plain FTP sends passwords unencrypted; SFTP/FTPS are secure versions.',
    ],
    analogy: 'Like phoning a shop to order (control line) and receiving the goods by a separate delivery van (data line).',
    example: 'RETR notes.pdf on the control connection makes the server send notes.pdf over a new data connection.',
  },
  'cn.u5.telnet': {
    summary: '**TELNET** lets you log in to a distant computer and use it as if your keyboard and screen were attached to it, over TCP port 23.',
    picture: [{ flow: ['Your keyboard', 'TELNET client', 'Network (NVT format)', 'TELNET server', 'Remote computer'] }],
    points: [
      'Uses a **Network Virtual Terminal** so different systems understand each other.',
      'Sends everything, even passwords, in plain text; SSH replaced it.',
    ],
    analogy: 'Like a very long keyboard cable that reaches a computer in another city.',
    example: 'telnet towel.blinkenlights.nl connects you to a remote server and shows text on your screen.',
  },
  'cn.u5.snmp': {
    summary: '**SNMP** lets network admins monitor and control devices like routers and switches: a **manager** asks questions, **agents** on devices answer, and agents can raise alarms (**traps**).',
    picture: [{ flow: ['Manager: GET request', 'Agent reads its MIB', 'Agent: response', 'Agent: TRAP on a problem'] }],
    points: [
      'The **MIB** is the database of values on each device (CPU, interfaces, errors).',
      'Uses UDP ports 161 and 162.',
      'Operations: Get, GetNext, Set, Trap.',
    ],
    analogy: 'Like a school principal (manager) checking attendance registers kept by each class teacher (agents), who also report emergencies immediately (traps).',
    example: 'A router sends an SNMP trap when a link goes down, and the admin\'s dashboard turns red.',
  },
}
