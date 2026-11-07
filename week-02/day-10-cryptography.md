# Day 10: Cryptography

[← Previous: Day 09 — Modular Arithmetic](../week-02/day-09-modular-arithmetic.md) | [Course Home](../README.md) | [Next: Day 11 — Graphs and Coloring →](../week-02/day-11-graphs-coloring.md)

---

## 🎯 Learning Objectives

By the end of today, you will be able to:

1. Explain why Caesar and substitution ciphers are easy to break
2. Contrast private-key and public-key cryptography
3. Generate a toy RSA key pair and use it
4. Explain why RSA decryption always recovers the message
5. Solve two congruences with the Chinese Remainder Theorem

**Difficulty:** 🔴 Advanced
**Estimated Time:** 1.5 hours (1 hour reading + 30 min hands-on)

---

## 📚 Core Concepts

Every online purchase sends your card number across a network strangers can listen to. Today the GCDs, inverses and Fermat's Little Theorem from the last two days become the tools that keep it secret.

### Alice, Bob, Eve, and some broken ciphers

Alice wants to send Bob a message over an insecure channel. Eve listens in and might tamper with it. Alice **encrypts** the plaintext into ciphertext and Bob **decrypts** it. Both steps use a **key**, secret data that should look random and be hard to guess.

The Caesar cipher shifts every letter by 3, mod 26. It has no key, so its only protection is that nobody knows the method, and one defector ends that. The Caesar *shift* uses a secret shift k. But there are only 26 keys, so Eve tries them all and keeps the one that reads like English.

A substitution cipher uses a random permutation of the alphabet as its key, which gives 26! possible keys. It still falls to **frequency analysis**. The most common symbol is probably E, a three-letter word ending in E is probably THE, and each guess unlocks the next. Enigma changed its permutation after every letter, which defeated letter counting. But the Allies used **known plaintext**: they could guess phrases that appeared in messages, such as weather reports. The lecturer calls this "cryptography by hubris": the designer couldn't break it himself, so he assumed nobody could. Modern schemes instead rest on problems that experts have failed to crack for centuries.

### Public keys: a mail slot in Bob's door

With a private key, the same key locks and unlocks, so Alice and Bob must meet first to share it. A **public-key** system splits the key in two. Picture a mail slot in Bob's front door. Anyone can push a letter in, but only Bob can open the locked box behind it. Bob publishes a public key k_P that anyone can use to encrypt, and keeps a secret key k_S for decrypting. Seeing the slot must not reveal how to open the box.

### RSA: from a broken first try to the real thing

RSA was published at MIT by Rivest, Shamir and Adleman (Clifford Cocks had found it earlier, in secret). Encryption is c = m^e mod n and decryption is c^d mod n, so we need (m^e)^d ≡ m (mod n).

**One prime, n = p.** Fermat gives m^(k(p−1)+1) ≡ m (mod p), so it's enough to have e·d ≡ 1 (mod p−1). Pick e and pulverize to get d. This is correct but not secure: p is public, so Eve can pulverize too.

**Two primes.** Pick large random primes p and q. Publish n = pq, and compute φ(n) = (p−1)(q−1) privately. Choose e coprime to φ(n) and let d = e⁻¹ mod φ(n). The public key is (n, e) and the secret key is (n, d).

To copy Bob's calculation, Eve needs (p−1)(q−1) = n − (p+q) + 1. That number gives her p+q, and with pq already known, the quadratic formula gives p and q. So getting d this way is as hard as **factoring n**, and nobody knows a fast way to factor.

**Worked proof: decryption works.** Claim: if ed ≡ 1 (mod (p−1)(q−1)), then m^(ed) ≡ m (mod n) for every m.

1. (p−1) divides (p−1)(q−1), which divides ed − 1. So ed = k(p−1) + 1 for some k.
2. If p doesn't divide m, Fermat gives m^(ed) = (m^(p−1))^k · m ≡ 1^k · m = m (mod p). If p divides m, both sides are 0 mod p. Either way, p divides m^(ed) − m.
3. The same argument shows q divides m^(ed) − m.
4. p and q are distinct primes, so pq = n divides m^(ed) − m. ∎

Step 4 splits the problem into its prime pieces and then recombines them. That move has a name.

### The Chinese Remainder Theorem

Find x with 0 ≤ x < 55, x ≡ 4 (mod 5) and x ≡ 7 (mod 11). The candidates for the second condition are 7, 18, 29, 40 and 51, and only 29 satisfies the first. **CRT** says this always works: if p and q are coprime, then x ≡ a (mod p) together with x ≡ b (mod q) has exactly one solution mod pq.

*Existence:* let e_p be a multiple of q with e_p ≡ 1 (mod p), and e_q a multiple of p with e_q ≡ 1 (mod q). Each one comes from an inverse. Then x = a·e_p + b·e_q works: mod p the second term vanishes and the first gives a, and mod q it's the other way round. *Uniqueness:* if x and x′ both work, p and q each divide x − x′, so pq does too.

> **Key Insight:** RSA is safe because one direction is easy and the other is hard. Multiplying and taking powers mod n is fast, but recovering p and q from n is, as far as anyone knows, hopelessly slow.

---

## 🔑 Key Terminology

