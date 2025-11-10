import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.post("/charge", "DepartmentsController.chargeDepartments");
    Route.get("/", "DepartmentsController.findAll");
    Route.get("/available-hotels", "DepartmentsController.findDepartmentsWithAvailableHotels");
}).prefix("/departments");