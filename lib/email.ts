// @ts-ignore
import nodemailer from 'nodemailer';

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Creates a Nodemailer transport instance if SMTP environment variables are set.
 */
function getSmtpTransport() {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.SMTP_PASSWORD;
  const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      connectionTimeout: 5000,  // 5s — prevents hanging SMTP connections
      socketTimeout: 8000,      // 8s — prevents stuck socket from blocking login
      greetingTimeout: 5000,
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  // Check if Gmail app password is provided
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    const cleanPassword = process.env.GMAIL_APP_PASSWORD.replace(/\s+/g, '');
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER.trim(),
        pass: cleanPassword,
      },
    });
  }

  return null;
}

/**
 * Generates official TVK-UP security alert HTML for admin OTP delivery.
 */
function generateOtpEmailHtml(otp: string, toEmail: string): string {
  const formattedOtp = otp.slice(0, 3) + ' ' + otp.slice(3);
  const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TVK UP Admin Login Verification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: 'Segoe UI', Arial, sans-serif; color: #1E293B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FAF7F2; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 540px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #E2E8F0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #800000 0%, #A00000 50%, #C8102E 100%); padding: 30px 40px; text-align: center;">
              <h1 style="color: #FFFFFF; font-size: 20px; font-weight: 900; letter-spacing: 2px; margin: 0; text-transform: uppercase;">
                TAMILAGA VETTRI KAZHAGAM
              </h1>
              <p style="color: #FCD34D; font-size: 11px; font-weight: 800; letter-spacing: 3px; margin: 6px 0 0 0; text-transform: uppercase;">
                Uttar Pradesh State Officer Portal
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 36px 40px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <span style="display: inline-block; background-color: #FEE2E2; color: #991B1B; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px;">
                  Two-Factor Authentication (2FA)
                </span>
                <h2 style="color: #0F172A; font-size: 18px; font-weight: 800; margin: 14px 0 8px 0;">
                  Admin Security Verification Code
                </h2>
                <p style="color: #64748B; font-size: 13px; margin: 0; line-height: 1.5;">
                  A login request was initiated for your administrator account: <br/>
                  <strong style="color: #0F172A;">${toEmail}</strong>
                </p>
              </div>

              <!-- OTP Code Display -->
              <div style="background: #F8FAFC; border: 2px dashed #CBD5E1; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
                <div style="color: #64748B; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                  Your One-Time Passcode
                </div>
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 900; color: #A00000; letter-spacing: 8px; margin: 6px 0;">
                  ${formattedOtp}
                </div>
                <div style="color: #DC2626; font-size: 11px; font-weight: 700; margin-top: 8px;">
                  ⏳ Valid for strictly 5 minutes only
                </div>
              </div>

              <!-- Security Notice -->
              <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 14px 16px; border-radius: 6px; margin-bottom: 24px;">
                <p style="color: #92400E; font-size: 11px; font-weight: 600; margin: 0; line-height: 1.5;">
                  <strong>SECURITY ALERT:</strong> If you did NOT initiate this sign-in attempt, someone may have entered your password. Please log into the portal and change your password immediately.
                </p>
              </div>

              <p style="color: #94A3B8; font-size: 11px; margin: 0; text-align: center; line-height: 1.4;">
                Time of Request: ${dateStr} IST<br/>
                This is an automated security verification email. Please do not reply.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F1F5F9; padding: 16px 40px; text-align: center; border-top: 1px solid #E2E8F0;">
              <p style="color: #64748B; font-size: 10px; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 1px;">
                TVK Uttar Pradesh State Party &bull; High-Security Portal
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Sends the 6-digit OTP directly to tvkuttarpradesh@gmail.com
 */
export async function sendAdminOtpEmail(toEmail: string, otp: string): Promise<SendEmailResult> {
  let fromAddress = process.env.SMTP_FROM || process.env.EMAIL_FROM;
  if (!fromAddress && process.env.GMAIL_USER) {
    fromAddress = `"TVK UP Security" <${process.env.GMAIL_USER.trim()}>`;
  }
  if (!fromAddress) {
    fromAddress = '"TVK UP Security" <no-reply@tvkup.org>';
  }
  const subject = `[TVK-UP] Admin Login Verification Code: ${otp.slice(0, 3)} ${otp.slice(3)}`;
  const html = generateOtpEmailHtml(otp, toEmail);

  // Always log OTP for security audit trail and fail-safe recovery
  console.log(`\n======================================================`);
  console.log(`[ADMIN 2FA EMAIL DISPATCH]`);
  console.log(`To: ${toEmail}`);
  console.log(`OTP Code: ${otp}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`======================================================\n`);

  try {
    const transporter = getSmtpTransport();

    // Hard 10s timeout: login must not hang waiting for SMTP
    const EMAIL_TIMEOUT_MS = 10000;
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Email send timeout after 10s')), EMAIL_TIMEOUT_MS)
    );

    if (transporter) {
      const info = await Promise.race([
        transporter.sendMail({ from: fromAddress, to: toEmail, subject, html }),
        timeoutPromise,
      ]);
      console.log(`Email dispatched successfully via SMTP. MessageId: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    }

    // Check for Resend API fallback
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress.includes('<') ? fromAddress : `TVK Security <${fromAddress}>`,
          to: [toEmail],
          subject,
          html,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(`Email dispatched successfully via Resend. Id: ${data.id}`);
        return { success: true, messageId: data.id };
      } else {
        const errText = await res.text();
        console.warn('Resend API error:', errText);
      }
    }

    console.log(`[SMTP INFO] SMTP credentials not set; OTP logged to secure server console.`);
    return { success: true };
  } catch (error) {
    console.error('Failed to send admin OTP email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Email dispatch failed',
    };
  }
}
