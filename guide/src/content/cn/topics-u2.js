// Computer Networks, Unit II (data link layer, MAC sub-layer) and the start of Unit III
// (network-layer design, optimality, Dijkstra, flooding, distance vector). Keys are syllabus ids.
export default {
  'cn.u2.dll-design': {
    oneLine: 'The data link layer turns the raw bit pipe of the physical layer into reliable frames between neighbours: it provides services, frames the data, and handles errors and flow control.',
    blocks: [
      { h: 'Design issues' },
      { ul: ['**Service to the network layer**: unacknowledged connectionless, acknowledged connectionless, acknowledged connection-oriented.', '**Framing**: split the bit stream into frames.', '**Error control**: detect (and maybe correct) errors, resend lost frames.', '**Flow control**: stop a fast sender swamping a slow receiver.'] },
      { h: 'Framing methods' },
      { table: { head: ['Method', 'Idea'], rows: [
        ['Character count', 'A field at the start gives the frame length (fragile: one error loses sync)'],
        ['Flag bytes with byte stuffing', 'Frames start and end with a FLAG byte; a FLAG or ESC inside the data gets an ESC added before it'],
        ['Flag bits with bit stuffing', 'Flag 01111110; after five 1s in the data, the sender adds a 0'],
        ['Physical-layer coding violations', 'Use signal patterns that never occur in data'],
      ] } },
      { h: 'Byte stuffing algorithm (asked)' },
      { compare: [
        { title: 'Sender', items: ['For each data byte: if it is FLAG or ESC, send ESC first', 'Then send the byte', 'Wrap the frame in FLAG ... FLAG'] },
        { title: 'Receiver', items: ['Read between the FLAGs', 'If a byte is ESC, drop it and take the next byte as data', 'Otherwise keep the byte'] },
      ] },
      { compare: [
        { title: 'Flow control', items: ['Matches the sender\'s speed to the receiver', 'Feedback: "send more" or "wait"'] },
        { title: 'Error control', items: ['Makes sure all frames arrive correctly and in order', 'ACKs, timers, sequence numbers, retransmission'] },
      ] },
      { tip: 'Both MAC and IP addresses are needed (asked): MAC delivers a frame across **one link** to the next device; IP identifies the **final destination** across many networks. The IP address stays the same end to end; the MAC addresses change at every hop.' },
    ],
    terms: [['Frame', 'The data unit of the data link layer.'], ['Byte stuffing', 'Inserting an escape byte before any flag or escape byte in the data.'], ['Bit stuffing', 'Inserting a 0 after five consecutive 1s in the data.']],
    exam: 'List the design issues, explain framing with byte and bit stuffing examples, and differentiate flow control and error control.',
    revise: ['Services, framing, error control, flow control', 'Bit stuffing: 0 after five 1s'],
  },

  'cn.u2.error-detection': {
    oneLine: 'Errors are detected by adding redundant bits: parity catches single-bit errors, checksums add up the data, and CRC divides by a generator polynomial so most burst errors are caught.',
    blocks: [
      { compare: [
        { title: 'Single-bit error', items: ['Only one bit changes', 'Rare in serial transmission'] },
        { title: 'Burst error', items: ['Two or more bits change', 'Length = first to last corrupted bit', 'Common (noise lasts longer than one bit)'] },
      ] },
      { h: 'Parity' },
      'One extra bit makes the count of 1s even (even parity) or odd. Detects any odd number of flipped bits but misses two flips. **Two-dimensional parity** (rows and columns) catches more.',
      { h: 'CRC (cyclic redundancy check)' },
      { flow: ['Generator of degree r: append r zeros to the message', 'Divide by the generator using XOR (mod-2)', 'Remainder (r bits) = CRC', 'Send message + CRC', 'Receiver divides; remainder 0 means no error detected'] },
      { h: 'Worked example' },
      'Message **10011101**, generator **x³ + 1** = 1001 (degree 3, so append three 0s): 10011101**000** ÷ 1001 gives remainder **100**. Transmitted frame: **10011101100**.',
      'If the third bit from the left is inverted, the receiver gets 10111101100; dividing by 1001 gives remainder **100**, not 0, so the error is detected.',
      { h: 'Checksum (Internet)' },
      { steps: ['Split the data into 16-bit words.', 'Add them with one\'s-complement arithmetic (wrap carries around).', 'Complement the sum: that is the checksum.', 'Receiver adds all words plus the checksum; the result should be all 1s (complement 0).'] },
      { tip: 'Why the transport layer checks again even if the data link layer does (asked): the data link check covers each **hop**; errors can still happen inside routers (memory, bugs). Only an end-to-end check catches those.' },
    ],
    terms: [['CRC', 'Cyclic redundancy check: remainder of polynomial division used to detect errors.'], ['Generator polynomial', 'The divisor agreed by sender and receiver for CRC.'], ['Burst error', 'An error affecting several consecutive bits.']],
    exam: 'For CRC numericals: write the generator in binary, append r zeros, do the XOR long division, give the remainder and the transmitted frame, then show the receiver check.',
    revise: ['Append r zeros, divide by mod-2, remainder = CRC', 'Receiver remainder 0 = no error'],
  },

  'cn.u2.error-correction': {
    oneLine: 'Error correction adds enough redundancy to fix errors without resending; Hamming code places parity bits at positions 1, 2, 4, 8… and the syndrome gives the position of a single wrong bit.',
    blocks: [
      { h: 'Hamming distance' },
      'The **Hamming distance** between two codewords is the number of bit positions where they differ: d(10101, 10000) = 2, d(11111, 11111) = 0, d(10000, 00000) = 1. The **minimum distance** of a code decides its power: to **detect** s errors it needs d_min ≥ s + 1; to **correct** t errors it needs d_min ≥ 2t + 1.',
      { h: 'How many check bits' },
      { formula: '2^r ≥ m + r + 1   (m data bits, r check bits)' },
      { ul: ['m = 4: r = 3 (8 ≥ 8).', 'm = 8: r = 4 (16 ≥ 13).', 'm = 16: r = 5 (32 ≥ 22).'] },
      { h: 'Hamming code example (even parity)' },
      { table: { head: ['Position', '1', '2', '3', '4', '5', '6', '7'], rows: [['Bit', 'p1', 'p2', 'd1', 'p4', 'd2', 'd3', 'd4'], ['Data 1011', '0', '1', '1', '0', '0', '1', '1']] } },
      { ul: ['p1 checks positions 1, 3, 5, 7: d = 1, 0, 1 → p1 = 0.', 'p2 checks 2, 3, 6, 7: 1, 1, 1 → p2 = 1.', 'p4 checks 4, 5, 6, 7: 0, 1, 1 → p4 = 0.', 'Codeword: **0110011**.'] },
      'If bit 5 flips (0110111), the receiver recomputes: p1 check fails (1), p2 passes (0), p4 fails (1). Syndrome p4 p2 p1 = **101 = 5**, so bit 5 is flipped back.',
    ],
    terms: [['Hamming distance', 'Number of positions in which two codewords differ.'], ['Syndrome', 'The pattern of failed parity checks; in Hamming code it gives the error position.']],
    exam: 'Define Hamming distance and the detect/correct rules, find r from 2^r ≥ m + r + 1, encode the data in a position table, and show the syndrome for a flipped bit.',
    revise: ['Detect s: d ≥ s+1; correct t: d ≥ 2t+1', 'Parity bits at powers of 2', 'Syndrome = wrong bit position'],
  },

  'cn.u2.simplex': {
    oneLine: 'The utopian simplex protocol is the simplest data link protocol: data flows one way, the channel never loses or damages frames, and the receiver is infinitely fast, so no ACKs or flow control are needed.',
    blocks: [
      { flow: ['Sender: get packet from network layer', 'Build frame', 'Send frame', 'Repeat at full speed'] },
      { flow: ['Receiver: wait for a frame', 'Pass the packet to the network layer', 'Repeat'] },
      { ul: ['Assumptions: one direction only, error-free channel, receiver always ready, infinite buffer.', 'No sequence numbers, no acknowledgements, no timers.', 'Unrealistic, but the starting point for real protocols: each later protocol removes one assumption.'] },
    ],
    terms: [['Simplex', 'Data flows in one direction only.'], ['Utopian protocol', 'An idealised protocol assuming a perfect channel and receiver.']],
    exam: 'State the assumptions, give the sender and receiver loops, and say which assumption the next protocol removes (the infinitely fast receiver).',
    revise: ['One way, no errors, infinite receiver', 'No ACKs, no timers'],
  },

  'cn.u2.stop-wait': {
    oneLine: 'Stop-and-wait (error-free channel) adds flow control: the sender sends one frame and waits for a short acknowledgement before sending the next, so a slow receiver is never flooded.',
    blocks: [
      { flow: ['Send frame 0', 'Wait for ACK', 'Send frame 1', 'Wait for ACK'], loop: 'One frame in flight at a time' },
      'The channel is still assumed error-free; the only problem solved is a **receiver that is slower** than the sender. The ACK is a dummy frame that just says "send the next one".',
      { h: 'For a noisy channel (Protocol 3, stop-and-wait ARQ)' },
      { ul: ['Add a **timer**: if no ACK arrives in time, resend.', 'Add a 1-bit **sequence number** (0, 1) so a resent duplicate is recognised and discarded.', 'Called **PAR** (positive acknowledgement with retransmission).'] },
      { h: 'Efficiency' },
      { formula: 'Utilisation U = 1 / (1 + 2a),   a = propagation delay / transmission delay' },
      'On long, fast links the sender is idle most of the time waiting for ACKs, which is why sliding window protocols exist.',
      { tip: 'Sequence numbers and timers are needed (asked) because frames and ACKs can be lost: the timer triggers a resend, and the sequence number lets the receiver drop a duplicate if only the ACK was lost.' },
    ],
    terms: [['ACK', 'Acknowledgement frame confirming receipt.'], ['ARQ', 'Automatic repeat request: resend on timeout or negative ACK.'], ['PAR', 'Positive acknowledgement with retransmission.']],
    exam: 'Draw a timeline of sender and receiver with frames and ACKs, state the error-free assumption, then show how timers and 1-bit sequence numbers handle a noisy channel.',
    revise: ['One frame, then wait for ACK', 'Noisy channel: timer + 1-bit sequence number'],
  },

  'cn.u2.sliding-window': {
    oneLine: 'Sliding window protocols let the sender keep several unacknowledged frames in flight; the window slides forward as ACKs arrive, keeping the link busy.',
    blocks: [
      'The sender keeps a **sending window**: sequence numbers it may send without waiting. The receiver keeps a **receiving window**: sequence numbers it will accept. With n-bit sequence numbers, numbers run 0 to 2ⁿ − 1.',
      { flow: ['Frames 0 1 2 3 sent', 'ACK 0 arrives', 'Window slides: 1 2 3 4', 'Send frame 4'] },
      { h: 'One-bit sliding window (Protocol 4)' },
      'Window size 1 at both ends, sequence numbers 0 and 1, and **piggybacking**: each frame carries an ACK for the last frame received in the other direction, so data flows both ways on one link.',
      { table: { head: ['Protocol', 'Send window', 'Receive window', 'On error'], rows: [['Stop-and-wait', '1', '1', 'Resend the one frame'], ['Go-Back-N', '2ⁿ − 1', '1', 'Resend the lost frame and all after it'], ['Selective Repeat', '2ⁿ⁻¹', '2ⁿ⁻¹', 'Resend only the lost frame']] } },
      { tip: 'Choose window size W so the pipe stays full: W ≥ 1 + 2a (bandwidth-delay product in frames). Then utilisation reaches 100%.' },
    ],
    terms: [['Sliding window', 'The range of sequence numbers a sender may transmit (or a receiver accept).'], ['Piggybacking', 'Attaching an ACK to an outgoing data frame.'], ['Pipelining', 'Sending several frames before receiving ACKs.']],
    exam: 'Explain the sending and receiving windows with a diagram of the window sliding, describe the one-bit protocol with piggybacking, and compare the three protocols in a table.',
    revise: ['Several frames in flight', 'Piggyback ACKs', 'GBN: receiver window 1; SR: both 2ⁿ⁻¹'],
  },

  'cn.u2.gbn': {
    oneLine: 'In Go-Back-N the sender may have up to 2ⁿ − 1 frames outstanding; the receiver accepts only in-order frames, so after a loss the sender goes back and resends that frame and every frame after it.',
    blocks: [
      { flow: ['Send 0 1 2 3 4', 'Frame 2 lost', 'Receiver discards 3 and 4', 'Timer for 2 expires', 'Resend 2 3 4'] },
      { ul: ['Receiver window = 1, so it needs no buffering of out-of-order frames.', 'Uses **cumulative ACKs**: ACK n means all frames up to n arrived.', 'Max sending window = 2ⁿ − 1 (with n-bit sequence numbers) so a new frame is never confused with an old one.', 'Wasteful on noisy links: many good frames are resent.'] },
      { h: 'Counting transmissions (numericals)' },
      'With window W and every k-th packet lost (and no ACK loss), each loss forces the resending of that packet plus the frames already sent after it, up to W − 1. Trace the window step by step and count every send.',
    ],
    terms: [['Cumulative ACK', 'An ACK that confirms all frames up to a sequence number.'], ['Go-Back-N', 'ARQ protocol that resends the lost frame and all frames after it.']],
    exam: 'Draw the sender and receiver timeline showing a lost frame and the go-back resend; state the window sizes and why the send window is 2ⁿ − 1.',
    revise: ['Send window 2ⁿ − 1, receive window 1', 'Loss → resend from that frame on'],
  },

  'cn.u2.sr': {
    oneLine: 'Selective Repeat buffers out-of-order frames at the receiver and resends only the frames that were actually lost; both windows are at most half the sequence space (2ⁿ⁻¹).',
    blocks: [
      { flow: ['Send 0 1 2 3', 'Frame 1 lost', 'Receiver buffers 2 and 3, sends NAK 1', 'Sender resends only 1', 'Receiver delivers 1 2 3 in order'] },
      { ul: ['Receiver window > 1, so it needs buffers.', 'Uses individual ACKs and **NAKs** (negative acknowledgements).', 'Window ≤ 2ⁿ⁻¹ so the old and new windows never overlap.'] },
      { h: 'Go-Back-N vs Selective Repeat' },
      { table: { head: ['', 'Go-Back-N', 'Selective Repeat'], rows: [
        ['Resends', 'Lost frame and all after it', 'Only the lost frame'],
        ['Receiver window', '1', '2ⁿ⁻¹'],
        ['Receiver buffers', 'None needed', 'Needed'],
        ['Max send window', '2ⁿ − 1', '2ⁿ⁻¹'],
        ['Best for', 'Low error rates, simple receivers', 'Noisy links, high bandwidth-delay'],
      ] } },
    ],
    terms: [['Selective Repeat', 'ARQ protocol that resends only frames that were lost or damaged.'], ['NAK', 'Negative acknowledgement asking for a specific frame again.']],
    exam: 'Draw a timeline with one lost frame and its selective resend, state the window rule 2ⁿ⁻¹, and give the GBN vs SR table.',
    revise: ['Resend only lost frames', 'Both windows ≤ 2ⁿ⁻¹', 'Needs receiver buffers'],
  },

  'cn.u2.channel-allocation': {
    oneLine: 'When many stations share one channel, it can be divided statically (FDM, TDM) or allocated dynamically on demand; dynamic schemes work better for bursty traffic.',
    blocks: [
      { compare: [
        { title: 'Static allocation', items: ['Split the channel into fixed parts (FDM: frequency bands; TDM: time slots)', 'Fine for a few steady users', 'Wasteful for bursty traffic: idle slots are lost'] },
        { title: 'Dynamic allocation', items: ['Give the channel to whoever needs it', 'Suits computer traffic, which is bursty', 'Needs a multiple-access protocol'] },
      ] },
      { h: 'Assumptions of dynamic allocation' },
      { ul: ['N independent stations generate frames.', 'A single shared channel.', 'Two frames overlapping = **collision** (both lost).', 'Time is continuous or slotted.', 'Stations may or may not sense the carrier.'] },
      { tree: { root: 'Multiple access protocols', kids: ['Random access: ALOHA, CSMA, CSMA/CD, CSMA/CA', 'Controlled access: reservation, polling, token passing', 'Channelisation: FDMA, TDMA, CDMA'] } },
    ],
    terms: [['Collision', 'Two frames transmitted at the same time on a shared channel, destroying both.'], ['FDM / TDM', 'Frequency / time division multiplexing: static sharing of a channel.']],
    exam: 'State the channel allocation problem, compare static and dynamic allocation, list the assumptions, and draw the tree of multiple-access protocols.',
    revise: ['Static: FDM, TDM', 'Dynamic: random, controlled, channelisation'],
  },

  'cn.u2.aloha': {
    oneLine: 'ALOHA lets stations transmit whenever they want and resend after a random wait if a collision happens; slotted ALOHA starts frames only at slot boundaries, doubling the best throughput from 18% to 37%.',
    blocks: [
      { compare: [
        { title: 'Pure ALOHA', items: ['Send any time', 'Vulnerable period = 2 frame times', 'S = G e^(−2G)', 'Max 18.4% at G = 0.5'] },
        { title: 'Slotted ALOHA', items: ['Send only at the start of a slot', 'Vulnerable period = 1 frame time', 'S = G e^(−G)', 'Max 36.8% at G = 1'] },
      ] },
      { flow: ['Station has a frame', 'Send it (at the next slot, if slotted)', 'Collision?', 'Yes: wait a random time, resend', 'No: done'] },
      'G is the average number of frames offered per frame time; S is the throughput (successful frames per frame time).',
      { tip: 'Advantage of slotted ALOHA (asked): it halves the vulnerable period, so collisions are fewer and the maximum throughput doubles. The cost is the need for clock synchronisation.' },
    ],
    terms: [['Vulnerable period', 'The time during which another transmission would collide with a frame.'], ['Throughput S', 'Fraction of time carrying successful frames.']],
    exam: 'Explain pure and slotted ALOHA with timing diagrams, give the vulnerable periods and throughput formulas with their maxima.',
    revise: ['Pure: S = Ge^(−2G), max 18.4%', 'Slotted: S = Ge^(−G), max 36.8%'],
  },

  'cn.u2.csma': {
    oneLine: 'CSMA stations listen before sending; persistence rules (1-persistent, non-persistent, p-persistent) decide what to do when the channel is busy, and CSMA/CD also stops as soon as a collision is detected.',
    blocks: [
      { table: { head: ['Method', 'If the channel is busy', 'Trade-off'], rows: [
        ['1-persistent', 'Keep listening; send the moment it is idle', 'Fast, but many collisions'],
        ['Non-persistent', 'Wait a random time, then sense again', 'Fewer collisions, more delay'],
        ['p-persistent (slotted)', 'When idle, send with probability p, else wait one slot', 'Balance of both'],
      ] } },
      { h: 'CSMA/CD (collision detection, Ethernet)' },
      { flow: ['Sense the channel', 'Idle: start sending', 'Collision detected?', 'Yes: stop, send jam signal, wait random back-off (binary exponential)', 'Try again'] },
      { formula: 'Minimum frame size = 2 × propagation delay × bandwidth' },
      'Example: 20 Mbps, maximum propagation 40 µs: 2 × 40×10⁻⁶ × 20×10⁶ = 1600 bits = **200 bytes**. The frame must still be transmitting when the collision news returns.',
      { compare: [
        { title: 'CSMA/CD', items: ['Wired Ethernet', 'Detects collisions while sending', 'Stops and backs off'] },
        { title: 'CSMA/CA', items: ['Wireless (Wi-Fi)', 'Cannot detect collisions reliably', 'Avoids them: IFS wait, random back-off, RTS/CTS, ACKs'] },
      ] },
      { h: 'Collision-free protocols' },
      { ul: ['**Bit-map (reservation)**: a contention period of N bits; station j sets bit j if it has a frame; then they send in order.', '**Token passing**: a token circulates; only its holder may send.', '**Binary countdown**: stations broadcast their address bit by bit; the highest address wins.'] },
    ],
    terms: [['Carrier sense', 'Listening to the channel before transmitting.'], ['Jam signal', 'A signal sent after detecting a collision so all stations notice it.'], ['Binary exponential back-off', 'After the k-th collision, wait a random number of slots from 0 to 2^k − 1.']],
    exam: 'Explain the three persistence methods, draw the CSMA/CD flowchart, compute minimum frame size, and compare CSMA/CD with CSMA/CA.',
    revise: ['1-persistent, non-persistent, p-persistent', 'Min frame = 2 × t_prop × B', 'CD for wired; CA for wireless'],
  },

  'cn.u3.nl-design': {
    oneLine: 'The network layer moves packets from source host to destination host across many networks; its design issues are store-and-forward switching, services to the transport layer, and datagram vs virtual-circuit operation.',
    blocks: [
      { ul: ['**Store-and-forward packet switching**: each router receives the whole packet, checks it, then forwards it.', '**Services to the transport layer**: independent of router technology, hide topology, give uniform addresses.', '**Connectionless (datagram)** or **connection-oriented (virtual circuit)** service.'] },
      { table: { head: ['Issue', 'Datagram network', 'Virtual-circuit network'], rows: [
        ['Circuit setup', 'Not needed', 'Required'],
        ['Addressing', 'Full source and destination in each packet', 'Short VC number'],
        ['Routing', 'Each packet routed independently', 'Route chosen at setup'],
        ['Router failure', 'Only lost packets affected', 'All VCs through it end'],
        ['QoS and congestion control', 'Hard', 'Easy if resources reserved'],
      ] } },
      { tip: 'Main functions (asked): in a datagram network, **routing** and **forwarding**; in a virtual-circuit network, also **call setup**.' },
      { h: 'Tunnelling' },
      'When a packet must cross a network of a different type, the edge router **wraps** it inside that network\'s packet; the far edge router unwraps it. Example: IPv6 packets tunnelled through an IPv4 network.',
      { h: 'Design challenges of routing algorithms' },
      '**Correctness, simplicity, robustness** (cope with failures), **stability** (converge), **fairness** and **efficiency** (optimality).',
    ],
    terms: [['Forwarding', 'Moving a packet from an input line to the right output line.'], ['Routing', 'Deciding the paths and filling the routing tables.'], ['Tunnelling', 'Carrying one network\'s packets inside another\'s.']],
    exam: 'List the design issues, give the datagram vs virtual-circuit table, and explain tunnelling with a diagram.',
    revise: ['Store-and-forward', 'Datagram vs VC', 'Routing goals: correct, simple, robust, stable, fair, efficient'],
  },

  'cn.u3.optimality': {
    oneLine: 'The optimality principle says that if router J is on the best path from I to K, then the best path from J to K follows the same route; so all best paths to one destination form a sink tree.',
    blocks: [
      { flow: ['I', 'J', 'K'], label: 'If I → J → K is optimal, then J → K is optimal too' },
      'Proof idea: if there were a better route from J to K, you could use it to improve the route from I to K, which contradicts I → J → K being optimal.',
      'Consequence: the set of optimal routes from all sources to one destination is a **sink tree** (no loops), and routing algorithms aim to discover it.',
      { h: 'Routing algorithms' },
      { compare: [
        { title: 'Non-adaptive (static)', items: ['Routes computed in advance', 'Do not react to traffic or failures', 'Shortest path, flooding'] },
        { title: 'Adaptive (dynamic)', items: ['Routes change with topology and load', 'Distance vector, link state'] },
      ] },
    ],
    terms: [['Optimality principle', 'Sub-paths of an optimal path are themselves optimal.'], ['Sink tree', 'The tree of optimal paths from all routers to one destination.']],
    exam: 'State the principle, give the one-line proof, define the sink tree, and classify routing algorithms as static or adaptive.',
    revise: ['Sub-path of best path is best', 'Sink tree, no loops'],
  },

  'cn.u3.shortest-path': {
    oneLine: 'Shortest path routing builds a graph of the network and uses Dijkstra\'s algorithm to find the least-cost path from a source to every other node.',
    blocks: [
      { steps: [
        'Mark every node with distance ∞, the source with 0. All labels are **tentative**.',
        'Pick the tentative node with the smallest distance and make it **permanent**.',
        'For each neighbour, if (distance of this node + link cost) is smaller than its label, update the label and remember this node as its predecessor.',
        'Repeat until all nodes are permanent. Follow predecessors back to read each path.',
      ] },
      { h: 'Example' },
      { table: { head: ['Step', 'Permanent', 'A', 'B', 'C', 'D', 'E'], rows: [
        ['Start', 'A', '0', '∞', '∞', '∞', '∞'],
        ['1', 'A', '0', '2 (A)', '5 (A)', '∞', '∞'],
        ['2', 'B', '0', '2', '4 (B)', '7 (B)', '∞'],
        ['3', 'C', '0', '2', '4', '7', '5 (C)'],
        ['4', 'E', '0', '2', '4', '6 (E)', '5'],
        ['5', 'D', '0', '2', '4', '6', '5'],
      ] } },
      'Links: A–B 2, A–C 5, B–C 2, B–D 5, C–E 1, E–D 1. Shortest path A → D = A, B, C, E, D with cost **6**.',
      { tip: 'Metrics can be hops, distance, delay, bandwidth or cost. Write the table step by step in the exam; examiners give marks for each iteration.' },
    ],
    terms: [['Dijkstra\'s algorithm', 'Finds least-cost paths from one source to all nodes by growing a set of permanent nodes.'], ['Tentative label', 'A distance that may still improve.']],
    exam: 'Write the algorithm steps, draw the graph, fill the iteration table with distances and predecessors, and read off the path.',
    revise: ['Pick smallest tentative, make permanent, relax neighbours', 'Follow predecessors back'],
  },

  'cn.u3.flooding': {
    oneLine: 'Flooding sends every incoming packet out on every line except the one it arrived on; it always finds the shortest path but creates huge numbers of duplicates unless limited.',
    blocks: [
      { flow: ['Packet arrives at a router', 'Copy it to every other line', 'Neighbours do the same'] },
      { h: 'Controlling duplicates' },
      { ul: ['**Hop counter**: decremented at each router; the packet is dropped at 0 (initialise to the network diameter).', '**Sequence numbers**: each router remembers (source, sequence) pairs it has seen and drops repeats.', '**Selective flooding**: send only on lines going roughly the right way.'] },
      { compare: [
        { title: 'Advantages', items: ['Extremely robust: works even if many routers fail', 'Always finds the shortest path (one copy takes it)', 'Needs no routing tables'] },
        { title: 'Disadvantages', items: ['Floods the network with duplicates', 'Wastes bandwidth and router time'] },
      ] },
      'Used in military networks, distributed database updates, and to spread link-state packets in link state routing.',
    ],
    terms: [['Flooding', 'Forwarding a packet on all lines except the incoming one.'], ['Hop counter', 'A field limiting how many routers a packet may pass.']],
    exam: 'Explain flooding with a small example, list the ways to limit duplicates, then advantages, disadvantages and uses.',
    revise: ['Send on all lines but the incoming', 'Limit with hop count or sequence numbers'],
  },

  'cn.u3.distance-vector': {
    oneLine: 'In distance vector routing each router keeps a table of the best known distance to every destination and swaps it with its neighbours periodically (Bellman-Ford); it is simple but suffers from count-to-infinity.',
    blocks: [
      { flow: ['Measure the cost to each neighbour', 'Receive neighbours\' distance vectors', 'For each destination: min over neighbours of (cost to neighbour + its distance)', 'Update own table and send it out'], loop: 'Repeat periodically' },
      { formula: 'D_x(y) = min over neighbours v of { c(x, v) + D_v(y) }' },
      { h: 'Example' },
      'Router J has neighbours A (delay 8), I (10), H (12) and K (6). For destination G they report 18, 31, 6 and 31. Via A: 8 + 18 = 26; via I: 10 + 31 = 41; via H: 12 + 6 = **18**; via K: 6 + 31 = 37. So J\'s new entry for G is **18 via H**.',
      { h: 'Count-to-infinity problem' },
      'Good news (a new short path) spreads fast, but bad news spreads slowly. In a line A–B–C, if A goes down, B thinks it can reach A through C (which only knew a path through B), C then updates from B, and the two keep raising the distance by one each exchange until it reaches "infinity".',
      { h: 'Fixes' },
      { ul: ['**Split horizon**: do not advertise a route back to the neighbour you learned it from.', '**Poison reverse**: advertise it back with distance ∞.', 'Define a small infinity (RIP uses 16).', 'Hold-down timers.'] },
    ],
    terms: [['Distance vector', 'A table of best known distances to every destination.'], ['Bellman-Ford', 'The equation used to update distance vectors from neighbours.'], ['Count-to-infinity', 'Slow convergence when a link goes down, as routers keep increasing a bad route.']],
    exam: 'Explain the algorithm with the Bellman-Ford equation and a worked table update, then explain count-to-infinity with the line example and name split horizon and poison reverse.',
    revise: ['Share table with neighbours only', 'D(y) = min(c + D_v(y))', 'Count-to-infinity: split horizon, poison reverse'],
  },
}
