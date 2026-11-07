# Day 22: Expectation

[← Previous: Day 21 — Random Variables](../week-03/day-21-random-variables.md) | [Course Home](../README.md) | [Next: Day 23 — Expectation and Variance →](../week-04/day-23-expectation-variance.md)

---

## 🎯 Learning Objectives

By the end of today, you will be able to:

1. Compute an expectation from its definition
2. Derive the mean time to failure, 1/p
3. Use linearity of expectation with indicator variables

**Difficulty:** 🟡 Intermediate
**Estimated Time:** 1.5 hours (1 hour reading + 30 min hands-on)

---

## 📚 Core Concepts

### One number for a whole function

Yesterday you learned that a random variable is really a function: give it an outcome and it hands back a number. Functions carry a lot of information, and often you want a single summary, such as "how many comparisons does this randomized algorithm make *on average*?" That summary is the **expectation**.

The definition is a weighted average. For a random variable X on sample space S:

E[X] = Σ over outcomes ω ∈ S of Pr[ω] · X(ω)

Roll a fair die D. Each face has probability 1/6, so E[D] = (1 + 2 + … + 6)/6 = 21/6 = 3.5. Notice that 3.5 is not a face on the die. The expectation is the long-run average, not a value you should ever expect to see.

Think of expectation as the **balance point of a seesaw**. Put a weight equal to each probability at each value on a plank, and E[X] is where the plank balances. A heavy weight far to the right drags the balance point right, even if that value is rare.

Two shortcuts save work. First, you can group outcomes by the value X takes: E[X] = Σ over values x of Pr[X = x] · x. Second, for an **indicator variable** I for event A (1 if A happens, 0 if not), all the 0 terms vanish and you get E[I] = Pr[A]. That tiny fact will power the rest of the day.

The lecture's three-player coin-guessing game splits the pot among correct guessers. With random guessers, each player's expected net is 0: a fair game. But if players 2 and 3 secretly always guess opposite each other, player 1 can never be the lone winner, and their expected net drops to −1/2 per round. Expectation exposes a rigged game.

### Tail sums and the mean time to failure

When X only takes natural-number values, there is a second formula:

E[X] = Σ (i = 0 to ∞) of Pr[X > i]

**Why it works (informal proof).** Write out the tail probabilities in rows:

- Pr[X > 0] = Pr[X=1] + Pr[X=2] + Pr[X=3] + …
- Pr[X > 1] = Pr[X=2] + Pr[X=3] + …
- Pr[X > 2] = Pr[X=3] + …

Now add down the columns instead of across the rows. Pr[X=1] appears once, Pr[X=2] appears twice, Pr[X=3] three times. So the total is 1·Pr[X=1] + 2·Pr[X=2] + 3·Pr[X=3] + …, which is exactly E[X]. ∎

This formula shines on the **mean time to failure** problem. Flip a coin with Pr[heads] = p until the first head, and let F be the number of flips. F > i means the first i flips were all tails, which has probability (1 − p)^i. Summing a geometric series:

E[F] = Σ (1 − p)^i = 1 / (1 − (1 − p)) = 1/p

A fair coin takes 2 flips on average. A hard drive that dies with probability one in a million per day lasts a million days on average. A randomized algorithm that succeeds with probability 1/3 per run needs 3 runs on average. This waiting time follows the **geometric distribution**.

### Linearity of expectation

If you remember one thing about probability from this course, the lecturer suggests it should be this:

E[X + Y] = E[X] + E[Y] and E[cX] = c · E[X]

It needs **no independence and no disjointness**, only that X and Y live on the same sample space. Compare that with the product rule for probabilities, which demands independence. Two dice sum to 7 on average whether they are tossed separately or glued together.

The skill is **decomposition**: write a messy variable as a sum of simple ones, usually indicators.

- **Waiting for k heads.** Split the waiting time into k separate waits for "the next head." Each averages 1/p, so the total averages k/p.
- **Heads in n flips.** H = H₁ + … + Hₙ, where Hᵢ marks flip i as heads. Each E[Hᵢ] = p, so E[H] = np.
- **Hearts in a 3-card hand.** Instead of computing Pr[0], Pr[1], Pr[2], Pr[3 hearts] with binomial coefficients, use one indicator per heart card. Each specific heart lands in your hand with probability 3/52, so E = 13 · 3/52 = 3/4.
- **Returning phones at random.** n kids get n phones back in a random shuffle. Kid k gets their own phone with probability (n−1)!/n! = 1/n. Summing n of these gives an expected **1** match, no matter how large n is.

Now spin a Lazy Susan with n phones instead. Either every phone lines up (probability 1/n) or none does. The expected number of matches is still 1, yet the two situations feel completely different. Expectation summarizes, but it does not tell the whole story.

