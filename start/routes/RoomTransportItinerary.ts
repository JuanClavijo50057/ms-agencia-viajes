import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/', 'RoomTransportItinerariesController.findAll')
    Route.get('/room/:roomId', 'RoomTransportItinerariesController.findByRoom')
    Route.get('/transport-itinerary/:transportItineraryId', 'RoomTransportItinerariesController.findByTransportItinerary')
    Route.post('/', 'RoomTransportItinerariesController.create')
    Route.put('/:id', 'RoomTransportItinerariesController.update')
    Route.delete('/:id', 'RoomTransportItinerariesController.delete')
}).prefix('/room-transport-itineraries')
