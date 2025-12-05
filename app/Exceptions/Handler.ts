import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract) {
    // 👀 Esto te mostrará el contenido real del error
    console.log('💥 Error capturado por Handler:')
    console.log(JSON.stringify(error, null, 2))

    // ⚡ Validaciones (incluye tu CustomReporter)
    if (error.code === 'E_VALIDATION_FAILURE') {
      return ctx.response.status(422).send({
        status: 'error',
        message: 'Los datos enviados no son válidos.',
        errors: error.messages?.errors || error.messages || [],
      })
    }

    // ⚡ Excepciones personalizadas (como BadRequest, NotFound)
    if (error.status && error.code) {
      return ctx.response.status(error.status).send({
        status: 'error',
        code: error.code,
        message: error.message,
      })
    }

    // ⚡ Errores inesperados
    Logger.error(error)
    return ctx.response.status(500).send({
      status: 'error',
      message: 'Error interno del servidor.',
    })
  }
}
