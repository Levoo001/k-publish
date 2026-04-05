// src/sanity/lib/queries.js
import { defineQuery } from "next-sanity";

export const productQuery =
  defineQuery(`*[_type == "product"] | order(displayOrder asc, _createdAt desc) {
  _id,
  name,
  price,
  description,
  image,
  colors,
  displayOrder,
  colorVariants[] {
    color,
    images
  },
  createdAt
}`);

export const productByNameQuery = defineQuery(`
  *[_type == "product" && lower(name) == lower($name)][0] {
    _id,
    name,
    price,
    description,
    image,
    colors,
    displayOrder,
    colorVariants[] {
      color,
      images
    },
    createdAt
  }
`);
