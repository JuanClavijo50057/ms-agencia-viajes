import { DateTime } from "luxon";
import { BaseModel, column, HasMany, hasMany } from "@ioc:Adonis/Lucid/Orm";
import Hotel from "./Hotel";

export default class Administrator extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public user_id: string;

  @column()
  public active: boolean;

  @column.dateTime()
  public hire_date: DateTime;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasMany(() => Hotel, {
    foreignKey: "administrator_id",
  })
  public hotels: HasMany<typeof Hotel>;
}
