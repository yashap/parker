import * as React from 'react'
import { LogIn as LogInComponent } from '../components/auth/LogIn'

const LogIn: React.FC = () => {
  const [email, setEmail] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  return <LogInComponent email={email} setEmail={setEmail} password={password} setPassword={setPassword} />
}

export default LogIn
