import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.get("/", "UsersController.findAll");
    Route.post("/", "UsersController.create");
    Route.patch("/:id", "UsersController.update");
    Route.delete("/:id", "UsersController.delete");
}).prefix("/user")