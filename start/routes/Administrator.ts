import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.get("/", "AdministratorsController.findAll");
    Route.get("/:id", "AdministratorsController.findByIdWithUser");
    Route.post("/", "AdministratorsController.create");
    Route.patch("/:id", "AdministratorsController.update");
    Route.delete("/:id", "AdministratorsController.delete");
}).prefix("/administrator");
