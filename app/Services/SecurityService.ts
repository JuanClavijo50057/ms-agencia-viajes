import axios, { AxiosError } from "axios";
import Env from "@ioc:Adonis/Core/Env";
import NotFoundException from "App/Exceptions/NotFoundException";
import BadRequestException from "App/Exceptions/BadRequestException";

interface SecurityUser {
  _id: string;
  name: string;
  email: string;
  isOauth: boolean;
}

export default class SecurityService {
  private static baseUrl = Env.get("MS_SECURITY");
  public static token:string;
  public static async getUserById(userId: string): Promise<SecurityUser> {
    
    const response = await axios
      .get<SecurityUser>(`${this.baseUrl}/api/users/${userId}`, {
        headers: {
          Authorization: SecurityService.token ? SecurityService.token : undefined,
        },
      })
      .catch((error: AxiosError) => {
        if (error.response?.status === 404) {
          throw new NotFoundException(
            `User with ID ${userId} not found in security service`
          );
        }
        if (error.response?.status === 400) {
          throw new BadRequestException("Invalid user ID format");
        }
        throw new BadRequestException("Unable to connect to security service");
      });

    return response.data;
  }

  public static async getUserEmail(userId: string): Promise<string> {
    const user = await this.getUserById(userId);
    return user.email;
  }

  public static async validateUserExists(userId: string): Promise<void> {
    await this.getUserById(userId);
  }
  public static async updateUser(userId: string,payload: Partial<SecurityUser>): Promise<void> {
     await axios.patch(`${this.baseUrl}/api/users/${userId}`, payload).catch((error: AxiosError) => {
      if (error.response?.status === 404) {
        throw new NotFoundException(
          `User with ID ${userId} not found in security service`
        );
      }
    });

  }

    public static async getAllUsers() {
    try {
      console.log('Token in SecurityService:', SecurityService.token);
      const response = await axios.get(`${this.baseUrl}/api/users`, {
        headers: { Authorization: SecurityService.token },
      });
      return response.data;
    } catch (error) {
      throw new Error('Error obteniendo todos los usuarios');
    }
  }
  public static async createUser(payload: Partial<SecurityUser>): Promise<SecurityUser> {
    const response = await axios.post<SecurityUser>(`${this.baseUrl}/api/users`, payload).catch((error: AxiosError) => {
      throw new BadRequestException("Unable to create user in security service");
    });

    return response.data;
  }
}