import { Server } from 'socket.io'
import { createServer } from 'http'

class Ws {
  public io: Server
  private booted = false

  public boot() {
    if (this.booted) return
    this.booted = true

    // Crea un servidor HTTP independiente solo para WebSockets
    const httpServer = createServer()

    this.io = new Server(httpServer, {
      cors: { origin: '*' },
    })

    // Puedes usar otro puerto si 3333 ya está ocupado por Adonis
    const PORT = 3334
    httpServer.listen(PORT, () => {
      console.log(`📡 Servidor WS corriendo en puerto ${PORT}`)
    })
  }
}

export default new Ws()
