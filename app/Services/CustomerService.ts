import { CreateCustomerDTO } from "App/DTOs/Customer/createCustomerDTO";
import BaseUserService from "./BaseUserService";
import BaseUserProfile from "App/Profiles/BaseUserProfile";
import CustomerProfile from "App/Profiles/CustomerProfile";
import Customer from "App/Models/Customer";

export default class CustomerService extends BaseUserService {
    public static async createUser (data: CreateCustomerDTO) {
        const userData = BaseUserProfile.toUserEntity(data);

        return this.createWithUser(userData, async (user, trx) => {
            const customerData = CustomerProfile.toCustomerEntity(user.id);
            console.log(customerData)
            return await Customer.create(customerData, { client: trx });
        });
    }
}