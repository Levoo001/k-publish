// Category membership, in one place.
//
// Historically each collection page guessed membership from the product
// NAME ("co-ords = anything not called a dress"). That is opt-out, so every
// new product silently lands in Co-ords until someone hardcodes an
// exception — which is how a blouse and a dress ended up there.
//
// The rule now: an explicit `categories` tag in Sanity always wins. Only
// products with no tag at all fall back to the old name heuristic, so
// untagged legacy products keep behaving exactly as before. Tagging a
// product correctly in Studio is now all it takes to fix its placement —
// no code change, no hardcoded name lists.

const nameOf = (p) => p.name?.toLowerCase() || "";

const NAME_FALLBACK = {
  "co-ords": (n) => !n.includes("dress") && !n.includes("belt"),
  dresses: (n) => n.includes("dress"),
  dressess: (n) => n.includes("dress"),
  blouse: (n) => n.includes("blouse"),
};

// Route slugs that are really the same category ("dressess" is a legacy
// misspelling still linked from the homepage).
const canonical = (category) =>
  category === "dressess" ? "dresses" : category;

export function matchesCategory(product, category) {
  const tags = product?.categories || [];

  // Explicitly tagged: the tag is the single source of truth.
  if (tags.length) return tags.includes(canonical(category));

  // Untagged: fall back to the legacy name heuristic.
  const fallback = NAME_FALLBACK[category];
  return fallback ? fallback(nameOf(product)) : false;
}

export function filterByCategory(products, category) {
  return (products || []).filter((p) => matchesCategory(p, category));
}
