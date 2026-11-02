// CN Unit IV model answers (transport layer). Keyed by PYQ id.
const N3 = 'CN Notes3.pdf'
const T = 'Tanenbaum, Computer Networks'
const F = 'Forouzan, Data Communications and Networking'

const UDP_SERVER = `# UDP server (Python)
from socket import *
s = socket(AF_INET, SOCK_DGRAM)       # 1. create a datagram socket
s.bind(('', 9000))                    # 2. bind to a well-known port
while True:
    msg, addr = s.recvfrom(2048)      # 3. wait for a datagram (any client)
    s.sendto(msg.upper(), addr)       # 4. reply to that client's address

# UDP client
c = socket(AF_INET, SOCK_DGRAM)
c.sendto(b'hello', ('server-ip', 9000))  # no connect: address given every time
reply, _ = c.recvfrom(2048)
c.close()`

const TCP_SERVER = `# TCP server (Python)
from socket import *
s = socket(AF_INET, SOCK_STREAM)      # 1. SOCKET
s.bind(('', 9000))                    # 2. BIND to a port
s.listen(5)                           # 3. LISTEN: queue up to 5 requests
while True:
    conn, addr = s.accept()           # 4. ACCEPT: block until a client connects
    data = conn.recv(1024)            # 5. RECEIVE
    conn.send(data.upper())           # 6. SEND
    conn.close()                      # 7. CLOSE this connection

# TCP client
c = socket(AF_INET, SOCK_STREAM)
c.connect(('server-ip', 9000))        # CONNECT: three-way handshake happens here
c.send(b'hello'); print(c.recv(1024))
c.close()                             # FIN exchange`

