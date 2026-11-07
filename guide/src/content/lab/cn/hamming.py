# Hamming Code - error detection and correction using even parity
# Bit positions are counted as 1, 2, 3, ... from the left side
# Parity bits are placed at positions 1, 2, 4, 8, ... (powers of 2)
# Number of parity bits r is found using 2^r >= m + r + 1

def find_r(m):
    r = 1
    while 2 ** r < m + r + 1:
        print(f"r = {r} : {2 ** r} >= {m + r + 1} is False")
        r = r + 1
    print(f"r = {r} : {2 ** r} >= {m + r + 1} is True")
    return r


def is_parity_pos(i):  # true only for 1, 2, 4, 8, ...
    return i & (i - 1) == 0


def check_parity(bits, p):
    result = 0
    for i in range(1, len(bits) + 1):
        if i & p != 0:
            result = result ^ bits[i - 1]
    return result


def to_string(bits):
    return "".join(str(b) for b in bits)


def display(bits):
    n = len(bits)
    print("Position :", "".join(f"{i:4}" for i in range(1, n + 1)))
    print("Bit      :", "".join(f"{b:4}" for b in bits))
    print("Type     :", "".join(f"{'P' if is_parity_pos(i) else 'D':>4}" for i in range(1, n + 1)))


def sender(data):
    m = len(data)
    print(f"\n--- Sender side ---\nM(x) = {data}, m = {m}")
    r = find_r(m)
    n = m + r
    print(f"So {r} parity bits are needed, total length = {n}")

    codeword = [0] * n
    k = 0
    for i in range(1, n + 1):
        if not is_parity_pos(i):
            codeword[i - 1] = int(data[k])
            k = k + 1

    print("\nCalculating the parity bits (even parity):")
    for i in range(r):
        p = 2 ** i
        covered = [j for j in range(1, n + 1) if j & p != 0 and j != p]
        # the parity slot itself is still 0, so it does not affect the xor
        codeword[p - 1] = check_parity(codeword, p)
        print(f"P{p} = XOR of positions {covered} = {codeword[p - 1]}")

    print()
    display(codeword)
    return codeword


def correction(received, syndrome):
    print("\n--- Correction ---")
    corrected = received[:]
    corrected[syndrome - 1] = 1 - corrected[syndrome - 1]
    print(f"Error is at bit position {syndrome}")
    print(f"Corrected message = {to_string(corrected)}")
    return corrected


def receiver(received, transmitted):
    n = len(received)
    print(f"\n--- Receiver side ---\nReceived message = {to_string(received)}")
    display(received)

    print("\nCalculating the check bits:")
    syndrome = 0
    p = 1
    while p <= n:
        c = check_parity(received, p)
        print(f"C{p} = {c}")
        syndrome = syndrome + c * p
        p = p * 2

    print(f"\nSyndrome value = {syndrome}")
    if syndrome == 0:
        print("No error in the received message")
        corrected = received
    elif syndrome > n:
        print("More than one bit is in error, so it cannot be corrected")
        return received
    else:
        print("Syndrome is not zero, so going to the correction function")
        corrected = correction(received, syndrome)

    if to_string(corrected) == to_string(transmitted):
        print("Corrected message is same as the transmitted message")
    else:
        print("Corrected message is NOT same as the transmitted message")

    data = [corrected[i - 1] for i in range(1, n + 1) if not is_parity_pos(i)]
    print(f"Recovered data bits = {to_string(data)}")
    return corrected


def main():
    print("=== Hamming Code ===")
    data = input("Enter the data bits : ").strip()
    transmitted = sender(data)
    print(f"\nTransmitted message T(x) = {to_string(transmitted)}")

    text = input(f"\nEnter the received message ({len(transmitted)} bits) : ").strip()
    if len(text) != len(transmitted):
        print("Wrong number of bits entered")
        return
    receiver([int(ch) for ch in text], transmitted)


main()
