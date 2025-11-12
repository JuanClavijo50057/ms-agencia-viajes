import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/', 'TouristActivitiesController.findAll')
    Route.get('/city/:cityId', 'TouristActivitiesController.findByCity')
    Route.get('/active', 'TouristActivitiesController.findActive')
    Route.get('/:id', 'TouristActivitiesController.findById')
    Route.post('/', 'TouristActivitiesController.create')
    Route.put('/:id', 'TouristActivitiesController.update')
    Route.delete('/:id', 'TouristActivitiesController.delete')
}).prefix('/tourist-activities')
