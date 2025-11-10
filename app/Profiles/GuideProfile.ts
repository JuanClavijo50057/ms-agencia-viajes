import { CreateGuideDTO } from "App/DTOs/Guide/createGuideDTO";
import Guide from "App/Models/Guide";

export default class GuideProfile {
    public static toGuideEntity(dto: CreateGuideDTO, userId: number): Partial<Guide> {
        return {
            user_id: userId,
            active: dto.active,
            hire_date: dto.hire_date,
        }
    }
}
