import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Shift from 'App/Models/Shift'
import ShiftValidator from 'App/Validators/ShiftValidator'

export default class ShiftsController {
    public async getAll({ response }: HttpContextContract) {
        const data = await Shift.all()
        response.ok(data)
    }
    public async create({ request, response }: HttpContextContract) {
        const body = await request.validate(ShiftValidator)
        const shift = await Shift.create(body)
        response.created(shift)
    }
}
