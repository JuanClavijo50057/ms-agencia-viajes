import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.post("/charge", "DepartmentsController.chargeDepartments");
}).prefix("/departments");