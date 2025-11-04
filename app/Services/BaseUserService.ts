import Database from "@ioc:Adonis/Lucid/Database";
import User from "App/Models/User";

export default abstract class BaseUserService {
    protected static async createWithUser<T>(
        userData: Partial<User>,
        createEntityCallback: (user: User, trx: any) => Promise<T>
    ): Promise<T> {
        const trx = await Database.transaction()
        try {
            const user = await User.create(userData, { client: trx })
            const entity = await createEntityCallback(user, trx)
            await trx.commit()
            return entity
        } catch (error) {
            await trx.rollback()
            throw error
        }
    }
}