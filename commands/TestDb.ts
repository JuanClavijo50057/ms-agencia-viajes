import { BaseCommand } from '@adonisjs/core/build/standalone'
import Database from "@ioc:Adonis/Lucid/Database"

export default class TestDb extends BaseCommand {
  public static commandName = 'test:db'
  public static description = 'Probar conexión con Supabase'

  public async run() {
    this.logger.info('🔍 Probando conexión a la base de datos...')
    try {
      const result = await Database.rawQuery('SELECT NOW()')
      this.logger.success(`✅ Conexión exitosa: ${result.rows[0].now}`)
    } catch (error) {
      this.logger.error('❌ Error al conectar:')
      console.error(error)
    } finally {
      await Database.manager.closeAll()
    }
  }
}
