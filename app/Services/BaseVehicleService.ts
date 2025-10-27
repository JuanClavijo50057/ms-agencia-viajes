import Database from '@ioc:Adonis/Lucid/Database'
import Gps from 'App/Models/Gps'
import Vehicle from 'App/Models/Vehicle'

export default abstract class BaseVehicleService {
 
  protected static async createWithVehicle<T>(
    vehicleData: Partial<Vehicle>,
    createEntityCallback: (vehicle: Vehicle, trx: any) => Promise<T>
  ): Promise<T> {
    const trx = await Database.transaction()
    try {
      const vehicle = await Vehicle.create(vehicleData, { client: trx })
      await Gps.create({vehicle_id:vehicle.id,latitude:100,longitude:100}, {client:trx})
      const entity = await createEntityCallback(vehicle, trx)
      await trx.commit()
      return entity
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
}
