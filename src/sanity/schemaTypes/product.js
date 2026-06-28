import { defineField, defineType } from "sanity";

const COLOR_OPTIONS = [
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
];

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
        "Controls the order products appear. Lower number = appears first.",
    }),
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "collection",
      title: "Shop Collection",
      type: "string",
      description: "Which named collection does this product belong to? Shown on the Shop page.",
      options: {
        list: [
          { title: "Bloom", value: "bloom" },
          { title: "Rebirth", value: "rebirth" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      description: "Assign this product to one or more collections.",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Bestsellers", value: "bestsellers" },
          { title: "Dresses", value: "dresses" },
          { title: "Blouse", value: "blouse" },
          { title: "Co-ords", value: "co-ords" },
          { title: "Sets", value: "sets" },
          { title: "Skirts", value: "skirts" },
          { title: "New Arrivals", value: "new-arrivals" },
          { title: "Sale", value: "sale" },
        ],
      },
    }),
    defineField({
      name: "image",
      title: "Product Images",
      type: "array",
      of: [{ type: "image" }],
      validation: (rule) => rule.required().min(1),
      description: "First image is used as the thumbnail/cover.",
    }),
    defineField({
      name: "price",
      type: "number",
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: "comparePrice",
      title: "Compare At Price",
      type: "number",
      description: "Original price before discount. Leave blank if no sale.",
    }),
    defineField({
      name: "description",
      type: "markdown",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sizes",
      title: "Available Sizes",
      type: "array",
      description: "Select which sizes are available for this product.",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "6", value: "6" },
          { title: "8", value: "8" },
          { title: "10", value: "10" },
          { title: "12", value: "12" },
          { title: "14", value: "14" },
          { title: "16", value: "16" },
          { title: "18", value: "18" },
          { title: "20", value: "20" },
          { title: "22", value: "22" },
          { title: "XS", value: "XS" },
          { title: "S", value: "S" },
          { title: "M", value: "M" },
          { title: "L", value: "L" },
          { title: "XL", value: "XL" },
          { title: "2XL", value: "2XL" },
          { title: "3XL", value: "3XL" },
          { title: "One Size", value: "One Size" },
        ],
      },
    }),
    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "colors",
      title: "Available Colors",
      type: "array",
      of: [{ type: "string" }],
      options: { list: COLOR_OPTIONS },
    }),
    defineField({
      name: "colorVariants",
      title: "Color Variants (Images per Color)",
      description:
        "Upload specific images per color. Shown when a shopper selects that color.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "color",
              title: "Color",
              type: "string",
              options: { list: COLOR_OPTIONS },
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
  preview: {
    select: {
      title: "name",
      media: "image.0",
      price: "price",
    },
    prepare({ title, media, price }) {
      return {
        title,
        media,
        subtitle: price ? `₦${price.toLocaleString()}` : "No price set",
      };
    },
  },
});
