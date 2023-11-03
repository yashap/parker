import * as React from 'react'
import { SignUp as SignUpComponent } from '../components/auth/SignUp'

const SignUp: React.FC = () => {
  const [email, setEmail] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  return <SignUpComponent email={email} setEmail={setEmail} password={password} setPassword={setPassword} />
}

export default SignUp

// import { router } from 'expo-router'
// import { useState } from 'react'
// import { showMessage } from 'react-native-flash-message'
// import { CoreClientBuilder } from '../apiClient/CoreClientBuilder'
// import { MainTitle } from '../components/MainTitle'
// import { ScreenContainer } from '../components/ScreenContainer'
// import { StyledTextInput } from '../components/StyledTextInput'
// import { SubmitButton } from '../components/SubmitButton'
// import { FakeTemporaryAuthenticationStore } from '../store/FakeTemporaryAuthenticationStore'

// const userHasParkingSpots = async (): Promise<boolean> => {
//   const coreClient = CoreClientBuilder.build()
//   try {
//     const { data } = await coreClient.parkingSpots.listClosestToPoint({
//       latitude: 50,
//       longitude: 50,
//       limit: 1,
//     })
//     return data.length > 0
//   } catch (error) {
//     return false
//   }
// }

// const onLogin = async () => {
//   const hasParkingSpots = await userHasParkingSpots()
//   if (hasParkingSpots) {
//     router.replace('/parkingSpots/list')
//   } else {
//     router.replace('/parkingSpots/new')
//   }
// }

// const Login: React.FC = () => {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   return (
//     <ScreenContainer className='items-center justify-center'>
//       <MainTitle>Parker</MainTitle>
//       <StyledTextInput
//         textContentType='username'
//         placeholder='Email'
//         onChangeText={(newEmail) => setEmail(newEmail)}
//         defaultValue={email}
//       />
//       <StyledTextInput
//         secureTextEntry={true}
//         placeholder='Password'
//         onChangeText={(newPassword) => setPassword(newPassword)}
//         defaultValue={password}
//       />
//       <SubmitButton
//         title='Login'
//         className='w-11/12'
//         onPress={async () => {
//           try {
//             await FakeTemporaryAuthenticationStore.login(email, password)
//             await onLogin()
//           } catch (error) {
//             showMessage({
//               message: (error as Error).message ?? 'Failed to log in',
//               type: 'danger',
//             })
//           }
//         }}
//       />
//     </ScreenContainer>
//   )
// }

// export default Login
