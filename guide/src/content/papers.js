// Registry of every past paper a PYQ can cite.
// date: YYYY-MM used for "most recent" sorting. label: what students see.
// source: the PDF in the repo that holds this paper. Papers that only exist
// inside a compiled unit-wise bank point at that bank, so the bank itself is
// never counted as an extra paper.
// relation: 'same' = this course or its renamed predecessor (20CSC22 -> 22CSC21 etc.)
//           'related' = a different course with overlapping topics (counted, but labelled)

const BANK = {
  se: 'PYQs/SE_PYQs_Unit_Wise.pdf',
  os: 'PYQs/OS_Unitwise_Question_Bank.pdf',
  cn: 'PYQs/CN_Unitwise_PYQs.pdf',
  bda: 'PYQs/BDA_Unitwise_Questions.pdf',
}

const P = (id, subject, date, label, source, course, relation = 'same', note) => ({
  id, subject, date, label, source, course, relation, note,
})

export const papers = [
  // ---------- Software Engineering ----------
  P('se-nov25', 'se', '2025-11', "Nov '25", 'PYQs/2025-26/Software Engineering 22CSC21.pdf', '22CSC21'),
  P('se-may25', 'se', '2025-05', "May '25", BANK.se, '22CSC21'),
  P('se-dec24', 'se', '2024-12', "Dec '24", 'PYQs/2024-25/22CSC21 Software engineering.pdf', '22CSC21'),
  P('se-jun24', 'se', '2024-06', "Jun '24", BANK.se, '20CSC22'),
  P('se-dec23', 'se', '2023-12', "Dec '23", 'PYQs/2023-24/Software Engineering 20CSC22.pdf', '20CSC22'),
  P('se-aug23', 'se', '2023-08', "Aug '23", BANK.se, '20CSC22'),
  P('se-jun23', 'se', '2023-06', "Jun '23", BANK.se, '20CSC22'),
  P('se-jan23', 'se', '2023-01', "Dec '22–Jan '23", 'PYQs/2022-23/Software Engineering 20CSC22.pdf', '20CSC22'),
  P('se-aug22', 'se', '2022-08', "Aug '22", BANK.se, '20CSC22'),
  P('se-jun22', 'se', '2022-06', "Jun '22", BANK.se, '20CSC22'),
  P('se-dec21', 'se', '2021-12', "Dec '21", BANK.se, '20CSC22'),

  // ---------- Operating Systems ----------
  P('os-nov25', 'os', '2025-11', "Nov '25", 'PYQs/2025-26/Operating Systems 22CSC15N.pdf', '22CSC15N'),
  P('os-may25', 'os', '2025-05', "May '25 (CSM)", BANK.os, '22CSC15N'),
  P('os-dec24', 'os', '2024-12', "Dec '24", 'PYQs/2024-25/22CSC15N Operating Systems.pdf', '22CSC15N'),
  P('os-jun24csm', 'os', '2024-06', "Jun '24 (CSM)", BANK.os, '20CSC20'),
  P('os-jun24aiml', 'os', '2024-06', "Jun '24 (AIML)", BANK.os, '20CSC20'),
  P('os-dec23', 'os', '2023-12', "Dec '23", 'PYQs/2023-24/Operating Systems 20CSC20.pdf', '20CSC20'),
  P('os-jan23', 'os', '2023-01', "Dec '22–Jan '23 (CSE)", 'PYQs/2022-23/Operating Systems 20CSC20.pdf', '20CSC20'),
  P('os-jan23it', 'os', '2023-01', "Jan '23 (IT)", BANK.os, '20CSC20'),
  P('os-dec21cse', 'os', '2021-12', "Dec '21 (CSE)", BANK.os, '20CSC20'),
  P('os-dec21it', 'os', '2021-12', "Dec '21 (IT)", BANK.os, '20CSC20'),
  P('os-rtos-may26', 'os', '2026-05', "May '26 (ECE RTOS)", BANK.os, 'RTOS', 'related'),
  P('os-rtos-may25', 'os', '2025-05', "May '25 (ECE RTOS)", BANK.os, 'RTOS', 'related'),

  // ---------- Computer Networks ----------
  P('cn-nov25', 'cn', '2025-11', "Nov '25", 'PYQs/2025-26/Computer Networks 22ITC10.pdf', '22ITC10'),
  P('cn-may25', 'cn', '2025-05', "May '25", BANK.cn, '22ITC10'),
  P('cn-dec24', 'cn', '2024-12', "Dec '24", 'PYQs/2024-25/22ITC10  Computer Networks.pdf', '22ITC10'),
  P('cn-jun24', 'cn', '2024-06', "Jun '24", BANK.cn, '20ITC20'),
  P('cn-dec23it', 'cn', '2023-12', "Dec '23 (IT)", 'PYQs/2023-24/Computer Networks 20ITC20.pdf', '20ITC20'),
  P('cn-dec23cet', 'cn', '2023-12', "Dec '23 (CET)", 'PYQs/2023-24/Computer Networks 20CIC04.pdf', '20CIC04'),
  P('cn-dec23cse', 'cn', '2023-12', "Dec '23 (CSE)", 'PYQs/2023-24/Data Communication and Computer Networks 20CSC21.pdf', '20CSC21'),
  P('cn-jun23', 'cn', '2023-06', "Jun '23", BANK.cn, '20ITC20'),
  P('cn-dec22it', 'cn', '2023-01', "Dec '22–Jan '23 (IT)", 'PYQs/2022-23/Computer Networks 20ITC20.pdf', '20ITC20'),
  P('cn-dec22cse', 'cn', '2023-01', "Dec '22–Jan '23 (CSE)", 'PYQs/2022-23/Data Communication and Computer Networks 20CSC21.pdf', '20CSC21'),
  P('cn-dec22iot', 'cn', '2022-12', "Dec '22 (IoT)", BANK.cn, '20ITC20'),
  P('cn-dec22ece', 'cn', '2022-12', "Dec '22 (ECE)", BANK.cn, 'CN (ECE)'),
  P('cn-jun22', 'cn', '2022-06', "Jun '22", BANK.cn, '20ITC20'),
  P('cn-dec21it', 'cn', '2021-12', "Dec '21 (IT)", BANK.cn, '20ITC20'),
  P('cn-dec21ece', 'cn', '2021-12', "Dec '21 (ECE)", BANK.cn, 'CN (ECE)'),

  // ---------- Fundamentals of Data Science ----------
  // 22CSC59 is a new course with no past papers yet. The closest is 22ADC09 (R-based).
  P('fds-ids-dec24', 'fds', '2024-12', "Dec '24 (22ADC09 Intro to DS)", 'PYQs/2024-25/22ADC09 Introduction to Data Science.pdf', '22ADC09', 'related',
    'Different course (R-based). Questions are adapted to Python.'),

  // ---------- Big Data Analytics ----------
  // Past papers are 22ADE12/20ADC14, whose units differ from 22CSE19. Only in-syllabus questions are kept.
  P('bda-may26', 'bda', '2026-05', "May '26", BANK.bda, '22ADE12'),
  P('bda-nov25', 'bda', '2025-11', "Nov '25", 'PYQs/2025-26/Big Data Analytics 22ADE12.pdf', '22ADE12'),
  P('bda-dec24', 'bda', '2024-12', "Dec '24", 'PYQs/2024-25/22ADE12 Big Data Analytics.pdf', '22ADE12'),
  P('bda-jun24', 'bda', '2024-06', "Jun '24 (IT)", BANK.bda, '20ADC14'),
  P('bda-dec23cse', 'bda', '2023-12', "Dec '23 (CSE)", BANK.bda, '20ADC14'),
  P('bda-dec23aids', 'bda', '2023-12', "Dec '23 (AI&DS)", BANK.bda, '20ADC14'),
  P('bda-jun23', 'bda', '2023-06', "Jun '23 (IT)", BANK.bda, '20ADC14'),
  P('bda-dec22it', 'bda', '2022-12', "Dec '22 (IT)", BANK.bda, '20ADC14'),
  P('bda-dec22cse', 'bda', '2022-12', "Dec '22 (CSE)", BANK.bda, '20ADC14'),

  // ---------- Principles of Design Thinking ----------
  P('pdt-may26', 'pdt', '2026-05', "May '26 (22MEC36)", 'PYQs/2025-26/New Doc 08-31-2026 15.21.pdf', '22MEC36',
    'same', 'Fundamentals of Design Thinking, the sister course with the same syllabus phases.'),
  P('pdt-dec25', 'pdt', '2025-12', "Dec '25", 'PYQs/2025-26/Principles of Design Thinking 22MEO01.pdf', '22MEO01'),
]

export const paperById = Object.fromEntries(papers.map((p) => [p.id, p]))
