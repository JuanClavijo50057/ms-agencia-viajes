import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // Get all service transportations
  Route.get('/', 'ServiceTransportationsController.findAll')
  
  // Create a new service transportation
  Route.post('/', 'ServiceTransportationsController.create')
  
  // Update a service transportation
  Route.put('/:id', 'ServiceTransportationsController.update')
  
  // Delete a service transportation
  Route.delete('/:id', 'ServiceTransportationsController.delete')
  
}).prefix('/service-transportation')