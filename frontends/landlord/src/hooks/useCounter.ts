import { useState } from 'react'

export const useCounter = (initialCount = 0): [number, () => void] => {
  const [count, setCount] = useState(initialCount)
  return [
    count,
    () => {
      setCount((prevCount) => prevCount + 1)
    },
  ]
}
