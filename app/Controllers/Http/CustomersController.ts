import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BadRequestException from "App/Exceptions/BadRequestException";
import Customer from "App/Models/Customer";
import CustomerValidator from "App/Validators/CustomerValidator";
import CustomerUpdateValidator from "App/Validators/CustomerUpdateValidator";
import SecurityService from "App/Services/SecurityService";

export default class CustomersController {
  public async findAll({ response }: HttpContextContract) {
    const customers = await Customer.all();

    const customersWithUserInfo = await Promise.allSettled(
      customers.map(async (customer) => {
        const userInfo = await SecurityService.getUserById(customer.user_id);
        return {
          ...customer.toJSON(),
          user: {
            name: userInfo.name,
            email: userInfo.email,
          },
        };
      })
    );

    const results = customersWithUserInfo.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value;
      } else {
        return {
          ...customers[index].toJSON(),
          user: null,
        };
      }
    });

    return response.ok(results);
  }

  public async findByIdWithUser({ params, response }: HttpContextContract) {
    if (!params.id) {
      throw new BadRequestException("Customer ID is required");
    }

    const customer = await Customer.findOrFail(params.id);
    const userInfo = await SecurityService.getUserById(customer.user_id);

    return response.ok({
      ...customer.toJSON(),
      user: userInfo,
    });
  }

  public async create({ request, response }: HttpContextContract) {
    const body = await request.validate(CustomerValidator);

    await SecurityService.validateUserExists(body.user_id);

    const customer = await Customer.create(body);
    return response.created(customer);
  }

  public async update({ params, request, response }: HttpContextContract) {
    if (!params.id) {
      throw new BadRequestException("Customer ID is required");
    }

    const customer = await Customer.findOrFail(params.id);
    const body = await request.validate(CustomerUpdateValidator);

    await SecurityService.validateUserExists(body.user_id);

    customer.merge(body);
    await customer.save();

    return response.ok({
      status: "success",
      message: "Customer updated successfully",
      data: customer,
    });
  }

  public async delete({ params, response }: HttpContextContract) {
    if (!params.id) {
      throw new BadRequestException("Customer ID required");
    }

    const customer = await Customer.findOrFail(params.id);
    await customer.delete();

    return response.ok({
      status: "success",
      message: "Customer deleted successfully",
    });
  }
}
