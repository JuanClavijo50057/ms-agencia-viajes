import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.post("/charge", "CitiesController.chargeCities");
    Route.get("/find/:idDepartment", "CitiesController.find");
    Route.get("/hotel-available/:idDepartment", "CitiesController.findByHotelAvailable");
}).prefix("/cities");