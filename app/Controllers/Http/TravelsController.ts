import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Journey from 'App/Models/Journey';
import PlanTravel from 'App/Models/PlanTravel';
import RoomTransportItinerary from 'App/Models/RoomTransportItinerary';
import ServiceTransportation from 'App/Models/ServiceTransportation';
import TransportItinerary from 'App/Models/TransportItinerary';
import Travel from 'App/Models/Travel';
import TravelPackageValidator from 'App/Validators/TravelPackageValidator';
import TravelValidator from 'App/Validators/TravelValidator';
import { it } from 'node:test';

export default class TravelsController {
    public async findAll({ response }: HttpContextContract) {
        const travels = await Travel.all();
        return response.ok(travels)
    }

    public async create({ request, response }: HttpContextContract) {
        const body = await request.validate(TravelValidator);
        const travel = await Travel.create(body);
        return response.created(travel);
    }

    public async update({ params, request, response }: HttpContextContract) {
        const body = await request.validate(TravelValidator);
        if (!params.id) {
            throw new Error('Travel ID is required');
        }
        const travel = await Travel.find(params.id);
        if (!travel) {
            throw new Error('Travel not found');
        }
        travel.merge(body);
        await travel.save();
        return response.ok({
            status: 'success',
            message: 'Travel updated successfully',
            data: travel,
        });
    }

    public async delete({ params, response }: HttpContextContract) {
        if (!params.id) {
            throw new Error('Travel ID is required');
        }
        const travel = await Travel.find(params.id);
        if (!travel) {
            throw new Error('Travel not found');
        }
        await travel.delete();
        return response.ok({
            status: 'success',
            message: 'Travel deleted successfully',
        });
    }
    public async createPackageTravel({ request, response }: HttpContextContract) {
        const body = await request.validate(TravelPackageValidator);
        const trx = await Database.transaction()
        try {
            const travel = await Travel.create({
                name: `Viaje desde  ${body.items[0].cityFrom} hasta ${body.items[body.items.length - 1].cityTo}`,
                startDate: body.items[0].date_from,
                endDate: body.items[body.items.length - 1].date_to,
            },
                { client: trx });
            for (const item of body.items) {

                for (const planId of item.plan_ids) {
                    await PlanTravel.create({
                        travel_id: travel.id,
                        plan_id: planId,
                    }, { client: trx });
                }
                const journey = await Journey.create({
                    origin_id: item.cityFrom,
                    destination_id: item.cityTo,
                }, { client: trx });
                let serviceTransportation = await ServiceTransportation.create({
                    start_date: item.date_from,
                    journey_id: journey.id,
                    end_date: item.date_to,
                    cost: 3000,
                    transportation_id: item.vehicle,
                }, { client: trx });

                const itineraryTransport = await TransportItinerary.create({
                    journey_id: journey.id,
                    travel_id: travel.id,
                    sequence: item.order,
                    service_transportation_id: serviceTransportation.id,
                }, { client: trx });
                for (const roomId of item.room_ids) {
                    await RoomTransportItinerary.create({
                        room_id: roomId,
                        transport_itinerary_id: itineraryTransport.id,
                    }, { client: trx });
                }
                console.log(serviceTransportation);


            }
            await trx.commit()
            return response.created({
                status: 'success',
                message: 'Travel package created successfully',
                data: travel,
            });


        } catch (error) {
            await trx.rollback()
            return response.status(500).send({ error: 'Failed to create travel package', errorDetail: error.message });
        }
    }
    public async packageTravel({ response }: HttpContextContract) {
        const travels = await Travel.query()
            .preload('planTravels', (ptQuery) => {
                ptQuery.preload('plan', (planQuery) => {
                    planQuery.preload('planTouristActivities', (ptaQuery) => {
                        ptaQuery.preload('touristActivity', (taQuery) => {
                            taQuery.preload('city') // si tu actividad tiene ciudad asociada
                        })
                    })
                })
            })
            .preload('transportItineraries', (tiQuery) => {
                tiQuery
                    .preload('journey', (jQuery) => {
                        jQuery.preload('origin').preload('destination')
                    })
                    .preload('serviceTransportation', (stQuery) => {
                        stQuery.preload('vehicle')
                    })
                    .preload('roomTransportItineraries', (rtiQuery) => {
                        rtiQuery.preload('room')
                    })
            })

        const formatted = travels.map((travel) => ({
            id: travel.id,
            name: travel.name,
            description: travel.description,
            start_date: travel.startDate,
            end_date: travel.endDate,
            price: travel.price,
            plans: travel.planTravels.map((pt) => ({
                id: pt.plan.id,
                name: pt.plan.name,
                description: pt.plan.description,
                price: pt.plan.price,
                duration_days: pt.plan.duration_days,
                activities: pt.plan.planTouristActivities.map((pta) => ({
                    id: pta.touristActivity.id,
                    name: pta.touristActivity.name,
                    description: pta.touristActivity.description,
                    city: pta.touristActivity.city?.name || null,
                })),
            })),
            itineraries: travel.transportItineraries.map((it) => ({
                order: it.sequence,
                origin: it.journey.origin.name,
                destination: it.journey.destination.name,
                vehicle: {
                    brand: it.serviceTransportation.vehicle.brand,
                    type: it.serviceTransportation.vehicle.type,
                    model: it.serviceTransportation.vehicle.model,
                },
                rooms: it.roomTransportItineraries.map((rt) => ({
                    number: rt.room.room_number,
                    price_per_night: rt.room.price_per_night,
                })),
            })),
        }))

        return response.ok(formatted)
    }
}
