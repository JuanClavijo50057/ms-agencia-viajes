import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import NotFoundException from 'App/Exceptions/NotFoundException'
import Room from 'App/Models/Room'
import RoomValidator from 'App/Validators/RoomValidator'

export default class RoomsController {
    public async findAll({ response }: HttpContextContract) {
        const rooms = await Room.all()
        return response.ok(rooms)
    }

    public async findById({ params, response }: HttpContextContract) {
        if (!params.id) {
            throw new BadRequestException('Room ID is required')
        }
        const room = await Room.find(params.id)
        if (!room) {
            throw new NotFoundException('Room not found')
        }
        return response.ok(room)
    }

    public async findByHotel({ params, response }: HttpContextContract) {
        if (!params.hotelId) {
            throw new BadRequestException('Hotel ID is required')
        }
        const rooms = await Room.query().where('hotel_id', params.hotelId)
        return response.ok(rooms)
    }

    public async findAvailable({ response }: HttpContextContract) {
        const rooms = await Room.query().where('is_available', true)
        return response.ok(rooms)
    }

    public async create({ request, response }: HttpContextContract) {
        const body = await request.validate(RoomValidator)
        const room = await Room.create(body)
        return response.created(room)
    }

    public async update({ params, request, response }: HttpContextContract) {
        const body = request.body()
        if (!params.id) {
            throw new BadRequestException('Room ID is required')
        }
        const room = await Room.find(params.id)
        if (!room) {
            throw new NotFoundException('Room not found')
        }
        room.merge(body)
        await room.save()
        return response.ok({
            status: 'success',
            message: 'Room updated successfully',
            data: room,
        })
    }

    public async delete({ params, response }: HttpContextContract) {
        if (!params.id) {
            throw new BadRequestException('Room ID is required')
        }
        const room = await Room.find(params.id)
        if (!room) {
            throw new NotFoundException('Room not found')
        }
        await room.delete()
        return response.ok({
            status: 'success',
            message: 'Room deleted successfully',
        })
    }
}
