// Model answers keyed by PYQ id. Every answer lists its sources.
const N3 = 'CN Notes3.pdf'
const T = 'Tanenbaum, Computer Networks'
const F = 'Forouzan, Data Communications and Networking'

export default {
  'cn-tcp-conn': {
    blocks: [
      { h: 'Connection establishment — three-way handshake' },
      { img: 'tcp-handshake' },
      { steps: ['Client sends **SYN** with its initial sequence number x (client → SYN_SENT).', 'Server replies **SYN + ACK**: its own sequence number y, ack = x + 1 (server → SYN_RCVD).', 'Client sends **ACK** with ack = y + 1. Both sides are ESTABLISHED and data transfer begins.'] },
      'The three-way handshake protects against **delayed duplicate** segments: if an old SYN arrives, the server\'s SYN+ACK refers to a connection the client never requested, so the client answers with RST and no bogus connection is made. If both sides send SYN simultaneously, only **one** connection results.',
      { h: 'Connection release — four segments' },
      { img: 'tcp-release' },
      { steps: ['Client sends **FIN** (seq = u) → FIN_WAIT_1.', 'Server sends **ACK** (ack = u + 1) → client FIN_WAIT_2, server CLOSE_WAIT. The connection is half-closed; the server may still send data.', 'Server sends **FIN** (seq = w) → LAST_ACK.', 'Client sends **ACK** (ack = w + 1) and waits 2 × MSL in **TIME_WAIT**, then closes; the server closes on receiving the ACK.'] },
      'Steps 2 and 3 can be combined (three-way release). Timers solve the **two-army problem**: if no reply comes, each side gives up after a timeout.',
    ],
    sources: [`${N3} p56–61, p73–74`, `${T} §6.2.2–6.2.3, §6.5.5–6.5.7`],
  },

  'cn-congestion': {
    blocks: [
      '**Congestion** occurs when the load offered to the network is more than its capacity: router queues fill, packets are delayed and dropped, retransmissions add more load, and throughput collapses.',
      { h: 'Approaches to congestion control' },
      { compare: [
        { title: 'Open-loop (prevention)', items: ['Retransmission, window, acknowledgement, discard and admission policies', 'Traffic shaping: leaky bucket, token bucket'] },
        { title: 'Closed-loop (removal)', items: ['Back-pressure (hop by hop)', 'Choke packets to the source', 'Implicit signalling (loss, delay) and explicit signalling (ECN bits)'] },
      ] },
      { h: 'TCP congestion control' },
      'The sender keeps a congestion window **cwnd**; it may have min(cwnd, rwnd) bytes outstanding.',
      { ol: ['**Slow start**: cwnd starts at 1 MSS and doubles every RTT (exponential) until it reaches **ssthresh**.', '**Congestion avoidance**: above ssthresh, cwnd grows by 1 MSS per RTT (additive increase).', '**Timeout**: ssthresh = cwnd/2, cwnd = 1 MSS, slow start again (multiplicative decrease, TCP Tahoe).', '**3 duplicate ACKs**: fast retransmit the missing segment; ssthresh = cwnd/2 and cwnd = ssthresh (fast recovery, TCP Reno).'] },
      'This AIMD behaviour gives a saw-tooth graph of cwnd against time.',
      { img: 'cn-p64' },
    ],
    sources: [`${N3} p13–17, p62–64, p74`, `${T} §5.3, §6.5.10`, `${F} ch. 24`],
  },

  'cn-dns-services': {
    blocks: [
      '**DNS (Domain Name System)** is a distributed, hierarchical database that maps host names to IP addresses. People remember names; the network needs addresses. Names also stay fixed when a server\'s address changes.',
      { h: 'Services' },
      { ul: ['Name-to-address translation (A, AAAA records).', 'Reverse lookup, address to name (PTR).', 'Host aliasing: canonical names (CNAME).', 'Mail-server aliasing (MX).', 'Load distribution: a name maps to several replicated servers.'] },
      { h: 'Key components' },
      { ol: ['**Name space**: an inverted tree of labels (root → TLDs → domains).', '**Resource records**: (name, TTL, class, type, value).', '**Name servers**: root, TLD and authoritative servers, each responsible for a zone; local servers cache answers.', '**Resolvers**: client software that sends queries (recursive or iterative).'] },
      { img: 'cn-p96b' },
      { img: 'dns-resolution' },
      'DNS uses UDP port 53 for queries (TCP for zone transfers and large responses). Messages are queries or responses with the same format: header, question, answer, authority and additional sections.',
    ],
    sources: [`${N3} p94–97`, `${F} ch. 26 (DNS)`],
  },

  'cn-tcp-vs-udp': {
    blocks: [
      { table: { head: ['Feature', 'TCP', 'UDP'], rows: [
        ['Type', 'Connection-oriented', 'Connectionless'],
        ['Reliability', 'Reliable: ACKs, retransmission', 'Unreliable: no ACKs'],
        ['Ordering', 'In-order delivery', 'No ordering'],
        ['Flow / congestion control', 'Yes (window, cwnd)', 'No'],
        ['Header size', '20–60 bytes', '8 bytes'],
        ['Data', 'Byte stream', 'Message (datagram) boundaries kept'],
        ['Speed / overhead', 'Slower, more overhead', 'Faster, minimal overhead'],
        ['Broadcast / multicast', 'No', 'Yes'],
        ['Applications', 'HTTP, FTP, SMTP, SSH, TELNET', 'DNS, DHCP, SNMP, VoIP, streaming, RPC'],
      ] } },
      { h: 'Headers' },
      { img: 'cn-udp' },
      { img: 'cn-tcp-header' },
      'Fields in TCP but not UDP: sequence number, acknowledgement number, header length, flags (SYN, ACK, FIN, RST, PSH, URG), window size, urgent pointer, options. Both have source port, destination port and checksum; UDP has a length field instead.',
    ],
    sources: [`${N3} p65–73`, `${T} §6.4–6.5`],
  },

  'cn-link-state': {
    blocks: [
      'In **link state routing** each router learns the full topology and computes shortest paths itself. Each router must:',
      { steps: ['**Discover its neighbours** and learn their network addresses (HELLO packets).', '**Measure the delay or cost** to each neighbour (ECHO packets).', '**Construct a link state packet** containing its identity, a sequence number, an age, and the list of neighbours with costs.', '**Send (flood) this packet** to all other routers. Sequence numbers discard duplicates; age removes stale information.', '**Compute the shortest path** to every other router with **Dijkstra\'s algorithm**.'] },
      { img: 'cn-p7' },
      'Example: for the 6-router network above, router B\'s packet lists A (4), C (2) and F (6). Every router floods such a packet, so all routers end up with the same map and build their own shortest-path trees.',
      'Advantages over distance vector: fast convergence, no count-to-infinity. Disadvantages: more memory and computation. OSPF and IS-IS use link state.',
    ],
    sources: [`${N3} p7–8`, `${T} §5.2.5`],
  },

  'cn-tcp-header': {
    blocks: [
      'The TCP header is 20 bytes without options (up to 60 bytes).',
      { img: 'cn-tcp-header' },
      { ul: [
        '**Source port, destination port** (16 bits each): identify the endpoints.',
        '**Sequence number** (32): number of the first data byte in the segment.',
        '**Acknowledgement number** (32): next byte expected (valid when ACK = 1).',
        '**Header length** (4): header size in 32-bit words.',
        '**Flags** (8): CWR and ECE (congestion notification), URG (urgent pointer valid), ACK, PSH (push data to the application), RST (reset), SYN (synchronise / open), FIN (finish / close).',
        '**Window size** (16): number of bytes the receiver can accept (flow control).',
        '**Checksum** (16): over a pseudo-header, the header and the data.',
        '**Urgent pointer** (16): offset to the end of urgent data.',
        '**Options**: e.g. maximum segment size, window scale, timestamps, selective acknowledgement.',
      ] },
    ],
    sources: [`${N3} p71–73`, `${T} §6.5.4`],
  },

  'cn-ipv6-header': {
    blocks: [
      'The IPv6 datagram = a **40-byte fixed base header** + optional **extension headers** + payload.',
      { img: 'cn-ipv6' },
      { ul: ['**Version** (4 bits) = 6.', '**Traffic class** (8): priority / differentiated services.', '**Flow label** (20): identifies a flow needing special handling (real-time traffic).', '**Payload length** (16): bytes after the base header.', '**Next header** (8): type of the next extension header or the transport protocol.', '**Hop limit** (8): like IPv4 TTL.', '**Source and destination addresses** (128 bits each).'] },
      { h: 'IPv4 vs IPv6' },
      { table: { head: ['', 'IPv4', 'IPv6'], rows: [['Address', '32 bits (≈4.3 × 10⁹)', '128 bits (≈3.4 × 10³⁸)'], ['Header', '20–60 bytes', '40 bytes fixed'], ['Checksum', 'Yes', 'Removed'], ['Fragmentation', 'Routers + source', 'Source only'], ['Options', 'In header', 'Extension headers'], ['Notation', 'Dotted decimal', 'Hex with colons, :: compression']] } },
    ],
    sources: [`${N3} p31–34`, `${T} §5.6.3`],
  },

  'cn-ipv4-header': {
    blocks: [
      { img: 'cn-p40' },
      { ul: ['**VER** (4), **HLEN** (4, in 4-byte words), **service type / DS** (8), **total length** (16).', '**Identification** (16), **flags** (3: reserved, DF, MF), **fragmentation offset** (13, in 8-byte units).', '**Time to live** (8), **protocol** (8: 6 = TCP, 17 = UDP), **header checksum** (16).', '**Source** and **destination IP addresses** (32 each).', '**Options + padding** (0–40 bytes): record route, strict/loose source routing, timestamp, security.'] },
      { h: 'Checksum procedure' },
      { steps: ['Set the checksum field to 0 and split the header into 16-bit words.', 'Add all words using one\'s-complement arithmetic.', 'Complement the sum; that is the checksum.', 'Receiver adds all words including the checksum; the complement of the result must be 0, otherwise the datagram is discarded.'] },
      'Only the header is covered, because it changes at every hop (TTL) and the upper layers have their own checksums.',
      { h: 'Fragmentation' },
      'If a datagram exceeds a link\'s MTU it is split; all fragments keep the identification, MF = 1 on all but the last, and the offset gives each fragment\'s position (×8 bytes). Reassembly happens at the destination.',
    ],
    sources: [`${N3} p24–26`, `${F} ch. 19`],
  },

  'cn-email': {
    blocks: [
      'E-mail uses three kinds of agents: **UA** (user agent), **MTA** (message transfer agent, SMTP) and **MAA** (message access agent, POP3/IMAP).',
      { img: 'cn-email' },
      { steps: ['Alice composes mail in her UA.', 'The UA sends it to her mail server with an MTA client (SMTP).', 'The server queues it in a spool.', 'The server\'s MTA client sends it over the Internet to Bob\'s mail server\'s MTA server (SMTP).', 'It is stored in Bob\'s mailbox.', 'Bob\'s UA retrieves it with an MAA client (POP3/IMAP).'] },
      { h: 'Why this design' },
      'The receiver\'s computer may be off, so mail waits on an always-on server. SMTP only **pushes**, so a separate **pull** protocol is needed for the final delivery.',
      { h: 'Components' },
      { ul: ['**User agent**: compose, read, reply, forward, manage mailboxes.', '**MTA**: transfer between servers (SMTP, port 25).', '**MAA**: retrieve mail (POP3 110, IMAP 143).', '**Message format**: envelope + header + body, with MIME for multimedia.'] },
    ],
    sources: [`${N3} p87–90`, `${F} ch. 26 (e-mail)`],
  },

  'cn-smtp': {
    blocks: [
      '**SMTP** (Simple Mail Transfer Protocol) moves mail from the sender\'s UA to its server and between mail servers. It is a **push** protocol using TCP port 25 and plain-text commands.',
      { h: 'Addressing' },
      'Addresses have the form `local-part@domain`. The sending MTA looks up the domain\'s **MX record** in DNS to find the receiving mail server.',
      { h: 'Commands and responses' },
      { table: { head: ['Command', 'Meaning'], rows: [['HELO / EHLO', 'Identify the client'], ['MAIL FROM:', 'Sender'], ['RCPT TO:', 'Recipient'], ['DATA', 'Message follows, ending with a line containing "."'], ['QUIT', 'Close']] } },
      'Responses: 220 ready, 250 OK, 354 start mail input, 221 closing, 5xx errors.',
      { h: 'Three phases' },
      'Connection establishment (TCP + 220 + HELO) → mail transfer (MAIL FROM, RCPT TO, DATA) → termination (QUIT, 221).',
      { h: 'Why POP3/IMAP are needed' },
      'SMTP can only push to a server that is always listening. The final step, from mailbox to the user\'s PC, needs a pull protocol: POP3 or IMAP.',
      { h: 'SMTP vs HTTP' },
      'SMTP pushes, HTTP pulls; SMTP needs 7-bit ASCII (MIME for others), HTTP carries binary directly; SMTP puts all parts in one message, HTTP sends one object per response.',
    ],
    sources: [`${N3} p88–90`, `${F} ch. 26`],
  },

  'cn-pop-imap': {
    blocks: [
      'SMTP is a push protocol and the receiver\'s machine isn\'t a permanently-on server, so the last step uses a **pull** protocol run by the message access agent.',
      { h: 'POP3 (port 110)' },
      'The client connects, authenticates (USER, PASS), lists (LIST) and downloads (RETR) messages, optionally deletes them (DELE), and quits. Delete mode removes mail from the server after download; keep mode leaves a copy.',
      { h: 'IMAP4 (port 143)' },
      'Mail stays on the server. The user can check headers before downloading, search mail on the server, download only parts (e.g. skip a large attachment), and create, rename and delete mailboxes/folders on the server.',
      { table: { head: ['', 'POP3', 'IMAP'], rows: [['Storage', 'Downloaded to one device', 'Kept on the server'], ['Folders', 'Local only', 'On the server'], ['Partial download', 'No', 'Yes'], ['Many devices', 'Poor', 'Good'], ['Complexity', 'Simple', 'More complex']] } },
      'Real-time example: a student reading college mail on both a phone and a laptop uses IMAP so both see the same read/unread state; an office PC that downloads and archives mail once a day can use POP3.',
    ],
    sources: [`${N3} p89–90`, `${F} ch. 26`],
  },

  'cn-ftp': {
    blocks: [
      '**FTP** (File Transfer Protocol) copies files between hosts over TCP. It uses **two connections**:',
      { img: 'cn-ftp' },
      { ul: ['**Control connection** (port 21): stays open the whole session; commands and replies, one line at a time.', '**Data connection** (port 20 in active mode): opened for each file transfer or listing, closed afterwards.'] },
      { h: 'Commands' },
      'USER, PASS, LIST, RETR (download), STOR (upload), CWD, DELE, TYPE (A = ASCII, I = binary), PORT / PASV (active / passive), QUIT.',
      { h: 'Communication over the data connection' },
      { ul: ['File type: ASCII, EBCDIC or image (binary).', 'Data structure: file, record or page.', 'Transmission mode: **stream** (default), **block**, or **compressed**.'] },
      { h: 'Need for FTP / FTP vs HTTP' },
      'FTP handles different file formats, directory operations and authentication over a stateful session. HTTP uses one stateless connection and carries the data in the response; FTP separates control and data.',
      { h: 'Anonymous FTP risks' },
      'No user identity, plain-text transfer, writable directories can be abused to store illegal content, and it can be used for reconnaissance; SFTP/FTPS add encryption.',
    ],
    sources: [`${N3} p86–87`, `${F} ch. 26 (FTP)`],
  },

  'cn-ipv6-why': {
    blocks: [
      { ol: ['**Address exhaustion**: IPv4 has only 2³² addresses; IPv6 has 2¹²⁸ — enough for every device without NAT.', '**Better header format**: fixed 40-byte base header, options moved to extension headers → faster router processing.', '**No checksum and no fragmentation at routers** → less work per hop.', '**Auto-configuration** of addresses (SLAAC).', '**Flow label** for real-time traffic / QoS.', '**Built-in security** (IPsec) and easier multicast.'] },
      'Scalability: hierarchical 128-bit addresses allow aggregation of routes, keeping routing tables manageable as the Internet grows.',
      { h: 'Transition' },
      'Dual stack, tunnelling (IPv6 inside IPv4) and header translation let both versions coexist during the migration.',
      { img: 'cn-p21' },
    ],
    sources: [`${N3} p31–34`, `${T} §5.6.3`],
  },

  'cn-primitives': {
    blocks: [
      { table: { head: ['Primitive', 'Packet sent', 'Meaning'], rows: [['LISTEN', '(none)', 'Server blocks until a client tries to connect'], ['CONNECT', 'CONNECTION REQ.', 'Client actively attempts to establish a connection'], ['SEND', 'DATA', 'Send information'], ['RECEIVE', '(none)', 'Block until a DATA packet arrives'], ['DISCONNECT', 'DISCONNECTION REQ.', 'This side wants to release the connection']] } },
      'Flow: server LISTENs; client CONNECTs (connection request → accepted); both SEND and RECEIVE; one side DISCONNECTs (asymmetric) or both do (symmetric). The Berkeley socket primitives SOCKET, BIND, LISTEN, ACCEPT, CONNECT, SEND, RECEIVE, CLOSE are the real-world version.',
    ],
    sources: [`${N3} p52–54`, `${T} §6.1.2–6.1.3`],
  },

  'cn-num-cidr28': {
    blocks: [
      { ul: ['/28 → mask 255.255.255.240 (last byte 11110000).', 'Last byte of the address: 39 = 0010 0111.'] },
      { table: { head: ['', 'Last byte (binary)', 'Address'], rows: [['Given', '0010 0111', '205.16.37.39'], ['AND mask → first', '0010 0000', '**205.16.37.32**'], ['OR ¬mask → last', '0010 1111', '**205.16.37.47**']] } },
      '**Number of addresses** = 2^(32 − 28) = 2⁴ = **16**.',
    ],
    sources: ["CN Nov '25 paper Q10(a)", `${F} ch. 18`, 'Verified with the CIDR calculator'],
  },

  'cn-num-same-net': {
    blocks: [
      { ul: ['C1: 203.197.2.53 AND 255.255.128.0 → third byte 2 AND 128 = 0 → network **203.197.0.0/17**.', 'C2: 203.197.75.201 AND 255.255.192.0 → third byte 75 AND 192 = 64 → network **203.197.64.0/18**.'] },
      'The network addresses differ, so **C1 and C2 are not on the same network**.',
      'Note: using C1\'s mask, C2 (75 AND 128 = 0) looks local to C1; using C2\'s mask, C1 (2 AND 192 = 0 ≠ 64) is not local to C2. The masks are inconsistent, which would break direct communication.',
    ],
    sources: ["CN Dec '22–Jan '23 (IT) paper", 'Verified with the CIDR calculator'],
  },

  'cn-num-classes': {
    blocks: [{ table: { head: ['Address', 'First byte', 'Class'], rows: [['208.34.54.12', '208 (192–223)', '**C**'], ['238.34.2.1', '238 (224–239)', '**D** (multicast)'], ['114.34.2.8', '114 (0–127)', '**A**'], ['129.14.6.8', '129 (128–191)', '**B**']] } }],
    sources: ["CN Jun '24 paper (compiled bank)"],
  },

  'cn-num-binary': {
    blocks: [{ ul: ['10000001 00001011 00001011 11101111 → 128+1 . 8+2+1 . 11 . 128+64+32+8+4+2+1 = **129.11.11.239**', '11000001 10000011 00011011 11111111 → **193.131.27.255**'] }],
    sources: ["CN Dec '23 (IT) paper"],
  },

  'cn-num-fragments': {
    blocks: [
      { ul: ['Data in the datagram = 1000 − 20 = 980 bytes.', 'Each fragment has its own 20-byte header, so it can carry at most 100 − 20 = 80 bytes; 80 is a multiple of 8, so that\'s allowed.', '980 ÷ 80 = 12.25 → **13 fragments**: 12 of 80 bytes and the last of 20 bytes.', 'Offsets: 0, 10, 20, …, 120 (in 8-byte units); MF = 1 for all except the last.'] },
    ],
    sources: ["CN Dec '23 (IT) paper", `${F} ch. 19 (fragmentation)`],
  },

  'cn-num-token': {
    blocks: [
      { ul: ['Token rate = 1 token / 5 µs = 1 / (5 × 10⁻⁶) = **200,000 tokens/s**.', 'Each token sends one 48-byte packet → 200,000 × 48 = **9,600,000 bytes/s**.', '= 9.6 MB/s × 8 = **76.8 Mbps** maximum sustainable data rate.'] },
    ],
    sources: ["CN Jun '23 paper (compiled bank)", `${T} §5.4.2`],
  },

  'cn-num-leaky': {
    blocks: [
      { ul: ['Input: 100 gal/min for 12 s = 100 × 12/60 = **20 gallons** in.', 'Output: constant 5 gal/min = 1 gallon per 12 s.', 'After 12 s: 20 − 1 = **19 gallons** in the bucket.', 'Next 48 s: no input, 5 × 48/60 = 4 gallons leak out → **15 gallons** left at 60 s.', 'Total output in the minute = 5 gallons, at a steady rate.'] },
      'The bursty input (100 gal/min) became a smooth 5 gal/min output. That is exactly what a leaky bucket does for traffic: bursts are absorbed (or dropped if the bucket overflows) and leave at a constant rate.',
    ],
    sources: ["CN Jun '24 paper (compiled bank)", `${F} ch. 30 (traffic shaping)`],
  },

  'cn-num-aimd': {
    blocks: [
      { table: { head: ['Transmission', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], rows: [['cwnd (MSS)', '2', '4', '8', '9', '10 ✗', '2', '4', '5', '6', '7'], ['ssthresh', '8', '8', '8', '8', '8', '5', '5', '5', '5', '5']] } },
      { ul: ['1–3: slow start doubles 2 → 4 → 8 (threshold reached).', '4–5: congestion avoidance, +1: 9, 10. Timeout at the 5th.', 'New ssthresh = 10 / 2 = 5; window restarts at the initial 2 MSS.', '6–8: slow start 2 → 4 → 5 (capped at threshold). 9–10: +1 → 6, 7.'] },
      'Window at the end of the 10th transmission = **7 MSS** (6 MSS if your convention restarts from 1 MSS).',
    ],
    sources: ["CN Dec '22–Jan '23 (IT) paper", 'Verified with the cwnd simulator'],
  },
}