| Term | Definition | Example |
|------|-----------|---------|
| **Ciphertext** | The garbled, encrypted form of a message | MEET → DVVK (shift 17) |
| **Frequency analysis** | Matching common cipher symbols to common letters | Top symbol is probably E |
| **Public-key system** | Encrypt with a published key, decrypt with a secret one | RSA: (n, e) and (n, d) |
| **φ(n)** | How many numbers from 1 to n share no factor with n. For n = pq it equals (p−1)(q−1) | φ(187) = 160 |
| **CRT** | Remainders mod coprime p and q fix a unique remainder mod pq | x ≡ 29 (mod 55) |

---

## 💻 Code Examples

### Example 1: Eve breaks a Caesar shift

```python
A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

def shift(text, k):
    # mod 26 makes Z wrap back around to A
    return "".join(A[(A.index(c) + k) % 26] if c in A else c for c in text)

secret = shift("MEET ME AT THE LIBRARY AT NOON", 17)
print(secret)                      # DVVK DV RK KYV CZSIRIP RK EFFE
for k in range(26):                # only 26 keys, so just try every one
    if " THE " in shift(secret, -k):   # knowing it is English is enough
        print(k, shift(secret, -k))    # 17 MEET ME AT THE LIBRARY AT NOON
```

**What's happening:** With only 26 keys, the cipher offers no protection. A tiny bit of knowledge about the plaintext (it's English) picks out the right key at once.

### Example 2: Toy RSA, end to end

```python
from math import gcd

p, q, e = 11, 17, 7            # real RSA uses primes hundreds of digits long
n, phi = p * q, (p - 1) * (q - 1)
assert gcd(e, phi) == 1        # otherwise e has no inverse mod phi
d = pow(e, -1, phi)            # the Pulverizer's job (Python 3.8+)
c = pow(42, e, n)              # modular power never builds the huge 42**7
print(n, d, c, pow(c, d, n))   # 187 23 15 42
# The proof promises success for EVERY message, so check them all:
print(all(pow(pow(m, e, n), d, n) == m for m in range(n)))   # True
```

**What's happening:** 7·23 = 161 = 160 + 1, so ed ≡ 1 (mod φ). The last line also covers multiples of 11 and 17, which is case two of the proof.

> **💡 Try it:** Play Eve. Factor 187 by trial division, rebuild d, and decrypt 15.

---

## ✏️ Hands-On Exercises

### Exercise 1: RSA by hand (⏱️ ~20 min)

**Goal:** Use p = 5, q = 11, e = 3. Find n, φ(n) and d, then encrypt m = 8 and decrypt the result.

<details>
<summary>Answer</summary>
n = 55, φ = 40, and d = 27 (81 = 2·40 + 1). Encrypting gives 8³ = 512 ≡ 17 (mod 55), and pow(17, 27, 55) returns 8.
</details>

### Exercise 2: Code CRT (⏱️ ~25 min)

**Goal:** Write `crt(a, p, b, q)` using x = a·e_p + b·e_q, where e_p = q·pow(q, −1, p). Check that `crt(4, 5, 7, 11)` returns 29, then compare against brute force for all a < 5 and b < 11.

<details>
<summary>Hint</summary>
Return (a*e_p + b*e_q) % (p*q).
</details>

### Exercise 3: Why not one prime? (⏱️ ~15 min)

**Goal:** The public key is (p, e) = (23, 5). Act as Eve and find d with 5d ≡ 1 (mod 22). Then explain why using n = pq blocks this attack.

<details>
<summary>Answer</summary>
d = 9 (45 = 2·22 + 1). With n = pq, Eve would need (p−1)(q−1), and that would let her factor n.
</details>

---

## 📖 Curated Resources

1. **Lecture 10: Cryptography** — MIT OpenCourseWare
   - 🎥 https://www.youtube.com/watch?v=hRDOmMEZtPo
2. **Lecture 10 notes (PDF)** — MIT OpenCourseWare (also covers Diffie-Hellman)
   - 🔗 https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/mit6_1200j_s24_lec10.pdf
3. ***Mathematics for Computer Science*** — Lehman, Leighton, Meyer: the number theory chapter, on RSA and Euler's theorem
   - 🔗 https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/resources/mit6_042js15_textbook/

*MIT OpenCourseWare content, licensed CC BY-NC-SA 4.0.*

---

## 🤔 Reflection Questions

1. **Comprehension:** Why does the proof check mod p and mod q separately?
2. **Application:** A cipher with 26! keys broke quickly. Is a huge key space enough?
3. **Connection:** Where did the Pulverizer appear today?
4. **Critical Thinking:** Is trusting "factoring is hard" truly different from Enigma's hubris?
5. **Personal:** What is happening behind your browser's padlock icon?

---

## ➡️ Next Steps

**Tomorrow:** Graphs and Coloring. We switch to a new model, dots joined by lines, and meet a problem believed to be even harder than factoring.

**Before moving on, make sure you can:**
- [ ] Explain why classical ciphers break
- [ ] Generate (n, e, d) and walk through the correctness proof
- [ ] Solve two congruences with CRT

[← Previous: Day 09 — Modular Arithmetic](../week-02/day-09-modular-arithmetic.md) | [Course Home](../README.md) | [Next: Day 11 — Graphs and Coloring →](../week-02/day-11-graphs-coloring.md)
