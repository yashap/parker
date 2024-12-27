import { FooRepository } from 'src/test/FooApp'

afterEach(() => {
  FooRepository.clear()
})
