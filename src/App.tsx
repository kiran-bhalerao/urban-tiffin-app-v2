/* eslint-disable react-native/no-inline-styles */
import 'react-native-gesture-handler';
import './translations';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Image, View } from 'react-native';
import Toast, { BaseToast, ToastConfig } from 'react-native-toast-message';

import ApplicationNavigator from './navigators/Application';

import SplashLogo from '@/assets/images/splash_icon.png';
import { DataLoad } from '@/providers/data-load';

const queryClient = new QueryClient();

const toastConfig: ToastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'green', height: 80 }}
      text1NumberOfLines={1}
      text2NumberOfLines={2}
      text1Style={{ fontSize: 16, fontFamily: 'Poppins' }}
      text2Style={{ fontSize: 14, fontFamily: 'Poppins' }}
    />
  ),
  error: props => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'red', height: 80 }}
      text1NumberOfLines={1}
      text2NumberOfLines={2}
      text1Style={{ fontSize: 16, fontFamily: 'Poppins' }}
      text2Style={{ fontSize: 14, fontFamily: 'Poppins' }}
    />
  ),
  info: props => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'orange', height: 80 }}
      text1NumberOfLines={1}
      text2NumberOfLines={2}
      text1Style={{ fontSize: 16, fontFamily: 'Poppins' }}
      text2Style={{ fontSize: 14, fontFamily: 'Poppins' }}
    />
  ),
};

const Splash = () => (
  <View className="h-full bg-black justify-center items-center">
    <Image source={SplashLogo} />
  </View>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DataLoad loading={<Splash />}>
        <ApplicationNavigator />
      </DataLoad>
      <Toast config={toastConfig} />
    </QueryClientProvider>
  );
}

export default App;
