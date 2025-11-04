import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.get("/", "BillsController.findAll");
    Route.post("/", "BillsController.create");
    Route.patch("/:id", "BillsController.update");
    Route.delete("/:id", "BillsController.delete");
}).prefix("/bill");