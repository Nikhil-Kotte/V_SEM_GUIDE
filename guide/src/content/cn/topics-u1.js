// Computer Networks, Unit I: introduction and the physical layer. Keys are syllabus ids.
export default {
  'cn.u1.hardware': {
    oneLine: 'A computer network is a set of connected devices that share data; networks are classed by how they send (broadcast or point-to-point) and by size (PAN, LAN, MAN, WAN).',
    blocks: [
      'A **computer network** is a collection of autonomous computers connected by a single technology so they can exchange information. A **protocol** is the set of rules both sides follow to communicate.',
      { h: 'Uses of networks' },
      { ul: ['Business: resource sharing (printers, files), client-server systems, e-mail, video calls, e-commerce.', 'Home: internet access, social media, streaming, IoT devices.', 'Mobile: navigation, payments, messaging.'] },
      { h: 'Transmission technology' },
      { compare: [
        { title: 'Broadcast', items: ['One channel shared by all machines', 'Every machine receives every packet; an address field says who it is for', 'Small, local networks'] },
        { title: 'Point-to-point', items: ['Connections between individual pairs', 'Packets may hop through intermediate machines (routing)', 'Large networks'] },
      ] },
      { h: 'Networks by scale' },
      { table: { head: ['Type', 'Range', 'Example'], rows: [
        ['PAN', 'About 1 m', 'Bluetooth between phone and earbuds'],
        ['LAN', 'Room, building, campus', 'College lab Ethernet, Wi-Fi'],
        ['MAN', 'A city', 'Cable TV network, city-wide Wi-Fi'],
        ['WAN', 'Country, continent', 'Bank branches linked across India'],
        ['Internetwork', 'Global', 'The Internet: networks of networks'],
      ] } },
      { h: 'Hardware pieces' },
      { ul: ['**Host**: an end device that runs applications (PC, phone); a **client** asks for service, a **server** provides it.', '**NIC** (network interface card): connects a host to the network and gives it a MAC address.', 'Hub, switch, router, modem, access point connect hosts and networks.'] },
      { h: 'Data communication model' },
      { flow: ['Source', 'Transmitter (encodes)', 'Transmission medium', 'Receiver (decodes)', 'Destination'] },
      { tip: 'Point-to-point vs multipoint (asked): a local phone call is **point-to-point** (a dedicated circuit between two phones). A multipoint link lets several devices share one line, which saves cabling and cost.' },
    ],
    terms: [['Protocol', 'The agreed rules for communication between two parties.'], ['Host', 'An end system that runs applications.'], ['NIC', 'Network interface card; connects a device to the network.'], ['LAN', 'Local area network, within a building or campus.']],
    exam: 'Define a network and a protocol, list applications, compare broadcast and point-to-point, and give the PAN/LAN/MAN/WAN table with examples.',
    revise: ['PAN < LAN < MAN < WAN < Internet', 'Broadcast vs point-to-point', 'Source, transmitter, medium, receiver, destination'],
  },

  'cn.u1.topologies': {
    oneLine: 'Topology is the shape of a network\'s connections: bus, star, ring, mesh or a hybrid; a full mesh of n devices needs n(n − 1)/2 links and n − 1 ports per device.',
    blocks: [
      { tree: { root: 'Network topologies', kids: ['Bus', 'Star', 'Ring', 'Mesh', 'Tree / hybrid'] } },
      { table: { head: ['Topology', 'Shape', 'Advantage', 'Disadvantage', 'Used in'], rows: [
        ['Bus', 'All devices on one backbone cable', 'Cheap, little cable', 'A cable break stops everything; collisions', 'Early Ethernet'],
        ['Star', 'Each device to a central hub/switch', 'Easy to add and fault-find', 'Hub failure stops all', 'Office and lab LANs'],
        ['Ring', 'Each device to two neighbours in a loop', 'Orderly access, no collisions', 'One break can stop the ring', 'Token ring, FDDI'],
        ['Mesh', 'Every device to every other', 'Very reliable, private links', 'Lots of cable and ports', 'Backbone between routers'],
        ['Hybrid', 'Mix, e.g. star of stars (tree)', 'Flexible, scalable', 'Complex', 'Campus networks'],
      ] } },
      { h: 'Mesh numericals' },
      { formula: 'Links = n(n − 1) / 2    Ports per device = n − 1' },
      { ul: ['7 devices: 7 × 6 / 2 = **21 cables**, **6 ports** each.', '6 devices: 15 cables, 5 ports each.', '5 nodes: 10 cables.'] },
      { table: { head: ['For n devices', 'Links'], rows: [['Mesh', 'n(n − 1)/2'], ['Star', 'n (one to the hub)'], ['Ring', 'n'], ['Bus', '1 backbone + n drop lines']] } },
    ],
    terms: [['Topology', 'The physical or logical arrangement of network connections.'], ['Full mesh', 'A topology where every device has a dedicated link to every other.']],
    exam: 'Draw the four basic topologies, give one advantage, one disadvantage and one use of each, and solve the mesh formula for the given n.',
    revise: ['Mesh links = n(n−1)/2, ports = n−1', 'Star: hub is the single point of failure'],
  },

  'cn.u1.osi': {
    oneLine: 'The OSI model splits networking into seven layers, from physical bits on a wire up to the application, each layer serving the one above it.',
    blocks: [
      { stack: ['7 Application: services to the user (e-mail, file transfer)', '6 Presentation: translation, encryption, compression', '5 Session: dialogue control, synchronisation (checkpoints)', '4 Transport: end-to-end delivery, segmentation, flow and error control', '3 Network: logical addressing (IP), routing', '2 Data link: framing, physical (MAC) addressing, error and flow control on one link', '1 Physical: bits as signals, cables, connectors, data rate'], label: 'OSI layers, 7 at the top' },
      { tip: 'Memory aid, top to bottom: **All People Seem To Need Data Processing**.' },
      { h: 'Data units at each layer' },
      { table: { head: ['Layer', 'Data unit', 'Device'], rows: [['Application to session', 'Message / data', 'Gateway'], ['Transport', 'Segment', '-'], ['Network', 'Packet', 'Router'], ['Data link', 'Frame', 'Switch, bridge'], ['Physical', 'Bits', 'Hub, repeater']] } },
      'As data goes down, each layer adds its own **header** (encapsulation); the receiver strips them going up.',
      { h: 'Critique of OSI' },
      { ul: ['**Bad timing**: it arrived after TCP/IP was already widely used.', '**Bad technology**: session and presentation layers are nearly empty while data link and network are overloaded.', '**Bad implementations**: early versions were large and slow.', '**Bad politics**: seen as imposed by governments.'] },
    ],
    terms: [['Encapsulation', 'Each layer wrapping the data from above with its own header.'], ['PDU', 'Protocol data unit: segment, packet, frame or bits depending on the layer.']],
    exam: 'Draw the seven layers as a stack with each layer\'s main functions, show the data unit at each, and add the critique if asked.',
    revise: ['Physical, data link, network, transport, session, presentation, application', 'Bits, frame, packet, segment, data'],
  },

  'cn.u1.tcpip': {
    oneLine: 'The TCP/IP model has four layers (link, internet, transport, application) and is the model the real Internet runs on.',
    blocks: [
      { stack: ['Application: HTTP, SMTP, DNS, FTP', 'Transport: TCP (reliable), UDP (fast, unreliable)', 'Internet: IP, routing of packets across networks', 'Link (host-to-network): Ethernet, Wi-Fi'], label: 'TCP/IP layers, top to bottom' },
      { ul: [
        '**Link**: carries IP packets over a particular link; the model says little about it.',
        '**Internet**: delivers packets from source to destination across many networks; **IP** is connectionless and best-effort.',
        '**Transport**: lets processes on two hosts talk; **TCP** gives a reliable byte stream, **UDP** sends independent datagrams.',
        '**Application**: everything the user sees.',
      ] },
      'Some books show five layers by splitting the link layer into **data link** and **physical**: application, transport, network, data link, physical.',
      { h: 'Services of the internet layer' },
      { ul: ['Logical addressing (IP addresses)', 'Routing packets through routers', 'Fragmentation and reassembly', 'Connectionless, best-effort delivery'] },
    ],
    terms: [['IP', 'Internet Protocol: connectionless, best-effort delivery of packets.'], ['TCP', 'Transmission Control Protocol: reliable, connection-oriented byte stream.'], ['UDP', 'User Datagram Protocol: fast, connectionless, no guarantees.']],
    exam: 'Draw the four TCP/IP layers with the protocols in each, explain each layer\'s role, and mention the five-layer variant.',
    revise: ['Link, internet, transport, application', 'IP best effort; TCP reliable; UDP fast'],
  },

  'cn.u1.osi-vs-tcpip': {
    oneLine: 'OSI is a 7-layer reference model designed before its protocols; TCP/IP is a 4-layer model described after its protocols, and it is the one actually used.',
    blocks: [
      { table: { head: ['', 'OSI', 'TCP/IP'], rows: [
        ['Layers', '7', '4 (or 5)'],
        ['Came first', 'Model, then protocols', 'Protocols, then model'],
        ['Session and presentation', 'Separate layers', 'Merged into application'],
        ['Network layer', 'Connection-oriented and connectionless', 'Connectionless only (IP)'],
        ['Transport layer', 'Connection-oriented only', 'Both (TCP and UDP)'],
        ['Use', 'Teaching, reference', 'The real Internet'],
      ] } },
      { stack: ['OSI 7, 6, 5 ↔ TCP/IP Application', 'OSI 4 ↔ Transport', 'OSI 3 ↔ Internet', 'OSI 2, 1 ↔ Link'], label: 'Layer mapping' },
      { compare: [
        { title: 'Same', items: ['Both are layered stacks of independent protocols', 'Both have transport and network layers with similar jobs'] },
        { title: 'Different', items: ['Number of layers', 'OSI clearly separates service, interface and protocol', 'TCP/IP\'s network layer is connectionless only'] },
      ] },
    ],
    terms: [['Reference model', 'A layered framework that describes what each layer should do.']],
    exam: 'Give the comparison table and the layer-mapping diagram; for "same and different", two points each.',
    revise: ['OSI 7 vs TCP/IP 4', 'OSI model first; TCP/IP protocols first'],
  },

  'cn.u1.switching': {
    oneLine: 'Circuit switching reserves a dedicated path for the whole call; packet switching sends independent packets that share links; virtual circuit switching sets up a path first but still sends packets.',
    blocks: [
      { table: { head: ['', 'Circuit switching', 'Packet (datagram) switching', 'Virtual circuit'], rows: [
        ['Path', 'Dedicated, set up first', 'None; each packet routed alone', 'Set up first, shared'],
        ['Order', 'In order', 'May arrive out of order', 'In order'],
        ['Bandwidth', 'Reserved (wasted when idle)', 'Shared on demand', 'Shared'],
        ['Setup delay', 'Yes', 'No', 'Yes'],
        ['If a link fails', 'Call drops', 'Packets reroute', 'Circuit must be re-established'],
        ['Example', 'Old telephone network', 'The Internet (IP)', 'ATM, MPLS, X.25'],
      ] } },
      { flow: ['Circuit: setup', 'data transfer on reserved path', 'teardown'] },
      'In a **virtual circuit**, each packet carries a short **VC identifier** instead of the full destination address; routers use it to look up the outgoing line from the table built at setup.',
      { h: 'Packet-switching delays (numericals)' },
      { formula: 'Transmission delay = L / R    Propagation delay = d / s' },
      { ul: ['1000-byte packet (8000 bits) on a 2 Mbps link: transmission = 8000 / 2×10⁶ = **4 ms**.', '2500 km at 2.5×10⁸ m/s: propagation = 2.5×10⁶ / 2.5×10⁸ = **10 ms**. It depends on distance and speed, not on L or R.', 'Store-and-forward through one switch with links R1 and R2: end-to-end = L/R1 + L/R2 (ignoring propagation and queuing).'] },
      { h: 'Connection-oriented vs connectionless service' },
      'Connection-oriented service sets up a connection first, like a phone call (TCP). Connectionless service sends each message independently, like the postal system (UDP, IP).',
    ],
    terms: [['Circuit switching', 'A dedicated path is reserved for the whole communication.'], ['Datagram', 'A packet routed independently in a connectionless network.'], ['Virtual circuit', 'A path set up in advance in a packet network; packets carry a short circuit id.'], ['Store-and-forward', 'A switch receives a whole packet before sending it on.']],
    exam: 'Draw one small network for each type, give the comparison table, and solve the delay numericals with L/R and d/s.',
    revise: ['Circuit: reserved path, setup', 'Packet: shared, independent routing', 'VC: setup + packets, in order', 'd_trans = L/R, d_prop = d/s'],
  },

  'cn.u1.twisted-coax': {
    oneLine: 'Twisted pair (copper pairs twisted to cancel interference) and coaxial cable (a shielded central conductor) are the two copper guided media.',
    blocks: [
      { tree: { root: 'Transmission media', kids: ['Guided: twisted pair', 'Guided: coaxial cable', 'Guided: fibre optic', 'Unguided: radio, microwave, infrared'] } },
      { h: 'Twisted pair' },
      'Two insulated copper wires twisted together. **Twisting reduces interference**: noise hits both wires roughly equally, and the receiver uses the **difference** between them, so the noise cancels. It also reduces crosstalk between neighbouring pairs.',
      { table: { head: ['Kind', 'Detail'], rows: [['UTP', 'Unshielded; cheap, used in Ethernet LANs (Cat 5e, Cat 6)'], ['STP', 'Shielded with foil; better against noise, costlier'], ['Category 5e / 6', 'Up to 1 Gbps / 10 Gbps over short runs']] } },
      { h: 'Coaxial cable' },
      { stack: ['Outer plastic jacket', 'Braided metal shield (outer conductor)', 'Insulating layer', 'Inner copper core'], label: 'Coaxial cable, outside to inside' },
      'Better shielding than twisted pair, so it carries higher frequencies over longer distances. Used in cable TV and older Ethernet (10Base2, 10Base5).',
    ],
    terms: [['Guided media', 'Signals travel along a physical path (cable).'], ['UTP', 'Unshielded twisted pair.'], ['Crosstalk', 'Interference from a signal in a neighbouring wire.']],
    exam: 'Explain why twisting reduces noise, draw the cross-section of a coaxial cable, and give uses and limits of each.',
    revise: ['Twisting cancels noise', 'UTP vs STP', 'Coax: core, insulation, shield, jacket'],
  },

  'cn.u1.fiber': {
    oneLine: 'Optical fibre carries data as pulses of light through a thin glass core by total internal reflection, giving huge bandwidth, low loss and no electrical interference.',
    blocks: [
      { stack: ['Jacket (protective plastic)', 'Cladding (glass with lower refractive index)', 'Core (glass with higher refractive index, carries light)'], label: 'Fibre, outside to inside' },
      'Light hitting the core-cladding boundary at more than the **critical angle** is totally reflected back into the core, so it bounces along the fibre.',
      { flow: ['Electrical signal', 'Light source (LED or laser)', 'Fibre', 'Photodiode detector', 'Electrical signal'] },
      { table: { head: ['Mode', 'Idea', 'Use'], rows: [['Multimode step-index', 'Wide core, many light paths', 'Short links'], ['Multimode graded-index', 'Core index changes gradually, less spreading', 'LANs'], ['Single-mode', 'Very thin core, one path, laser', 'Long distance, undersea']] } },
      { compare: [
        { title: 'Advantages over copper', items: ['Much higher bandwidth', 'Very low attenuation, long distances', 'Immune to electromagnetic interference', 'Thin, light, hard to tap'] },
        { title: 'Disadvantages', items: ['Fragile, needs skill to install and join', 'Costly interfaces', 'One-way: two fibres for two-way'] },
      ] },
    ],
    terms: [['Total internal reflection', 'Light fully reflected at a boundary when the angle exceeds the critical angle.'], ['Single-mode fibre', 'A thin-core fibre carrying one light path for long distances.']],
    exam: 'Draw the side view (core, cladding, jacket, light rays bouncing), explain total internal reflection and modes, and list advantages over twisted pair and coax.',
    revise: ['Core, cladding, jacket', 'Total internal reflection', 'Single-mode long; multimode short'],
  },

  'cn.u1.wireless': {
    oneLine: 'Unguided (wireless) media send signals through air: radio waves (omnidirectional), microwaves (line-of-sight, directional) and infrared (short range).',
    blocks: [
      { table: { head: ['Type', 'Frequency', 'Direction', 'Use'], rows: [
        ['Radio waves', '3 kHz to 1 GHz', 'Omnidirectional, pass through walls', 'FM radio, AM, cordless phones'],
        ['Microwaves', '1 to 300 GHz', 'Unidirectional, line of sight', 'Satellite, cellular, point-to-point links'],
        ['Infrared', '300 GHz to 400 THz', 'Short range, cannot pass walls', 'TV remotes, short links'],
      ] } },
      { h: 'Propagation methods' },
      { tree: { root: 'How waves travel', kids: ['Ground propagation: low frequency, follows the earth', 'Sky propagation: bounces off the ionosphere, long distance', 'Line-of-sight: high frequency, straight from antenna to antenna'] } },
      { compare: [
        { title: 'Omnidirectional', items: ['Sends in all directions', 'Easy to receive anywhere', 'Interference, less secure'] },
        { title: 'Unidirectional', items: ['Focused beam (dish antenna)', 'Needs aligned antennas', 'Less interference'] },
      ] },
      { h: 'Guided vs unguided' },
      'Guided media confine the signal in a cable (twisted pair, coax, fibre). Unguided media broadcast through free space; they are easy to deploy and support mobility but face interference and security issues.',
    ],
    terms: [['Line-of-sight propagation', 'Signals travel in a straight line, so antennas must see each other.'], ['Sky propagation', 'Signals bounce off the ionosphere to reach far away.']],
    exam: 'Classify media into guided and unguided, give the radio/microwave/infrared table, and explain ground, sky and line-of-sight propagation.',
    revise: ['Radio: all directions; microwave: line of sight; infrared: short', 'Ground, sky, line-of-sight'],
  },
}
