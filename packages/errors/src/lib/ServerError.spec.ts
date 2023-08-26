import {
  InternalServerError,
  isServerError,
  isServerErrorDto,
  NotFoundError,
  ServerError,
  ServerErrorDto,
  UnknownError,
} from './ServerError'

describe(ServerError.name, () => {
  describe(isServerError.name, () => {
    it('returns true if the error is a ServerError', () => {
      expect(isServerError(new InternalServerError('Oh no', { subCode: 'DatabaseConnectionTimeout' }))).toBe(true)
      expect(isServerError(new NotFoundError('Oh no'))).toBe(true)
    })

    it('returns true if the error is not a ServerError', () => {
      expect(isServerError(new Error('Oh no'))).toBe(false)
    })
  })

  describe(isServerErrorDto.name, () => {
    it('returns true if the error is a ServerErrorDto', () => {
      expect(isServerErrorDto(new InternalServerError('Oh no', { subCode: 'DatabaseConnectionTimeout' }).toDto())).toBe(
        true
      )
      expect(isServerErrorDto(new NotFoundError('Oh no').toDto())).toBe(true)
    })

    it('returns true if the error is not a ServerErrorDto', () => {
      expect(isServerErrorDto(new Error('Oh no'))).toBe(false)
    })
  })

  describe('toDto', () => {
    it('converts a ServerError to a ServerErrorDto, with all optional fields populated', () => {
      const expected: ServerErrorDto<{ foo: string }> = {
        message: 'Oh no',
        code: 'InternalServerError',
        subCode: 'DatabaseConnectionTimeout',
        metadata: { foo: 'bar' },
      }
      expect(
        new InternalServerError('Oh no', {
          subCode: 'DatabaseConnectionTimeout',
          metadata: { foo: 'bar' },
        }).toDto()
      ).toStrictEqual(expected)
    })

    it('converts a ServerError to a ServerErrorDto, with all optional fields missing', () => {
      const expected: ServerErrorDto = {
        message: 'Oh no',
        code: 'InternalServerError',
      }
      expect(new InternalServerError('Oh no').toDto()).toStrictEqual(expected)
    })
  })

  describe(ServerError.fromDto.name, () => {
    it('converts a ServerErrorDto to a ServerError', () => {
      const internalServerErrorDto: ServerErrorDto<{ foo: string }> = {
        message: 'Oh no',
        code: 'InternalServerError',
        subCode: 'DatabaseConnectionTimeout',
        metadata: { foo: 'bar' },
      }
      const notFoundErrorDto: ServerErrorDto = {
        message: 'Oh no',
        code: 'NotFoundError',
      }
      expect(ServerError.fromDto(internalServerErrorDto, 500)).toStrictEqual(
        new InternalServerError('Oh no', {
          subCode: 'DatabaseConnectionTimeout',
          metadata: { foo: 'bar' },
        })
      )
      expect(ServerError.fromDto(notFoundErrorDto, 404)).toStrictEqual(new NotFoundError('Oh no'))
    })

    it('converts anything unrecognized to an UnknownError', () => {
      expect(ServerError.fromDto(20, 500)).toStrictEqual(
        new UnknownError('Unexpected response body [status: 500] [message: undefined] [body: 20]')
      )
    })
  })
})
