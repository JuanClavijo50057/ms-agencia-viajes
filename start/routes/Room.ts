import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/', 'RoomsController.findAll')
    Route.get('/hotel/:hotelId', 'RoomsController.findByHotel')
    Route.get('/available', 'RoomsController.findAvailable')
    Route.get('/:id', 'RoomsController.findById')
    Route.post('/', 'RoomsController.create')
    Route.put('/:id', 'RoomsController.update')
    Route.delete('/:id', 'RoomsController.delete')
}).prefix('/rooms')
