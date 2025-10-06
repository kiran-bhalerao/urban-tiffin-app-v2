import { ScrollView, View } from 'react-native'
import { ArrowLeft } from 'lucide-react-native'

import { Button } from '@/components/reusables/ui/button'
import { Text } from '@/components/reusables/ui/text'
import { SafeScreen } from '@/components/template'
import type { ApplicationScreenProps } from '@/types/navigation'

export function Shipment({ navigation }: ApplicationScreenProps<'Shipment'>) {
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
          Shipment Policy
        </Text>
      </View>
      <ScrollView className="bg-gray-50" showsVerticalScrollIndicator={false}>
        <View className="max-w-4xl mx-auto">
          <Text className="text-sm text-gray-600 my-4">
            Last Updated: August 26, 2024
          </Text>

          <Text className="text-xl font-semibold mb-4">Introduction</Text>
          <Text className="mb-6">
            At <Text className="font-bold">Urban Tiffin</Text>, we aim to
            deliver your orders in a timely and efficient manner. To ensure the
            best delivery experience, we partner with third-party delivery
            services to fulfill all shipment needs. Below are the terms and
            conditions regarding our shipment policy:
          </Text>

          <Text className="text-xl font-semibold mb-4">
            1. Delivery Partners
          </Text>
          <Text className="mb-6">
            We collaborate with reliable third-party delivery service providers
            to deliver your orders. These partners are responsible for ensuring
            that your order reaches your specified address promptly and in good
            condition.
          </Text>

          <Text className="text-xl font-semibold mb-4">
            2. Delivery Timelines
          </Text>
          <Text className="mb-6">
            We strive to process and deliver all orders as quickly as possible.
            Delivery times may vary based on your location, weather conditions,
            traffic, and the availability of the delivery partner. While
            estimated delivery times will be provided upon order confirmation,
            we ensure that all orders placed will be delivered within 24 hours
            on the day of order.
          </Text>

          <Text className="text-xl font-semibold mb-4">
            3. Delivery Locations
          </Text>
          <Text className="mb-6">
            Our service is available in the areas listed in the delivery options
            at checkout. If your location is not covered by our delivery
            partners, we regret that we may not be able to complete the
            delivery.
          </Text>

          <Text className="text-xl font-semibold mb-4">
            4. Delivery Charges
          </Text>
          <Text className="mb-6">
            Delivery charges may apply and will be calculated based on your
            location and the chosen delivery method. These charges will be
            clearly mentioned during the checkout process.
          </Text>

          <Text className="text-xl font-semibold mb-4">5. Tracking Orders</Text>
          <Text className="mb-6">
            You can track your order through the third-party delivery app or by
            contacting our support team for assistance.
          </Text>

          <Text className="text-xl font-semibold mb-4">
            6. Failed Deliveries
          </Text>
          <Text className="mb-6">
            In case of a failed delivery attempt due to incorrect address
            details or unavailability of the recipient, our delivery partner may
            make further attempts or return the order to the kitchen. Additional
            delivery fees may apply for re-attempts.
          </Text>

          <Text className="text-xl font-semibold mb-4">
            7. Damaged or Missing Items
          </Text>
          <Text className="mb-6">
            If your order arrives damaged or with missing items, please contact
            us immediately. We will work with our delivery partners to
            investigate the issue and provide a resolution, which may include
            replacement or refund based on the situation.
          </Text>

          <Text className="text-xl font-semibold mb-4">
            8. Third-Party Delivery Terms
          </Text>
          <Text className="mb-6">
            As we rely on third-party services, their terms and conditions will
            also apply. Urban Tiffin is not liable for any delays, losses, or
            damages caused during shipment by third-party providers, though we
            will assist in resolving any such issues.
          </Text>

          <Text className="text-xl font-semibold mb-4">9. Contact Us</Text>
          <Text className="mb-6">
            For any concerns regarding your shipment, feel free to reach out to
            our customer support team at:
          </Text>
          <Text className="ml-4 mb-4">
            • By email: bk@urbantiffin.in{'\n'}• By phone: 9637668902
          </Text>
        </View>
      </ScrollView>
    </SafeScreen>
  )
}
