// Computer Networks, Unit II: the data link layer and the MAC sublayer.
// Follows the course slides (CN Unit 2, Sliding Window, MAC and CSMA decks; Tanenbaum chapters 3–4).
export default {
  'cn.u2.dll-design': {
    oneLine: 'The data link layer turns the raw, error-prone bit pipe of the physical layer into a reliable link between neighbours; its design issues are the service it offers the network layer, framing, error control and flow control.',
    blocks: [
      { def: 'Data link layer', text: 'The layer whose main task is to transform a raw transmission facility into a line that appears **free of undetected transmission errors** to the network layer. It moves **frames** from one hop (node) to the next.' },
      'Why is a layer needed at all? Machine A cannot simply put bits on the wire for machine B: circuits make errors, machines have a finite data rate, and there is a non-zero propagation delay. The protocols must take all of these into account.',
      { h: 'Functions of the data link layer' },
      { ul: ['Providing a **well-defined service interface** to the network layer.', '**Framing**: dealing with how bits are grouped into frames.', '**Error control**: dealing with transmission errors.', '**Flow control**: regulating the flow so slow receivers are not swamped by fast senders.'] },
      'It takes the packets it gets from the network layer and **encapsulates them into frames**. Each frame has a frame **header**, a **payload** field holding the packet, and a frame **trailer**. Frame management is the heart of what the data link layer does.',
      { img: 'cn-frame' },
      { h: '1. Services provided to the network layer' },
      'The principal service is transferring data from the network layer on the source machine to the network layer on the destination machine. The data link layers **communicate virtually** using the data link protocol; actually, the bits go down to the physical layer and across the medium.',
      { table: { head: ['Service', 'How it works', 'Used for'], rows: [
        ['**Unacknowledged connectionless**', 'Independent frames are sent with no acknowledgement and no logical connection. A lost frame is not detected or recovered at this layer.', 'Low-error lines (e.g. most LANs, Ethernet) and real-time traffic such as voice, where late data is worse than lost data'],
        ['**Acknowledged connectionless**', 'Still no connection, but each frame is individually acknowledged; if no ACK arrives within a time, the frame is sent again.', 'Unreliable channels such as wireless (802.11)'],
        ['**Acknowledged connection-oriented**', 'A connection is established before data is sent. Frames are numbered, and the layer guarantees each frame is received **exactly once and in the right order**. Three phases: establish, transfer, release.', 'Long, unreliable links such as satellite or long-distance telephone lines'],
      ] } },
      { h: '2. Framing' },
      'The physical layer accepts a raw bit stream and tries to deliver it; bits may be lost, added or changed. The data link layer breaks the stream into discrete **frames** and computes a **checksum** for each. When a frame arrives the checksum is recomputed; if it differs, an error has occurred. The four framing methods (character count, flag bytes with byte stuffing, flags with bit stuffing, physical layer coding violations) are explained below.',
      { h: 'Character count' },
      'A field in the header gives the **number of characters in the frame**. The receiver reads the count and knows where the frame ends. The trouble: if the count is garbled by an error, the receiver loses synchronisation and cannot find the start of the next frame. Even if the checksum shows the frame is bad, there is no way to tell how many characters to skip.',
      { img: 'cn-char-count' },
      { h: 'Flag bytes with byte stuffing' },
      'Each frame starts and ends with a special **flag byte** (the same byte at both ends). If the receiver loses synchronisation, it searches for the flag to find the end of the current frame; two consecutive flags mark the end of one frame and the start of the next. If the flag pattern occurs inside binary data, the sender inserts an **escape byte (ESC)** before each accidental flag (and before each ESC) in the data. The receiver removes them. This is **byte stuffing**. Its disadvantage is that it is tied to 8-bit characters.',
      { img: 'cn-byte-stuffing' },
      { h: 'Starting and ending flags with bit stuffing' },
      'Frames can contain any number of bits. Each frame begins and ends with the bit pattern **01111110** (the flag byte). Whenever the sender meets **five consecutive 1s** in the data, it automatically stuffs a **0** into the outgoing stream. When the receiver sees five 1s followed by a 0, it removes (destuffs) the 0. So the flag pattern can never occur in the data, and frame boundaries are unambiguous. Used by HDLC and PPP.',
      { img: 'cn-bit-stuffing' },
      { h: 'Physical layer coding violations' },
      'Only for networks whose physical encoding has redundancy. For example, some LANs encode 1 data bit as 2 physical bits: 1 is a high-low pair, 0 a low-high pair. The combinations high-high and low-low are never used for data, so they can mark frame boundaries.',
      { h: '3. Error control' },
      'To make sure every frame is delivered exactly once and in order, the receiver sends back control frames: a **positive acknowledgement** (the frame arrived safely) or a **negative acknowledgement** (something went wrong; send it again). Because a frame (or its ACK) can vanish completely, the sender also starts a **timer**; if it expires the frame is resent. Retransmission can create duplicates, so frames carry **sequence numbers** that let the receiver tell a new frame from a copy.',
      { h: '4. Flow control' },
      { compare: [
        { title: 'Feedback-based flow control', items: ['The receiver sends information back to the sender, giving permission to send more data, or telling it how the receiver is doing', 'Used in the data link layer'] },
        { title: 'Rate-based flow control', items: ['A built-in mechanism limits the rate at which senders may transmit, without feedback from the receiver', 'Never used in the data link layer'] },
      ] },
      { analogy: 'The data link layer is the courier between two neighbouring post offices: it packs letters into numbered sacks (frames), checks that every sack arrived intact (error control), and does not deliver faster than the next office can unload (flow control).' },
    ],
    terms: [['Frame', 'The data unit of the data link layer: header + payload + trailer.'], ['Byte stuffing', 'Inserting an ESC byte before accidental flag or ESC bytes in the data.'], ['Bit stuffing', 'Inserting a 0 after five consecutive 1s so the flag 01111110 never appears in the data.'], ['ACK / NAK', 'Positive or negative acknowledgement frame.']],
    exam: 'Define the data link layer, list its four design issues, explain the three services with uses, then each framing method with a diagram (character count, byte stuffing with examples, bit stuffing with the 01111110 example). Finish with error and flow control.',
    revise: ['Services: unack connectionless, ack connectionless, ack connection-oriented', 'Framing: character count, byte stuffing, bit stuffing, coding violations', 'Flag 01111110; stuff 0 after five 1s', 'Flow control: feedback-based (used) vs rate-based (not in DLL)'],
  },

  'cn.u2.error-detection': {
    oneLine: 'Error-detecting codes add just enough redundancy for the receiver to find out that a frame is damaged, so it can ask for it again: a parity bit, a checksum, or a cyclic redundancy check (CRC).',
    blocks: [
      { def: 'Error detection', text: 'Adding redundant (check) bits to the data so the receiver can tell that **an error has occurred**, though not where, and request a retransmission. On reliable channels such as fibre it is cheaper to detect and retransmit than to correct.' },
      { h: 'Types of errors' },
      { ul: ['**Single-bit error**: only one bit of the data unit changes, 0 to 1 or 1 to 0.', '**Burst error**: two or more bits in the data unit change. The *length* of a burst is measured from the first corrupted bit to the last. Noise on media such as radio tends to cause bursts rather than single errors.'] },
      'Errors in bursts have an advantage (computer data is sent in blocks, so a burst affects few blocks) and a disadvantage (bursts are much harder to correct).',
      { h: 'Hamming distance' },
      'An *n*-bit unit holding *m* data bits and *r* check bits is a **codeword** (n = m + r). The number of bit positions in which two codewords differ is their **Hamming distance**; it is found by XOR-ing them and counting the 1s (10001001 XOR 10110001 = 00111000, so the distance is 3).',
      { formula: 'To detect d errors you need a code with minimum distance d + 1' },
      { h: '1. Parity check' },
      { def: 'Simple parity check', text: 'A single **parity bit** is appended to the data so that the total number of 1s in the codeword is **even** (even parity) or **odd** (odd parity).' },
      { ul: ['Even parity: 1011010 → **10110100** (four 1s, so 0 is appended).', 'Odd parity: 1011010 → **10110101**.', 'A single parity bit gives a code of distance 2, so it detects **any single-bit error** (and any odd number of errors). It **cannot detect** an even number of flipped bits.'] },
      { h: 'Two-dimensional parity' },
      'Data is arranged as a table of rows; a parity bit is computed for **every row and every column**, and the column parities form an extra row. It can detect all 1-, 2- and 3-bit errors and most burst errors, and can even locate a single-bit error (the intersection of the failing row and column). It fails if four errors sit at the corners of a rectangle.',
      { h: '2. Checksum' },
      { def: 'Checksum', text: 'An error-detection method used by upper-layer protocols (IP, TCP, UDP). The sender divides the data into k-bit words, adds them using **one\'s complement arithmetic**, and sends the **complement of the sum** as the checksum. The receiver adds all words including the checksum; if the result, complemented, is **all 0s**, the data is accepted.' },
      { steps: ['Sender: divide the data into k-bit sections (16 bits for the Internet checksum).', 'Add the sections with one\'s complement addition: any carry out of the leftmost bit is **wrapped around** and added to the rightmost bit.', 'Complement the final sum; this is the checksum, sent with the data.', 'Receiver: add all sections and the checksum the same way, then complement. **Zero** means accept, anything else means reject.'] },
      { example: 'Send 7, 11, 12, 0, 6 using 4-bit words. Sum = 36 = 100100₂. Wrap the extra bits: 0100 + 10 = **0110** (6). Checksum = complement of 0110 = **1001** (9). The receiver adds 7 + 11 + 12 + 0 + 6 + 9 = 45 = 101101₂ → wrap: 1101 + 10 = **1111**, whose complement is **0000**: accept.' },
      { h: '3. Cyclic redundancy check (CRC)' },
      { def: 'CRC (polynomial code)', text: 'A method that treats a bit string as the coefficients of a polynomial and uses **modulo-2 division** by an agreed **generator polynomial G(x)**. The remainder of the division is appended to the frame so that the whole transmitted frame is exactly divisible by G(x).' },
      'A k-bit frame is seen as a polynomial with terms x^(k−1) to x⁰; for example 110001 is x⁵ + x⁴ + 1. Modulo-2 arithmetic has no carries or borrows: addition and subtraction are both XOR.',
      { img: 'cn-crc-flow' },
      { steps: [
        'Let r be the degree of G(x). Append **r zero bits** to the low end of the frame (the frame now has m + r bits: x^r M(x)).',
        'Divide this bit string by G(x) using modulo-2 division.',
        'Subtract (XOR) the **remainder** (always r or fewer bits) from the padded string. The result T(x) is the frame to transmit: the original data followed by the remainder.',
        'The receiver divides the received frame by G(x). Remainder **0** means no detectable error; a **non-zero** remainder means the frame is damaged.',
      ] },
      { h: 'Worked example (asked in Nov 2025)' },
      'Data 10011101, generator x³ + 1 = **1001** (degree 3, so append three 0s).',
      { code: `            10001100        ← quotient
       ┌──────────────
  1001 │ 10011101000
         1001
         ----
          0001
          0000
          ----
           0011
           0000
           ----
            0110
            0000
            ----
             1101
             1001
             ----
              1000
              1001
              ----
               0010
               0000
               ----
                0100
                0000
                ----
                 100   ← remainder` },
      { ul: ['Transmitted frame = data + remainder = 10011101 **100** → **10011101100**.', 'If the third bit from the left is inverted, the receiver gets 10111101100. Dividing by 1001 gives remainder **100 ≠ 0**, so the receiver **detects the error** and discards the frame.'] },
      'Tanenbaum\'s textbook example: frame 1101011111, generator 10011 (x⁴ + x + 1) → remainder 0010, transmitted frame 11010111110010.',
      { h: 'What CRC can detect' },
      { ul: ['All **single-bit** errors (if G(x) has at least two terms).', 'All **double-bit** errors, if G(x) has a factor with three terms.', 'Any **odd number** of errors, if G(x) contains the factor (x + 1).', 'All **burst errors of length ≤ r**, and most longer bursts.'] },
      'Standard generators: CRC-8, CRC-16, CRC-CCITT, and **CRC-32** (used in Ethernet and IEEE 802).',
      { table: { head: ['Method', 'Redundancy', 'Detects', 'Used in'], rows: [['Parity', '1 bit', 'Single and odd-number errors', 'Memory, serial links'], ['Checksum', '16 bits', 'Most errors; weak against reordered words', 'IP, TCP, UDP'], ['CRC', 'r bits (e.g. 32)', 'All bursts ≤ r and most others', 'Ethernet, Wi-Fi, HDLC']] } },
    ],
    terms: [['Codeword', 'An n-bit unit of m data bits plus r check bits.'], ['Hamming distance', 'Number of bit positions in which two codewords differ.'], ['Generator polynomial', 'The agreed divisor G(x) in CRC.'], ['Modulo-2 arithmetic', 'Binary arithmetic without carries; addition = subtraction = XOR.'], ['Burst error', 'Two or more corrupted bits in a data unit.']],
    exam: 'Define error detection, the two error types and Hamming distance. Explain parity (with even/odd example), checksum (steps and a worked sum) and CRC (steps, a full long division, the transmitted frame, and the receiver check after an inverted bit).',
    revise: ['Detect d errors: distance d + 1', 'Parity detects odd numbers of errors', 'Checksum: one\'s complement sum, send complement; receiver gets 0', 'CRC: append r zeros, divide by G, append remainder; receiver remainder 0 = OK'],
  },

  'cn.u2.error-correction': {
    oneLine: 'Error-correcting codes add enough redundancy for the receiver to work out what was sent; the Hamming code places check bits at positions 1, 2, 4, 8 … so that the pattern of failed checks gives the position of a single-bit error.',
    blocks: [
      { def: 'Error correction (forward error correction)', text: 'Including enough redundant information with each block of data for the receiver to **deduce what the transmitted data must have been**, without asking for a retransmission. It is preferred on noisy channels such as wireless, where a retransmission might itself be damaged.' },
      { formula: 'To correct d errors you need a code with minimum distance 2d + 1' },
      'With distance 2d + 1, even after d bits change, the original codeword is still closer than any other, so it can be determined uniquely.',
      { example: 'A code with only four valid codewords 0000000000, 0000011111, 1111100000, 1111111111 has distance 5, so it can correct double errors (5 = 2 × 2 + 1). If 0000000111 arrives, the receiver knows the original was 0000011111. A triple error turning 0000000000 into 0000000111 would be corrected wrongly.' },
      { h: 'How many check bits are needed?' },
      'With m message bits and r check bits (n = m + r), each of the 2^m legal messages has n illegal codewords at distance 1 from it, so each needs n + 1 bit patterns. Since there are only 2^n patterns in total:',
      { formula: '(n + 1) 2^m ≤ 2^n   →   (m + r + 1) ≤ 2^r' },
      { table: { head: ['Data bits m', 'Check bits r', 'Total n'], rows: [['4', '3', '7'], ['7', '4', '11'], ['8', '4', '12'], ['16', '5', '21'], ['32', '6', '38']] } },
      { h: 'The Hamming code' },
      { def: 'Hamming code', text: 'A single-error-correcting code in which the bits of the codeword are numbered from 1 at the left. Positions that are **powers of 2** (1, 2, 4, 8, …) are **check (parity) bits**; the rest (3, 5, 6, 7, 9, …) are filled with data bits. Each check bit forces the parity of a group of positions to be even (or odd).' },
      { img: 'cn-hamming' },
      'A data bit at position k is checked by the check bits whose positions add up to k. Position 11 = 1 + 2 + 8, so it is checked by bits 1, 2 and 8. Equivalently, check bit p covers every position whose binary number has that bit set:',
      { table: { head: ['Check bit', 'Covers positions'], rows: [['P1', '1, 3, 5, 7, 9, 11'], ['P2', '2, 3, 6, 7, 10, 11'], ['P4', '4, 5, 6, 7'], ['P8', '8, 9, 10, 11']] } },
      { h: 'Worked example: encoding 1001101 (even parity)' },
      { steps: [
        'm = 7, so r = 4 (7 + 4 + 1 = 12 ≤ 16). The codeword has 11 positions.',
        'Place the data bits in positions 3, 5, 6, 7, 9, 10, 11: D3 = 1, D5 = 0, D6 = 0, D7 = 1, D9 = 1, D10 = 0, D11 = 1.',
        'P1 (3, 5, 7, 9, 11) = 1 + 0 + 1 + 1 + 1 = 4 → **P1 = 0**.',
        'P2 (3, 6, 7, 10, 11) = 1 + 0 + 1 + 0 + 1 = 3 → **P2 = 1**.',
        'P4 (5, 6, 7) = 0 + 0 + 1 = 1 → **P4 = 1**.',
        'P8 (9, 10, 11) = 1 + 0 + 1 = 2 → **P8 = 0**.',
        'Codeword (positions 1 to 11): **0 1 1 1 0 0 1 0 1 0 1** = 01110010101.',
      ] },
      { h: 'Detecting and correcting the error' },
      'The receiver recomputes each check over its group (including the check bit). Writing the failed checks as a binary number (P8 P4 P2 P1), called the **syndrome**, gives the **position of the wrong bit**; 0 means no error.',
      { example: 'Suppose bit 7 flips: 01110000101 arrives. Check 1 (1, 3, 5, 7, 9, 11) fails, check 2 fails, check 4 fails, check 8 passes. Syndrome = 0111 = **7**, so the receiver flips bit 7 back and recovers 01110010101.' },
      { h: 'Correcting burst errors' },
      'A Hamming code corrects only single errors, but a trick lets it correct bursts: send k codewords arranged as a matrix, one codeword per row, and transmit **column by column**. A burst of length k then hits only one bit in each codeword, and every codeword can correct its single error.',
      { compare: [
        { title: 'Error detection + retransmission', items: ['Few check bits', 'Needs a back channel and a retransmission', 'Best on reliable links: fibre, copper'] },
        { title: 'Error correction (FEC)', items: ['More check bits', 'No retransmission needed', 'Best on noisy or one-way links: wireless, satellite, deep space'] },
      ] },
    ],
    terms: [['Syndrome', 'The binary number formed by the failed parity checks; it gives the error position.'], ['Check bit', 'A redundant bit at a power-of-two position in a Hamming codeword.'], ['FEC', 'Forward error correction: correcting errors without retransmission.']],
    exam: 'State the 2d + 1 rule and the (m + r + 1) ≤ 2^r bound, define the Hamming code with the position diagram and coverage table, encode a given data word step by step, then show how the syndrome locates and corrects a flipped bit.',
    revise: ['Correct d errors: distance 2d + 1', 'm + r + 1 ≤ 2^r (7 data bits need 4 check bits)', 'Check bits at 1, 2, 4, 8; syndrome = error position'],
  },

  'cn.u2.simplex': {
    oneLine: 'Protocol 1, the unrestricted simplex ("utopia") protocol, assumes a perfect world: data flows one way, both sides are always ready, processing takes no time, buffers are infinite and the channel never loses or damages frames.',
    blocks: [
      { def: 'Elementary data link protocols', text: 'A sequence of increasingly realistic protocols (Tanenbaum\'s Protocols 1, 2 and 3) that show how a data link layer can deliver packets reliably. Each removes one unrealistic assumption of the one before.' },
      { h: 'Assumptions behind all the protocols' },
      { ol: ['The physical, data link and network layers are **independent processes** that communicate by passing messages.', 'Machine A wants to send a long stream of data to machine B using a **reliable, connection-oriented** service. (A always has data ready.)', 'Machines **do not crash**. The protocols deal with communication errors, not reboots.'] },
      'The packet handed down by the network layer is pure data; the data link layer wraps it in a frame (header and trailer with checksum). The library procedures are `to_physical_layer` and `from_physical_layer` to send and receive frames, `wait_for_event(&event)` to sleep until something happens (frame_arrival, cksum_err, timeout), and `start_timer` / `stop_timer`. A frame has four fields: **kind** (data or control), **seq** (sequence number), **ack** (acknowledgement number) and **info** (the packet).',
      { h: 'Protocol 1: An unrestricted simplex protocol (utopia)' },
      { img: 'cn-utopia' },
      { ul: ['Data is transmitted in **one direction only**.', 'Both the transmitting and receiving network layers are **always ready**.', '**Processing time** can be ignored.', '**Infinite buffer space** is available.', 'The channel **never damages or loses frames**.'] },
      'Because of these assumptions it uses **no sequence numbers, no acknowledgements and no timers**. It is thoroughly unrealistic; it is nicknamed "utopia".',
      { h: 'How it works' },
      { compare: [
        { title: 'Sender (loops forever)', items: ['Fetch a packet from the network layer (`from_network_layer`)', 'Copy it into a frame (`s.info = buffer`)', 'Send the frame (`to_physical_layer`)', 'Go back to the start, as fast as it can'] },
        { title: 'Receiver (loops forever)', items: ['Wait for an event; the only possible one is `frame_arrival`', 'Take the frame (`from_physical_layer`)', 'Pass the packet to the network layer (`to_network_layer`)', 'Wait again'] },
      ] },
      { code: `void sender1(void) {
  frame s; packet buffer;
  while (true) {
    from_network_layer(&buffer);   /* get something to send */
    s.info = buffer;               /* copy it into s */
    to_physical_layer(&s);         /* send it on its way */
  }
}
void receiver1(void) {
  frame r; event_type event;
  while (true) {
    wait_for_event(&event);        /* only possibility is frame_arrival */
    from_physical_layer(&r);       /* go get the inbound frame */
    to_network_layer(&r.info);     /* pass the data to the network layer */
  }
}` },
      { h: 'Why study it?' },
      'It is the baseline: every later protocol keeps this structure and adds exactly what is needed when one assumption is dropped. Protocol 2 drops "the receiver is infinitely fast" (adds flow control); Protocol 3 drops "the channel is perfect" (adds timers and sequence numbers).',
      { analogy: 'Like throwing letters into a magic mailbox that never loses anything and a reader who reads infinitely fast: you never have to wait or check.' },
    ],
    terms: [['Utopia', 'Nickname for Protocol 1, which assumes a perfect channel and receiver.'], ['wait_for_event', 'Library procedure that blocks until a frame arrives, a checksum error occurs, or a timer expires.']],
    exam: 'State the common assumptions, list Protocol 1\'s five assumptions, write the sender and receiver loops (pseudocode or C), and explain why it needs no ACKs, sequence numbers or timers.',
    revise: ['Simplex, always ready, no processing time, infinite buffers, error-free channel', 'No ACK, no seq, no timer'],
  },

  'cn.u2.stop-wait': {
    oneLine: 'Protocol 2, stop-and-wait, drops the assumption that the receiver can process frames infinitely fast: the sender sends one frame and then waits for a dummy acknowledgement before sending the next; Protocol 3 adds timers and sequence numbers for a noisy channel.',
    blocks: [
      { def: 'Stop-and-wait protocol', text: 'A protocol in which the sender sends **one frame and then waits for an acknowledgement** before proceeding to the next frame. It is the simplest form of **feedback-based flow control**.' },
      { h: 'Protocol 2: Simplex stop-and-wait for an error-free channel' },
      'The channel is still assumed **error-free** and traffic is still **simplex**, but the receiver now needs a finite time Δt to process each frame and has limited buffer space. The problem: how to prevent the sender from flooding the receiver faster than it can process data.',
      'If the receiver needs Δt to execute `from_physical_layer` plus `to_network_layer`, the sender must send at an average rate below one frame per Δt. Since the receiver has no queue, the sender must never transmit a new frame until the old one has been fetched. The solution: after passing a packet to its network layer, the receiver sends a small **dummy frame back** to the sender, giving it permission to send the next frame.',
      { img: 'cn-stop-wait' },
      { compare: [
        { title: 'Sender', items: ['Get a packet, build a frame, send it', '**Wait** for the acknowledgement frame to arrive', 'Only then fetch the next packet'] },
        { title: 'Receiver', items: ['Wait for a frame to arrive', 'Pass its packet to the network layer', 'Send a **dummy frame** back as the acknowledgement'] },
      ] },
      'Although data flows one way, frames travel in both directions, so the channel must be at least **half-duplex**. The receiver does not even need to look at the content of the dummy frame; its arrival is the signal.',
      { h: 'Protocol 3: Simplex stop-and-wait for a noisy channel (PAR / ARQ)' },
      'Now frames may be **damaged or lost**. A damaged frame is detected by the receiver hardware\'s checksum. A first idea: the receiver acknowledges only correct frames; a damaged one is discarded, the sender **times out** and sends it again. But this has a fatal flaw:',
      { steps: [
        'A sends packet 1. It arrives correctly at B and is passed to B\'s network layer.',
        'B\'s acknowledgement is **lost** completely.',
        'A times out, assumes the frame was lost, and sends packet 1 again.',
        'The **duplicate** arrives at B and is passed to the network layer again: part of the file is duplicated, and the protocol has failed.',
      ] },
      'The fix is a **sequence number** in each frame header so the receiver can tell a new frame from a retransmission. Because the sender only ever has one outstanding frame, a **1-bit sequence number** (0 or 1) is enough. The receiver expects a particular number; a frame with the wrong number is a duplicate, which it discards (but acknowledges again).',
      { img: 'cn-par' },
      { def: 'PAR / ARQ', text: 'Protocols in which the sender waits for a positive acknowledgement before advancing to the next data item are called **PAR** (Positive Acknowledgement with Retransmission) or **ARQ** (Automatic Repeat reQuest).' },
      { h: 'Efficiency of stop-and-wait' },
      'With channel capacity b bits/s, frame size l bits and round-trip propagation time R, sending one frame takes l/b; then the line is idle for R while waiting for the ACK.',
      { formula: 'Line utilisation = (l/b) / (l/b + R) = l / (l + bR)' },
      { example: 'On a 50 kbps satellite channel with a 500 ms round trip and 1000-bit frames: utilisation = 1000 / (1000 + 50,000 × 0.5) = 1000 / 26,000 ≈ **3.8%**. If l < bR, efficiency is below 50%. This waste is what sliding window protocols fix.' },
    ],
    terms: [['Flow control', 'Stopping a fast sender from overwhelming a slow receiver.'], ['Timeout', 'Expiry of the sender\'s timer, triggering a retransmission.'], ['Duplicate frame', 'A second copy caused by retransmission after a lost ACK.'], ['ARQ', 'Automatic Repeat reQuest: retransmit until acknowledged.']],
    exam: 'Explain Protocol 2: the problem (fast sender, slow receiver), the solution (dummy ACK), and a timing diagram. Then explain Protocol 3: the lost-ACK duplicate problem and why a 1-bit sequence number and a timer solve it, with a diagram. Add the utilisation formula.',
    revise: ['P2: send one, wait for dummy ACK; channel error-free; half-duplex needed', 'P3: timer + 1-bit sequence number; PAR/ARQ', 'Utilisation = l / (l + bR)'],
  },

  'cn.u2.sliding-window': {
    oneLine: 'Sliding window protocols number frames with n-bit sequence numbers and let the sender keep a window of frames outstanding at once (pipelining), with ACKs piggybacked on reverse data; the one-bit protocol, Go-Back-N and selective repeat are the three versions.',
    blocks: [
      { def: 'Sliding window protocol', text: 'A bidirectional data link protocol in which every frame carries a **sequence number** from 0 to a maximum of 2ⁿ − 1 (an n-bit field). At any instant the sender keeps a set of sequence numbers it is permitted to send, its **sending window**, and the receiver keeps a set it is permitted to accept, its **receiving window**.' },
      { h: 'Full duplex and piggybacking' },
      'Real links carry data in both directions. Using two separate circuits wastes the reverse channel (it only carries ACKs). Instead, data and acknowledgement frames share one circuit; the **kind** field in the header tells them apart.',
      { def: 'Piggybacking', text: 'Temporarily **delaying an outgoing acknowledgement** so that it can be hooked onto the next outgoing data frame, using the ack field in its header. The ACK gets a free ride.' },
      { ul: ['**Advantage**: better use of bandwidth; the ack field costs a few bits instead of a whole frame with header and checksum. Fewer frames also means fewer interrupts and buffers.', '**Complication**: how long should the receiver wait for a data frame to piggyback on? If it waits longer than the sender\'s timeout, the frame is retransmitted needlessly. In practice it waits a fixed number of milliseconds (the **ack timer**) and then sends a separate ACK.'] },
      { h: 'The windows' },
      { img: 'cn-window' },
      { ul: [
        'The sequence numbers inside the sender\'s window are frames **sent but not yet acknowledged** (and those it may still send). When a new packet arrives from the network layer it gets the next number and the **upper edge** advances; when an ACK arrives the **lower edge** advances.',
        'The sender must keep every unacknowledged frame in a **buffer**, because it may have to retransmit it. A window of maximum size W needs W buffers.',
        'The receiver\'s window holds the frames it may accept. A frame inside the window is accepted; when the frame at the lower edge arrives, its packet is passed up, an ACK is generated and the window rotates by one. A frame outside the window is discarded.',
        'Sender and receiver windows need not have the same size or the same limits, and may grow or shrink.',
      ] },
      { h: 'Protocol 4: A one-bit sliding window protocol' },
      'Window size 1 on both sides, sequence numbers 0 and 1 only: this is stop-and-wait, but bidirectional with piggybacking. Each frame carries (seq, ack, packet). The **ack** field holds the number of the last frame received without error. If it matches the frame the sender is trying to send, the sender fetches the next packet; otherwise it resends. A peculiar situation arises if both sides start sending at the same moment: half the frames are duplicates, but the protocol still delivers every packet exactly once.',
      { h: 'Pipelining' },
      'Stop-and-wait wastes the line when the round trip is long. If the sender may send up to **w frames** before blocking, the line stays busy. The window must be large enough to fill the pipe:',
      { formula: 'Best window w = 2BD + 1   (BD = bandwidth-delay product in frames)        Utilisation ≤ w / (1 + 2BD)' },
      { example: 'Satellite link: 50 kbps, 250 ms one-way delay, 1000-bit frames. BD = 50,000 × 0.25 / 1000 = 12.5 frames, so w = 26 frames keeps the line fully busy, instead of the 3.8% achieved by stop-and-wait.' },
      { h: 'Pipelining over a noisy channel' },
      'If a frame in the middle of a stream is damaged, many following frames arrive before the sender learns of the problem. There are two approaches:',
      { compare: [
        { title: 'Go-Back-N', items: ['Receiver window = 1', 'Discard all frames after the damaged one, sending no ACK for them', 'The sender times out and resends from the damaged frame', 'Wastes bandwidth on a high error rate'] },
        { title: 'Selective repeat', items: ['Receiver window > 1', 'Buffer the good frames that follow the bad one', 'Only the damaged frame is resent (often prompted by a NAK)', 'Needs more receiver memory'] },
      ] },
    ],
    terms: [['Sending window', 'Sequence numbers the sender may have outstanding.'], ['Receiving window', 'Sequence numbers the receiver will accept.'], ['Piggybacking', 'Carrying an ACK on an outgoing data frame.'], ['Pipelining', 'Sending several frames before the first one is acknowledged.'], ['Bandwidth-delay product', 'The number of bits (or frames) that fit in the link at once.']],
    exam: 'Define sliding window and piggybacking (with its advantage and the timing problem), draw the sender window with labelled regions, explain the one-bit protocol, show the pipelining utilisation calculation, and compare Go-Back-N with selective repeat.',
    revise: ['Seq numbers 0 … 2ⁿ − 1', 'Lower edge moves on ACK, upper edge on new frame', 'Piggyback ACK on data; ack timer if no data', 'Window w = 2BD + 1 fills the pipe'],
  },

  'cn.u2.gbn': {
    oneLine: 'Go-Back-N (Protocol 5) pipelines up to MAX_SEQ frames; the receiver accepts frames only in order (window 1), so after a lost or damaged frame it discards everything that follows and the sender resends from that frame onward.',
    blocks: [
      { def: 'Go-Back-N ARQ', text: 'A sliding window protocol in which the sender may have up to **MAX_SEQ** unacknowledged frames outstanding, and the receiver\'s window has size **1**: it accepts only the next expected frame. When a frame is lost, the sender **goes back** and retransmits that frame and **all frames sent after it**.' },
      { img: 'cn-gbn' },
      { h: 'How it works' },
      { steps: [
        'The sender transmits frames 0, 1, 2, … continuously without waiting, as long as fewer than MAX_SEQ are outstanding. It keeps a copy and a **timer** for each.',
        'The receiver accepts frames **in order** and acknowledges them (ACKs are cumulative: ACK n means all frames up to n arrived).',
        'Frame 2 is lost (or arrives damaged and is discarded). Frames 3, 4, 5 arrive, but they are **out of order**, so the receiver discards them and sends no ACK for them.',
        'Frame 2\'s timer expires at the sender. It **goes back** to frame 2 and retransmits 2, 3, 4, 5, … again.',
        'The receiver accepts them in order this time.',
      ] },
      { h: 'Why only MAX_SEQ (not MAX_SEQ + 1) outstanding frames' },
      'With 3-bit sequence numbers (0 to 7) the sender may have at most **7** frames outstanding, not 8. Suppose 8 were allowed:',
      { steps: ['The sender sends frames 0 to 7. A piggybacked ACK for 7 eventually arrives.', 'The sender sends another 8 frames, again numbered 0 to 7.', 'Another ACK for 7 arrives. Did all 8 new frames arrive, or were all 8 lost (so the ACK is just a repeat of the old one)? The sender **cannot tell**.'] },
      'With at most 7 outstanding (e.g. 0–6, then 7, 0–5), an ACK for a number outside the current window shows the frames were lost, so the ambiguity disappears.',
      { formula: 'Go-Back-N: sender window ≤ 2ⁿ − 1        receiver window = 1' },
      { h: 'Timers and buffers' },
      { ul: ['Each outstanding frame has its own logical timer; in software these are kept as a linked list of timeouts ordered by expiry time (Tanenbaum\'s "simulation of multiple timers").', 'The sender needs buffers for all unacknowledged frames; the receiver needs only one.', 'Network layer flow control: the sender\'s data link layer disables the network layer when its window is full and enables it when space opens up.'] },
      { compare: [
        { title: 'Advantages', items: ['Simple receiver: one buffer, in-order acceptance', 'Cumulative ACKs: one ACK confirms many frames', 'Much better line use than stop-and-wait'] },
        { title: 'Disadvantages', items: ['One error forces retransmission of many good frames', 'Wastes a lot of bandwidth when the error rate is high'] },
      ] },
      { example: 'Window 7, frames 0 to 6 sent; frame 3 is corrupted. The receiver accepts 0, 1, 2, discards 4, 5, 6. After the timeout the sender resends **3, 4, 5, 6**: four frames for one error.' },
    ],
    terms: [['Cumulative ACK', 'An ACK for frame n confirms every frame up to and including n.'], ['MAX_SEQ', 'The largest sequence number, 2ⁿ − 1.'], ['Go back', 'Retransmit from the lost frame onward.']],
    exam: 'Define Go-Back-N, draw a timeline with a lost frame showing discards and retransmission, explain why the window is at most 2ⁿ − 1 with the 8-frame ambiguity, and list advantages and disadvantages.',
    revise: ['Receiver window 1, in-order only', 'Lost frame → resend it and all after it', 'Sender window ≤ 2ⁿ − 1'],
  },

  'cn.u2.sr': {
    oneLine: 'Selective repeat (Protocol 6) lets the receiver accept and buffer good frames that arrive out of order, and sends a NAK for a missing one, so only the damaged or lost frame is retransmitted; its windows must be at most half the sequence space.',
    blocks: [
      { def: 'Selective repeat ARQ', text: 'A sliding window protocol in which **both sender and receiver have windows larger than 1**. The receiver accepts any frame inside its window, **buffers** frames that arrive out of order, and delivers packets to the network layer in order. Only the frames that were actually lost or damaged are retransmitted.' },
      { img: 'cn-sr' },
      { h: 'How it works' },
      { steps: [
        'The sender transmits frames 0 to 5. Frame 2 is lost.',
        'Frames 3, 4 and 5 arrive. They are inside the receiver\'s window, so they are **buffered** (not passed up yet, because 2 is missing).',
        'Seeing a gap, the receiver sends a **NAK 2** (negative acknowledgement), which asks for frame 2 straight away instead of waiting for a timeout.',
        'The sender retransmits **only frame 2**.',
        'When 2 arrives, the receiver passes 2, 3, 4, 5 to the network layer in order and acknowledges up to 5.',
      ] },
      { h: 'Window size rule' },
      'With selective repeat the receiver\'s window must not overlap itself after it advances. Consider 3-bit numbers with windows of 7: the sender sends 0–6; all arrive and the receiver advances its window to 7, 0, 1, 2, 3, 4, 5. All the ACKs are lost. The sender times out and resends frame 0. The receiver sees 0 inside its new window, accepts this **old duplicate as a new frame**, and the protocol fails.',
      { formula: 'Selective repeat: window size ≤ (MAX_SEQ + 1) / 2 = 2ⁿ⁻¹' },
      'With 3-bit numbers, the windows can be at most 4.',
      { h: 'Buffers and timers' },
      { ul: ['The receiver needs one buffer per sequence number in its window (not per sequence number), so 4 buffers for a window of 4.', 'Each buffer has an associated timer; the sender keeps one timer per outstanding frame.', 'An **auxiliary ack timer** sends a separate ACK if no reverse data frame comes along soon enough to piggyback on.', '**NAKs** are sent when a damaged frame arrives or a frame other than the expected one arrives (only one NAK per frame, to avoid repeats).'] },
      { h: 'Go-Back-N vs selective repeat' },
      { table: { head: ['Point', 'Go-Back-N', 'Selective repeat'], rows: [
        ['Receiver window', '1', '> 1'],
        ['Out-of-order frames', 'Discarded', 'Buffered'],
        ['On error, resend', 'The lost frame and all after it', 'Only the lost frame'],
        ['Max window (n-bit seq)', '2ⁿ − 1', '2ⁿ⁻¹'],
        ['Receiver memory', 'One frame', 'A window of frames'],
        ['NAK', 'Not needed', 'Used to speed up recovery'],
        ['Bandwidth on errors', 'Wasted', 'Efficient'],
        ['Complexity', 'Simple', 'More complex (sorting, buffers, timers)'],
      ] } },
    ],
    terms: [['NAK', 'Negative acknowledgement: asks for a specific frame to be resent.'], ['Buffering', 'Holding out-of-order frames until the missing one arrives.'], ['Auxiliary (ack) timer', 'Forces a separate ACK when no data frame is available for piggybacking.']],
    exam: 'Define selective repeat, draw the timeline with a lost frame, buffered frames, a NAK and a single retransmission, explain the window ≤ half the sequence space rule with the overlap example, and give the comparison table with Go-Back-N.',
    revise: ['Buffer out-of-order frames; resend only the missing one', 'NAK speeds up recovery', 'Window ≤ 2ⁿ⁻¹ (4 for 3-bit numbers)'],
  },

  'cn.u2.channel-allocation': {
    oneLine: 'When many stations share one broadcast channel, the MAC sublayer decides who transmits next; static allocation (FDM, TDM) wastes capacity on bursty traffic, so LANs use dynamic allocation built on five key assumptions.',
    blocks: [
      { def: 'MAC sublayer', text: 'The **Medium Access Control** sublayer is the bottom part of the data link layer. Its protocols determine **who goes next** on a multiaccess (broadcast, random access) channel when several stations compete for it. It is especially important in LANs.' },
      { def: 'Channel allocation problem', text: 'How to allocate a **single broadcast channel among competing users**.' },
      'Think of a conference call with six people: when one stops speaking, two or more will probably start at once. In a meeting, people raise their hands; on a single shared channel, deciding who goes next is much harder, and that is the job of MAC protocols.',
      { h: 'Static channel allocation' },
      { img: 'cn-mux' },
      { h: 'Frequency division multiplexing (FDM)' },
      'With N users, the bandwidth is divided into **N equal portions**, each user getting one. There is no interference, and it works well for a small, fixed number of users each with heavy traffic (e.g. carriers\' switching offices). Problems:',
      { ul: ['If fewer than N users are active, spectrum is **wasted**.', 'If more than N want to talk, some are **refused**, even if others hardly use their band.', 'Even with exactly N users, when some are quiet their bandwidth is simply lost. Computer traffic is **bursty** (peak-to-mean ratios of 1000:1 are common), so most sub-channels are idle most of the time.'] },
      { formula: 'Mean delay: T = 1 / (μC − λ) for one channel;   T_FDM = N / (μC − λ) = N·T for N sub-channels' },
      'Dividing one channel into N static sub-channels makes the mean delay **N times worse** than using the whole channel dynamically (C = capacity in bps, 1/μ = mean frame length in bits, λ = arrival rate in frames/s).',
      { h: 'Time division multiplexing (TDM)' },
      'Each user is statically given **every Nth time slot**. If a user does not use its slot, the slot lies fallow. The same arguments against FDM apply. (Example: the T1 carrier, 1.544 Mbps, multiplexes 24 voice channels.)',
      { h: 'Dynamic channel allocation: five key assumptions' },
      { table: { head: ['Assumption', 'Meaning'], rows: [
        ['1. **Station model**', 'N independent stations each generate frames. Once a frame is generated the station is blocked until it has been transmitted successfully.'],
        ['2. **Single channel**', 'One channel is available for all communication; all stations can transmit on it and receive from it. All are equivalent in hardware.'],
        ['3. **Collision**', 'If two frames are sent at the same time, they overlap and the signal is garbled: a collision. All stations can detect collisions. A collided frame must be sent again; there are no other errors.'],
        ['4a. **Continuous time**', 'A transmission can begin at any instant; there is no master clock.'],
        ['4b. **Slotted time**', 'Time is divided into discrete slots; transmissions begin only at the start of a slot. A slot holds 0 frames (idle), 1 (success) or more (collision).'],
        ['5a. **Carrier sense**', 'Stations can tell whether the channel is in use before trying; if it is busy, no one transmits until it goes idle.'],
        ['5b. **No carrier sense**', 'Stations cannot sense the channel; they just transmit and only later find out whether it worked.'],
      ] } },
      { h: 'Multiple access protocols' },
      { tree: { root: 'Multiple access protocols', kids: ['Random access (contention): ALOHA, CSMA, CSMA/CD, CSMA/CA', 'Controlled access (collision-free): bit-map reservation, token passing, binary countdown', 'Channelization: FDMA, TDMA, CDMA'] } },
      { analogy: 'Static allocation is giving each person in a class a fixed 2-minute speaking slot whether they have something to say or not. Dynamic allocation is letting whoever has something to say speak, with rules to sort out when two start together.' },
    ],
    terms: [['FDM', 'Frequency division multiplexing: each user gets a fixed frequency band.'], ['TDM', 'Time division multiplexing: each user gets every Nth time slot.'], ['Bursty traffic', 'Traffic that comes in short busy periods separated by long idle ones.'], ['Contention', 'Stations competing for the same channel, which can cause collisions.']],
    exam: 'Define the MAC sublayer and the channel allocation problem, explain static allocation with FDM and TDM and why it fails for bursty traffic (with the N-times-delay formula), and list and explain the five assumptions of dynamic allocation.',
    revise: ['MAC = bottom of the data link layer', 'Static FDM/TDM wastes capacity on bursty traffic', 'Five assumptions: station model, single channel, collision, continuous/slotted time, carrier sense or not'],
  },

  'cn.u2.aloha': {
    oneLine: 'In ALOHA, stations transmit whenever they have data and resend after a random wait if a collision destroys the frame; pure ALOHA reaches at most 18.4% throughput, slotted ALOHA (sending only at slot starts) doubles it to 36.8%.',
    blocks: [
      { def: 'ALOHA', text: 'A **random access (contention)** protocol devised by Norman Abramson at the University of Hawaii (1970) for ground-based radio. Users transmit whenever they have data; if frames collide they are destroyed, and each sender waits a **random time** before trying again.' },
      'Because of the feedback property of broadcasting, a sender can find out whether its frame was destroyed by listening to the channel; if it cannot listen while sending, acknowledgements are used. Systems in which users share a channel in a way that can lead to conflicts are called **contention systems**.',
      { h: 'Pure ALOHA' },
      { steps: ['A station transmits a frame as soon as it has one, at a completely arbitrary time.', 'It listens (or waits for an ACK) to see if the frame got through.', 'If there was a collision, it waits a **random** amount of time (the backoff) and sends again. Random waits stop the same frames colliding over and over.'] },
      { img: 'cn-aloha-vulnerable' },
      { def: 'Vulnerable period', text: 'The length of time during which a frame is at risk of collision. Let t be the time to send one frame. In pure ALOHA a frame sent at t₀ collides with any other frame started between **t₀ − t and t₀ + t**: the vulnerable period is **2t**.' },
      { h: 'Throughput' },
      'Let **G** be the offered load: the mean number of transmission attempts (new and retransmitted) per frame time, and **S** the throughput (successful frames per frame time). With Poisson arrivals, the probability of no other traffic during the vulnerable period gives:',
      { formula: 'Pure ALOHA:  S = G·e^(−2G)      maximum S = 1/(2e) ≈ 0.184 at G = 0.5' },
      'So at best pure ALOHA uses only **18.4%** of the channel.',
      { h: 'Slotted ALOHA' },
      'Proposed by Roberts in 1972 to double the capacity. Time is divided into **discrete slots**, each one frame long, and stations agree on slot boundaries (e.g. a special station emits a pip at the start of each slot, like a clock). A station may transmit **only at the beginning of a slot**. A frame now collides only with frames sent in the same slot, so the vulnerable period halves to **t**.',
      { formula: 'Slotted ALOHA:  S = G·e^(−G)      maximum S = 1/e ≈ 0.368 at G = 1' },
      'At best: 37% of slots carry a successful frame, 37% are empty and 26% have collisions.',
      { img: 'cn-aloha-throughput' },
      { h: 'Pure vs slotted ALOHA' },
      { table: { head: ['Point', 'Pure ALOHA', 'Slotted ALOHA'], rows: [['When to send', 'Any time', 'Only at the start of a slot'], ['Time', 'Continuous', 'Discrete slots'], ['Synchronisation', 'Not needed', 'Global clock needed'], ['Vulnerable period', '2t', 't'], ['Throughput', 'S = Ge^(−2G)', 'S = Ge^(−G)'], ['Maximum throughput', '18.4% at G = 0.5', '36.8% at G = 1'], ['Year', '1970 (Abramson)', '1972 (Roberts)']] } },
      { example: 'A pure ALOHA network shares a 200 kbps channel with 200-bit frames, so t = 1 ms. Vulnerable time = 2 ms. If the system produces 1000 frames per second, G = 1 frame per ms: S = 1 × e⁻² = 0.135, so about 135 frames per second survive. With slotted ALOHA at the same load, S = e⁻¹ = 0.368, so about 368 frames survive.' },
    ],
    terms: [['Contention system', 'A system where users share a channel in a way that can cause conflicts.'], ['Vulnerable period', 'The time during which another transmission would collide with a frame.'], ['Offered load G', 'Mean transmission attempts per frame time.'], ['Throughput S', 'Mean successful transmissions per frame time.']],
    exam: 'Define ALOHA, explain pure ALOHA with the vulnerable-period diagram (2t), derive or state S = Ge^(−2G) and its 18.4% maximum, then slotted ALOHA (t, S = Ge^(−G), 36.8%), draw the throughput curves and finish with the comparison table.',
    revise: ['Pure: vulnerable 2t, S = Ge^(−2G), max 18.4% at G = 0.5', 'Slotted: vulnerable t, S = Ge^(−G), max 36.8% at G = 1', 'Random backoff after a collision'],
  },

  'cn.u2.csma': {
    oneLine: 'Carrier sense multiple access protocols listen to the channel before sending; 1-persistent, non-persistent and p-persistent CSMA differ in what they do when the channel is busy, and CSMA/CD also stops transmitting as soon as it detects a collision.',
    blocks: [
      { def: 'Carrier sense protocols', text: 'Protocols in which stations **listen for a carrier** (a transmission in progress) and act accordingly. In LANs a station can detect what others are doing, so it can achieve much better utilisation than ALOHA\'s 1/e.' },
      'ALOHA asks "can I send now?"; CSMA asks "is someone already sending?". Sensing is not perfect: a signal takes time to propagate, so another station may briefly still sense the channel as idle. That is why collisions can still happen.',
      { h: '1-persistent CSMA' },
      { steps: ['When a station has data, it first **listens** to the channel.', 'If the channel is **idle**, it transmits immediately.', 'If the channel is **busy**, it keeps listening **continuously** and transmits as soon as the channel becomes idle (with probability 1, hence the name).', 'If a collision occurs, it waits a random time and starts again.'] },
      'Weakness: if two stations are both waiting while a third transmits, both sense idle at the same moment when it finishes, and both send: a collision. **Propagation delay** also matters: a station may start just after another, before the first signal reaches it.',
      { h: 'Non-persistent CSMA' },
      { steps: ['Sense the channel. If it is idle, transmit.', 'If it is busy, do **not** keep sensing; wait a **random** period, then sense again and repeat.'] },
      'Random waits spread the attempts, so fewer stations hit the same idle instant: **better channel utilisation**, but **longer delays** than 1-persistent.',
      { h: 'p-persistent CSMA' },
      { steps: ['Used with **slotted** channels. When a station is ready, it senses the channel.', 'If the slot is idle, it transmits with probability **p**; with probability **q = 1 − p** it defers to the next slot.', 'If that slot is also idle, it again transmits with probability p or defers with q; this repeats until the frame is sent or another station starts.', 'If another station is sending, it acts as if there had been a collision: waits a random time and starts again.'] },
      { table: { head: ['Variant', 'If the channel is busy', 'When it is idle', 'Effect'], rows: [['1-persistent', 'Keep sensing continuously', 'Transmit immediately (p = 1)', 'Low delay at light load; waiting stations collide'], ['Non-persistent', 'Wait a random time, then sense again', 'Transmit', 'Fewer collisions, more delay'], ['p-persistent', 'Wait for the next slot', 'Transmit with probability p, else defer', 'Probability controls aggressiveness']] } },
      'Throughput improves as persistence falls: at heavy load non-persistent and 0.01-persistent CSMA reach far higher utilisation than ALOHA.',
      { h: 'CSMA with collision detection (CSMA/CD)' },
      { def: 'CSMA/CD', text: 'An improvement in which a station **listens while it transmits** and, if it detects a **collision**, **aborts the transmission immediately** instead of finishing the damaged frame. This saves time and bandwidth. It is the basis of classic Ethernet (IEEE 802.3).' },
      { steps: ['Sense the channel (1-persistent in Ethernet); send when idle.', 'While sending, compare the signal on the wire with what is being sent. If they differ, a collision has happened.', 'Stop sending at once and send a short **jam signal** so every station knows about the collision.', 'Wait a random time (Ethernet uses **binary exponential backoff**: after the ith collision, wait 0 to 2ⁱ − 1 slot times) and try again.'] },
      { img: 'cn-csmacd' },
      { h: 'How long until a collision is certain to be detected?' },
      'Let τ be the time for a signal to travel between the two farthest stations. A station starts at time 0; just before its signal reaches the far end (at τ − ε), the far station starts too. The noise burst gets back to the first station at **2τ − ε**. So a station cannot be sure it has seized the channel until it has transmitted for **2τ** without hearing a collision. The contention period is therefore modelled as slots of length 2τ. Consequently a frame must take at least 2τ to send; this is why Ethernet has a **minimum frame size** (64 bytes).',
      { compare: [
        { title: 'CSMA/CD (wired)', items: ['Detects a collision while sending and stops', 'Used in classic Ethernet', 'Needs the station to hear while transmitting'] },
        { title: 'CSMA/CA (wireless)', items: ['Avoids collisions: waits an interframe gap, a random backoff and uses acknowledgements', 'Used in Wi-Fi (802.11)', 'Radios cannot detect collisions while sending'] },
      ] },
      { h: 'Collision-free protocols (for contrast)' },
      'Collisions can be avoided entirely by giving stations turns: in the **bit-map** protocol each station announces in a short contention slot whether it wants to send; in **token passing** a token circulates and only its holder may send; in **binary countdown** stations broadcast their addresses bit by bit and the highest address wins. These suit heavy load, while contention protocols suit light load.',
    ],
    terms: [['Carrier sense', 'Listening to the channel before transmitting.'], ['Persistence', 'What a station does when it finds the channel busy.'], ['Jam signal', 'A short signal sent after a collision so all stations notice it.'], ['Binary exponential backoff', 'After the ith collision, wait a random 0 to 2ⁱ − 1 slots.'], ['τ (tau)', 'End-to-end propagation time of the cable.']],
    exam: 'Define CSMA and explain the three persistence methods with a comparison table, then define CSMA/CD with its steps, the 2τ detection argument and the contention-period diagram. Mention CSMA/CA and collision-free protocols for contrast.',
    revise: ['1-persistent: sense continuously, send at once', 'Non-persistent: random wait before sensing again', 'p-persistent: slotted; send with probability p', 'CSMA/CD: stop on collision, jam, exponential backoff; detect within 2τ'],
  },
}
