import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import React from 'react'
import type { IconProps } from 'react-native-paper/lib/typescript/components/MaterialCommunityIcon'

/**
 * The icon component we hand to PaperProvider via `settings={{ icon }}`.
 *
 * Paper resolves icons itself by `require`ing @react-native-vector-icons/material-design-icons,
 * then @expo/vector-icons, then react-native-vector-icons - but under pnpm's isolated node_modules
 * it can only see its own declared dependencies, which include none of them. So every icon fell
 * back to Paper's placeholder glyph. Passing the component in explicitly resolves it from *our*
 * dependencies instead, which is also what Paper's docs recommend over relying on that lookup.
 */
export const paperIcon = ({ name, color, size, ...rest }: IconProps) => (
  <MaterialCommunityIcons
    name={name as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
    color={color}
    size={size}
    {...rest}
  />
)
