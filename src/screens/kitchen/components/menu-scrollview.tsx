import { FC, useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { Text } from '@/components/reusables/ui/text';
import { useCartStore } from '@/lib/store/useCartStore';
import { cn } from '@/lib/utils';

interface MenuRowProps {
  id: string;
  price: number;
  title: string;
  description: string;
  mealPreference: string;
  updateMealCount: (id: string, by?: number) => void;
  getMealCount: (id: string) => number;
  isBookingDisabled: boolean;
  activeDay: string;
  mealTime: string;
}

const MenuRow: FC<MenuRowProps> = ({
  title,
  description,
  id,
  price,
  updateMealCount,
  getMealCount,
  mealPreference,
  isBookingDisabled,
  activeDay,
  mealTime,
}) => {
  const [count, setCount] = useState(0);
  const { getItemQuantity } = useCartStore();

  // Get cart quantity for this specific meal
  const cartQuantity = getItemQuantity(id, activeDay, mealTime);

  useEffect(() => {
    setCount(getMealCount(id));
  }, [getMealCount, id]);

  return (
    <View
      className={cn('rounded-xl', {
        'bg-blue-800/70 rounded-xl': cartQuantity > 0,
      })}
    >
      <View
        className={cn(
          'flex-row relative items-center border z-30 border-neutral-200 bg-white pl-4 pr-2.5 py-3 rounded-xl',
          {
            'border-blue-800/70': cartQuantity > 0,
          },
        )}
      >
        <View className="flex-1 gap-0.5">
          <View className="flex-row items-center gap-2">
            <View
              className={cn('p-0.5 border border-red-600', {
                'border-green-600': mealPreference.toLowerCase() === 'veg',
              })}
            >
              <View
                className={cn('h-1.5 w-1.5 bg-red-600 rounded-full', {
                  'bg-green-600': mealPreference.toLowerCase() === 'veg',
                })}
              />
            </View>
            <Text
              className="font-poppins flex-1 font-medium text-[15px]"
              numberOfLines={2}
            >
              {title}
            </Text>
          </View>
          <Text className="font-poppins text-[13px] mt-0.5 text-brand-text/60">
            {description}
          </Text>
          <View className="flex items-end justify-between w-full flex-row gap-3">
            <Text>₹ {price.toLocaleString()}</Text>
            <View className="flex-row gap-2 items-center bg-brand rounded-lg">
              {count !== 0 && (
                <>
                  <Pressable
                    className="px-2.5 py-1"
                    disabled={count === 0}
                    onPress={() => {
                      updateMealCount(id, -1);
                      setCount(getMealCount(id));
                    }}
                  >
                    <Text className="text-white font-semibold text-lg">-</Text>
                  </Pressable>
                  <Text className="text-white font-semibold text-base">
                    {count}
                  </Text>
                </>
              )}
              <Pressable
                className={cn('px-2.5 py-1 rounded-lg', {
                  'py-1.5': count === 0,
                  'bg-gray-400': isBookingDisabled,
                })}
                disabled={isBookingDisabled}
                onPress={() => {
                  updateMealCount(id);
                  setCount(getMealCount(id));
                }}
              >
                <Text
                  className={cn('text-white font-semibold text-lg', {
                    'text-base': count === 0,
                  })}
                >
                  {count === 0 ? 'Add' : '+'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
      {cartQuantity > 0 && (
        <View className="px-2 py-1 flex-row justify-between rounded-xl rounded-t-none">
          <Text className="text-white text-sm font-medium">
            This item is already in cart
          </Text>
          <Text className="text-white text-sm font-medium">
            {cartQuantity === 1 ? 'x1 item' : `x${cartQuantity} items`}
          </Text>
        </View>
      )}
    </View>
  );
};

interface IMenu {
  id: string;
  title: string;
  price: number;
  orderCount: number;
  mealPreference: string;
  description: string;
}

interface MenuScrollViewProps {
  meals: IMenu[];
  updateMealCount: (id: string, by?: number) => void;
  getMealCount: (id: string) => number;
  isBookingDisabled: boolean;
  activeDay: string;
  mealTime: string;
}

export const MenuScrollView: FC<MenuScrollViewProps> = props => {
  const {
    meals,
    updateMealCount,
    getMealCount,
    isBookingDisabled,
    activeDay,
    mealTime,
  } = props;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="flex-1 gap-1.5">
        {meals.map(m => {
          return (
            <MenuRow
              key={m.id}
              id={m.id}
              mealPreference={m.mealPreference}
              title={m.title}
              price={m.price}
              description={m.description}
              updateMealCount={updateMealCount}
              getMealCount={getMealCount}
              isBookingDisabled={isBookingDisabled}
              activeDay={activeDay}
              mealTime={mealTime}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};
