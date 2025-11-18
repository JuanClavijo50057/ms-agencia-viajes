import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CustomerValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string([ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string([
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    user_id: schema.string({}, [
      rules.trim(),
      rules.minLength(24),
      rules.maxLength(24),
      rules.unique({ table: "customers", column: "user_id" }),
      rules.externalUserExists(),
    ]),
  });

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    "user_id.required": "User ID is required",
    "user_id.unique": "This user is already registered as a customer",
    "user_id.minLength":
      "User ID must be a valid MongoDB ObjectId (24 characters)",
    "user_id.maxLength":
      "User ID must be a valid MongoDB ObjectId (24 characters)",
    "user_id.externalUserExists":
      "The user does not exist in the external authentication system",
  };
}
