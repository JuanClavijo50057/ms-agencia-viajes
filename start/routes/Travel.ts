import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.get("/", "TravelsController.findAll");
    Route.post("/", "TravelsController.create");
    Route.put("/:id", "TravelsController.update");
    Route.delete("/:id", "TravelsController.delete");
    Route.post("/package", "TravelsController.createPackageTravel");
    Route.get("/package/:userId?", "TravelsController.packageTravel");
}).prefix("/travel")