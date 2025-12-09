import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/conversations', 'MessagesController.createConversation')
  Route.post('/send', 'MessagesController.sendMessage')
  Route.get('/conversation/:id', 'MessagesController.getMessages')
  Route.get('/conversations/:user_id', 'ConversationsController.getUserConversations')
}).prefix('/messages')