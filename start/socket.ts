import Ws from 'App/Services/Ws'

Ws.io.on('connection', (socket) => {
  console.log('✅ Usuario conectado:', socket.id)

  socket.on('join', (userId: string) => {
    socket.join(`user:${userId}`)
    console.log(`👤 Usuario ${userId} se unió a su canal`)
  })

  socket.on('disconnect', () => {
    console.log('❌ Usuario desconectado:', socket.id)
  })
})
