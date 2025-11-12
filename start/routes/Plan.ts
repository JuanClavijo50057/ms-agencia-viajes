import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/', 'PlansController.findAll')
    Route.get('/active', 'PlansController.findActive')
    Route.get('/duration/:days', 'PlansController.findByDuration')
    Route.get('/price-range', 'PlansController.findByPriceRange')
    Route.get('/:id', 'PlansController.findById')
    Route.post('/', 'PlansController.create')
    Route.put('/:id', 'PlansController.update')
    Route.delete('/:id', 'PlansController.delete')
}).prefix('/plans')
