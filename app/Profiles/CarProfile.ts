

import { CreateCarDTO } from "App/DTOs/Car/createCarDTOs";
import Car from "App/Models/Car";
import Vehicle from "App/Models/Vehicle";
export default class CarProfile {
    public static toVehicleEntity(dto: CreateCarDTO): Partial<Vehicle> {
        return {
            type: "carro",
            brand: dto.brand,
            model: dto.model,
            capacity: dto.capacity,
            color: dto.color,
        };
    }
    public static toPlaneEntity(dto: CreateCarDTO, vehicleId: number): Partial<Car> {
        return {
            id: vehicleId,
            hotel_id: dto.hotel_id,
        }
    }
}
