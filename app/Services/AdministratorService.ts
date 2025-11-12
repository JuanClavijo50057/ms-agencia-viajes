import { CreateAdministratorDTO } from "App/DTOs/Administrator/createAdministratorDTO";
import BaseUserService from "./BaseUserService";
import AdministratorProfile from "App/Profiles/AdministratorProfile";
import Administrator from "App/Models/Administrator";
import BaseUserProfile from "App/Profiles/BaseUserProfile";

export default class AdministratorService extends BaseUserService {
    public static async createAdministrator(data: CreateAdministratorDTO) {
        const userData = BaseUserProfile.toUserEntity(data);

        return this.createWithUser(userData, async (user, trx) => {
            const administratorData = AdministratorProfile.toAdministratorEntity(data, user.id);
            return await Administrator.create(administratorData, { client: trx });
        });
    }
    
    public static async updateAdministrator(admin: Administrator, updateAdministrator: CreateAdministratorDTO) {
  const userData = BaseUserProfile.toUserEntity(updateAdministrator)

  return this.updateWithUser(admin.user_id, userData, async (user, trx) => {
    const administrator = await Administrator.query({ client: trx })
      .where('user_id', admin.user_id)
      .firstOrFail()

    const administratorData = AdministratorProfile.toAdministratorEntity(updateAdministrator, user.id)

    administrator.merge(administratorData)
    await administrator.useTransaction(trx).save()

    return administrator
  })
}

}