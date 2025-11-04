import { CreateAdministratorDTO } from "App/DTOs/Administrator/createAdministratorDTO";
import Administrator from "App/Models/Administrator";

export default class AdministratorProfile {
    public static toAdministratorEntity(dto: CreateAdministratorDTO, userId: number): Partial<Administrator> {
        return {
            id: userId,
            active: dto.active,
            hire_date: dto.hire_date,
        }
    }
}