import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.post("", "PlanesController.create");
    Route.get("/find/:idAirline", "PlanesController.findPlanesByAirline");
    Route.patch("/:id", "PlanesController.update");
    Route.delete("/:id", "PlanesController.delete");
    Route.get("", "PlanesController.findAll");
}).prefix("/planes");