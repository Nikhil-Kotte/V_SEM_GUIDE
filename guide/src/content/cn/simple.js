// Simpler explanations of each topic, written by ChatGPT (via scripts/simplify-with-chatgpt.mjs).
// Stored verbatim; regenerate with:  node scripts/simplify-with-chatgpt.mjs <subject> [--only <id>]
export default {
  "cn.u3.bgp": {
    "summary": "**BGP (Border Gateway Protocol)** helps different networks exchange routes across the Internet. It chooses routes using **policy**, meaning rules set by network owners, rather than simply choosing the shortest path.",
    "points": [
      "An **autonomous system (AS)** is a network under one administrative control, such as an Internet service provider’s network.",
      "**Intra-AS routing** happens inside one AS. One administrator manages it, mainly aiming for good performance. **RIP** and **OSPF** are examples. **Inter-AS routing** happens between ASes, where different administrators must follow their own policies.",
      "BGP routers exchange route information through **TCP** connections using **port 179**. **eBGP** exchanges routes between different ASes. **iBGP** shares BGP routes inside the same AS.",
      "A route advertisement includes a **prefix**, the destination address block; an **AS path**, the list of ASes along the route; and a **next hop**, the router to forward traffic toward.",
      "BGP is a **path-vector protocol** because it advertises AS paths. A router rejects a route containing its own AS number in that path. This prevents routing loops between ASes.",
      "**Route selection** gives priority to policy. When higher-priority preferences are equal, a shorter AS path is preferred. Other rules break remaining ties."
    ],
    "analogy": "Think of delivery companies choosing partner companies. Their agreements may matter more than how many companies handle a parcel.",
    "example": "AS A learns two routes to a destination: A → B → D and A → C → E → D. A may prefer the longer route because its policy favours C."
  },
  "cn.u3.ip-addresses": {
    "summary": "An **IPv4 address** identifies a device’s connection to a network. Its 32 bits (binary digits) split into a **network part (prefix)** and a **host part (suffix)**, which identifies the connection within that network.",
    "points": [
      "**Classful addressing** uses fixed groups based on the first number: **A** = 0–127, **B** = 128–191, **C** = 192–223. Their default prefix lengths are /8, /16 and /24. Values 0 and 127 have special uses.",
      "**Class D** = 224–239 supports **multicast**, sending to a group. **Class E** = 240–255 is reserved. Fixed class sizes can waste addresses.",
      "**CIDR**, or classless addressing, allows flexible splits. In a.b.c.d/n, **prefix length** n counts network bits. The block contains **2^(32−n)** addresses.",
      "A **subnet mask** has 1s for network bits and 0s for host bits. Set all host bits to 0 for the **first address**, or 1 for the **last address**.",
      "**Subnetting** splits a block by lengthening its prefix: one /24 becomes four /26 blocks. **Supernetting** combines contiguous, correctly aligned blocks by shortening the prefix. This supports **route aggregation**, representing several routes with one.",
      "To check **same network**, use **bitwise AND** on each address and its mask: a result bit is 1 only when both inputs are 1. Different masks can cause inconsistent local-network decisions.",
      "**NAT** means Network Address Translation. With port translation, private devices share a public IP. The router records address-and-port mappings to deliver replies."
    ],
    "analogy": "Think of the prefix as a street name and the host part as a house number.",
    "example": "**205.16.37.39/28** has four host bits: **16 addresses**, from **205.16.37.32** to **205.16.37.47**."
  },
  "cn.u3.ipv4": {
    "summary": "**IPv4 (Internet Protocol version 4)** carries packets, called **datagrams**, across networks. It is **connectionless**: it sends without first setting up a connection. It is **best-effort**: delivery and arrival order are not guaranteed.",
    "points": [
      "Each datagram has a **header**, which carries control information, followed by data. The header is **20–60 bytes**. **Total Length** counts both parts, up to **65,535 bytes**.",
      "**Version** is 4. **IHL (Internet Header Length)** measures the header in 4-byte units. **Options** are optional header extras, such as timestamps. **Differentiated Services** helps give traffic different treatment.",
      "**Source and destination addresses** identify the sender and intended receiver. Each is **32 bits**. **Protocol** identifies what the data belongs to: **6 = TCP**, **17 = UDP**.",
      "**TTL (Time to Live)** limits how many routers a datagram can pass through. Each router reduces it. At zero, the datagram is discarded, preventing endless loops.",
      "**MTU (Maximum Transmission Unit)** is a link’s packet-size limit. **Fragmentation** splits oversized datagrams unless **DF (Don't Fragment)** forbids it. Only the destination reassembles them.",
      "Fragments share an **Identification** value. **Fragment Offset** gives each piece’s position in 8-byte units. **MF (More Fragments)** is 1 except for the last piece.",
      "The **header checksum** checks only the header. Add its 16-bit words with the checksum initially zero, wrapping carries around, then flip all bits. Routers update it because TTL changes."
    ],
    "analogy": "Think of a datagram as a parcel: its header is the delivery label.",
    "example": "With a 20-byte header and MTU 100, each fragment holds up to 80 data bytes. Thus, 980 data bytes need **13 fragments**: twelve carrying 80 bytes and one carrying 20."
  },
  "cn.u3.ipv6": {
    "summary": "**IPv6 (Internet Protocol version 6)** provides addresses that identify devices’ network connections. IPv4 uses **32-bit addresses**, giving about 4.3 billion possibilities. IPv6 uses **128-bit addresses**, giving 2¹²⁸ possibilities and solving the address shortage.",
    "points": [
      "The **header** is the control information before the data. IPv6 has a fixed **40-byte base header**. IPv4’s header varies from 20–60 bytes. IPv6’s simpler layout reduces work for **routers**, which forward packets.",
      "Header fields include **Version**, source and destination addresses, and **Payload Length**, which counts bytes after the base header. **Next Header** identifies what follows. **Hop Limit** decreases at each router; zero means discard the packet.",
      "**Traffic Class** marks traffic for different treatment. **Flow Label** identifies related packets for consistent handling. These support **Quality of Service (QoS)**, or managing how traffic is treated.",
      "IPv6 has no header **checksum**, an error-checking value. **Fragmentation**, splitting a packet into smaller pieces, is done only by the sender. **Extension headers** carry extra information outside the base header.",
      "**Auto-configuration** lets devices configure addresses automatically. **DHCPv6** can also supply configuration. The large address space removes the address-shortage reason for **NAT**, which translates addresses. **IPsec** can secure traffic; IPv6 does not automatically encrypt packets.",
      "**Dual stack** runs both versions. **Tunnelling** carries IPv6 inside IPv4. **Translation** converts between them.",
      "Addresses use eight groups of **hexadecimal** digits, using 0–9 and a–f. Drop leading zeros; use **::** once to replace consecutive all-zero groups."
    ],
    "analogy": "A packet is like a parcel: its header carries delivery instructions, and its payload is the contents.",
    "example": "**2001:0db8:0000:0000:0000:ff00:0042:8329** becomes **2001:db8::ff00:42:8329**."
  },
  "cn.u3.link-state": {
    "summary": "**Link State Routing** lets each router build a map of the network. A router is a device that forwards data towards its destination. Each router uses this map to choose paths with the lowest total cost.",
    "points": [
      "**Discover neighbours:** Each router sends **HELLO packets**, small messages that identify directly connected routers.",
      "**Measure link cost:** A link is a connection between routers. Its cost can depend on delay or bandwidth, the connection’s data capacity. **ECHO packets** can measure delay by timing a reply.",
      "**Build a Link State Packet (LSP):** This message contains the router’s identity, its neighbours, their link costs, a **sequence number**, and an **age**.",
      "**Flood the LSP:** Routers pass it through the network. They forward it on other links, excluding the arrival link. The sequence number helps reject old or duplicate copies. Age helps remove stale information.",
      "**Compute shortest paths:** Each router runs **Dijkstra’s algorithm** on its map. This finds lowest-cost paths and fills its **routing table**, which tells it where to forward data.",
      "**Distance Vector** uses neighbours’ distance information and **Bellman-Ford**. Link state usually converges faster, meaning routers agree on updated routes sooner. It needs more memory and processing. **OSPF** and **IS-IS** use link state.",
      "**Hierarchical routing** groups routers into regions. Routers keep detailed local information and summarised information about other regions."
    ],
    "analogy": "It is like neighbours sharing their local street connections. Everyone builds a city map and independently chooses a route.",
    "example": "If A–B costs 2, B–C costs 1, and A–C costs 5, A reaches C through B. Total cost: 3."
  },
  "cn.u3.ospf": {
    "summary": "**OSPF (Open Shortest Path First)** helps routers choose paths for sending data. It is an **Interior Gateway Protocol (IGP)**, used inside one **Autonomous System (AS)**: a group of networks under one administration. It is an **open standard**, so different manufacturers can support it.",
    "points": [
      "**Link-state** means each router learns the network connections and their costs within its **area**. It uses **Dijkstra’s shortest-path algorithm** to calculate paths with the lowest total **cost**.",
      "An **area** divides a large network into smaller parts, reducing routing information exchanged. All areas connect to the **backbone, area 0**. **Area Border Routers (ABRs)** connect areas and can summarise routes.",
      "**Point-to-point links** join two routers. **Transit links** connect several routers through a shared network. A chosen **Designated Router (DR)** represents that shared network.",
      "A **stub link** leads to a network attached to only one router. A **virtual link** is an administrator-configured logical connection through another area, used to maintain backbone connectivity.",
      "OSPF runs directly over IP using **protocol number 89**. It supports **authentication**, **multicast**, and **equal-cost load balancing**: sharing traffic across equally costly paths.",
      "**RIP** learns distances from neighbours and can suffer **count-to-infinity**, where incorrect distance estimates repeatedly increase. OSPF quickly spreads changes within an area and recalculates paths, usually converging faster."
    ],
    "analogy": "OSPF is like sharing updated road maps. Each driver uses the map to calculate the cheapest route.",
    "example": "If A–B costs 2 and B–C costs 3, A reaches C for cost 5. It prefers this over a direct link costing 8."
  },
  "cn.u3.qos": {
    "summary": "**Quality of Service (QoS)** means managing a network so different applications get the service they need. A **flow** is a stream of related packets, such as one video call.",
    "points": [
      "**Reliability** means avoiding packet loss or corruption. **Delay** is the time data takes to reach its destination. **Jitter** is variation in that delay. **Bandwidth** is the data rate needed, measured in bits per second.",
      "**Over-provisioning** means providing extra network capacity. **Buffering** means holding received packets briefly before playback. This smooths jitter but adds delay.",
      "**Traffic shaping** controls how quickly data enters the network. A **leaky bucket** releases queued data at a constant rate. If its storage fills, arriving packets are dropped.",
      "A **token bucket** adds sending credits called tokens at rate **R**. Unused tokens accumulate up to capacity **B**. Saved tokens allow short bursts, while R limits the long-term average rate.",
      "**Packet scheduling** decides which packet goes next. **FIFO** serves arrival order. **Fair queuing** shares service among flows. **Weighted fair queuing** gives larger shares to flows with higher weights.",
      "**Admission control** accepts a new flow only when enough resources are available.",
      "**Integrated Services (IntServ)** provides per-flow guarantees. **RSVP (Resource Reservation Protocol)** reserves resources along the path. Keeping information for every flow limits scalability. **DiffServ** instead groups packets into service classes."
    ],
    "analogy": "Think of a road: QoS manages limited road space so an ambulance can receive priority.",
    "example": "One token every 5 microseconds gives 200,000 tokens per second. At 48 bytes per token, the sustainable rate is **76.8 Mbps**."
  },
  "cn.u4.congestion": {
    "summary": "**Congestion** means packets arrive faster than the network can handle them. Router queues fill, delays grow, and packets get dropped. Retransmitting lost packets adds traffic and can sharply reduce useful data delivery.",
    "points": [
      "**Open-loop control** tries to prevent congestion. It uses policies for retransmissions, acknowledgements, windows, discarding packets and admitting traffic. **Traffic shaping** controls how traffic enters the network.",
      "**Closed-loop control** detects congestion and reacts. **Back-pressure** asks upstream routers to slow down. **Choke packets** warn senders. Loss or delay gives **implicit signalling**; **ECN** gives an explicit congestion indication.",
      "TCP adjusts sending at the endpoints. Its **cwnd**, or congestion window, limits unacknowledged data. The receiver’s window, **rwnd**, also limits it. The smaller window applies.",
      "**Slow start** begins with a small window and roughly doubles it each **RTT**, the time for data and its acknowledgement to travel. At **ssthresh**, the slow-start threshold, **congestion avoidance** adds about one **MSS**, a maximum-sized segment’s data, per RTT.",
      "After a **timeout**, textbook TCP halves the window to set ssthresh, resets cwnd to one MSS, and restarts slow start.",
      "In **TCP Reno**, three duplicate acknowledgements trigger **fast retransmit**. After **fast recovery**, the window is roughly halved and grows linearly. This **AIMD**, additive increase and multiplicative decrease, produces a saw-tooth pattern."
    ],
    "analogy": "Think of a crowded road: too many vehicles create queues. TCP reduces new traffic, then gradually increases it.",
    "example": "Using your exam’s restart-at-2 and threshold-capping convention: windows are 2, 4, 8, 9, 10. A timeout sets ssthresh to 5. Next: 2, 4, 5, 6, 7. The tenth window is **7 MSS**."
  },
  "cn.u4.elements": {
    "summary": "The **transport layer** helps programs on different computers communicate. **Elements of Transport Protocols** are the basic tasks needed to start communication, move data reliably, and finish safely.",
    "points": [
      "**Addressing** identifies the receiving program using a **TSAP** (Transport Service Access Point), usually a **port**. Servers often use **well-known ports**. Port numbers are 16 bits because they identify endpoints within one host. TCP and UDP can use the same port number.",
      "**Connection establishment** starts communication. Delayed or duplicated packets can look like new requests. **Sequence numbers** label data, and a **three-way handshake** exchanges three messages to check that both sides are ready. Sequence numbers must avoid reuse while old packets could survive.",
      "**Connection release** ends communication. **Asymmetric release**, where one side ends everything, can lose data. **Symmetric release** lets each direction close separately. The **two-army problem** shows why unreliable messages cannot guarantee agreement. Practical schemes use acknowledgements and **timers**.",
      "**Error control** uses **checksums** to detect damage, **ACKs** to confirm receipt, and **retransmission** to resend data. **Flow control** uses a **sliding window** to limit outstanding data so the receiver can cope.",
      "**Multiplexing** lets connections share network access. **Demultiplexing** directs incoming data to the correct socket. **Inverse multiplexing** spreads one connection across several network paths.",
      "**Crash recovery** restores communication after failures. Transport alone cannot hide every host crash. Applications may need to help recover."
    ],
    "analogy": "Think of an IP address as an apartment building’s address and a port as a flat number.",
    "example": "A web server can receive TCP traffic on port 80 while a different service uses UDP port 80."
  },
  "cn.u4.flow-control": {
    "summary": "**TCP flow control** stops a fast sender from overwhelming a slow receiver. The receiver tells the sender how much data it can accept, so its temporary storage does not overflow.",
    "points": [
      "The receiver stores incoming bytes in a **buffer**, a temporary waiting area. It advertises its available space as the **receiver window (rwnd)**. As the receiving application reads data, space becomes available again.",
      "This window gives the sender **credit**, meaning permission to send more bytes. An **ACK (acknowledgment)** tells the sender the next byte expected. The advertised window allows that many bytes starting from this position.",
      "**Bytes in flight** are bytes already sent but not yet acknowledged. They use part of the allowed window. The sender must account for them before sending more.",
      "**Flow control** protects the receiver and works between the two endpoints. **Congestion control** protects the network from overload. It uses the sender’s **congestion window (cwnd)** and responds to signs such as loss or delay.",
      "**Available sending allowance = min(rwnd, cwnd) − bytes in flight**. Here, min means the smaller value. If no allowance remains, the sender waits. **Error control** handles damaged or missing data using checksums, ACKs, and retransmission.",
      "**RTT (round-trip time)** is the time for data to travel out and its acknowledgment to return. The window limits the sending rate to roughly **window ÷ RTT**."
    ],
    "analogy": "Think of a small tray. Your friend tells you how many more items fit before you pass them over.",
    "example": "If **rwnd = 4,000 bytes**, **cwnd = 6,000 bytes**, and **1,000 bytes** are in flight, the sender can send **3,000 more bytes**."
  },
  "cn.u4.sockets": {
    "summary": "**Berkeley sockets** are an **API**, a set of functions that programs use to communicate through **TCP** or **UDP**. A **socket** is one endpoint of that communication. An **IP address** identifies a network interface, and a **port** identifies the application endpoint on it.",
    "points": [
      "**socket()** creates an endpoint. **bind()** gives it a local IP address and port. **close()** releases the socket.",
      "For a **TCP server**, the order is **socket() → bind() → listen() → accept() → recv()/send() → close()**. The server is the program waiting for clients.",
      "**listen()** prepares the server to receive connection requests and specifies a queue limit. **accept()** normally waits for a connection, then returns a new socket for that client. The original socket keeps listening.",
      "A **TCP client** uses **socket() → connect() → send()/recv() → close()**. **connect()** starts connection establishment through the **three-way handshake**, an exchange of three setup messages.",
      "**TCP** uses **SOCK_STREAM**. It provides reliable, ordered bytes, but does not preserve separate message boundaries. **send()** sends data; **recv()** receives it.",
      "**UDP** uses **SOCK_DGRAM**. It preserves message boundaries, but messages may be lost or reordered. A server usually uses **socket() → bind() → recvfrom()/sendto()**. No **listen()** or **accept()** is used, and **connect()** is not required. One socket can serve many clients."
    ],
    "analogy": "TCP resembles a phone call: establish contact, then communicate. UDP resembles sending separate postcards.",
    "example": "A TCP echo server listens on port 5000. A client connects and sends “Hi”. The server receives those bytes and sends them back."
  },
  "cn.u4.tcp-connect": {
    "summary": "**TCP connection establishment** prepares two devices to exchange data using a **three-way handshake**: SYN, SYN+ACK, ACK. Each device chooses an **ISN (Initial Sequence Number)**, the starting number used to track its data.",
    "points": [
      "The **client**, which starts the connection, sends **SYN** with sequence number x. SYN means “let us connect and set our starting numbers.”",
      "The **server** replies with **SYN+ACK**, sequence number y, and acknowledgement number x + 1. **ACK** means acknowledgement. Its number tells the other device what sequence number is expected next.",
      "The client sends **ACK**, with sequence number x + 1 and acknowledgement number y + 1. A SYN uses one sequence number, which explains the +1. When the server receives this ACK, both sides are **ESTABLISHED**.",
      "Why three messages? An old, delayed connection request could fool the server. The final ACK confirms the client received the server’s starting number. A client with no matching connection can send **RST (reset)** to reject the unexpected reply.",
      "In **call collision**, both devices send SYN together. TCP still creates one connection, identified by both devices’ IP addresses and port numbers.",
      "During setup, each side advertises its receive capacity and options such as **MSS (Maximum Segment Size)**: the largest TCP data chunk it can receive.",
      "A **SYN flood** sends many SYN requests without completing the handshake, trying to use up the server’s resources."
    ],
    "analogy": "It is like saying: “Ready?” “Yes. Are you?” “Yes.” Both people confirm they heard the other.",
    "example": "If x = 100 and y = 500: SYN has seq = 100; SYN+ACK has seq = 500, ack = 101; final ACK has seq = 101, ack = 501."
  },
  "cn.u4.tcp-header": {
    "summary": "A **TCP segment** is a unit of data sent using TCP. It starts with a **header**, a 20–60 byte block of control information that helps TCP deliver data correctly and in order.",
    "points": [
      "**Source port** and **destination port** are 16 bits each. They identify the sending and receiving applications.",
      "The **sequence number** labels the first data byte in this segment. The **acknowledgement number** tells the other side which byte is expected next. Both fields are 32 bits.",
      "**Header length** is a 4-bit field. It counts groups of four bytes, so a value of 5 means 20 bytes. **Reserved** bits are set aside.",
      "**Flags** are control switches. **SYN** helps start a connection and synchronise sequence numbers. **ACK** makes the acknowledgement field valid. **FIN** means the sender has finished sending. **RST** resets the connection. **PSH** requests prompt delivery to the application. **URG** makes the urgent pointer valid. **ECE/CWR** signal network congestion, meaning too much traffic.",
      "**Window size**, a 16-bit field, advertises how many bytes the receiver can accept. This is **flow control**.",
      "The 16-bit **checksum** detects errors using the header, data and **pseudo-header**: IP addresses, protocol and TCP length. The 16-bit **urgent pointer** marks the end of urgent data relative to the sequence number.",
      "**Options** occupy up to 40 bytes. Examples include **MSS** (Maximum Segment Size), window scaling, timestamps and **SACK** (Selective Acknowledgement)."
    ],
    "analogy": "The header is like a parcel label carrying delivery details and handling instructions.",
    "example": "A segment starting at sequence number 1000 carries 100 data bytes. After receiving them in order, the receiver acknowledges 1100."
  },
  "cn.u4.tcp-intro": {
    "summary": "**TCP (Transmission Control Protocol)** lets two running applications exchange data reliably and in order over **IP**, which may lose or reorder data. TCP handles these problems so applications do not have to.",
    "points": [
      "**Connection-oriented** means TCP sets up a connection before sending application data. It uses a **three-way handshake**: three setup messages exchanged between the two sides.",
      "**Reliable** means TCP numbers each byte, a small unit of data. The receiver sends **acknowledgements (ACKs)** to confirm receipt. Missing data is sent again, including after a **timeout**, when the sender has waited too long.",
      "**Ordered delivery** means TCP puts received data back into the correct order. It also removes duplicates before giving data to the application.",
      "**Full duplex** means both sides can send data at the same time. A **byte stream** has no message boundaries: separate application sends are not necessarily received separately.",
      "**Flow control** protects the receiver from being overwhelmed, using the **receiver window**. **Congestion control** limits traffic to protect the network, using the **congestion window**.",
      "TCP is **point-to-point**: each connection joins two endpoints, with no multicast. Its **4-tuple** identifies them: source IP address, source port, destination IP address, and destination port.",
      "HTTP and HTTPS commonly use TCP. FTP, SMTP, SSH and TELNET also use it. Reliable, ordered delivery matters when transferring files, documents or commands."
    ],
    "analogy": "TCP is like exchanging numbered notebook pages: check arrivals, request missing pages, and arrange them before reading.",
    "example": "A **cumulative ACK 101** means all bytes before byte 101 have arrived. Byte 101 is expected next."
  },
  "cn.u4.tcp-release": {
    "summary": "**TCP Connection Release** means ending a TCP connection, which lets two computers exchange data. Each direction closes separately, so one computer can stop sending while still receiving.",
    "points": [
      "The client sends **FIN**, meaning “I have no more data to send.” The client is the first closer in this example; either side can start.",
      "The server sends **ACK**, an acknowledgement meaning “I received your FIN.” This creates a **half-close**: the client’s sending direction is closed, but the server can still send data.",
      "When the server finishes sending, it sends its own **FIN**. The client replies with **ACK**. This normally takes **four segments**, meaning four TCP messages.",
      "The client then enters **TIME_WAIT** for **2 × MSL**. MSL means maximum segment lifetime: how long a segment may remain in the network. This wait lets old segments expire. If the final ACK was lost, the server can resend its FIN and the client can acknowledge again.",
      "The server can combine its ACK and FIN into **FIN+ACK**, giving a **three-segment release**.",
      "The **two-army problem** explains the difficulty: when messages can disappear, neither side can guarantee that both sides agree. TCP uses acknowledgements, retries, and timers to handle uncertainty.",
      "**RST**, meaning reset, ends the connection abruptly. Pending data may be lost, so normal closing uses FIN."
    ],
    "analogy": "Think of a phone call. You say, “I’m done speaking,” but keep listening until your friend finishes too.",
    "example": "If FIN has sequence number 100, its ACK is 101. A FIN uses one sequence number."
  },
  "cn.u4.tcp-timers": {
    "summary": "**TCP Timer Management** means using timers to handle delays, silence, and connection closing. An **ACK**, or acknowledgement, is a reply confirming that data arrived. Each timer has a different job.",
    "points": [
      "**Retransmission timer (RTO):** If an ACK does not arrive before the **retransmission timeout**, TCP sends the unacknowledged data again. A **segment** is a unit of TCP data.",
      "**Persistence timer:** A **zero window** means the receiver currently has no room for more data. TCP periodically sends a small **probe** to check for space. This prevents endless waiting if a window update gets lost.",
      "**Keepalive timer:** When enabled, it checks whether the other end is still reachable after the connection has been idle.",
      "**TIME_WAIT timer:** After closing its side, TCP waits **2 × MSL**. **MSL**, or maximum segment lifetime, is how long a segment may survive in the network. This lets old segments expire.",
      "**Jacobson’s method:** **RTT** is the time from sending data to receiving its ACK. **SRTT** smooths these measurements, weighting the old estimate by 7/8. **RTTVAR** tracks their variation, weighting its old estimate by 3/4. **RTO = SRTT + 4 × RTTVAR**.",
      "**Karn’s algorithm:** Ignore RTT measurements from retransmitted segments because the ACK could belong to either copy. Double RTO after each timeout. This is **exponential back-off**."
    ],
    "analogy": "Think of sending a parcel and waiting for a delivery receipt. Longer or less predictable delivery times need a longer waiting limit.",
    "example": "If SRTT is 100 ms and RTTVAR is 20 ms, RTO is 180 ms. After a timeout, it doubles to 360 ms."
  },
  "cn.u4.tcp-window": {
    "summary": "**TCP Sliding Window** lets a sender send several bytes without waiting after each send. An **ACK**, or acknowledgement, confirms receipt. This keeps data moving while protecting the receiver’s buffer, its temporary storage.",
    "points": [
      "Bytes fall into four groups: sent and ACKed; sent but awaiting ACKs; allowed to send now; and not allowed to send yet.",
      "The **advertised window (rwnd)** reports the receiver’s free buffer space. The **congestion window (cwnd)** limits sending to avoid overloading the network. The smaller limit controls how much data can remain unacknowledged.",
      "TCP counts window sizes in **bytes, not segments**. A segment is a chunk of TCP data sent together.",
      "**ACKs are cumulative**: they confirm all bytes before the stated number. ACKs move the window’s left edge forward. More advertised space can move its right edge forward.",
      "A **zero window** stops normal data sending. The **persist timer** triggers occasional probes to discover whether space is available again.",
      "**Silly window syndrome** means sending tiny segments that waste bandwidth on headers—the control information attached to data.",
      "**Clark’s solution** delays advertising newly available space until it reaches an **MSS** (maximum data size per segment) or half the receive buffer. **Nagle’s algorithm** holds small writes while earlier data awaits ACKs, unless enough accumulates for a full segment."
    ],
    "analogy": "Imagine sending books to a friend’s small desk. You send more as your friend clears space.",
    "example": "With a 1,000-byte window, send bytes 1–1,000. ACK 501 confirms bytes 1–500. If the window remains 1,000 bytes, you can now send bytes 1,001–1,500."
  },
  "cn.u4.transport-service": {
    "summary": "The **transport layer** delivers data to the right application on a computer. This is **process-to-process delivery**. **IP** provides **host-to-host delivery**: it gets data to the right computer, but transport handles delivery to the application.",
    "points": [
      "A **port** is a **16-bit number** used to identify an application's communication endpoint on a computer. It helps transport decide which application should receive incoming data.",
      "**TCP** provides a **connection-oriented** service: establish a connection, transfer data, then release it. **UDP** provides a **connectionless** service: send data without establishing a connection. UDP does not guarantee delivery or ordering.",
      "**Reliability** includes detecting errors, **retransmission** of missing data, and putting data in order. TCP provides these features. End-to-end reliability is handled at the hosts because applications cannot control the network's routers.",
      "**Flow control** prevents a sender from overwhelming the receiver. **Congestion control** limits sending to avoid overloading the network. TCP provides both.",
      "**Multiplexing** lets many applications share the network layer. **Demultiplexing** directs arriving data to the correct application.",
      "**Transport service primitives** are basic operations: **LISTEN** waits for a connection attempt; **CONNECT** requests a connection; **SEND** sends data; **RECEIVE** waits for data; **DISCONNECT** requests connection release.",
      "A **TPDU** means transport protocol data unit. A TCP unit is called a **segment**. It travels inside a network-layer **packet**, which travels inside a link-layer **frame**."
    ],
    "analogy": "Think of IP as delivering mail to an apartment building. A port helps deliver it to the right apartment.",
    "example": "A browser connects to a web server's port **443** using TCP, exchanges data, and eventually closes the connection."
  },
  "cn.u4.udp": {
    "summary": "**UDP (User Datagram Protocol)** sends separate messages called **datagrams** between applications. It is **connectionless**: there is no handshake, or connection setup, before sending. Its simple design means little overhead, but delivery is not guaranteed.",
    "points": [
      "**IP** delivers packets between computers. UDP adds **port numbers** to identify applications and a **checksum** to detect corruption. Detection does not repair the data.",
      "The **UDP header** is always **8 bytes**. It has four fields, each **16 bits**: source port, destination port, length, and checksum. **Length** counts both header and data.",
      "The **checksum** is optional in IPv4. It checks the UDP header, data, and a **pseudo-header** containing selected IP information. This helps detect errors such as incorrect destination addresses.",
      "UDP provides no **ACKs** (delivery acknowledgements), **retransmission** (resending), or **ordering**. It also has no **flow control** to protect a slow receiver or **congestion control** to reduce network overload.",
      "UDP is **message-oriented**: delivered messages keep their boundaries. TCP is a **byte stream**: it does not preserve individual write boundaries. UDP has less overhead, but is not always faster.",
      "With a 20-byte IPv4 header, maximum UDP data is **65,507 bytes**: 65,535 − 20 − 8. Minimum data is **0 bytes**. Common uses include DNS, DHCP, SNMP, VoIP, games, and **RPC (Remote Procedure Call)**."
    ],
    "analogy": "UDP is like sending postcards without tracking. Each stays separate, but arrival and arrival order are uncertain.",
    "example": "An RPC application sends a request using UDP. If no reply arrives, the application can retry and must handle possible duplicates."
  },
  "cn.u5.delivery": {
    "summary": "**Final delivery** is the last step in receiving email. It brings mail from the receiver’s mail server to their device using **POP3** or **IMAP**. A **mail server** is a computer that stores and handles email.",
    "points": [
      "**SMTP** pushes mail onward; it does not fetch stored mail. Bob’s device may be off and is usually not a server. So his email app, called a **user agent (UA)**, pulls mail when needed.",
      "A **message access agent (MAA)** handles access to stored mail. **POP3**, using **port 110**, offers a simple way to download it. A port is a numbered connection point for a network service.",
      "POP3 commands include **USER/PASS** to log in, **LIST** to list messages, **RETR** to download, **DELE** to mark messages for deletion, and **QUIT** to end the session.",
      "POP3 has three states: **authorisation** checks login details; **transaction** allows message operations; **update** removes messages marked for deletion after a normal QUIT.",
      "In **delete mode**, downloaded mail is removed from the server. In **keep mode**, a copy stays there. POP3 suits one device; several devices are awkward. Deleting server copies saves server storage.",
      "**IMAP**, using **port 143**, keeps mail on the server. You can inspect headers, download message parts, search there, and create, delete, or rename folders. It suits several devices but needs more server storage.",
      "**Webmail** uses **HTTP** between the browser and the server."
    ],
    "analogy": "POP3 is like taking letters home. IMAP is like keeping them in a shared cupboard.",
    "example": "With IMAP, Bob can access the same server folders from his phone and laptop."
  },
  "cn.u5.dns": {
    "summary": "**DNS (Domain Name System)** translates website names into **IP addresses**, the numbered addresses computers use to communicate. People remember names more easily. A name can stay the same even when its server’s IP address changes.",
    "points": [
      "**A records** map names to IPv4 addresses. **AAAA records** map names to IPv6 addresses. These are two versions of IP addresses. **Reverse lookup** finds a name from an IP address using a **PTR record**.",
      "**Host aliasing** gives a host another name using a **CNAME record**. **MX records** identify mail servers for a domain. **Load distribution** lets one name map to several server IP addresses, helping share traffic.",
      "The **domain name space** is a tree of names. **Resource records** store DNS information. **Name servers** hold this information in managed parts called **zones**. A **resolver** is software that asks DNS questions.",
      "DNS uses a hierarchy of name servers. It usually sends messages through **UDP port 53**. It also uses **TCP port 53**, including for large responses and **zone transfers**, which copy zone data between servers.",
      "A **query** asks a question; a **response** returns information. Both share a format: a **header**, **question**, **answer**, **authority**, and **additional** sections. Sections can be empty. The header contains an identification number, control flags, and section counts.",
      "**Dynamic DNS (DDNS)** automatically updates records when addresses change. **DHCP**, a service that assigns IP addresses, or the host itself can make these updates."
    ],
    "analogy": "DNS is like a distributed phone book: different offices maintain different parts.",
    "example": "You enter **www.cbit.ac.in**. Your resolver requests its IP address so your browser can contact the server."
  },
  "cn.u5.dns-namespace": {
    "summary": "The **DNS name space** is the system used to arrange Internet names. Think of it as an upside-down tree. The **root** is at the top, and names branch out below it. This arrangement makes many names easier to manage.",
    "points": [
      "A **label** is the name of one node, or position, in the tree. Each label can have up to 63 characters. The root has an empty label. The tree can have up to 128 levels, including the root.",
      "A **domain name** joins the labels from a node upward to the root. Dots separate the labels.",
      "An **FQDN**, or fully qualified domain name, gives the complete name up to the root. It is written with a final dot.",
      "A **PQDN**, or partially qualified domain name, gives only part of the name. The **resolver**, software that handles DNS requests, can add the missing ending.",
      "A **domain** is a subtree: a node and everything below it. It can contain **subdomains**. This **hierarchical name space** lets different authorities manage different branches. A **flat name space** uses single, unstructured names and needs central coordination to prevent duplicates.",
      "**Top-level domains** include generic names such as com and country names such as in. The **inverse domain**, in-addr.arpa, supports reverse lookups: finding a name from an IPv4 address."
    ],
    "analogy": "Like a postal address, each part places something within a larger area.",
    "example": "In **voyager.fhda.edu.**, read upward: voyager → fhda → edu → root. There are three labels below the root. The final dot represents the root."
  },
  "cn.u5.dns-rr": {
    "summary": "**DNS (Domain Name System)** stores information about domain names, such as their IP addresses. Each database entry is a **Resource Record**, written as a **five-tuple**: (domain name, TTL, class, type, value).",
    "points": [
      "The **domain name** tells us which name the record describes. **Type** tells us what information it holds. **Value** contains that information.",
      "**TTL (Time to Live)** says how long a saved copy can be kept in a **cache**, which is temporary storage. **Class** is usually **IN**, meaning Internet.",
      "**A** stores a computer’s **IPv4 address**, which has 32 bits. **AAAA** stores its **IPv6 address**, which has 128 bits. An IP address identifies a network connection.",
      "**NS (Name Server)** names a DNS server responsible for a domain. **SOA (Start of Authority)** stores settings for a **zone**, a managed part of DNS, including its serial number and refresh timing.",
      "**CNAME (Canonical Name)** connects an alias, or alternative name, to its canonical name. **MX (Mail Exchanger)** names a mail server and its preference number. Lower numbers are preferred.",
      "**PTR (Pointer)** supports **reverse lookup**: finding a domain name from an IP address.",
      "**TXT** stores text. **SRV (Service)** identifies a service’s server and port, along with priority and weight. A port identifies where a service accepts network traffic."
    ],
    "analogy": "DNS is like a college directory. Each resource record gives one detail, such as an address, nickname, or mail destination.",
    "example": "**www.cs.vu.nl.** has a **CNAME** pointing to **star.cs.vu.nl.**, whose **A** record gives **130.37.56.201**. A **TTL** of 86400 allows caching for 24 hours."
  },
  "cn.u5.email-arch": {
    "summary": "**Email** lets people send and receive electronic messages. Mail servers store messages, so the sender and receiver do not need to be online at the same time.",
    "points": [
      "A **User Agent (UA)** is the app used to write and read email. Outlook and Thunderbird are examples. Writing a message is called **composing**.",
      "A **Message Transfer Agent (MTA)** handles sending mail. It uses **SMTP (Simple Mail Transfer Protocol)**. Alice’s app submits her message to her mail server using SMTP.",
      "The outgoing message waits in a **spool**, which is a queue of messages waiting to be sent. Alice’s server then uses SMTP to send it to Bob’s server.",
      "Bob’s server puts the message in his **mailbox**, a storage area for his incoming mail. It can wait there even when Bob’s computer is off.",
      "A **Message Access Agent (MAA)** lets Bob’s app access stored mail using **POP3** or **IMAP**. SMTP **pushes** mail to a server. POP3 and IMAP let the receiving app retrieve or access it.",
      "Email **services** include composing, reading, replying, forwarding, and managing mailboxes. They also include **attachments** (files sent with mail), sending to several recipients, and **mailing lists** (group addresses)."
    ],
    "analogy": "Email is like postal mail: you write a letter, post offices move it, and it waits in the receiver’s letterbox.",
    "example": "Alice emails Bob some notes. Bob is offline. His server keeps the email until he accesses it later."
  },
  "cn.u5.formats": {
    "summary": "An e-mail has two main pieces: an **envelope** for delivery and a **message** containing headers and a body. **MIME** lets the message include different languages, pictures and attachments.",
    "points": [
      "The **envelope** holds the addresses used by mail servers. **SMTP**, the protocol for sending e-mail, supplies these through **MAIL FROM** and **RCPT TO**. They can differ from addresses shown in the message.",
      "**RFC 5322** describes the message format: **header lines**, one **blank line**, then the **body**. Headers describe the message. The body contains its actual content.",
      "Common headers include **From**, **To**, **Cc**, **Bcc**, **Date** and **Subject**. **Sender** identifies who sent it; **Reply-To** gives the reply address. **Message-ID** identifies the message, and **Received** records its delivery path.",
      "**MIME** means **Multipurpose Internet Mail Extensions**. Original SMTP supported only **7-bit ASCII**, a limited text character set. MIME describes other content and provides encodings for carrying it.",
      "**MIME-Version** is normally **1.0**. **Content-Type** identifies the content, such as **text/plain**, **image/jpeg** or **application/pdf**. **multipart/mixed** groups separate parts, such as text and attachments.",
      "**Content-Transfer-Encoding** tells how content is represented for transfer. **Base64** represents three bytes as four ASCII characters. **Quoted-printable** suits mostly ASCII text.",
      "**Content-ID** identifies an individual part. **Content-Description** gives a readable description of that part."
    ],
    "analogy": "Think of a posted letter: the envelope guides delivery, the letter’s opening details resemble headers, and its main writing is the body.",
    "example": "Alice sends Bob text and a photo. **multipart/mixed** groups them; the photo part uses **image/jpeg** and **base64** encoding."
  },
  "cn.u5.ftp": {
    "summary": "**FTP (File Transfer Protocol)** copies files between computers using **TCP**, which delivers data reliably. It uses separate connections for instructions and file contents.",
    "points": [
      "The **client** requests transfers; the **server** provides them. The client has a user interface, a control process for instructions, and a data transfer process. The server has the last two.",
      "The **control connection** uses server **port 21**, a numbered network endpoint. It stays open throughout the session. Commands and replies use **ASCII**, a character encoding.",
      "A **data connection** opens for each file transfer or directory listing, then closes. In **active mode**, the server connects back from **port 20**. In **passive mode (PASV)**, the client connects to a server-selected port. This usually works better through firewalls, which filter network traffic.",
      "**USER/PASS** log in; **LIST** lists files; **RETR** downloads; **STOR** uploads; **CWD/PWD** change/show the directory; **DELE** deletes; **QUIT** logs out.",
      "**TYPE A/I** selects text/binary. File types include **ASCII**, **EBCDIC** (another character encoding), and **image** (binary). Structures are **file**, **record**, or **page**. Transmission modes are **stream** (default byte flow), **block** (chunks with headers), and **compressed** (shortened repeated data).",
      "**Anonymous FTP** allows public login as “anonymous”. Plain FTP sends passwords and data without encryption. Public writable directories can be misused to store harmful or illegal files.",
      "**FTP** remembers session details such as the current directory. **HTTP** is stateless: each request stands independently. **HTTPS** adds encryption. **SFTP** transfers files securely over **SSH**, using port **22**."
    ],
    "analogy": "FTP resembles a shop with one counter for instructions and another for handing over goods.",
    "example": "**RETR notes.pdf** requests a download; the file travels through the data connection."
  },
  "cn.u5.name-servers": {
    "summary": "**Name servers** store or help find information in **DNS (Domain Name System)**. DNS helps turn a website name into an **IP address**, the address computers use to reach it.",
    "points": [
      "**Root servers** point to **TLD servers**. There are 13 named root server sets, with copies worldwide. A **TLD (top-level domain)** is an ending such as .com or .in.",
      "**TLD servers** point to a domain’s **authoritative servers**. Authoritative servers hold the actual DNS records for a **zone**, the part of the DNS name tree they manage.",
      "The **primary server** loads zone records from a file. **Secondary servers** copy those records using **zone transfers**, which transfer zone data between servers.",
      "In a **recursive query**, the asker requests a final answer. Your computer usually asks a **local recursive name server**, often provided by your ISP or campus, to find it.",
      "In an **iterative query**, a server can return a **referral**, meaning “ask this server next.” The local server normally follows referrals from root to TLD to authoritative servers.",
      "**Caching** means keeping answers temporarily. **TTL (Time to Live)** says how long an answer may be kept. A usable cached answer avoids repeating the full search."
    ],
    "analogy": "Think of finding a college office: the main desk directs you to a department, and the department directs you to the person with the answer.",
    "example": "For www.example.com, if nothing useful is cached, your local server asks a root server, a .com server, then the authoritative server. It returns the IP address to your computer."
  },
  "cn.u5.snmp": {
    "summary": "**SNMP (Simple Network Management Protocol)** helps an administrator check and control network devices, such as routers, switches and servers. It can read device information, change allowed settings and report problems.",
    "points": [
      "The **Manager** is the monitoring computer’s software. An **Agent** is software on each managed device. The manager asks questions, and the agent replies.",
      "The **MIB (Management Information Base)** is a collection of managed objects, such as traffic counters. Each object has an **OID (Object Identifier)**, its unique name in a tree.",
      "**SMI (Structure of Management Information)** defines rules for object names and data types. **BER (Basic Encoding Rules)** specifies how the data is encoded for transmission.",
      "**GetRequest** reads a value. **GetNextRequest** reads the next object. **GetBulkRequest** retrieves many values. **SetRequest** changes a writable value. A **Response** carries the answer.",
      "A **Trap** is an alert sent without being asked; it needs no acknowledgement. An **InformRequest** is a notification that requires acknowledgement. Agents or managers can send informs to managers.",
      "SNMP uses **UDP**, which does not guarantee delivery. Agents receive requests on port **161**. Managers receive notifications on port **162**. Repeated checking, called **polling**, adds network traffic.",
      "**Fault management** means detecting, locating, handling and recording problems. Responding to alerts is **reactive**; watching trends is **proactive**. **SNMPv1/v2c** expose their password-like **community strings** in clear text. **SNMPv3** supports authentication and encryption."
    ],
    "analogy": "Think of a manager checking equipment through caretakers. Each caretaker is an agent with a register of information.",
    "example": "A switch sends a **Trap** when a network link goes down."
  },
  "cn.u5.telnet": {
    "summary": "**TELNET** lets you log in to another computer over a network and use its command line. It uses **TCP**, which delivers data reliably and in order, on **port 23**.",
    "points": [
      "In **local login**, your typing goes to your own **operating system (OS)**. In **remote login**, the **TELNET client** sends it to the remote **TELNET server**. A **pseudo-terminal**, software acting like a terminal, passes it to the remote OS.",
      "**NVT (Network Virtual Terminal)** provides a shared character format and rules. The client converts your computer’s characters into NVT format. The server converts them into the remote computer’s format.",
      "TELNET commands begin with **IAC (Interpret As Command)**, byte **255**. Commands can request actions such as interrupting a running program or erasing a character.",
      "**Option negotiation** means agreeing on features. **WILL/WON’T** mean “I will/won’t enable this option.” **DO/DON’T** mean “Please enable/don’t enable it.” **Echo**, which displays typed characters, is one example.",
      "In **default mode**, input is collected locally and sent line by line. **Character mode** sends characters individually. Negotiated **line mode** allows local line editing before sending completed lines.",
      "TELNET sends data, including passwords, in **plain text**, without encryption. **SSH**, using **port 22**, provides encrypted remote login and has largely replaced TELNET."
    ],
    "analogy": "NVT is like a shared language that two people translate into and out of to understand each other.",
    "example": "You type a command to list files. The remote computer runs it, and TELNET brings the result to your screen."
  },
  "cn.u5.transfer": {
    "summary": "**SMTP (Simple Mail Transfer Protocol)** carries outgoing email from your mail app to a mail server, then between mail servers. It is a **push protocol**: the sender starts the transfer.",
    "points": [
      "Your mail app is the **User Agent (UA)**. A **Mail Transfer Agent (MTA)** transfers mail between servers. SMTP uses **TCP**, which delivers data reliably. Server-to-server transfer uses port **25**; submission commonly uses **587**.",
      "During **connection establishment**, the server replies **220** (ready). The client introduces itself using **HELO** or **EHLO**.",
      "During **mail transfer**, **MAIL FROM** gives the envelope sender, and **RCPT TO** gives one recipient per command. The envelope contains delivery details. **250** means OK; **550** means mailbox unavailable.",
      "**DATA** asks to send the message. **354** means start sending. A line containing only a dot ends the message; **250** confirms acceptance. During **connection termination**, **QUIT** gets **221** (closing).",
      "An address has the form **local-part@domain-name**. The sending MTA checks the domain’s **MX record** in **DNS**, the system that looks up internet names. This record identifies its receiving mail server.",
      "Basic SMTP uses **7-bit ASCII** text. **MIME** lets email carry attachments and other content through suitable formatting and encoding. SMTP sends message parts together. **HTTP** typically pulls requested resources, supports binary data, and uses ports **80/443**. **RSET** resets, **VRFY** checks a user, and **NOOP** does nothing."
    ],
    "analogy": "SMTP is like postal delivery: sorting offices pass your letter toward the recipient.",
    "example": "For **rita@college.edu**, the sender checks college.edu’s MX record, then sends the email to that server."
  },
  "cn.u5.user-agent": {
    "summary": "A **User Agent (UA)** is the e-mail program you use to manage messages. It lets you write and read mail, while communicating with **mail servers**, the computers that send or store your mail.",
    "points": [
      "**Composing** means writing a message. The UA provides an editor for typing, an address book for choosing people, and an option to add **attachments**, such as photos or documents.",
      "**Reading** means opening received messages. The inbox usually shows the sender, subject and **flags**, which indicate things such as whether a message has been read.",
      "**Replying** sends an answer back. **Forwarding** passes a received message to someone else.",
      "**Handling mailboxes** means organising your mail. You can use folders, search for messages, delete them and apply **filters**, which are rules for sorting mail.",
      "**Command-driven** programs, such as Unix mail, accept typed commands. **GUI-based** programs, such as Outlook and Thunderbird, use windows, buttons and menus. **Webmail**, such as Gmail, provides the mail interface in a browser using **HTTP**, usually secured as HTTPS.",
      "**TCP** provides reliable data delivery. E-mail also needs rules called **protocols**: **SMTP** sends mail, while **POP3** or **IMAP** accesses received mail. These exchange commands and replies over TCP. Each command does not need a new connection."
    ],
    "analogy": "Think of the UA as your personal mail assistant. You tell it what to write, send, open or file.",
    "example": "You open Thunderbird, write to your teacher, attach an assignment and click Send. Thunderbird is your **User Agent**."
  }
}
