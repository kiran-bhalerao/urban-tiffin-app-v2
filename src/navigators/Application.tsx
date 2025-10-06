import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { useAppStore } from '@/lib/store/useAppStore';
import { AboutScreen } from '@/screens/about';
import { AdvanceSettings } from '@/screens/advance-settings';
import { AlertsScreen } from '@/screens/alerts';
import { CartScreen } from '@/screens/cart';
import { CartScheduleScreen } from '@/screens/cart/schedule';
import { CreateProfileScreen } from '@/screens/create-profile';
import { EditAddressScreen } from '@/screens/edit-address';
import { EditProfileScreen } from '@/screens/edit-profile';
import { HelpScreen } from '@/screens/help';
import { KitchenScreen } from '@/screens/kitchen';
import { KitchenDetailsScreen } from '@/screens/kitchen-details';
import { LoginScreen } from '@/screens/login';
import { MyAddressesScreen } from '@/screens/my-addresses';
import { OrderHistoryScreen } from '@/screens/order-history';
import { OtpScreen } from '@/screens/otp';
import { Policy } from '@/screens/policy';
import { Refund } from '@/screens/refund';
import { SearchScreen } from '@/screens/search';
import { Shipment } from '@/screens/shipment';
import { Tabs } from '@/screens/tabs';
import { Terms } from '@/screens/terms';
import { YourLocationScreen } from '@/screens/your-location';
import type { ApplicationStackParamList } from '@/types/navigation';

const Stack = createStackNavigator<ApplicationStackParamList>();

function ApplicationNavigator() {
  // const accessToken = '';
  const accessToken = useAppStore(s => s.accessToken);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!accessToken && (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Otp" component={OtpScreen} />
            <Stack.Screen
              name="CreateProfile"
              component={CreateProfileScreen}
            />
            <Stack.Screen name="YourLocation" component={YourLocationScreen} />
          </>
        )}

        <Stack.Screen name="Dashboard" component={Tabs} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Kitchen" component={KitchenScreen} />
        <Stack.Screen name="KitchenDetails" component={KitchenDetailsScreen} />
        <Stack.Screen name="Alerts" component={AlertsScreen} />
        <Stack.Screen name="EditAddress" component={EditAddressScreen} />
        {!!accessToken && (
          <>
            <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="MyAddresses" component={MyAddressesScreen} />
            <Stack.Screen name="AdvanceSettings" component={AdvanceSettings} />
          </>
        )}
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
        <Stack.Screen name="Policy" component={Policy} />
        <Stack.Screen name="Terms" component={Terms} />
        <Stack.Screen name="Refund" component={Refund} />
        <Stack.Screen name="Shipment" component={Shipment} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="CartSchedule" component={CartScheduleScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default ApplicationNavigator;
