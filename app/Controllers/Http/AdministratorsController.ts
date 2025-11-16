import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BadRequestException from "App/Exceptions/BadRequestException";
import NotFoundException from "App/Exceptions/NotFoundException";
import Administrator from "App/Models/Administrator";
import AdministratorValidator from "App/Validators/AdministratorValidator";
import AdministratorUpdateValidator from "App/Validators/AdministratorUpdateValidator";
import SecurityService from "App/Services/SecurityService";

export default class AdministratorsController {
  public async findAll({ response }: HttpContextContract) {
    const administrators = await Administrator.all();
    return response.ok(administrators);
  }

  public async findByIdWithUser({ params, response }: HttpContextContract) {
    if (!params.id) {
      throw new BadRequestException("Administrator ID is required");
    }

    const administrator = await Administrator.findOrFail(params.id);
    const userInfo = await SecurityService.getUserById(administrator.user_id);

    return response.ok({
      ...administrator.toJSON(),
      user: userInfo,
    });
  }

  public async create({ request, response }: HttpContextContract) {
    const body = await request.validate(AdministratorValidator);

    await SecurityService.validateUserExists(body.user_id);

    const administrator = await Administrator.create(body);
    return response.created(administrator);
  }

  public async update({ params, request, response }: HttpContextContract) {
    if (!params.id) {
      throw new BadRequestException("Administrator ID is required");
    }

    const administrator = await Administrator.findOrFail(params.id);
    const body = await request.validate(AdministratorUpdateValidator);

    await SecurityService.validateUserExists(body.user_id);

    administrator.merge(body);
    await administrator.save();

    return response.ok({
      status: "success",
      message: "Administrator updated successfully",
      data: administrator,
    });
  }

  public async delete({ params, response }: HttpContextContract) {
    if (!params.id) {
      throw new BadRequestException("Administrator ID required");
    }

    const administrator = await Administrator.findOrFail(params.id);
    await administrator.delete();

    return response.ok({
      status: "success",
      message: "Administrator deleted successfully",
    });
  }
}
