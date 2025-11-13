

import { CreateCarDTO } from "App/DTOs/Car/createCarDTOs";
import Car from "App/Models/Car";
export default class CarProfile {

    public static toCarEntity(dto: CreateCarDTO, vehicleId: number): Partial<Car> {
        return {
            id: vehicleId,
            license_plate: dto.license_plate,
            hotel_id: dto.hotel_id,
        }
    }
}
