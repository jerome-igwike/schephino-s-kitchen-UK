import sendgrid from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  console.warn('SENDGRID_API_KEY not set. Email features will be disabled.');
} else {
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
}

export const emailService = process.env.SENDGRID_API_KEY ? sendgrid : null;

export function getEmailService() {
  if (!emailService) {
    throw new Error('SendGrid is not configured. Please set SENDGRID_API_KEY environment variable.');
  }
  return emailService;
}

export const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@schephinoskitchen.com';
export const FROM_NAME = process.env.FROM_NAME || 'Schephino\'s Kitchen';
