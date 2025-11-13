import { CreateCustomerDTO } from "App/DTOs/Customer/createCustomerDTO";
import BaseUserService from "./BaseUserService";
import BaseUserProfile from "App/Profiles/BaseUserProfile";
import CustomerProfile from "App/Profiles/CustomerProfile";
import Customer from "App/Models/Customer";

export default class CustomerService extends BaseUserService {
  public static async createCustomer(data: CreateCustomerDTO) {
    const userData = BaseUserProfile.toUserEntity(data);

    return this.createWithUser(userData, async (user, trx) => {
      const customerData = CustomerProfile.toCustomerEntity(user.id);
      return await Customer.create(customerData, { client: trx });
    });
  }

  public static async updateCustomer(customer: Customer, updateCustomer: CreateCustomerDTO) {
    const userData = BaseUserProfile.toUserEntity(updateCustomer);

    return this.updateWithUser(customer.user_id, userData, async (user, trx) => {
      const customerRecord = await Customer.query({ client: trx })
        .where('user_id', customer.user_id)
        .firstOrFail();

      const customerData = CustomerProfile.toCustomerEntity(user.id);

      customerRecord.merge(customerData);
      await customerRecord.useTransaction(trx).save();

      return customerRecord;
    });
  }
}
