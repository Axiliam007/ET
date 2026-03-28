import type { Chapter } from "../types";

/**
 * Grade 6 "Prime Time" — structured chapter aligned with multiplicative
 * structure of whole numbers (factors, primes, factorization, GCF/LCM).
 * Content is authored for clarity and assessment validity (not raw LLM dump).
 */
export const primeTimeChapter: Chapter = {
  meta: {
    id: "prime-time-g6",
    title: "Prime Time",
    grade: "Grade 6",
    unit: "Number Theory & Multiplicative Structure",
    description:
      "You explore how whole numbers break apart and build up: factor pairs, primes, prime factorization, greatest common factor (GCF), and least common multiple (LCM)—with problems that show why these ideas matter.",
  },
  lessons: [
    {
      id: "l1",
      slug: "ways-to-think-about-factors",
      title: "Ways to Think About Factors",
      shortTitle: "Factors & arrays",
      order: 1,
      conceptId: "intro",
      learningObjectives: [
        "Explain what it means for one whole number to be a factor of another.",
        "Use rectangular arrays to represent factor pairs of a number.",
        "Relate factors to multiplication and division with no remainder.",
      ],
      vocabulary: [
        {
          term: "Factor",
          definition:
            "A whole number that divides another whole number exactly (remainder 0). Equivalently: integers you can multiply to get a product.",
        },
        {
          term: "Factor pair",
          definition:
            "Two factors whose product is the target number (order may not matter for listing pairs).",
        },
        {
          term: "Product",
          definition: "The result of multiplying factors.",
        },
      ],
      sections: [
        {
          id: "s1",
          title: "From multiplication to structure",
          body: [
            "When you write 24 = 4 × 6, you are saying that 4 and 6 are factors of 24. The same 24 can be written many ways: 24 = 1 × 24 = 2 × 12 = 3 × 8 = 4 × 6. Each pair is a factor pair.",
            "A useful image is a rectangular array: rows and columns of equal-sized groups. If you can arrange 24 objects into a rectangle with whole-number side lengths, those side lengths are a factor pair.",
            "Division connects directly: 4 is a factor of 24 because 24 ÷ 4 has remainder 0. If there is a remainder, that divisor is not a factor.",
          ],
        },
        {
          id: "s2",
          title: "Why structure beats memorizing lists",
          body: [
            "Instead of memorizing every factor of every number, you learn strategies: test small primes first, use symmetry (if 3 is a factor, the partner is 24 ÷ 3), and record pairs so you do not miss one between sqrt-like bounds.",
            "For assessment, we care that you can justify using definitions—not that you recall factors of 144 instantly.",
          ],
        },
      ],
      guidedPractice: [
        {
          prompt: "List all factor pairs of 18 (write each pair once, with the smaller number first).",
          hint: "Start at 1 × … and move up until partners repeat.",
          solution:
            "1 × 18, 2 × 9, 3 × 6. (Next would be 6 × 3, already listed.) So pairs: (1,18), (2,9), (3,6).",
        },
        {
          prompt: "Is 7 a factor of 42? Explain in one sentence using division or multiplication.",
          hint: "Check whether 42 ÷ 7 is a whole number.",
          solution:
            "Yes: 42 ÷ 7 = 6 with remainder 0, so 7 is a factor (also 7 × 6 = 42).",
        },
      ],
      quiz: [
        {
          id: "l1q1",
          conceptId: "intro",
          prompt: "Which statement best matches the definition of factor used in this lesson?",
          options: [
            { id: "a", label: "A number you get by adding the same value repeatedly" },
            { id: "b", label: "A whole number that divides another whole number with remainder 0" },
            { id: "c", label: "Any number that appears in a word problem" },
          ],
          correctOptionId: "b",
          rationale:
            "Factors come from exact divisibility (or equivalent multiplication). Addition is a different operation.",
        },
        {
          id: "l1q2",
          conceptId: "intro",
          prompt: "Which pair is a factor pair of 28?",
          options: [
            { id: "a", label: "4 and 8 (because 4 + 8 = 12)" },
            { id: "b", label: "4 and 7 (because 4 × 7 = 28)" },
            { id: "c", label: "14 and 14 (because 14 + 14 = 28)" },
          ],
          correctOptionId: "b",
          rationale: "Factor pairs multiply to the number: 4 × 7 = 28.",
        },
        {
          id: "l1q3",
          conceptId: "intro",
          prompt: "Rectangular arrays with whole-number side lengths model which idea?",
          options: [
            { id: "a", label: "Factor pairs / factors" },
            { id: "b", label: "Only prime numbers" },
            { id: "c", label: "Decimal place value" },
          ],
          correctOptionId: "a",
          rationale: "Side lengths of a filled rectangle for n objects are a factor pair of n.",
        },
      ],
    },
    {
      id: "l2",
      slug: "factor-pairs-systematically",
      title: "Finding Factor Pairs Systematically",
      shortTitle: "Factor search",
      order: 2,
      conceptId: "factor_pairs",
      learningObjectives: [
        "Generate all factor pairs of a whole number using an organized search.",
        "Recognize when you have found every pair without duplicates.",
        "Connect factor pairs to area models (rows × columns).",
      ],
      vocabulary: [
        {
          term: "Systematic search",
          definition:
            "Testing possible factors in order (often 1, 2, 3, …) while recording pairs until the first factor exceeds its partner.",
        },
      ],
      sections: [
        {
          id: "s1",
          title: "A reliable procedure",
          body: [
            "To list factor pairs of n: start with 1 × n. Then test 2: if 2 divides n, record 2 and n ÷ 2. Continue with 3, 4, … Stop when the first factor is greater than its partner—after that you only repeat pairs in reverse order.",
            "Example: n = 36. You get 1×36, 2×18, 3×12, 4×9, 6×6. The next trial 7 does not divide 36. Then 8 is too large relative to its partner path—you are done.",
          ],
        },
        {
          id: "s2",
          title: "Square numbers",
          body: [
            "When a factor pair repeats (like 6×6 for 36), the number is a perfect square. That middle pair is not duplicated as two different pairs unless you intentionally list both orderings.",
          ],
        },
      ],
      guidedPractice: [
        {
          prompt: "List all factor pairs of 40.",
          hint: "Try divisors 1, 2, 4, 5, …",
          solution: "(1,40), (2,20), (4,10), (5,8). Next would repeat.",
        },
      ],
      quiz: [
        {
          id: "l2q1",
          conceptId: "factor_pairs",
          prompt: "You are listing factor pairs of 48. After 4 × 12, the next successful smaller factor is:",
          options: [
            { id: "a", label: "5" },
            { id: "b", label: "6" },
            { id: "c", label: "7" },
          ],
          correctOptionId: "b",
          rationale: "48 ÷ 6 = 8, so 6 × 8 is a pair. 48 ÷ 5 is not whole.",
        },
        {
          id: "l2q2",
          conceptId: "factor_pairs",
          prompt: "Which number has exactly three distinct factors (1, p, p²) if p is prime?",
          options: [
            { id: "a", label: "A prime number" },
            { id: "b", label: "The square of a prime" },
            { id: "c", label: "Any composite number" },
          ],
          correctOptionId: "b",
          rationale: "For prime p, factors of p² are 1, p, and p²—three factors.",
        },
      ],
    },
    {
      id: "l3",
      slug: "prime-and-composite",
      title: "Prime and Composite Numbers",
      shortTitle: "Primes & composites",
      order: 3,
      conceptId: "prime_composite",
      learningObjectives: [
        "Classify whole numbers greater than 1 as prime or composite using definitions.",
        "Explain why 1 is neither prime nor composite in standard curricula.",
        "Use divisibility tests as tools—not magic shortcuts without meaning.",
      ],
      vocabulary: [
        {
          term: "Prime number",
          definition:
            "A whole number greater than 1 whose only positive factors are 1 and itself.",
        },
        {
          term: "Composite number",
          definition:
            "A whole number greater than 1 that has at least one factor other than 1 and itself.",
        },
      ],
      sections: [
        {
          id: "s1",
          title: "Definitions drive classification",
          body: [
            "2 is prime: its factors are 1 and 2. 9 is composite: 3 is another factor.",
            "The number 1 is a special case: it does not have two distinct factors the way primes require, and it does not have an extra factor like composites. So we call 1 neither prime nor composite.",
          ],
        },
        {
          id: "s2",
          title: "Divisibility as evidence",
          body: [
            "To show a number is composite, exhibit one proper factor. To argue a number is prime, you must show no divisor works between 1 and the number—often organized by testing primes up to the square root (an efficiency idea you may use with justification in class).",
          ],
        },
      ],
      guidedPractice: [
        {
          prompt: "Is 51 prime or composite? Give a factor other than 1 and 51.",
          hint: "Try small primes.",
          solution: "Composite: 51 = 3 × 17.",
        },
      ],
      quiz: [
        {
          id: "l3q1",
          conceptId: "prime_composite",
          prompt: "Which is prime?",
          options: [
            { id: "a", label: "1" },
            { id: "b", label: "29" },
            { id: "c", label: "39" },
          ],
          correctOptionId: "b",
          rationale: "29 has only factors 1 and 29. 39 = 3 × 13. 1 is not prime by definition.",
        },
        {
          id: "l3q2",
          conceptId: "prime_composite",
          prompt: "Why is 1 neither prime nor composite?",
          options: [
            {
              id: "a",
              label: "Because it is negative",
            },
            {
              id: "b",
              label: "Because it does not fit the prime/composite definitions used for numbers > 1",
            },
            { id: "c", label: "Because it has infinitely many factors" },
          ],
          correctOptionId: "b",
          rationale: "Standard definitions are stated for whole numbers greater than 1.",
        },
      ],
    },
    {
      id: "l4",
      slug: "prime-factorization",
      title: "Prime Factorization & Factor Trees",
      shortTitle: "Prime factorization",
      order: 4,
      conceptId: "prime_factorization",
      learningObjectives: [
        "Express a composite number as a product of primes (with exponents when helpful).",
        "Recognize that prime factorization is unique up to order (Fundamental Theorem of Arithmetic at an intuitive level).",
        "Use factor trees to organize splitting a number into factors until all leaves are prime.",
      ],
      vocabulary: [
        {
          term: "Prime factorization",
          definition:
            "Writing a whole number as a product of primes (e.g., 72 = 2³ × 3²).",
        },
        {
          term: "Factor tree",
          definition:
            "A branching diagram that splits a number into factors until the ends (leaves) are all prime.",
        },
      ],
      sections: [
        {
          id: "s1",
          title: "How factor trees work",
          body: [
            "Start with your number at the top. Split it into any factor pair you like on the next level. Repeat for each composite branch until every end is prime. Multiplying all the primes at the leaves rebuilds the original number.",
            "Different trees can look different, but the multiset of primes at the bottom is the same for a given starting number—this uniqueness is why prime factorization is powerful.",
          ],
        },
        {
          id: "s2",
          title: "Exponent form",
          body: [
            "Collect repeated primes: 2 × 2 × 2 × 3 × 3 = 2³ × 3². Exponents compress the record without losing information.",
          ],
        },
      ],
      guidedPractice: [
        {
          prompt: "Write the prime factorization of 84 using exponents.",
          hint: "Divide out 2s, then 3, then 7.",
          solution: "84 = 2² × 3 × 7.",
        },
      ],
      quiz: [
        {
          id: "l4q1",
          conceptId: "prime_factorization",
          prompt: "Which expression is a correct prime factorization of 45?",
          options: [
            { id: "a", label: "9 × 5" },
            { id: "b", label: "3² × 5" },
            { id: "c", label: "15 × 3" },
          ],
          correctOptionId: "b",
          rationale: "9 and 15 are not prime. 3² × 5 uses only primes.",
        },
        {
          id: "l4q2",
          conceptId: "prime_factorization",
          prompt: "The prime factorization of 72 includes which prime base with the largest exponent in this factorization?",
          options: [
            { id: "a", label: "2 (with exponent 3)" },
            { id: "b", label: "3 (with exponent 2)" },
            { id: "c", label: "5" },
          ],
          correctOptionId: "a",
          rationale: "72 = 2³ × 3²; exponent on 2 is 3, on 3 is 2.",
        },
      ],
    },
    {
      id: "l5",
      slug: "gcf-and-lcm",
      title: "Greatest Common Factor & Least Common Multiple",
      shortTitle: "GCF & LCM",
      order: 5,
      conceptId: "gcf_lcm",
      learningObjectives: [
        "Compute GCF of two numbers using prime factorization (common primes with minimum exponents).",
        "Compute LCM using prime factorization (all primes with maximum exponents).",
        "Interpret GCF and LCM in simple context problems (tiling, repeating cycles).",
      ],
      vocabulary: [
        {
          term: "GCF",
          definition:
            "The largest whole number that is a factor of each given number.",
        },
        {
          term: "LCM",
          definition:
            "The smallest positive whole number that is a multiple of each given number.",
        },
      ],
      sections: [
        {
          id: "s1",
          title: "Prime grid for two numbers",
          body: [
            "Write prime factorizations in parallel. For GCF, take each prime that appears in both, using the smaller exponent. For LCM, take each prime that appears in either, using the larger exponent.",
            "Example: 24 = 2³ × 3 and 60 = 2² × 3 × 5. GCF = 2² × 3 = 12. LCM = 2³ × 3 × 5 = 120.",
          ],
        },
        {
          id: "s2",
          title: "Relationship",
          body: [
            "For two positive integers a and b: GCF(a,b) × LCM(a,b) = a × b. This is a useful check when calculations are careful.",
          ],
        },
      ],
      guidedPractice: [
        {
          prompt: "Find GCF(18, 24) and LCM(18, 24).",
          hint: "18 = 2 × 3²; 24 = 2³ × 3.",
          solution: "GCF = 2 × 3 = 6. LCM = 2³ × 3² = 72.",
        },
      ],
      quiz: [
        {
          id: "l5q1",
          conceptId: "gcf_lcm",
          prompt: "GCF(12, 18) equals:",
          options: [
            { id: "a", label: "6" },
            { id: "b", label: "36" },
            { id: "c", label: "3" },
          ],
          correctOptionId: "a",
          rationale: "Common factors: 1,2,3,6 — greatest is 6.",
        },
        {
          id: "l5q2",
          conceptId: "gcf_lcm",
          prompt: "LCM(4, 10) equals:",
          options: [
            { id: "a", label: "2" },
            { id: "b", label: "20" },
            { id: "c", label: "40" },
          ],
          correctOptionId: "b",
          rationale: "Multiples of 4: 4,8,12,16,20,… Multiples of 10: 10,20,… Smallest common is 20.",
        },
      ],
    },
    {
      id: "l6",
      slug: "using-structure-in-problems",
      title: "Using Structure in Problems",
      shortTitle: "Applications",
      order: 6,
      conceptId: "applications",
      learningObjectives: [
        "Choose GCF vs LCM based on problem structure (largest shared measure vs first common repeat).",
        "Explain reasoning in complete sentences for open tasks.",
      ],
      vocabulary: [],
      sections: [
        {
          id: "s1",
          title: "GCF vs LCM: quick decision guide",
          body: [
            "Splitting or tiling into the largest identical pieces often involves GCF (biggest length that measures both totals).",
            "Aligning repeating events (two people visiting on schedules) often involves LCM (first time both cycles match).",
            "If your answer is bigger than both original numbers for a ‘first meeting’ problem, that is a clue you computed something like an LCM rather than a GCF.",
          ],
        },
      ],
      guidedPractice: [
        {
          prompt: "Two ropes are 24 m and 36 m. You cut equal segments as large as possible using whole meters. How long is each segment?",
          hint: "Largest segment length dividing both: GCF.",
          solution: "GCF(24,36)=12. Each segment is 12 m.",
        },
      ],
      quiz: [
        {
          id: "l6q1",
          conceptId: "applications",
          prompt: "Bus A returns every 12 minutes and Bus B every 18 minutes. If both leave now, after how many minutes will they next leave together?",
          options: [
            { id: "a", label: "6 minutes (GCF)" },
            { id: "b", label: "36 minutes (LCM)" },
            { id: "c", label: "216 minutes" },
          ],
          correctOptionId: "b",
          rationale: "You want the first common multiple: LCM(12,18)=36.",
        },
        {
          id: "l6q2",
          conceptId: "applications",
          prompt: "Which situation most likely requires GCF?",
          options: [
            { id: "a", label: "Finding the first time two periodic events align" },
            { id: "b", label: "Tiling a floor with the largest possible square tiles" },
            { id: "c", label: "Listing multiples of 7" },
          ],
          correctOptionId: "b",
          rationale: "Largest square tile for both dimensions uses GCF of side lengths (in consistent units).",
        },
      ],
    },
  ],
  unitAssessment: {
    id: "unit-a",
    title: "Prime Time — Unit Check",
    questions: [
      {
        id: "ua1",
        conceptId: "factor_pairs",
        prompt: "All factor pairs of 20 are:",
        options: [
          { id: "a", label: "(1,20), (2,10), (4,5)" },
          { id: "b", label: "(1,20), (3,7)" },
          { id: "c", label: "(2,10), (4,6)" },
        ],
        correctOptionId: "a",
        rationale: "20 = 1×20 = 2×10 = 4×5.",
      },
      {
        id: "ua2",
        conceptId: "prime_composite",
        prompt: "Which is composite?",
        options: [
          { id: "a", label: "17" },
          { id: "b", label: "23" },
          { id: "c", label: "91" },
        ],
        correctOptionId: "c",
        rationale: "91 = 7 × 13.",
      },
      {
        id: "ua3",
        conceptId: "prime_factorization",
        prompt: "Prime factorization of 126 is:",
        options: [
          { id: "a", label: "2 × 3² × 7" },
          { id: "b", label: "2 × 63" },
          { id: "c", label: "9 × 14" },
        ],
        correctOptionId: "a",
        rationale: "126 = 2 × 63 = 2 × 7 × 9 = 2 × 3² × 7.",
      },
      {
        id: "ua4",
        conceptId: "gcf_lcm",
        prompt: "GCF(30, 42) =",
        options: [
          { id: "a", label: "6" },
          { id: "b", label: "210" },
          { id: "c", label: "14" },
        ],
        correctOptionId: "a",
        rationale: "30 = 2×3×5; 42 = 2×3×7; GCF = 2×3 = 6.",
      },
      {
        id: "ua5",
        conceptId: "gcf_lcm",
        prompt: "LCM(8, 12) =",
        options: [
          { id: "a", label: "24" },
          { id: "b", label: "96" },
          { id: "c", label: "4" },
        ],
        correctOptionId: "a",
        rationale: "8 = 2³; 12 = 2²×3; LCM = 2³×3 = 24.",
      },
      {
        id: "ua6",
        conceptId: "applications",
        prompt: "You pack 48 pencils and 60 crayons into identical bags with the same counts in each bag, using all supplies. What is the greatest number of bags possible?",
        options: [
          { id: "a", label: "12 bags (GCF)" },
          { id: "b", label: "240 bags" },
          { id: "c", label: "2 bags" },
        ],
        correctOptionId: "a",
        rationale: "GCF(48,60)=12 maximizes the number of equal groups.",
      },
    ],
  },
};
