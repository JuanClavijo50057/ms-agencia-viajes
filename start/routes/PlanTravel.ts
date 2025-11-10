import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/', 'PlanTravelsController.findAll')
    Route.get('/plan/:planId', 'PlanTravelsController.findByPlan')
    Route.get('/travel/:travelId', 'PlanTravelsController.findByTravel')
    Route.post('/', 'PlanTravelsController.create')
    Route.put('/:id', 'PlanTravelsController.update')
    Route.delete('/:id', 'PlanTravelsController.delete')
}).prefix('/plan-travels')
