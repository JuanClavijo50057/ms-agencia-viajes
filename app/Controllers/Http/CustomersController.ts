import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BadRequestException from "App/Exceptions/BadRequestException";
import Customer from "App/Models/Customer";
import CustomerValidator from "App/Validators/CustomerValidator";
import CustomerUpdateValidator from "App/Validators/CustomerUpdateValidator";
import SecurityService from "App/Services/SecurityService";

export default class CustomersController {
  public async findAll({ response, request }: HttpContextContract) {
    const customers = await Customer.all();

    const authHeader = request.header("authorization");

    if (!authHeader) {
      return response.unauthorized({ message: "Token no enviado" });
    }
    SecurityService.token = authHeader;
    const customersWithUserInfo = await Promise.allSettled(
      customers.map(async (customer) => {
        const userInfo = await SecurityService.getUserById(customer.user_id);
        return {
          ...customer.toJSON(),

          name: userInfo.name,
          email: userInfo.email,
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
    try {
      // Obtener el token de autorización
      const authHeader = request.header("authorization");
      if (!authHeader) {
        return response.unauthorized({
          status: "error",
          message: "Token de autorización no enviado",
        });
      }

      // Configurar el token en el servicio de seguridad
      SecurityService.token = authHeader;

      const body = await request.validate(CustomerValidator);
      const customer = await Customer.create(body);
      return response.created({
        status: "success",
        message: "Customer created successfully",
        data: customer,
      });
    } catch (error) {
      console.error("Error creating customer:", error);

      // Si es un error de validación
      if (error.messages) {
        return response.status(422).send({
          status: "error",
          message: "Validation failed",
          errors: error.messages,
        });
      }

      // Si es otro tipo de error
      return response.status(400).send({
        status: "error",
        message: error.message || "Error creating customer",
      });
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    if (!params.id) {
      throw new BadRequestException("Customer ID is required");
    }

    const customer = await Customer.findOrFail(params.id);
    const body = await request.validate(CustomerUpdateValidator);

    await SecurityService.validateUserExists(params.id);

    await SecurityService.updateUser(customer.user_id, {
      name: body.name ? body.name : undefined,
      email: body.email ? body.email : undefined,
    });
    return response.ok({
      status: "success",
      message: "Customer updated successfully",
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

  public async allUsersWithoutCustomers({
    response,
    request,
  }: HttpContextContract) {
    try {
      console.log("Fetching users without customers");
      const authHeader = request.header("authorization");
      if (!authHeader) {
        return response.unauthorized({ message: "Token no enviado" });
      }

      SecurityService.token = authHeader;

      const customers = await Customer.all();
      const customerUserIds = customers.map((c) => c.user_id);

      const allUsers = await SecurityService.getAllUsers();
      console.log(allUsers);
      const usersWithoutCustomers = allUsers.filter(
        (user) => !customerUserIds.includes(user._id)
      );

      return response.ok(usersWithoutCustomers);
    } catch (error) {
      response.status(500).send({ message: error });
    }
  }
}
