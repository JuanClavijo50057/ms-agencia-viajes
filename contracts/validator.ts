declare module '@ioc:Adonis/Core/Validator' {
  interface Rules {
    externalUserExists(): Rule
    sequentialDates(): Rule
    sequentialCities(): Rule
    uniqueCompound(table: string, columns: string[]): Rule

  }
}