import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.post("", "CarsController.create");
    Route.patch("/:id", "CarsController.update");
    Route.delete("/:id", "CarsController.delete");
    Route.get("", "CarsController.findAll");
}).prefix("/cars");