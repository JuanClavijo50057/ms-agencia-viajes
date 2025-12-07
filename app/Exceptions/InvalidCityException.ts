import { Exception } from '@adonisjs/core/build/standalone'

export default class InvalidCityException extends Exception {
  constructor(message: string = 'La actividad pertenece a otra ciudad') {
    // status 400 = Bad Request
    super(message, 400, 'E_INVALID_CITY')
  }
}
