import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/', 'PlanTouristActivitiesController.findAll')
    Route.get('/plan/:planId', 'PlanTouristActivitiesController.findByPlan')
    Route.get('/activity/:activityId', 'PlanTouristActivitiesController.findByActivity')
    Route.get('/:id', 'PlanTouristActivitiesController.findById')
    Route.post('/', 'PlanTouristActivitiesController.create')
    Route.put('/:id', 'PlanTouristActivitiesController.update')
    Route.delete('/:id', 'PlanTouristActivitiesController.delete')
    Route.get('/city/:cityId', 'PlanTouristActivitiesController.finPlansByCity')
    Route.post('/create-with-activities', 'PlanTouristActivitiesController.createPlanWhitActivities')
}).prefix('/plan-tourist-activities')
