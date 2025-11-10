import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.get("/:idCity", "HotelsController.getHotelsByCity");
    Route.post("/", "HotelsController.create");
}).prefix("/hotels");