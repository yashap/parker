import { ViewStyle } from 'react-native'
import { useTheme } from 'react-native-paper'
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context'

type ScreenProps = Omit<SafeAreaViewProps, 'style'> & {
  style?: ViewStyle
}

export const Screen = (props: ScreenProps) => {
  const theme = useTheme()
  const { style, ...rest } = props
  return <SafeAreaView style={{ backgroundColor: theme.colors.background, ...style }} className='flex-1' {...rest} />
}
