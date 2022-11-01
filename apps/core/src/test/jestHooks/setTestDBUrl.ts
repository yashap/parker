export const setTestDBUrl = (): void => {
  process.env['DATABASE_URL'] = 'postgresql://core:core_password@localhost:5441/core?schema=public'
}
