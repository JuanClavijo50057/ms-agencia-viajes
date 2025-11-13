import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { CreateGuideDTO } from "App/DTOs/Guide/createGuideDTO";
import BadRequestException from "App/Exceptions/BadRequestException";
import NotFoundException from "App/Exceptions/NotFoundException";
import Guide from "App/Models/Guide";

import GuideService from "App/Services/GuideService";
import GuideUpdateValidator from "App/Validators/GuideUpdateValidator";
import GuideValidator from "App/Validators/GuideValidator";

export default class GuidesController {
  public async findAll({ response }: HttpContextContract) {
    const guides = await Guide.all();
    return response.ok(guides);
  }

  public async create({ request, response }: HttpContextContract) {
    const body: CreateGuideDTO = await request.validate(GuideValidator);
    const guide = await GuideService.createGuide(body);
    if (!guide) {
      throw new Error("Error creating guide");
    }
    return response.created(guide);
  }

  public async update({ params, request, response }: HttpContextContract) {
    if (!params.id) {
      throw new BadRequestException("Guide ID is required");
    }

    const guide = await Guide.query()
      .where("id", params.id)
      .preload("user")
      .firstOrFail();

    if (!guide) {
      throw new NotFoundException("Guide not found");
    }

    request.updateQs({ user_id: guide.user_id });

    const body: CreateGuideDTO = await request.validate(GuideUpdateValidator);
    const updateGuide = await GuideService.updateGuide(guide, body);

    return response.ok({
      status: "success",
      message: "Guide updated successfully",
      data: updateGuide,
    });
  }

  public async delete({ params, response }: HttpContextContract) {
    if (!params.id) {
      throw new BadRequestException("Guide ID required");
    }
    const guide = await Guide.find(params.id);
    if (!guide) {
      throw new NotFoundException("Guide not found");
    }
    await guide.delete();
    return response.ok({
      status: "success",
      message: "Guide deleted successfully",
    });
  }
}
