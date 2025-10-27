import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NotFoundException from 'App/Exceptions/NotFoundException';

import Airline from "App/Models/Airline";
import AirlineValidator from 'App/Validators/AirlineValidator';

export default class AirlinesController {
    public async find({ params, request, response }: HttpContextContract) {
        if (params.id) {
            const airline = await Airline.find(params.id)
            if (!airline) {
                throw new NotFoundException('Airline not found')
            }
            return response.ok(airline)
        }
        const page = Number(request.input('page', 1))
        const perPage = Number(request.input('per_page', 30))
        const airlines = await Airline.query().paginate(page, perPage)
        return response.ok(airlines)
    }
    public async create({ request, response }: HttpContextContract) {
        const body = await request.validate(AirlineValidator);
        const airline = await Airline.create(body);
        return response.created(airline);
    }
    public async update({ params, request, response }: HttpContextContract) {
        const airline = await Airline.find(params.id)

        if (!airline) {
            throw new NotFoundException('Airline not found')
        }

        const data = request.only(['name', 'code', 'country']) // 🔹 evita datos no deseados
        airline.merge(data)
        await airline.save()

        return response.ok({
            status: 'success',
            message: 'Airline updated successfully',
            data: airline,
        })
    }
    public async delete({ params, response }: HttpContextContract) {
        const airline = await Airline.find(params.id)
        if (!airline) {
            throw new NotFoundException('Airline not found') // 👈 excepción semántica
        }
        await airline.delete()
        return response.ok({
            status: 'success',
            message: 'Airline deleted successfully',
        })
    }
}
