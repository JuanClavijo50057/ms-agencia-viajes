import { CreateGuideDTO } from "App/DTOs/Guide/createGuideDTO";
import BaseUserService from "./BaseUserService";
import GuideProfile from "App/Profiles/GuideProfile";
import Guide from "App/Models/Guide";
import BaseUserProfile from "App/Profiles/BaseUserProfile";

export default class GuideService extends BaseUserService {
    public static async createGuide(data: CreateGuideDTO) {
        const userData = BaseUserProfile.toUserEntity(data);

        return this.createWithUser(userData, async (user, trx) => {
            const guideData = GuideProfile.toGuideEntity(data, user.id);
            return await Guide.create(guideData, { client: trx });
        });
    }

    public static async updateGuide(guide: Guide, updateGuide: CreateGuideDTO) {
    const userData = BaseUserProfile.toUserEntity(updateGuide)

    return this.updateWithUser(guide.user_id, userData, async (user, trx) => {
      const guideRecord = await Guide.query({ client: trx })
        .where('user_id', guide.user_id)
        .firstOrFail()

      const guideData = GuideProfile.toGuideEntity(updateGuide, user.id)

      guideRecord.merge(guideData)
      await guideRecord.useTransaction(trx).save()

      return guideRecord
    })
  }
}
