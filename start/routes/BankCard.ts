import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.get("/", "BankCardsController.findAll");
    Route.get("/customer/:idCustomer", "BankCardsController.findByCustomer");
    Route.post("/", "BankCardsController.create");
    Route.put("/:id", "BankCardsController.update");
    Route.delete("/:id", "BankCardsController.delete");
}).prefix("/BankCard");