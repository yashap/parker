import { assertTestOnly } from './assertTestOnly'

describe('assertTestOnly', () => {
  const originalNodeEnv = process.env['NODE_ENV']
  const disableTestNodeEnv = () => {
    process.env['NODE_ENV'] = 'foo'
  }

  afterEach(() => {
    // Reset, because we change this in some tests
    process.env['NODE_ENV'] = originalNodeEnv
  })

  it('throws if called outside of a test', () => {
    disableTestNodeEnv()
    expect(() => {
      assertTestOnly('someMethod')
    }).toThrow()
  })

  it('does not throw if called in a test', () => {
    expect(() => {
      assertTestOnly('someMethod')
    }).not.toThrow()
  })
})
