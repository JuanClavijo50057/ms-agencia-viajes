import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
 
    Route.post('/', 'NotificationsController.alertNewNotification')
}).prefix('/notifications')
