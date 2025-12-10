import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.get("/", "TravelsController.findAll");
    Route.post("/", "TravelsController.create");
    Route.put("/:id", "TravelsController.update");
    Route.delete("/:id", "TravelsController.delete");
    Route.post("/package", "TravelsController.createPackageTravel");
    Route.post("/travel-package", "TravelsController.packageTravel");
    Route.get("/stats/monthly", "TravelsController.getTravelStatsByMonth");
    Route.get("/stats/type-distribution", "TravelsController.getVehicleUsageStats");
    Route.get("/stats/destination-distribution", "TravelsController.getTravelsByMunicipality");
}).prefix("/travel")