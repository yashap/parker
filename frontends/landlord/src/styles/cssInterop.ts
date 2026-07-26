import { cssInterop } from 'nativewind'
import { Card, Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

// NativeWind only handles `className` on React Native core components out of the box.
// Third-party components must be registered explicitly for their `className` prop to
// be translated into styles. This module must be imported once, before any of these
// components render (it's imported from the root layout).
cssInterop(Card, { className: 'style' })
cssInterop(Text, { className: 'style' })
cssInterop(SafeAreaView, { className: 'style' })
