// CN Unit V model answers (DNS, e-mail, FTP, SNMP, TELNET). Keyed by PYQ id.
const N3 = 'CN Notes3.pdf'
const T = 'Tanenbaum, Computer Networks'
const F = 'Forouzan, Data Communications and Networking'

export default {
  // ---------------- DNS ----------------
  'cn-dns-rr': {
    blocks: [
      'Every domain, whether a single host or a top-level domain, has a set of **resource records (RRs)** associated with it. They form the DNS database. When a resolver gives a domain name to DNS, what it gets back are the resource records for that name. A resource record is a **five-tuple**:',
      { code: 'Domain_name   Time_to_live   Class   Type   Value' },
      { ul: ['**Domain name**: the domain this record applies to (the primary search key).', '**Time to live (TTL)**: how long (seconds) the record may be cached; stable records get large values (86,400 = 1 day), volatile ones small values.', '**Class**: IN for Internet information.', '**Type**: what kind of record it is (below).', '**Value**: a number, domain name or string, depending on the type.'] },
      { table: { head: ['Type', 'Meaning', 'Value'], rows: [
        ['**SOA**', 'Start of authority', 'Parameters for this zone (primary name server, admin e-mail, serial number, timers)'],
        ['**A**', 'IPv4 address of a host', '32-bit integer'],
        ['**AAAA**', 'IPv6 address of a host', '128-bit integer'],
        ['**MX**', 'Mail exchange', 'Priority, name of the domain\'s mail server'],
        ['**NS**', 'Name server', 'Name of a server for this domain'],
        ['**CNAME**', 'Canonical name (alias)', 'Real domain name'],
        ['**PTR**', 'Pointer', 'Alias for an IP address (reverse lookup)'],
        ['**SPF**', 'Sender policy framework', 'Text encoding of mail-sending policy'],
        ['**SRV**', 'Service', 'Host that provides a service'],
        ['**TXT**', 'Text', 'Descriptive ASCII text'],
      ] } },
      { h: 'Example zone entries' },
      { code: 'cs.vu.nl.        86400  IN  SOA   star boss (9527,7200,7200,241920,86400)\ncs.vu.nl.        86400  IN  MX    1 zephyr\nstar.cs.vu.nl.   86400  IN  A     130.37.56.205\nwww.cs.vu.nl.    86400  IN  CNAME star.cs.vu.nl\nftp.cs.vu.nl.    86400  IN  CNAME zephyr.cs.vu.nl' },
    ],
    sources: [`${N3} p95–96`, `${T} §7.1.2`],
  },

  'cn-dns-components': {
    blocks: [
      'DNS is a **hierarchical, domain-based naming scheme and a distributed database** that maps names to IP addresses. Its three main components:',
      { h: '1. Domain name space' },
      'An **inverted tree** with the root at the top. Each node has a **label** (up to 63 characters); a node\'s **domain name** is the sequence of labels from the node up to the root, separated by dots (e.g. www.cbit.ac.in.). The top level has generic domains (com, edu, org, net …) and country domains (in, uk, jp …). Each organisation manages its own subtree (a **domain**), so names are globally unique without a central authority.',
      { img: 'cn-p96b' },
      { h: '2. Resource records' },
      'The **data** stored for each domain: five-tuples (name, TTL, class, type, value): A, AAAA, MX, NS, CNAME, PTR, SOA. They are what DNS returns.',
      { h: '3. Name servers (and resolvers)' },
      'The name space is divided into non-overlapping **zones**; each zone has an **authoritative** primary name server (and secondaries) holding its records. The hierarchy: **root servers** → **top-level domain (TLD)** servers → **authoritative** servers. **Local (recursive) name servers** at ISPs answer clients\' queries and **cache** the results. The **resolver** is the client library in each host that sends queries (e.g. gethostbyname).',
      { img: 'dns-resolution' },
      { h: 'How the components work together' },
      { steps: ['An application calls the resolver with a name (e.g. www.cbit.ac.in).', 'The resolver sends a query (UDP port 53) to the local name server.', 'If not cached, the local server asks the root, then the TLD (in) server, then the authoritative server for cbit.ac.in.', 'The authoritative server returns the A record; the local server caches it (for its TTL) and returns it to the resolver.', 'The application connects to the IP address.'] },
    ],
    sources: [`${N3} p94–97`, `${T} §7.1`],
  },

  'cn-dns-services': {
    blocks: [
      '**DNS (Domain Name System)** is the Internet\'s **distributed, hierarchical database** that maps human-readable **host names to IP addresses** (and other information). It is an application-layer protocol used by other applications; queries and responses normally use **UDP port 53** (TCP 53 for zone transfers and large responses).',
      { h: 'Why it is needed' },
      'People remember names (www.google.com), the network routes on addresses (142.250.x.x). Names also stay fixed when a server\'s address changes, and one central hosts file would be impossible to keep up to date for the whole Internet.',
      { h: 'Services provided by DNS' },
      { ol: [
        '**Host-name-to-address translation**: A (IPv4) and AAAA (IPv6) records.',
        '**Reverse lookup**: address-to-name (PTR records, in-addr.arpa domain).',
        '**Host aliasing**: a host with a complicated canonical name can have simpler aliases (CNAME).',
        '**Mail-server aliasing**: MX records let user@cbit.ac.in reach the right mail server even though the server\'s real name is different.',
        '**Load distribution**: replicated servers (e.g. a busy web site) share one name with several A records; DNS rotates the order of the addresses.',
        '**Service discovery**: SRV and TXT records (e.g. which server provides a service, mail policies).',
      ] },
      { h: 'Structure' },
      { ul: ['**Name space**: inverted tree of labels; generic and country domains.', '**Distribution**: zones served by root, TLD and authoritative servers; local servers cache.', '**Resolution**: recursive and iterative queries.', '**Messages**: query and response with the same format (header, question, answer, authority, additional sections).'] },
      { img: 'cn-p96b' },
      { img: 'dns-resolution' },
    ],
    sources: [`${N3} p94–97`, `${T} §7.1`, `${F} ch. 26 (DNS)`],
  },

  'cn-dns-why': {
    blocks: [
      'We could use IP addresses directly, but:',
      { ul: [
        '**Humans** remember names (cbit.ac.in) far more easily than numbers (14.139.82.x; worse with 128-bit IPv6 addresses).',
        '**Addresses change**: a server can move to another host, provider or data centre; the name stays the same and only its DNS record changes. Hard-coded addresses would break every link and bookmark.',
        '**One name, many servers**: DNS can return several addresses for load balancing and fail-over, or nearby servers (CDNs).',
        '**Aliases and services**: CNAME aliases, MX records for e-mail (user@domain works even though mail goes to another machine).',
        '**Virtual hosting**: many web sites share one IP address; the name tells the server which site is wanted.',
        '**Scalability and delegation**: the hierarchical name space lets each organisation manage its own names.',
        '**Security and policy**: certificates (HTTPS) are issued for names, not raw addresses.',
      ] },
      'So DNS adds a level of **indirection** between the names people use and the addresses the network uses.',
    ],
    sources: [`${N3} p94`, `${T} §7.1`],
  },

  'cn-hier-flat': {
    blocks: [
      { compare: [
        { title: 'Flat name space', items: ['A name is a single sequence of characters with no structure (e.g. "Mycomputer")', 'Must be assigned by a **central authority** to avoid duplicates', 'Lookup needs one huge central table', 'Cannot scale to the Internet'] },
        { title: 'Hierarchical name space', items: ['A name has several parts: e.g. host.department.organisation.type', 'The responsibility is **delegated**: the central authority assigns only the top parts (com, edu, in); each organisation names its own hosts', 'The same host name can be reused in different domains (challenger.atc.fhda.edu vs challenger.ibm.com)', 'Lookup and management are distributed among many servers'] },
      ] },
      { h: 'Advantages of the hierarchical name space for the Internet' },
      { ol: ['**Decentralised management**: no single authority has to approve every name.', '**Uniqueness** is easy: names must only be unique within their parent domain.', '**Scalability**: the database is split into zones held by different servers; load is spread.', '**Efficient lookup**: queries follow the tree (root → TLD → domain), and caching works per subtree.', '**Meaningful names**: the name shows the organisation and type/country.'] },
      { img: 'cn-p96a' },
    ],
    sources: [`${F} ch. 26 (name space)`, `${N3} p95–96`],
  },

  'cn-fqdn': {
    blocks: [
      { compare: [
        { title: 'FQDN (fully qualified domain name)', items: ['Contains the **full name of a host**, all labels from the most specific to the most general, **terminated by a null label** (written with a final dot)', 'Unambiguous: identifies the host uniquely anywhere on the Internet', 'Example: **challenger.atc.fhda.edu.**', 'A DNS server can only match an FQDN to an address'] },
        { title: 'PQDN (partially qualified domain name)', items: ['Starts from a node but **does not reach the root**; not terminated by a null label', 'Used when the name is within the same site as the client', 'The resolver adds the missing part (the **suffix**) to create the FQDN', 'Example: **challenger** (resolver appends .atc.fhda.edu.)'] },
      ] },
      'Another example: in the cbit.ac.in campus, typing "mail" (PQDN) is completed to mail.cbit.ac.in. (FQDN).',
    ],
    sources: [`${F} ch. 26 (domain name space)`],
  },

  'cn-dns-labels': {
    blocks: [
      'voyager.fhda.edu has the labels **voyager**, **fhda** and **edu**: **3 labels** (plus the root\'s null label at the end of the FQDN voyager.fhda.edu., making 4 if the root is counted).',
      { ul: ['Level 1 (top-level domain): **edu**', 'Level 2: **fhda**', 'Level 3: **voyager** (the host)'] },
      'So the name has **3 levels of hierarchy below the root** (4 including the root level).',
    ],
    sources: [`${F} ch. 26 (labels, levels)`],
  },

  'cn-dns-resolution': {
    blocks: [
      'Mapping a name to an address is called **name-address resolution**. A resolver can ask for two kinds of resolution:',
      { img: 'dns-resolution' },
      { h: 'Recursive resolution' },
      'The client asks its name server for a **final answer**. If that server does not know, it asks another server (the parent, root, …) on the client\'s behalf, which may ask another, and so on; the answer travels back along the chain to the client. The burden is on the servers.',
      { steps: ['PC asks local DNS: "www.example.com?" (recursive).', 'Local DNS asks root → root asks .com TLD → TLD asks example.com authoritative server (each passes the query on).', 'The authoritative server returns the address; it travels back through each server to the PC.'] },
      { h: 'Iterative resolution' },
      'If the server does not know the answer, it returns the **address of the next server** to ask (a referral). The client (or the local server) then asks that server itself, repeating until it reaches the authoritative server.',
      { steps: ['Local DNS asks root: root replies "ask the .com TLD at a.gtld-servers.net".', 'Local DNS asks the .com TLD: it replies "ask ns1.example.com".', 'Local DNS asks ns1.example.com: it returns the A record.', 'Local DNS returns the answer to the PC and caches it.'] },
      { table: { head: ['Basis', 'Recursive', 'Iterative'], rows: [['Who does the work', 'Queried servers keep asking for the client', 'The client (local server) asks each server in turn'], ['Server reply', 'Final answer (or error)', 'Answer or a referral to another server'], ['Load', 'High on upper servers', 'Low on root/TLD servers'], ['Typical use', 'Host → local DNS server', 'Local DNS server → root, TLD, authoritative']] } },
      'In practice both are combined: the host makes a recursive query to its local server, which then resolves iteratively. **Caching** at the local server makes most queries answered immediately.',
    ],
    sources: [`${N3} p96–97`, `${T} §7.1.3`],
  },

  'cn-dns-messages': {
    blocks: [
      'DNS has **two categories of messages: query and response**. Both have the **same format**.',
      { ul: ['**Query message**: header + question section.', '**Response message**: header + question section + answer section + authoritative section + additional section.'] },
      { table: { head: ['Section', 'Content'], rows: [
        ['**Header** (12 bytes)', 'Identification (matches a response to its query), flags (query/response, opcode, authoritative answer, truncated, recursion desired, recursion available, response code), number of question / answer / authoritative / additional records'],
        ['**Question**', 'The name, type and class being asked about'],
        ['**Answer**', 'Resource records answering the question'],
        ['**Authoritative**', 'Records for the authoritative servers of the domain'],
        ['**Additional**', 'Extra helpful records (e.g. the A record of a name server listed above)'],
      ] } },
      { h: 'Example' },
      { code: 'Query:    ID=0x1A2B  flags: QR=0 RD=1   QDCOUNT=1\n          Question: www.cbit.ac.in  type A  class IN\n\nResponse: ID=0x1A2B  flags: QR=1 AA=1 RA=1  QDCOUNT=1 ANCOUNT=1\n          Question: www.cbit.ac.in  A  IN\n          Answer:   www.cbit.ac.in  3600  IN  A  14.139.x.x' },
      'Messages normally travel over **UDP port 53**; if a response is larger than 512 bytes it is truncated (TC flag) and the query is repeated over **TCP**.',
    ],
    sources: [`${F} ch. 26 (DNS messages)`, `${N3} p96–97`],
  },

  'cn-ddns': {
    blocks: [
      'When DNS was designed, nobody predicted so many address changes. In original DNS the **master file** of a zone is edited **manually** whenever a host is added, removed or changes address. Today, with **DHCP** assigning addresses dynamically, addresses change constantly (laptops, phones, home connections), so manual updating is impossible.',
      { h: 'Dynamic DNS (DDNS)' },
      'Updates the DNS master file **automatically**: when a binding between a name and an address is determined (e.g. DHCP gives a host an address), the information is sent to a **primary DNS server**, which updates the zone. Secondary servers are notified (actively, or by periodic checks) and transfer the zone. For security, updates are authenticated so that only authorised parties can change records.',
      { h: 'Uses' },
      'Hosts with DHCP-assigned addresses in organisations; home users running a server (camera, NAS, game server) on a connection whose public IP changes: a DDNS client keeps a fixed name (myhome.ddns.net) pointing to the current address.',
    ],
    sources: [`${F} ch. 26 (DDNS)`],
  },

  // ---------------- E-mail ----------------
  'cn-email': {
    blocks: [
      'The e-mail system has two main subsystems: **user agents**, which let people read and send mail, and **message transfer agents**, which move messages from source to destination. Forouzan describes three kinds of agents: **UA** (user agent), **MTA** (message transfer agent: SMTP) and **MAA** (message access agent: POP3/IMAP).',
      { img: 'cn-email' },
      { h: 'Working (Alice sends to Bob)' },
      { steps: ['Alice composes mail in her **UA** (e.g. Outlook, Gmail app).', 'The UA hands the message to her **mail server** using an **MTA client** (SMTP).', 'The server queues it in a **spool**.', 'The server\'s MTA client looks up the MX record of Bob\'s domain and sends the mail over the Internet to Bob\'s mail server\'s **MTA server** (SMTP, TCP port 25).', 'It is stored in Bob\'s **mailbox** on his mail server.', 'Bob\'s UA retrieves it with an **MAA client** (POP3 or IMAP) from the MAA server.'] },
      { h: 'Why this design' },
      'The receiver\'s computer may be switched off, so mail waits on an always-on server. SMTP is a **push** protocol, so a separate **pull** protocol (POP3/IMAP) is needed for the last step.',
      { h: 'Major components' },
      { ul: ['**User agent**: compose, read, reply, forward, file and search messages; manage mailboxes and address book.', '**Mailbox and spool** on the mail server.', '**Message transfer agent**: SMTP client and server; transfers between servers.', '**Message access agent**: POP3 (port 110), IMAP (port 143).', '**Message format**: envelope + header + body (RFC 5322) with **MIME** for attachments and non-ASCII text.', '**Addresses**: local-part@domain, resolved with DNS MX records.'] },
      { h: 'Services offered to users' },
      'Composition, transfer, reporting (delivery status), displaying, disposition (read, save, delete), plus mailing lists, forwarding, auto-reply, CC/BCC.',
    ],
    sources: [`${N3} p87–90`, `${T} §7.2.1`, `${F} ch. 26 (e-mail)`],
  },

  'cn-ua-mta': {
    blocks: [
      { h: 'Architectural layout' },
      { img: 'cn-email' },
      'Sender\'s UA → (SMTP) → sender\'s mail server [spool] → (SMTP over the Internet) → receiver\'s mail server [mailbox] → (POP3/IMAP) → receiver\'s UA. Two subsystems: **user agents** at the edges and **message transfer agents** in the middle.',
      { h: 'User agent (UA)' },
      'A program that provides the user interface to the mail system.',
      { ul: ['**Compose** messages (with editor, address book, attachments).', '**Read** incoming mail; show a summary of the mailbox (sender, subject, date, flags).', '**Reply** and **forward** messages.', '**Handle mailboxes**: inbox, outbox, folders; save, delete, search, filter (spam).', 'Examples: Outlook, Thunderbird, Gmail web/app (command-driven: mail, pine; GUI-based).'] },
      { h: 'Message transfer agent (MTA)' },
      'A system process (mail server) that runs in the background and moves messages through the system.',
      { ul: ['Accepts mail from UAs and other MTAs (**SMTP server**, port 25).', 'Looks up the destination domain\'s **MX record** in DNS and **relays** mail to the destination server (**SMTP client**).', '**Queues** messages in the spool and retries if the destination is unreachable; reports delivery failures (bounce messages).', 'Delivers incoming mail to the recipient\'s **mailbox**.', 'Examples: Sendmail, Postfix, Exim, Microsoft Exchange.'] },
    ],
    sources: [`${N3} p87–89`, `${T} §7.2.1–7.2.2`],
  },

  'cn-ua': {
    blocks: [
      'The **user agent (UA)** is the first component of an e-mail system: the program the user interacts with. Its tasks:',
      { ol: [
        '**Composing messages**: provides an editor (or template) to write the message, fills header fields (To, Subject), lets the user add attachments, and uses the address book. Replying fills in the recipient and quotes the original.',
        '**Reading messages**: checks the mailbox and shows a one-line summary per message (status flag, sender, subject, size), then displays the chosen message (rendering MIME parts).',
        '**Replying to messages**: to the sender or all recipients.',
        '**Forwarding messages** to third parties, with or without comments.',
        '**Handling mailboxes**: creates and manages an inbox, outbox and other folders; saving, deleting, searching, sorting, filtering (spam, rules).',
        '**Sending and receiving**: passes outgoing mail to the MTA (SMTP) and retrieves incoming mail via the MAA (POP3/IMAP).',
      ] },
      'Types: **command-driven** (mail, pine, elm) and **GUI-based** (Outlook, Thunderbird, Gmail).',
    ],
    sources: [`${N3} p88`, `${F} ch. 26 (user agent)`, `${T} §7.2.2`],
  },

  'cn-get-mail': {
    blocks: [
      'Mail sent with SMTP ends in the recipient\'s **mailbox on the mail server** (the MTA). SMTP is a **push** protocol and cannot be used to fetch mail, and the user\'s PC is not always on. So the user\'s UA uses a **message access agent (MAA)** protocol, a **pull** protocol, to get mail from the server:',
      { h: 'POP3 (Post Office Protocol 3, TCP port 110)' },
      { steps: ['The UA (POP3 client) opens a TCP connection to the server.', 'It authenticates: USER name, PASS password.', 'It lists messages (LIST, STAT) and retrieves them one by one (RETR n).', 'In **delete mode** each message is deleted from the server after retrieval (DELE); in **keep mode** it stays.', 'QUIT ends the session.'] },
      { h: 'IMAP4 (TCP port 143)' },
      'Mail **stays on the server**; the user can check headers first, search, download only parts of a message, and create, rename and delete folders on the server: ideal when reading from several devices.',
      { h: 'Web-based mail' },
      'With webmail (Gmail, Outlook.com), the browser talks to the mail server using **HTTP**; the server shows the mailbox as web pages.',
    ],
    sources: [`${N3} p89–90`, `${T} §7.2.5`, `${F} ch. 26 (POP3, IMAP)`],
  },

  'cn-mail-conn': {
    blocks: [
      'TCP\'s three-way handshake creates only a **transport-level byte pipe** between two hosts. SMTP still needs its own **application-level connection establishment**:',
      { ul: [
        '**Server readiness**: the server sends **220 service ready** (or **421 service not available**) — the TCP connection may succeed even when the mail service is overloaded or shutting down.',
        '**Identification**: the client identifies itself with **HELO/EHLO domain**; the server can check and log it (anti-spam, relaying policy) and replies **250 OK**.',
        '**Capability negotiation**: with EHLO the server announces supported extensions (maximum SIZE, 8BITMIME, AUTH, STARTTLS), and the client chooses how to send the mail.',
        '**Authentication and encryption** (AUTH, STARTTLS) are set up at this level, not by TCP.',
        '**Session state**: SMTP is a command-response protocol with defined states; both sides must agree they are in the "ready for mail" state before MAIL FROM, RCPT TO, DATA.',
        'One TCP connection can carry several mail transactions; the SMTP greeting sets up the session once.',
      ] },
      'So TCP establishes **that the two hosts can exchange bytes**; SMTP connection establishment establishes **that the two mail agents agree to exchange mail and how**. Similarly, the SMTP termination phase (QUIT / 221) is separate from TCP\'s FIN.',
    ],
    sources: [`${F} ch. 26 (SMTP phases)`, `${T} §7.2.4`],
  },

  'cn-smtp': {
    blocks: [
      '**SMTP (Simple Mail Transfer Protocol)** is the standard protocol for **transferring mail** from the sender\'s user agent to its mail server, and **between mail servers** (MTA client → MTA server). It is a **push** protocol using **TCP port 25** (587 for submission) and plain-text commands and replies.',
      { h: 'Where SMTP is used' },
      'Twice on the path: sender\'s UA → sender\'s server, and sender\'s server → receiver\'s server. The last hop (server → receiver\'s UA) uses POP3/IMAP.',
      { h: 'Commands and responses' },
      { table: { head: ['Command', 'Meaning'], rows: [['HELO / EHLO', 'Identify the client (EHLO also asks for extensions)'], ['MAIL FROM:', 'Sender\'s address'], ['RCPT TO:', 'Recipient\'s address (repeat for many recipients)'], ['DATA', 'Message follows; ends with a line containing only "."'], ['RSET', 'Abort the current transaction'], ['VRFY / EXPN', 'Verify an address / expand a list'], ['NOOP', 'Check the connection'], ['QUIT', 'Close']] } },
      'Responses are 3-digit codes: **220** service ready, **250** OK, **354** start mail input, **221** closing, **421** not available, **450/550** mailbox unavailable.',
      { h: 'Three phases of mail transfer' },
      { code: 'S: 220 mail.cbit.ac.in SMTP ready          <- connection establishment\nC: HELO pc.example.com\nS: 250 OK\nC: MAIL FROM:<alice@example.com>           <- mail transfer\nS: 250 OK\nC: RCPT TO:<bob@cbit.ac.in>\nS: 250 OK\nC: DATA\nS: 354 Start mail input; end with <CRLF>.<CRLF>\nC: Subject: Hello ... (header, blank line, body)\nC: .\nS: 250 OK\nC: QUIT                                     <- termination\nS: 221 closing' },
      { h: 'Limitations' },
      'Originally 7-bit ASCII only (MIME adds attachments and other languages), no built-in authentication or encryption (added by SMTP-AUTH, STARTTLS).',
    ],
    sources: [`${N3} p88–90`, `${T} §7.2.4`, `${F} ch. 26 (SMTP)`],
  },

  'cn-smtp-http': {
    blocks: [
      { h: 'Basic operation of SMTP' },
      'The SMTP client opens a TCP connection to port 25 of the server; mail transfer then has three phases: **connection establishment** (220, HELO, 250), **mail transfer** (MAIL FROM, RCPT TO, DATA … ".", 250) and **connection termination** (QUIT, 221). Mail is pushed from client to server, possibly relayed through several servers.',
      { code: 'C: HELO a.com      S: 250\nC: MAIL FROM:<x@a.com>  S: 250\nC: RCPT TO:<y@b.com>    S: 250\nC: DATA            S: 354\nC: ...message...   C: .   S: 250\nC: QUIT            S: 221' },
      { h: 'Comparison with HTTP' },
      { table: { head: ['Basis', 'SMTP', 'HTTP'], rows: [
        ['Direction', '**Push**: the sending server pushes mail to the receiving server', '**Pull**: the client pulls web objects from the server'],
        ['Purpose', 'Transfer mail between servers', 'Transfer web pages/objects to browsers'],
        ['Port', '25', '80 (443 for HTTPS)'],
        ['Data format', 'Originally **7-bit ASCII** only: binary needs MIME encoding', 'Any data, binary allowed (Content-Type)'],
        ['Objects per message', 'All parts (text, images) in **one** multipart message', 'Each object in its **own** response'],
        ['Connection', 'Persistent; many mails per connection', 'Persistent (HTTP 1.1) or non-persistent'],
        ['End of message', 'Line with a single "."', 'Content-Length or chunked encoding'],
        ['Similarities', 'Both use TCP, ASCII command/response with 3-digit status codes, and header lines', ''],
      ] } },
    ],
    sources: [`${F} ch. 26 (SMTP)`, `${T} §7.2.4`],
  },

  'cn-smtp-addr': {
    blocks: [
      { h: 'Addressing system used by SMTP' },
      'An e-mail address has two parts separated by **@**: **local-part@domain-name**.',
      { ul: ['**Local part**: the name of the user\'s mailbox on the mail server (e.g. nikhil).', '**Domain name**: the domain of the mail destination (e.g. cbit.ac.in). It is not necessarily a host name: the sending MTA asks **DNS for the MX record** of the domain to find which mail server(s) accept mail for it (MX records have priorities for backup servers).', 'In the SMTP dialogue, addresses appear in the **envelope** commands MAIL FROM:<…> and RCPT TO:<…>; the To:/From: header fields inside the message are for the user and need not match the envelope.'] },
      'Example: mail to bob@cbit.ac.in → MX lookup returns mail.cbit.ac.in → the MTA connects to it on port 25 and issues RCPT TO:<bob@cbit.ac.in>.',
      { h: 'Why do we need POP3 or IMAP4?' },
      { ul: ['SMTP is a **push** protocol: it can only deliver to a server that is **always on and listening**. The final recipient\'s PC or phone is often off or not reachable (behind NAT).', 'So mail is delivered to a mailbox on the mail server, and the user needs a **pull** protocol to fetch it when ready: **POP3** (download) or **IMAP4** (manage on the server).', 'They also provide **authentication** of the user, mailbox **listing** and **deletion**, and (IMAP) folders, search and partial download.'] },
      { img: 'cn-email' },
    ],
    sources: [`${N3} p88–90`, `${F} ch. 26`],
  },

  'cn-pop-imap': {
    blocks: [
      'Both are **message access** (pull) protocols for the final delivery from the mail server to the user agent.',
      { table: { head: ['Basis', 'POP3', 'IMAP4'], rows: [
        ['Full form', 'Post Office Protocol version 3', 'Internet Message Access Protocol version 4'],
        ['Port', '110 (995 with TLS)', '143 (993 with TLS)'],
        ['Where mail is kept', '**Downloaded** to one device; deleted from the server (delete mode) or kept (keep mode)', 'Kept **on the server**; client shows a synchronised view'],
        ['Multiple devices', 'Poor: each device downloads its own copy; read status not shared', 'Good: all devices see the same folders and read/unread flags'],
        ['Folders', 'Only local folders', 'Create, rename, delete folders on the server'],
        ['Partial download', 'No: whole message', 'Yes: headers first, or a body part without large attachments'],
        ['Search', 'On the local copy', 'On the server'],
        ['Server storage', 'Low', 'High'],
        ['Offline use', 'Good after download', 'Needs a connection (or a local cache)'],
        ['Complexity', 'Simple', 'More complex, more features'],
      ] } },
      { h: 'Real-time example' },
      'A student reads college mail on a phone, a laptop and a lab PC: with **IMAP** a mail read on the phone shows as read on the laptop, and folders like "Assignments" appear on all devices. A small shop owner who reads mail on one office PC and wants it stored locally (and removed from a small server mailbox) can use **POP3**.',
    ],
    sources: [`${N3} p89–90`, `${T} §7.2.5`],
  },

  'cn-mime': {
    blocks: [
      { h: 'IMAP (Internet Message Access Protocol)' },
      'IMAP4 is a mail-access (pull) protocol (TCP port 143) where messages **stay on the server**. Unlike POP3, the user can: check the e-mail **header before downloading**; **search** the contents for a string before downloading; **partially download** a message (e.g. skip a large video attachment on a slow link); and **create, delete or rename mailboxes/folders** on the server, with a hierarchy of folders. Example: Gmail on a phone and laptop stays synchronised through IMAP.',
      { h: 'MIME (Multipurpose Internet Mail Extensions)' },
      'SMTP and the original message format can carry only **7-bit NVT ASCII** text. MIME is a supplementary protocol that lets **non-ASCII data** (other languages, images, audio, video, programs) be sent through e-mail: it converts the data to ASCII at the sender and back at the receiver. MIME defines **five header fields** added to the message header:',
      { table: { head: ['Header', 'Meaning'], rows: [
        ['**MIME-Version**', 'Version of MIME used (1.0)'],
        ['**Content-Type**', 'Type/subtype of the body: text/plain, text/html, image/jpeg, image/png, audio/mpeg, video/mp4, application/pdf, application/octet-stream, **multipart/mixed** (several parts, e.g. text + attachments), multipart/alternative (plain + HTML), message/rfc822'],
        ['**Content-Transfer-Encoding**', 'How the body is encoded: 7bit, 8bit, binary, **base64** (any binary data: 3 bytes → 4 ASCII characters), **quoted-printable** (mostly-ASCII text with a few special characters as =XX)'],
        ['**Content-Id**', 'Unique identifier of the part'],
        ['**Content-Description**', 'Text description of the content (e.g. "photo of campus")'],
      ] } },
      { h: 'Example' },
      { code: 'From: alice@example.com\nTo: bob@cbit.ac.in\nSubject: Report\nMIME-Version: 1.0\nContent-Type: multipart/mixed; boundary="XYZ"\n\n--XYZ\nContent-Type: text/plain; charset=UTF-8\n\nPlease find the report attached.\n--XYZ\nContent-Type: application/pdf; name="report.pdf"\nContent-Transfer-Encoding: base64\n\nJVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoK...\n--XYZ--' },
    ],
    sources: [`${N3} p89–90`, `${T} §7.2.3`, `${F} ch. 26 (MIME, IMAP)`],
  },

  // ---------------- FTP ----------------
  'cn-ftp': {
    blocks: [
      '**FTP (File Transfer Protocol)** is the standard TCP/IP protocol for **copying files from one host to another**. It deals with problems such as different file-name conventions, different data representations and different directory structures.',
      { h: 'Two connections' },
      { img: 'cn-ftp' },
      { ul: ['**Control connection** (server port **21**): opened once and kept open for the whole session; carries **commands and responses**, one line at a time, in NVT ASCII.', '**Data connection** (server port **20** in active mode): opened **for each file transfer** (or directory listing) and closed afterwards. In passive mode (PASV) the server picks a port and the client connects to it, which works through firewalls/NAT.'] },
      'Separating commands from data keeps FTP efficient: the control connection needs low delay, the data connection high throughput.',
      { h: 'Communication over the data connection' },
      { ul: ['**File type**: ASCII, EBCDIC or image (binary).', '**Data structure**: file (no structure), record, or page.', '**Transmission mode**: stream (default), block, or compressed.'] },
      { h: 'Typical commands' },
      'USER, PASS, CWD, LIST, RETR (download), STOR (upload), DELE, MKD, TYPE, PORT/PASV, QUIT. Responses are 3-digit codes (e.g. 220 ready, 331 need password, 230 logged in, 150 opening data connection, 226 transfer complete).',
      { h: 'Security' },
      'Plain FTP sends the password and data in clear text; FTPS (FTP over TLS) and SFTP (over SSH) are secure replacements.',
    ],
    sources: [`${N3} p86–87`, `${F} ch. 26 (FTP)`],
  },

  'cn-ftp-http': {
    blocks: [
      { h: 'Need for FTP' },
      { ul: ['Hosts use different **file-name conventions, data representations and directory structures**: FTP handles these with file types (ASCII/binary), structures and modes.', 'Provides a **stateful, authenticated session** with directory operations: list, change directory, create/delete directories, rename, upload and download.', 'Efficient transfer of **large files** and many files, with resumable transfers (REST).', 'Commonly used to upload web sites to servers, exchange files with partners, mirrors of software archives.'] },
      { h: 'FTP vs HTTP' },
      { table: { head: ['Basis', 'FTP', 'HTTP'], rows: [
        ['Purpose', 'File transfer and file management on a remote host', 'Transfer of web pages/resources (hypertext) to browsers'],
        ['Connections', '**Two**: control (21) and data (20 / passive port)', '**One** (80/443): commands and data on the same connection'],
        ['Control information', '**Out-of-band** (separate connection)', '**In-band** (headers in the same message as the data)'],
        ['State', '**Stateful**: server remembers the user, current directory, transfer type', '**Stateless** (cookies add state)'],
        ['Authentication', 'Required login (or anonymous)', 'Usually none; optional (forms, tokens)'],
        ['Uploads/directory ops', 'Built in: STOR, MKD, DELE, RNFR/RNTO, LIST', 'GET mainly; POST/PUT for uploads; no directory model'],
        ['Data transfer', 'One file per data connection; modes stream/block/compressed', 'Many objects; persistent connections, caching, compression, MIME types'],
        ['Firewall/NAT', 'Harder (second connection)', 'Easy'],
      ] } },
      { h: 'Scenarios' },
      { ul: ['**FTP**: a developer uploading a whole web-site folder to a hosting server; bulk transfer of large data sets between organisations; resuming a big download on an unreliable link.', '**HTTP**: browsing web pages, downloading a single file from a link, REST APIs, streaming media to browsers.'] },
    ],
    sources: [`${N3} p86–87`, `${F} ch. 26`],
  },

  'cn-ftp-commands': {
    blocks: [
      'FTP commands are sent as ASCII lines over the **control connection** (port 21). Groups:',
      { table: { head: ['Group', 'Commands'], rows: [
        ['**Access**', 'USER (user name), PASS (password), ACCT (account), REIN (reinitialise), QUIT (log out)'],
        ['**File management**', 'CWD (change directory), CDUP (parent directory), DELE (delete file), LIST (list directory), NLST (list names), MKD (make directory), RMD (remove directory), PWD (print working directory), RNFR / RNTO (rename from / to), SMNT (mount file system)'],
        ['**Data formatting**', 'TYPE (A = ASCII, E = EBCDIC, I = image/binary), STRU (F = file, R = record, P = page), MODE (S = stream, B = block, C = compressed)'],
        ['**Port defining**', 'PORT (client gives its port: active mode), PASV (server chooses a port: passive mode)'],
        ['**File transfer**', 'RETR (retrieve/download), STOR (store/upload), APPE (append), STOU (store unique), ALLO (allocate), REST (restart at a point), ABOR (abort), STAT (status)'],
        ['**Miscellaneous**', 'HELP, NOOP, SITE, SYST'],
      ] } },
      'Responses are 3-digit codes, e.g. 125/150 data connection open, 200 command OK, 220 service ready, 226 closing data connection, 230 user logged in, 331 user name OK, need password, 425 cannot open data connection, 530 not logged in.',
    ],
    sources: [`${F} ch. 26 (FTP commands)`, `${N3} p86–87`],
  },

  'cn-ftp-modes': {
    blocks: [
      { h: 'Three transmission modes' },
      { ol: [
        '**Stream mode** (default): data is delivered from FTP to TCP as a **continuous stream of bytes**; TCP splits it into segments. For a file structure, end-of-file is indicated by **closing the data connection**.',
        '**Block mode**: data is delivered in **blocks**, each preceded by a **3-byte header**: 1 byte of block descriptor (e.g. end of file, restart marker) and 2 bytes giving the block size. Allows restarting interrupted transfers.',
        '**Compressed mode**: for big files, data is **compressed** (usually run-length encoding: consecutive repetitions of a byte, such as spaces in text or zeros in binary, are replaced by a count) before sending.',
      ] },
      { h: 'Storing vs retrieving a file' },
      { table: { head: ['', 'Retrieving (download)', 'Storing (upload)'], rows: [['Command', '**RETR filename**', '**STOR filename**'], ['Direction of data', 'Server → client', 'Client → server'], ['Effect', 'Copies a file from the server to the client', 'Copies a file from the client to the server (creates/overwrites it)'], ['Permission needed', 'Read permission on the server file', 'Write permission in the server directory']] } },
      'In both cases the command goes over the **control connection**, and the file itself goes over a newly opened **data connection**, which is closed when the transfer ends (226 transfer complete). A third kind, retrieving a **directory list** (LIST), also uses the data connection, server → client.',
    ],
    sources: [`${F} ch. 26 (FTP)`],
  },

  'cn-sftp': {
    blocks: [
      { table: { head: ['Basis', 'FTP', 'SFTP (SSH File Transfer Protocol)'], rows: [
        ['Security', 'No encryption: user name, password and data travel in **plain text**', 'Everything **encrypted** inside an SSH session'],
        ['Authentication', 'User name + password (or anonymous)', 'Password or **SSH public keys**; server host key verified'],
        ['Connections', 'Two: control (21) and data (20 or passive port)', '**One** connection'],
        ['Port', '21 (+20 / dynamic)', '**22** (SSH)'],
        ['Firewall / NAT', 'Difficult (separate data connection)', 'Easy (single port)'],
        ['Integrity', 'No protection against tampering', 'Integrity checks (MAC) on all data'],
        ['Data format', 'ASCII/binary modes', 'Binary only; also file attributes and permissions'],
        ['Use', 'Public file archives, legacy systems', 'Secure transfers to servers, admin work'],
      ] } },
      'Note: SFTP is not "FTP over SSL" (that is **FTPS**); it is a separate protocol running over SSH.',
    ],
    sources: [`${F} ch. 26 (FTP)`, 'Standard textbook coverage (SFTP), not in your notes'],
  },

  'cn-anon-ftp': {
    blocks: [
      '**Anonymous FTP** lets anyone access a server without an account: the user logs in with the name **anonymous** (or ftp) and, by convention, an e-mail address as the password. It was used for public software archives.',
      { h: 'Limitations normally imposed' },
      { ul: ['Access only to a **restricted part** of the file system (a chroot\'d public directory).', 'Only a **subset of commands** (e.g. RETR, LIST, CWD) is allowed; usually **no uploads, deletes or renames**.', 'Limits on the number of simultaneous anonymous users and bandwidth.'] },
      { h: 'Risks and how it may be exploited' },
      { ol: [
        '**No accountability**: the "password" is not verified, so the user is unknown; abuse cannot be traced.',
        '**Plain-text traffic**: everything (including any real credentials used on the same server) can be sniffed.',
        '**Writable directories** ("incoming"): attackers upload pirated software, malware or illegal content and use the server to distribute it ("warez" sites), or fill the disk (**denial of service**).',
        '**FTP bounce attack**: using the PORT command, an attacker makes the server open data connections to **third-party hosts/ports**, scanning other machines or sending data through firewalls on the server\'s behalf.',
        '**Information leakage**: misconfigured servers expose sensitive files (password files, backups, configs) or system details useful for further attacks.',
        '**Malware distribution**: tampered files on an unauthenticated server can trick users who trust the site.',
        '**Exploiting server software bugs** (buffer overflows) since anyone can connect.',
      ] },
      { h: 'Mitigation' },
      'Read-only access, no anonymous upload (or upload-only directories that are not readable), chroot jails, disabling PORT to third-party addresses, logging, rate limits, or replacing anonymous FTP with HTTPS downloads.',
    ],
    sources: [`${F} ch. 26 (anonymous FTP)`, 'Standard security practice'],
  },

  // ---------------- SNMP ----------------
  'cn-snmp-arch': {
    blocks: [
      '**SNMP (Simple Network Management Protocol)** is a framework for **managing devices in an internet** (routers, switches, servers, printers) using the TCP/IP suite. It provides a set of fundamental operations for monitoring and maintaining an internet.',
      { img: 'cn-snmp' },
      { h: 'Components (manager–agent architecture)' },
      { ul: [
        '**Manager**: a host (network management station, NMS) that runs the SNMP **client** program. It controls and monitors a set of agents.',
        '**Agent**: a router or host that runs the SNMP **server** program. It keeps performance and status information in a database and answers the manager.',
        '**Management Information Base (MIB)**: the collection of **objects** (variables) each agent maintains: e.g. number of packets received, interface status, routing table. Objects are organised in a tree under the object identifier (OID) 1.3.6.1.2.1 (mib-2).',
        '**Structure of Management Information (SMI)**: rules for **naming objects** (OIDs), defining their **types** (Integer, Counter, Gauge, IPAddress …) and **encoding** them (BER).',
        '**SNMP protocol**: the messages (PDUs) exchanged between manager and agent.',
      ] },
      'SMI defines the rules, MIB creates the variables, and SNMP does the job of reading and changing them. Analogy: SMI is the language\'s syntax, MIB declares the variables, SNMP is the program that uses them.',
      { h: 'Transport' },
      'SNMP uses **UDP**: the agent listens on port **161**, the manager receives traps on port **162**.',
    ],
    sources: [`${N3} p97–99`, `${F} ch. 28 (SNMP)`],
  },

  'cn-snmp': {
    blocks: [
      { h: 'Working principle' },
      'Management with SNMP is based on three ideas:',
      { ol: ['A manager **checks** an agent by requesting information that reflects the agent\'s behaviour (reading MIB objects).', 'A manager **forces** an agent to perform a task by **resetting values** in the agent\'s database (e.g. set a counter to 0, disable an interface).', 'An agent **contributes** to management by **warning the manager** of an unusual situation (a **trap**).'] },
      { img: 'cn-snmp' },
      { h: 'PDUs (SNMPv2/v3)' },
      { table: { head: ['PDU', 'Direction', 'Purpose'], rows: [['GetRequest', 'Manager → agent', 'Read the value of one or more variables'], ['GetNextRequest', 'Manager → agent', 'Read the next variable (walk a table)'], ['GetBulkRequest', 'Manager → agent', 'Read a large amount of data (a whole table)'], ['SetRequest', 'Manager → agent', 'Set (store) a value in a variable'], ['Response', 'Agent → manager', 'Reply to a get/set request'], ['Trap', 'Agent → manager', 'Report an event (e.g. link down, reboot)'], ['InformRequest', 'Manager → manager', 'Get a value from a remote manager (acknowledged)'], ['Report', 'Manager → manager', 'Report some types of errors']] } },
      'Requests go to the agent\'s UDP port **161**; traps go to the manager\'s port **162**. Example: an NMS polls every router\'s ifInOctets counter every 5 minutes to draw traffic graphs; a router sends a linkDown trap when an interface fails.',
      { h: 'Related issues' },
      { ul: ['**Security**: SNMPv1/v2c use plain-text **community strings** ("public"/"private") as passwords, easily sniffed; SNMPv3 adds authentication and encryption (user-based security model).', '**Unreliable transport**: UDP may lose requests and traps (InformRequest adds acknowledgement).', '**Polling overhead and scalability**: polling thousands of devices frequently loads the network and the manager.', '**Limited functionality**: SET operations are risky; many devices expose read-only MIBs.', '**Vendor-specific MIBs** make multi-vendor management complex.'] },
    ],
    sources: [`${N3} p97–99`, `${F} ch. 28 (SNMP)`],
  },

  'cn-fault': {
    blocks: [
      '**Fault management** is the area of network management (one of the five ISO areas: configuration, fault, performance, security, accounting) responsible for keeping the network **operating properly**: detecting, isolating, correcting and preventing faults. Its **purpose** is to minimise downtime: complex networks have hundreds of components, and the network must work correctly even when components fail.',
      'It has **two subsystems**:',
      { h: '1. Reactive fault management' },
      'Responsible for **detecting, isolating, correcting and recording faults**; it handles **short-term** solutions to faults.',
      { ol: ['**Detect** the fault: find its exact location (e.g. a trap or a failed poll shows a link is down).', '**Isolate** the fault: if it affects only a few users, isolate them so others are not affected; notify the affected users.', '**Correct** the fault: replace or repair the faulty component(s).', '**Record** the fault: document the exact location, possible cause, actions taken, cost and time per step. This helps with future problems, estimates the frequency of failures and supports planning.'] },
      { h: '2. Proactive fault management' },
      'Tries to **prevent faults from occurring**. Although prevention is not always possible, some failures can be predicted and avoided: e.g. if the manufacturer specifies a component\'s lifetime, it can be **replaced before** that time; if a fault happens frequently at a particular point in the network, the network can be **reconfigured** to avoid it. Monitoring trends (rising error counters, temperature) gives early warning.',
      'SNMP supports fault management through polling (GetRequest) and asynchronous traps.',
    ],
    sources: [`${F} ch. 28 (network management: fault management)`, `${N3} p97–98`],
  },

  'cn-app-protocols': {
    blocks: [
      { table: { head: ['Protocol', 'Purpose', 'Transport / port'], rows: [
        ['**DNS**', 'Name-to-address resolution', 'UDP/TCP 53'],
        ['**SMTP**', 'Sending and relaying e-mail', 'TCP 25 (587 submission)'],
        ['**POP3**', 'Downloading e-mail from a mailbox', 'TCP 110'],
        ['**IMAP4**', 'Accessing e-mail kept on the server', 'TCP 143'],
        ['**FTP**', 'File transfer', 'TCP 20/21'],
        ['**TELNET**', 'Remote login (terminal)', 'TCP 23'],
        ['**SSH**', 'Secure remote login and file transfer', 'TCP 22'],
        ['**HTTP / HTTPS**', 'Web pages', 'TCP 80 / 443'],
        ['**SNMP**', 'Network management', 'UDP 161/162'],
        ['**DHCP**', 'Automatic IP address configuration', 'UDP 67/68'],
        ['**TFTP**', 'Trivial file transfer (booting devices)', 'UDP 69'],
        ['**NTP**', 'Clock synchronisation', 'UDP 123'],
      ] } },
      { img: 'cn-p39' },
    ],
    sources: [`${N3} p70, p84–99`, `${F} ch. 25–28`],
  },

  'cn-pred-telnet': {
    blocks: [
      '**TELNET (TErminaL NETwork)** is a general-purpose client–server application for **remote login**: it lets a user at one computer log in to a remote computer and use it as if the user\'s terminal were directly attached. It runs over **TCP port 23**.',
      { h: 'Local vs remote login' },
      { ul: ['**Local login**: the terminal driver passes keystrokes directly to the local OS.', '**Remote login**: keystrokes go to the **TELNET client**, which converts them to a universal character set and sends them over TCP to the remote machine; the **TELNET server** passes them to a **pseudo-terminal driver**, which hands them to the remote OS as if typed locally. Output travels back the same way.'] },
      { h: 'Network Virtual Terminal (NVT)' },
      'Different computers use different character sets and control keys (e.g. end-of-file is Ctrl-Z on DOS, Ctrl-D on Unix). TELNET solves this with a universal interface, the **NVT**: the client translates local characters into **NVT characters**, and the server translates NVT characters into the form the remote computer understands.',
      { ul: ['**NVT character set**: data characters are 8-bit (7-bit ASCII with the high bit 0); control characters have the high bit 1.', '**Control characters** are preceded by **IAC (Interpret As Command, 255)**: e.g. IAC IP (interrupt process), IAC AO (abort output), IAC EC (erase character), IAC EL (erase line), IAC AYT (are you there).'] },
      { h: 'Options and negotiation' },
      'Client and server negotiate options (echo, binary transmission, terminal type, window size, suppress go-ahead) with **WILL, WONT, DO, DONT** commands (e.g. "IAC DO ECHO").',
      { h: 'Modes' },
      '**Default mode** (echo by client, line sent when complete), **character mode** (each character sent and echoed by the server), **line mode** (client edits and echoes the line).',
      { h: 'Security' },
      'TELNET sends everything, including passwords, in **plain text**; it has been replaced by **SSH** for remote login, but is still used for testing connectivity to TCP services.',
    ],
    sources: [`${N3} p91–94`, `${F} ch. 26 (TELNET)`],
  },

  'cn-pred-email-format': {
    blocks: [
      'An e-mail message (RFC 5322, formerly RFC 822) has an **envelope** and the **message** itself. The envelope (MAIL FROM, RCPT TO in SMTP) is used by the MTAs for delivery. The message consists of a **header**, a **blank line**, and the **body**.',
      { h: 'Header fields' },
      { table: { head: ['Header', 'Meaning'], rows: [
        ['**To:**', 'E-mail address(es) of the primary recipient(s)'],
        ['**Cc:**', 'Address(es) of secondary (carbon-copy) recipients'],
        ['**Bcc:**', 'Blind carbon copies: not shown to other recipients'],
        ['**From:**', 'Person or people who created the message'],
        ['**Sender:**', 'Address of the actual sender (if different from From)'],
        ['**Received:**', 'Line added by each MTA along the way (trace)'],
        ['**Return-Path:**', 'Path back to the sender (for bounces)'],
        ['**Date:**', 'Date and time the message was sent'],
        ['**Reply-To:**', 'Address to which replies should be sent'],
        ['**Message-Id:**', 'Unique number for referencing this message'],
        ['**In-Reply-To:**', 'Message-Id of the message this is a reply to'],
        ['**References:**', 'Other relevant Message-Ids'],
        ['**Keywords:**', 'User-chosen keywords'],
        ['**Subject:**', 'Short summary for the one-line display'],
      ] } },
      { h: 'Body' },
      'Free text in 7-bit ASCII lines; **MIME** extends this with content types and encodings for attachments, HTML and other languages.',
      { code: 'From: Alice <alice@example.com>\nTo: bob@cbit.ac.in\nCc: carol@example.com\nDate: Mon, 3 Nov 2026 10:15:00 +0530\nSubject: Mid-2 timetable\nMessage-Id: <1234@example.com>\n\nHi Bob,\nThe Mid-2 timetable is out.\n-- Alice' },
    ],
    sources: [`${N3} p85`, `${T} §7.2.3`],
  },
}
