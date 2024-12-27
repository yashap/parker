import { useNavigation } from 'expo-router'
import React from 'react'
import { LogoutButton } from 'src/components/LogoutButton'

export type HeaderType = NoHeader | DefaultHeader

interface NoHeader {
  type: 'noHeader'
}

interface DefaultHeader {
  type: 'defaultHeader'
  title: string
}

const toNavigationOptions = (header: HeaderType) => {
  switch (header.type) {
    case 'noHeader':
      return { headerShown: false }
    case 'defaultHeader':
      return { title: header.title, headerRight: () => <LogoutButton /> }
  }
}

export const useNavigationHeader = (headerType: HeaderType) => {
  const navigation = useNavigation()
  React.useEffect(() => {
    navigation.setOptions(toNavigationOptions(headerType))
  }, [navigation])
}
