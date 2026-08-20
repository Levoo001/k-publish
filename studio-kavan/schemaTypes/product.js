// studio-kavan/schemaTypes/product.js
// This is the ONLY product schema. It defines every field editors see in
// Sanity Studio, and is what `npx sanity deploy` publishes.
import {defineField, defineType} from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description:
        'Controls the order products appear on the homepage. Lower number = appears first (1 is first, 2 is second, etc.).',
    }),
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'collection',
      title: 'Shop Collection',
      type: 'string',
      description: 'Which named collection does this product belong to? Shown on the Shop page.',
      options: {
        list: [
          {title: 'Joy', value: 'joy'},
          {title: 'Bloom', value: 'bloom'},
          {title: 'Rebirth', value: 'rebirth'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      description: 'Assign this product to one or more collections.',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Bestsellers', value: 'bestsellers'},
          {title: 'Dresses', value: 'dresses'},
          {title: 'Blouse', value: 'blouse'},
          {title: 'Co-ords', value: 'co-ords'},
          {title: 'Pants', value: 'pants'},
          {title: 'Jumpsuits', value: 'jumpsuits'},
        ],
      },
    }),
    defineField({
      name: 'image',
      type: 'array',
      of: [{type: 'image'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'markdown',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'colors',
      type: 'array',
      title: 'Available Colors',
      description: 'Select available colors for this product',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Red', value: 'red'},
          {title: 'Blue', value: 'blue'},
          {title: 'Green', value: 'green'},
          {title: 'Black', value: 'black'},
          {title: 'White', value: 'white'},
          {title: 'Pink', value: 'pink'},
          {title: 'Orange', value: 'orange'},
          {title: 'Fuchsia Pink', value: 'fuchsia pink'},
          {title: 'Skyblue', value: 'skyblue'},
          {title: 'Chocolate', value: 'chocolate'},
          {title: 'Ivory', value: 'ivory'},
          {title: 'Mint', value: 'mint'},
          {title: 'Burgundy', value: 'burgundy'},
          {title: 'Olive Green', value: 'olive green'},
          {title: 'Dusty Teal', value: 'dusty teal'},
          {title: 'Soft Lilac', value: 'soft lilac'},
          {title: 'Mustard', value: 'mustard'},
          {title: 'Cream', value: 'cream'},
          {title: 'Camel', value: 'camel'},
          {title: 'Butter Yellow', value: 'butter yellow'},
        ],
      },
    }),
    defineField({
      name: 'colorVariants',
      title: 'Color Variants (Images per Color)',
      description:
        'For each color, upload the specific images for that color. When a shopper clicks a color in the product modal, these images will be shown.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'color',
              title: 'Color',
              type: 'string',
              options: {
                list: [
                  {title: 'Red', value: 'red'},
                  {title: 'Blue', value: 'blue'},
                  {title: 'Green', value: 'green'},
                  {title: 'Black', value: 'black'},
                  {title: 'White', value: 'white'},
                  {title: 'Pink', value: 'pink'},
                  {title: 'Orange', value: 'orange'},
                  {title: 'Fuchsia Pink', value: 'fuchsia pink'},
                  {title: 'Skyblue', value: 'skyblue'},
                  {title: 'Chocolate', value: 'chocolate'},
                  {title: 'Ivory', value: 'ivory'},
                  {title: 'Mint', value: 'mint'},
                  {title: 'Burgundy', value: 'burgundy'},
                  {title: 'Olive Green', value: 'olive green'},
                  {title: 'Dusty Teal', value: 'dusty teal'},
                  {title: 'Soft Lilac', value: 'soft lilac'},
                  {title: 'Mustard', value: 'mustard'},
                  {title: 'Cream', value: 'cream'},
                  {title: 'Camel', value: 'camel'},
                  {title: 'Butter Yellow', value: 'butter yellow'},
                ],
              },
            }),
            defineField({
              name: 'images',
              title: 'Images for this color',
              type: 'array',
              of: [{type: 'image'}],
            }),
            defineField({
              name: 'stockNote',
              title: 'Stock Note',
              type: 'string',
              description:
                "Optional short note shown to shoppers when this color is selected, e.g. 'Only 3 left in Green'. Leave blank for normal stock levels.",
            }),
          ],
          preview: {
            select: {title: 'color', media: 'images.0'},
          },
        },
      ],
    }),
    defineField({
      name: 'allowMultipleColors',
      title: 'Allow Multiple Colors',
      type: 'boolean',
      initialValue: false,
      description:
        "Turn on for 'pick your top colour(s)' products (e.g. one skirt available with several top colours). Customers can select more than one colour instead of exactly one. Leave off for normal products — nothing changes for those.",
    }),
    defineField({
      name: 'extraColorPrice',
      title: 'Extra Price Per Additional Color',
      type: 'number',
      description:
        'Only used when Allow Multiple Colors is on. Extra amount added to the price for each additional colour selected beyond the first.',
    }),
    defineField({
      name: 'hasAddOn',
      title: 'Has Optional Add-on',
      type: 'boolean',
      initialValue: false,
      description:
        "Turn on when this product has an optional priced extra a customer can add at checkout (e.g. a jumpsuit with a detachable belt). Leave off for normal products — nothing changes for those.",
    }),
    defineField({
      name: 'addOnName',
      title: 'Add-on Name',
      type: 'string',
      description:
        'Only used when Has Optional Add-on is on. Shown to shoppers as a checkbox label, e.g. "Detachable Belt".',
    }),
    defineField({
      name: 'addOnPrice',
      title: 'Add-on Price',
      type: 'number',
      description:
        'Only used when Has Optional Add-on is on. Extra amount added to the price when the shopper checks the add-on box.',
    }),
  ],
})
