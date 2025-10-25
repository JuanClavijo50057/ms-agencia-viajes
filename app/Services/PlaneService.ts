import Database from "@ioc:Adonis/Lucid/Database"
import { CreatePlaneDTO } from "App/DTOs/Plane/createPlaneDTO"
import Plane from "App/Models/Plane"
import Vehicle from "App/Models/Vehicle"
import PlaneProfile from "App/Profiles/PlaneProfile"

export default class PlaneService {
    public static async createPlane(data: CreatePlaneDTO) {
        const trx = await Database.transaction() 

        try {
            const vehicleData = PlaneProfile.toVehicleEntity(data)
            const vehicle = await Vehicle.create(vehicleData, { client: trx })

            const planeData = PlaneProfile.toPlaneEntity(data, vehicle.id)
            const plane = await Plane.create(planeData, { client: trx })

            await trx.commit()
            return plane

        } catch (error) {
            await trx.rollback()
            throw error
        }
    }
}