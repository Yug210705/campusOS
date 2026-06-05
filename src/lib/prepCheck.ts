export interface InterviewQuestion {
  question: string;
  answer: string;
  topic: string;
}

export interface PrepCheckResult {
  covered: string[];
  missing: string[];
  questions: InterviewQuestion[];
}

interface TopicConfig {
  name: string;
  keywords: string[];
  questions: Omit<InterviewQuestion, "topic">[];
}

export const SUBJECT_INTERVIEW_MAP: Record<string, TopicConfig[]> = {
  "Operating Systems": [
    {
      name: "CPU Scheduling",
      keywords: ["scheduling", "scheduler", "cpu"],
      questions: [
        {
          question: "Explain the difference between Preemptive and Non-Preemptive scheduling.",
          answer: "• Preemptive: OS can interrupt running processes to allocate CPU to others (e.g. Round Robin)\n• Non-Preemptive: Process holds the CPU until it voluntarily terminates or blocks (e.g. FCFS)"
        }
      ]
    },
    {
      name: "FCFS",
      keywords: ["fcfs", "first come"],
      questions: [
        {
          question: "What is the Convoy Effect in FCFS scheduling?",
          answer: "• Cause: A long CPU-bound process executes first\n• Effect: Fast, short I/O-bound processes pile up waiting in the ready queue\n• Result: High average waiting times and low overall device utilization"
        }
      ]
    },
    {
      name: "Round Robin",
      keywords: ["round robin", "quantum"],
      questions: [
        {
          question: "What happens if the time quantum in Round Robin is too large or too small?",
          answer: "• Large Quantum: Behaves exactly like FCFS (poor response times)\n• Small Quantum: Causes high context-switching overhead, wasting CPU cycles on administrative saving/loading"
        }
      ]
    },
    {
      name: "Process States",
      keywords: ["process state", "ready", "running", "waiting", "blocked", "terminated"],
      questions: [
        {
          question: "What is the difference between the Ready state and the Waiting state?",
          answer: "• Ready: Process is loaded in memory and prepared to run, waiting only for scheduler dispatch\n• Waiting/Blocked: Process cannot run until a specific event completes (like disk I/O or keypress)"
        }
      ]
    },
    {
      name: "Context Switching",
      keywords: ["context switch"],
      questions: [
        {
          question: "Why is context switching considered an overhead?",
          answer: "• CPU Idle time: No useful user-level instructions are executed during context switching\n• State saving: Consumes CPU cycles writing register status, Program Counter, and MMU mappings\n• Cache misses: Can cause cache pollution and cold cache read delays for the incoming process"
        }
      ]
    },
    {
      name: "Deadlocks",
      keywords: ["deadlock", "banker"],
      questions: [
        {
          question: "What are the four necessary conditions for a deadlock to occur?",
          answer: "• Mutual Exclusion: Resource can only be held by one process at a time\n• Hold & Wait: Process holding allocated resources can request more\n• No Preemption: Resources cannot be forcibly taken from a process\n• Circular Wait: A closed loop of processes waiting for each other exists"
        },
        {
          question: "How does the Banker's Algorithm avoid deadlocks?",
          answer: "• Safe State checking: Simulates allocating resources to verify a path where all processes can finish\n• Request Delay: Delays allocations that would transition the system into an unsafe state"
        }
      ]
    },
    {
      name: "Semaphores",
      keywords: ["semaphore", "mutex", "synchronization", "critical section"],
      questions: [
        {
          question: "Explain the difference between a Mutex and a Semaphore.",
          answer: "• Mutex: Locking object (ownership-based: only the thread that locks can release)\n• Semaphore: Signaling count (no ownership: any thread can signal to increment/decrement)"
        }
      ]
    },
    {
      name: "Paging",
      keywords: ["paging", "page table", "tlb"],
      questions: [
        {
          question: "Explain paging and how it prevents external fragmentation.",
          answer: "• Fixed Frames: Memory is divided into small, fixed-size logical pages and physical frames\n• Dynamic Mapping: Page tables map pages to frames scattered non-contiguously in RAM\n• Benefit: Eliminates external fragmentation because any free frame can satisfy any page request"
        }
      ]
    },
    {
      name: "Virtual Memory",
      keywords: ["virtual memory", "demand paging"],
      questions: [
        {
          question: "What is a page fault and how is it handled by the OS?",
          answer: "• Detection: CPU attempts to access a page marked invalid in the Page Table\n• OS Trap: Interrupted CPU loads page from disk into a free physical frame\n• Recovery: OS updates the page table mapping, marks it valid, and restarts the instruction"
        }
      ]
    },
    {
      name: "Thrashing",
      keywords: ["thrashing"],
      questions: [
        {
          question: "What is thrashing and how can it be resolved?",
          answer: "• Definition: CPU spends more time swapping pages in/out of disk than executing processes\n• Cause: Active working set memory demands exceed physical RAM size\n• Resolution: Add more physical RAM, or suspend active processes to lower the multiprogramming degree"
        }
      ]
    }
  ],
  "DBMS": [
    {
      name: "Normalization",
      keywords: ["normalization", "normalize"],
      questions: [
        {
          question: "What is normalization and why do we perform it?",
          answer: "• Data Redundancy: Eliminates duplicate values across database rows\n• Integrity Anomalies: Prevents insertion, update, and deletion discrepancies\n• Schema Division: Deconstructs large tables into smaller, well-related ones"
        }
      ]
    },
    {
      name: "1NF",
      keywords: ["1nf", "first normal"],
      questions: [
        {
          question: "What are the rules for a table to be in First Normal Form (1NF)?",
          answer: "• Atomicity: Every table cell must contain a single, indivisible value\n• Unique columns: No repeating groups or array values in fields\n• Primary Key: Row order must not matter, and a primary key is required"
        }
      ]
    },
    {
      name: "2NF",
      keywords: ["2nf", "second normal"],
      questions: [
        {
          question: "Explain Second Normal Form (2NF) and partial dependency.",
          answer: "• 1NF Rule: Table must already satisfy all first normal form requirements\n• No Partial Dependency: Non-prime attributes must depend on the *entire* primary key, not a subset"
        }
      ]
    },
    {
      name: "3NF",
      keywords: ["3nf", "third normal"],
      questions: [
        {
          question: "Explain Third Normal Form (3NF) and transitive dependency.",
          answer: "• 2NF Rule: Table must satisfy all second normal form requirements\n• No Transitive Dependency: Non-prime attributes must not depend on other non-prime attributes"
        }
      ]
    },
    {
      name: "Anomalies",
      keywords: ["anomaly", "anomalies", "redundancy"],
      questions: [
        {
          question: "What are Insertion, Update, and Deletion Anomalies?",
          answer: "• Insertion: Cannot add details without creating a dummy record due to a missing primary key\n• Update: Editing a value requires changing multiple redundant rows (risk of inconsistency)\n• Deletion: Removing a row accidentally deletes secondary, unrelated details"
        }
      ]
    },
    {
      name: "ER Model",
      keywords: ["er model", "entity", "relationship"],
      questions: [
        {
          question: "What is the difference between a strong entity and a weak entity?",
          answer: "• Strong Entity: Possesses its own unique identifying attributes (primary key)\n• Weak Entity: Lacks a primary key; depends on an owner entity via an identifying relationship"
        }
      ]
    },
    {
      name: "Transactions",
      keywords: ["transaction", "acid", "commit", "rollback"],
      questions: [
        {
          question: "Explain the ACID properties of a transaction.",
          answer: "• Atomicity: All operations complete successfully, or all are rolled back (all-or-nothing)\n• Consistency: Database transitions between valid structural states\n• Isolation: Concurrent transactions do not affect or see each other's intermediate state\n• Durability: Once committed, changes survive system crashes"
        }
      ]
    },
    {
      name: "Concurrency Control",
      keywords: ["concurrency", "lock", "serializability"],
      questions: [
        {
          question: "What is the Two-Phase Locking (2PL) protocol?",
          answer: "• Growing Phase: Transaction can acquire locks but cannot release any\n• Shrinking Phase: Transaction can release locks but cannot acquire new ones\n• Value: Guarantees serializability of concurrent execution paths"
        }
      ]
    },
    {
      name: "B+ Trees",
      keywords: ["b+ tree", "b-tree"],
      questions: [
        {
          question: "Why are B+ Trees preferred over B-Trees for database indexing?",
          answer: "• Leaf Linkage: All records/keys are in leaves linked sequentially, easing range scans\n• Fixed Height: Kept low because internal nodes hold only keys, not data pointers"
        }
      ]
    },
    {
      name: "Indexing",
      keywords: ["index", "indexing"],
      questions: [
        {
          question: "What is the difference between Clustered and Non-Clustered Indexes?",
          answer: "• Clustered: Physical table rows are sorted in index order (max 1 per table)\n• Non-Clustered: Index is a separate object holding pointers back to table rows"
        }
      ]
    }
  ],
  "Computer Networks": [
    {
      name: "OSI Model",
      keywords: ["osi"],
      questions: [
        {
          question: "Explain the functions of the Network and Transport layers in the OSI model.",
          answer: "• Network Layer: Handles logical addressing (IP) and routing packets across different subnets\n• Transport Layer: Manages process-to-process flow control, sequence numbering, and error correction"
        }
      ]
    },
    {
      name: "TCP/IP",
      keywords: ["tcp", "udp", "handshake"],
      questions: [
        {
          question: "How does the TCP Three-Way Handshake work?",
          answer: "• Client SYN: Client sends synchronize request to server\n• Server SYN-ACK: Server acknowledges client and sends its own synchronize sequence\n• Client ACK: Client acknowledges server. Link is active"
        }
      ]
    },
    {
      name: "Routing",
      keywords: ["routing", "router", "ospf", "rip"],
      questions: [
        {
          question: "Compare Distance Vector and Link State routing protocols.",
          answer: "• Distance Vector: Periodically shares table with neighbors; paths calculated by hop count\n• Link State: Multicasts link changes to all routers; paths computed dynamically via Dijkstra"
        }
      ]
    },
    {
      name: "Congestion Control",
      keywords: ["congestion", "sliding window"],
      questions: [
        {
          question: "Explain the main phases of TCP Congestion Control.",
          answer: "• Slow Start: Doubles congestion window (cwnd) size every RTT\n• Congestion Avoidance: Window grows linearly after ssthresh threshold\n• Multiplicative Decrease: Halves window size when packet loss is encountered"
        }
      ]
    },
    {
      name: "DNS",
      keywords: ["dns", "resolver"],
      questions: [
        {
          question: "Describe recursive vs iterative DNS queries.",
          answer: "• Recursive: Resolver does all the work querying multiple name servers until IP is returned\n• Iterative: Queried name server returns the address of the next DNS server to contact"
        }
      ]
    }
  ],
  "OOP": [
    {
      name: "Classes & Objects",
      keywords: ["class", "object"],
      questions: [
        {
          question: "What is the difference between a class and an object?",
          answer: "• Class: A blueprint/type defining variables and functions (takes no memory)\n• Object: An instance of a class allocated in memory with active state"
        }
      ]
    },
    {
      name: "Inheritance",
      keywords: ["inheritance", "extends"],
      questions: [
        {
          question: "What is the Diamond Problem in multiple inheritance?",
          answer: "• Cause: Inheriting from two classes that share a common base class\n• Issue: Ambiguity in which base method to run\n• Resolution: Virtual inheritance (C++) or interface implementations (Java/TS)"
        }
      ]
    },
    {
      name: "Polymorphism",
      keywords: ["polymorphism", "overloading", "overriding"],
      questions: [
        {
          question: "Explain method overloading vs method overriding.",
          answer: "• Overloading: Multiple methods with the same name but different signatures in one class\n• Overriding: Redeclaring a parent class method inside a child class to change behavior"
        }
      ]
    },
    {
      name: "Encapsulation",
      keywords: ["encapsulation", "private", "public"],
      questions: [
        {
          question: "How does encapsulation enforce data hiding?",
          answer: "• Access levels: Declares class variables as private\n• Mutators: Restricts inspections or changes to public getter and setter methods"
        }
      ]
    },
    {
      name: "Abstraction",
      keywords: ["abstraction", "interface", "abstract class"],
      questions: [
        {
          question: "Compare Abstract Classes vs Interfaces.",
          answer: "• Abstract Class: Can hold instance state and concrete methods (is inherited)\n• Interface: Stateless contract defining method signatures only (is implemented)"
        }
      ]
    }
  ],
  "DSA": [
    {
      name: "Arrays & Linked Lists",
      keywords: ["array", "linked list"],
      questions: [
        {
          question: "Compare arrays vs linked lists on access and insertion speeds.",
          answer: "• Array: O(1) index access, O(N) insertion (shifting data elements)\n• Linked List: O(N) access (nodes traversed sequentially), O(1) insertion at a pointer"
        }
      ]
    },
    {
      name: "Stacks & Queues",
      keywords: ["stack", "queue"],
      questions: [
        {
          question: "How can you implement a Queue using two Stacks?",
          answer: "• Enqueue: Push onto Stack1\n• Dequeue: Pop from Stack2. If empty, transfer all of Stack1 to Stack2 first, then pop"
        }
      ]
    },
    {
      name: "Trees & Graphs",
      keywords: ["tree", "graph", "dfs", "bfs"],
      questions: [
        {
          question: "What is the difference between DFS and BFS traversal?",
          answer: "• DFS: Goes as deep as possible down a branch before backtracking (uses Stack)\n• BFS: Visits all siblings at the current level before going deeper (uses Queue)"
        }
      ]
    },
    {
      name: "Sorting & Searching",
      keywords: ["sorting", "searching", "binary search"],
      questions: [
        {
          question: "Explain Binary Search and its requirements.",
          answer: "• Algorithm: O(log N) search halving search bounds repeatedly\n• Prerequisite: Array must be pre-sorted"
        }
      ]
    },
    {
      name: "Dynamic Programming",
      keywords: ["dynamic programming", "dp", "memoization"],
      questions: [
        {
          question: "What is Memoization vs Tabulation in DP?",
          answer: "• Memoization: Top-down recursion caching results of subproblems\n• Tabulation: Bottom-up iteration filling a table from base cases up"
        }
      ]
    }
  ]
};

