import { defineQuery } from "next-sanity";

const PRODUCT_FIELDS = `
  _id,
  name,
  slug,
  price,
  comparePrice,
  description,
  image,
  colors,
  sizes,
  categories,
  collection,
  inStock,
  displayOrder,
  allowMultipleColors,
  extraColorPrice,
  hasAddOn,
  addOnName,
  addOnPrice,
  colorVariants[] {
    color,
    images,
    stockNote
  }
`;

export const productQuery = defineQuery(
  `*[_type == "product"] | order(displayOrder asc, _createdAt desc) { ${PRODUCT_FIELDS} }`,
);

export const productBySlugQuery = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] { ${PRODUCT_FIELDS} }
`);

export const productByNameQuery = defineQuery(`
  *[_type == "product" && lower(name) == lower($name)][0] { ${PRODUCT_FIELDS} }
`);

export const allProductSlugsQuery = defineQuery(
  `*[_type == "product" && defined(slug.current)]{ "slug": slug.current, name }`,
);

export const collectionQuery = defineQuery(`
  *[_type == "product" && $category in categories[]] | order(displayOrder asc, _createdAt desc) { ${PRODUCT_FIELDS} }
`);

export const searchQuery = defineQuery(`
  *[_type == "product" && (
    name match $q ||
    description match $q
  )] | order(displayOrder asc) { _id, name, slug, price, image }
`);
