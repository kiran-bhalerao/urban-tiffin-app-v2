import { ArrowLeft, LocateFixed, Search } from 'lucide-react-native';
import { FC, useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import GetLocation from 'react-native-get-location';
import { useDebounceCallback } from 'usehooks-ts';

import Meal from '@/assets/images/meal.png';
import { Button } from '@/components/reusables/ui/button';
import { Input } from '@/components/reusables/ui/input';
import { Text } from '@/components/reusables/ui/text';
import { SafeScreen } from '@/components/template';
import { SearchAddress, useSearchAddress } from '@/lib/apis/useSearchAddress';
import { cn } from '@/lib/utils';
import type { ApplicationScreenProps } from '@/types/navigation';

const styles = StyleSheet.create({
  img: { width: 85, height: 85 },
});

const AddressCard: FC<
  { active?: boolean; onPress: () => void } & SearchAddress
> = props => {
  const { active = false, onPress, description } = props;

  return (
    <Pressable
      onPress={onPress}
      className={cn('bg-white rounded-xl px-5 pt-3 pb-4 border border-white', {
        'border-brand': active,
      })}
    >
      <View className="flex flex-row my-2 items-center justify-between">
        <Text className="font-poppins text-lg font-semibold text-brand-text/90">
          Address
        </Text>
      </View>
      <Text className="font-poppins text-brand-text">{description}</Text>
    </Pressable>
  );
};

export function YourLocationScreen({
  navigation,
  route,
}: ApplicationScreenProps<'YourLocation'>) {
  const [location, setLocation] = useState<{ lat: number; lng: number }>();
  const getLocation = useCallback(() => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        setLocation({ lat: location.latitude, lng: location.longitude });
      })
      .catch((error: { code: string; message: string }) => {
        const { code } = error;
        Alert.alert(
          code,
          'We need your location to provide nearby address suggestions. Please enable location access in your settings.',
          [
            {
              text: 'OPEN',
              onPress: () => Linking.openSettings(),
            },
          ],
        );
      });
  }, []);

  // get users current location on screen load
  useEffect(() => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        setLocation({ lat: location.latitude, lng: location.longitude });
      })
      .catch(() => undefined);
  }, []);

  const { mutate, data } = useSearchAddress();
  const debounced = useDebounceCallback((address: string) => {
    mutate({ address, location });
  }, 500);

  return (
    <SafeScreen>
      <View className="flex-1 gap-2 pb-8">
        <View className="flex-row items-center gap-3">
          <Button
            className="!px-0"
            variant="ghost"
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft color="#000" />
          </Button>
          <Text className="flex-1 text-center mr-8 text-2xl font-poppins">
            Save Address
          </Text>
        </View>
        <View className="bg-white rounded-xl flex-row items-center pl-4 border border-brand-light-gray/30">
          <Search size={20} color="#FFA922" />
          <Input
            editable={!!location}
            onChangeText={text => debounced(text)}
            placeholder="Search for area, street name..."
            className="font-poppins border-0 native:h-[48px] text-brand-text flex-1 rounded-xl"
          />
        </View>
        <View className="bg-brand-violet/20 rounded-md py-1.5 px-2">
          <Text className="text-center text-sm text-brand-violet">
            Addresses near you
          </Text>
        </View>
        {!location ? (
          <View className="py-2 items-center flex-1 w-full">
            <View className="grow items-center justify-center">
              <Image style={styles.img} source={Meal} />
              <Text className="font-poppins mt-2 text-center px-6">
                Tap the Request Location button below. Enable location access in
                your settings, then tap the button again to proceed.
              </Text>
            </View>
            <Button
              className="bg-brand rounded-xl mt-3 w-full"
              onPress={getLocation}
            >
              <View className="justify-center flex-row items-center gap-1.5">
                <LocateFixed size={18} color="#fff" />
                <Text className="font-poppins font-semibold">
                  REQUEST LOCATION
                </Text>
              </View>
            </Button>
          </View>
        ) : (
          <View className="py-2 gap-4 flex-1">
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="flex-1 gap-3">
                {data?.data.autocompletedLocations.map(d => {
                  return (
                    <AddressCard
                      {...d}
                      key={d.place_id}
                      onPress={() => {
                        navigation.navigate('EditAddress', {
                          place_id: d.place_id,
                          state: d.state,
                          landmark: d.landmark,
                          city: d.city,
                          rawAddress: d.description,
                          type: 'create_profile',
                          profile_data: route.params,
                        });
                      }}
                    />
                  );
                })}
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    </SafeScreen>
  );
}
