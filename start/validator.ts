import { validator } from '@ioc:Adonis/Core/Validator'
import SecurityService from 'App/Services/SecurityService'

validator.rule(
    'externalUserExists',
    async (value, _args, options) => {
        try {
            const data = await SecurityService.getUserById(value)
            if (!data) throw new Error('No existe')
        } catch (error) {
            console.error('ERROR EXTERNO:', error.response?.data ?? error.message)

            options.errorReporter.report(
                options.pointer,
                'externalUserExists',
                'El usuario no existe en el sistema externo',
                options.arrayExpressionPointer
            )
        }
    },
    () => ({
        async: true,
    })
)
