import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.get("/", "CustomersController.findAll");
    Route.get("/:id", "CustomersController.findByIdWithUser");
    Route.post("/", "CustomersController.create");
    Route.patch("/:id", "CustomersController.update");
    Route.delete("/:id", "CustomersController.delete");
}).prefix("/customer");