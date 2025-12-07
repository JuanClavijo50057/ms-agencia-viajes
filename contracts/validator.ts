declare module '@ioc:Adonis/Core/Validator' {
  interface Rules {
    externalUserExists(): Rule
    sequentialDates(): Rule
    sequentialCities(): Rule
  }
}