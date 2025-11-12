import Database from "@ioc:Adonis/Lucid/Database";
import User from "App/Models/User";

export default abstract class BaseUserService {
  protected static async createWithUser<T>(
    userData: Partial<User>,
    createEntityCallback: (user: User, trx: any) => Promise<T>
  ): Promise<T> {
    const trx = await Database.transaction();
    try {
      const user = await User.create(userData, { client: trx });
      const entity = await createEntityCallback(user, trx);
      await trx.commit();
      return entity;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  protected static async updateWithUser<T>(
    userId: number,
    userData: Partial<User>,
    updateEntityCallback: (user: User, trx: any) => Promise<T>
  ): Promise<T> {
    const trx = await Database.transaction();

    try {
      const user = await User.query({ client: trx })
        .where("id", userId)
        .firstOrFail();

      user.merge(userData);
      await user.useTransaction(trx).save();

      const entity = await updateEntityCallback(user, trx);

      await trx.commit();
      return entity;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}
