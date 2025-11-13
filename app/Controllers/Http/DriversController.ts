import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Driver from "App/Models/Driver"
import DriverValidator from 'App/Validators/DriverValidator'

export default class DriversController {
    public async findAll({response}: HttpContextContract) {
        const drivers = await Driver.all()
        response.ok(drivers)
    }
    public async create({request, response}: HttpContextContract) {
        const body =await  request.validate(DriverValidator)
        const driver = await Driver.create(body)
        response.created(driver)
    }
    
}
