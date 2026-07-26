import { afterEach } from 'vitest'
import { FooRepository } from './FooApp.js'

afterEach(() => {
  FooRepository.clear()
})
