import { addTemporalEqualityTesters } from '@parker/test-utils'

process.env['LOG_LEVEL'] = process.env['LOG_LEVEL'] ?? 'off'

addTemporalEqualityTesters()