export default {
  // ---------------- Transport service & elements ----------------
  'cn-elements': {
    blocks: [
      'The **transport protocol** runs between two transport entities over the network layer. Its job resembles a data-link protocol, but the "link" is a whole network, which may lose, delay, duplicate and reorder packets. **Two essential elements**: **addressing** (which process to deliver to) and **connection establishment/release** (reliably agreeing to start and stop). The full set of elements:',
      { h: '1. Addressing' },
      'Processes are identified by **TSAPs** (transport service access points), i.e. **port numbers**; the network address (NSAP) identifies the host. Servers listen on well-known ports; otherwise a **portmapper/directory** or an **initial connection protocol** (a process server that spawns the requested service) is used.',
      { h: '2. Connection establishment' },
      'Hard because the network can store and deliver **delayed duplicate** packets. Solutions: limit packet lifetime, use sequence numbers chosen from a clock so old numbers cannot be reused for a while, and the **three-way handshake** so each side confirms the other\'s initial sequence number.',
      { img: 'cn-p59' },
      { h: '3. Connection release' },
      '**Asymmetric** release (one side hangs up: may lose data) vs **symmetric** release (each direction closed separately). The **two-army problem** shows no protocol can guarantee agreement over an unreliable network; in practice a three-way release plus timers is used.',
      { h: '4. Error control and flow control' },
      'Error control: checksums, sequence numbers, acknowledgements and retransmission (as in sliding-window protocols). Flow control: a **sliding window / credit** so a fast sender does not swamp a slow receiver; the receiver advertises how much buffer space it has (dynamic buffer allocation).',
      { h: '5. Multiplexing' },
      'Several transport connections share one network address (**multiplexing**), or one connection uses several network paths (**inverse multiplexing**).',
      { img: 'cn-p61' },
      { h: '6. Crash recovery' },
      'If hosts or routers crash, connections must recover: the transport layer can survive router crashes by retransmitting, but recovery from host crashes needs help from the application layer.',
    ],
    sources: [`${N3} p55–62`, `${T} §6.2`],
  },

  'cn-transport-functions': {
    blocks: [
      'The **transport layer** (layer 4) provides **process-to-process (end-to-end) delivery** of messages: it is the heart of the protocol hierarchy, shielding applications from the details and imperfections of the network.',
      { h: 'Functions' },
      { ol: [
        '**Process-to-process delivery**: delivers data to the right application process, not just to the host.',
        '**Port addressing**: identifies processes using port numbers (socket = IP + port).',
        '**Multiplexing and demultiplexing**: many applications share one network connection; incoming segments are delivered to the correct socket.',
        '**Segmentation and reassembly**: splits application messages into segments with sequence numbers and reassembles them in order.',
        '**Connection control**: connection-oriented (TCP: establish, transfer, release) or connectionless (UDP) service.',
        '**Reliability / error control**: checksums, acknowledgements, retransmission of lost or corrupted segments, discarding duplicates (end-to-end, not hop-by-hop).',
        '**Flow control**: end-to-end, so a fast sender does not overwhelm a slow receiver (sliding window).',
        '**Congestion control**: reduces the sending rate when the network is congested.',
        '**Quality of service**: improves on the network layer\'s service (e.g. reliability over an unreliable network).',
      ] },
      { h: 'Purpose' },
      'The network layer is run by carriers and may be unreliable; users have no control over it. The transport layer, running entirely on end hosts, lets applications get **reliable, efficient, cost-effective** service regardless of the underlying network, and gives programmers a standard interface (sockets).',
      { img: 'cn-p39' },
    ],
    sources: [`${N3} p50–55`, `${T} §6.1`, `${F} ch. 23`],
  },

  'cn-transport-service': {
    blocks: [
      { h: 'Process-to-process communication' },
      'The data-link layer delivers **node to node**; the network layer delivers **host to host**; but real communication is between **processes** (application programs) running on the hosts. The transport layer delivers a message from a process on one host to a process on another: **process-to-process delivery**. It uses the **client–server** paradigm and identifies processes by **port numbers**: a **socket address** = IP address + port number identifies a process uniquely on the Internet.',
      { img: 'cn-p70' },
      'Example: a browser (client, ephemeral port 52000) on 10.0.0.5 talks to a web server process (port 80) on 93.184.216.34: the connection is identified by (10.0.0.5:52000, 93.184.216.34:80).',
      { h: 'Design issues of the transport layer' },
      { ul: [
        '**Services to the upper layer**: connection-oriented (reliable byte stream) or connectionless (datagrams); service primitives.',
        '**Addressing**: ports/TSAPs, well-known vs ephemeral ports, finding the server\'s port.',
        '**Connection establishment** with delayed duplicates (three-way handshake, sequence numbers).',
        '**Connection release** (symmetric/asymmetric, two-army problem).',
        '**Error control** and **flow control** end-to-end; buffering.',
        '**Multiplexing/demultiplexing**.',
        '**Congestion control**.',
        '**Crash recovery**.',
        '**Quality of service**: delay, throughput, error rate the user can ask for.',
      ] },
    ],
    sources: [`${N3} p50–55`, `${F} ch. 23`, `${T} §6.1–6.2`],
  },

  'cn-mux': {
    blocks: [
      'At a host, many application processes need the transport layer at the same time, but there is usually only **one IP address** (one network-layer path).',
      { h: 'Multiplexing (at the sender)' },
      'The transport layer **gathers data from several sockets/processes**, adds a header with **source and destination port numbers** to each segment, and passes all segments to the single network layer. Many-to-one.',
      { h: 'Demultiplexing (at the receiver)' },
      'The transport layer receives segments from the network layer, **examines the destination port** (and, for TCP, also the source IP/port) and delivers each segment to the **correct socket/process**. One-to-many.',
      { ul: ['**UDP (connectionless) demultiplexing**: a socket is identified by (destination IP, destination port); datagrams from different sources to the same port go to the same socket.', '**TCP (connection-oriented) demultiplexing**: a socket is identified by the 4-tuple (source IP, source port, destination IP, destination port); a web server has a separate socket for every client connection on port 80.'] },
      { img: 'cn-p61' },
      { h: 'Upward and downward multiplexing (Tanenbaum)' },
      { ul: ['**Multiplexing (upward)**: several transport connections share one network connection/address, to save cost.', '**Inverse multiplexing (downward)**: one transport connection is spread over several network paths to get more bandwidth (e.g. a host with links to two ISPs).'] },
      'Example: a PC simultaneously runs a browser (port 52001 → 443), an e-mail client (52002 → 993) and a DNS lookup (UDP 53001 → 53). All share the IP address 10.0.0.5; ports keep the conversations apart.',
    ],
    sources: [`${N3} p60–61, p68–69`, `${T} §6.2.4`, `${F} ch. 23`],
  },

  'cn-ports': {
    blocks: [
      { h: 'Do port addresses need to be unique?' },
      '**Only within a host (and per transport protocol), not globally.** A port number identifies a process **on one host**, so two processes on the same host cannot use the same port for the same protocol at the same time. But the same port number is used on millions of hosts (every web server uses port 80). Global uniqueness comes from the **socket address = IP address + port**: the IP part is unique on the Internet, and the port is unique within that host. TCP port 53 and UDP port 53 are also different.',
      { ul: ['**Well-known ports** (0–1023): assigned by IANA to standard servers (HTTP 80, SMTP 25, DNS 53, FTP 21).', '**Registered ports** (1024–49151).', '**Dynamic / ephemeral ports** (49152–65535): chosen temporarily by clients.'] },
      { h: 'Why are port addresses shorter than IP addresses?' },
      { ul: ['An IP address (32 bits) must distinguish **billions of hosts** worldwide; a port number (16 bits) only distinguishes **processes on a single host**, and 65,536 simultaneous communicating processes per host is plenty.', 'Every segment carries both ports; keeping them 16 bits keeps the header small (UDP header is only 8 bytes).', 'Ports have only local significance, so they need not encode network/hierarchy information.'] },
    ],
    sources: [`${F} ch. 23 (port numbers)`, `${N3} p70`],
  },

  'cn-primitives': {
    blocks: [
      'The **transport service primitives** are the operations the application (transport user) can call to use the transport service. Tanenbaum\'s simple set for a connection-oriented service:',
      { table: { head: ['Primitive', 'Packet (TPDU) sent', 'Meaning'], rows: [
        ['**LISTEN**', '(none)', 'Server blocks until some process tries to connect'],
        ['**CONNECT**', 'CONNECTION REQUEST', 'Client actively attempts to establish a connection'],
        ['**SEND**', 'DATA', 'Send information'],
        ['**RECEIVE**', '(none)', 'Block until a DATA packet arrives'],
        ['**DISCONNECT**', 'DISCONNECTION REQUEST', 'This side wants to release the connection'],
      ] } },
      { h: 'How they are used' },
      { steps: ['The **server** executes LISTEN and blocks.', 'The **client** executes CONNECT: a CONNECTION REQUEST segment is sent; the client blocks.', 'The server\'s transport entity unblocks the server and sends back a CONNECTION ACCEPTED segment; the client is unblocked. The connection is established.', 'Data is exchanged with SEND and RECEIVE; every DATA segment is acknowledged by the transport entities (hidden from the users).', 'Either side executes DISCONNECT: a DISCONNECTION REQUEST is sent. In **asymmetric** release the connection is released at once; in **symmetric** release each direction is closed separately and the connection ends when both sides have disconnected.'] },
      'Segments are nested: segment (TPDU) inside a packet inside a frame. A state diagram describes connection establishment and release using these primitives.',
      { h: 'Berkeley socket primitives (real-world version)' },
      { table: { head: ['Primitive', 'Meaning'], rows: [['SOCKET', 'Create a new communication endpoint'], ['BIND', 'Associate a local address (port) with a socket'], ['LISTEN', 'Announce willingness to accept connections; give queue size'], ['ACCEPT', 'Passively accept an incoming connection'], ['CONNECT', 'Actively attempt to establish a connection'], ['SEND', 'Send data over the connection'], ['RECEIVE', 'Receive data from the connection'], ['CLOSE', 'Release the connection']] } },
    ],
    sources: [`${N3} p52–54`, `${T} §6.1.2–6.1.3`],
  },

  'cn-three-events': {
    blocks: [
      'A connection-oriented transport protocol involves three phases (events):',
      { ol: ['**Connection establishment**: the two transport entities agree to communicate and synchronise parameters (TCP three-way handshake: SYN, SYN+ACK, ACK).', '**Data transfer**: data is exchanged in both directions with sequencing, acknowledgements, flow and error control.', '**Connection termination (release)**: both sides agree to close and free resources (TCP FIN/ACK exchange).'] },
    ],
    sources: [`${F} ch. 23`, `${T} §6.2`],
  },

  'cn-crash': {
    blocks: [
      'Hosts and routers can crash, and connections should ideally survive.',
      { h: 'Router (network) crashes' },
      'If the network layer provides datagram service, a router crash just loses some packets: the **transport layer recovers by retransmission** (the segments are still buffered at the sender). This case is easy.',
      { h: 'Host (server) crashes: the hard case' },
      'Example (Tanenbaum): a client sends a long file to a file server using a simple stop-and-wait protocol. The server crashes half-way and reboots, losing its tables. It broadcasts a "I have just crashed, please tell me the status of your connections" message. Each client is in one of two states: **S1** (one segment outstanding) or **S0** (no segment outstanding), and decides whether to retransmit using one of four strategies: always retransmit, never retransmit, retransmit only in S0, retransmit only in S1.',
      'The server, on receiving a segment, does two things: **send an acknowledgement (A)** and **write to the output process (W)**, in some order, and the crash (C) may happen between or after them. Orders: AC(W), AWC, C(AW) for "ack first" and C(WA), WAC, WC(A) for "write first".',
      { table: { head: ['Client strategy', 'AC(W)', 'AWC', 'C(AW)', 'C(WA)', 'WAC', 'WC(A)'], rows: [['Always retransmit', 'OK', 'DUP', 'OK', 'OK', 'DUP', 'DUP'], ['Never retransmit', 'LOST', 'OK', 'LOST', 'LOST', 'OK', 'OK'], ['Retransmit in S0', 'OK', 'DUP', 'LOST', 'LOST', 'DUP', 'OK'], ['Retransmit in S1', 'LOST', 'OK', 'OK', 'OK', 'OK', 'DUP']] } },
      '**Every combination fails in some case** (a lost or duplicated segment). No matter how the client and server are programmed, there are situations where the protocol fails to recover properly.',
      { h: 'Conclusion' },
      '"Recovery from a layer N crash can only be done by layer N + 1, and only if the higher layer retains enough status information." The transport layer can recover from network-layer failures, but recovery from a crash of the transport entity itself needs the **application layer** (e.g. transactions with commit/rollback, idempotent requests, application-level checkpoints).',
    ],
    sources: [`${N3} p62`, `${T} §6.2.6`],
  },

  'cn-qos-primitives': {
    blocks: [
      'The transport layer can enhance the QoS of the network. When a connection is requested, the user can specify desired, acceptable and minimum values for **QoS parameters**; the transport entity negotiates them with the remote side (option negotiation). Typical parameters (Tanenbaum):',
      { table: { head: ['Parameter', 'Meaning'], rows: [
        ['**Connection establishment delay**', 'Time between a connection request and its confirmation'],
        ['**Connection establishment failure probability**', 'Chance a connection is not established within the maximum delay (network congestion, lack of table space)'],
        ['**Throughput**', 'Number of bytes of user data transferred per second, measured over some interval (per direction)'],
        ['**Transit delay**', 'Time between a message being sent by the source user and received by the destination user'],
        ['**Residual error ratio**', 'Fraction of lost or garbled messages (ideally 0)'],
        ['**Protection**', 'Ability to prevent unauthorised third parties from reading or modifying data'],
        ['**Priority**', 'Lets a user show some connections are more important; in congestion, high-priority ones are served first'],
        ['**Resilience**', 'Probability the transport layer itself spontaneously terminates a connection (internal problems or congestion)'],
        ['**Connection release delay / failure probability**', 'Time and likelihood of a successful orderly release'],
      ] } },
      'In the **CONNECT** primitive the user passes these QoS requirements; the transport entity may accept, lower them, or reject the connection if it cannot meet the minimum.',
    ],
    sources: [`${T} §6.1 (quality of service)`, `${N3} p50–52`],
  },

  // ---------------- Sockets ----------------
  'cn-sockets': {
    blocks: [
      '**Berkeley sockets** are the transport-layer API introduced in **Berkeley UNIX 4.2BSD (1983)** and now used on almost every OS (POSIX, Winsock, Python, Java). A **socket** is an endpoint for communication, identified by an IP address and a port; the application reads and writes it much like a file.',
      { h: 'The socket API (primitives)' },
      { table: { head: ['Primitive', 'Meaning'], rows: [['**SOCKET**', 'Create a new communication endpoint (returns a descriptor); type = SOCK_STREAM (TCP) or SOCK_DGRAM (UDP)'], ['**BIND**', 'Associate a local address (IP + port) with the socket'], ['**LISTEN**', 'Announce willingness to accept connections; set the queue size'], ['**ACCEPT**', 'Passively accept an incoming connection (blocks); returns a new socket for that client'], ['**CONNECT**', 'Actively attempt to establish a connection'], ['**SEND**', 'Send some data over the connection'], ['**RECEIVE**', 'Receive some data from the connection'], ['**CLOSE**', 'Release the connection']] } },
      { h: 'Typical TCP sequence' },
      'Server: SOCKET → BIND → LISTEN → ACCEPT (blocks) → RECEIVE/SEND → CLOSE. Client: SOCKET → CONNECT (three-way handshake) → SEND/RECEIVE → CLOSE. Release is **symmetric**: the connection is released when both sides have executed CLOSE.',
      { h: 'TCP sockets vs UDP sockets' },
      { table: { head: ['', 'TCP socket (SOCK_STREAM)', 'UDP socket (SOCK_DGRAM)'], rows: [
        ['Connection', 'Connection-oriented: LISTEN, ACCEPT, CONNECT needed', 'Connectionless: no listen/accept/connect required'],
        ['Data', 'Reliable, ordered **byte stream**', 'Independent **datagrams**, boundaries kept'],
        ['Send/receive calls', 'send()/recv() on the connected socket', 'sendto()/recvfrom() with the address each time'],
        ['Server sockets', 'One listening socket + one new socket per client (ACCEPT)', 'One socket serves all clients'],
        ['Reliability', 'Lost data retransmitted by TCP', 'Application must handle loss'],
        ['Use', 'Web, e-mail, file transfer', 'DNS, streaming, games'],
      ] } },
    ],
    sources: [`${N3} p53–54`, `${T} §6.1.3–6.1.4`],
  },

  'cn-udp-socket': {
    blocks: [
      'With **UDP** there is **no connection**: no LISTEN, ACCEPT or CONNECT, and no handshake. The client attaches the server\'s address to **every datagram**, and the server uses the sender\'s address from each received datagram to reply.',
      { h: 'Steps' },
      { compare: [
        { title: 'Server', items: ['socket(AF_INET, SOCK_DGRAM)', 'bind() to a well-known port', 'loop: recvfrom() → blocks until any datagram arrives; returns data + client address', 'process the request', 'sendto() the reply to that client address'] },
        { title: 'Client', items: ['socket(AF_INET, SOCK_DGRAM)', '(no bind needed: OS picks an ephemeral port)', 'sendto() request with server IP + port', 'recvfrom() the reply', 'close()'] },
      ] },
      { code: '   CLIENT                         SERVER\n  socket()                        socket()\n     |                            bind(port 9000)\n     |                               |\n  sendto(data, server) ------->  recvfrom()  (blocks)\n     |                               |  process\n  recvfrom() <-----------------  sendto(reply, client)\n     |                               |\n  close()                        (loop for next client)' },
      { code: UDP_SERVER },
      'One server socket serves all clients; each datagram is independent, so if one is lost the application must time out and resend.',
    ],
    sources: [`${N3} p53–54`, `${T} §6.1.4`],
  },

  'cn-tcp-socket': {
    blocks: [
      'With **TCP**, the client and server must first establish a **connection** (three-way handshake); then they exchange a reliable byte stream.',
      { h: 'Steps' },
      { compare: [
        { title: 'Server', items: ['**SOCKET**: create a stream socket', '**BIND**: attach it to a well-known port', '**LISTEN**: make it a listening socket with a queue', '**ACCEPT**: block until a client connects; returns a **new connected socket** for that client (the listening socket stays open)', '**RECEIVE / SEND** on the connected socket', '**CLOSE** the connected socket'] },
        { title: 'Client', items: ['**SOCKET**', '**CONNECT** to server IP + port: TCP performs the three-way handshake', '**SEND / RECEIVE**', '**CLOSE**: TCP sends FIN'] },
      ] },
      { code: '  CLIENT                              SERVER\n socket()                            socket()\n    |                                bind(80)\n    |                                listen()\n    |                                accept()   (blocks)\n connect() ---- SYN / SYN+ACK / ACK ---->|  (returns new socket)\n send() -------- request ------------> recv()\n recv() <------- reply --------------- send()\n close() -------- FIN / ACK ---------> close()' },
      { code: TCP_SERVER },
      'A concurrent server usually forks a process or starts a thread for each accepted connection, so many clients are served at the same time.',
    ],
    sources: [`${N3} p53–54`, `${T} §6.1.4 (example socket server)`],
  },

  // ---------------- UDP ----------------
  'cn-udp-header': {
    blocks: [
      '**UDP (User Datagram Protocol)** is the Internet\'s **connectionless, unreliable** transport protocol. It adds only process-to-process addressing and an optional checksum to IP. Its header is a fixed **8 bytes**:',
      { img: 'cn-udp' },
      { table: { head: ['Field', 'Bits', 'Meaning'], rows: [
        ['Source port', '16', 'Port of the sending process (optional; 0 if no reply is needed)'],
        ['Destination port', '16', 'Port of the receiving process: used to demultiplex'],
        ['Length', '16', 'Total length of the user datagram, header + data (minimum 8)'],
        ['Checksum', '16', 'Covers a **pseudo-header** (source IP, destination IP, protocol 17, UDP length), the UDP header and the data. Optional in IPv4 (0 = not computed), mandatory in IPv6'],
      ] } },
      { h: 'Characteristics of UDP' },
      { ul: ['**Connectionless**: no handshake; each datagram is independent and may take a different route.', '**Unreliable**: no acknowledgements, no retransmission; datagrams may be lost, duplicated or arrive out of order.', '**No flow control and no congestion control**: sends as fast as the application wants.', '**Message-oriented**: preserves message boundaries (one send = one datagram).', '**Small overhead**: 8-byte header, no connection state → fast and simple.', '**Error checking** only: corrupted datagrams are discarded silently.', 'Supports **broadcast and multicast**.'] },
      { h: 'Uses' },
      'DNS, DHCP, SNMP, TFTP, RTP for voice/video, online games, RPC: small request–response exchanges and real-time traffic where speed matters more than perfect reliability.',
    ],
    sources: [`${N3} p65–67`, `${T} §6.4.1`, `${F} ch. 24 (UDP)`],
  },

  'cn-udp-adds': {
    blocks: [
      { h: 'What UDP provides that IP does not' },
      { ul: ['**Process-to-process delivery**: IP delivers to a **host**; UDP adds **port numbers** so the datagram reaches the right **process** (multiplexing/demultiplexing).', '**End-to-end error detection on the data**: the IP checksum covers only the IP header; the UDP checksum covers the UDP header, **the data**, and a pseudo-header (so misdelivered datagrams are also caught).', 'An interface for applications (sockets) to send datagrams directly.'] },
      'It does **not** add reliability, ordering, flow control or congestion control.',
      { h: 'Are UDP and IP unreliable to the same degree?' },
      '**No, UDP is slightly more reliable than IP**, although both are "unreliable" (best-effort, no acknowledgement or retransmission):',
      { ul: ['IP checks only its header; a datagram with **corrupted data** is delivered to the host. UDP\'s checksum covers the data, so corrupted user datagrams are **detected and discarded** rather than passed to the application.', 'The pseudo-header in the UDP checksum detects datagrams delivered to the **wrong host or protocol**.', 'Both can still **lose, duplicate or reorder** packets: UDP does nothing about these.', 'In IPv4 the UDP checksum is optional; if the sender sets it to 0, UDP is as unreliable as IP for data errors.'] },
    ],
    sources: [`${F} ch. 24 (UDP)`, `${T} §6.4.1`],
  },

  'cn-udp-size': {
    blocks: [
      'The UDP **length field is 16 bits**, so a user datagram (header + data) can be at most 65,535 bytes; the UDP header is 8 bytes. But a UDP datagram must also fit in one IP datagram, whose total length is also limited to 65,535 bytes including an IP header of at least 20 bytes.',
      { formula: 'Maximum data = 65,535 − 20 (IP header) − 8 (UDP header) = 65,507 bytes' },
      '(Without counting the IP header: 65,535 − 8 = 65,527 bytes.)',
      { formula: 'Minimum data = 0 bytes (a datagram of just the 8-byte header is legal)' },
      'In practice applications keep UDP data below the path MTU (about 1,472 bytes on Ethernet) to avoid IP fragmentation; DNS traditionally limits responses to 512 bytes.',
    ],
    sources: [`${F} ch. 24 (UDP)`, `${T} §6.4.1`],
  },

  'cn-msg-vs-byte': {
    blocks: [
      { compare: [
        { title: 'UDP: message-oriented', items: ['Each send() produces **one datagram**; each recvfrom() returns exactly one whole datagram', 'Message boundaries are **preserved**', 'No reassembly or merging'] },
        { title: 'TCP: byte-stream oriented', items: ['Data is treated as a **continuous stream of bytes**', 'TCP may split one write into several segments or combine several writes into one segment', 'The receiver may read 3 writes in one recv() or 1 write in 3 recv() calls: boundaries are **not** preserved'] },
      ] },
      { h: 'Which to use if message boundaries must be protected?' },
      '**UDP** preserves boundaries naturally, so an application that must protect message boundaries can use UDP, as long as it can tolerate (or handle itself) loss, duplication and reordering, and messages fit in one datagram.',
      'If the application **also needs reliability**, it should use **TCP and mark boundaries itself**: put a length prefix before each message, or use a delimiter (e.g. HTTP headers end with a blank line, SMTP ends data with "."), and read until a full message is received.',
      { h: 'Example' },
      'A sensor sending fixed 50-byte readings uses UDP: each reading arrives as one datagram. A chat app that needs every message delivered uses TCP with a 4-byte length field before each message.',
    ],
    sources: [`${F} ch. 24`, `${T} §6.4–6.5`],
  },

  'cn-rpc': {
    blocks: [
      '**RPC (Remote Procedure Call)** lets a client call a procedure on a server as if it were local: the client stub packs the parameters into a request message, the server stub unpacks them, runs the procedure and returns a reply. RPC is the classic request–reply application of **UDP**.',
      { h: 'Prefer RPC over UDP when' },
      { ul: ['Requests and replies are **short** (fit in one datagram).', 'The operations are **idempotent** (safe to repeat, e.g. "read block 5", "get balance"), so a simple timeout-and-retransmit is acceptable.', '**Low latency** matters: no connection setup (TCP needs a handshake before data and a release after).', 'The server serves **many clients** and should not keep per-connection state.', 'Communication is on a reliable LAN. Example: NFS (originally), DNS-like lookups.'] },
      { h: 'Prefer RPC over TCP when' },
      { ul: ['Parameters or results are **large** (bigger than a datagram; TCP handles segmentation and reassembly).', 'Operations are **not idempotent** (e.g. "transfer ₹1,000", "append to file"): the application needs at-most-once semantics without implementing its own duplicate detection.', 'The network is **lossy or long-distance** (WAN): TCP\'s retransmission, ordering and congestion control are valuable.', 'The client makes **many calls** to the same server, so the connection setup cost is amortised (persistent connection). Example: gRPC over HTTP/2.'] },
    ],
    sources: [`${T} §6.4.2 (RPC)`, `${N3} p66–67`],
  },

  // ---------------- TCP vs UDP ----------------
  'cn-tcp-vs-udp': {
    blocks: [
      { table: { head: ['Feature', 'TCP', 'UDP'], rows: [
        ['Full form', 'Transmission Control Protocol', 'User Datagram Protocol'],
        ['Connection', 'Connection-oriented (three-way handshake, release)', 'Connectionless'],
        ['Reliability', 'Reliable: ACKs, retransmission, checksum', 'Unreliable: checksum only, no ACKs'],
        ['Ordering', 'In-order delivery (sequence numbers)', 'No ordering'],
        ['Data unit', 'Segment; **byte stream**', 'User datagram; **message** boundaries kept'],
        ['Flow control', 'Yes (sliding window)', 'No'],
        ['Congestion control', 'Yes (slow start, AIMD)', 'No'],
        ['Header size', '20–60 bytes', '8 bytes'],
        ['Speed / overhead', 'Slower, more overhead', 'Faster, minimal overhead'],
        ['Communication', 'Unicast, full-duplex point-to-point', 'Unicast, multicast, broadcast'],
        ['State at hosts', 'Connection state (buffers, timers)', 'None'],
        ['Applications', 'HTTP, HTTPS, FTP, SMTP, POP3, IMAP, SSH, TELNET', 'DNS, DHCP, SNMP, TFTP, VoIP, video streaming, online games, RPC'],
      ] } },
      { h: 'When to use which' },
      'Use **TCP** when every byte must arrive correctly and in order (file transfer, web pages, e-mail). Use **UDP** when speed and low delay matter more than perfect delivery, or for short request–reply exchanges (DNS queries, live video, games).',
      { img: 'cn-udp' },
      { img: 'cn-tcp-header' },
    ],
    sources: [`${N3} p65–73`, `${T} §6.4–6.5`],
  },

  'cn-conn-vs-connless': {
    blocks: [
      { table: { head: ['Basis', 'Connection-oriented', 'Connectionless'], rows: [
        ['Setup', 'Connection established before data, released after', 'No setup; send immediately'],
        ['Packets', 'Belong to a connection; sequence-numbered', 'Independent datagrams'],
        ['Reliability', 'Acknowledged, retransmitted, ordered', 'No guarantees'],
        ['State', 'Both ends keep connection state', 'No state'],
        ['Overhead', 'Higher (handshake, ACKs, bigger header)', 'Lower'],
        ['Delay', 'Setup delay (≥ 1 RTT) before data', 'None'],
        ['Example', 'TCP; telephone call', 'UDP, IP; postal letters'],
      ] } },
      { h: 'Which is more efficient?' },
      'It depends on what "efficient" means:',
      { ul: ['For **short exchanges** (one request, one reply, e.g. DNS) **connectionless is more efficient**: no handshake round trips, no teardown, an 8-byte header, no state at the server.', 'For **long transfers that need reliability**, connection-oriented is more efficient overall: the setup cost is spread over many segments, and TCP\'s flow and congestion control use the network well and avoid wasteful retransmissions; an application doing reliability itself over UDP would reinvent TCP.'] },
      'So: connectionless is more efficient in overhead and latency; connection-oriented is more efficient in reliable delivery of large data.',
    ],
    sources: [`${T} §6.1, §6.4`, `${F} ch. 23`],
  },

  'cn-tcp-udp-header': {
    blocks: [
      { img: 'cn-udp' },
      { img: 'cn-tcp-header' },
      { table: { head: ['Field', 'TCP', 'UDP'], rows: [['Source port, destination port', '16 + 16 bits', '16 + 16 bits'], ['Checksum (with pseudo-header)', 'Mandatory', 'Optional in IPv4'], ['Length', 'Not present (computed from IP length − header length)', 'Present (16 bits)'], ['Header size', '20–60 bytes', '8 bytes']] } },
      { h: 'Fields in TCP missing from UDP, and why' },
      { table: { head: ['TCP field', 'Purpose in TCP', 'Why UDP does not need it'], rows: [
        ['Sequence number (32)', 'Numbers bytes for ordering and detecting loss/duplicates', 'UDP does not guarantee order or detect loss'],
        ['Acknowledgement number (32)', 'Confirms received bytes', 'UDP sends no acknowledgements'],
        ['Header length (4)', 'TCP header is variable (options)', 'UDP header is fixed at 8 bytes'],
        ['Flags: URG, ACK, PSH, RST, SYN, FIN (+ ECE, CWR)', 'Connection setup/release, reset, urgent data, push, congestion notification', 'UDP is connectionless: nothing to open, close or reset'],
        ['Window size (16)', 'Flow control: receiver\'s free buffer', 'UDP has no flow control'],
        ['Urgent pointer (16)', 'Marks urgent data in the stream', 'No stream, no urgent data'],
        ['Options', 'MSS, window scale, timestamps, SACK', 'No negotiation needed'],
      ] } },
      'Reason in one line: UDP is a minimal, connectionless, unreliable service, so it carries only what is needed to **deliver to a process and detect errors**; TCP needs the extra fields for **connections, reliability, ordering, flow and congestion control**.',
    ],
    sources: [`${N3} p65–73`, `${T} §6.4.1, §6.5.4`],
  },

  'cn-why-tcp-apps': {
    blocks: [
      'HTTP, FTP, SMTP and POP3 transfer **web pages, files and e-mail messages** that must arrive **complete, error-free and in order**. A single missing or reordered byte would corrupt a file or a mail.',
      { ul: ['TCP provides **reliability** (ACKs, retransmission), **ordering** and **duplicate removal**, so these applications don\'t have to implement it themselves.', 'They transfer **large amounts of data**; TCP handles segmentation, flow control and congestion control.', 'They are **interactive command–response protocols** (USER, PASS, MAIL FROM, RETR) that fit a connection; the delay of the handshake is small compared with the transfer.', 'Byte-stream semantics suit their text-based commands and file contents.'] },
      'UDP would force each application to add its own retransmission and ordering, duplicating TCP.',
    ],
    sources: [`${T} §6.5`, `${F} ch. 24`],
  },

  'cn-fast-transaction': {
    blocks: [
      '**UDP.** For the fastest possible single remote transaction (one request, one reply), UDP avoids:',
      { ul: ['the **three-way handshake** before any data (TCP needs one round-trip time before the request can be sent),', 'the **connection release** exchange afterwards,', 'per-connection state, ACKs and slow start.'] },
      'The request goes in one datagram and the reply comes back in one: **one RTT in total**. If a datagram is lost, the client simply times out and repeats the request (fine for idempotent operations). This is why **DNS** and RPC-style lookups use UDP.',
    ],
    sources: [`${T} §6.4`, `${F} ch. 24`],
  },

  // ---------------- TCP ----------------
  'cn-tcp-header': {
    blocks: [
      'Every TCP segment begins with a **20-byte fixed header**, optionally followed by up to 40 bytes of options (max 60 bytes), then the data.',
      { img: 'cn-tcp-header' },
      { table: { head: ['Field', 'Bits', 'Meaning'], rows: [
        ['Source port', '16', 'Port of the sending process'],
        ['Destination port', '16', 'Port of the receiving process'],
        ['Sequence number', '32', 'Number of the first data byte in this segment (with SYN: the initial sequence number)'],
        ['Acknowledgement number', '32', 'Next byte expected from the other side (valid when ACK = 1): cumulative acknowledgement'],
        ['Header length (data offset)', '4', 'Header size in 32-bit words (5–15 → 20–60 bytes)'],
        ['Reserved', '4', 'For future use'],
        ['Flags', '8', '**CWR, ECE** (explicit congestion notification), **URG** (urgent pointer valid), **ACK** (ack number valid), **PSH** (push data to the application now), **RST** (reset the connection), **SYN** (synchronise: open a connection), **FIN** (finish: close)'],
        ['Window size', '16', 'Number of bytes the receiver is willing to accept, starting at the ack number: flow control'],
        ['Checksum', '16', 'Covers a pseudo-header (IP addresses, protocol, length), the TCP header and the data'],
        ['Urgent pointer', '16', 'Offset from the sequence number to the end of urgent data (when URG = 1)'],
        ['Options', '0–320', 'MSS (maximum segment size), window scale, timestamps, SACK (selective acknowledgement), NOP padding'],
      ] } },
    ],
    sources: [`${N3} p71–73`, `${T} §6.5.4`],
  },

  'cn-tcp-features': {
    blocks: [
      '**TCP (Transmission Control Protocol)** provides a **reliable, connection-oriented, end-to-end byte stream** over the unreliable IP network.',
      { h: 'Features' },
      { ol: [
        '**Connection-oriented**: three-way handshake to open, FIN exchange to close.',
        '**Reliable delivery**: every byte is numbered; the receiver sends cumulative **acknowledgements**; lost or corrupted segments are **retransmitted** after a timeout or three duplicate ACKs.',
        '**In-order delivery** and **duplicate removal** using sequence numbers.',
        '**Byte-stream service**: the application writes and reads bytes; TCP decides segment sizes (MSS).',
        '**Full-duplex**: data flows both ways at once; ACKs piggyback on data.',
        '**Flow control**: the receiver advertises a window so the sender never overflows its buffer.',
        '**Congestion control**: slow start, congestion avoidance, fast retransmit/recovery adapt the rate to the network.',
        '**Error detection**: mandatory checksum with pseudo-header.',
        '**Multiplexing** via ports; **point-to-point** (no multicast or broadcast).',
        '**Timers**: retransmission, persistence, keepalive, TIME-WAIT.',
      ] },
      { h: 'Role in a robust, stable communication framework' },
      { ul: ['**Robustness**: applications get a perfect pipe even though IP may lose, duplicate, delay or reorder packets; adaptive timeouts (RTT estimation) work on both LANs and satellite links.', '**Stability of the Internet**: AIMD congestion control makes all TCP flows back off when routers are overloaded, preventing congestion collapse and sharing bandwidth fairly.', '**Simplicity for developers**: HTTP, FTP, SMTP, SSH etc. build on TCP instead of re-implementing reliability.', '**Safe connection management**: handshakes and sequence numbers protect against delayed duplicates and half-open connections.'] },
      { img: 'tcp-handshake' },
    ],
    sources: [`${N3} p68–74`, `${T} §6.5`],
  },

  'cn-tcp-order': {
    blocks: [
      '**Yes.** IP fragmentation and reassembly is invisible to TCP: if a datagram is fragmented, IP at the destination reassembles **that datagram** before handing it to TCP. But that only fixes the pieces of **one** datagram.',
      { ul: ['Each TCP **segment** travels in a separate IP datagram, and IP is a **datagram (connectionless) service**: different datagrams may take **different routes**, be queued differently, and arrive **out of order**.', 'Datagrams can be **lost** and later **retransmitted**, so a retransmitted segment may arrive after later segments.', 'Datagrams can be **duplicated** in the network.'] },
      'Therefore TCP still uses **sequence numbers** to put bytes back in order, buffer out-of-order segments, detect gaps and discard duplicates before delivering a correct byte stream to the application.',
    ],
    sources: [`${T} §6.5`, `${F} ch. 24`],
  },

  'cn-tcp-corrupt': {
    blocks: [
      'The segment was meant for host **130.14.16.17** but, because of corruption, it was delivered to host **130.14.16.19** (same /16 network).',
      { h: 'How the receiving TCP reacts' },
      { steps: ['The IP layer at 130.14.16.19 accepts the datagram (its destination address field now reads .19) and passes the segment to TCP (protocol = 6).', 'TCP computes the **checksum over the pseudo-header + TCP header + data**. The pseudo-header includes the **source and destination IP addresses**: the sender computed it with 130.14.16.17 as the destination; the receiver uses its own address 130.14.16.19.', 'The recomputed checksum **does not match** → the segment is treated as corrupted.', 'TCP **silently discards** the segment: no acknowledgement and no error message are sent.', 'At the real destination nothing arrives, so the sender\'s **retransmission timer** expires and it **retransmits** the segment, which normally reaches 130.14.16.17 correctly.'] },
      'If instead the **destination port** field is corrupted, the checksum also covers the TCP header, so the mismatch is detected the same way and the segment is dropped. (If the checksum somehow matched and no process were listening on that port, TCP would answer with an **RST** segment.)',
      'This is exactly why TCP includes the pseudo-header in its checksum: it catches segments delivered to the **wrong host**.',
    ],
    sources: [`${F} ch. 24 (TCP checksum, pseudo-header)`, `${T} §6.5.4`],
  },

  'cn-tcp-conn': {
    blocks: [
      'TCP is connection-oriented: a connection is set up before data transfer and torn down afterwards. Connection management is implemented by a **finite state machine** at each end and by special flags (SYN, ACK, FIN, RST).',
      { h: 'Connection establishment: three-way handshake' },
      { img: 'tcp-handshake' },
      { steps: [
        'The server does a passive open (LISTEN, ACCEPT) and waits.',
        'The client does an active open (CONNECT): sends a **SYN** segment with its initial sequence number **x**, SYN = 1, ACK = 0. Client → **SYN_SENT**.',
        'The server replies with **SYN + ACK**: its own initial sequence number **y** and ack = **x + 1**. Server → **SYN_RCVD**.',
        'The client sends **ACK** with ack = **y + 1** (it may carry data). Both sides → **ESTABLISHED**; data flows in both directions.',
      ] },
      'Why three messages: each side must choose an initial sequence number and **confirm that the other received it**. This protects against **delayed duplicate** SYNs: if an old SYN arrives, the server\'s SYN+ACK refers to a connection the client never asked for, so the client replies **RST** and no bogus connection is made. Initial sequence numbers are clock-based to avoid reuse.',
      { img: 'cn-p59' },
      { h: 'Connection release: four segments' },
      { img: 'tcp-release' },
      { steps: [
        'The side that finishes first (say the client) sends **FIN** (seq = u) → **FIN_WAIT_1**.',
        'The server ACKs it (ack = u + 1) → server **CLOSE_WAIT**, client **FIN_WAIT_2**. The connection is now **half-closed**: the server may still send data.',
        'When the server is done, it sends its own **FIN** (seq = w) → **LAST_ACK**.',
        'The client ACKs (ack = w + 1) and enters **TIME_WAIT** for 2 × MSL (maximum segment lifetime) so that a lost final ACK can be resent and old segments die out; then **CLOSED**. The server closes on receiving the ACK.',
      ] },
      'Steps 2 and 3 are often combined (FIN + ACK), giving a three-segment release. Timers handle the **two-army problem**: if no reply comes, each side eventually gives up.',
    ],
    sources: [`${N3} p56–61, p73–74`, `${T} §6.2.2–6.2.3, §6.5.5–6.5.7`],
  },

  'cn-3way-reliable': {
    blocks: [
      { img: 'tcp-handshake' },
      'The three-way handshake (SYN x → SYN+ACK y, ack x+1 → ACK y+1) ensures reliability in these ways:',
      { ol: [
        '**Both sides confirm both initial sequence numbers.** The client knows the server got x (ack = x + 1); the server knows the client got y (ack = y + 1). Afterwards every byte is numbered from these values, so loss, duplication and ordering can be detected.',
        '**Protection against delayed duplicates.** An old SYN wandering in the network may reach the server. The server answers SYN+ACK, but the client, which did not send it, replies **RST**: no false connection is opened. Similarly an old duplicate ACK of a stale SYN+ACK is rejected because it acknowledges the wrong y.',
        '**Both directions are verified working** before data flows: each side has sent and received a segment.',
        '**Resources are allocated only after confirmation**, and parameters (MSS, window scale, SACK) are negotiated.',
        '**Lost handshake segments are retransmitted** on timeout, so the connection is still established if a SYN or ACK is lost.',
      ] },
      { img: 'cn-p59' },
      'A two-way handshake could not do the second point: a delayed duplicate request would immediately open a connection.',
    ],
    sources: [`${N3} p57–59`, `${T} §6.2.2`],
  },

  'cn-call-collision': {
    blocks: [
      { h: 'Normal case' },
      { img: 'tcp-handshake' },
      'Host 1 (client) sends SYN (seq = x); host 2 (server, in LISTEN) replies SYN + ACK (seq = y, ack = x + 1); host 1 sends ACK (seq = x + 1, ack = y + 1). Both are ESTABLISHED.',
      { h: 'Call collision (simultaneous open)' },
      'Both hosts try to open a connection **to each other, between the same pair of sockets, at the same time**.',
      { code: '  Host 1                                   Host 2\n  SYN (seq=x)   ---------\\     /---------  SYN (seq=y)\n  SYN_SENT                 \\   /            SYN_SENT\n                            \\ /\n                            / \\\n  SYN_RCVD    <------------/   \\----------> SYN_RCVD\n  SYN+ACK (seq=x, ack=y+1) ---\\   /--- SYN+ACK (seq=y, ack=x+1)\n                               \\ /\n  ESTABLISHED  <--------------/ \\---------> ESTABLISHED' },
      { steps: ['Each host sends a SYN and enters **SYN_SENT**.', 'Each receives the other\'s SYN while in SYN_SENT, moves to **SYN_RCVD**, and sends a **SYN + ACK** acknowledging the other\'s sequence number.', 'When each receives the other\'s SYN+ACK, it moves to **ESTABLISHED**.'] },
      'Result: **only one connection** is established, not two, because a TCP connection is identified by its two endpoints (IP:port, IP:port); both SYNs refer to the same pair.',
    ],
    sources: [`${N3} p73`, `${T} §6.5.5 (Fig. 6-37)`],
  },

  'cn-two-way': {
    blocks: [
      { h: 'Two-way handshake' },
      'Host 1 sends a CONNECTION REQUEST; host 2 replies CONNECTION ACCEPTED (ACK). Host 2 considers the connection open as soon as it sends the ACK; host 1 when it receives it. There is no third message confirming host 2\'s sequence number.',
      { h: 'Three-way handshake' },
      'Host 1 sends CR (seq = x); host 2 replies ACK (seq = y, ack = x); host 1 confirms with DATA/ACK (seq = x, ack = y). Each side confirms the other\'s initial sequence number, so delayed duplicates are rejected.',
      { img: 'cn-p59' },
      { h: 'Would deadlocks be possible with a two-way handshake?' },
      '**Yes.** Example:',
      { steps: ['Host 1 sends a CONNECTION REQUEST.', 'Host 2 receives it, sends CONNECTION ACCEPTED and considers the connection established. It now **waits for data** from host 1.', 'The ACCEPTED message is **lost**.', 'Host 1 never learns that the connection is open; it **waits for the acceptance** (if it has no timer, forever).', 'Both hosts are waiting for each other: **deadlock**.'] },
      'Another failure: a **delayed duplicate** CONNECTION REQUEST from an old connection arrives at host 2, which accepts and opens a connection that host 1 never asked for; host 2 may then wait for data that never comes (and, worse, if an old duplicate data packet arrives, it may be accepted as part of the bogus connection: e.g. a duplicate "transfer money" request executed twice).',
      'With the third message (and timers + retransmission), host 2 does not consider the connection open until host 1 confirms, and host 1 can reject a connection it did not request: no deadlock, no bogus connection.',
    ],
    sources: [`${N3} p57–59`, `${T} §6.2.2`],
  },

  'cn-tcp-release-steps': {
    blocks: [
      'TCP connections are full-duplex, so each direction is released **separately** (symmetric release, also called a half-close).',
      { img: 'tcp-release' },
      { steps: [
        '**Client sends FIN.** The client application calls CLOSE; TCP sends a segment with **FIN = 1** (seq = u). It enters **FIN_WAIT_1**. It will send no more data.',
        '**Server ACKs the FIN.** The server\'s TCP sends ACK (ack = u + 1), enters **CLOSE_WAIT** and tells its application that the client has finished. The client, on receiving this ACK, enters **FIN_WAIT_2**. The connection is now **half-closed**: data can still flow from the server to the client.',
        '**Server sends FIN.** When the server application is done and calls CLOSE, its TCP sends **FIN** (seq = w) and enters **LAST_ACK**.',
        '**Client ACKs and waits.** The client sends ACK (ack = w + 1) and enters **TIME_WAIT**. It waits **2 × MSL** (twice the maximum segment lifetime, e.g. 2 × 2 min) to make sure the server received the ACK (if not, the server retransmits its FIN and the client re-ACKs) and that old duplicate segments of this connection have died out. Then it enters **CLOSED**.',
        '**Server closes** as soon as it receives the final ACK.',
      ] },
      'Steps 2 and 3 can be combined into one FIN + ACK segment (three-segment release). A connection can also be aborted immediately with an **RST** segment.',
    ],
    sources: [`${N3} p73–74`, `${T} §6.5.6–6.5.7`],
  },

  'cn-four-way': {
    blocks: [
      '**Four-way handshaking** is the exchange of **four segments used to release (terminate) a connection**: **FIN → ACK → FIN → ACK**. It is used in **TCP**.',
      { img: 'tcp-release' },
      { ol: ['Client → server: FIN (I have no more data).', 'Server → client: ACK (connection is half-closed; the server can still send).', 'Server → client: FIN (I am done too).', 'Client → server: ACK; client waits in TIME_WAIT (2 MSL), then closes.'] },
      'It takes four segments because TCP is **full-duplex**: each direction must be closed independently and each FIN must be acknowledged. (When the server has nothing more to send, segments 2 and 3 are merged and release takes three segments.) It approximates a solution to the **two-army problem** using timers.',
    ],
    sources: [`${N3} p73–74`, `${T} §6.5.6`],
  },

  'cn-tcp-states': {
    blocks: [
      'TCP connection management is described by a **finite state machine with 11 states**. Each transition is labelled **event / action** (e.g. "SYN / SYN + ACK").',
      { table: { head: ['State', 'Description'], rows: [
        ['CLOSED', 'No connection is active or pending'],
        ['LISTEN', 'The server is waiting for an incoming call'],
        ['SYN_RCVD', 'A connection request has arrived; waiting for ACK'],
        ['SYN_SENT', 'The application has started to open a connection'],
        ['ESTABLISHED', 'The normal data-transfer state'],
        ['FIN_WAIT_1', 'The application has said it is finished'],
        ['FIN_WAIT_2', 'The other side has agreed to release'],
        ['TIME_WAIT', 'Wait for all packets to die off (2 MSL)'],
        ['CLOSING', 'Both sides have tried to close simultaneously'],
        ['CLOSE_WAIT', 'The other side has initiated a release'],
        ['LAST_ACK', 'Wait for all packets to die off / final ACK'],
      ] } },
      { h: 'Main paths through the diagram' },
      { ul: [
        '**Client (active open)**: CLOSED → (CONNECT / SYN) → SYN_SENT → (SYN+ACK / ACK) → ESTABLISHED.',
        '**Server (passive open)**: CLOSED → (LISTEN / –) → LISTEN → (SYN / SYN+ACK) → SYN_RCVD → (ACK / –) → ESTABLISHED.',
        '**Simultaneous open**: SYN_SENT → (SYN / SYN+ACK) → SYN_RCVD → ESTABLISHED.',
        '**Active close**: ESTABLISHED → (CLOSE / FIN) → FIN_WAIT_1 → (ACK / –) → FIN_WAIT_2 → (FIN / ACK) → TIME_WAIT → (timeout) → CLOSED.',
        '**Passive close**: ESTABLISHED → (FIN / ACK) → CLOSE_WAIT → (CLOSE / FIN) → LAST_ACK → (ACK / –) → CLOSED.',
        '**Simultaneous close**: FIN_WAIT_1 → (FIN / ACK) → CLOSING → (ACK / –) → TIME_WAIT.',
      ] },
      { code: '            CLOSED\n   passive open |  \\ active open: send SYN\n               v    v\n           LISTEN   SYN_SENT\n  rcv SYN/      \\    / rcv SYN+ACK / send ACK\n  send SYN+ACK   v  v\n          SYN_RCVD -> ESTABLISHED\n                        |       \\\n          CLOSE/FIN     |        rcv FIN / send ACK\n                        v         v\n                  FIN_WAIT_1   CLOSE_WAIT\n            rcv ACK |   \\rcv FIN    | CLOSE / FIN\n                    v    v          v\n             FIN_WAIT_2 CLOSING   LAST_ACK\n          rcv FIN/ACK \\   | ACK     | rcv ACK\n                       v  v         v\n                     TIME_WAIT -> CLOSED (after 2 MSL)' },
      'In the textbook figure, the heavy solid line is the normal client path, the heavy dashed line the normal server path, and thin lines are unusual events.',
    ],
    sources: [`${N3} p73–74`, `${T} §6.5.7 (Fig. 6-38, 6-39)`],
  },

  'cn-n-army': {
    blocks: [
      'The **two-army problem**: two blue armies on hills must attack a white army in the valley **at the same time** to win; their only communication is by messengers who may be captured (an unreliable channel). Blue army 1 sends "attack at dawn"; it cannot be sure the message arrived, so blue 2 must acknowledge; but then blue 2 cannot be sure the ack arrived, and so on. Whichever message is the **last** one, its sender cannot know it arrived, so it cannot be sure the other will attack. **No protocol exists** that guarantees agreement.',
      { h: 'Generalised n-army problem' },
      'Now there are n blue armies and **any two** attacking together is enough to win. **Does a protocol exist that lets blue win?**',
      '**No.** The argument is the same: the problem is not the number of armies but that agreement must be reached over an **unreliable channel**. For any two armies to attack, each must be **certain** another one will attack too. Suppose a protocol exists; take the shortest run in which two armies are sure. Consider the last message of that run: either it is essential (then its sender, not knowing whether it arrived, cannot be sure the receiver will attack, a contradiction) or it is not essential (then remove it and get a shorter run, a contradiction). Adding more armies only adds more messages, each of which can be lost; it never produces the **certainty** required.',
      { h: 'Practical lesson for TCP' },
      'Connection release cannot be made perfectly safe. TCP uses a **three-way/four-way release with timers**: each side gives up after a timeout (TIME_WAIT, retransmission limits). In rare cases this leaves a half-open connection, which is cleaned up by keepalive timers.',
    ],
    sources: [`${T} §6.2.3 (two-army problem)`, `${N3} p59–60`],
  },

  'cn-sliding-window': {
    blocks: [
      'TCP uses a **byte-oriented sliding window** for flow control and reliable delivery. The window is the range of sequence numbers (bytes) the sender may transmit without waiting for an acknowledgement.',
      { img: 'sliding-window' },
      { h: 'Sender\'s view of the byte stream' },
      { ul: ['Bytes **sent and acknowledged** (left of the window): can be removed from the buffer.', 'Bytes **sent but not yet acknowledged** (inside the window).', 'Bytes **that can be sent** now (rest of the window).', 'Bytes **that cannot be sent** until the window moves (right of the window).'] },
      { h: 'How the window moves' },
      { ul: ['The window size = **min(rwnd, cwnd)**: the receiver\'s advertised window (flow control) and the congestion window.', '**Opens** (right edge moves right) when the receiver advertises more buffer space.', '**Closes** (left edge moves right) when bytes are acknowledged.', '**Shrinks** (right edge moves left): strongly discouraged.', 'A **zero window** stops the sender; the persist timer then sends **window probes**.'] },
      { h: 'Window management example (Tanenbaum)' },
      { steps: ['Receiver has a 4 KB buffer. Sender sends 2 KB; receiver ACKs with window = 2 KB (2 KB buffered).', 'Sender sends another 2 KB; buffer full → ACK with window = 0. The sender stops (except urgent data or 1-byte probes).', 'The application reads 2 KB; receiver sends ACK with window = 2 KB.', 'Sender sends 1 KB; window shrinks accordingly.'] },
      { h: 'Refinements' },
      { ul: ['**Delayed ACKs** (wait up to 500 ms to piggyback or combine).', '**Nagle\'s algorithm**: when data arrives byte by byte, send the first byte and buffer the rest until the outstanding data is ACKed.', '**Clark\'s solution to silly window syndrome**: the receiver advertises a window update only when it can accept a full MSS or half its buffer.', 'Out-of-order segments are buffered; ACKs are cumulative (SACK option for selective).'] },
    ],
    sources: [`${N3} p73–74`, `${T} §6.5.8`],
  },

  'cn-flow-control': {
    blocks: [
      'TCP uses a **credit-based** flow control scheme: acknowledgements are decoupled from permission to send. The receiver grants the sender a **credit**: the number of bytes it may send.',
      { ul: [
        'Each segment from the receiver carries **ack = A** (all bytes up to A − 1 received) and **window = W**.',
        'This grants the sender **credit to send bytes A to A + W − 1**.',
        'The receiver sets W from its **free buffer space**. If the application is slow to read, W shrinks; **W = 0** stops the sender.',
        'When buffer space is freed, the receiver sends a **window update** (same ack, larger W).',
        'If a window update is lost while W = 0, both sides would wait forever, so the sender uses the **persist timer** to send small **window probes**.',
      ] },
      'Example: ack = 1001, window = 3000 → the sender may send bytes 1001–4000. After it sends 1001–2000, it may send 2000 more until a new credit arrives.',
      'The actual sending limit is min(advertised window, congestion window).',
    ],
    sources: [`${T} §6.2.4, §6.5.8`, `${N3} p62–64`],
  },

  'cn-timers': {
    blocks: [
      'TCP uses several timers to make the protocol reliable and to manage connections.',
      { h: '1. Retransmission timer (RTO)' },
      'Started when a segment is sent; if it expires before the segment is acknowledged, the segment is **retransmitted**. The timeout must adapt to the network: too short → useless retransmissions, too long → slow recovery. TCP measures the round-trip time R and uses **Jacobson\'s algorithm**:',
      { formula: 'SRTT = α·SRTT + (1 − α)·R   (α = 7/8)     RTTVAR = β·RTTVAR + (1 − β)·|SRTT − R|   (β = 3/4)     RTO = SRTT + 4·RTTVAR' },
      '**Karn\'s algorithm**: do not update RTT from retransmitted segments (ambiguous ACKs), and **double the RTO** after each successive timeout (exponential backoff).',
      { h: '2. Persistence timer' },
      'Prevents deadlock when the receiver advertises a **zero window** and the later window update is lost. When the timer goes off, the sender transmits a **window probe** (1 byte); the reply gives the current window.',
      { h: '3. Keepalive timer' },
      'When a connection has been **idle for a long time** (e.g. 2 hours), one side sends a probe to check that the other is still there. If there is no response after several probes, the connection is terminated (cleans up half-open connections from crashed clients).',
      { h: '4. TIME_WAIT (2 MSL) timer' },
      'After closing, the active closer waits **twice the maximum segment lifetime** so that the final ACK can be resent if lost and old duplicate segments die before the same port pair is reused.',
      { table: { head: ['Timer', 'Started when', 'On expiry'], rows: [['Retransmission', 'A segment is sent', 'Retransmit, double RTO'], ['Persistence', 'Zero window received', 'Send window probe'], ['Keepalive', 'Connection idle', 'Send probe; close if no reply'], ['TIME_WAIT', 'Active close completes', 'Connection deleted']] } },
    ],
    sources: [`${N3} p74`, `${T} §6.5.9`],
  },

  // ---------------- Congestion ----------------
  'cn-congestion': {
    blocks: [
      '**Congestion** is the situation in which **too many packets are present in (part of) the network**, so performance degrades: delay rises and packets are lost. It happens when the **load offered to the network exceeds its capacity**.',
      { h: 'How congestion occurs' },
      { ul: ['**Several input lines feed one output line**: packets arrive faster than the outgoing link can send them; the router\'s queue builds up.', '**Insufficient buffer memory**: queues overflow and packets are dropped. (Infinite buffers do not help: packets wait so long they time out and are retransmitted, adding more load.)', '**Slow processors** in routers (queueing, table updates).', '**Low-bandwidth links** relative to the traffic.', '**Retransmissions** of dropped/timed-out packets add more load: a vicious circle that can lead to **congestion collapse**, where goodput falls as load rises.', '**Bursty traffic** from many hosts at once.'] },
      { img: 'cn-p64' },
      { h: 'Approaches to congestion control (by time scale)' },
      { ol: ['**Network provisioning**: build enough capacity (slowest, months).', '**Traffic-aware routing**: route around hotspots by including load in link weights.', '**Admission control**: refuse new virtual circuits/flows if the network cannot carry them.', '**Traffic throttling**: routers signal congestion so senders slow down: choke packets, explicit congestion notification (ECN), hop-by-hop backpressure; TCP reduces its window.', '**Load shedding**: when all else fails, routers drop packets (random early detection, RED, drops early to warn senders).'] },
      { h: 'Open loop vs closed loop' },
      { compare: [
        { title: 'Open loop (prevention)', items: ['Good design so congestion does not happen', 'Retransmission, window, ACK, discard and admission policies', 'Traffic shaping (leaky/token bucket)'] },
        { title: 'Closed loop (removal)', items: ['Monitor, feed back, adjust', 'Backpressure, choke packets', 'Implicit signalling (loss/delay) and explicit signalling (ECN)', 'TCP congestion control'] },
      ] },
      { h: 'In TCP' },
      'The sender keeps a congestion window (cwnd): **slow start** (exponential), **congestion avoidance** (+1 MSS per RTT), and on loss **multiplicative decrease** (halve the threshold): AIMD.',
    ],
    sources: [`${N3} p13–17, p62–64`, `${T} §5.3, §6.3`],
  },

  'cn-cc-principles': {
    blocks: [
      'Congestion control is about making sure the **network can carry the offered traffic**; it is a global issue involving all hosts and routers (unlike flow control, which is between one sender and one receiver).',
      { h: 'General principles (control-theory view)' },
      'Solutions are divided into **open-loop** and **closed-loop**.',
      { ul: ['**Open loop**: solve the problem by **good design**, making sure congestion does not occur in the first place: decide when to accept new traffic, when to discard packets and which ones, and make scheduling decisions. These decisions do not take the current state of the network into account.', '**Closed loop**: based on a **feedback loop** with three parts:'] },
      { ol: ['**Monitor** the system to detect when and where congestion occurs (metrics: % packets discarded, average queue length, packets timed out and retransmitted, average delay and its deviation).', '**Pass this information** to places where action can be taken (routers send packets to the source; set a bit in packets; hosts or routers send probe packets).', '**Adjust system operation** to correct the problem: **increase resources** (more bandwidth, extra routes, spare routers) or **decrease the load** (deny or degrade service, ask senders to slow down, shape traffic).'] },
      { h: 'Other principles' },
      { ul: ['**Explicit vs implicit feedback**: routers may tell the source directly (choke packets, ECN), or the source infers congestion from loss or delay (TCP).', '**Act early**: queues should be kept short (RED) because once collapse begins it is hard to recover.', '**Fairness**: the remedy should share capacity fairly among flows (max-min fairness).', '**Stability**: control must not oscillate (AIMD converges to fair, efficient use).', '**Time scales**: provisioning (months), routing (minutes), admission control and throttling (RTTs), load shedding (milliseconds).'] },
    ],
    sources: [`${N3} p13–17`, `${T} §5.3.1–5.3.2`],
  },

  'cn-tcp-congestion': {
    blocks: [
      'In the Internet the network layer gives little help, so **TCP does congestion control at the transport layer**. The sender keeps a **congestion window (cwnd)** in addition to the receiver\'s window; it may have **min(cwnd, rwnd)** bytes outstanding. Packet **loss** (timeout or duplicate ACKs) is taken as the signal of congestion.',
      { h: '1. Slow start' },
      'cwnd starts at **1 MSS** (or a few). For every ACK received, cwnd increases by 1 MSS, so cwnd **doubles every RTT** (1, 2, 4, 8 …): exponential growth, until it reaches the **slow-start threshold (ssthresh)**.',
      { h: '2. Congestion avoidance: additive increase' },
      'Above ssthresh, cwnd grows by **1 MSS per RTT** (linear).',
      { h: '3. On congestion: multiplicative decrease' },
      { ul: ['**Timeout** (TCP Tahoe): ssthresh = cwnd / 2, cwnd = 1 MSS, slow start again.', '**Three duplicate ACKs**: **fast retransmit** the missing segment without waiting for the timer; with **fast recovery** (TCP Reno) ssthresh = cwnd / 2 and cwnd = ssthresh (+3), then continue with congestion avoidance (no slow start).'] },
      'This **AIMD** (additive increase, multiplicative decrease) gives the classic **saw-tooth** graph of cwnd and converges to a fair and efficient share of the bottleneck.',
      { code: 'cwnd\n  |            ssthresh=16          timeout\n16|           /|   /\\                 |\n  |          / | /    \\  (additive)    |\n 8|        /   |/       \\--------------x\n  |      /                                 new ssthresh = cwnd/2\n 4|    /    (exponential: slow start)          /\n 2|  /                                       /\n 1|/                                       /\n  +--------------------------------------------- RTT' },
      { h: 'Other transport-layer mechanisms' },
      'Explicit Congestion Notification (routers mark packets; receiver echoes ECE, sender reduces cwnd and sets CWR), and network-assisted schemes like RED that drop packets early.',
      { tip: 'Trace a cwnd graph yourself with the cwnd simulator on the Numericals tab.' },
    ],
    sources: [`${N3} p74`, `${T} §6.3, §6.5.10`],
  },

  'cn-flow-error-cong': {
    blocks: [
      { table: { head: ['Basis', 'Flow control', 'Error control', 'Congestion control'], rows: [
        ['Purpose', 'Stop a fast sender from overwhelming a **slow receiver**', 'Detect and recover from **lost, corrupted, duplicated or out-of-order** data', 'Stop senders from overloading the **network** (routers/links)'],
        ['Scope', 'Between one sender and one receiver (end-to-end at transport; hop-to-hop at data link)', 'Between sender and receiver', 'Global: all hosts and routers'],
        ['Who signals', 'Receiver (advertised window)', 'Receiver (ACKs, duplicate ACKs, NAKs)', 'Network (loss, delay, ECN, choke packets)'],
        ['Mechanism in TCP', 'Receiver window rwnd, persist timer', 'Checksums, sequence numbers, ACKs, retransmission timer, fast retransmit', 'Congestion window cwnd: slow start, AIMD, fast recovery'],
        ['Problem if missing', 'Receiver buffer overflow → lost data', 'Corrupted/missing data delivered', 'Queues overflow, congestion collapse'],
        ['Example', 'Phone app reading slowly from a fast server', 'Packet bit flipped by noise', 'Many users downloading through one 100 Mbps link'],
      ] } },
      { img: 'cn-p64' },
      'The figure shows the difference: (a) a fast network feeding a small receiver needs **flow control**; (b) a slow network feeding a large receiver needs **congestion control**.',
    ],
    sources: [`${N3} p62–64`, `${T} §6.3`],
  },

  'cn-open-closed': {
    blocks: [
      { compare: [
        { title: 'Open-loop congestion control', items: ['**Prevents** congestion before it happens', 'Policies are applied by the source or destination by design', 'Does **not** use feedback about the current network state', 'Examples: traffic shaping, admission control, good retransmission and discard policies'] },
        { title: 'Closed-loop congestion control', items: ['**Removes / alleviates** congestion after it happens', 'Uses a **feedback loop**: monitor → report → adjust', 'Reacts to the current state of the network', 'Examples: backpressure, choke packets, implicit signalling (TCP loss/delay), explicit signalling (ECN)'] },
      ] },
      { h: 'Policies that prevent congestion (open loop)' },
      { ol: [
        '**Retransmission policy**: retransmission timers and policy designed to avoid unnecessary retransmissions (which add load).',
        '**Window policy**: **selective repeat** is better than go-back-N, which resends packets that may already have arrived.',
        '**Acknowledgement policy**: ACK only every N packets, or delay/piggyback ACKs, to reduce load.',
        '**Discard policy**: routers discard less important packets first (e.g. in audio, drop less sensitive packets) and preserve quality.',
        '**Admission policy**: a router/switch checks the resource requirements of a flow before admitting it (used in virtual-circuit networks).',
        '**Traffic shaping**: leaky bucket / token bucket.',
      ] },
      { h: 'Closed-loop mechanisms' },
      { ul: ['**Backpressure**: a congested node stops accepting from its upstream node, which in turn becomes congested, propagating back to the source.', '**Choke packet**: a router sends a packet directly to the source telling it to slow down.', '**Implicit signalling**: the source detects congestion from missing ACKs or delay (TCP).', '**Explicit signalling**: routers set a bit in packets (forward or backward) to inform the source or destination (ECN).'] },
    ],
    sources: [`${N3} p13–17`, `${F} ch. 24 (congestion control)`, `${T} §5.3`],
  },

  'cn-cc-layer': {
    blocks: [
      'In the Internet, congestion control is done mainly **end-to-end by TCP** at the transport layer, with the network layer only dropping or marking packets.',
      { compare: [
        { title: 'Advantages of transport-layer control', items: ['**Acts at the source**: the host that creates the traffic reduces its rate, the only real fix', '**Simple routers**: no per-flow state or signalling in the network core; scales to the whole Internet', 'Works over **any network technology** (heterogeneous paths)', '**End-to-end view**: reacts to the bottleneck anywhere on the path', 'Easy to deploy and improve by updating host software (Tahoe → Reno → CUBIC/BBR)'] },
        { title: 'Disadvantages', items: ['**Slow reaction**: feedback takes at least one RTT; routers may overflow meanwhile', '**Implicit signals are ambiguous**: loss on wireless links is mistaken for congestion, needlessly cutting the rate', '**Depends on cooperation**: UDP applications or misbehaving hosts that ignore congestion can grab bandwidth unfairly', 'Hosts **lack knowledge** of where exactly congestion is and of other flows', 'Cannot give guarantees (QoS) needed by real-time traffic'] },
      ] },
      'In practice both layers cooperate: routers help with **active queue management (RED)** and **ECN marking**, while TCP adjusts its window.',
    ],
    sources: [`${T} §6.3`, `${N3} p62–64`],
  },

  'cn-num-aimd': {
    blocks: [
      'Convention (TCP Tahoe, as in the question): slow start doubles cwnd each transmission until the threshold, then +1 MSS; on timeout, threshold = cwnd/2 and cwnd restarts at the initial window.',
      { table: { head: ['Transmission', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], rows: [['cwnd (MSS)', '2', '4', '8', '9', '10 ✗', '2', '4', '5', '6', '7'], ['ssthresh', '8', '8', '8', '8', '8', '5', '5', '5', '5', '5'], ['Phase', 'SS', 'SS', 'SS', 'CA', 'CA (timeout)', 'SS', 'SS', 'CA', 'CA', 'CA']] } },
      { ul: ['1–3: slow start doubles 2 → 4 → 8 (threshold reached).', '4–5: congestion avoidance, +1 each: 9, 10. **Timeout at the 5th.**', 'New ssthresh = 10 / 2 = **5**; window restarts at the initial **2 MSS**.', '6–7: slow start 2 → 4; 8: would double to 8, but is capped at the threshold → 5.', '9–10: additive increase → 6, 7.'] },
      'Congestion window at the end of the 10th transmission = **7 MSS** (6 MSS if your convention restarts at 1 MSS).',
    ],
    sources: ["CN Dec '22–Jan '23 (IT) paper", 'Verified with the cwnd simulator'],
  },
}
