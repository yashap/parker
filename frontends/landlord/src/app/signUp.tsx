import * as React from 'react'
import { SignUp as SignUpComponent } from '../components/auth/SignUp'

const SignUp: React.FC = () => {
  const [email, setEmail] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  return <SignUpComponent email={email} setEmail={setEmail} password={password} setPassword={setPassword} />
}

export default SignUp
