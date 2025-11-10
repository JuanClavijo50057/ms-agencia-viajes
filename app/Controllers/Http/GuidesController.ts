import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CreateGuideDTO } from 'App/DTOs/Guide/createGuideDTO';
import BadRequestException from 'App/Exceptions/BadRequestException';
import NotFoundException from 'App/Exceptions/NotFoundException';

import User from "App/Models/User";
import GuideService from 'App/Services/GuideService';
import GuideValidator from 'App/Validators/GuideValidator';

export default class GuidesController {
    public async findAll({ response }: HttpContextContract) {
        const guides = await User.all();
        return response.ok(guides)
    }

    public async create({ request, response }: HttpContextContract) {
        const body: CreateGuideDTO = await request.validate(GuideValidator);
        const guide = await GuideService.createGuide(body);
        if (!guide) {
            throw new Error('Error creating guide');
        }
        return response.created(guide);
    }

    public async update({ params, request, response }: HttpContextContract) {
        const body = request.body();
        if (!params.id) {
            throw new BadRequestException('Guide ID is required');
        }
        const guide = await User.find(params.id);
        if (!guide) {
            throw new NotFoundException('Guide not found');
        }
        guide.merge(body);
        await guide.save();
        return response.ok({
            status: 'success',
            message: 'Guide updated successfully',
            data: guide,
        });
    }

    public async delete({ params, response }: HttpContextContract) {
        if (!params.id) {
            throw new BadRequestException('Guide ID required')
        }
        const guide = await User.find(params.id);
        if (!guide) {
            throw new NotFoundException('Guide not found');
        };
        await guide.delete();
        return response.ok({
            status: 'success',
            message: 'Guide deleted successfully',
        });
    }
}
