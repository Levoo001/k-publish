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
  ],
});
