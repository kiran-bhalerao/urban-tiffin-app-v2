import {
  ArrowLeft,
  Check,
  CheckCheck,
  Info,
  ShoppingCart,
} from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import Meal from '@/assets/images/meal.png';
import { Button } from '@/components/reusables/ui/button';
import { Text } from '@/components/reusables/ui/text';
import { SafeScreen } from '@/components/template';
import { isDatePassed } from '@/lib/functions/date_passed';
import { useAppStore } from '@/lib/store/useAppStore';
import { cn } from '@/lib/utils';
import { MenuScrollView } from '@/screens/kitchen/components/menu-scrollview';
import { useCartIntegration } from '@/screens/kitchen/useCartIntegration';
import { useMealBookingManager } from '@/screens/kitchen/useMealBookingManager';
import { useMeals } from '@/screens/kitchen/useMeals';
import type { ApplicationScreenProps } from '@/types/navigation';

const styles = StyleSheet.create({
  img: { width: 55, height: 55 },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  week: {
    // height: 74
  },
});

export function KitchenScreen({
  navigation,
  route,
}: ApplicationScreenProps<'Kitchen'>) {
  const { id, name, kitchenManager, scheduleDate } = route.params;

  const [tab, setTab] = useState<'lunch' | 'dinner'>('lunch');
  const [activeDay, setActiveDay] = useState<string>();
  const [initialActiveDayIndex, setInitialActiveDayIndex] = useState(0);

  const scrollViewRef = useRef<ScrollView>(null);
  const accessToken = useAppStore(s => s.accessToken);

  const {
    _meals,
    selectedDays,
    dates,
    isFetched,
    getMealCount,
    mealScheduleIdForActiveDay,
    updateMealCount,
    savedMeals,
  } = useMeals(id, activeDay, tab);

  const {
    totalCartItems,
    selectedMealsCount,
    hasSelectedMeals,
    addMealsToCart,
    goToCart,
  } = useCartIntegration({
    kitchenId: id,
    mealScheduleId: mealScheduleIdForActiveDay,
    kitchenName: name,
    savedMeals,
  });

  const { isTomorrow, isBookingDisabled, restrictionMessage } =
    useMealBookingManager({
      activeDay,
      tab,
    });

  const setInitialActiveDay = useCallback(() => {
    const indexDate = dates.findIndex(d => isDatePassed(new Date(d), true));
    if (indexDate !== -1) {
      setActiveDay(dates[indexDate]);
      setInitialActiveDayIndex(indexDate);
    }
  }, [dates]);

  // useEffect(() => {
  //   if (scheduleDate) {
  //     const indexDate = dates
  //       .map(d => new Date(d).toString())
  //       .indexOf(new Date(scheduleDate).toString())

  //     if (indexDate !== -1) {
  //       setActiveDay(dates[indexDate])
  //       setInitialActiveDayIndex(indexDate)
  //     } else {
  //       setInitialActiveDay()
  //     }
  //   } else if (dates[0]) {
  //     setInitialActiveDay()
  //   }
  // }, [dates, scheduleDate, setInitialActiveDay])

  useEffect(() => {
    if (dates[0]) {
      setInitialActiveDay();
    }
  }, [dates, setInitialActiveDay]);

  useEffect(() => {
    if (activeDay) {
      setTab('lunch');
    }
  }, [activeDay]);

  useEffect(() => {
    if (initialActiveDayIndex) {
      scrollViewRef.current?.scrollTo({
        x: 84 * initialActiveDayIndex,
        animated: true,
      });
    }
  }, [initialActiveDayIndex]);

  return (
    <SafeScreen className="px-0 pt-0 pb-4">
      <View className="flex-1 gap-2 px-4 py-4">
        <View className="flex-row items-start gap-3">
          <Button
            className="!px-0"
            variant="ghost"
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft color="#000" />
          </Button>
          <View className="flex-1 flex-row items-start justify-between">
            <Text
              className="flex-1 text-[20px] font-medium font-poppins"
              numberOfLines={2}
              ellipsizeMode="tail"
              lineBreakMode="tail"
            >
              {name}
            </Text>
          </View>
          <Button
            className="!px-0 relative mx-2"
            variant="ghost"
            onPress={goToCart}
          >
            <ShoppingCart color="#000" size={20} />
            {totalCartItems > 0 && (
              <View className="absolute -top-1 left-4 bg-red-500 rounded-full max-w-[36px] w-fit min-w-[18px] h-[18px] items-center justify-center">
                <Text
                  className="text-white font-semibold"
                  style={{ fontSize: 12, lineHeight: 19 }}
                >
                  {totalCartItems > 99 ? '99+' : totalCartItems}
                </Text>
              </View>
            )}
          </Button>
          <Button
            className="!px-0"
            variant="ghost"
            onPress={() =>
              navigation.navigate('KitchenDetails', {
                id,
                name,
                kitchenManager,
              })
            }
          >
            <Info color="#000" size={20} />
          </Button>
        </View>
        <Text className="font-poppins text-[15px] text-brand-text/80">
          This week&apos;s menu
        </Text>
        <View>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.week}
          >
            <View className="flex-row gap-2">
              {dates?.map((d, i) => {
                const isActive = activeDay === d;
                const meals = selectedDays[d];
                const hasBothMeal = meals?.dinner && meals?.lunch;
                const disabled = !isDatePassed(new Date(d), true);

                return (
                  <Pressable
                    key={i}
                    disabled={disabled}
                    onPress={() => setActiveDay(d)}
                    className={cn(
                      'bg-white rounded-lg px-2.5 w-24 flex-1 items-center py-1.5',
                      {
                        'bg-brand': isActive,
                        'opacity-60': disabled,
                      },
                    )}
                  >
                    <Text
                      className={cn(
                        'text-[15px] text-brand-text font-semibold font-poppins',
                        {
                          'text-white': isActive,
                        },
                      )}
                      numberOfLines={1}
                    >
                      {new Date(d).toLocaleDateString('en-US', {
                        weekday: 'short',
                      })}
                    </Text>
                    <Text
                      className={cn('text-sm text-brand-text font-poppins', {
                        'text-white': isActive,
                      })}
                      numberOfLines={1}
                    >
                      {new Date(d).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </Text>
                    {Object.keys(selectedDays).includes(d) && (
                      <View
                        className={cn(
                          'bg-brand-violet mt-2 h-5 w-5 justify-center items-center rounded-full',
                          {
                            'bg-white': isActive,
                          },
                        )}
                      >
                        {hasBothMeal ? (
                          <CheckCheck
                            size={13}
                            color={isActive ? '#9F56FD' : '#fff'}
                          />
                        ) : (
                          <Check
                            size={13}
                            color={isActive ? '#9F56FD' : '#fff'}
                          />
                        )}
                      </View>
                    )}
                    {!Object.keys(selectedDays).includes(d) && (
                      <View
                        className={cn(
                          'border-brand-violet border-dashed border mt-2 h-[16px] w-[16px] mb-1 justify-center items-center rounded-full',
                          {
                            'border-white': isActive,
                          },
                        )}
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>
        <View className="flex-1 mt-1.5">
          <View className="bg-white mb-2 rounded-full flex-row">
            <Pressable
              onPress={() => setTab('lunch')}
              className={cn('flex-1 py-3.5 border border-white rounded-full', {
                'bg-brand/20 border-brand': tab === 'lunch',
              })}
            >
              <Text className="text-center font-poppins">Lunch</Text>
            </Pressable>
            <Pressable
              onPress={() => setTab('dinner')}
              className={cn('flex-1 border border-white py-3.5 rounded-full', {
                'bg-brand/20 border-brand': tab === 'dinner',
              })}
            >
              <Text className="text-center font-poppins">Dinner</Text>
            </Pressable>
          </View>

          {/* Meal Booking Restriction Message */}
          {isBookingDisabled && restrictionMessage && (
            <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
              <Text className="text-red-800 text-sm font-medium text-center">
                {restrictionMessage}
              </Text>
            </View>
          )}
          {isTomorrow && !isBookingDisabled && (
            <View className="bg-brand-violet/10 border border-violet-200 rounded-lg p-3 mb-3">
              <Text className="text-center text-sm text-brand-violet">
                To enjoy your meal tomorrow, just book it before 5 PM today!
              </Text>
            </View>
          )}
          {isFetched && !_meals.length ? (
            <View className="flex-1 justify-center items-center">
              <Image style={styles.img} source={Meal} />
              <Text className="font-poppins">No {tab} found</Text>
            </View>
          ) : (
            <MenuScrollView
              meals={_meals}
              getMealCount={getMealCount}
              updateMealCount={updateMealCount}
              isBookingDisabled={isBookingDisabled}
              activeDay={activeDay || ''}
              mealTime={tab}
            />
          )}
        </View>
        <View className="flex-row gap-2">
          <Button className="flex-1 bg-gray-100 rounded-xl" onPress={goToCart}>
            <Text className="font-poppins text-gray-700">
              View Cart ({totalCartItems})
            </Text>
          </Button>
          <Button
            className={cn('flex-1 bg-brand rounded-xl', {
              'bg-gray-400': !hasSelectedMeals || isBookingDisabled,
            })}
            disabled={!!accessToken && (!hasSelectedMeals || isBookingDisabled)}
            onPress={() => {
              if (accessToken) {
                if (!isBookingDisabled) {
                  addMealsToCart();
                }
              } else {
                navigation.navigate('Login');
              }
            }}
          >
            <Text className="font-poppins text-white">
              {accessToken
                ? isBookingDisabled
                  ? 'Booking Closed'
                  : hasSelectedMeals
                  ? `Add to Cart (${selectedMealsCount})`
                  : 'Select Meals'
                : 'Login to Add Meals'}
            </Text>
          </Button>
        </View>
      </View>
    </SafeScreen>
  );
}
