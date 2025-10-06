/* eslint-disable react/jsx-fragments */
import { Fragment, useCallback, useMemo, useRef } from 'react'
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal
} from '@gorhom/bottom-sheet'

import { Button } from '@/components/reusables/ui/button'
import { Text } from '@/components/reusables/ui/text'
import { useAppStore } from '@/lib/store/useAppStore'
import { Withdraw } from '@/screens/wallet/withdraw'

export const WithdrawMoneyButton = () => {
  const userId = useAppStore(s => s.user?._id)

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => ['1%', '60%'], [])

  const backdropComponent = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.48}
      />
    ),
    []
  )

  if (!userId) return null

  return (
    <Fragment>
      <Button
        onPress={() => {
          bottomSheetModalRef.current?.present()
        }}
        className="border-brand border bg-transparent rounded-xl"
        size="sm"
      >
        <Text className="font-poppins text-brand">WITHDRAW</Text>
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
        <Withdraw close={() => bottomSheetModalRef.current?.close()} />
      </BottomSheetModal>
    </Fragment>
  )
}
