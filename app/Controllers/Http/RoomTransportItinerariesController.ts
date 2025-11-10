import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import NotFoundException from 'App/Exceptions/NotFoundException'
import RoomTransportItinerary from 'App/Models/RoomTransportItinerary'
import RoomTransportItineraryValidator from 'App/Validators/RoomTransportItineraryValidator'

export default class RoomTransportItinerariesController {
    public async findAll({ response }: HttpContextContract) {
        const roomTransportItineraries = await RoomTransportItinerary.all()
        return response.ok(roomTransportItineraries)
    }

    public async findByRoom({ params, response }: HttpContextContract) {
        if (!params.roomId) {
            throw new BadRequestException('Room ID is required')
        }
        const roomTransportItineraries = await RoomTransportItinerary.query().where('room_id', params.roomId)
        return response.ok(roomTransportItineraries)
    }

    public async findByTransportItinerary({ params, response }: HttpContextContract) {
        if (!params.transportItineraryId) {
            throw new BadRequestException('Transport Itinerary ID is required')
        }
        const roomTransportItineraries = await RoomTransportItinerary.query().where('transport_itinerary_id', params.transportItineraryId)
        return response.ok(roomTransportItineraries)
    }

    public async create({ request, response }: HttpContextContract) {
        const body = await request.validate(RoomTransportItineraryValidator)
        const roomTransportItinerary = await RoomTransportItinerary.create(body)
        return response.created(roomTransportItinerary)
    }

    public async update({ params, request, response }: HttpContextContract) {
        const body = request.body()
        if (!params.id) {
            throw new BadRequestException('RoomTransportItinerary ID is required')
        }
        const roomTransportItinerary = await RoomTransportItinerary.find(params.id)
        if (!roomTransportItinerary) {
            throw new NotFoundException('RoomTransportItinerary not found')
        }
        roomTransportItinerary.merge(body)
        await roomTransportItinerary.save()
        return response.ok({
            status: 'success',
            message: 'RoomTransportItinerary updated successfully',
            data: roomTransportItinerary,
        })
    }

    public async delete({ params, response }: HttpContextContract) {
        if (!params.id) {
            throw new BadRequestException('RoomTransportItinerary ID is required')
        }
        const roomTransportItinerary = await RoomTransportItinerary.find(params.id)
        if (!roomTransportItinerary) {
            throw new NotFoundException('RoomTransportItinerary not found')
        }
        await roomTransportItinerary.delete()
        return response.ok({
            status: 'success',
            message: 'RoomTransportItinerary deleted successfully',
        })
    }
}
