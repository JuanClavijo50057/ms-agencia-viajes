import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.get("/", "QuotasController.findAll");
    Route.post("/", "QuotasController.create");
    Route.patch("/:id", "QuotasController.update");
    Route.delete("/:id", "QuotasController.delete");
    Route.post('/pay/:id', 'QuotasController.createPayment')
    Route.post('/public/webhook', 'QuotasController.webhook')
    Route.get('/:travel_customer_id/:amount', 'QuotasController.getQuotasByAmount')
}).prefix("/quota");