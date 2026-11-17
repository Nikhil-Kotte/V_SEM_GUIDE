import { Q } from '../pyq-helpers.js'

// Questions from the two OS class tests (mid-terms) of this semester, PYQs/OS MIDS.pdf:
// Mid-1 (2 Sep 2026) and Class Test II (5 Nov 2026), in their original wording.
// Class-test questions that were near-identical to an older paper's question are not repeated here:
// the class test is added to that question's papers instead (see pyqs-u12.js and pyqs.js).
export default [
  // ---- Mid-1 ----
  Q('os-mid-zombie', 'os.u2.linux-process', 'When can a process enter a zombie state? How can it come out of it?', ['os-ct1:2']),
  Q('os-mid-logical-physical', 'os.u3.address-translation', 'Define logical address and physical address.', ['os-ct1:2']),
  Q('os-mid-functions-services', 'os.u1.functions', 'Discuss the functions and services of an operating system.', ['os-ct1:4']),
  Q('os-mid-mm-syscalls', 'os.u3.mm-syscalls', 'Describe the role of any two system calls mmap(), munmap(), sbrk() and mprotect() in virtual and physical memory management.', ['os-ct1:2']),
  Q('os-mid-128-priority', 'os.u2.algorithms', 'Consider an OS that has 128 different priority levels for processes, from 1 to 128, with a lower level indicating a higher priority. A process with some priority can be scheduled only if there is no higher-priority process; scheduling among processes at the same level is FCFS. The priorities are set statically when a process is created and not changed after that. How will you organise the ready queue to choose the next process to schedule efficiently? Justify your design briefly.', ['os-ct1:4']),
  Q('os-mid-memory-view', 'os.u3.memory-view', 'Illustrate the memory view of a process and describe its different memory segments.', ['os-ct1:3']),
  // ---- Class Test II ----
  Q('os-mid-file-syscalls', 'os.u5.syscalls', 'What are the different file handling system calls?', ['os-ct2:2']),
  Q('os-mid-fragmentation', 'os.u3.memory-requirements', 'Explain the difference between internal and external fragmentation.', ['os-ct2:3']),
  Q('os-mid-producer-consumer', 'os.u4.classical', 'How do you provide a solution to the producer–consumer problem using semaphores?', ['os-ct2:4']),
  Q('os-mid-raid', 'os.u3.disk-management', 'Analyse the different RAID levels and mention the advantages and limitations of each.', ['os-ct2:3']),
  Q('os-num-bankers-ct2', 'os.u4.deadlock-avoidance', "Snapshot (resources A B C D): Allocation T0 2106, T1 3313, T2 2312, T3 1234, T4 3030; Max T0 6327, T1 5415, T2 6614, T3 4345, T4 7261. What are the contents of the Need matrix? If Available = [3 5 2 1], use the banker's algorithm to determine whether the system is safe or unsafe.", ['os-ct2:4'], { numerical: true }),
  Q('os-mid-logging', 'os.u5.logging', 'Write short notes on (i) Logging (ii) Auditing (iii) Recovery.', ['os-ct2:4']),
  Q('os-mid-monitors', 'os.u4.sync-solutions', 'Write a short note on the implementation of monitors in synchronization.', ['os-ct2:3']),
]
