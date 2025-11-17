import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Driver from 'App/Models/Driver';
import { NotificationService } from 'App/Services/NotificationService';
import  SecurityService from 'App/Services/SecurityService';

export default class NotificationsController {
    public async alertNewNotification({ response }: HttpContextContract) {
        const drivers = await Driver.query().preload('shifts', (shiftQuery) => {
            shiftQuery.preload('vehicle', (vehicleQuery) => {
                vehicleQuery.where('type', "carro")
            })
        })
        response.ok({ drivers })

        for (const driver of drivers) {
            console.log(driver.user_id);
            try {
                const data = await SecurityService.getUserById(driver.user_id)
                console.log('Sending notification to:', data.email);
                NotificationService.sendNotification(data.email, "alerta", "Alerta climatica")
            } catch (error) {
                console.log(error);
                
            }


        }

    }


}
