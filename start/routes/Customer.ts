import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.get("/", "CustomersController.findAll");
    Route.post("/", "CustomersController.create");
    Route.patch("/:id", "CustomersController.update");
    Route.delete("/:id", "CustomersController.delete");
}).prefix("/customer");