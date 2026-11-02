import { Q, Predict } from '../pyq-helpers.js'

// Every in-scope question from the CN unit-wise bank (pages 7–14) and the Nov '25 / Dec '24 papers.
// Routing questions on Mid-1 topics (design issues, Dijkstra, flooding, distance vector) are left out.
export default [
  // ---------------- Unit III: routing ----------------
  Q('cn-link-state', 'cn.u3.link-state', 'Explain link state routing (algorithm) with an example. Discuss the steps involved in the link state routing algorithm.', ['cn-dec23cet:5', 'cn-dec23it:5', 'cn-dec22it:5', 'cn-dec22ece:5', 'cn-dec21ece:5']),
  Q('cn-dv-vs-ls', 'cn.u3.link-state', 'State the major differences between distance vector and link state routing, with examples.', ['cn-nov25:5', 'cn-may25:5']),
  Q('cn-ospf', 'cn.u3.ospf', 'What is the basis of classification for the four types of links defined by OSPF? Why do OSPF messages propagate faster than RIP messages?', ['cn-dec22iot:4']),
  Q('cn-bgp', 'cn.u3.bgp', 'What is the use of BGP?', ['cn-jun22:2']),
  Q('cn-intra-inter', 'cn.u3.bgp', 'Distinguish between intra-AS and inter-AS routing.', ['cn-dec21it:5']),

  // ---------------- Unit III: QoS ----------------
  Q('cn-traffic-shaping', 'cn.u3.qos', 'Explain the leaky bucket and token bucket algorithms. What is traffic shaping? Explain two methods to shape traffic.', ['cn-dec23cet:4', 'cn-may25:5']),
  Q('cn-leaky-qos', 'cn.u3.qos', 'How does the leaky bucket algorithm improve Quality of Service?', ['cn-dec22it:3']),
  Q('cn-qos', 'cn.u3.qos', 'Define QoS. Elaborate the characteristics of QoS.', ['cn-jun22:5']),
  Q('cn-qos-notes', 'cn.u3.qos', 'Write short notes on the data-flow characteristics: (i) reliability (ii) jitter (iii) bandwidth.', ['cn-jun22:6']),
  Q('cn-avg-peak', 'cn.u3.qos', 'Examine the relationship between average data rate and peak data rate, and its impact on performance and bandwidth allocation.', ['cn-may25:5']),
  Q('cn-rsvp', 'cn.u3.qos', 'How is the Resource Reservation Protocol (RSVP) related to Integrated Services? Explain with an example.', ['cn-dec22iot:4']),
  Q('cn-num-token', 'cn.u3.qos', 'A token bucket gets a new token every 5 µs; each token lets one 48-byte packet through. What is the maximum sustainable data rate?', ['cn-jun23:5'], { numerical: true }),
  Q('cn-num-leaky', 'cn.u3.qos', 'A leaky bucket outputs 5 gallons/min. Input is a burst of 100 gallons/min for 12 s, then nothing for 48 s. How many gallons are left (trace the output)?', ['cn-jun24:9'], { numerical: true }),

  // ---------------- Unit III: IPv4 ----------------
  Q('cn-ipv4-header', 'cn.u3.ipv4', 'Draw the header format of IPv4 and explain its fields. What are the key fields in an IP datagram?', ['cn-dec21it:5', 'cn-dec22ece:2']),
  Q('cn-ipv4-options', 'cn.u3.ipv4', 'Explain the need for options in IPv4 and list the options with a brief description.', ['cn-jun23:5']),
  Q('cn-ip-checksum', 'cn.u3.ipv4', 'Explain the procedure for checksum calculation and verification in IPv4. What part of the packet is covered by the checksum, and why? Are options included?', ['cn-jun24:5']),
  Q('cn-fragmentation', 'cn.u3.ipv4', 'Elaborate the concept of packet fragmentation.', ['cn-dec22it:4']),
  Q('cn-num-fragments', 'cn.u3.ipv4', 'A 1000-byte datagram (20-byte header) crosses a link with MTU 100 bytes. How many fragments are made?', ['cn-dec23it:5'], { numerical: true }),

  // ---------------- Unit III: IP addresses ----------------
  Q('cn-nat', 'cn.u3.ip-addresses', 'What is NAT? Describe its purpose, how it helps with address depletion, and situations where NAT is essential.', ['cn-dec24:2', 'cn-jun24:5', 'cn-may25:5']),
  Q('cn-addr-format', 'cn.u3.ip-addresses', 'How many bits are in an IPv4 address and an IPv6 address? Explain the format, bit representation and address space of each.', ['cn-dec22iot:3', 'cn-dec23cse:4']),
  Q('cn-classful', 'cn.u3.ip-addresses', 'Explain the difference between classful and classless addressing in IPv4.', ['cn-dec22cse:3']),
  Q('cn-subnetting', 'cn.u3.ip-addresses', 'Explain subnetting and supernetting. How do subnet and supernet masks differ from the default mask in classful addressing?', ['cn-dec22iot:5', 'cn-jun23:4']),
  Q('cn-ip-vs-ethernet', 'cn.u3.ip-addresses', 'IP addresses are tied to specific networks, but Ethernet addresses are not. Why?', ['cn-jun23:3']),
  Q('cn-num-cidr28', 'cn.u3.ip-addresses', 'One address of a block is 205.16.37.39/28. Find the first address, last address and number of addresses.', ['cn-nov25:5'], { numerical: true }),
  Q('cn-num-same-net', 'cn.u3.ip-addresses', 'C1 = 203.197.2.53 with mask 255.255.128.0 and C2 = 203.197.75.201 with mask 255.255.192.0. Are they on the same network?', ['cn-dec22it:5'], { numerical: true }),
  Q('cn-num-classes', 'cn.u3.ip-addresses', 'Find the class of 208.34.54.12, 238.34.2.1, 114.34.2.8 and 129.14.6.8.', ['cn-jun24:4'], { numerical: true }),
  Q('cn-num-binary', 'cn.u3.ip-addresses', 'Convert to dotted decimal: 10000001 00001011 00001011 11101111 and 11000001 10000011 00011011 11111111.', ['cn-dec23it:4'], { numerical: true }),

  // ---------------- Unit III: IPv6 ----------------
  Q('cn-ipv6-why', 'cn.u3.ipv6', 'How does IPv6 solve the address exhaustion faced by IPv4? Why is IPv6 preferred, and how do IPv4 and IPv6 compare in scalability?', ['cn-dec24:5', 'cn-jun22:3', 'cn-jun24:3', 'cn-may25:5']),
  Q('cn-ipv6-transition', 'cn.u3.ipv6', 'Why is the IPv4-to-IPv6 transition required? List three transition strategies; how do tunnelling and dual stack differ, and when is each used?', ['cn-dec23it:4', 'cn-dec22iot:4']),
  Q('cn-ipv6-header', 'cn.u3.ipv6', 'Explain the IPv6 datagram with a neat diagram: its message format and fixed header.', ['cn-dec22ece:5', 'cn-dec22cse:5']),
  Q('cn-ipv4-vs-ipv6', 'cn.u3.ipv6', 'Distinguish between IPv4 and IPv6.', ['cn-jun22:5']),

  // ---------------- Unit IV: transport service & elements ----------------
  Q('cn-elements', 'cn.u4.elements', 'What are the essential elements of a transport protocol? Explain the elements of the transport layer.', ['cn-dec24:5', 'cn-dec22ece:5']),
  Q('cn-transport-functions', 'cn.u4.transport-service', 'List the functions of the transport layer and discuss its purpose in a network.', ['cn-dec23it:4']),
  Q('cn-transport-service', 'cn.u4.transport-service', 'What is process-to-process communication? What are the design issues of the transport layer?', ['cn-jun23:5']),
  Q('cn-mux', 'cn.u4.elements', 'Explain transport-layer multiplexing and demultiplexing.', ['cn-dec23it:5', 'cn-dec21it:5', 'cn-dec22it:5']),
  Q('cn-ports', 'cn.u4.elements', 'Do port addresses need to be unique? Why or why not? Why are port addresses shorter than IP addresses?', ['cn-dec22iot:5', 'cn-jun23:5', 'cn-may25:5']),
  Q('cn-primitives', 'cn.u4.transport-service', 'Explain the transport service primitives (LISTEN, CONNECT, SEND, RECEIVE, DISCONNECT).', ['cn-dec22ece:5', 'cn-dec21ece:5']),
  Q('cn-three-events', 'cn.u4.transport-service', 'The transport layer creates a connection between source and destination. What are the three events involved?', ['cn-jun22:2']),
  Q('cn-crash', 'cn.u4.elements', 'Illustrate the concept of crash recovery in the transport layer.', ['cn-dec22it:4']),
  Q('cn-qos-primitives', 'cn.u4.transport-service', 'Describe the QoS parameters/primitives of the transport layer.', ['cn-dec22iot:5']),

  // ---------------- Unit IV: sockets ----------------
  Q('cn-sockets', 'cn.u4.sockets', 'Explain Berkeley sockets: the socket API. How do TCP and UDP sockets differ?', ['cn-dec23it:5', 'cn-nov25:5']),
  Q('cn-udp-socket', 'cn.u4.sockets', 'Explain socket programming with UDP with a neat diagram.', ['cn-dec22ece:5']),
  Q('cn-tcp-socket', 'cn.u4.sockets', 'Illustrate socket programming with TCP.', ['cn-dec21ece:5']),

  // ---------------- Unit IV: UDP ----------------
  Q('cn-udp-header', 'cn.u4.udp', 'Draw the UDP header and explain all the fields. Discuss UDP characteristics.', ['cn-dec24:5', 'cn-dec23it:4']),
  Q('cn-udp-adds', 'cn.u4.udp', 'What does UDP provide that is not provided by IP? Are UDP and IP unreliable to the same degree? Justify.', ['cn-dec22ece:2', 'cn-dec21ece:2', 'cn-may25:5']),
  Q('cn-udp-size', 'cn.u4.udp', 'What are the maximum and minimum sizes of process data that can be encapsulated in a UDP datagram?', ['cn-dec22cse:2', 'cn-may25:3']),
  Q('cn-msg-vs-byte', 'cn.u4.udp', 'UDP is message-oriented and TCP is byte-oriented. If an application must protect message boundaries, which should it use?', ['cn-dec22iot:4', 'cn-jun23:5']),
  Q('cn-rpc', 'cn.u4.udp', 'When would a client prefer RPC over UDP, and when RPC over TCP?', ['cn-jun23:4']),

  // ---------------- Unit IV: TCP vs UDP ----------------
  Q('cn-tcp-vs-udp', 'cn.u4.udp', 'Compare and contrast the TCP and UDP protocols.', ['cn-dec24:5', 'cn-dec23cet:5', 'cn-jun22:2']),
  Q('cn-conn-vs-connless', 'cn.u4.transport-service', 'Differentiate connectionless and connection-oriented protocols. Which is more efficient and why?', ['cn-jun24:3']),
  Q('cn-tcp-udp-header', 'cn.u4.tcp-header', 'Compare the TCP header and the UDP header. List the fields in TCP that are missing from UDP and give reasons.', ['cn-dec23cse:5', 'cn-dec22cse:4', 'cn-dec21it:5']),
  Q('cn-why-tcp-apps', 'cn.u4.tcp-intro', 'Why do HTTP, FTP, SMTP and POP3 run on top of TCP rather than UDP?', ['cn-dec21it:2']),
  Q('cn-fast-transaction', 'cn.u4.udp', 'For the fastest possible remote transaction, would you use UDP or TCP? Why?', ['cn-dec21it:2']),

  // ---------------- Unit IV: TCP ----------------
  Q('cn-tcp-header', 'cn.u4.tcp-header', 'Draw the TCP segment header and explain each field.', ['cn-nov25:5', 'cn-dec23cet:5', 'cn-dec22it:5', 'cn-dec22ece:5', 'cn-jun22:4']),
  Q('cn-tcp-features', 'cn.u4.tcp-intro', 'Explain the features of TCP and its role in providing a robust, stable communication framework.', ['cn-dec23it:5', 'cn-jun24:4']),
  Q('cn-tcp-order', 'cn.u4.tcp-intro', 'IP fragmentation is invisible to TCP. Does TCP still have to worry about out-of-order data? Explain.', ['cn-dec22cse:4']),
  Q('cn-tcp-corrupt', 'cn.u4.tcp-intro', 'A datagram carrying a TCP segment destined for 130.14.16.17/16 arrives at 130.14.16.19/16 (the destination port was corrupted). How does the receiving TCP react?', ['cn-jun24:9']),
  Q('cn-tcp-conn', 'cn.u4.tcp-connect', 'Explain TCP connection management: connection establishment (three-way handshake) and release, with a suitable diagram.', ['cn-dec24:5', 'cn-dec23it:5', 'cn-nov25:5', 'cn-dec23cet:5', 'cn-dec23cse:5', 'cn-jun24:5']),
  Q('cn-3way-reliable', 'cn.u4.tcp-connect', 'How does the three-way handshake ensure the reliability of TCP?', ['cn-dec22it:5']),
  Q('cn-call-collision', 'cn.u4.tcp-connect', 'Explain TCP connection establishment in the normal case and in the call-collision case.', ['cn-jun24:5']),
  Q('cn-two-way', 'cn.u4.tcp-connect', 'Explain the two-way and three-way handshake mechanisms. If a two-way handshake were used instead of a three-way one, would deadlocks be possible? Give an example or show none exist.', ['cn-dec22ece:5', 'cn-jun23:5', 'cn-dec22cse:4']),
  Q('cn-tcp-release-steps', 'cn.u4.tcp-release', 'Explain the various steps involved in releasing a TCP connection.', ['cn-dec22it:5']),
  Q('cn-four-way', 'cn.u4.tcp-release', 'What is four-way handshaking? In which protocol is it used?', ['cn-dec23cse:3']),
  Q('cn-tcp-states', 'cn.u4.tcp-release', 'Draw the TCP connection-management finite state diagram and explain it.', ['cn-dec21ece:5']),
  Q('cn-n-army', 'cn.u4.tcp-release', 'Generalised n-army problem: if any two blue armies agreeing to attack is sufficient for victory, does a protocol exist that allows blue to win?', ['cn-dec22iot:5']),
  Q('cn-sliding-window', 'cn.u4.tcp-window', 'Explain the sliding window / window management in TCP.', ['cn-dec22it:4', 'cn-jun24:4']),
  Q('cn-flow-control', 'cn.u4.flow-control', 'Briefly describe the credit scheme used by TCP for flow control.', ['cn-dec21ece:2']),
  Q('cn-timers', 'cn.u4.tcp-timers', 'Explain TCP timer management. List and briefly explain the timers used by TCP.', ['cn-dec23it:4', 'cn-jun22:4']),

  // ---------------- Unit IV: congestion ----------------
  Q('cn-congestion', 'cn.u4.congestion', 'What is congestion and how does it occur? Explain the approaches to congestion control.', ['cn-nov25:5', 'cn-dec23it:3', 'cn-dec22iot:5', 'cn-dec21it:5']),
  Q('cn-cc-principles', 'cn.u4.congestion', 'Analyse the general principles of congestion control.', ['cn-dec23cet:4']),
  Q('cn-tcp-congestion', 'cn.u4.congestion', 'Explain the transport-layer mechanism for controlling congestion. How is TCP used to deal with congestion (slow start, AIMD)?', ['cn-dec22it:5', 'cn-dec22ece:5', 'cn-dec21ece:5']),
  Q('cn-flow-error-cong', 'cn.u4.congestion', 'Compare flow control, error control and congestion control.', ['cn-dec22it:4']),
  Q('cn-open-closed', 'cn.u4.congestion', 'Differentiate open-loop and closed-loop congestion control. What policies prevent congestion?', ['cn-dec22cse:4']),
  Q('cn-cc-layer', 'cn.u4.congestion', 'What are the advantages and disadvantages of congestion control at the transport layer rather than the network layer?', ['cn-dec21ece:5']),
  Q('cn-num-aimd', 'cn.u4.congestion', 'TCP AIMD: slow start with initial window 2 MSS and threshold 8 MSS. A timeout occurs in the 5th transmission. What is the congestion window at the end of the 10th transmission?', ['cn-dec22it:5'], { numerical: true }),

  // ---------------- Unit V: DNS ----------------
  Q('cn-dns-rr', 'cn.u5.dns-rr', 'What is a domain resource record in DNS? Write a short note on domain resource records.', ['cn-dec24:4', 'cn-dec23it:2']),
  Q('cn-dns-components', 'cn.u5.dns', 'What are the three main components of DNS? Examine the role each plays in DNS working.', ['cn-dec24:5', 'cn-jun22:5']),
  Q('cn-dns-services', 'cn.u5.dns', 'Explain the Domain Name System in detail and the services it provides.', ['cn-dec23cet:5', 'cn-dec22it:5', 'cn-dec22ece:5', 'cn-dec21ece:5', 'cn-dec21it:5']),
  Q('cn-dns-why', 'cn.u5.dns', 'Why do we need a DNS system when we can directly use an IP address?', ['cn-may25:5']),
  Q('cn-hier-flat', 'cn.u5.dns-namespace', 'What is the advantage of a hierarchical name space over a flat name space for the Internet?', ['cn-dec22iot:3']),
  Q('cn-fqdn', 'cn.u5.dns-namespace', 'What are FQDN and PQDN? Give an example of each.', ['cn-nov25:2']),
  Q('cn-dns-labels', 'cn.u5.dns-namespace', 'For voyager.fhda.edu, how many labels and how many levels of hierarchy are there?', ['cn-jun23']),
  Q('cn-dns-resolution', 'cn.u5.name-servers', 'Compare iterative and recursive DNS resolution with examples.', ['cn-nov25:5', 'cn-jun23:3']),
  Q('cn-dns-messages', 'cn.u5.dns', 'What are the two main categories of DNS messages? Explain with an example.', ['cn-dec22iot:5', 'cn-jun23:5', 'cn-dec22cse:5']),
  Q('cn-ddns', 'cn.u5.dns', 'Why was there a need for Dynamic DNS (DDNS)?', ['cn-may25:2', 'cn-dec22iot:2']),

  // ---------------- Unit V: e-mail ----------------
  Q('cn-email', 'cn.u5.email-arch', 'Illustrate the architecture of e-mail and explain its major components and working.', ['cn-dec24:5', 'cn-nov25:5', 'cn-dec23cet:7', 'cn-dec21ece:5']),
  Q('cn-ua-mta', 'cn.u5.email-arch', 'Describe the architectural layout of e-mail and the functionality of the User Agent (UA) and the Message Transfer Agent (MTA).', ['cn-dec23cse:4']),
  Q('cn-ua', 'cn.u5.user-agent', 'In electronic mail, explain the tasks of a user agent.', ['cn-dec22cse:3']),
  Q('cn-get-mail', 'cn.u5.delivery', 'How does the user get e-mail from the message transfer agent?', ['cn-dec22it:4']),
  Q('cn-mail-conn', 'cn.u5.transfer', 'Why is connection establishment for mail transfer needed if TCP has already established a connection?', ['cn-dec22cse:4']),
  Q('cn-smtp', 'cn.u5.transfer', 'Describe how SMTP is used in e-mail applications.', ['cn-dec23it:5']),
  Q('cn-smtp-http', 'cn.u5.transfer', 'Illustrate the basic operation of SMTP and compare it with HTTP.', ['cn-dec21ece:5']),
  Q('cn-smtp-addr', 'cn.u5.transfer', 'Describe the addressing system used by SMTP. Why do we need POP3 or IMAP4?', ['cn-jun23:4', 'cn-jun24:3']),
  Q('cn-pop-imap', 'cn.u5.delivery', 'Differentiate IMAP and POP3 with a real-time example.', ['cn-dec23cse:3']),
  Q('cn-mime', 'cn.u5.formats', 'Write short notes on IMAP and MIME with an example.', ['cn-nov25:5']),

  // ---------------- Unit V: FTP, SNMP ----------------
  Q('cn-ftp', 'cn.u5.ftp', 'Write a brief note on FTP.', ['cn-jun22:5']),
  Q('cn-ftp-http', 'cn.u5.ftp', 'What is the need for FTP? Compare FTP and HTTP by functionality and data transfer, with scenarios for each.', ['cn-dec22ece:5', 'cn-may25:5']),
  Q('cn-ftp-commands', 'cn.u5.ftp', 'List the FTP commands.', ['cn-dec22ece:2']),
  Q('cn-ftp-modes', 'cn.u5.ftp', 'What are the three FTP transmission modes? How does storing a file differ from retrieving one?', ['cn-dec22iot:4']),
  Q('cn-sftp', 'cn.u5.ftp', 'Differentiate FTP and SFTP.', ['cn-dec23cse:3']),
  Q('cn-anon-ftp', 'cn.u5.ftp', 'Evaluate the limitations of anonymous FTP access: its risks and how it may be exploited.', ['cn-may25:5']),
  Q('cn-snmp-arch', 'cn.u5.snmp', 'With a neat diagram, explain the architecture of SNMP.', ['cn-jun22:5']),
  Q('cn-snmp', 'cn.u5.snmp', 'Explain the working principle of SNMP and its related issues.', ['cn-dec23cse:6']),
  Q('cn-fault', 'cn.u5.snmp', 'Define fault management and its purpose. Explain its two sub-functions.', ['cn-jun23:4']),
  Q('cn-app-protocols', 'cn.u5.dns', 'List the application-layer protocols.', ['cn-dec23it:3']),
  Predict('cn-pred-telnet', 'cn.u5.telnet', 'Explain TELNET: remote login, the network virtual terminal (NVT) and how it works.'),
  Predict('cn-pred-email-format', 'cn.u5.formats', 'Explain the RFC 5322 e-mail message format (header fields and body).'),
]
