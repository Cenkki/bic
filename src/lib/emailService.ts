// Email service for sending notifications
// In development, logs to console
// In production, would use SMTP or email service provider

/**
 * Send ownership claim email to admin
 */
export async function sendOwnershipClaimEmail(bikeId: string, brand?: string, model?: string) {
  const subject = `Omistajuusväite pyörälle: ${brand || ''} ${model || ''} (${bikeId})`;
  const body = `
    Uusi omistajuusväite on tehty pyörälle:
    
    Pyörä ID: ${bikeId}
    Merkki: ${brand || '-'}
    Malli: ${model || '-'}
    
    Tarkista pyörän tiedot ja ota yhteyttä väittäjään.
  `;

  if (process.env.NODE_ENV === 'development') {
    console.log('=== EMAIL SIMULATION ===');
    console.log('To: admin@pyoravahti.fi');
    console.log('Subject:', subject);
    console.log('Body:', body);
    console.log('=== END EMAIL SIMULATION ===');
    return { success: true };
  }

  // In production, implement actual email sending
  // For example, using nodemailer with SMTP or an email service provider
  try {
    // Implementation would go here
    console.log('Email would be sent in production');
    return { success: true };
  } catch (error) {
    console.error('Error sending ownership claim email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

/**
 * Send abuse report email to admin
 */
export async function sendAbuseReportEmail(bikeId: string, brand?: string, model?: string) {
  const subject = `Väärinkäyttöilmoitus pyörälle: ${brand || ''} ${model || ''} (${bikeId})`;
  const body = `
    Uusi väärinkäyttöilmoitus on tehty pyörälle:
    
    Pyörä ID: ${bikeId}
    Merkki: ${brand || '-'}
    Malli: ${model || '-'}
    
    Tarkista pyörän tiedot ja ryhdy tarvittaviin toimiin.
  `;

  if (process.env.NODE_ENV === 'development') {
    console.log('=== EMAIL SIMULATION ===');
    console.log('To: admin@pyoravahti.fi');
    console.log('Subject:', subject);
    console.log('Body:', body);
    console.log('=== END EMAIL SIMULATION ===');
    return { success: true };
  }

  // In production, implement actual email sending
  try {
    // Implementation would go here
    console.log('Email would be sent in production');
    return { success: true };
  } catch (error) {
    console.error('Error sending abuse report email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}