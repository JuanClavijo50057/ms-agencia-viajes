import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { CreateAdministratorDTO } from "App/DTOs/Administrator/createAdministratorDTO";
import BadRequestException from "App/Exceptions/BadRequestException";
import NotFoundException from "App/Exceptions/NotFoundException";
import Administrator from "App/Models/Administrator";

import AdministratorService from "App/Services/AdministratorService";
import AdministratorValidator from "App/Validators/AdministratorValidator";
import AdministratorUpdateValidator from "App/Validators/AdministratorUpdateValidator";

export default class AdministratorsController {
  public async findAll({ response }: HttpContextContract) {
    const Administrators = await Administrator.query()
      .join("users", "users.id", "=", "administrators.user_id")
      .select(
        "administrators.id",
        "users.name",
        "users.email",
        "users.phone",
        "users.identification_number",
        "users.document_type",
        "users.birth_date",
        "administrators.hire_date",
        "administrators.active"
      )
      .pojo();
    return response.ok(Administrators);
  }

  public async create({ request, response }: HttpContextContract) {
    const body: CreateAdministratorDTO = await request.validate(
      AdministratorValidator
    );
    const administrator = await AdministratorService.createAdministrator(body);
    if (!administrator) {
      throw new Error("Error creating administrator");
    }
    return response.created(administrator);
  }

  public async update({ params, request, response }: HttpContextContract) {
    if (!params.id) {
      throw new BadRequestException("Administrator ID is required");
    }
    const administrator = await Administrator.query()
      .where("id", params.id)
      .preload("user")
      .firstOrFail();

    if (!administrator) {
      throw new NotFoundException("Administrator not found");
    }

    request.updateQs({ user_id: administrator.user_id });
    const body: CreateAdministratorDTO = await request.validate(
      AdministratorUpdateValidator
    );

    const updateAdministrator = await AdministratorService.updateAdministrator(
      administrator,
      body
    );
    return response.ok({
      status: "success",
      message: "Administrator updated successfully",
      data: updateAdministrator,
    });
  }

  public async delete({ params, response }: HttpContextContract) {
    if (!params.id) {
      throw new BadRequestException("Administrator ID required");
    }
    const administrator = await Administrator.find(params.id);
    if (!administrator) {
      throw new NotFoundException("Administrator not found");
    }
    await administrator.delete();
    return response.ok({
      status: "success",
      message: "Administrator deleted successfully",
    });
  }
}
