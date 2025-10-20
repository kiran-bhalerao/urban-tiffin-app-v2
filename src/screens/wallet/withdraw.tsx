/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useQueryClient } from '@tanstack/react-query';
import { FC } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';

import { Button } from '@/components/reusables/ui/button';
import { Text } from '@/components/reusables/ui/text';
import { useWalletWithdraw } from '@/lib/apis/useWalletWithdraw';
import { useAppStore } from '@/lib/store/useAppStore';

export const Withdraw: FC<{ close: () => void }> = ({ close }) => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useWalletWithdraw();
  const mobile = useAppStore(s => s.user?.mobile);
  const customerId = useAppStore(s => s.user?._id);

  const onWithdrawMoney = () => {
    if (!mobile) return;
    if (!customerId) return;

    mutateAsync({ userId: customerId })
      .then(() => {
        Toast.show({ text1: 'Withdraw successful' });
        void queryClient.refetchQueries({
          queryKey: ['wallet-details'],
        });
        void queryClient.refetchQueries({
          queryKey: ['wallet-transactions'],
        });
        close();
      })
      .catch(err =>
        Toast.show({
          text1: 'Withdraw failed',
          text2: err.message,
          type: 'error',
        }),
      );
  };

  return (
    <BottomSheetView className="px-4 flex-1 py-4 gap-y-3">
      <View className="flex-1 justify-center items-center px-6">
        <Text className="font-poppins text-lg text-center mb-2 font-medium">
          Withdraw Money
        </Text>
        <Text className="font-poppins text-sm text-center text-gray-600 mb-6">
          Click the button below to withdraw your available wallet balance
        </Text>
      </View>
      <Button onPress={onWithdrawMoney} className="bg-brand rounded-xl">
        <Text className="font-poppins font-semibold text-base">
          WITHDRAW NOW
        </Text>
      </Button>
    </BottomSheetView>
  );
};
