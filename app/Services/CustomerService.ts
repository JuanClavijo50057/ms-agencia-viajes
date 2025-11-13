import { CreateCustomerDTO } from "App/DTOs/Customer/createCustomerDTO";
import BaseUserService from "./BaseUserService";
import BaseUserProfile from "App/Profiles/BaseUserProfile";
import CustomerProfile from "App/Profiles/CustomerProfile";
import Customer from "App/Models/Customer";

export default class CustomerService extends BaseUserService {
  public static async createUser(
    data: CreateCustomerDTO
  ): Promise<CreateCustomerDTO> {
    const userData = BaseUserProfile.toUserEntity(data);

    await this.createWithUser(userData, async (user, trx) => {
      const customerData = CustomerProfile.toCustomerEntity(user.id);
      return await Customer.create(customerData, { client: trx });
    });

    // Retornar solo los campos definidos en el DTO
    return {
      name: data.name,
      email: data.email,
      phone: data.phone,
      identification_number: data.identification_number,
      document_type: data.document_type,
      birth_date: data.birth_date,
    };
  }

  public static async  
}