> **Key Insight:** To find an average, break the quantity into 0/1 pieces, find each piece's probability, and add them up. Linearity never asks whether the pieces are independent.

---

## 🔑 Key Terminology

| Term | Definition | Example |
|------|-----------|---------|
| **Expectation E[X]** | Probability-weighted average of X's values | Fair die: 3.5 |
| **Indicator variable** | 1 if an event occurs, else 0 | Hᵢ = 1 if flip i is heads |
| **Mean time to failure** | Expected trials until first success: 1/p | p = 1/6 gives 6 rolls |
| **Linearity of expectation** | E[ΣcᵢXᵢ] = ΣcᵢE[Xᵢ], always | Two dice average 7 |

---

## 💻 Code Examples

### Example 1: Brute force versus linearity

```python
from fractions import Fraction
from itertools import combinations

deck = [(rank, suit) for rank in range(13) for suit in "SHDC"]
hands = list(combinations(deck, 3))

# Definition: average over all equally likely hands.
total = sum(sum(1 for card in hand if card[1] == "H") for hand in hands)
print(Fraction(total, len(hands)))   # 3/4

# Linearity: 13 heart indicators, each in the hand with probability 3/52.
print(13 * Fraction(3, 52))          # 3/4
```

**What's happening:** The first method touches every hand; the second is one line of arithmetic. Same exact answer.

### Example 2: Same mean, different worlds

```python
import random
from collections import Counter

def shuffle(n):
    phones = random.sample(range(n), n)
    return sum(kid == phone for kid, phone in enumerate(phones))

def lazy_susan(n):
    # A spin only rotates, so either every phone lines up or none does.
    return n if random.randrange(n) == 0 else 0

random.seed(1)
for game in (shuffle, lazy_susan):
    results = [game(10) for _ in range(100_000)]
    print(game.__name__, sum(results) / 100_000, Counter(results).most_common(3))
```

**What's happening:** Both averages land near 1 (1.000 and 0.987), as linearity predicts. But the Lazy Susan gives 0 matches 90% of the time and 10 otherwise; the shuffle spreads over 0, 1, 2…

> **💡 Try it:** Change 10 to 100. Does the average move?

---

## ✏️ Hands-On Exercises

### Exercise 1: The rigged coin game (⏱️ ~15 min, paper)

Player 1 guesses heads. Tabulate player 1's net for the 8 equally likely (player 2, player 3, coin) combinations ($2 in each, pot split among winners). Average all 8, then only those where players 2 and 3 disagree.

<details>
<summary>Answer</summary>
Nets: 0, 0, +1, −2, +1, −2, +4, −2, average 0. When players 2 and 3 disagree: +1 or −2 equally, so −1/2.
</details>

### Exercise 2: Waiting for a six (⏱️ ~20 min, coding)

Simulate rolling a die until the first 6, 100,000 times, and average the roll counts. Repeat for "two sixes." Compare with 1/p and 2/p.

<details>
<summary>Hint</summary>
A `while` loop with `random.randint(1, 6)`; expect about 6 and 12.
</details>

### Exercise 3: Shared birthdays (⏱️ ~20 min, paper)

Among 30 people with 365 equally likely birthdays, what is the expected number of *pairs* sharing a birthday?

<details>
<summary>Answer</summary>
C(30, 2) = 435 pair indicators, each 1/365: 435/365 ≈ 1.19.
</details>

---

## 📖 Curated Resources

1. **Lecture 22: Expectation** — MIT OpenCourseWare
   - 🎥 https://www.youtube.com/watch?v=h6fbQD8NKKo
   - Why: the live gambling demo.
2. **Lecture 22 notes** — MIT OpenCourseWare
   - 🔗 https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/mit6_1200j_s24_lec22.pdf
3. ***Mathematics for Computer Science*** — Lehman, Leighton, Meyer
   - 🔗 https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/resources/mit6_042js15_textbook/ (the chapter on expectation)

---

## 🤔 Reflection Questions

1. **Comprehension:** Why is E[I] = Pr[A] for an indicator?
2. **Application:** A request succeeds with probability 0.98 per try. Expected tries?
3. **Connection:** How does the tail-sum proof echo the sum-rearranging tricks of Day 05?
4. **Critical Thinking:** Equal expectations: what can still differ?

---

## ➡️ Next Steps

**Tomorrow:** Expectation and Variance — bounding failure chances, and measuring spread.

**Before moving on, make sure you can:**
- [ ] Compute E[X] from the definition
- [ ] Derive E[F] = 1/p with tail sums
- [ ] Apply linearity with indicators

[← Previous: Day 21 — Random Variables](../week-03/day-21-random-variables.md) | [Course Home](../README.md) | [Next: Day 23 — Expectation and Variance →](../week-04/day-23-expectation-variance.md)
