import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.get("/", "ShiftsController.getAll");
    Route.post("/", "ShiftsController.create");
}).prefix("/shifts");