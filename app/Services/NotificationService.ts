import axios from 'axios';

export class NotificationService {
  private static baseUrl = process.env.SECURITY_SERVICE_URL;


  static async sendNotification(email: string, subject: string, message: string) {
    const payload = {
      email,
      subject,
      message
    };

    const response = await axios.post(
      `${this.baseUrl}/notifications/send`,
      payload
    );

    return response.data;
  }



}
