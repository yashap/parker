import { ViewStyle } from 'react-native'
import { useTheme } from 'react-native-paper'
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context'

type ScreenProps = Omit<SafeAreaViewProps, 'style'> & {
  style?: ViewStyle
}

export const Screen = (props: ScreenProps) => {
  const theme = useTheme()
  const { style, ...rest } = props
  // NativeWind's className only reaches React Native core components; third-party ones (Paper,
  // safe-area-context) need explicit style props, so keep layout styles here rather than as classes
  return <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, ...style }} {...rest} />
}
