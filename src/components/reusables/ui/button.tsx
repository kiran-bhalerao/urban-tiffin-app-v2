import * as React from 'react'
import { ActivityIndicator, Pressable, View } from 'react-native'
import { cva, type VariantProps } from 'class-variance-authority'

import { TextClassContext } from '@/components/reusables/ui/text'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'group flex items-center justify-center rounded-md web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary web:hover:opacity-90 active:opacity-90',
        destructive: 'bg-destructive web:hover:opacity-90 active:opacity-90',
        outline:
          'border border-input bg-background web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent',
        secondary: 'bg-secondary web:hover:opacity-80 active:opacity-80',
        ghost:
          'web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent',
        link: 'web:underline-offset-4 web:hover:underline web:focus:underline '
      },
      size: {
        default: 'native:h-14 native:px-5 native:py-3',
        sm: 'native:h-12 rounded-md px-3',
        lg: 'rounded-md px-8 native:h-[54px]',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

const buttonTextVariants = cva(
  'web:whitespace-nowrap text-sm native:text-base font-medium text-foreground web:transition-colors',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        destructive: 'text-destructive-foreground',
        outline: '',
        secondary:
          'text-secondary-foreground group-active:text-secondary-foreground',
        ghost: 'group-active:text-accent-foreground',
        link: 'text-primary group-active:underline'
      },
      size: {
        default: '',
        sm: '',
        lg: 'native:text-lg',
        icon: ''
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof buttonVariants> & { isLoading?: boolean }

const Button = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>(
  (
    {
      className,
      variant,
      size,
      children,
      isLoading,
      disabled = isLoading,
      ...props
    },
    ref
  ) => {
    return (
      <TextClassContext.Provider
        value={cn(buttonTextVariants({ variant, size }))}
      >
        <Pressable
          className={cn(
            disabled && 'opacity-60',
            buttonVariants({ variant, size, className })
          )}
          ref={ref}
          disabled={disabled}
          role="button"
          {...props}
        >
          <View className="gap-2 flex-row">
            <>{children}</>
            {isLoading && <ActivityIndicator size="small" color="#fff" />}
          </View>
        </Pressable>
      </TextClassContext.Provider>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonTextVariants, buttonVariants }
export type { ButtonProps }
