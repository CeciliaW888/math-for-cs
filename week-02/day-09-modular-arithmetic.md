# Day 09: Modular Arithmetic

[← Previous: Day 08 — Divisibility](../week-02/day-08-divisibility.md) | [Course Home](../README.md) | [Next: Day 10 — Cryptography →](../week-02/day-10-cryptography.md)

---

## 🎯 Learning Objectives

By the end of today, you will be able to:

1. Define a ≡ b (mod n) via remainders
2. Reduce big computations step by step
3. Find inverses, or show none exist
4. Shrink exponents with Fermat's little theorem

**Difficulty:** 🟡 Intermediate
**Estimated Time:** 1.5 hours (1 reading + 0.5 hands-on)

---

## 📚 Core Concepts

### Congruence: only the remainder matters

You already do modular arithmetic. Even plus odd is odd. 357 × 994 ends in 8 because 7 × 4 = 28. If it is 2:39 PM now, in 49 hours it will be 3:39 PM, since two whole days vanish. In each case we throw away multiples of some number n (2, 10, 24) and keep only what is left over. Hash tables, checksums, and tomorrow's cryptography all run on this.

Formally, **a is congruent to b modulo n**, written a ≡ b (mod n), when n | (a − b). So 17 ≡ 12 (mod 5) because 17 − 12 = 5, and 17 ≡ 32 (mod 5) because 17 − 32 = −15, but 17 ≢ 33 (mod 5). Mod 5, the integers split into five **congruence classes** (the remainders 0, 1, 2, 3, 4). For example, class 1 is {…, −9, −4, 1, 6, 11, …}.

Think of a running track that is n meters around. After a long run, your *position* depends only on your total distance minus whole laps. Two runners who covered 1,730 m and 1,230 m on a 100 m track both stand 30 m past the start line. Congruent numbers are runners standing side by side, however different their total distances.

The key link, proven in the lecture in both directions, is: **a ≡ b (mod n) exactly when rem(a, n) = rem(b, n).** If both have remainder r, then a − b = (q − q′)·n. Conversely, if b = q′n + r and a = b + kn, then a = (q′ + k)n + r, and uniqueness in the division theorem forces the same r.

Notation warning: "a = b mod n" could mean the *relation* a ≡ b (mod n) or the *function* a = rem(b, n), so we write ≡ for one and rem for the other. Languages differ too: Python's `-7 % 5` is 3, matching rem; C and JavaScript give −2.

### Arithmetic: replace anything with something congruent

If a ≡ b (mod n), then for any c: a + c ≡ b + c, a − c ≡ b − c, and a·c ≡ b·c. In practice, you may **reduce at every intermediate step**. By induction on c, powers follow too: a ≡ b implies aᶜ ≡ bᶜ. Bases can be swapped, but **exponents cannot**: 1 ≡ 6 (mod 5), yet (−1)¹ = −1 while (−1)⁶ = 1.

The lecture's showpiece: find the remainder of 11335¹¹¹¹¹ · (6 + 7799⁵⁰⁰⁰) divided by 100. Reduce the bases: 11335 ≡ 35 and 7799 ≡ −1 (mod 100), since −1 is far easier than 99. Then (−1)⁵⁰⁰⁰ = 1, so the bracket is 7. Powers of 35 run 35, 25, 75, 25, 75, …, so an odd power above 1 gives 75. Finally 75 · 7 = 525 ≡ 25. Answer: 25, without ever writing a 50,000-digit number.

### Division needs an inverse

Can we cancel? Mod 6, 3x ≡ 3 does *not* force x ≡ 1, because x = 3 works too (9 ≡ 3). Cancelling means multiplying by a **multiplicative inverse**: a number a⁻¹ with a·a⁻¹ ≡ 1 (mod n). For example, 2 is the inverse of 3 mod 5, since 6 ≡ 1.

> **Proof: a has an inverse mod n exactly when gcd(a, n) = 1.** An inverse b means n | (ab − 1), so ab − 1 = qn for some integer q, that is, 1 = b·a + (−q)·n. So a has an inverse exactly when 1 is an integer linear combination of a and n. By Day 08, that happens exactly when gcd(a, n) divides 1, which means gcd(a, n) = 1. ∎

The Pulverizer's coefficient for a *is* the inverse. Mod 30, 7 is invertible because gcd(7, 30) = 1, and 7 · 13 = 91 ≡ 1. So 7x ≡ 14 (mod 30) gives x ≡ 14 · 13 = 182 ≡ 2.

### Fermat's little theorem: exponents mod p − 1

Exponents cannot be reduced mod n, but for a prime there is a replacement. **Fermat's little theorem:** if p is prime and p ∤ a, then a^(p−1) ≡ 1 (mod p).

Proof idea: the numbers a, 2a, …, (p−1)a are all nonzero mod p, and no two match. If ia ≡ ja, cancel a, which is allowed because gcd(a, p) = 1, to get i = j. So mod p they are just 1, 2, …, p−1 shuffled. Multiplying everything gives a^(p−1) · (p−1)! ≡ (p−1)!, and since (p−1)! is coprime to p we can cancel it, leaving a^(p−1) ≡ 1.

So mod a prime p, **exponents can be reduced mod p − 1**. Take 7⁹⁵ mod 13. Since 95 = 7·12 + 11, we get 7⁹⁵ ≡ 7¹¹. And 7¹¹ · 7 = 7¹² ≡ 1, so 7¹¹ is the inverse of 7, which is 2 (since 14 ≡ 1). The answer is 2.

