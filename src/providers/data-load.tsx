import messaging from '@react-native-firebase/messaging';
import { useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  FC,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { Image } from 'react-native';
import Toast from 'react-native-toast-message';

import { useSaveFcmToken } from '@/lib/apis/useSaveFcmToken';
import { fetchUpcomingMeals } from '@/lib/apis/useUpcomingMeals';
import { useAppStore } from '@/lib/store/useAppStore';

import {
  defaultMealBookingConfig,
  defaultMealCancellationConfig,
  MealBookingConfigManager,
} from '@/lib/MealBookingConfigManager';

export const MealBookingConfigManagerContext = createContext({
  configManager: new MealBookingConfigManager(
    {
      today: [],
      tomorrow: [],
    },
    {
      today: -7,
      tomorrow: 11,
    },
  ),
});

export const DataLoad: FC<PropsWithChildren & { loading: ReactNode }> = ({
  children,
  loading,
}) => {
  const [isLoading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const userId = useAppStore.getState().user?._id;
    if (userId) {
      // fetch and set upcoming meal data
      setLoading(true);
      fetchUpcomingMeals(userId)
        .then(async data => {
          queryClient.setQueryData(['upcoming-meals', userId], data);

          const upcomingMeal = data?.data.upcomingOrders[0];
          const upcomingImage =
            upcomingMeal?.meals[0]?.image ||
            'https://urban-tiffin.s3.ap-south-1.amazonaws.com/kitchen1.png';

          await Image.prefetch(upcomingImage);
        })
        .finally(() => setLoading(false));
    }
  }, [queryClient]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(msg => {
      Toast.show({
        text1: msg.notification?.title,
        text2: msg.notification?.body,
      });
    });

    return unsubscribe;
  }, []);

  const { mutate } = useSaveFcmToken();
  useEffect(() => {
    try {
      // const userId = '';
      const userId = useAppStore.getState().user?._id;
      if (userId) {
        void messaging()
          .getToken()
          .then(token => {
            console.log('==== token', token);
            mutate({ firebaseToken: token, customerId: userId });
          })
          .catch(err => console.log(err));
      }
    } catch {
      // Ignore
    }
  }, [mutate]);

  if (isLoading) {
    return <>{loading}</>;
  }

  return (
    <MealBookingConfigManagerContext.Provider
      value={{
        configManager: new MealBookingConfigManager(
          defaultMealBookingConfig,
          defaultMealCancellationConfig,
        ),
      }}
    >
      {children}
    </MealBookingConfigManagerContext.Provider>
  );
};
