import axios from 'axios';

export class SecurityService {
  private static baseUrl = process.env.MS_SECURITY_URL;

  static async getUserById(userId: string) {
    const response = await axios.get(`${this.baseUrl}/users/${userId}`);
    return response.data;
  }

  static async getManyUsers(ids: number[]) {
    const response = await axios.post(`${this.baseUrl}/users/many`, { ids });
    return response.data;
  }
}
