import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error, ctx) {
    if (error.status && error.code) {
      return ctx.response.status(error.status).send({
        status: 'error',
        code: error.code,
        message: error.message,
      })
    }

    // Otros errores no previstos
    return ctx.response.status(500).send({
      status: 'error',
      message: 'Unexpected server error',
    })
  }

  public async report(error, ctx) {
    Logger.error(error)
  }
}
