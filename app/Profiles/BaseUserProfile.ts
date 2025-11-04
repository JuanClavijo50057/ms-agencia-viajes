import { CreateAdministratorDTO } from "App/DTOs/Administrator/createAdministratorDTO";
import { CreateCustomerDTO } from "App/DTOs/Customer/createCustomerDTO";
import User from "App/Models/User";

export default class BaseUserProfile {
    public static toUserEntity(dto: CreateAdministratorDTO | CreateCustomerDTO): Partial<User> {
        return {
            name: dto.name,
            email: dto.email,
            phone: dto.phone,
            identification_number: dto.identification_number,
            document_type: dto.document_type,
            birth_date: dto.birth_date
        };
    }
}