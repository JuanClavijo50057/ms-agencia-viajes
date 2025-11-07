import { DateTime } from "luxon"

export interface CreateAdministratorDTO {
    name: string
    email: string
    phone: string
    identification_number: string
    document_type: string
    birth_date: DateTime
    active: boolean
    hire_date: DateTime
}