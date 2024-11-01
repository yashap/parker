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
 * using the following colors:
 * - Primary: #E3406E
 * - Secondary: #455A64
 * - Tertiary: #FFD700
 */
export const lightTheme: Theme = {
  ...MD3LightTheme,
  colors: {
    primary: 'rgb(182, 26, 79)',
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(255, 217, 222)',
    onPrimaryContainer: 'rgb(63, 0, 21)',
    secondary: 'rgb(0, 103, 131)',
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: 'rgb(188, 233, 255)',
    onSecondaryContainer: 'rgb(0, 31, 42)',
    tertiary: 'rgb(224, 144, 16)', // The generator used rgb(112, 93, 0), but that's ugly
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(255, 225, 109)',
    onTertiaryContainer: 'rgb(34, 27, 0)',
    error: 'rgb(186, 26, 26)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',
    background: 'rgb(255, 251, 255)',
    onBackground: 'rgb(32, 26, 27)',
    surface: 'rgb(255, 251, 255)',
    onSurface: 'rgb(32, 26, 27)',
    surfaceVariant: 'rgb(243, 221, 223)',
    onSurfaceVariant: 'rgb(82, 67, 69)',
    outline: 'rgb(132, 115, 117)',
    outlineVariant: 'rgb(214, 194, 196)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(54, 47, 47)',
    inverseOnSurface: 'rgb(251, 238, 238)',
    inversePrimary: 'rgb(255, 178, 190)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(251, 240, 246)',
      level2: 'rgb(249, 233, 241)',
      level3: 'rgb(247, 226, 236)',
      level4: 'rgb(246, 224, 234)',
      level5: 'rgb(245, 220, 230)',
    },
    surfaceDisabled: 'rgba(32, 26, 27, 0.12)',
    onSurfaceDisabled: 'rgba(32, 26, 27, 0.38)',
    backdrop: 'rgba(58, 45, 47, 0.4)',
    link: 'blue',
  },
}

export const darkTheme: Theme = {
  ...MD3DarkTheme,
  colors: {
    primary: 'rgb(255, 178, 190)',
    onPrimary: 'rgb(102, 0, 38)',
    primaryContainer: 'rgb(144, 0, 57)',
    onPrimaryContainer: 'rgb(255, 217, 222)',
    secondary: 'rgb(99, 211, 255)',
    onSecondary: 'rgb(0, 53, 69)',
    secondaryContainer: 'rgb(0, 77, 99)',
    onSecondaryContainer: 'rgb(188, 233, 255)',
    tertiary: 'rgb(233, 196, 0)',
    onTertiary: 'rgb(58, 48, 0)',
    tertiaryContainer: 'rgb(84, 70, 0)',
    onTertiaryContainer: 'rgb(255, 225, 109)',
    error: 'rgb(255, 180, 171)',
    onError: 'rgb(105, 0, 5)',
    errorContainer: 'rgb(147, 0, 10)',
    onErrorContainer: 'rgb(255, 180, 171)',
    background: 'rgb(32, 26, 27)',
    onBackground: 'rgb(236, 224, 224)',
    surface: 'rgb(32, 26, 27)',
    onSurface: 'rgb(236, 224, 224)',
    surfaceVariant: 'rgb(82, 67, 69)',
    onSurfaceVariant: 'rgb(214, 194, 196)',
    outline: 'rgb(159, 140, 142)',
    outlineVariant: 'rgb(82, 67, 69)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(236, 224, 224)',
    inverseOnSurface: 'rgb(54, 47, 47)',
    inversePrimary: 'rgb(182, 26, 79)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(43, 34, 35)',
      level2: 'rgb(50, 38, 40)',
      level3: 'rgb(57, 43, 45)',
      level4: 'rgb(59, 44, 47)',
      level5: 'rgb(63, 47, 50)',
    },
    surfaceDisabled: 'rgba(236, 224, 224, 0.12)',
    onSurfaceDisabled: 'rgba(236, 224, 224, 0.38)',
    backdrop: 'rgba(58, 45, 47, 0.4)',
    link: 'blue',
  },
}
