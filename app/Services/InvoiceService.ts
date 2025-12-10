import PDFDocument from 'pdfkit'
import { Buffer } from 'buffer'

export async function generateInvoicePDF(paymentData: any): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 })
    const chunks: Buffer[] = []

    // Captura los datos del PDF en memoria
    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))

    // --- ENCABEZADO ---
    doc
      .fontSize(20)
      .text('Factura Electrónica', { align: 'center' })
      .moveDown()
      .fontSize(12)
      .text(`Comercio: ${paymentData.x_business}`)
      .text(`Factura N°: ${paymentData.x_id_factura}`)
      .text(`Referencia de pago: ${paymentData.x_ref_payco}`)
      .text(`Fecha de transacción: ${paymentData.x_fecha_transaccion}`)
      .moveDown()

    // --- DATOS DEL CLIENTE ---
    doc
      .fontSize(14)
      .text('Datos del cliente', { underline: true })
      .moveDown(0.5)
      .fontSize(12)
      .text(`Nombre: ${paymentData.x_customer_name} ${paymentData.x_customer_lastname}`)
      .text(`Documento: ${paymentData.x_customer_doctype} ${paymentData.x_customer_document}`)
      .text(`Correo: ${paymentData.x_customer_email}`)
      .text(`Teléfono: ${paymentData.x_customer_movil}`)
      .text(`Dirección: ${paymentData.x_customer_address}`)
      .text(`Ciudad: ${paymentData.x_customer_city} (${paymentData.x_customer_country})`)
      .moveDown()

    // --- DETALLE DEL PAGO ---
    doc
      .fontSize(14)
      .text('Detalle de la transacción', { underline: true })
      .moveDown(0.5)
      .fontSize(12)
      .text(`Descripción: ${paymentData.x_description}`)
      .text(`Monto: $${Number(paymentData.x_amount).toLocaleString('es-CO')} ${paymentData.x_currency_code}`)
      .text(`Estado: ${paymentData.x_transaction_state}`)
      .text(`Banco: ${paymentData.x_bank_name}`)
      .text(`Franquicia: ${paymentData.x_franchise}`)
      .text(`Cuotas: ${paymentData.x_quotas}`)
      .text(`Aprobación: ${paymentData.x_response_reason_text}`)
      .moveDown()

    // --- PIE DE PÁGINA ---
    doc
      .fontSize(10)
      .text('Este documento es una representación digital de la factura electrónica.', { align: 'center' })
      .moveDown(0.3)
      .text(`Firma digital: ${paymentData.x_signature}`, { align: 'center' })

    doc.end()
  })
}
