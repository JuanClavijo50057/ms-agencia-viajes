import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.get("/", "DriversController.findAll");
    Route.post("/", "DriversController.create");
}).prefix("/drivers");