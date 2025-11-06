import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.get("/", "TransportItinerariesController.findAll");
    Route.post("/", "TransportItinerariesController.create");
    Route.patch("/:id", "TransportItinerariesController.update");
    Route.delete("/:id", "TransportItinerariesController.delete");
}).prefix("/transport-itinerary");