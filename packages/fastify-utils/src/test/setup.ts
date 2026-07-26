import { afterEach } from 'vitest'
import { FooRepository } from './FooApp'

afterEach(() => {
  FooRepository.clear()
})
