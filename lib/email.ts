import nodemailer from 'nodemailer';
import { logError, logInfo } from './logger';

// Creăm un transportor Ethereal pentru dezvoltare
const createTestAccount = async () => {
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

// Interfață pentru datele email-ului
interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// Funcție pentru trimiterea email-urilor
export async function sendEmail({ to, subject, text, html }: EmailData) {
  try {
    const transporter = await createTestAccount();
    
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@gambling-helper.com',
      subject,
      text: text || '',
      html: html || text || ''
    };

    logInfo('Trimitere email', { to, subject });
    const info = await transporter.sendMail(msg);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    logInfo('Email trimis cu succes', { to, subject });
    
    return { success: true };
  } catch (error) {
    logError('Eroare la trimiterea email-ului', error);
    throw new Error('Nu s-a putut trimite email-ul');
  }
}

// Template-uri de email
export const emailTemplates = {
  welcome: (username: string, locale: string = 'ro') => ({
    subject: locale === 'ro' ? 'Bun venit la Gambling Helper!' : 'Welcome to Gambling Helper!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">${locale === 'ro' ? 'Bun venit' : 'Welcome'}, ${username}!</h1>
        <p style="color: #666; line-height: 1.6;">
          ${locale === 'ro' 
            ? 'Îți mulțumim că te-ai alăturat comunității noastre. Suntem aici să te ajutăm să îți gestionezi mai bine activitatea de gambling.' 
            : 'Thank you for joining our community. We are here to help you better manage your gambling activity.'}
        </p>
        <div style="margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            ${locale === 'ro' ? 'Accesează Contul Tău' : 'Access Your Account'}
          </a>
        </div>
        <p style="color: #999; font-size: 12px;">
          ${locale === 'ro' 
            ? 'Dacă nu ai creat acest cont, te rugăm să ignori acest email.' 
            : 'If you did not create this account, please ignore this email.'}
        </p>
      </div>
    `
  }),

  passwordReset: (resetToken: string, locale: string = 'ro') => ({
    subject: locale === 'ro' ? 'Resetare parolă Gambling Helper' : 'Password Reset Gambling Helper',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">${locale === 'ro' ? 'Resetare Parolă' : 'Password Reset'}</h1>
        <p style="color: #666; line-height: 1.6;">
          ${locale === 'ro' 
            ? 'Ai solicitat resetarea parolei tale. Click pe butonul de mai jos pentru a seta o nouă parolă:' 
            : 'You have requested to reset your password. Click the button below to set a new password:'}
        </p>
        <div style="margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            ${locale === 'ro' ? 'Resetează Parola' : 'Reset Password'}
          </a>
        </div>
        <p style="color: #999; font-size: 12px;">
          ${locale === 'ro' 
            ? 'Dacă nu ai solicitat resetarea parolei, te rugăm să ignori acest email.' 
            : 'If you did not request a password reset, please ignore this email.'}
        </p>
      </div>
    `
  })
};

export async function sendResetPasswordEmail(email: string, resetToken: string, locale: string) {
  try {
    const transporter = await createTestAccount();
    
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: '"Gambling Helper" <noreply@gambling-helper.com>',
      to: email,
      subject: locale === 'ro' ? 'Resetare parolă' : 'Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">${locale === 'ro' ? 'Resetare parolă' : 'Password Reset'}</h2>
          <p>${locale === 'ro' ? 'Ai solicitat resetarea parolei pentru contul tău.' : 'You requested a password reset for your account.'}</p>
          <p>${locale === 'ro' ? 'Apasă pe link-ul de mai jos pentru a seta o nouă parolă:' : 'Click the link below to set a new password:'}</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
            ${locale === 'ro' ? 'Resetare parolă' : 'Reset Password'}
          </a>
          <p style="color: #666; font-size: 14px;">
            ${locale === 'ro' 
              ? 'Dacă nu ai solicitat această resetare, poți ignora acest email.' 
              : 'If you did not request this reset, you can safely ignore this email.'}
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
} 