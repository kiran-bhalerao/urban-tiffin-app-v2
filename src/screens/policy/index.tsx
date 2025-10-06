import { ScrollView, View } from 'react-native'
import { ArrowLeft } from 'lucide-react-native'

import { Button } from '@/components/reusables/ui/button'
import { Text } from '@/components/reusables/ui/text'
import { SafeScreen } from '@/components/template'
import type { ApplicationScreenProps } from '@/types/navigation'

export function Policy({ navigation }: ApplicationScreenProps<'Policy'>) {
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
          Privacy Policy
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="max-w-4xl mx-auto">
          <Text className="text-sm text-gray-600 my-4">
            Last Updated: June 1, 2024
          </Text>

          <Text className="text-xl font-semibold mb-4">Introduction</Text>
          <Text className="mb-6">
            Welcome to <Text className="font-bold">Urban Tiffin Co.</Text> We
            are committed to protecting your privacy and ensuring you have a
            positive experience while using our food ordering and delivery
            services (Services). This Privacy Policy outlines our practices
            regarding the collection, use, and disclosure of your information
            when you use our application (App) and explains your privacy rights
            and how the law protects you.
          </Text>

          <Text className="text-xl font-semibold mb-4">
            Information We Collect
          </Text>
          <Text className="text-lg font-semibold mb-2">
            Personal Information
          </Text>
          <Text className="ml-4 mb-4">
            • Includes your name, email address, phone number, and delivery
            address.
            {'\n'}• Includes credit card details, billing address, and other
            payment-related information.
          </Text>

          <Text className="text-lg font-semibold mb-2">Usage Data</Text>
          <Text className="ml-4 mb-4">
            • Details of your orders, interactions with the App, and
            preferences.
            {'\n'}• Includes IP address, browser type and version, time zone
            setting, browser plug-in types and versions, operating system, and
            platform.
          </Text>

          <Text className="text-lg font-semibold mb-2">Location Data</Text>
          <Text className="mb-4">
            Real-time location data from your device, if you grant permission,
            to facilitate order delivery.
          </Text>

          <Text className="text-lg font-semibold mb-2">
            Cookies and Tracking Technologies
          </Text>
          <Text className="mb-6">
            We use cookies and similar tracking technologies to track activity
            on our App and hold certain information.
          </Text>

          <Text className="text-xl font-semibold mb-4">
            How We Use Your Information
          </Text>
          <Text className="mb-4">
            We use the collected information for various purposes:
          </Text>
          <Text className="ml-4 mb-6">
            • To provide and maintain our Services{'\n'}• To manage your
            account, including registration, authentication, and maintenance of
            your preferences{'\n'}• To process transactions and facilitate
            payments and delivery of your orders{'\n'}• To communicate with you,
            send you updates, notifications, and marketing messages{'\n'}• To
            improve our Services by understanding user preferences and enhancing
            user experience{'\n'}• To ensure security and prevent fraud
          </Text>

          <Text className="text-xl font-semibold mb-4">
            Sharing Your Information
          </Text>
          <Text className="mb-4">
            We do not sell your personal information. We may share your
            information in the following circumstances:
          </Text>
          <Text className="ml-4 mb-6">
            • <Text className="font-bold">With Service Providers:</Text>{' '}
            Third-party vendors to facilitate our Services, perform App-related
            services, or assist us in analyzing how our Services are used{'\n'}•{' '}
            <Text className="font-bold">For Business Transfers:</Text> In
            connection with or during negotiations of any merger, sale of
            company assets, financing, or acquisition of all or a portion of our
            business to another company{'\n'}•{' '}
            <Text className="font-bold">With Law Enforcement:</Text> Under
            certain circumstances, we may be required to disclose your personal
            information if required to do so by law or in response to valid
            requests by public authorities{'\n'}•{' '}
            <Text className="font-bold">With Your Consent:</Text> We may
            disclose your personal information for any other purpose with your
            explicit consent
          </Text>

          <Text className="text-xl font-semibold mb-4">
            Your Privacy Rights
          </Text>
          <Text className="mb-4">
            Depending on your location, you may have the following rights
            regarding your personal information:
          </Text>
          <Text className="ml-4 mb-6">
            • <Text className="font-bold">Access:</Text> Request access to the
            personal information we hold about you{'\n'}•{' '}
            <Text className="font-bold">Correction:</Text> Request correction of
            inaccurate or incomplete information{'\n'}•{' '}
            <Text className="font-bold">Deletion:</Text> Request deletion of
            your personal information{'\n'}•{' '}
            <Text className="font-bold">Restriction:</Text> Request restriction
            of processing your personal information{'\n'}•{' '}
            <Text className="font-bold">Objection:</Text> Object to processing
            your personal information{'\n'}•{' '}
            <Text className="font-bold">Data Portability:</Text> Request
            transfer of your personal information to another service provider
            {'\n'}• <Text className="font-bold">Withdraw Consent:</Text>{' '}
            Withdraw consent at any time where we rely on consent to process
            your information
          </Text>

          <Text className="text-xl font-semibold mb-4">Data Security</Text>
          <Text className="mb-6">
            We use commercially reasonable efforts to protect your information
            from unauthorized access, use, alteration, or destruction. However,
            no method of transmission over the internet or method of electronic
            storage is 100% secure.
          </Text>

          <Text className="text-xl font-semibold mb-4">
            Children&apos;s Privacy
          </Text>
          <Text className="mb-6">
            Our Services are not intended for use by children under the age of
            13. We do not knowingly collect personal information from children
            under 13. If we become aware that we have collected personal
            information from children without verification of parental consent,
            we will take steps to delete that information.
          </Text>

          <Text className="text-xl font-semibold mb-4">
            Changes to This Privacy Policy
          </Text>
          <Text className="mb-6">
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the Last Updated date at the top of this policy.
          </Text>

          <Text className="text-xl font-semibold mb-4">Contact Us</Text>
          <Text className="mb-6">
            If you have any questions about this Privacy Policy, please contact
            us:
          </Text>
          <Text className="ml-4 mb-4">
            • By email: bk@urbantiffin.in{'\n'}• By phone: 9637668902
          </Text>
        </View>
      </ScrollView>
    </SafeScreen>
  )
}