export function runInterviewPrepCheck(subject: string, notesText: string): PrepCheckResult {
  let matchedSubjectKey = "Operating Systems";
  const normalizedSubject = subject.toLowerCase();
  
  if (normalizedSubject.includes("db") || normalizedSubject.includes("database") || normalizedSubject.includes("sql")) {
    matchedSubjectKey = "DBMS";
  } else if (normalizedSubject.includes("network") || normalizedSubject.includes("cn")) {
    matchedSubjectKey = "Computer Networks";
  } else if (normalizedSubject.includes("oop") || normalizedSubject.includes("object") || normalizedSubject.includes("java") || normalizedSubject.includes("cpp")) {
    matchedSubjectKey = "OOP";
  } else if (normalizedSubject.includes("dsa") || normalizedSubject.includes("structure") || normalizedSubject.includes("algorithm")) {
    matchedSubjectKey = "DSA";
  }
  
  const topics = SUBJECT_INTERVIEW_MAP[matchedSubjectKey] || SUBJECT_INTERVIEW_MAP["Operating Systems"];
  const covered: string[] = [];
  const missing: string[] = [];
  const questionPool: InterviewQuestion[] = [];
  
  const normalizedNotes = notesText.toLowerCase();
  
  topics.forEach(topic => {
    const isCovered = topic.keywords.some(keyword => normalizedNotes.includes(keyword));
    
    if (isCovered) {
      covered.push(topic.name);
    } else {
      missing.push(topic.name);
      topic.questions.forEach(q => {
        questionPool.push({
          ...q,
          topic: topic.name
        });
      });
    }
  });

  if (missing.length === 0) {
    topics.forEach(topic => {
      topic.questions.forEach(q => {
        questionPool.push({ ...q, topic: topic.name });
      });
    });
  }

  const selectedQuestions = questionPool.slice(0, Math.min(5, Math.max(3, questionPool.length)));
  
  if (selectedQuestions.length < 3) {
    const fallbackPool: InterviewQuestion[] = [];
    topics.forEach(t => t.questions.forEach(q => fallbackPool.push({ ...q, topic: t.name })));
    while (selectedQuestions.length < 3 && fallbackPool.length > 0) {
      const q = fallbackPool.shift();
      if (q && !selectedQuestions.some(sq => sq.question === q.question)) {
        selectedQuestions.push(q);
      }
    }
  }

  return {
    covered,
    missing,
    questions: selectedQuestions
  };
}
