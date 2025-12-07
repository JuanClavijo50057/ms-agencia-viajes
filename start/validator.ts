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
validator.rule('sequentialDates', (value, _args, options) => {
  const { arrayExpressionPointer, errorReporter } = options
  if (!Array.isArray(value)) return

  for (let i = 1; i < value.length; i++) {
    const prev = value[i - 1]
    const curr = value[i]
    if (!prev.date_to || !curr.date_from) continue
    if (String(prev.date_to) !== String(curr.date_from)) {
      errorReporter.report(
        `${arrayExpressionPointer}.${i}.date_from`,
        'sequentialDates',
        `La fecha de inicio del trayecto ${i + 1} debe coincidir con la fecha de fin del trayecto ${i}`
      )
    }
  }
})

/**
 * 🔹 3️⃣ Validación de secuencia de ciudades (sincrónica)
 */
validator.rule('sequentialCities', (value, _args, options) => {
  const { arrayExpressionPointer, errorReporter } = options
  if (!Array.isArray(value)) return

  for (let i = 1; i < value.length; i++) {
    const prev = value[i - 1]
    const curr = value[i]
    if (!prev.cityTo || !curr.cityFrom) continue
    if (prev.cityTo !== curr.cityFrom) {
      errorReporter.report(
        `${arrayExpressionPointer}.${i}.cityFrom`,
        'sequentialCities',
        `La ciudad de origen del trayecto ${i + 1} debe coincidir con la ciudad de destino del trayecto ${i}`
      )
    }
  }
})
