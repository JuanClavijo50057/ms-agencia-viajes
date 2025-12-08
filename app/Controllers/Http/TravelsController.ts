import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Customer from 'App/Models/Customer';
import Journey from 'App/Models/Journey';
import PlanTravel from 'App/Models/PlanTravel';
import RoomTransportItinerary from 'App/Models/RoomTransportItinerary';
import ServiceTransportation from 'App/Models/ServiceTransportation';
import TransportItinerary from 'App/Models/TransportItinerary';
import Travel from 'App/Models/Travel';
import TravelCustomer from 'App/Models/TravelCustomer';
import SecurityService from 'App/Services/SecurityService';
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
            }, { client: trx });

            let customer = await Customer.query({ client: trx })
                .where('user_id', body.user_id)
                .first()

            if (!customer) {
               customer = await Customer.create({
                    user_id: body.user_id,
                }, { client: trx });
            }

            await TravelCustomer.create({
                travel_id: travel.id,
                customer_id: customer.id,
                status: 'draft',
            }, { client: trx })

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
            }
            await RoomTransportItinerary.updateTravelPrice({ travel_id: travel.id } as any, trx)
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
    public async packageTravel({ params, response }: HttpContextContract) {
        const { userId } = params
        console.log("userID",userId);
        
        // 🔹 Base query
        const travelsQuery = Travel.query()
            .preload('planTravels', (ptQuery) => {
                ptQuery.preload('plan', (planQuery) => {
                    planQuery.preload('planTouristActivities', (ptaQuery) => {
                        ptaQuery.preload('touristActivity', (taQuery) => taQuery.preload('city'))
                    })
                })
            })
            .preload('transportItineraries', (tiQuery) => {
                tiQuery
                    .preload('journey', (jQuery) => jQuery.preload('origin').preload('destination'))
                    .preload('serviceTransportation', (stQuery) => stQuery.preload('vehicle'))
                    .preload('roomTransportItineraries', (rtiQuery) => rtiQuery.preload('room'))
            })

        // 🔹 Si viene userId → filtramos por ese usuario y cargamos clientes
        if (userId) {
            travelsQuery
                .whereHas('travelCustomers', (tcQuery) => {
                    tcQuery.whereHas('customer', (cQuery) => {
                        cQuery.where('user_id', userId)
                    })
                })
                .preload('travelCustomers', (tcQuery) => {
                    tcQuery.preload('customer')
                })
        }

        const travels = await travelsQuery

        // 🔹 Si hay userId, obtenemos información desde el MS de seguridad
        let userInfos: any[] = []
        if (userId) {
            const userIds = travels
                .flatMap(t => t.travelCustomers.map(tc => tc.customer.user_id))
                .filter((id, index, arr) => arr.indexOf(id) === index)

            userInfos = await Promise.all(
                userIds.map(async (uid) => {
                    try {
                        const user = await SecurityService.getUserById(uid)
                        return { user_id: uid, name: user.name, email: user.email }
                    } catch {
                        return null
                    }
                })
            )
            
        }

        // 🔹 Formatear salida
        const formatted = travels.map((travel) => {
            const peopleCount = travel.travelCustomers?.length || 1
            const adjustedPrice = userId ? travel.price * peopleCount : travel.price

            const baseData = {
                id: travel.id,
                name: travel.name,
                description: travel.description,
                start_date: travel.startDate,
                end_date: travel.endDate,
                price: adjustedPrice,
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
            }

            if (userId) {
                return {
                    ...baseData,
                    customers: userInfos.filter((u) => u !== null),
                    state: travel.travelCustomers.filter(tc => tc.status!=null).map(tc => tc.status)[0] || 'draft',
                }
            }

            return baseData
        })

        return response.ok(formatted)
    }
    public async getTravelStatsByMonth({ response }: HttpContextContract) {
        try {
            const stats = await Database
                .from('travels')
                .select(
                    Database.raw("EXTRACT(MONTH FROM start_date) AS month"),
                    Database.raw("COUNT(*) AS total_travels")
                )
                .groupBy('month')
                .orderBy('month', 'asc')

            const allMonths = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ]

            const result = allMonths.map((name, index) => {
                const found = stats.find((s) => Number(s.month) === index + 1)
                return {
                    month: name,
                    total_travels: found ? Number(found.total_travels) : 0,
                }
            })

            return response.ok({
                status: 'success',
                data: result,
            })
        } catch (error) {
            console.error(error)
            return response.status(500).send({
                status: 'error',
                message: 'Error al obtener los viajes por mes',
                error: error.message,
            })
        }
    }
    public async getVehicleUsageStats({ response }: HttpContextContract) {
        const stats = await Database
            .from('service_transportations as st')
            .join('vehicles as v', 'v.id', 'st.transportation_id')
            .select('v.type')
            .count('* as total')
            .groupBy('v.type')

        const totalCount = stats.reduce((acc, s) => acc + Number(s.total), 0)

        const percentages: Record<string, number> = {}
        stats.forEach((s) => {
            const type = s.type.toLowerCase()
            percentages[type] = Number(((Number(s.total) / totalCount) * 100).toFixed(2))
        })

        const result = [
            { type: 'carro', value: percentages['carro'] || 0 },
            { type: 'avion', value: percentages['avion'] || 0 }
        ]

        return response.ok({
            status: 'success',
            data: result,
        })

    }
    public async getTravelsByMunicipality({ response }: HttpContextContract) {
        try {
            // 🔹 Consulta: contar viajes agrupados por ciudad destino
            const stats = await Database
                .from('travels as tr')
                .join('transport_itineraries as ti', 'ti.travel_id', 'tr.id')
                .join('journeys as jo', 'jo.id', 'ti.journey_id')
                .join('cities as c', 'c.id', 'jo.destination_id')
                .select('c.name as municipio')
                .countDistinct('tr.id as quantity')
                .groupBy('c.name')
                .orderBy('quantity', 'desc')

            // 🔹 Formato final: lista [{ municipio: 'Bogotá', quantity: 8 }, ...]
            const result = stats.map((row) => ({
                municipio: row.municipio,
                quantity: Number(row.quantity),
            }))

            return response.ok({
                status: 'success',
                data: result,
            })
        } catch (error) {
            console.error(error)
            return response.status(500).send({
                status: 'error',
                message: 'Error al obtener los viajes por municipio destino',
                error: error.message,
            })
        }
    }

}
