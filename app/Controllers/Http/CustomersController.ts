import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { CreateCustomerDTO } from "App/DTOs/Customer/createCustomerDTO";
import BadRequestException from "App/Exceptions/BadRequestException";
import NotFoundException from "App/Exceptions/NotFoundException";
import Customer from "App/Models/Customer";
import CustomerService from "App/Services/CustomerService";
import CustomerValidator from "App/Validators/CustomerValidator";
import CustomerUpdateValidator from "App/Validators/CustomerUpdateValidator";

export default class CustomersController {
  public async findAll({ response }: HttpContextContract) {
    const customers = await Customer.query()
      .join("users", "users.id", "=", "customers.user_id")
      .select(
        "customers.id",
        "users.name",
        "users.email",
        "users.phone",
        "users.identification_number",
        "users.document_type",
        "users.birth_date"
      )
      .pojo();

    return response.ok(customers);
  }

  public async create({ request, response }: HttpContextContract) {
    const body: CreateCustomerDTO = await request.validate(CustomerValidator);
    const customer = await CustomerService.createCustomer(body);
    return response.created(customer);
  }

  public async update({ params, request, response }: HttpContextContract) {
    if (!params.id) {
      throw new BadRequestException("Customer ID is required");
    }
    const customer = await Customer.query()
      .where("id", params.id)
      .preload("user")
      .firstOrFail();

    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    request.updateQs({ user_id: customer.user_id });

    const body: CreateCustomerDTO = await request.validate(
      CustomerUpdateValidator
    );

    const updateCustomer = await CustomerService.updateCustomer(customer, body);
    return response.ok({
      status: "success",
      message: "Customer updated successfully",
      data: updateCustomer,
    });
  }

  public async delete({ params, response }: HttpContextContract) {
    if (!params.id) {
      throw new BadRequestException("Customer ID required");
    }
    const customer = await Customer.find(params.id);
    if (!customer) {
      throw new NotFoundException("Customer not found");
    }
    await customer.delete();
    return response.ok({
      status: "success",
      message: "Customer deleted successfully",
    });
  }
}
