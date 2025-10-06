import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import MMKVStorage from '@/lib/MMKV'

export interface CartItem {
  id: string
  mealId: string
  kitchenId: string
  mealScheduleId: string
  kitchenName: string
  meal: {
    title: string
    price: number
    description: string
    mealTime: string
    mealPreference: string
  }
  date: string
  quantity: number
  addedAt: Date
}

interface CartStore {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, 'id' | 'addedAt'>) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  clearKitchenItems: (kitchenId: string) => void
  getCartTotal: () => number
  getCartItemCount: () => number
  getItemsByKitchen: (kitchenId: string) => CartItem[]
  getItemsByDate: (date: string) => CartItem[]
  hasItemsForKitchen: (kitchenId: string) => boolean
  getItemQuantity: (mealId: string, date: string, mealTime: string) => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: item => {
        const existingItemIndex = get().items.findIndex(
          cartItem =>
            cartItem.mealId === item.mealId &&
            cartItem.date === item.date &&
            cartItem.meal.mealTime === item.meal.mealTime
        )

        if (existingItemIndex >= 0) {
          // Update existing item quantity
          set(state => ({
            items: state.items.map((cartItem, index) =>
              index === existingItemIndex
                ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                : cartItem
            )
          }))
        } else {
          // Add new item
          const newItem: CartItem = {
            ...item,
            id: `${item.mealId}_${item.date}_${
              item.meal.mealTime
            }_${Date.now()}`,
            addedAt: new Date()
          }
          set(state => ({
            items: [...state.items, newItem]
          }))
        }
      },

      removeFromCart: itemId => {
        set(state => ({
          items: state.items.filter(item => item.id !== itemId)
        }))
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(itemId)
          return
        }

        set(state => ({
          items: state.items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          )
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      clearKitchenItems: kitchenId => {
        set(state => ({
          items: state.items.filter(item => item.kitchenId !== kitchenId)
        }))
      },

      getCartTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.meal.price * item.quantity,
          0
        )
      },

      getCartItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },

      getItemsByKitchen: kitchenId => {
        return get().items.filter(item => item.kitchenId === kitchenId)
      },

      getItemsByDate: date => {
        return get().items.filter(item => item.date === date)
      },

      hasItemsForKitchen: kitchenId => {
        return get().items.some(item => item.kitchenId === kitchenId)
      },

      getItemQuantity: (mealId, date, mealTime) => {
        const item = get().items.find(
          cartItem =>
            cartItem.mealId === mealId &&
            cartItem.date === date &&
            cartItem.meal.mealTime === mealTime
        )
        return item?.quantity || 0
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => MMKVStorage)
    }
  )
)
