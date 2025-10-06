import { ScrollView, View } from 'react-native'
import { ArrowLeft } from 'lucide-react-native'

import { Button } from '@/components/reusables/ui/button'
import { Text } from '@/components/reusables/ui/text'
import { SafeScreen } from '@/components/template'
import type { ApplicationScreenProps } from '@/types/navigation'

export function Refund({ navigation }: ApplicationScreenProps<'Refund'>) {
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
          Refund Policy
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="max-w-4xl mx-auto">
          <Text className="text-sm text-gray-600 my-4">
            Last Updated: August 26, 2024
          </Text>

          <Text className="text-xl font-semibold mb-4">Introduction</Text>
          <Text className="mb-6">
            At <Text className="font-bold">Urban Tiffin Co</Text>, we strive to
            ensure customer satisfaction with our food delivery services. This
            Refund Policy outlines the conditions under which refunds will be
            provided, ensuring a transparent and fair process for all our users.
          </Text>

          <Text className="text-xl font-semibold mb-4">
            Eligibility for Refunds
          </Text>
          <Text className="mb-6">
            Refunds may be issued under the following circumstances:
          </Text>
          <Text className="ml-4 mb-6">
            • Incorrect Order: If you receive an incorrect item or order that
            does not match what was ordered.{'\n'}• Food Quality: If the food
            delivered is spoiled or does not meet the quality standards.{'\n'}•
            Non-Delivery: If the order was not delivered within the specified
            delivery time and you no longer wish to receive it.
          </Text>

          <Text className="text-xl font-semibold mb-4">Refund Process</Text>
          <Text className="mb-6">
            To request a refund, please follow these steps:
          </Text>
          <Text className="ml-4 mb-6">
            • Contact our customer service within 24 hours of receiving your
            order, providing details of the issue and your order number.{'\n'}•
            Our team will review your request and may ask for additional
            information, such as photos of the item received.{'\n'}• If your
            refund request is approved, the refund will be processed to the
            original payment method within 5-7 business days.
          </Text>

          <Text className="text-xl font-semibold mb-4">
            Non-Refundable Situations
          </Text>
          <Text className="mb-6">
            Refunds will not be provided in the following cases:
          </Text>
          <Text className="ml-4 mb-6">
            • If the order is canceled after it has been prepared or dispatched.
            {'\n'}• If the food is consumed, partially or fully, before
            reporting any issues.{'\n'}• For any preferences or dislikes that
            were not specified at the time of ordering.
          </Text>

          <Text className="text-xl font-semibold mb-4">Contact Us</Text>
          <Text className="mb-6">
            If you have any questions or concerns about our Refund Policy,
            please contact us:
          </Text>
          <Text className="ml-4 mb-4">
            • By email: bk@urbantiffin.in{'\n'}• By phone: 9637668902
          </Text>
        </View>
      </ScrollView>
    </SafeScreen>
  )
}
