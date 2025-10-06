import { useEffect, useState } from 'react'
import GetLocation from 'react-native-get-location'

export const useGeolocation = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number }>()

  // get users current location
  useEffect(() => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000
    })
      .then(location => {
        setLocation({ lat: location.latitude, lng: location.longitude })
      })
      .catch(() => undefined)
  }, [])

  return location
}
