export const generateEmailTemplate = (
  title: string,
  message: string,
  link?: string,
  fullLink?: string,
  userName?: string,
) => {
  const buttonHtml = link
    ? `<a href="${fullLink}" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #1E293B; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 14px;">Tinjau Permintaan</a>`
    : "";

  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F1F5F9; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      
      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
        <tr>
          <td align="center">
            
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #E2E8F0; border-radius: 4px; overflow: hidden; max-width: 600px; width: 100%;">
              
              <!-- Header Navy -->
              <tr>
                <td style="background-color: #1E293B; padding: 20px 40px; text-align: center; border-bottom: 4px solid #3B82F6;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 600; letter-spacing: 0.5px;">SISTEM MANAJEMEN ASET</h1>
                </td>
              </tr>

              <!-- Konten Email -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="color: #0F172A; margin-top: 0; margin-bottom: 20px; font-size: 16px; font-weight: 600;">${title}</h2>
                  
                  <!-- Sapaan Formal dengan Nama -->
                  <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">
                    Yth. ${userName || "Pengguna Sistem"},
                  </p>
                  
                  <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">
                    Melalui email ini, kami menginformasikan terkait pembaruan status aktivitas Anda pada sistem manajemen aset. Berikut adalah detail informasinya:
                  </p>

                  <div style="background-color: #F8FAFC; border-left: 4px solid #3B82F6; padding: 15px; margin: 20px 0;">
                    <p style="color: #1E293B; font-size: 14px; line-height: 1.6; margin: 0;">
                      <strong>${message}</strong>
                    </p>
                  </div>

                  <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">
                    Untuk meninjau detail lengkap atau melakukan tindakan lebih lanjut terkait informasi di atas, mohon untuk mengakses sistem melalui tautan berikut:
                  </p>
                  
                  ${buttonHtml}

                  <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                    Hormat kami,<br>
                    <strong>General Affair</strong>
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding: 0 40px;">
                  <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 0;">
                </td>
              </tr>

              <tr>
                <td style="padding: 20px 40px; background-color: #F8FAFC;">
                  <p style="color: #94A3B8; font-size: 11px; margin: 0; text-align: center; line-height: 1.5;">
                    Email ini dikirim secara otomatis oleh sistem. Mohon untuk tidak membalas email ini.<br>
                    &copy; ${new Date().getFullYear()} General Affair
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
};
