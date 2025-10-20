import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpTemplateService {
  generateOtpHtml({
    otp,
    userName,
    expiryMinutes,
    supportEmail,
    companyName,
    logoUrl,
  }: {
    otp: number;
    userName?: string;
    expiryMinutes?: number;
    supportEmail?: string;
    companyName?: string;
    logoUrl?: string;
  }): string {
    return `
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>OTP Code</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:20px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.05);">
              <tr>
                <td style="background:linear-gradient(90deg,#0ea5e9,#f97316);padding:16px 24px;color:#fff;font-weight:600;">
                  <table width="100%">
                    <tr>
                      <td>
                        ${logoUrl ? `<img src="${logoUrl}" alt="${companyName || 'KALMAN'} logo" width="120" style="display:block;">` : `<span style="font-size:18px;">${companyName || 'Kalman'}</span>`}
                      </td>
                      <td align="right">Secure Code</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:32px 40px;">
                  <h1 style="margin:0 0 12px;font-size:20px;color:#0f172a;">Hello ${userName || 'User'}!</h1>
                  <p style="margin:0 0 20px;color:#475569;font-size:15px;">
                    Use the code below to complete your action. This code is for one-time use only.
                  </p>
                  <div style="margin:18px 0;text-align:center;">
                    <span style="display:inline-block;background:#0f172a;color:#ffffff;padding:16px 28px;border-radius:8px;font-size:30px;font-weight:bold;letter-spacing:4px;">
                      ${otp}
                    </span>
                  </div>
                  <p style="margin:0 0 16px;color:#64748b;font-size:14px;">
                    This code will expire in <strong>${expiryMinutes || 5} minutes</strong>. 
                    If you didn't request this, you can safely ignore this email.
                  </p>
                  <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
                  <p style="margin:0;font-size:13px;color:#94a3b8;">
                    Need help? Email <a href="mailto:${supportEmail || 'support@example.com'}" style="color:#0ea5e9;text-decoration:none;">${supportEmail || 'support@example.com'}</a>
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 24px;background:#f9fafb;color:#94a3b8;font-size:12px;text-align:center;">
                  Sent by ${companyName || 'Your Company'}<br/>
                  If you did not request this code, please ignore this message.
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
}
