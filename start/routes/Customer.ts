import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.get("/", "CustomersController.findAll");
    Route.post("/", "CustomersController.create");
    Route.get("/users-no-customer" , "CustomersController.allUsersWithoutCustomers");
    Route.get("/:id", "CustomersController.findByIdWithUser");
    Route.patch("/:id", "CustomersController.update");
    Route.delete("/:id", "CustomersController.delete");
    Route.post("/user-customer", "CustomersController.createUserHowCustomer");
}).prefix("/customer");