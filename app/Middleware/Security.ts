import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios';
import Env from '@ioc:Adonis/Core/Env'
import SecurityService from 'App/Services/SecurityService';
export default class Security {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    let theRequest = request.toJSON()
    console.log('Middleware Security - Request URL:', theRequest.url);
      if (theRequest.headers.authorization) {
        console.log('Authorization Header:', theRequest.headers.authorization);
        SecurityService.token = theRequest.headers.authorization
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
          } else {
            return response.status(403)
          }
          await next()
        } catch (error) {
          // Si es un error que viene del microservicio (tiene response), lo manejas
          if (axios.isAxiosError(error) && error.response) {
            console.log('Error en Middleware Security - Axios Error:', error.message)
            const status = error.response.status || 403
            return response.status(status)
          }
          // Si no es un error HTTP del microservicio, lánzalo para que lo maneje el Handler global
          console.log('Error en Middleware Security:', error)
          throw error
        }

      } else {
        return response.status(401)
      }
  }
}
