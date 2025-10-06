import * as React from 'react'
import { TextInput } from 'react-native'

import { cn } from '@/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'

const inputVariants = cva(
  'native:h-12 rounded-md border border-input focus:border-brand bg-background px-3 text-brand-text native:text-lg native:leading-[1.5]',
  {
    variants: {
      size: {
        default: 'native:h-12 native:px-5 native:py-3',
        lg: 'rounded-md px-4 rounded-xl native:h-[56px]'
      }
    },
    defaultVariants: {
      size: 'default'
    }
  }
)

const Input = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  React.ComponentPropsWithoutRef<typeof TextInput> &
    VariantProps<typeof inputVariants>
>(({ className, size, placeholderClassName, ...props }, ref) => {
  return (
    <TextInput
      returnKeyType="done"
      ref={ref}
      className={cn(
        props.editable === false && 'opacity-50',
        inputVariants({ size, className })
      )}
      placeholderTextColor="#2B2B2B"
      {...props}
    />
  )
})

Input.displayName = 'Input'

export { Input }
