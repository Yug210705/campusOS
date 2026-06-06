import ReactMarkdown from "react-markdown";

// ==========================================
// SEEDED DEFAULT NOTES DATA
// ==========================================
export const DEFAULT_NOTES = [
  {
    id: "seed_os",
    subject: "Operating Systems",
    date: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
    content: `# Operating Systems Lecture Notes

**Concept 1: Process State Transition**
Processes cycle through states: New, Ready, Running, Waiting, and Terminated.
• Active switching is managed by the OS Scheduler.
• PCB (Process Control Block) tracks the CPU registers and program counter.

**Concept 2: CPU Scheduling Algorithms**
Used to allocate CPU execution slots.
• FCFS: Non-preemptive, suffers from Convoy Effect.
• SJF: Optimal average waiting time but requires future burst knowledge.
• Round Robin: Preemptive, uses fixed time quantum (slice).

**Concept 3: Paging and Page Table**
Memory management scheme that eliminates the need for contiguous physical memory.
• Pages: Logical memory divisions of equal size.
• Frames: Physical memory divisions.
• Page Table: Map logical addresses to physical frame numbers.

**Concept 4: Virtual Memory & Page Faults**
Execution of processes that are not completely in memory.
• Page Fault: Hardware interrupt when page table entry indicates page is not in physical RAM.
• Swap Space: Dedicated disk space to hold inactive pages.

**Concept 5: Thrashing**
High paging activity where the system spends more time swapping pages than executing instructions.
• Cause: Total working set size exceeds physical RAM capacity.
• Solution: Reduce degree of multiprogramming.

**Concept 6: Mutex vs Semaphore**
Synchronization mechanisms to prevent race conditions.
• Mutex: Binary locking mechanism (one thread at a time).
• Semaphore: Signaling mechanism using integer counters.

**Concept 7: Deadlocks**
A state where a set of processes are blocked because each process holds a resource and waits for another.
• Conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.

**Concept 8: Cache Coherence**
Ensuring all CPU cores read the correct, latest value of memory caches.
• Snooping Protocols (MESI).

**Concept 9: System Calls**
The programmatic interface between a running application and the OS kernel.
• Fork: Creates a new child process.
• Execve: Replaces the current process image with a new executable.

**Concept 10: RAID Levels**
Redundant Array of Independent Disks configurations for data reliability/performance.
• RAID 0: Striping (performance, no redundancy).
• RAID 1: Mirroring (redundancy).
• RAID 5: Block-level striping with distributed parity.

**Concept 11: File Allocation Methods**
Methods to store file blocks on disk.
• Contiguous, Linked List, Indexed (e.g. Inodes).

**Concept 12: TLB (Translation Lookaside Buffer)**
A high-speed cache inside CPU MMU to store recent page-to-frame translations.

**Concept 13: Inter-Process Communication (IPC)**
Mechanisms allowing processes to exchange data.
• Shared Memory, Message Queues, Pipes, Sockets.

**Concept 14: Belady's Anomaly**
Phenomenon where increasing page frames results in more page faults for FIFO page replacement.`
  },
  {
    id: "seed_dbms",
    subject: "DBMS",
    date: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    content: `# DBMS Lecture Notes

**Concept 1: ACID Properties**
Ensures database reliability and transactional integrity.
• Atomicity: All or nothing execution.
• Consistency: Database transitions state legally.
• Isolation: Transactions execute independently.
• Durability: Persisted updates survive crashes.

**Concept 2: Relational Database Schema**
Logical structure of relational databases.
• Relations (Tables), Attributes (Columns), and Tuples (Rows).
• Primary Key: Unique identifier.
• Foreign Key: Referential link.

**Concept 3: Database Normalization**
Design technique to minimize redundancy and dependency.
• 1NF: Atomic values.
• 2NF: 1NF + no partial dependency.
• 3NF: 2NF + no transitive dependency.
• BCNF: Determinants must be candidate keys.

**Concept 4: Transaction & Concurrency Control**
Managing simultaneous operations on the database.
• Locks: Shared (Read) vs Exclusive (Write).
• Two-Phase Locking (2PL): Growing and shrinking lock phases.

**Concept 5: Indexes (B+ Trees)**
Data structures that accelerate query retrieval rates.
• Balanced tree nodes optimizing disk block reads.
• Leaves form a linked list for fast sequential scans.

**Concept 6: SQL joins**
Merging records from multiple tables.
• Inner Join: Matching values.
• Left/Right Outer Join: Matching + unmatched rows from left/right table.

**Concept 7: Deadlocks in DBMS**
Cycle of waiting transactions.
• Wait-Die Scheme: Older transaction waits, younger dies.
• Wound-Wait Scheme: Older transaction wounds younger.

**Concept 8: NoSQL Databases**
Non-relational data models.
• Types: Document, Key-Value, Columnar, Graph.
• Eventual consistency vs strict ACID.

**Concept 9: Database Views**
Virtual tables generated by a query.
• Encapsulates complexity, secures raw attributes.

**Concept 10: DBMS Recovery (Write-Ahead Logging)**
Technique for crash recovery.
• Log records must be written to disk before changes.
• Redo/Undo recovery stages.

**Concept 11: Triggers & Stored Procedures**
Executable code inside database.
• Trigger: Auto-runs on INSERT/UPDATE/DELETE.`
  },
  {
    id: "seed_cn",
    subject: "Computer Networks",
    date: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    content: `# Computer Networks Lecture Notes

**Concept 1: OSI 7-Layer Model**
Standardized protocol stacks.
• Application, Presentation, Session, Transport, Network, Data Link, Physical.

**Concept 2: TCP vs UDP**
Transport layer protocols.
• TCP: Connection-oriented, reliable, flow control, slow start.
• UDP: Connectionless, fast, best-effort delivery.

**Concept 3: IP Addressing & Subnetting**
Network layer routing labels.
• IPv4 (32-bit) and IPv6 (128-bit) structures.
• Subnet Mask: Segregates network ID and host ID.

**Concept 4: DNS (Domain Name System)**
Translates human-readable domain names to IP addresses.
• Distributed hierarchical database structure.

**Concept 5: ARP (Address Resolution Protocol)**
Resolves IP addresses (Network Layer) to MAC addresses (Data Link Layer).

**Concept 6: Routing Protocols (RIP vs OSPF)**
Dynamic path computation.
• RIP: Distance Vector, uses hop count.
• OSPF: Link State, uses Dijkstra algorithm.

**Concept 7: Three-Way Handshake**
TCP connection establishment.
• SYN -> SYN-ACK -> ACK.

**Concept 8: NAT (Network Address Translation)**
Maps private IP addresses to a single public IP.`
  },
  {
    id: "seed_oop",
    subject: "OOP",
    date: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    content: `# OOP Fundamentals Lecture Notes

**Concept 1: Encapsulation**
Binding data (variables) and methods together inside classes.
• Protects internal state using access modifiers (private, protected).

**Concept 2: Inheritance**
Mechanism where a subclass inherits fields and methods of a superclass.
• Facilitates code reusability.

**Concept 3: Polymorphism**
Ability of a reference variable to take multiple forms.
• Method Overloading (Compile-time): Same name, different parameters.
• Method Overriding (Runtime): Subclass redefines parent method.

**Concept 4: Abstraction**
Hiding implementation details and showing only essential features.
• Interfaces and Abstract Classes.

**Concept 5: Association, Aggregation & Composition**
Relationships between objects.
• Aggregation: Has-a relationship (weak dependency, e.g. Department and Professor).
• Composition: Part-of relationship (strong dependency, e.g. Room and House).

**Concept 6: Constructor & Destructor**
Special member functions.
• Constructor: Initializes objects.
• Destructor: Cleans up resources when object goes out of scope.`
  }
];

