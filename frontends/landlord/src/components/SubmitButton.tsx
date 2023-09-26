import { Pressable, PressableProps, Text } from 'react-native'

type SubmitButtonProps = Omit<PressableProps, 'children'> & { title: string }

export const SubmitButton = ({ title, ...rest }: SubmitButtonProps) => (
  <Pressable className='bg-blue-600 px-4 py-2 rounded-lg m-2 shadow shadow-blue-400' {...rest}>
    <Text className='text-xl text-white text-center'>{title}</Text>
  </Pressable>
)
