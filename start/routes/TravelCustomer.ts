import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.get("/", "TravelCustomersController.findAll");
    Route.post("/", "TravelCustomersController.create");
    Route.patch("/:id", "TravelCustomersController.update");
    Route.delete("/:id", "TravelCustomersController.delete");
    Route.get("/:userId/in-payment-or-paid", "TravelCustomersController.findTravelCustomersinPaymentOrPaid");
}).prefix("/travel-customer");