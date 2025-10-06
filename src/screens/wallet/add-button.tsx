import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { Fragment, useCallback, useMemo, useRef } from 'react';

import { Button } from '@/components/reusables/ui/button';
import { Text } from '@/components/reusables/ui/text';
import { useAppStore } from '@/lib/store/useAppStore';
import { Payment } from '@/screens/wallet/payment';
import { ApplicationStackParamList } from '@/types/navigation';

export const AddMoneyButton = () => {
  const userId = useAppStore(s => s.user?._id);

  const { reset } = useNavigation<NavigationProp<ApplicationStackParamList>>();
  const login = () => {
    setTimeout(() => {
      reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }, 0);
  };

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['1%', '60%'], []);

  const backdropComponent = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.48}
      />
    ),
    [],
  );

  const queryClient = useQueryClient();
  const refreshWallet = () => {
    // Refresh wallet balance after 5 seconds
    setTimeout(() => {
      void queryClient.refetchQueries({
        queryKey: ['wallet-details'],
      });
      void queryClient.refetchQueries({
        queryKey: ['wallet-transactions'],
      });
    }, 5000);
  };

  return (
    <Fragment>
      <Button
        onPress={() => {
          if (userId) {
            bottomSheetModalRef.current?.present();
          } else {
            login();
          }
        }}
        className="bg-brand rounded-xl"
        size="sm"
      >
        <Text className="font-poppins">{userId ? 'ADD' : 'Login'}</Text>
      </Button>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        enablePanDownToClose
        snapPoints={snapPoints}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        backdropComponent={backdropComponent}
      >
        <Payment
          close={() => {
            bottomSheetModalRef.current?.close();
            refreshWallet();
          }}
        />
      </BottomSheetModal>
    </Fragment>
  );
};