export const DEFAULT_STATS = {
  "Operating Systems": {
    mastered: 11,
    total: 14,
    confidence: 4.2,
    weak: 3,
    conceptStates: {
      0: "weak", 1: "weak", 2: "weak",
      3: "medium", 4: "medium", 5: "medium", 6: "medium", 7: "medium",
      8: "strong", 9: "strong", 10: "strong", 11: "strong", 12: "strong", 13: "strong"
    }
  },
  "DBMS": {
    mastered: 7,
    total: 11,
    confidence: 3.8,
    weak: 4,
    conceptStates: {
      0: "weak", 1: "weak", 2: "weak", 3: "weak",
      4: "medium", 5: "medium", 6: "medium", 7: "medium",
      8: "strong", 9: "strong", 10: "strong"
    }
  },
  "Computer Networks": {
    mastered: 4,
    total: 8,
    confidence: 3.1,
    weak: 4,
    conceptStates: {
      0: "weak", 1: "weak", 2: "weak", 3: "weak",
      4: "medium", 5: "medium",
      6: "strong", 7: "strong"
    }
  },
  "OOP": {
    mastered: 5,
    total: 6,
    confidence: 4.8,
    weak: 1,
    conceptStates: {
      0: "weak",
      1: "strong", 2: "strong", 3: "strong", 4: "strong", 5: "strong"
    }
  }
};

