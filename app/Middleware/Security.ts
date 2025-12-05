import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios';
import Env from '@ioc:Adonis/Core/Env'
export default class Security {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    let theRequest = request.toJSON()
    if (theRequest.headers.authorization) {
      let token = theRequest.headers.authorization.replace("Bearer ", "")
      let thePermission: object = {
        url: theRequest.url,
        method: theRequest.method
      }
      try {
        const result = await axios.post(`${Env.get('MS_SECURITY')}/api/public/security/permissions-validation`, thePermission,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        if (result.data == true) {
          await next()
        } else {
          return response.status(403)
        }
      } catch (error) {
        // Si es un error que viene del microservicio (tiene response), lo manejas
        if (axios.isAxiosError(error) && error.response) {
          const status = error.response.status || 403
          return response.status(status)
        }
        // Si no es un error HTTP del microservicio, lánzalo para que lo maneje el Handler global
        throw error
      }

    } else {
      return response.status(401)
    }

  }
}
