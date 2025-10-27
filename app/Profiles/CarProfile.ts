

import { CreateCarDTO } from "App/DTOs/Car/createCarDTOs";
import Car from "App/Models/Car";
export default class CarProfile {

    public static toCarEntity(dto: CreateCarDTO, vehicleId: number): Partial<Car> {
        return {
            id: vehicleId,
            hotel_id: dto.hotel_id,
        }
    }
}
