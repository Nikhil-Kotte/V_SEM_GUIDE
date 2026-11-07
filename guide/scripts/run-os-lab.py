"""Compile and run every OS lab program with its sample input and save a terminal-style transcript.

    python scripts/run-os-lab.py            # all runs
    python scripts/run-os-lab.py fcfs rr    # only these runs

Uses Cygwin's gcc and bash (POSIX fork/exec/pipes/threads/semaphores on Windows). Programs are
compiled with stdout unbuffered so that prompts appear before the input, as in a real terminal.
Each typed input line is echoed into the transcript right after the prompt it answers.
Transcripts go to src/content/lab/os-out/<run id>.txt and are shown on the Lab tab.
"""
import os, re, subprocess, sys, threading, time, shutil, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', 'src', 'content', 'lab', 'os')
OUT = os.path.join(HERE, '..', 'src', 'content', 'lab', 'os-out')
CYG = r'C:\cygwin64\bin'
GCC, BASH = os.path.join(CYG, 'gcc.exe'), os.path.join(CYG, 'bash.exe')
ENV = dict(os.environ, PATH=CYG + os.pathsep + os.environ.get('PATH', ''), CYGWIN='nodosfilewarning')

# run id -> (source file, list of input lines, extra)
RUNS = {
    'evenodd-1': ('evenodd.sh', ['10'], {}),
    'evenodd-2': ('evenodd.sh', ['111'], {}),
    'prime-1': ('prime.sh', ['10'], {}),
    'prime-2': ('prime.sh', ['313'], {}),
    'prime-3': ('prime.sh', ['-89'], {}),
    'factorial-1': ('factorial.sh', ['5'], {}),
    'factorial-2': ('factorial.sh', ['12'], {}),
    'factorial-3': ('factorial.sh', ['-5'], {}),
    'armstrong-1': ('armstrong.sh', ['153'], {}),
    'armstrong-2': ('armstrong.sh', ['1634'], {}),
    'armstrong-3': ('armstrong.sh', ['79'], {}),
    'palindrome-1': ('palindrome.sh', ['1441'], {}),
    'palindrome-2': ('palindrome.sh', ['143'], {}),
    'fibonacci-1': ('fibonacci.sh', ['10'], {}),
    'fork': ('fork.c', [], {}),
    'exec': ('exec.c', [], {'files': ['notes.txt'], 'aout': True}),
    'zombie': ('zombie.c', [], {'shorten': ('sleep(30)', 'sleep(3)')}),
    'orphan': ('orphan.c', [], {'shorten': ('sleep(10)', 'sleep(2)'), 'linger': 3}),
    'fcfs': ('fcfs.c', ['4', 'A 0 5', 'B 1 3', 'C 2 8', 'D 3 6'], {}),
    'sjf': ('sjf.c', ['4', 'A 6', 'B 8', 'C 7', 'D 3'], {}),
    'rr': ('rr.c', ['4', '0 5', '1 4', '2 2', '4 1', '2'], {}),
    'priority_p': ('priority_p.c', ['4', '0 5 3', '1 3 1', '2 4 4', '3 2 2'], {}),
    'priority_np': ('priority_np.c', ['4', '0 5 3', '1 3 1', '2 4 4', '3 2 2'], {}),
    'fifo': ('fifo.c', ['3', '12', '7 0 1 2 0 3 0 4 2 3 0 3'], {}),
    'lru': ('lru.c', ['3', '12', '7 0 1 2 0 3 0 4 2 3 0 3'], {}),
    'pipe': ('pipe.c', [], {}),
    'prodcons': ('prodcons.c', [], {}),
    'thread_arg': ('thread_arg.c', [], {}),
    'thread_sum': ('thread_sum.c', ['10'], {}),
    'mutex': ('mutex.c', [], {}),
    'dining': ('dining.c', [], {}),
    'bankers_detect-1': ('bankers_detect.c', ['5 3', '0 1 0', '2 0 0', '3 0 3', '2 1 1', '0 0 2',
                                               '0 0 0', '2 0 2', '0 0 0', '1 0 0', '0 0 2', '0 0 0'], {}),
    'bankers_detect-2': ('bankers_detect.c', ['5 3', '0 1 0', '2 0 0', '3 0 3', '2 1 1', '0 0 2',
                                               '0 0 0', '2 0 2', '0 0 1', '1 0 0', '0 0 2', '0 0 0'], {}),
    'bankers_avoid': ('bankers_avoid.c', ['5 3', '0 1 0', '2 0 0', '3 0 2', '2 1 1', '0 0 2',
                                          '7 5 3', '3 2 2', '9 0 2', '2 2 2', '4 3 3', '3 3 2'], {}),
    'alloc_contiguous': ('alloc_contiguous.c', ['10', '2', 'f1', '0', '3', 'f2', '5', '4', 'f1', 'f3', 'exit'], {}),
    'alloc_linked': ('alloc_linked.c', ['10', '2', 'f1', '3', '2 5 8', 'f2', '2', '1 9', 'f1', 'exit'], {}),
    'alloc_indexed': ('alloc_indexed.c', ['10', '2', 'f1', '0', '3', '2 5 8', 'f2', '1', '2', '3 9', 'f1', 'exit'], {}),
}

