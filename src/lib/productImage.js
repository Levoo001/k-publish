// Joy-collection products get one background-removed "poster" image per
// color variant, duplicated at the front of `image` (image[0], image[1],
// ...) for the homepage Joy carousel. Everywhere else that shows a card's
// "second" image needs to skip past those posters to find the first real
// photo — otherwise a 2+ color Joy product shows an isolated cutout where
// a normal lifestyle shot is expected.
export function getPosterCount(product) {
  if (product?.collection !== "joy") return 1;
  const variantCount = (product?.colorVariants || []).filter(
    (v) => v.images?.length > 0,
  ).length;
  return Math.max(1, variantCount);
}

// An image entry is only usable if Sanity actually has an asset behind it.
// A slot added in Studio before its upload finishes has no `asset`, and
// urlFor() throws on those — which would take down a whole page of cards.
const isUsable = (img) => typeof img === "string" || !!img?.asset;

// The "second" display image for a product card: the first usable image
// after the poster(s), falling back to the first usable image overall.
export function getCardImage(product) {
  const images = (product?.image || []).filter(isUsable);
  const posterCount = getPosterCount(product);
  return images[posterCount] || images[0];
}
