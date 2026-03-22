// src/sanity/schemaTypes/product.js
import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      description:
        "Controls the order products appear on the homepage. Lower number = appears first (1 is first, 2 is second, etc.).",
    }),
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "name",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      type: "array",
      of: [{ type: "image" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      type: "number",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "markdown",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "colors",
      type: "array",
      title: "Available Colors",
      description: "Select available colors for this product",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Red", value: "red" },
          { title: "Blue", value: "blue" },
          { title: "Green", value: "green" },
          { title: "Black", value: "black" },
          { title: "White", value: "white" },
          { title: "Yellow", value: "yellow" },
          { title: "Pink", value: "pink" },
          { title: "Purple", value: "purple" },
          { title: "Orange", value: "orange" },
          { title: "Gray", value: "gray" },
          { title: "Brown", value: "brown" },
          { title: "Beige", value: "beige" },
          { title: "Navy", value: "navy" },
          { title: "Maroon", value: "maroon" },
          { title: "Teal", value: "teal" },
          { title: "Fuchsia Pink", value: "fuchsia pink" },
          { title: "Skyblue", value: "skyblue" },
          { title: "Chocolate", value: "chocolate" },
          { title: "Ivory", value: "ivory" },
          { title: "Mint", value: "mint" },
          { title: "Burgundy", value: "burgundy" },
        ],
      },
    }),
    defineField({
      name: "colorVariants",
      title: "Color Variants (Images per Color)",
      description:
        "For each color, upload the specific images for that color. When a shopper clicks a color in the product modal, these images will be shown.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "color",
              title: "Color",
              type: "string",
              options: {
                list: [
                  { title: "Red", value: "red" },
                  { title: "Blue", value: "blue" },
                  { title: "Green", value: "green" },
                  { title: "Black", value: "black" },
                  { title: "White", value: "white" },
                  { title: "Yellow", value: "yellow" },
                  { title: "Pink", value: "pink" },
                  { title: "Purple", value: "purple" },
                  { title: "Orange", value: "orange" },
                  { title: "Gray", value: "gray" },
                  { title: "Brown", value: "brown" },
                  { title: "Beige", value: "beige" },
                  { title: "Navy", value: "navy" },
                  { title: "Maroon", value: "maroon" },
                  { title: "Teal", value: "teal" },
                  { title: "Fuchsia Pink", value: "fuchsia pink" },
                  { title: "Skyblue", value: "skyblue" },
                  { title: "Chocolate", value: "chocolate" },
                  { title: "Ivory", value: "ivory" },
                  { title: "Mint", value: "mint" },
                  { title: "Burgundy", value: "burgundy" },
                ],
              },
            }),
            defineField({
              name: "images",
              title: "Images for this color",
              type: "array",
              of: [{ type: "image" }],
            }),
          ],
          preview: {
            select: { title: "color", media: "images.0" },
          },
        },
      ],
    }),
  ],
});
