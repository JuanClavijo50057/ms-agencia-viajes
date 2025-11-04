import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.get("/", "QuotasController.findAll");
    Route.post("/", "QuotasController.create");
    Route.patch("/:id", "QuotasController.update");
    Route.delete("/:id", "QuotasController.delete");
}).prefix("/quota");