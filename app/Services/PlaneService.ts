import Plane from 'App/Models/Plane'
import PlaneProfile from 'App/Profiles/PlaneProfile'
import BaseVehicleService from './BaseVehicleService'
import BaseVehicleProfile from 'App/Profiles/BaseVehicleProfile'
import { CreatePlaneDTO } from 'App/DTOs/Plane/createPlaneDTO'

export default class PlaneService extends BaseVehicleService {
  public static async createPlane(data: CreatePlaneDTO) {
    const vehicleData = BaseVehicleProfile.toVehicleEntity(data)

    return this.createWithVehicle(vehicleData, async (vehicle, trx) => {
      const planeData = PlaneProfile.toPlaneEntity(data, vehicle.id)
      return await Plane.create(planeData, { client: trx })
    })
  }
}
