import { CreatePlaneDTO } from "App/DTOs/Plane/createPlaneDTO";
import Plane from "App/Models/Plane";
import Vehicle from "App/Models/Vehicle";

export default class PlaneProfile {
    public static toVehicleEntity(dto: CreatePlaneDTO): Partial<Vehicle> {
        return {
            type: "aeronave",
            brand: dto.brand,
            model: dto.model,
            capacity: dto.capacity,
            color: dto.color,
        }
    }
    public static toPlaneEntity(dto: CreatePlaneDTO, vehicleId: number): Partial<Plane> {
        return {
            id: vehicleId,
            airline_id: dto.airline_id,
        }
    }
}