export const DEFAULT_SESSION = {
  lastRevisedSubject: "Operating Systems",
  lastRevisedNoteId: "seed_os",
  lastRevisionDate: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  lastRevisionMode: "flashcards",
  masteredConcepts: 11,
  confidenceScore: 4.2
};

// ==========================================
// REGEX CONCEPTS EXTRACTOR FOR CUSTOM NOTES
// ==========================================
export interface Concept {
  question: string;
  answer: string;
}

export function parseConceptsFromNote(content: string): Concept[] {
  const concepts: Concept[] = [];
  
  // 1. Try finding bold lines: "**Concept 1: Process Transition**\nDescription"
  const boldRegex = /(?:\*\*|__)(?:Concept\s+\d+:\s*)?([^*_]+)(?:\*\*|__)\s*[:\-\u2013\u2014]?\s*\n?([^\*#_]+)/gi;
  const boldMatches = [...content.matchAll(boldRegex)];
  
  boldMatches.forEach(bm => {
    const q = bm[1].trim();
    const a = bm[2].trim().split(/\n\s*\n/)[0].trim(); // take first paragraph
    if (q && a && q.length < 100 && a.length > 15) {
      concepts.push({ question: q, answer: a });
    }
  });

  // 2. If no concepts matched, try headers: "## Concept Name"
  if (concepts.length === 0) {
    const headerRegex = /^(?:#{2,4})\s+(.+)$/gm;
    const sections: { title: string; startIndex: number; endIndex: number }[] = [];
    const headerMatches = [...content.matchAll(headerRegex)];
    
    for (let i = 0; i < headerMatches.length; i++) {
      const title = headerMatches[i][1].trim();
      const startIndex = headerMatches[i].index! + headerMatches[i][0].length;
      const endIndex = i + 1 < headerMatches.length ? headerMatches[i + 1].index! : content.length;
      sections.push({ title, startIndex, endIndex });
    }

    sections.forEach(sec => {
      const body = content.substring(sec.startIndex, sec.endIndex).trim();
      if (body) {
        concepts.push({
          question: sec.title,
          answer: body.split(/\n\s*\n/)[0].trim()
        });
      }
    });
  }

  // 3. Fallback: Split by double newlines and treat paragraphs as concepts
  if (concepts.length === 0) {
    const paragraphs = content.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 25);
    paragraphs.forEach((p, idx) => {
      if (p.includes("#") || p.includes("==")) return; // skip main headers
      const lines = p.split(/\n/);
      const q = lines[0].replace(/^[#\-\*\d\.\s]+/, '').trim();
      const a = lines.slice(1).join('\n').trim() || p;
      if (q && a && q.length < 90) {
        concepts.push({ question: q, answer: a });
      } else {
        concepts.push({ question: `Concept ${idx + 1}`, answer: p });
      }
    });
  }

  return concepts.slice(0, 25); // cap at 25 concepts
}

// ==========================================
// PRE-CODED SUBJECTS CONTENT HELPER
// ==========================================
export const getSubjectRevisionContent = (subjectName: string, noteContent: string) => {
  const lower = subjectName.toLowerCase();
  
  if (lower === "operating systems" || lower === "os") {
    return {
      recap: [
        "CPU Scheduling: Essential mechanism to partition CPU resources dynamically among executable threads.",
        "Preemptive vs Non-Preemptive: Preemptive algorithms interrupt processes forcibly (Round Robin), non-preemptive run in order (FCFS).",
        "Paging: Memory virtualization technique that avoids external fragmentation by mapping logical pages to physical frames.",
        "Virtual Memory & Page Faults: Swapping inactive memory blocks to secondary storage to run applications larger than RAM size.",
        "Thrashing: Severe paging thrash cycle where OS spends all resources executing memory swaps rather than useful process lines.",
        "Mutex vs Semaphore: Synchronization methods protecting critical section code segments via locking and flag signals.",
        "Deadlocks: Mutual exclusion, hold & wait, no preemption, and circular wait lock processes indefinitely."
      ],
      flashcards: [
        {
          question: "What is Thrashing in Virtual Memory?",
          answer: "• Swapping loop: OS spends more time loading/saving pages than running processes\n• Cause: Total active working sets exceed physical RAM size\n• Solution: Lower the degree of multiprogramming or add RAM"
        },
        {
          question: "What is a race condition in process synchronization?",
          answer: "• Concurrency error: Multiple processes write/read shared memory concurrently\n• Result: Final outcome is variable and depends on execution order\n• Prevention: Enforcing mutual exclusion locks (Mutex/Semaphore) in critical sections"
        },
        {
          question: "Why is context switching considered an overhead?",
          answer: "• Idle CPU: The CPU executes no useful user work during the swap\n• PCB Operations: Saving current register states and loading the next process state\n• Memory Cost: Cold cache lines read delays after transition"
        },
        {
          question: "Difference between Process and Thread?",
          answer: "• Process: Independent execution unit with its own address space, memory, and resources.\n• Thread: Sub-unit of a process, shares process memory, cheaper to create/context-switch."
        },
        {
          question: "What is a Page Fault?",
          answer: "• Interrupt: Raised by MMU when process tries to access page not present in physical RAM.\n• Handling: OS traps, loads missing page from swap disk, updates Page Table, restarts instruction."
        },
        {
          question: "What is Belady's Anomaly?",
          answer: "• Phenomenon: In FIFO page replacement, adding more page frames can cause MORE page faults.\n• Cause: FIFO does not respect stack property of replacement algorithms."
        },
        {
          question: "What is a Deadlock?",
          answer: "• Blocked state: Multiple processes are stuck waiting for resources held by each other.\n• Conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait."
        },
        {
          question: "What is TLB (Translation Lookaside Buffer)?",
          answer: "• Cache: Fast hardware cache inside MMU storing recent logical-to-physical translations.\n• Purpose: Minimizes memory lookup delay by avoiding full page table walks."
        },
        {
          question: "Difference between Preemptive and Non-Preemptive Scheduling?",
          answer: "• Preemptive: OS can interrupt a running process (e.g. Round Robin, SRTF).\n• Non-Preemptive: Process runs until it terminates or blocks (e.g. FCFS, SJF)."
        },
        {
          question: "Explain Virtual Memory.",
          answer: "• Virtualization: Separates user logical memory from physical RAM, allowing execution of processes larger than physical memory."
        },
        {
          question: "What are System Calls?",
          answer: "• API: Interface between user processes and kernel mode. (e.g., fork(), read(), write())."
        },
        {
          question: "Explain Cache Coherence.",
          answer: "• Consistency: Ensuring all processors in a multicore system read the correct, latest value from cache blocks."
        },
        {
          question: "What is Inter-Process Communication (IPC)?",
          answer: "• Exchange: Mechanisms allowing processes to transfer data (Pipes, Shared Memory, Message Queues)."
        },
        {
          question: "What is RAID?",
          answer: "• Storage: Redundant Array of Independent Disks combining disks for speed (RAID 0), mirroring (RAID 1), or parity (RAID 5)."
        }
      ],
      exam: [
        { type: "Common Pitfall", title: "Confusing Context Switching with Page Faults", desc: "• Context switches save process register states in PCB.\n• Page faults load physical memory blocks from secondary disk frames." },
        { type: "Common Pitfall", title: "Assuming Mutex and Semaphores are identical", desc: "• Mutex has an owner concept (only lock owner can release it).\n• Semaphores are signals, any thread can increment/decrement the count." },
        { type: "Likely Exam Q", title: "What causes thrashing and how is it resolved?", desc: "• Thrashing is caused when active working sets exceed RAM size, leading to continuous swapping.\n• Resolved by reducing active process counts (degree of multiprogramming) or adding RAM." },
        { type: "Likely Exam Q", title: "State the four necessary conditions for Deadlock.", desc: "• 1. Mutual Exclusion\n• 2. Hold and Wait\n• 3. No Preemption\n• 4. Circular Wait" }
      ]
    };
  }

  if (lower === "dbms") {
    return {
      recap: [
        "ACID Properties: Atomicity (all-or-nothing), Consistency (state legality), Isolation (independence), Durability (persistence).",
        "Normalization: Process of organizing data to avoid redundancy (1NF, 2NF, 3NF, BCNF).",
        "Two-Phase Locking (2PL): Concurrency protocol ensuring serializability using growing and shrinking locking phases.",
        "B+ Tree Index: Balanced search tree that optimizes database read operations by storing data in leaf nodes and pointers in internal nodes.",
        "SQL Joins: Joining data across multiple tables (Inner, Left/Right Outer, Full Outer, Cross Joins).",
        "Write-Ahead Logging (WAL): Ensures transaction persistence by writing log changes to disk before writing actual data blocks."
      ],
      flashcards: [
        { question: "What are ACID properties?", answer: "• Atomicity: All or nothing execution\n• Consistency: Database transitions legally\n• Isolation: Concurrent transactions don't interfere\n• Durability: Saved updates survive system crashes" },
        { question: "Explain Database Normalization.", answer: "• Minimizes redundancy:\n• 1NF: Atomic values\n• 2NF: No partial dependency (primary key fully determines attributes)\n• 3NF: No transitive dependency" },
        { question: "What is a B+ Tree Index?", answer: "• Balanced tree: Optimize disk lookup time\n• Features: All keys stored in leaf nodes, leaves linked for range queries" },
        { question: "Explain the two phases of 2PL (Two-Phase Locking).", answer: "• Growing Phase: Transaction acquires locks, cannot release any.\n• Shrinking Phase: Transaction releases locks, cannot acquire new ones." },
        { question: "Difference between Shared Lock and Exclusive Lock?", answer: "• Shared Lock (S): Multiple transactions can read data concurrently.\n• Exclusive Lock (X): Only one transaction can write data, blocks S and X locks." },
        { question: "What is a Transaction in DBMS?", answer: "• Logical unit: Group of operations executed as a single logical unit of work." },
        { question: "What is a Foreign Key?", answer: "• Constraint: Attribute linking to a primary key in another table to maintain referential integrity." },
        { question: "Explain SQL Inner Join vs Left Join.", answer: "• Inner Join: Returns records with matching values in both tables.\n• Left Join: Returns all records from left table, and matching records from right." },
        { question: "What is Deadlock in DBMS?", answer: "• Cycle: Set of transactions waiting for resources held by others in the set." },
        { question: "Explain Write-Ahead Logging (WAL).", answer: "• Recovery: Log changes are written to stable storage before the actual database buffer modifications are saved." },
        { question: "What is a Database View?", answer: "• Virtual Table: Dynamic result set generated by an SQL query, representing subset of base tables." }
      ],
      exam: [
        { type: "Common Pitfall", title: "Confusing 3NF with BCNF requirements", desc: "• 3NF allows A -> B if B is a prime attribute.\n• BCNF requires that for all A -> B, A must be a superkey." },
        { type: "Likely Exam Q", title: "Explain 2-Phase Locking and how it prevents concurrency conflicts.", desc: "• By splitting lock operations into Growing (acquiring) and Shrinking (releasing) phases, it guarantees serializability, though deadlock remains possible." }
      ]
    };
  }

  if (lower === "computer networks" || lower === "cn" || lower === "networks") {
    return {
      recap: [
        "OSI Reference Model: 7-layer stack describing network communication tasks from Physical to Application.",
        "TCP vs UDP: Connection-oriented reliable delivery (TCP) vs connectionless fast speed (UDP).",
        "Subnetting: Segmenting IP ranges to control routing, separate broadcast domains, and manage IP exhaustion.",
        "DNS: Resolves human-readable domain names to numerical IP addresses via hierarchical servers.",
        "ARP: Maps network-layer IP addresses to link-layer MAC addresses for local ethernet delivery.",
        "TCP Three-Way Handshake: Connection establishment sequence (SYN -> SYN-ACK -> ACK) syncing sequence numbers."
      ],
      flashcards: [
        { question: "What are the 7 layers of the OSI model?", answer: "• Application, Presentation, Session, Transport, Network, Data Link, Physical." },
        { question: "Difference between TCP and UDP?", answer: "• TCP: Connection-oriented, reliable (acks, retries), flow control.\n• UDP: Connectionless, fast (best effort, no guarantees)." },
        { question: "What is DNS?", answer: "• Directory: Translates hostname domains to IP addresses (e.g. google.com to 142.250.190.46)." },
        { question: "Explain ARP.", answer: "• Resolution: Finds MAC address associated with a given local IP address." },
        { question: "Describe the TCP 3-Way Handshake.", answer: "• SYN: Client sends sync packet\n• SYN-ACK: Server responds to sync\n• ACK: Client acknowledges connection active" },
        { question: "What is NAT (Network Address Translation)?", answer: "• Mapping: Replaces private IP addresses inside local network with single public IP for internet access." },
        { question: "What is the difference between Router and Switch?", answer: "• Switch: Connects devices inside same local network (Data Link Layer / Layer 2).\n• Router: Connects different networks (Network Layer / Layer 3)." },
        { question: "What is a Subnet Mask?", answer: "• Split: 32-bit number identifying which portion of IP address belongs to network vs host." }
      ],
      exam: [
        { type: "Common Pitfall", title: "Conflating ARP with DNS resolution", desc: "• DNS translates hostnames to IP addresses globally.\n• ARP translates IP addresses to hardware MAC addresses locally." },
        { type: "Likely Exam Q", title: "Walk through the TCP three-way handshake.", desc: "• 1. Client SYN (Seq=x)\n• 2. Server SYN-ACK (Seq=y, Ack=x+1)\n• 3. Client ACK (Ack=y+1)" }
      ]
    };
  }

  if (lower === "oop" || lower === "object oriented programming") {
    return {
      recap: [
        "Four OOP Pillars: Encapsulation (data hiding), Inheritance (reuse), Polymorphism (multiple forms), Abstraction (simplification).",
        "Polymorphism Types: Method Overloading (compile-time) vs Method Overriding (runtime).",
        "Abstract Classes vs Interfaces: Abstract class can store instance state/methods; interface represents pure contracts.",
        "Composition vs Aggregation: Composition is strong ownership (part-of), aggregation is weak association (has-a)."
      ],
      flashcards: [
        { question: "What is Encapsulation?", answer: "• Data Hiding: Grouping state variables and methods in a class, restricting direct access using private/protected modifiers." },
        { question: "Explain Inheritance.", answer: "• Code Reuse: Child class inherits fields/behaviors from parent class to construct hierarchical relationships." },
        { question: "What is Polymorphism?", answer: "• Multiple forms: Methods behave differently based on context.\n• Overloading: Same name, different parameters (compile-time).\n• Overriding: Child class redefines parent method (runtime)." },
        { question: "Difference between Abstraction and Encapsulation?", answer: "• Abstraction: Hides complexity (design level, e.g. interfaces).\n• Encapsulation: Hides data states (implementation level, e.g. private fields)." },
        { question: "Composition vs Aggregation?", answer: "• Composition: Strong association (child cannot exist without parent).\n• Aggregation: Weak association (child exists independently of parent)." },
        { question: "What is a Constructor?", answer: "• Special method: Runs automatically when object is created to initialize fields." }
      ],
      exam: [
        { type: "Common Pitfall", title: "Confusing Overloading with Overriding", desc: "• Overloading occurs in the same class (compile-time binding).\n• Overriding redefines parent method in subclass (runtime dynamic dispatch)." },
        { type: "Likely Exam Q", title: "What is Polymorphism and how does Method Overriding work?", desc: "• Polymorphism allows parent class references to point to child objects. At runtime, the runtime resolves overrides to call the child's method." }
      ]
    };
  }

  // Dynamic Parsing Fallback
  const parsedConcepts = parseConceptsFromNote(noteContent);
  const cards = parsedConcepts.map(pc => ({
    question: pc.question,
    answer: pc.answer
  }));

  if (cards.length === 0) {
    cards.push({
      question: `Core Definition in ${subjectName}`,
      answer: "No specific concepts were extracted. Review the full note content for complete study details."
    });
  }

  const recapPoints = cards.map(c => `${c.question}: ${c.answer}`);
  const examItems = cards.slice(0, 2).map((c, idx) => ({
    type: idx % 2 === 0 ? "Likely Exam Q" : "Common Pitfall",
    title: idx % 2 === 0 ? `Explain the core concept of ${c.question}` : `Pitfall involving ${c.question}`,
    desc: c.answer
  }));

  return {
    recap: recapPoints,
    flashcards: cards,
    exam: examItems
  };
};

export const getConfidenceBadgeColor = (score: number) => {
  if (score >= 4.5) return "bg-emerald-50 text-emerald-700 border border-emerald-100";
  if (score >= 3.5) return "bg-amber-50 text-amber-700 border border-amber-100";
  return "bg-rose-50 text-rose-700 border border-rose-100";
};

export const formatRelativeTime = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (60 * 1000));
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));

  if (diffMins < 1) return "Last revised just now";
  if (diffMins < 60) return `Last revised ${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
  if (diffHours < 24) return `Last revised ${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  return `Last revised on ${date.toLocaleDateString()}`;
};
