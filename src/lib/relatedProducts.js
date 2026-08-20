// Picks the products to show in the "You might also like" strip on a
// product page.
//
// Content-based on purpose: it ranks by what a piece actually *is*
// (collection, then category) rather than by order history, so it works
// from day one with no purchase data behind it.

const scoreAgainst = (product) => (candidate) => {
  let score = 0;

  // Same named collection (Joy / Bloom / Rebirth) is the strongest signal.
  // Guarded on truthiness so two untagged products don't "match" on null.
  if (product.collection && candidate.collection === product.collection) {
    score += 2;
  }

  const cats = product.categories || [];
  const shared = (candidate.categories || []).filter((c) => cats.includes(c));
  if (shared.length) score += 1;

  return score;
};

// Stable string hash. Ordering within a score tier is seeded with the
// current product's id so that each product surfaces a DIFFERENT slice of
// its tier — otherwise the same handful of pieces (lowest displayOrder)
// would be recommended on literally every page. Still fully deterministic,
// which matters because these pages are statically generated: the same
// product always gets the same row across rebuilds.
const seededRank = (seed) => (candidate) => {
  const s = `${seed}:${candidate._id}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0;
  }
  return h;
};

export function getRelatedProducts(product, allProducts, limit = 4) {
  if (!product) return [];

  const others = (allProducts || []).filter(
    (p) => p?._id && p._id !== product._id,
  );

  const score = scoreAgainst(product);
  const rank = seededRank(product._id);
  const byScoreThenSeed = (a, b) => score(b) - score(a) || rank(a) - rank(b);

  const related = others
    .filter((p) => score(p) > 0)
    .sort(byScoreThenSeed);

  if (related.length >= limit) return related.slice(0, limit);

  // Not enough genuinely-related pieces: top up with the rest of the
  // catalogue so the row never renders half-empty.
  const chosen = new Set(related.map((p) => p._id));
  const filler = others
    .filter((p) => !chosen.has(p._id))
    .sort((a, b) => rank(a) - rank(b))
    .slice(0, limit - related.length);

  return [...related, ...filler];
}
