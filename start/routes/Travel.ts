import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.get("/", "TravelsController.findAll");
    Route.post("/", "TravelsController.create");
    Route.patch("/:id", "TravelsController.update");
    Route.delete("/:id", "TravelsController.delete");
}).prefix("/travel")