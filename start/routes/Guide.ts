import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/', 'GuidesController.findAll')
    Route.get('/:id', 'GuidesController.findByIdWithUser')
    Route.post('/', 'GuidesController.create')
    Route.patch('/:id', 'GuidesController.update')
    Route.delete('/:id', 'GuidesController.delete')
}).prefix('/guides')
