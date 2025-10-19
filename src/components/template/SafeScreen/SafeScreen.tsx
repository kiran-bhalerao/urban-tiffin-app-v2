import type { PropsWithChildren } from 'react';
import { StatusBar, View } from 'react-native';

import { cn } from '@/lib/utils';
import { Edges, SafeAreaView } from 'react-native-safe-area-context';

function SafeScreen({
  children,
  className = '',
  edges,
}: PropsWithChildren & { className?: string; edges?: Edges }) {
  return (
    <SafeAreaView className="flex-1 bg-brand-background relative" edges={edges}>
      <StatusBar backgroundColor="#F6F6F6" barStyle="dark-content" />
      <View className={cn('px-4 py-4 flex-1', className)}>{children}</View>
    </SafeAreaView>
  );
}

export default SafeScreen;
