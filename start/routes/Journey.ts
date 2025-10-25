import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.post("", "JourneysController.create");
    Route.patch("/:id", "JourneysController.update");
    Route.delete("/:id", "JourneysController.delete");
    Route.get("", "JourneysController.findAll");
}).prefix("/journeys");