export const setTestDBUrl = (): void => {
  process.env['DATABASE_URL'] = 'postgresql://app:app121@localhost:5441/core?schema=public'
}