# Interactive programs: unbuffered, so prompts show before the input. Others: line-buffered, like a terminal.
UNBUF = '#include <stdio.h>\n__attribute__((constructor)) static void lab_unbuffer(void) { setvbuf(stdout, NULL, %s, 0); }\n'


def build(src, work, extra, interactive):
    path = os.path.join(SRC, src)
    if src.endswith('.sh'):
        return [BASH, path]
    code = open(path, encoding='utf-8').read()
    if 'shorten' in extra:
        code = code.replace(*extra['shorten'])
    c = os.path.join(work, src)
    open(c, 'w', encoding='utf-8').write(code)
    hdr = os.path.join(work, 'unbuf.h')
    open(hdr, 'w').write(UNBUF % ('_IONBF' if interactive else '_IOLBF'))
    exe = os.path.join(work, 'a.exe' if extra.get('aout') else src[:-2] + '.exe')
    r = subprocess.run([GCC, '-include', hdr, c, '-o', exe, '-lpthread'], capture_output=True, text=True, env=ENV)
    if r.returncode != 0:
        raise RuntimeError(r.stderr)
    if extra.get('aout'):  # leave only what a student's folder would hold: the source, a.out, a notes file
        os.remove(hdr)
        out = os.path.join(work, 'a.out')
        os.rename(exe, out)
        return [out]
    return [exe]


def run(cmd, inputs, cwd, linger=0, prompts=()):
    """Feed inputs one line at a time, each after the output goes quiet, echoing them like a terminal.

    `read -p` only prints its prompt on a real terminal, so for shell scripts the prompts are passed
    in and written into the transcript before each typed line, exactly where bash would show them."""
    p = subprocess.Popen(cmd, cwd=cwd, env=ENV, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                         stderr=subprocess.STDOUT)
    chunks, lock = [], threading.Lock()
    last = [time.time()]

    def reader():
        while True:
            b = p.stdout.read1(4096) if hasattr(p.stdout, 'read1') else p.stdout.read(1)
            if not b:
                break
            with lock:
                chunks.append(b.decode('utf-8', 'replace'))
                last[0] = time.time()

    t = threading.Thread(target=reader, daemon=True)
    t.start()
    for i, line in enumerate(inputs):
        while time.time() - last[0] < 0.6:  # wait for the prompt to finish printing
            time.sleep(0.05)
        with lock:
            if i < len(prompts):
                chunks.append(prompts[i])
            chunks.append(line + '\n')  # what the user types appears on screen
        p.stdin.write((line + '\n').encode())
        p.stdin.flush()
        last[0] = time.time()
    p.stdin.close()
    p.wait(timeout=120)
    t.join(timeout=5)
    if linger:
        time.sleep(linger)  # let an orphaned child finish printing
        t.join(timeout=5)
    return ''.join(chunks).replace('\r\n', '\n')


def main(only):
    os.makedirs(OUT, exist_ok=True)
    for rid, (src, inputs, extra) in RUNS.items():
        if only and rid not in only and rid.split('-')[0] not in only:
            continue
        work = tempfile.mkdtemp(prefix='oslab-')
        try:
            for f in extra.get('files', []):
                open(os.path.join(work, f), 'w').write('sample\n')
            cmd = build(src, work, extra, bool(inputs))
            prompts = ()
            if src.endswith('.sh'):
                prompts = re.findall(r'read -p "([^"]*)"', open(os.path.join(SRC, src), encoding='utf-8').read())
            text = run(cmd, inputs, work, extra.get('linger', 0), prompts)
            if extra.get('aout'):  # Cygwin's ls marks ACLs with '+' and shows the Windows account name
                text = re.sub(r'^(\S{10})\+ ', r'\1 ', text, flags=re.M)
                text = re.sub(r'^(\S{10} +\d+) \S+ \S+ ', r'\1 student student ', text, flags=re.M)
            open(os.path.join(OUT, rid + '.txt'), 'w', encoding='utf-8', newline='\n').write(text.rstrip() + '\n')
            print(f'ok   {rid}')
        except Exception as e:
            print(f'FAIL {rid}: {e}')
        finally:
            shutil.rmtree(work, ignore_errors=True)


if __name__ == '__main__':
    main(sys.argv[1:])
