"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Clock,
  Zap,
  BookMarked,
  ChevronRight,
  Check,
  X,
  RotateCw,
  FileText,
  Download,
  Trash2,
  BookOpen,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

// ==========================================
// SEEDED DEFAULT NOTES DATA
// ==========================================
const DEFAULT_NOTES = [
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

const DEFAULT_STATS = {
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

const DEFAULT_SESSION = {
  lastRevisedSubject: "Operating Systems",
  lastRevisionDate: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  lastRevisionMode: "flashcards",
  masteredConcepts: 11,
  confidenceScore: 4.2
};

// ==========================================
// REGEX CONCEPTS EXTRACTOR FOR CUSTOM NOTES
// ==========================================
interface Concept {
  question: string;
  answer: string;
}

function parseConceptsFromNote(content: string): Concept[] {
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
const getSubjectRevisionContent = (subjectName: string, noteContent: string) => {
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

export default function RevisePage() {
  // Global States
  const [savedNotes, setSavedNotes] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [lastSession, setLastSession] = useState<any | null>(null);

  // Active Subject & Mode
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<string | null>(null);

  // Modal note preview state
  const [selectedNote, setSelectedNote] = useState<any | null>(null);

  // Flashcards Drill State
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [drillCompleted, setDrillCompleted] = useState(false);
  const [drillScore, setDrillScore] = useState({ gotIt: 0, review: 0 });
  const [conceptStates, setConceptStates] = useState<any>({});

  // ==========================================
  // INITIAL DATA SEEDING AND LOADING
  // ==========================================
  useEffect(() => {
    // 1. Seed defaults on first run
    const seeded = localStorage.getItem("campusOS_revision_seeded");
    if (!seeded) {
      const existingNotes = JSON.parse(localStorage.getItem("campusOS_saved_notes") || "[]");
      const newNotes = [...existingNotes];
      DEFAULT_NOTES.forEach(dn => {
        if (!newNotes.some(n => n.subject.toLowerCase() === dn.subject.toLowerCase())) {
          newNotes.push(dn);
        }
      });
      localStorage.setItem("campusOS_saved_notes", JSON.stringify(newNotes));
      localStorage.setItem("campusOS_revision_stats", JSON.stringify(DEFAULT_STATS));
      localStorage.setItem("campusOS_last_session", JSON.stringify(DEFAULT_SESSION));
      localStorage.setItem("campusOS_revision_seeded", "true");
    }

    // 2. Load data
    loadFromLocalStorage();
  }, []);

  const loadFromLocalStorage = () => {
    const notes = JSON.parse(localStorage.getItem("campusOS_saved_notes") || "[]");
    notes.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setSavedNotes(notes);

    const loadedStats = JSON.parse(localStorage.getItem("campusOS_revision_stats") || "{}");
    const updatedStats = { ...loadedStats };
    let statsChanged = false;

    // Build fallback stats if notes have no stats yet
    notes.forEach((note: any) => {
      if (!updatedStats[note.subject]) {
        const concepts = parseConceptsFromNote(note.content);
        const total = concepts.length || 1;
        updatedStats[note.subject] = {
          mastered: Math.round(total * 0.5),
          total: total,
          confidence: 3.2,
          weak: Math.round(total * 0.3),
          conceptStates: {}
        };
        statsChanged = true;
      }
    });

    if (statsChanged) {
      localStorage.setItem("campusOS_revision_stats", JSON.stringify(updatedStats));
    }
    setStats(updatedStats);

    const session = JSON.parse(localStorage.getItem("campusOS_last_session") || "null");
    setLastSession(session);
  };

  // Helper: Format relative revision time
  const formatRelativeTime = (dateStr: string) => {
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

  // Helper: Get Badge Color based on score
  const getConfidenceBadgeColor = (score: number) => {
    if (score >= 4.5) return "bg-emerald-50 text-emerald-700 border border-emerald-100";
    if (score >= 3.5) return "bg-amber-50 text-amber-700 border border-amber-100";
    return "bg-rose-50 text-rose-700 border border-rose-100";
  };

  // ==========================================
  // ACTION LOGICS
  // ==========================================
  const handleSelectMode = (mode: string) => {
    setActiveMode(mode);

    // Save session state immediately
    const subjectStats = stats[activeSubject!] || { mastered: 0, total: 1, confidence: 3.0, weak: 0 };
    const session = {
      lastRevisedSubject: activeSubject!,
      lastRevisionDate: new Date().toISOString(),
      lastRevisionMode: mode,
      masteredConcepts: subjectStats.mastered,
      confidenceScore: subjectStats.confidence
    };
    setLastSession(session);
    localStorage.setItem("campusOS_last_session", JSON.stringify(session));

    // If flashcards, reset loops
    if (mode === "flashcards") {
      setCurrentCardIdx(0);
      setFlashcardFlipped(false);
      setDrillCompleted(false);
      setDrillScore({ gotIt: 0, review: 0 });
      setConceptStates(subjectStats.conceptStates || {});
    }
  };

  const handleResumeLastSession = () => {
    if (!lastSession) return;
    setActiveSubject(lastSession.lastRevisedSubject);
    handleSelectMode(lastSession.lastRevisionMode);
  };

  const handleConfidenceClick = (isMastered: boolean) => {
    const newConceptStates = { ...conceptStates };
    newConceptStates[currentCardIdx] = isMastered ? "strong" : "weak";
    setConceptStates(newConceptStates);

    setDrillScore(prev => ({
      gotIt: isMastered ? prev.gotIt + 1 : prev.gotIt,
      review: !isMastered ? prev.review + 1 : prev.review
    }));

    setFlashcardFlipped(false);
    
    // Wait for flip transition back to front before next card
    setTimeout(() => {
      const activeNote = savedNotes.find(n => n.subject === activeSubject);
      const revisionContent = getSubjectRevisionContent(activeSubject!, activeNote?.content || "");
      const totalCards = revisionContent.flashcards.length;

      if (currentCardIdx < totalCards - 1) {
        setCurrentCardIdx(prev => prev + 1);
      } else {
        // Compute final statistics
        let weakCount = 0;
        let mediumCount = 0;
        let strongCount = 0;

        for (let i = 0; i < totalCards; i++) {
          const state = newConceptStates[i] || "medium";
          if (state === "weak") weakCount++;
          else if (state === "medium") mediumCount++;
          else if (state === "strong") strongCount++;
        }

        const mastered = mediumCount + strongCount;
        // Weighted average confidence score mapping
        const confidence = Number(
          ((strongCount * 5.0 + mediumCount * 3.8 + weakCount * 2.0) / totalCards).toFixed(1)
        );

        const newStats = {
          ...stats,
          [activeSubject!]: {
            mastered,
            total: totalCards,
            confidence: Math.max(1.0, Math.min(5.0, confidence)),
            weak: weakCount,
            conceptStates: newConceptStates
          }
        };

        setStats(newStats);
        localStorage.setItem("campusOS_revision_stats", JSON.stringify(newStats));

        // Update last session with completed score
        const session = {
          lastRevisedSubject: activeSubject!,
          lastRevisionDate: new Date().toISOString(),
          lastRevisionMode: "flashcards",
          masteredConcepts: mastered,
          confidenceScore: confidence
        };
        setLastSession(session);
        localStorage.setItem("campusOS_last_session", JSON.stringify(session));

        setDrillCompleted(true);
      }
    }, 250);
  };

  const deleteNote = (id: string, subject: string) => {
    // 1. Remove note from savedNotes list
    const newNotes = savedNotes.filter(n => n.id !== id);
    setSavedNotes(newNotes);
    localStorage.setItem("campusOS_saved_notes", JSON.stringify(newNotes));

    // 2. Remove stats associated with it
    const newStats = { ...stats };
    delete newStats[subject];
    setStats(newStats);
    localStorage.setItem("campusOS_revision_stats", JSON.stringify(newStats));

    // 3. Reset lastSession if it matches this subject
    if (lastSession?.lastRevisedSubject === subject) {
      setLastSession(null);
      localStorage.removeItem("campusOS_last_session");
    }

    // 4. Return to main Hub and close modals
    setSelectedNote(null);
    setActiveSubject(null);
    setActiveMode(null);
  };

  const downloadPDF = (note: any) => {
    try {
      window.print();
    } catch (e) {
      console.error(e);
      alert("Failed to open print PDF preview");
    }
  };

  // Load content elements for current view
  const activeNote = savedNotes.find(n => n.subject === activeSubject);
  const revisionContent = activeSubject ? getSubjectRevisionContent(activeSubject, activeNote?.content || "") : null;
  const activeSubjectStats = activeSubject ? stats[activeSubject] || { mastered: 0, total: 1, confidence: 3.0, weak: 0 } : null;

  // Render Queue dynamic mapping:
  const queueWeak = activeSubjectStats?.weak ?? 0;
  const queueStrong = activeSubjectStats?.conceptStates 
    ? Object.values(activeSubjectStats.conceptStates).filter(s => s === "strong").length 
    : Math.round((activeSubjectStats?.mastered ?? 0) * 0.6);
  const queueMedium = (activeSubjectStats?.total ?? 1) - queueWeak - queueStrong;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 px-4 pt-12 pb-28 max-w-md mx-auto relative overflow-hidden">
      
      {/* ==========================================
          HEADER SYSTEM
          ========================================== */}
      <header className="flex items-center gap-4 mb-6">
        {activeMode ? (
          <button
            onClick={() => setActiveMode(null)}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        ) : activeSubject ? (
          <button
            onClick={() => setActiveSubject(null)}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        ) : (
          <Link href="/">
            <button className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">
              <ChevronLeft className="w-6 h-6" />
            </button>
          </Link>
        )}
        
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {activeMode 
              ? activeMode === "5min" 
                ? "5 Min Recap" 
                : activeMode === "exam" 
                  ? "Exam Night" 
                  : "Recall Drill"
              : activeSubject 
                ? activeSubject 
                : "Revision Hub"
            }
          </h1>
          <p className="text-xs font-semibold text-slate-400 mt-0.5 leading-snug">
            {activeMode 
              ? activeSubject 
              : activeSubject 
                ? `${activeSubjectStats?.total} Concepts` 
                : "Choose notes to review and strengthen concepts"
            }
          </p>
        </div>
      </header>

      {/* ==========================================
          SCREEN VIEWS CONTROLLER
          ========================================== */}
      <AnimatePresence mode="wait">
        
        {/* ------------------------------------------
            SCREEN 1: REVISION HUB (NEW ENTRY SCREEN)
            ------------------------------------------ */}
        {!activeSubject && !activeMode && (
          <motion.div
            key="revision-hub-screen"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* SECTION 1: CONTINUE LAST REVISION */}
            {lastSession && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-600/15 relative overflow-hidden"
              >
                {/* Background glow design */}
                <div className="absolute right-0 top-0 w-36 h-36 bg-white/5 rounded-full -mr-8 -mt-8 blur-2xl" />
                
                <span className="text-[10px] font-black text-indigo-200 bg-white/10 px-3 py-1 rounded-full uppercase tracking-wider">
                  Continue Learning
                </span>
                
                <h3 className="text-xl font-black mt-3">{lastSession.lastRevisedSubject}</h3>
                
                <p className="text-xs text-indigo-200 font-bold mt-1">
                  {formatRelativeTime(lastSession.lastRevisionDate)}
                </p>

                <div className="flex justify-between items-center mt-6 pt-5 border-t border-white/10">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-200 block">Progress</span>
                    <span className="text-sm font-black mt-1 block">
                      {lastSession.masteredConcepts} concepts mastered
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-200 block">Confidence</span>
                    <span className="text-sm font-black mt-1 block">
                      {lastSession.confidenceScore.toFixed(1)} / 5.0
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleResumeLastSession}
                  className="w-full bg-white hover:bg-slate-100 text-indigo-600 font-bold text-xs py-3.5 rounded-2xl mt-5 transition-transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  Resume Session <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* SECTION 2: YOUR NOTES */}
            <div className="space-y-4">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Your Notes</h2>
              
              {savedNotes.length > 0 ? (
                <div className="space-y-3">
                  {savedNotes.map((note) => {
                    const subjectStat = stats[note.subject] || { mastered: 0, total: 1, confidence: 3.0, weak: 0 };
                    const masteredPercent = Math.min(100, Math.round((subjectStat.mastered / subjectStat.total) * 100));
                    
                    return (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => setActiveSubject(note.subject)}
                        className="bg-white border border-slate-200/80 p-5 rounded-[2rem] hover:border-indigo-400 transition-colors duration-200 cursor-pointer relative shadow-sm group"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-0.5">
                            <h3 className="font-bold text-slate-800 text-base leading-tight group-hover:text-indigo-600 transition-colors">
                              {note.subject}
                            </h3>
                            <span className="text-[10px] font-bold text-slate-400 block pt-0.5">
                              {subjectStat.total} Concepts • {masteredPercent}% Mastered
                            </span>
                          </div>
                          
                          {/* Confidence badge (colored scale badge) */}
                          <motion.span
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getConfidenceBadgeColor(subjectStat.confidence)}`}
                          >
                            Conf {subjectStat.confidence.toFixed(1)}/5
                          </motion.span>
                        </div>

                        {/* Progress Bar (Animated) */}
                        <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${masteredPercent}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full"
                          />
                        </div>

                        {/* Note Card Footer Pills */}
                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-50">
                          <div className="flex items-center gap-2">
                            {subjectStat.weak > 0 && (
                              <span className="text-[9px] font-bold bg-rose-50 text-rose-700 px-2.5 py-1 rounded-md border border-rose-100 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                {subjectStat.weak} Weak Topics
                              </span>
                            )}
                            <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-100 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {subjectStat.mastered} Mastered
                            </span>
                          </div>
                          
                          <ChevronRight className="w-4 h-4 text-slate-350 group-hover:text-indigo-500 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                /* EMPTY STATE */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-slate-200 p-8 rounded-[2rem] text-center shadow-sm"
                >
                  <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">No Notes Available</h3>
                  <p className="text-xs text-slate-500 mt-1.5 max-w-[240px] mx-auto leading-normal">
                    Capture a whiteboard or upload lecture notes to start revision.
                  </p>
                  
                  <Link href="/">
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-xl mt-6 transition-transform active:scale-[0.98] cursor-pointer shadow-md shadow-indigo-600/10">
                      Go To Learn
                    </button>
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* ------------------------------------------
            SCREEN 2: SUBJECT REVISION DASHBOARD
            ------------------------------------------ */}
        {activeSubject && !activeMode && (
          <motion.div
            key="subject-dashboard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Header statistics info */}
            <div className="bg-white border border-slate-200/80 p-5 rounded-[2rem] shadow-sm">
              <div>
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Selected Subject</span>
                <h2 className="text-lg font-black text-slate-800 leading-tight mt-0.5">{activeSubject}</h2>
              </div>
              
              <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setSelectedNote(activeNote)}
                  className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold text-xs py-3 rounded-xl transition-transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" /> View Full Notes
                </button>
                <button
                  onClick={() => deleteNote(activeNote.id, activeNote.subject)}
                  className="bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-700 font-bold text-xs px-4 rounded-xl transition-transform active:scale-[0.98] flex items-center justify-center cursor-pointer"
                  title="Delete notes and statistics"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* REVISION MODES SELECTION */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Revision Methods</h3>
              
              {/* 5 Min Recap */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelectMode("5min")}
                className="w-full flex items-center justify-between p-5 rounded-3xl border border-slate-200/80 text-left bg-white transition-all hover:border-indigo-400 cursor-pointer shadow-sm group"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-slate-800 text-sm block group-hover:text-indigo-600 transition-colors">
                    5 Min Recap
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                    Quick revision summary
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-350 group-hover:text-indigo-500 transition-colors shrink-0" />
              </motion.button>

              {/* Recall Drill */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelectMode("flashcards")}
                className="w-full flex items-center justify-between p-5 rounded-3xl border border-slate-200/80 text-left bg-white transition-all hover:border-indigo-400 cursor-pointer shadow-sm group"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-slate-800 text-sm block group-hover:text-indigo-600 transition-colors">
                    Recall Drill
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                    Flashcards + confidence tracking
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-350 group-hover:text-indigo-500 transition-colors shrink-0" />
              </motion.button>

              {/* Exam Night */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelectMode("exam")}
                className="w-full flex items-center justify-between p-5 rounded-3xl border border-slate-200/80 text-left bg-white transition-all hover:border-indigo-400 cursor-pointer shadow-sm group"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-slate-800 text-sm block group-hover:text-indigo-600 transition-colors">
                    Exam Night
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                    Likely questions + common mistakes
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-350 group-hover:text-indigo-500 transition-colors shrink-0" />
              </motion.button>
            </div>



            {/* REVIEW QUEUE CARD */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Review Queue</h3>
              
              <div className="bg-white border border-slate-200/80 p-5 rounded-[2rem] shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-850 text-sm">Active Queue Status</h4>
                    <p className="text-[9px] font-bold text-slate-400 mt-0.5">
                      Confidence indicators updated dynamically
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100/30 px-3 py-1 rounded-full">
                    {activeSubjectStats?.mastered} / {activeSubjectStats?.total} Mastered
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span>Weak Concepts</span>
                    </div>
                    <span className="bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-lg border border-rose-100 text-[10px]">
                      {queueWeak} {queueWeak === 1 ? "Card" : "Cards"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>Medium Concepts</span>
                    </div>
                    <span className="bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-lg border border-amber-100 text-[10px]">
                      {queueMedium} {queueMedium === 1 ? "Card" : "Cards"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>Strong Concepts</span>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-lg border border-emerald-100 text-[10px]">
                      {queueStrong} {queueStrong === 1 ? "Card" : "Cards"}
                    </span>
                  </div>
                </div>

                {/* Progress bar mapping */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden relative mt-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round(((activeSubjectStats?.mastered ?? 0) / (activeSubjectStats?.total ?? 1)) * 100)}%` }}
                    className="bg-indigo-600 h-full rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ------------------------------------------
            REVISION MODE: 5 MIN RECAP
            ------------------------------------------ */}
        {activeSubject && activeMode === "5min" && (
          <motion.div
            key="recap-screen"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="space-y-5"
          >
            <div className="bg-white border border-slate-200/80 p-6 rounded-[2rem] shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <span className="text-[9px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-md uppercase tracking-wider">
                  Summary Highlights
                </span>
                <button
                  onClick={() => setActiveMode(null)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  Exit Mode
                </button>
              </div>

              <div className="space-y-4">
                {revisionContent?.recap.map((point, idx) => {
                  const cleanPoint = point.replace(/^[•\-\*\s]+/, "");
                  const hasBoldTitle = cleanPoint.includes(":");
                  let title = "";
                  let description = cleanPoint;

                  if (hasBoldTitle) {
                    const parts = cleanPoint.split(":");
                    title = parts[0].trim();
                    description = parts.slice(1).join(":").trim();
                  }

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-start gap-3 text-xs leading-relaxed"
                    >
                      <span>
                        {title && <strong className="font-bold text-slate-800">{title}: </strong>}
                        <span className="text-slate-600 font-medium">{description}</span>
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ------------------------------------------
            REVISION MODE: EXAM NIGHT
            ------------------------------------------ */}
        {activeSubject && activeMode === "exam" && (
          <motion.div
            key="exam-screen"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1 rounded-md uppercase tracking-wider">
                Exam Prep Checklist
              </span>
              <button
                onClick={() => setActiveMode(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                Exit Mode
              </button>
            </div>

            <div className="space-y-3">
              {revisionContent?.exam.map((item, idx) => {
                const isPitfall = item.type === "Common Pitfall" || item.type.toLowerCase().includes("pitfall");
                const cleanDesc = item.desc
                  .split("\n")
                  .map(line => line.replace(/^[•\-\*\s]+/, ""))
                  .join("\n");
                
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white border border-slate-200/80 p-5 rounded-[2rem] shadow-sm space-y-2.5"
                  >
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                      isPitfall 
                        ? "bg-rose-50 text-rose-600 border-rose-100" 
                        : "bg-indigo-50 text-indigo-600 border-indigo-100"
                    }`}>
                      {item.type}
                    </span>
                    
                    <h4 className="font-bold text-slate-850 text-xs mt-1">
                      {item.title}
                    </h4>
                    
                    <p className="text-[11px] font-medium text-slate-500 leading-relaxed whitespace-pre-wrap">
                      {cleanDesc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ------------------------------------------
            REVISION MODE: RECALL DRILL (FLASHCARDS LOOP)
            ------------------------------------------ */}
        {activeSubject && activeMode === "flashcards" && (
          <motion.div
            key="flashcard-drill-screen"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="flex-1 flex flex-col min-h-[360px]"
          >
            {drillCompleted ? (
              /* Completed screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm text-center flex flex-col items-center justify-center my-auto min-h-[300px]"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-800">Drill Completed!</h3>
                <p className="text-xs font-semibold text-slate-500 mt-2 mb-6 max-w-[240px] mx-auto leading-normal">
                  Your confidence levels and stats have been updated in your profile.
                </p>

                <div className="w-full max-w-[220px] bg-slate-50 border border-slate-100 rounded-2xl p-3.5 mb-6 flex justify-around text-xs font-bold text-slate-600">
                  <div>
                    <span className="block text-emerald-600 text-lg font-black">{drillScore.gotIt}</span>
                    <span className="text-[10px] text-slate-450 uppercase tracking-wider">Got It</span>
                  </div>
                  <div className="w-px h-8 bg-slate-200 self-center" />
                  <div>
                    <span className="block text-amber-600 text-lg font-black">{drillScore.review}</span>
                    <span className="text-[10px] text-slate-450 uppercase tracking-wider">Review</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveMode(null);
                    loadFromLocalStorage(); // refresh main hub stats on back
                  }}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 transition-transform active:scale-[0.98] cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </motion.div>
            ) : (
              /* Flashcard Active Loop */
              <>
                <div className="flex justify-between items-center mb-4 px-1">
                  <span className="text-xs font-bold text-slate-400">
                    Concept {currentCardIdx + 1} of {revisionContent?.flashcards.length}
                  </span>
                  <button
                    onClick={() => setActiveMode(null)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    End Session
                  </button>
                </div>

                {/* Perspective Flip Card Container */}
                <div
                  className="w-full h-[280px] relative cursor-pointer mb-6"
                  onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                  style={{ perspective: "1000px" }}
                >
                  <motion.div
                    className="w-full h-full absolute inset-0"
                    animate={{ rotateY: flashcardFlipped ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 220, damping: 20 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Front side of Card */}
                    <div
                      className="absolute inset-0 bg-white border border-slate-200/80 rounded-[2rem] p-6 flex flex-col items-center justify-center shadow-sm"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <span className="absolute top-6 left-6 text-[9px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                        Question
                      </span>
                      
                      <h3 className="text-lg font-black text-slate-800 text-center leading-snug px-3">
                        {revisionContent?.flashcards[currentCardIdx]?.question}
                      </h3>
                      
                      <p className="absolute bottom-6 text-[10px] font-bold text-slate-400 flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 select-none">
                        <RotateCw className="w-3.5 h-3.5" /> Tap to reveal answer
                      </p>
                    </div>

                    {/* Back side of Card */}
                    <div
                      className="absolute inset-0 bg-slate-900 text-white border border-slate-950 rounded-[2rem] p-6 flex flex-col items-center justify-center shadow-lg"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)"
                      }}
                    >
                      <span className="absolute top-6 left-6 text-[9px] font-black text-indigo-300 bg-white/10 border border-white/5 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                        Answer Definition
                      </span>
                      
                      <div className="text-left w-full text-xs font-semibold leading-relaxed whitespace-pre-wrap px-3 text-slate-200 overflow-y-auto max-h-[160px] scrollbar-thin">
                        {revisionContent?.flashcards[currentCardIdx]?.answer
                          .split("\n")
                          .map(line => line.replace(/^[•\-\*\s]+/, ""))
                          .join("\n")}
                      </div>
                      
                      <p className="absolute bottom-4 text-[9px] font-bold text-slate-500 select-none">
                        Tap card to flip back
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Adaptive confidence buttons */}
                <AnimatePresence>
                  {flashcardFlipped && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="flex flex-col gap-3 pt-2"
                    >
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">
                        Did you recall this concept?
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfidenceClick(true);
                          }}
                          className="flex items-center justify-center gap-2 py-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold text-xs transition-colors border border-emerald-100 cursor-pointer"
                        >
                          <Check className="w-4 h-4" /> Got It
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfidenceClick(false);
                          }}
                          className="flex items-center justify-center gap-2 py-3.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl font-bold text-xs transition-colors border border-amber-100 cursor-pointer"
                        >
                          <RotateCw className="w-4 h-4" /> Review Again
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          MODAL: RAW NOTE VIEWER MODAL
          ========================================== */}
      <AnimatePresence>
        {selectedNote && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[100] flex flex-col max-w-md mx-auto"
          >
            {/* Grab Drag indicator handle */}
            <div
              className="flex justify-center pt-3 pb-2 bg-white cursor-pointer"
              onClick={() => setSelectedNote(null)}
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>

            {/* Header controls inside notes view */}
            <div className="flex justify-between items-center px-4 py-3 bg-white border-b border-slate-100 relative z-50">
              <button
                onClick={() => setSelectedNote(null)}
                className="w-9 h-9 flex items-center justify-center text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="font-bold text-slate-800 truncate flex-1 text-center mx-4 text-xs">
                {selectedNote.subject} Notes
              </h2>
              <button
                onClick={() => deleteNote(selectedNote.id, selectedNote.subject)}
                className="w-9 h-9 flex items-center justify-center text-red-500 bg-red-50 hover:bg-red-100 rounded-full cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Markdown notes content container */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
              <div
                id="saved-notes-pdf-container"
                className="bg-white mx-auto shadow-sm border border-slate-200 p-6 rounded-[2rem] max-w-sm"
              >
                <div className="border-b border-slate-200 pb-3 mb-4">
                  <h1 className="text-lg font-black text-slate-900 leading-tight">
                    {selectedNote.subject} Notes
                  </h1>
                  <p className="text-slate-400 font-bold mt-1 text-[9px]">
                    Scanned via CampusOS • {new Date(selectedNote.date).toLocaleDateString()}
                  </p>
                </div>

                <article className="text-slate-700 text-xs font-semibold leading-relaxed whitespace-pre-wrap prose prose-slate">
                  <ReactMarkdown>{selectedNote.content}</ReactMarkdown>
                </article>
              </div>
            </div>

            {/* Action footer button */}
            <div className="p-4 border-t border-slate-100 bg-white pb-8 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
              <button
                onClick={() => downloadPDF(selectedNote)}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-3.5 rounded-2xl active:scale-[0.98] transition-transform flex items-center justify-center gap-2 text-xs shadow-md shadow-indigo-200 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Print / Download as PDF
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
