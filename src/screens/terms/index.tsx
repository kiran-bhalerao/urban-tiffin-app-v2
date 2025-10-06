import { ScrollView, View } from 'react-native'
import { ArrowLeft } from 'lucide-react-native'

import { Button } from '@/components/reusables/ui/button'
import { Text } from '@/components/reusables/ui/text'
import { SafeScreen } from '@/components/template'
import type { ApplicationScreenProps } from '@/types/navigation'

export function Terms({ navigation }: ApplicationScreenProps<'Terms'>) {
  return (
    <SafeScreen>
      <View className="flex-row items-center gap-3">
        <Button
          className="!px-0"
          variant="ghost"
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft color="#000" />
        </Button>
        <Text className="flex-1 text-center mr-8 text-2xl font-poppins">
          Terms and Conditions
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="max-w-4xl mx-auto">
          <Text className="text-sm text-gray-600 my-4">
            Last Updated: August 26, 2024
          </Text>

          <Text className="text-xl font-semibold mb-4">Introduction</Text>
          <Text className="mb-6">
            These Terms and Conditions govern your relationship with the Urban
            Tiffin application services operated by Urban Tiffin Co. Please read
            these Terms carefully before using our Service. Your access to and
            use of the Service is conditioned on your acceptance and compliance
            with these Terms.
          </Text>

          <Text className="text-xl font-semibold mb-4">Accounts</Text>
          <Text className="mb-6">
            When you create an account with us, you must provide us with
            information that is accurate, complete, and current at all times.
            Failure to do so constitutes a breach of the Terms, which may result
            in immediate termination of your account on our Service.
          </Text>

          <Text className="text-xl font-semibold mb-4">Orders</Text>
          <Text className="mb-6">
            By placing an order through our Service, you agree to the prices,
            product descriptions, and delivery schedules. All orders are subject
            to availability and confirmation of the order price. We reserve the
            right to cancel any order and refund the amount paid.
          </Text>

          <Text className="text-xl font-semibold mb-4">Payment</Text>
          <Text className="mb-6">
            Payment must be received by us before delivery is made. We accept
            various forms of payment, including credit cards, debit cards, UPI,
            and digital wallets. By providing your payment information, you
            authorize us to charge the specified amount.
          </Text>

          <Text className="text-xl font-semibold mb-4">
            Refunds and Cancellations
          </Text>
          <Text className="mb-6">
            Refunds will be processed in accordance with our Refund Policy,
            which can be found on our website. Cancellations are only allowed
            within a specified time frame, and fees may apply.
          </Text>

          <Text className="text-xl font-semibold mb-4">
            Intellectual Property
          </Text>
          <Text className="mb-6">
            The Service and its original content, features, and functionality
            are and will remain the exclusive property of Urban Tiffin Chef and
            its licensors. Our trademarks and trade dress may not be used in
            connection with any product or service without the prior written
            consent of Urban Tiffin Chef.
          </Text>

          <Text className="text-xl font-semibold mb-4">Termination</Text>
          <Text className="mb-6">
            We may terminate or suspend your account and bar access to the
            Service immediately, without prior notice or liability, under our
            sole discretion, for any reason whatsoever, including without
            limitation if you breach the Terms.
          </Text>

          <Text className="text-xl font-semibold mb-4">Governing Law</Text>
          <Text className="mb-6">
            These Terms shall be governed and construed in accordance with the
            laws of India, without regard to its conflict of law provisions.
          </Text>

          <Text className="text-xl font-semibold mb-4">Changes to Terms</Text>
          <Text className="mb-6">
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. By continuing to access or use our Service
            after those revisions become effective, you agree to be bound by the
            revised terms.
          </Text>

          <Text className="text-xl font-semibold mb-4">Contact Us</Text>
          <Text className="mb-6">
            If you have any questions about these Terms, please contact us:
          </Text>
          <Text className="ml-4 mb-4">
            • By email: bk@urbantiffin.in{'\n'}• By phone: 9637668902
          </Text>
        </View>
      </ScrollView>
    </SafeScreen>
  )
}
