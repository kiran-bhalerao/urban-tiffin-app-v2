import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import {
  ChevronsRight,
  Clock,
  Edit3,
  Hand,
  MoveRight,
  Save,
} from 'lucide-react-native';
import { FC, useContext, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { Text } from '@/components/reusables/ui/text';
import { SafeScreen } from '@/components/template';
import { useCancelMealOrder } from '@/lib/apis/useCancelMealOrder';
import { useGetCalendar } from '@/lib/apis/useGetCalenndar';
import { useModifyMealOrder } from '@/lib/apis/useModifyMealOrder';
import {
  ScheduledOrders,
  useScheduledOrders,
} from '@/lib/apis/useScheduledOrders';
import { formateFullDate } from '@/lib/functions/formate_full_date';
import { useAppStore } from '@/lib/store/useAppStore';
import { cn } from '@/lib/utils';
import { MealBookingConfigManagerContext } from '@/providers/data-load';
import type {
  ApplicationStackParamList,
  ApplicationTabProps,
} from '@/types/navigation';

const styles = StyleSheet.create({
  dish: { width: 55, height: 55 },
});

interface MenuRowProps {
  type: string;
  food: string;
  kitchenName: string;
  tag: string;
  count: number;
  image?: string;
  mealPreference: string;
  isEditing?: boolean;
  onQuantityChange?: (newQuantity: number) => void;
  mealId?: string;
}

const MenuRow: FC<MenuRowProps> = props => {
  const {
    type,
    food,
    kitchenName,
    count,
    mealPreference,
    isEditing,
    onQuantityChange,
    mealId,
  } = props;
  const [localCount, setLocalCount] = useState(count);

  useEffect(() => {
    setLocalCount(count);
  }, [count]);

  const handleQuantityChange = (delta: number) => {
    const newCount = Math.max(0, localCount + delta);
    setLocalCount(newCount);
    onQuantityChange?.(newCount);
  };

  return (
    <View className="flex-row relative items-center border border-gray-200 bg-white px-4 py-3.5 rounded-xl">
      <View className="flex-1">
        <View className="flex-row items-center justify-between gap-2 flex-1">
          <View
            className={cn(
              'p-0.5 border border-red-600 flex justify-center items-center',
              {
                'border-green-600': mealPreference.toLowerCase() === 'veg',
              },
            )}
          >
            <View
              className={cn('h-1.5 w-1.5 bg-red-600 rounded-full', {
                'bg-green-600': mealPreference.toLowerCase() === 'veg',
              })}
            />
          </View>
          <Text
            className="font-poppins flex-1 text-[15px] text-brand-dark-gray font-medium"
            numberOfLines={2}
          >
            {isEditing ? localCount : count} x {food}
          </Text>
          {isEditing ? (
            <View className="flex-row gap-2 items-center bg-brand rounded-lg">
              <Pressable
                className="px-2.5 py-1"
                disabled={localCount === 0}
                onPress={() => handleQuantityChange(-1)}
              >
                <Text className="text-white font-semibold text-lg">-</Text>
              </Pressable>
              <Text className="text-white font-semibold text-base">
                {localCount}
              </Text>
              <Pressable
                className="px-2.5 py-1 rounded-lg"
                onPress={() => handleQuantityChange(1)}
              >
                <Text className="text-white font-semibold text-lg">+</Text>
              </Pressable>
            </View>
          ) : (
            <View className="bg-brand/10 rounded-lg px-1.5 py-1">
              <Text className="font-poppins font-semibold text-xs text-brand">
                {type}
              </Text>
            </View>
          )}
        </View>
        <Text className="text-brand-dark-gray font-medium" numberOfLines={1}>
          {kitchenName}
        </Text>
        {/* <Text className="font-poppins text-[13px] mt-0.5 text-brand-text/60">
          {tag}
        </Text> */}
      </View>
    </View>
  );
};

export function FoodTab({ navigation }: ApplicationTabProps<'Wallet'>) {
  const { navigate } =
    useNavigation<NavigationProp<ApplicationStackParamList>>();
  const { configManager } = useContext(MealBookingConfigManagerContext);

  const [selectedDay, setSelectedDay] = useState<{
    date: Date;
    formatted: string;
  }>();
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [modifiedQuantities, setModifiedQuantities] = useState<
    Record<string, number>
  >({});

  // Check if current selected day is in editing mode
  const isEditingMode = editingDate === selectedDay?.formatted;
  const { data } = useGetCalendar();

  const dates = useMemo(() => {
    return (
      data?.data.map(d => {
        const _date = new Date(d);
        return {
          _date,
          day: _date.toLocaleDateString('en-US', { weekday: 'short' }),
          date: _date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
          }),
          formatted: formateFullDate(d),
        };
      }) || []
    );
  }, [data?.data]);

  // Get detailed cancellation status for meals on the selected date
  const cancellationStatus = useMemo(() => {
    if (!selectedDay?.date) return null;

    // For now, we'll check breakfast as a general indicator
    // In a more sophisticated implementation, we could check specific meal types
    return configManager.getMealCancellationRestrictionStatus(
      selectedDay.date,
      'breakfast',
    );
  }, [selectedDay?.date, configManager]);

  // set initial date
  useEffect(() => {
    if (dates[0]) {
      setSelectedDay({ date: dates[0]._date, formatted: dates[0].formatted });
    }
  }, [dates]);

  const userId = useAppStore(s => s.user?._id);
  const { data: _orders } = useScheduledOrders(userId, {
    startDate: dates[0]?.formatted,
    endDate: dates[dates.length - 1]?.formatted,
  });

  const orders = useMemo(() => {
    return (
      _orders?.data.customerOrders.reduce((acc, n) => {
        const date = formateFullDate(n.date);
        // Add customerOrderId to each order and merge with existing orders for the same date
        const ordersWithCustomerOrderId = n.orders.map(order => ({
          ...order,
          customerOrderId: n._id,
        }));

        return {
          ...acc,
          [date]: acc[date]
            ? [...acc[date], ...ordersWithCustomerOrderId]
            : ordersWithCustomerOrderId,
        };
      }, {} as Record<string, (ScheduledOrders['orders'][0] & { customerOrderId: string })[] | undefined>) ||
      {}
    );
  }, [_orders?.data.customerOrders]);

  const queryClient = useQueryClient();
  const { mutate } = useCancelMealOrder({
    onError(error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error,
      });
    },
    onSuccess({ message }) {
      void queryClient.refetchQueries({ queryKey: ['scheduled-orders'] });
      void queryClient.refetchQueries({ queryKey: ['upcoming-meals'] });
      Toast.show({
        type: 'success',
        text1: 'Meal Canceled',
        text2: message,
      });
    },
  });

  const { mutate: modifyMeal } = useModifyMealOrder({
    onError(error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error,
      });
    },
    onSuccess({ message }) {
      void queryClient.refetchQueries({ queryKey: ['scheduled-orders'] });
      void queryClient.refetchQueries({ queryKey: ['upcoming-meals'] });
      setEditingDate(null);
      setModifiedQuantities({});
      Toast.show({
        type: 'success',
        text1: 'Meal Modified',
        text2: message,
      });
    },
  });

  const onCancelMeal = (customerOrderIds: string[]) =>
    Alert.alert(
      'Cancel Meal',
      'This will send a request to cancel your meal for a day, would you like to proceed?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            if (userId) {
              mutate({ orderBy: userId, orderIds: customerOrderIds });
            }
          },
        },
      ],
    );

  const handleQuantityChange = (mealId: string, newQuantity: number) => {
    setModifiedQuantities(prev => ({
      ...prev,
      [mealId]: newQuantity,
    }));
  };

  const onSaveModifications = () => {
    if (!userId || !selectedDay) return;

    const dayOrders = orders[selectedDay.formatted];
    if (!dayOrders?.length) return;

    // Find meals that have been modified
    const modifiedMeals = Object.entries(modifiedQuantities)
      .map(([mealId, newQuantity]) => {
        const originalOrder = dayOrders.find(order => order._id === mealId);
        if (!originalOrder || originalOrder.quantity === newQuantity)
          return null;

        return {
          mealId,
          count: newQuantity,
          customerOrderId: originalOrder.customerOrderId,
          kitchenId: originalOrder.kitchen._id,
        };
      })
      .filter((meal): meal is NonNullable<typeof meal> => meal !== null);

    if (modifiedMeals.length === 0) {
      setEditingDate(null);
      return;
    }

    // Convert to API format - flatten all meals into single array
    const update = modifiedMeals.map(meal => ({
      meal: meal.mealId,
      count: meal.count,
      customerOrderId: meal.customerOrderId,
    }));

    Alert.alert(
      'Save Changes',
      `This will modify ${modifiedMeals.length} meal${
        modifiedMeals.length > 1 ? 's' : ''
      }. Would you like to proceed?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Save',
          onPress: () => {
            modifyMeal({
              orderBy: userId,
              update,
            });
          },
        },
      ],
    );
  };

  const onStartEditing = () => {
    if (!selectedDay) return;

    setEditingDate(selectedDay.formatted);
    // Initialize modified quantities with current quantities
    const currentQuantities: Record<string, number> = {};
    orders[selectedDay.formatted]?.forEach(order => {
      currentQuantities[order._id] = order.quantity || 1;
    });
    setModifiedQuantities(currentQuantities);
  };

  return (
    <SafeScreen className="pb-0" edges={['top']}>
      <View className="flex-1">
        <View className="gap-1 pt-1.5 pb-3.5">
          <Text className="text-[22px] font-medium font-poppins">
            Your Food
          </Text>
        </View>
        <Text className="font-poppins text-[15px] text-brand-text/80 mb-2">
          This week&apos;s food
        </Text>
        <View className="mb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {dates?.map((d, i) => {
                return (
                  <Pressable
                    key={i}
                    onPress={() =>
                      setSelectedDay({ date: d._date, formatted: d.formatted })
                    }
                    className={cn(
                      'bg-white h-[60px] w-[72px] rounded-lg items-center px-0.5 py-3',
                      {
                        'bg-brand': d.formatted === selectedDay?.formatted,
                      },
                    )}
                  >
                    <Text
                      className={cn(
                        'text-[15px] text-brand-text font-poppins font-semibold',
                        {
                          'text-white': d.formatted === selectedDay?.formatted,
                        },
                      )}
                    >
                      {d.day}
                    </Text>
                    <Text
                      className={cn('font-poppins text-sm text-brand-text/60', {
                        'text-white': d.formatted === selectedDay?.formatted,
                      })}
                    >
                      {d.date}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {!!selectedDay && !!orders[selectedDay.formatted]?.length ? (
            <View className="flex-1 gap-1.5">
              {orders[selectedDay.formatted]?.map((order, i) => {
                return (
                  <MenuRow
                    key={`${order._id}${i}`}
                    type={order.mealTime}
                    food={order.name}
                    image={order.images?.[0]}
                    count={
                      isEditingMode
                        ? modifiedQuantities[order._id] || order.quantity || 1
                        : order.quantity || 1
                    }
                    mealPreference={order.mealPreference}
                    tag={order.mealItems
                      .reduce(
                        (acc, item) =>
                          `${acc}${acc ? ' +' : ''} ${item.name} ${
                            Number(item.units) > 1 ? `(${item.units})` : ''
                          }`,
                        '',
                      )
                      .trim()}
                    kitchenName={order.kitchen?.name || 'Kitchen name'}
                    isEditing={isEditingMode}
                    onQuantityChange={newQuantity =>
                      handleQuantityChange(order._id, newQuantity)
                    }
                    mealId={order._id}
                  />
                );
              })}
            </View>
          ) : (
            <>
              {/* <View className="flex-1">
              <Pressable
                onPress={() =>
                  navigate('Search', {
                    scheduleDate: selectedDay?.date.toString()
                  })
                }
                className="border flex flex-row justify-between items-center border-dashed border-brand rounded-lg p-6 mt-2"
              >
                <Text className="font-poppins text-lg text-brand-text/90 font-semibold">
                  Schedule food
                </Text>
                <MoveRight color="#FFA922" size={22} />
              </Pressable>
            </View> */}
            </>
          )}
        </ScrollView>
        {/* Show cancellation restriction message when cancellation is not allowed */}
        {!!selectedDay &&
        !!orders[selectedDay.formatted]?.length &&
        !cancellationStatus?.isAllowed ? (
          <View className="flex-row gap-2 mb-2 justify-between items-center bg-red-50 px-5 py-4 rounded-xl border border-red-200">
            <View className="flex-row gap-3 flex-1">
              <Hand color="#DC2626" size={22} />
              <View className="flex-1">
                <Text className="font-poppins text-red-600 font-medium mb-1">
                  Cancellation Not Available
                </Text>
                <Text className="font-poppins text-red-500 text-sm">
                  {cancellationStatus?.reason ||
                    'Cancellation window has passed for this meal'}
                </Text>
              </View>
            </View>
          </View>
        ) : null}
        {/* Show modify and cancel buttons when allowed */}
        {cancellationStatus?.isAllowed &&
        !!selectedDay &&
        !!orders[selectedDay.formatted]?.length ? (
          <View className="gap-2 mb-2">
            {/* Modify Order Button */}
            <Pressable
              onPress={isEditingMode ? onSaveModifications : onStartEditing}
              className="flex-row gap-2 justify-between items-center bg-white px-5 py-5 rounded-xl border border-brand/20"
            >
              <View className="flex-row gap-3">
                {isEditingMode ? (
                  <Save color="#FFA922" size={22} />
                ) : (
                  <Edit3 color="#FFA922" size={22} />
                )}
                <Text className="font-poppins text-brand font-medium">
                  {isEditingMode ? 'Save Changes' : 'Modify Order'}
                </Text>
              </View>
              <ChevronsRight color="#FFA922" size={22} />
            </Pressable>

            {/* Cancel Order Button */}
            {!isEditingMode && (
              <Pressable
                onPress={() => {
                  const dayOrders = orders[selectedDay.formatted];
                  if (dayOrders && dayOrders.length > 0) {
                    // Get unique customer order IDs for the selected day
                    const uniqueCustomerOrderIds = [
                      ...new Set(dayOrders.map(order => order.customerOrderId)),
                    ];
                    onCancelMeal(uniqueCustomerOrderIds);
                  }
                }}
                className="flex-row gap-2 justify-between items-center bg-white px-5 py-5 rounded-xl border border-brand-red/20"
              >
                <View className="flex-row gap-3">
                  <Hand color="#D12D2D" size={22} />
                  <Text className="font-poppins text-brand-red font-medium">
                    Request to cancel meal
                  </Text>
                </View>
                <ChevronsRight color="#D12D2D" size={22} />
              </Pressable>
            )}
          </View>
        ) : (
          !!userId &&
          !isEditingMode && (
            <Pressable
              onPress={() => navigate('OrderHistory')}
              className="flex-row gap-2 mb-2 justify-between items-center bg-white px-5 py-5 rounded-xl"
            >
              <View className="flex-row gap-3">
                <Clock color="#676767" size={22} />
                <Text className="font-poppins text-brand-dark-gray font-medium">
                  View Order History
                </Text>
              </View>
              <MoveRight color="#676767" size={22} />
            </Pressable>
          )
        )}

        {/* Cancel editing button */}
        {isEditingMode && (
          <Pressable
            onPress={() => {
              setEditingDate(null);
              setModifiedQuantities({});
            }}
            className="flex-row gap-2 mb-2 justify-center items-center bg-gray-100 px-5 py-4 rounded-xl"
          >
            <Text className="font-poppins text-gray-600 font-medium">
              Cancel Editing
            </Text>
          </Pressable>
        )}
      </View>
    </SafeScreen>
  );
}
