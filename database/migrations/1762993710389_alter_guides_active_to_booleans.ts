import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'guides'

  public async up () {
    // 1. Eliminar el constraint CHECK
    this.schema.raw(`
      ALTER TABLE guides
      DROP CONSTRAINT IF EXISTS guides_active_check;
    `)

    // 2. Eliminar el DEFAULT
    this.schema.raw(`
      ALTER TABLE guides
      ALTER COLUMN active DROP DEFAULT;
    `)

    // 3. Cambiar el tipo de dato
    this.schema.raw(`
      ALTER TABLE guides
      ALTER COLUMN active TYPE BOOLEAN
      USING CASE
        WHEN active = 'Y' THEN TRUE
        WHEN active = 'N' THEN FALSE
        ELSE FALSE
      END;
    `)

    // 4. Establecer nuevo DEFAULT (opcional)
    this.schema.raw(`
      ALTER TABLE guides
      ALTER COLUMN active SET DEFAULT FALSE;
    `)
  }

  public async down () {
    // 1. Eliminar DEFAULT boolean
    this.schema.raw(`
      ALTER TABLE guides
      ALTER COLUMN active DROP DEFAULT;
    `)

    // 2. Cambiar de vuelta a VARCHAR
    this.schema.raw(`
      ALTER TABLE guides
      ALTER COLUMN active TYPE VARCHAR(1)
      USING CASE
        WHEN active = TRUE THEN 'Y'
        WHEN active = FALSE THEN 'N'
        ELSE 'N'
      END;
    `)

    // 3. Restaurar DEFAULT
    this.schema.raw(`
      ALTER TABLE guides
      ALTER COLUMN active SET DEFAULT 'N';
    `)

    // 4. Restaurar CHECK constraint
    this.schema.raw(`
      ALTER TABLE guides
      ADD CONSTRAINT guides_active_check
      CHECK (active IN ('Y', 'N'));
    `)
  }
}
