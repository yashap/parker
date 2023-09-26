import { TextInput, TextInputProps } from 'react-native'

export const StyledTextInput = (props: TextInputProps) => (
  <TextInput
    textAlignVertical='top'
    className='text-lg text-gray-700 w-11/12 my-2 px-2 py-0 h-12 leading-6 align-text-top bg-white rounded-md shadow shadow-gray-400'
    {...props}
  />
)
