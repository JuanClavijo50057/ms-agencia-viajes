

import { CreateCarDTO } from "App/DTOs/Car/createCarDTOs";
import { CreatePlaneDTO } from "App/DTOs/Plane/createPlaneDTO";
import Vehicle from "App/Models/Vehicle";
export default class CarProfile {
    public static toVehicleEntity(dto: CreateCarDTO | CreatePlaneDTO ): Partial<Vehicle> {
        return {
            type: 'hotel_id' in dto ? "carro" : "aeronave",
            brand: dto.brand,
            model: dto.model,
            capacity: dto.capacity,
            color: dto.color,
        };
    }
   
}
