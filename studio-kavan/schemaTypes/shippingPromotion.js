// studio-kavan/schemaTypes/shippingPromotion.js
// Makes every delivery option within Nigeria free until the end date.
import {defineField, defineType} from 'sanity'

export const shippingPromotion = defineType({
  name: 'shippingPromotion',
  title: 'Free Local Shipping',
  type: 'document',
  fields: [
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Turn off to end the promotion early.',
      initialValue: true,
    }),
    defineField({
      name: 'endsAt',
      title: 'Ends At',
      type: 'datetime',
      description: 'Free local shipping stops automatically after this date/time.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      description: 'Not shown to customers. For your own reference.',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      active: 'isActive',
      endsAt: 'endsAt',
    },
    prepare({active, endsAt}) {
      const until = endsAt ? new Date(endsAt).toLocaleString() : 'no end date'
      const expired = endsAt && new Date(endsAt).getTime() < Date.now()
      return {
        title: 'Free local shipping',
        subtitle: `Until ${until}${!active ? ' · Inactive' : expired ? ' · Ended' : ''}`,
      }
    },
  },
})
