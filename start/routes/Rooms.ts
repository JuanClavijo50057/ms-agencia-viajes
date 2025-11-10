import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.post("", "RoomsController.create");
    Route.get("/hotel/:hotelId", "RoomsController.findByHotel");
}).prefix("/rooms");