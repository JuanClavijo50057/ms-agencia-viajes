import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/', 'HotelsController.findAll')
    Route.get('/city/:cityId', 'HotelsController.findByCity')
    Route.get('/stars/:stars', 'HotelsController.findByStars')
    Route.post('/', 'HotelsController.create')
    Route.put('/:id', 'HotelsController.update')
    Route.delete('/:id', 'HotelsController.delete')
}).prefix('/hotels')
