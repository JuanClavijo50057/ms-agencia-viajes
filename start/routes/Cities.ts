import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.get("/charge", "CitiesController.chargeCities");
}).prefix("/cities");