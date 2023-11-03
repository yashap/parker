import { MessageOptions, showMessage } from 'react-native-flash-message'

export const showToast = (options: MessageOptions) =>
  showMessage({
    type: 'danger',
    ...options,
  })
