// src/sanity/schemaTypes/product.js
import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
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
        ]
      }
    }),
  ],
});