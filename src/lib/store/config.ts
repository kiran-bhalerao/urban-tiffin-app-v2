import { createJSONStorage } from 'zustand/middleware'

import MMKVStorage from '@/lib/MMKV'

export const persistConfig = {
  name: 'app-storage',
  storage: createJSONStorage(() => MMKVStorage)
}
