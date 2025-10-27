import { CreatePlaneDTO } from "App/DTOs/Plane/createPlaneDTO";
import Plane from "App/Models/Plane";

export default class PlaneProfile {
    
    public static toPlaneEntity(dto: CreatePlaneDTO, vehicleId: number): Partial<Plane> {
        return {
            id: vehicleId,
            airline_id: dto.airline_id,
        }
    }
}