> **Key Insight:** Working mod n means only remainders matter, so you may reduce at every step, except in exponents. Division works exactly when gcd(a, n) = 1, and for primes, Fermat lets you shrink exponents mod p − 1.

---

## 🔑 Key Terminology

| Term | Definition | Example |
|------|-----------|---------|
| **a ≡ b (mod n)** | n divides a − b | 17 ≡ 2 (mod 5) |
| **rem(a, n)** | Remainder in 0…n−1 | rem(−7, 5) = 3 |
| **Congruence class** | All integers with one remainder | {…, −4, 1, 6, …} |
| **Inverse a⁻¹** | a·a⁻¹ ≡ 1 (mod n) | 13 mod 30 for 7 |
| **Coprime** | gcd(a, n) = 1 | 7 and 30 |
| **Fermat's little theorem** | a^(p−1) ≡ 1 (mod p) | 7¹² ≡ 1 (mod 13) |

---

## 💻 Code Examples

### Example 1: Reduce early, reduce often

```python
# Congruent inputs give congruent outputs for +, -, and *.
n = 100
big = 11335**11111 * (6 + 7799**5000) % n
small = (35**11111 % n) * ((6 + (-1)**5000) % n) % n
print(big, small)

# Powers of 35 mod 100 settle into a repeating cycle.
print([pow(35, k, n) for k in range(1, 9)])

# Python's % returns 0..n-1 for positive n, the same convention as rem.
print(-7 % 5, 17 % 5, 12 % 5)
```

```
25 25
[35, 25, 75, 25, 75, 25, 75, 25]
3 2 2
```

**What's happening:** The giant computation and the reduced one agree; the cycle explains the 75.

### Example 2: Inverses and Fermat

```python
from math import gcd

def inverses(n):
    # An inverse of a exists exactly when gcd(a, n) == 1.
    return {a: pow(a, -1, n) for a in range(1, n) if gcd(a, n) == 1}

print("mod 6:", inverses(6))
print("mod 7:", inverses(7))
print("7x = 14 (mod 30): x =", 14 * pow(7, -1, 30) % 30)

# Fermat lets us cut the exponent 95 down to 95 rem 12.
print(pow(7, 95, 13), pow(7, 95 % 12, 13))
```

```
mod 6: {1: 1, 5: 5}
mod 7: {1: 1, 2: 4, 3: 5, 4: 2, 5: 3, 6: 6}
7x = 14 (mod 30): x = 2
2 2
```

**What's happening:** Mod 6 only 1 and 5 are invertible; mod the prime 7, everything nonzero is. `pow(a, -1, n)` (Python 3.8+) runs the extended Euclidean algorithm.

> **💡 Try it:** Does a¹¹ ≡ 1 (mod 12) hold? Why not?

---

## ✏️ Hands-On Exercises

### Exercise 1: Day of the week (⏱️ ~10 min)

Today is Tuesday. What day is it in 100 days? In 10¹⁰ days?

<details>
<summary>Answer</summary>
100 ≡ 2: Thursday. 10 ≡ 3, and 3⁶ ≡ 1 by Fermat, so 10¹⁰ ≡ 3⁴ = 81 ≡ 4: Saturday.
</details>

### Exercise 2: Solve a congruence (⏱️ ~15 min)

Solve 4x ≡ 3 (mod 9). Why has 4x ≡ 3 (mod 8) no solution?

<details>
<summary>Answer</summary>
4·7 = 28 ≡ 1, so x ≡ 3·7 = 21 ≡ 3. Mod 8, 4x is always 0 or 4, never 3, since gcd(4, 8) = 4 ∤ 3.
</details>

### Exercise 3: Hunting a pseudo-prime (⏱️ ~20 min)

Find composite n < 1000 with 2^(n−1) ≡ 1 (mod n).

<details>
<summary>Hint</summary>
Use `pow(2, n - 1, n)` and a primality check. The first is 341 = 11·31.
</details>

---

## 📖 Curated Resources

1. **Lecture 9: Modular Arithmetic** — MIT OpenCourseWare
   - 🎥 https://www.youtube.com/watch?v=Nn8nBPyzzQ0
2. **Lecture 9 notes** — MIT OpenCourseWare (CC BY-NC-SA 4.0)
   - 🔗 https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/mit6_1200j_s24_lec09.pdf
3. ***Mathematics for Computer Science*** — Lehman, Leighton, Meyer
   - 🔗 https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/resources/mit6_042js15_textbook/ (the chapter on number theory)

---

## 🤔 Reflection Questions

1. **Comprehension:** Why can bases, but not exponents, be swapped for congruent numbers?
2. **Application:** Why do hash tables often use a prime number of buckets?
3. **Connection:** How does Day 08's Pulverizer become a division tool today?

---

## ➡️ Next Steps

**Tomorrow:** Day 10 — Cryptography: inverses and Fermat's exponent trick become RSA.

**Before moving on, make sure you can:**
- [ ] Reduce big expressions mod n
- [ ] Find inverses and apply Fermat

[← Previous: Day 08 — Divisibility](../week-02/day-08-divisibility.md) | [Course Home](../README.md) | [Next: Day 10 — Cryptography →](../week-02/day-10-cryptography.md)
