import Customer from "App/Models/Customer";

export default class CustomerProfile {
    public static toCustomerEntity(userId: number): Partial<Customer> {
        return {
            id: userId,
        }
    }
}