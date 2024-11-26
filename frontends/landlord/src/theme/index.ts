import { MD3Theme, MD3LightTheme, MD3DarkTheme, useTheme as useThemeLib } from 'react-native-paper'

type ThemeColors = MD3Theme['colors'] & {
  link: string
}

export type Theme = Omit<MD3Theme, 'colors'> & {
  colors: ThemeColors
}

export const useTheme = () => useThemeLib<Theme>()

/**
 * Theme generated from https://callstack.github.io/react-native-paper/docs/guides/theming#creating-dynamic-theme-colors
 * using the following colors, with some tweaks:
 * - Primary: #00796b
 * - Secondary: #ffa000
 * - Tertiary: #1976d2
 */
export const lightTheme: Theme = {
  ...MD3LightTheme,
  colors: {
    primary: 'rgb(0, 107, 94)',
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(118, 248, 226)',
    onPrimaryContainer: 'rgb(0, 32, 27)',
    secondary: 'rgb(135, 82, 0)',
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: 'rgb(255, 221, 186)',
    onSecondaryContainer: 'rgb(43, 23, 0)',
    tertiary: 'rgb(0, 95, 175)',
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(212, 227, 255)',
    onTertiaryContainer: 'rgb(0, 28, 58)',
    error: 'rgb(186, 26, 26)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',
    background: 'rgb(255, 255, 255)',
    onBackground: 'rgb(25, 28, 27)',
    surface: 'rgb(255, 255, 255)',
    onSurface: 'rgb(25, 28, 27)',
    surfaceVariant: 'rgb(218, 229, 225)',
    onSurfaceVariant: 'rgb(63, 73, 70)',
    outline: 'rgb(111, 121, 118)',
    outlineVariant: 'rgb(190, 201, 197)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(45, 49, 48)',
    inverseOnSurface: 'rgb(239, 241, 239)',
    inversePrimary: 'rgb(85, 219, 198)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(255, 255, 255)',
      level2: 'rgb(230, 241, 238)',
      level3: 'rgb(223, 237, 234)',
      level4: 'rgb(220, 236, 232)',
      level5: 'rgb(215, 233, 229)',
    },
    surfaceDisabled: 'rgba(25, 28, 27, 0.12)',
    onSurfaceDisabled: 'rgba(25, 28, 27, 0.38)',
    backdrop: 'rgba(41, 50, 48, 0.4)',
    link: 'blue',
  },
}

export const darkTheme: Theme = {
  ...MD3DarkTheme,
  colors: {
    primary: 'rgb(85, 219, 198)',
    onPrimary: 'rgb(0, 55, 48)',
    primaryContainer: 'rgb(0, 80, 71)',
    onPrimaryContainer: 'rgb(118, 248, 226)',
    secondary: 'rgb(255, 184, 101)',
    onSecondary: 'rgb(72, 42, 0)',
    secondaryContainer: 'rgb(102, 61, 0)',
    onSecondaryContainer: 'rgb(255, 221, 186)',
    tertiary: 'rgb(165, 200, 255)',
    onTertiary: 'rgb(0, 49, 95)',
    tertiaryContainer: 'rgb(0, 71, 134)',
    onTertiaryContainer: 'rgb(212, 227, 255)',
    error: 'rgb(255, 180, 171)',
    onError: 'rgb(105, 0, 5)',
    errorContainer: 'rgb(147, 0, 10)',
    onErrorContainer: 'rgb(255, 180, 171)',
    background: 'rgb(25, 28, 27)',
    onBackground: 'rgb(224, 227, 225)',
    surface: 'rgb(25, 28, 27)',
    onSurface: 'rgb(224, 227, 225)',
    surfaceVariant: 'rgb(63, 73, 70)',
    onSurfaceVariant: 'rgb(190, 201, 197)',
    outline: 'rgb(137, 147, 144)',
    outlineVariant: 'rgb(63, 73, 70)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(224, 227, 225)',
    inverseOnSurface: 'rgb(45, 49, 48)',
    inversePrimary: 'rgb(0, 107, 94)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(28, 38, 36)',
      level2: 'rgb(30, 43, 41)',
      level3: 'rgb(32, 49, 46)',
      level4: 'rgb(32, 51, 48)',
      level5: 'rgb(33, 55, 51)',
    },
    surfaceDisabled: 'rgba(224, 227, 225, 0.12)',
    onSurfaceDisabled: 'rgba(224, 227, 225, 0.38)',
    backdrop: 'rgba(41, 50, 48, 0.4)',
    link: 'blue',
  },
}
