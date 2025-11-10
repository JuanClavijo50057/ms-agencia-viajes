import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/', 'GuideActivitiesController.findAll')
    Route.get('/guide/:guideId', 'GuideActivitiesController.findByGuide')
    Route.get('/activity/:activityId', 'GuideActivitiesController.findByActivity')
    Route.post('/', 'GuideActivitiesController.create')
    Route.put('/:id', 'GuideActivitiesController.update')
    Route.delete('/:id', 'GuideActivitiesController.delete')
}).prefix('/guide-activities')
