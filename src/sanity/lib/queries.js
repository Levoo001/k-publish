import { defineQuery } from "next-sanity";

export const productQuery =
  defineQuery(`*[_type == "product"] | order(_createdAt desc) {
  _id,
  name,
  price,
  description,
  image,
  _createdAt
}`);
