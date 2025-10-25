import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.post("", "AirlinesController.create");
    Route.get("/:id", "AirlinesController.find");
    Route.get("", "AirlinesController.find");
    Route.patch("/:id", "AirlinesController.update");
    Route.delete("/:id", "AirlinesController.delete");
}).prefix("/airlines");