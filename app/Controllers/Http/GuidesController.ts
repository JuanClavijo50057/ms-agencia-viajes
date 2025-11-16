import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BadRequestException from "App/Exceptions/BadRequestException";
import Guide from "App/Models/Guide";
import GuideUpdateValidator from "App/Validators/GuideUpdateValidator";
import GuideValidator from "App/Validators/GuideValidator";
import SecurityService from "App/Services/SecurityService";

export default class GuidesController {
  public async findAll({ response }: HttpContextContract) {
    const guides = await Guide.all();
    return response.ok(guides);
  }

  public async findByIdWithUser({ params, response }: HttpContextContract) {
    if (!params.id) {
      throw new BadRequestException("Guide ID is required");
    }

    const guide = await Guide.findOrFail(params.id);
    const userInfo = await SecurityService.getUserById(guide.user_id);

    return response.ok({
      ...guide.toJSON(),
      user: userInfo,
    });
  }

  public async create({ request, response }: HttpContextContract) {
    const body = await request.validate(GuideValidator);

    await SecurityService.validateUserExists(body.user_id);

    const guide = await Guide.create(body);
    return response.created(guide);
  }

  public async update({ params, request, response }: HttpContextContract) {
    if (!params.id) {
      throw new BadRequestException("Guide ID is required");
    }

    const guide = await Guide.findOrFail(params.id);
    const body = await request.validate(GuideUpdateValidator);

    await SecurityService.validateUserExists(body.user_id);

    guide.merge(body);
    await guide.save();

    return response.ok({
      status: "success",
      message: "Guide updated successfully",
      data: guide,
    });
  }

  public async delete({ params, response }: HttpContextContract) {
    if (!params.id) {
      throw new BadRequestException("Guide ID required");
    }

    const guide = await Guide.findOrFail(params.id);
    await guide.delete();

    return response.ok({
      status: "success",
      message: "Guide deleted successfully",
    });
  }
}
