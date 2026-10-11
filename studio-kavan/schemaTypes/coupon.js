// studio-kavan/schemaTypes/coupon.js
// Discount codes applied at checkout. Editable here so the store owner can
// add, change, or disable codes without a code deploy.
import {defineField, defineType} from 'sanity'

export const coupon = defineType({
  name: 'coupon',
  title: 'Coupon',
  type: 'document',
  fields: [
    defineField({
      name: 'code',
      title: 'Code',
      type: 'string',
      description: 'What customers type at checkout, e.g. WELCOME10. Not case-sensitive.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Turn off to disable this code immediately without deleting it.',
      initialValue: true,
    }),
    defineField({
      name: 'discountType',
      title: 'Discount Type',
      type: 'string',
      options: {
        list: [
          {title: 'Percentage off', value: 'percentage'},
          {title: 'Fixed amount off', value: 'fixed'},
        ],
        layout: 'radio',
      },
      initialValue: 'percentage',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'discountValue',
      title: 'Discount Value',
      type: 'number',
      description:
        'For percentage: a number like 10 means 10% off. For fixed amount: the naira amount taken off the subtotal.',
      validation: (rule) =>
        rule
          .required()
          .positive()
          .custom((value, context) => {
            if (context.document?.discountType === 'percentage' && value > 100) {
              return 'A percentage discount cannot exceed 100'
            }
            return true
          }),
    }),
    defineField({
      name: 'minOrderAmount',
      title: 'Minimum Order Amount',
      type: 'number',
      description: 'Optional. Cart subtotal (in naira) must reach this before the code works.',
    }),
    defineField({
      name: 'expiresAt',
      title: 'Expires At',
      type: 'datetime',
      description: 'Optional. The code stops working after this date/time. Leave empty if it should never expire.',
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
      code: 'code',
      type: 'discountType',
      value: 'discountValue',
      active: 'isActive',
    },
    prepare({code, type, value, active}) {
      const amount = type === 'percentage' ? `${value}% off` : `₦${value} off`
      return {
        title: code || 'Untitled code',
        subtitle: `${amount}${active ? '' : ' · Inactive'}`,
      }
    },
  },
})
