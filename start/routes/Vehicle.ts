import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.post("", "VehiclesController.create");
    Route.patch("/:id", "VehiclesController.update");
    Route.delete("/:id", "VehiclesController.delete");
    Route.get("", "VehiclesController.findAll");
}).prefix("/vehicles");