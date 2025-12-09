import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.get("/", "QuotasController.findAll");
    Route.post("/", "QuotasController.create");
    Route.patch("/:id", "QuotasController.update");
    Route.delete("/:id", "QuotasController.delete");
    Route.post('/pay/:id', 'QuotasController.createPayment')
    Route.post('/webhook', 'QuotasController.webhook')
}).prefix("/quota");