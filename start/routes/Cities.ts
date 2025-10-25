import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.post("/charge", "CitiesController.chargeCities");
    Route.get("/find", "CitiesController.find");
}).prefix("/cities");