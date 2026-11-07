// CN lab external guide. Programs in ./cn, real terminal transcripts in ./cn-out,
// screenshots (from the lab record) in public/lab/cn.
const CODE = import.meta.glob('./cn/*', { query: '?raw', import: 'default', eager: true })
const OUT = import.meta.glob('./cn-out/*.txt', { query: '?raw', import: 'default', eager: true })

const code = (file) => ({ file, code: CODE[`./cn/${file}`] })
const out = (name, title = 'Expected output') => ({ terminal: OUT[`./cn-out/${name}.txt`], title })
const shot = (name, caption) => ({ shot: `cn/${name}`, caption })
const ios = (title, text) => ({ terminal: text, title })

export default {
  label: 'Experiment',
  intro: [
    'For every experiment: **what to do, step by step, if it is the one you get**, the commands or code, and **what the output should look like**. The screenshots are from your own lab record, so they are exactly what the examiner expects to see.',
    { tip: [
      'Packet Tracer experiments are marked on three things: the topology is built correctly, every device has the right IP address and gateway, and the **ping / PDU test succeeds**. Always finish with a successful ping and show it.',
      { ul: [
        'Router CLI: click the router → **CLI** tab → press Enter → type `no` for the initial configuration dialog.',
        'PC IP address: click the PC → **Desktop** → **IP Configuration**. Ping: **Desktop** → **Command Prompt**.',
        'Quick test without typing: the closed-envelope icon (**Add Simple PDU**) → click source PC → click destination PC → the list at the bottom right shows **Successful** or **Failed**.',
        'The first ping across routers often loses 1 of 4 packets: that is ARP finding MAC addresses, not an error.',
      ] },
    ] },
  ],
  experiments: [
    {
      id: 'commands', num: 1, short: 'Network commands', title: 'Basic network commands',
      aim: 'Study ping, ifconfig/ipconfig, traceroute, nslookup, netstat, arp, rarp, net, hostname and uname.',
      blocks: [
        { h: 'If this is asked' },
        { steps: [
          'Open a terminal (Ubuntu: Ctrl+Alt+T). Install the old tools if `ifconfig` is missing: `sudo apt install net-tools traceroute`.',
          'Run each command below, one at a time. For each: write the **syntax**, a one-line **description**, show the **output**, and say what the output proves (the "justification").',
          'Use `-c 4` with ping so it stops on its own (or press Ctrl+C).',
        ] },
        { table: { head: ['Command', 'Try this', 'What the output tells you'], rows: [
          ['`ifconfig` (Windows: `ipconfig`)', '`ifconfig`', 'Your interface (e.g. `enp1s0`) is **UP, RUNNING**, its IPv4 `inet`, MAC `ether`, MTU, packets sent/received'],
          ['`ping`', '`ping -c 4 google.com`', '`64 bytes from … time=15.6 ms`, then `0% packet loss` → the host is reachable'],
          ['`traceroute`', '`traceroute google.com`', 'One line per router (hop) on the way, with 3 round-trip times; `* * *` = that router did not reply'],
          ['`nslookup`', '`nslookup google.com`', 'The DNS server used, then `Name:` / `Address:` lines (IPv4 and IPv6)'],
          ['`netstat`', '`netstat -r`, `netstat -i`, `netstat -s`', 'Connections and listening ports; `-r` routing table, `-i` interface stats, `-s` per-protocol stats'],
          ['`arp`', '`arp -a`', 'IP address → MAC address table of devices on your LAN'],
          ['`rarp`', '`rarp -a`', 'MAC → IP table. Obsolete (replaced by DHCP), usually prints that it is not supported'],
          ['`net`', '`net` (Linux, Samba) or `net user` (Windows)', 'Without a sub-command it prints the list of options: that proves the tool is installed'],
          ['`hostname`', '`hostname`, `hostname -I`', 'The machine\'s name; `-I` lists all its IP addresses'],
          ['`uname`', '`uname -a`', 'Kernel name, version, machine (x86_64), host name'],
        ] } },
        shot('ifconfig', '`ifconfig`: the interface is UP and RUNNING with an IPv4 address.'),
        shot('ping', '`ping google.com`: replies with times, 0% packet loss.'),
        shot('nslookup', '`nslookup google.com`: the name resolves to IPv4 and IPv6 addresses.'),
        shot('netstat', '`netstat`: active connections and the routing table.'),
        shot('arp', '`arp`: the IP-to-MAC mapping of the gateway.'),
        shot('uname', '`uname` with different options.'),
        { exam: 'Viva: ping uses **ICMP echo request / echo reply**. traceroute works by sending packets with TTL = 1, 2, 3 … so each router in turn replies "time exceeded". ARP: IP → MAC; RARP: MAC → IP.' },
      ],
    },
    {
      id: 'topologies', num: 2, short: 'Topologies', title: 'Network topologies in Packet Tracer',
      aim: 'Build point-to-point, bus, star, ring, mesh and hybrid topologies and test them with PDUs.',
      blocks: [
        { h: 'If this is asked (same steps for every topology)' },
        { steps: [
          'Bottom-left device panel → **Network Devices → Switches → 2960**. Drag the switches you need. **End Devices → PC** for the PCs.',
          'Connections (lightning icon): use **Copper Straight-Through** from PC to switch, and **Copper Cross-Over** from switch to switch. (Or pick the **Automatic** connection and let Packet Tracer choose.)',
          'Give every PC an IP in the same network: PC0 = `192.168.1.1`, PC1 = `192.168.1.2`, … with subnet mask `255.255.255.0`. No gateway is needed (there is no router).',
          'Wait until every link dot turns **green** (switch ports take about 30 s). Orange means "still starting"; red means wrong cable or port down.',
          'Add a Simple PDU from one PC to a far PC, and show **Successful** in the event list. Optionally switch to **Simulation** mode to watch the envelope travel.',
        ] },
        { table: { head: ['Topology', 'What to build', 'Remember for the viva'], rows: [
          ['Point-to-point', '2 switches joined by one cross-over link, a PC (or two) on each', 'One dedicated link between two nodes'],
          ['Bus', '4 switches in a straight line (the "backbone"), 1 PC on each', 'Least cable; one break splits the network'],
          ['Star', '1 switch in the centre, 4 PCs connected to it', 'Easy to manage; the centre is a single point of failure'],
          ['Ring', '4 switches in a closed loop, 1 PC on each', 'Each node has exactly 2 neighbours. (The switches run STP, so one link shows **orange** permanently: it is blocked to stop a loop. That is correct.)'],
          ['Mesh', '4 switches, every switch linked to every other (6 links, including both diagonals), 1 PC on each', 'Links = n(n−1)/2; most reliable, most cables'],
          ['Hybrid', 'Two stars (a switch with 4 PCs each) joined switch to switch', 'Mix of two or more topologies'],
        ] } },
        shot('p2p', 'Point-to-point: two switches joined by a single link.'),
        shot('p2p-pdu', 'PDU test result: **Successful**.'),
        shot('bus', 'Bus: switches in a line forming the backbone.'),
        shot('star', 'Star: every PC goes through one central switch.'),
        shot('ring', 'Ring: switches in a closed loop.'),
        shot('mesh', 'Mesh: every switch connected to every other.'),
        shot('hybrid', 'Hybrid: two star networks joined together.'),
      ],
    },
    {
      id: 'error', num: 3, short: 'CRC & Hamming', title: 'Error detection and correction: CRC and Hamming code',
      aim: 'Detect errors with CRC (C++) and detect and correct a single-bit error with Hamming code (Python).',
      parts: [
        { title: 'a) CRC (C++)', blocks: [
          'Sender: append (divisor length − 1) zeros to the data, divide by the divisor using XOR (modulo-2), and the remainder is the CRC. Codeword = data + CRC. Receiver: divide the received codeword by the same divisor. Remainder 0 → no error.',
          code('crc.cpp'),
          { terminal: 'g++ crc.cpp -o crc\n./crc', title: 'Compile and run' },
          'Test 1. Input: data `1101011011`, divisor `10011`, then type the **same** codeword back as the received one.',
          out('crc-1', 'Test 1: no error'),
          'Test 2. Same data and divisor, but flip one bit of the received codeword: `11010100111110`.',
          out('crc-2', 'Test 2: error detected'),
          { tip: 'Check by hand: 1101011011 0000 ÷ 10011 leaves 1110. This is the textbook example (Tanenbaum), so examiners know the answer.' },
        ] },
        { title: 'b) Hamming code (Python)', blocks: [
          'Parity bits go at positions 1, 2, 4, 8 … Each parity bit P covers the positions whose binary form has that bit set. At the receiver, the check bits read as a binary number (the **syndrome**) give the position of the wrong bit.',
          code('hamming.py'),
          { terminal: 'python3 hamming.py', title: 'Run' },
          'Test 1. Input data `1011`, then type the transmitted message `0110011` back unchanged:',
          out('hamming-0', 'Test 1: no error'),
          'Test 2. Same data, but change bit 5: received `0110111`:',
          out('hamming-1', 'Test 2: single-bit error corrected'),
          { formula: 'Number of parity bits r: smallest r with 2^r ≥ m + r + 1   (m = 4 → r = 3)' },
        ] },
      ],
    },
    {
      id: 'static', num: 4, short: 'Static routing', title: 'Static routing on Cisco routers',
      aim: 'Connect two (and then four) Cisco 2811 routers with serial links and make the LANs reach each other using static routes.',
      blocks: [
        { h: 'If this is asked' },
        { steps: [
          'Place **two 2811 routers**, two 2960 switches and 2 PCs per switch.',
          '**Add serial ports:** click a router → **Physical** tab → turn the power switch **off** → drag **WIC-2T** into an empty slot → power **on**. Do this on both routers.',
          'Cables: PC → switch and switch → router `Fa0/0` with **Copper Straight-Through**; router ↔ router with **Serial DCE** (click Router0 first: Router0 becomes the DCE end, which sets the clock).',
          'PC addresses (Desktop → IP Configuration): LAN 1 PCs `192.168.10.2`, `.3`, gateway `192.168.10.1`; LAN 2 PCs `192.168.20.2`, `.3`, gateway `192.168.20.1`.',
          'Configure the router interfaces and the static route (CLI below). Every interface needs `no shutdown`.',
          'Wait for all links to go green, then ping from a LAN 1 PC to a LAN 2 PC. Show it succeeds.',
        ] },
        ios('Router0 CLI', `Router> enable
Router# configure terminal
Router(config)# interface fastethernet0/0
Router(config-if)# ip address 192.168.10.1 255.255.255.0
Router(config-if)# no shutdown
Router(config-if)# exit
Router(config)# interface serial0/1/0
Router(config-if)# ip address 10.1.1.1 255.255.255.0
Router(config-if)# clock rate 64000          ! only on the DCE end
Router(config-if)# no shutdown
Router(config-if)# exit
Router(config)# ip route 192.168.20.0 255.255.255.0 10.1.1.2
Router(config)# end
Router# show ip route`),
        ios('Router1 CLI', `Router> enable
Router# configure terminal
Router(config)# interface fastethernet0/0
Router(config-if)# ip address 192.168.20.1 255.255.255.0
Router(config-if)# no shutdown
Router(config-if)# exit
Router(config)# interface serial0/1/0
Router(config-if)# ip address 10.1.1.2 255.255.255.0
Router(config-if)# no shutdown
Router(config-if)# exit
Router(config)# ip route 192.168.10.0 255.255.255.0 10.1.1.1
Router(config)# end`),
        { formula: 'ip route <remote network> <mask> <next-hop IP = the neighbour router\'s serial address>' },
        'Use the serial interface name your router shows (`serial0/1/0` if the WIC-2T is in slot 1, `serial0/0/0` if in slot 0). Type `show ip interface brief` to see the names and check every line says **up up**.',
        { terminal: `Router0# show ip route
C    10.1.1.0/24 is directly connected, Serial0/1/0
C    192.168.10.0/24 is directly connected, FastEthernet0/0
S    192.168.20.0/24 [1/0] via 10.1.1.2`, title: 'Expected routing table on Router0' },
        'S = static route, administrative distance 1. Both routers need a route: one to go, one to come back.',
        shot('static-2router', 'Two routers joined by a serial link, each with its own LAN.'),
        shot('static-2router-pdu', 'PDUs between the two LANs: **Successful**.'),
        { h: 'Four routers in a ring' },
        'Same steps, four routers, each with **two** serial links. Every router needs a static route to each of the **three** LANs it is not attached to.',
        { table: { head: ['Router', 'LAN (Fa0/0)', 'Serial links'], rows: [
          ['Router0', '192.168.1.1', '10.1.1.1 → Router1, 10.1.3.1 → Router2'],
          ['Router1', '192.168.4.1', '10.1.1.2 → Router0, 10.1.2.1 → Router3'],
          ['Router2', '192.168.2.1', '10.1.3.2 → Router0, 10.1.4.1 → Router3'],
          ['Router3', '192.168.3.1', '10.1.2.2 → Router1, 10.1.4.2 → Router2'],
        ] } },
        ios('Static routes on all four routers', `! Router0
ip route 192.168.4.0 255.255.255.0 10.1.1.2
ip route 192.168.2.0 255.255.255.0 10.1.3.2
ip route 192.168.3.0 255.255.255.0 10.1.1.2
! Router1
ip route 192.168.1.0 255.255.255.0 10.1.1.1
ip route 192.168.3.0 255.255.255.0 10.1.2.2
ip route 192.168.2.0 255.255.255.0 10.1.1.1
! Router2
ip route 192.168.1.0 255.255.255.0 10.1.3.1
ip route 192.168.3.0 255.255.255.0 10.1.4.2
ip route 192.168.4.0 255.255.255.0 10.1.3.1
! Router3
ip route 192.168.4.0 255.255.255.0 10.1.2.1
ip route 192.168.2.0 255.255.255.0 10.1.4.1
ip route 192.168.1.0 255.255.255.0 10.1.2.1`),
        'The LAN on the opposite corner is two hops away; either neighbour works as the next hop, as long as the router in the middle also has a route onward.',
        shot('static-4router', 'Four 2811 routers in a ring, each with a switch and two PCs.'),
        { exam: 'Static vs dynamic: static routes are typed by hand, use no bandwidth and are secure, but do not adapt when a link fails. Dynamic routing (RIP, OSPF; Experiment 9) learns routes automatically.' },
      ],
    },
    {
      id: 'vlan', num: 5, short: 'VLAN', title: 'VLAN configuration',
      aim: 'Split one switch into three VLANs so that only PCs in the same VLAN can talk to each other.',
      blocks: [
        { h: 'If this is asked' },
        { steps: [
          'Place **one 2960 switch** and **6 PCs**. Connect PC0…PC5 to ports **Fa0/1…Fa0/6** with straight-through cables.',
          'Give the PCs `192.168.1.1` … `192.168.1.6`, mask `255.255.255.0`. All are in the same IP network on purpose: any blocking you see later is caused by the VLANs only.',
          'Switch CLI: create VLAN 10 (CSE), 20 (AIML), 30 (CET).',
          'Put ports Fa0/1–2 in VLAN 10, Fa0/3–4 in VLAN 20, Fa0/5–6 in VLAN 30 (access mode).',
          'Check with `show vlan brief`.',
          'Test: PC0 → PC1 (same VLAN) **succeeds**; PC0 → PC2 (different VLAN) **fails**.',
        ] },
        ios('Switch CLI', `Switch> enable
Switch# configure terminal
Switch(config)# vlan 10
Switch(config-vlan)# name CSE
Switch(config-vlan)# exit
Switch(config)# vlan 20
Switch(config-vlan)# name AIML
Switch(config-vlan)# exit
Switch(config)# vlan 30
Switch(config-vlan)# name CET
Switch(config-vlan)# exit
Switch(config)# interface range fastethernet0/1 - 2
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 10
Switch(config-if-range)# exit
Switch(config)# interface range fastethernet0/3 - 4
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 20
Switch(config-if-range)# exit
Switch(config)# interface range fastethernet0/5 - 6
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 30
Switch(config-if-range)# end
Switch# show vlan brief`),
        '`interface range` saves typing. Doing each port separately with `interface fastethernet0/1` etc. gives the same result.',
        { terminal: `VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Fa0/7, Fa0/8, … Gig0/1, Gig0/2
10   CSE                              active    Fa0/1, Fa0/2
20   AIML                             active    Fa0/3, Fa0/4
30   CET                              active    Fa0/5, Fa0/6`, title: 'Expected: show vlan brief' },
        shot('vlan-pdu-same', 'PDU between two PCs in the same VLAN: **Successful**.'),
        shot('vlan-pdu-diff', 'PDU between PCs in different VLANs: **Failed**.'),
        shot('vlan-ping', 'Ping to a PC in another VLAN: Request timed out, 100% loss.'),
        { exam: 'Access port = carries one VLAN (to a PC). Trunk port = carries many VLANs between switches (`switchport mode trunk`). Different VLANs can only talk through a router or layer-3 switch (inter-VLAN routing).' },
      ],
    },
    {
      id: 'ns3-star', num: 6, short: 'NS-3 star', title: 'NS-3: star topology with UDP echo',
      aim: 'Simulate 5 PCs connected to a central switch in ns-3; PC-1 sends UDP packets to PC-5; view it in NetAnim.',
      blocks: [
        { h: 'If this is asked' },
        { steps: [
          'Go to the ns-3 folder: `cd ~/ns3/ns-3-dev` (the folder name in your lab).',
          'Save the program as `scratch/star.cc` (`gedit scratch/star.cc`).',
          'Build and run: `./ns3 run star`. The first build takes a while.',
          'Open NetAnim (`cd ~/ns3/netanim` then `./NetAnim`), click the **open folder** icon, choose `star-topology.xml` from the ns-3 folder, and press **Play**.',
        ] },
        code('star.cc'),
        out('star', 'Expected terminal output'),
        'The exact time after the decimal point depends on your ns-3 version. What matters: PC-1 sends 5 packets of 1024 bytes (at 2 s … 6 s), PC-5 receives each one and echoes it back, and PC-1 receives every echo.',
        shot('ns3-star-netanim', 'NetAnim: the five PCs around the Ethernet switch.'),
        { exam: 'CSMA = the Ethernet model in ns-3. `BridgeHelper` turns the switch node into a layer-2 switch. UDP echo server port is 9.' },
      ],
    },
    {
      id: 'saw', num: 7, short: 'Stop-and-Wait', title: 'NS-3: Stop-and-Wait protocol',
      aim: 'Simulate Stop-and-Wait between a sender and a receiver: one frame, wait for its ACK, then the next.',
      blocks: [
        { h: 'If this is asked' },
        { steps: [
          'Save the program as `scratch/stop-and-wait.cc` in the ns-3 folder.',
          'Run `./ns3 run stop-and-wait`.',
          'Open `stop-and-wait.xml` in NetAnim and play it: one packet goes right, one ACK comes back, then a 2-second gap.',
        ] },
        code('stop-and-wait.cc'),
        out('saw', 'Expected terminal output (from your record)'),
        { h: 'How to read the output' },
        { ul: [
          'A frame leaves at 1 s and arrives at 1.00205 s: 2 ms propagation delay + about 0.05 ms to put 31 bytes on a 5 Mbps link.',
          'The ACK is back at 1.0041 s: one round trip ≈ 4.1 ms.',
          'The next frame only goes at 3 s, because the sender checks for the ACK every 2 s. Exactly **one** frame is outstanding at any time: that is Stop-and-Wait.',
        ] },
        shot('ns3-saw-netanim', 'NetAnim: the sender and receiver exchanging one DATA frame and its ACK.'),
        { formula: 'Efficiency = 1 / (1 + 2a),   a = propagation delay / transmission time' },
      ],
    },
    {
      id: 'gbn', num: 8, short: 'Go-Back-N', title: 'NS-3: Go-Back-N ARQ',
      aim: 'Simulate Go-Back-N with window size N = 4 for 15 frames, with cumulative ACKs.',
      blocks: [
        { h: 'If this is asked' },
        { steps: [
          'Save the program as `scratch/gbn.cc`.',
          'Run `./ns3 run gbn`.',
          'Open `gbn.xml` in NetAnim: the sender (red) bursts 4 frames, the receiver (green) answers with 4 ACKs, then the next 4 frames go.',
        ] },
        code('gbn.cc'),
        out('gbn', 'Expected terminal output (from your record)'),
        { h: 'How to read the output' },
        { ul: [
          'At 1 s the sender sends **4 frames back to back** (Seq 0–3): the whole window, without waiting.',
          'Each ACK slides the window by one, so each ACK immediately lets one new frame go (ACK 0 → Seq 4, ACK 1 → Seq 5, …).',
          'No frame is lost on this link, so there is no "Timeout, going back to Seq=…" line. If a frame were lost, the sender would resend **every** frame from `base` onwards: that is the "go back N".',
          'Ends with `Sent 15/15 packets` at about 1.0166 s, versus about 9 s for 5 frames with Stop-and-Wait.',
        ] },
        shot('ns3-gbn-netanim', 'NetAnim: a window of DATA frames on its way to the receiver.'),
        { exam: 'With m-bit sequence numbers the Go-Back-N sender window can be at most 2^m − 1; the receiver window is 1 (it accepts only the next expected frame).' },
      ],
    },
    {
      id: 'routing', num: 9, short: 'RIP & OSPF', title: 'Dynamic routing: RIP (distance vector) and OSPF (link state)',
      aim: 'Configure RIP v2 and then OSPF on three routers connected in a triangle, and compare their routing tables.',
      blocks: [
        { h: 'If this is asked' },
        { steps: [
          'Place **3 routers (2811)**, add a **WIC-2T** to each (power off → add → power on). Add 3 switches and 1 PC per switch.',
          'Join the routers in a **triangle** with Serial DCE cables: R1 S0/0/0 ↔ R2 S0/0/0, R1 S0/0/1 ↔ R3 S0/0/0, R2 S0/0/1 ↔ R3 S0/0/1.',
          'PCs: PC1 `192.168.1.2` gw `192.168.1.1`; PC2 `192.168.2.2` gw `192.168.2.1`; PC3 `192.168.3.2` gw `192.168.3.1`.',
          'Configure the interfaces (table below), with `clock rate 64000` on each DCE end, and `no shutdown` everywhere.',
          'Enable **RIP** on all three routers, wait ~30 s, check `show ip route`, ping PC1 → PC3.',
          'For OSPF: remove RIP (`no router rip`) and enable OSPF instead, wait for the neighbours to reach **FULL**, check `show ip route`, ping again.',
        ] },
        { table: { head: ['Router', 'Fa0/0 (LAN)', 'S0/0/0', 'S0/0/1'], rows: [
          ['R1', '192.168.1.1', '192.168.4.1 (DCE, to R2)', '192.168.5.1 (DCE, to R3)'],
          ['R2', '192.168.2.1', '192.168.4.2 (to R1)', '192.168.6.1 (DCE, to R3)'],
          ['R3', '192.168.3.1', '192.168.5.2 (to R1)', '192.168.6.2 (to R2)'],
        ] } },
        ios('R1 interfaces (do the same on R2 and R3 with their addresses)', `R1(config)# interface fastethernet0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# interface serial0/0/0
R1(config-if)# ip address 192.168.4.1 255.255.255.0
R1(config-if)# clock rate 64000
R1(config-if)# no shutdown
R1(config-if)# interface serial0/0/1
R1(config-if)# ip address 192.168.5.1 255.255.255.0
R1(config-if)# clock rate 64000
R1(config-if)# no shutdown`),
        { h: 'Part A: RIP version 2' },
        'On each router, list **only its own directly connected networks**:',
        ios('RIP on R1, R2, R3', `R1(config)# router rip
R1(config-router)# version 2
R1(config-router)# no auto-summary
R1(config-router)# network 192.168.1.0
R1(config-router)# network 192.168.4.0
R1(config-router)# network 192.168.5.0

R2(config)# router rip
R2(config-router)# version 2
R2(config-router)# no auto-summary
R2(config-router)# network 192.168.2.0
R2(config-router)# network 192.168.4.0
R2(config-router)# network 192.168.6.0

R3(config)# router rip
R3(config-router)# version 2
R3(config-router)# no auto-summary
R3(config-router)# network 192.168.3.0
R3(config-router)# network 192.168.5.0
R3(config-router)# network 192.168.6.0`),
        { terminal: `R1# show ip route
C    192.168.1.0/24 is directly connected, FastEthernet0/0
L    192.168.1.1/32 is directly connected, FastEthernet0/0
R    192.168.2.0/24 [120/1] via 192.168.4.2, 00:00:07, Serial0/0/0
R    192.168.3.0/24 [120/1] via 192.168.5.2, 00:00:08, Serial0/0/1
C    192.168.4.0/24 is directly connected, Serial0/0/0
L    192.168.4.1/32 is directly connected, Serial0/0/0
C    192.168.5.0/24 is directly connected, Serial0/0/1
L    192.168.5.1/32 is directly connected, Serial0/0/1
R    192.168.6.0/24 [120/1] via 192.168.4.2, 00:00:07, Serial0/0/0`, title: 'Expected: RIP routing table on R1 (from your record)' },
        '**R** = learnt by RIP. **[120/1]** = administrative distance 120 / metric 1 hop. Ping PC1 → PC3: the first reply may time out (ARP), then replies with **TTL=126** (128 minus 2 routers).',
        shot('rip-topology', 'Three routers in a triangle, each with a switch and a PC.'),
        shot('rip-ping', 'Ping from PC1 to PC3 across the routers.'),
        { h: 'Part B: OSPF (single area 0)' },
        'OSPF needs a **wildcard mask** (the opposite of the subnet mask: 255.255.255.0 → 0.0.0.255) and an area number:',
        ios('OSPF on R1, R2, R3', `R1(config)# no router rip
R1(config)# router ospf 1
R1(config-router)# network 192.168.1.0 0.0.0.255 area 0
R1(config-router)# network 192.168.4.0 0.0.0.255 area 0
R1(config-router)# network 192.168.5.0 0.0.0.255 area 0

R2(config)# no router rip
R2(config)# router ospf 1
R2(config-router)# network 192.168.2.0 0.0.0.255 area 0
R2(config-router)# network 192.168.4.0 0.0.0.255 area 0
R2(config-router)# network 192.168.6.0 0.0.0.255 area 0

R3(config)# no router rip
R3(config)# router ospf 1
R3(config-router)# network 192.168.3.0 0.0.0.255 area 0
R3(config-router)# network 192.168.5.0 0.0.0.255 area 0
R3(config-router)# network 192.168.6.0 0.0.0.255 area 0`),
        'After a few seconds the console prints `%OSPF-5-ADJCHG: … from LOADING to FULL, Loading Done` for each neighbour. `show ip ospf neighbor` lists them in the **FULL** state.',
        { terminal: `R1# show ip route
C    192.168.1.0/24 is directly connected, FastEthernet0/0
O    192.168.2.0/24 [110/65] via 192.168.4.2, 00:01:12, Serial0/0/0
O    192.168.3.0/24 [110/65] via 192.168.5.2, 00:01:02, Serial0/0/1
C    192.168.4.0/24 is directly connected, Serial0/0/0
C    192.168.5.0/24 is directly connected, Serial0/0/1
O    192.168.6.0/24 [110/128] via 192.168.4.2, 00:01:02, Serial0/0/0
                     [110/128] via 192.168.5.2, 00:01:02, Serial0/0/1`, title: 'Expected: OSPF routes on R1' },
        shot('ospf-route', 'R1\'s routing table after OSPF (your record).'),
        { compare: [
          { title: 'RIP (distance vector)', items: ['Metric = hop count (max 15)', 'Sends its whole table to neighbours every 30 s', 'Bellman-Ford', 'AD 120 → `[120/1]`'] },
          { title: 'OSPF (link state)', items: ['Metric = cost = 10⁸ / bandwidth (serial 64, FastEthernet 1)', 'Floods LSAs; every router has the full map', 'Dijkstra (SPF)', 'AD 110 → `[110/65]` = 64 + 1'] },
        ] },
      ],
    },
    {
      id: 'wireshark', num: 10, short: 'Wireshark', title: 'Packet capture with Wireshark',
      aim: 'Capture and identify TCP, UDP, IP, ARP, ICMP, Telnet and FTP packets.',
      blocks: [
        { h: 'If this is asked' },
        { steps: [
          'Open Wireshark (`sudo wireshark` on Linux) and double-click the active interface (Wi-Fi / Ethernet; the one with the moving graph).',
          'In a terminal, create traffic for each protocol (table below).',
          'Click the red square to stop. Type the protocol in the **display filter** bar (e.g. `arp`) and press Enter.',
          'Click one packet and expand the middle pane to show its headers layer by layer.',
        ] },
        { table: { head: ['Protocol', 'Make traffic with', 'Filter', 'What to point out'], rows: [
          ['TCP', 'open any website', '`tcp`', 'SYN → SYN-ACK → ACK handshake before data'],
          ['UDP', '`nslookup google.com`', '`udp` or `dns`', 'Query and response, no handshake'],
          ['IP', 'any packet', '`ip`', 'Header: version 4, TTL, protocol, source and destination IP'],
          ['ARP', '`sudo ip neigh flush all` then `ping` your gateway', '`arp`', '"Who has 10.x.x.1? Tell …" request (broadcast) and the "is at <MAC>" reply'],
          ['ICMP', '`ping -c 4 google.com`', '`icmp`', 'Echo request / echo reply pairs'],
          ['Telnet', '`telnet telehack.com`', '`telnet`', 'Everything you type is visible: not secure'],
          ['FTP', '`ftp test.rebex.net` (user `demo`, password `password`)', '`ftp`', '`USER demo` and `PASS password` in plain text'],
        ] } },
        shot('ws-tcp', 'TCP: the three-way handshake and data packets.'),
        shot('ws-udp', 'UDP: DNS queries and responses with no connection set-up.'),
        { exam: 'The three panes: packet list (one line per packet), packet details (headers, layer by layer), packet bytes (hex). Telnet and FTP send passwords in clear text; SSH and SFTP encrypt them.' },
      ],
    },
    {
      id: 'sockets', num: 11, short: 'TCP sockets', title: 'TCP socket programming in Python',
      aim: 'A TCP client sends messages to a server; the server replies "accepted"; "close" ends the session.',
      blocks: [
        { h: 'If this is asked' },
        { steps: [
          'Save the two programs as `server.py` and `client.py`.',
          'Terminal 1: `python3 server.py`. It waits at "Listening on 127.0.0.1:8000". **Always start the server first**, or the client gets "Connection refused".',
          'Terminal 2: `python3 client.py`. Type a few messages; each shows up in the server window.',
          'Type `close` in the client: both sides end.',
        ] },
        code('server.py'),
        code('client.py'),
        out('server', 'Terminal 1: server'),
        out('client', 'Terminal 2: client (you type the messages)'),
        'The client\'s port number (61894 here) is chosen by the OS and will be different for you.',
        { exam: 'Server: socket → bind → listen → accept → recv/send → close. Client: socket → connect → send/recv → close. `SOCK_STREAM` = TCP, `SOCK_DGRAM` = UDP.' },
      ],
    },
    {
      id: 'smtp', num: 12, short: 'SMTP', title: 'Sending email with SMTP in Python',
      aim: 'Send one email to several people using Gmail\'s SMTP server.',
      blocks: [
        { h: 'If this is asked' },
        { steps: [
          'Gmail does not accept your normal password from a program. Before the lab: Google Account → **Security** → turn on **2-Step Verification** → search **App passwords** → create one. You get a 16-character password.',
          'Put your Gmail address and that app password in the program, and the receivers in the list.',
          'Run `python3 smtp.py`. The program prints nothing if it works.',
          'Open the receivers\' inboxes (or the sender\'s **Sent** folder) and show the mail "hello my dear friends".',
        ] },
        code('smtp.py'),
        { terminal: '$ python3 smtp.py\n$', title: 'Expected output: no error' },
        { warn: '`smtplib.SMTPAuthenticationError: (535, … Username and Password not accepted)` means you used your normal password, or typed the app password wrongly. Use the 16-character app password.' },
        { exam: 'SMTP port 587 + `starttls()` = an encrypted connection. SMTP only **sends** mail; POP3 / IMAP are used to **read** it.' },
      ],
    },
  ],
}
