/**
 * Thank You Email Template for BFIS
 * Responsive HTML email that works across all major email clients
 */

export function getThankYouEmailHTML(parentName, studentName) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Thank You - Brookfield International School</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
    <tr>
      <td style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 100%;">
          
          <!-- Header with Logo and Brand Colors -->
          <tr>
            <td style="background: url('https://www.bfis.in/info/admissions/bg-image.png') no-repeat center center; background-size: cover;">
              <img src="https://www.bfis.in/assets/images/logo_color.png" alt="Brookfield International School" style="max-width: 180px; height: auto; margin-bottom: 10px;">
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px; color: #333333; line-height: 1.7; font-size: 15px;">
              <!-- Greeting -->
              <p style="margin: 0 0 20px 0; font-size: 16px;">
                Dear <strong style="color: #1e3a8a;">${parentName}</strong>,
              </p>

              <!-- Introduction -->
              <p style="margin: 0 0 20px 0;">
                Thank you for submitting your inquiry and showing interest in <strong>Brookfield International School, New Chandigarh</strong>. We appreciate the time you have taken to learn more about our institution, and we are pleased to assist you further in exploring the best educational pathway for ${studentName ? `<strong>${studentName}</strong>` : 'your child'}.
              </p>

              <p style="margin: 0 0 25px 0;">
                At Brookfield International School, we are committed to fostering academic excellence, character development, and holistic growth. Our learning environment is designed to encourage curiosity, confidence, leadership, and global awareness.
              </p>

              <!-- Key Highlights Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc; border-left: 4px solid #3b82f6; margin: 25px 0; border-radius: 4px;">
                <tr>
                  <td style="padding: 20px;">
                    <h2 style="margin: 0 0 15px 0; color: #1e3a8a; font-size: 18px; font-weight: 600;">Key Highlights:</h2>
                    <ul style="margin: 0; padding: 0 0 0 20px; color: #555555;">
                      <li style="margin-bottom: 10px;">A comprehensive and progressive <strong>STEAM-based curriculum</strong></li>
                      <li style="margin-bottom: 10px;">Highly qualified and experienced faculty</li>
                      <li style="margin-bottom: 10px;">Modern, well-equipped classrooms and digital learning infrastructure</li>
                      <li style="margin-bottom: 10px;">Extensive sports, performing arts, and co-curricular programmes</li>
                      <li style="margin-bottom: 10px;">A safe, nurturing, and value-driven campus environment</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <!-- Brochure Download Section -->
              <p style="margin: 20px 0 15px 0;">
                To gain a detailed overview of our academic framework, campus facilities, and student programs, please download our school brochure:
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 10px 0 25px 0; text-align: center;">
                    <a href="https://drive.google.com/file/d/12S42_ZMkoPDPTccKboFFDV6NKcPFSdjx/view" target="_blank" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #acf15c 0%, #9de054 100%); color: #000000; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(172, 241, 92, 0.3);">
                      📥 Download Brochure
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Next Steps -->
              <p style="margin: 0 0 15px 0; font-weight: 600; color: #1e3a8a; font-size: 16px;">
                Our Admissions Team will reach out to you shortly to guide you through:
              </p>
              <ul style="margin: 0 0 25px 0; padding: 0 0 0 20px; color: #555555;">
                <li style="margin-bottom: 8px;">The admission process and eligibility</li>
                <li style="margin-bottom: 8px;">Campus visit scheduling</li>
                <li style="margin-bottom: 8px;">Fee structure and available provisions</li>
              </ul>

              <!-- Contact Information Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fef3c7; border-radius: 6px; margin: 25px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 12px 0; color: #92400e; font-size: 16px; font-weight: 600;">Should you wish to speak to us directly:</h3>
                    <p style="margin: 0 0 8px 0; color: #92400e;">
                      <strong>📞 Phone:</strong> <a href="tel:+919066790662" style="color: #1e3a8a; text-decoration: none;">+91-9066790662</a>
                    </p>
                    <p style="margin: 0 0 8px 0; color: #92400e;">
                      <strong>✉️ Email:</strong> <a href="mailto:info@bfis.in" style="color: #1e3a8a; text-decoration: none;">info@bfis.in</a>
                    </p>
                    <p style="margin: 0; color: #92400e;">
                      <strong>🌐 Website:</strong> <a href="https://www.bfis.in/" target="_blank" style="color: #1e3a8a; text-decoration: none;">https://www.bfis.in/</a>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Closing -->
              <p style="margin: 25px 0 0 0; font-size: 15px;">
                We look forward to the opportunity of welcoming your family to the Brookfield community.
              </p>

              <p style="margin: 20px 0 0 0; color: #555555;">
                <strong>Warm regards,</strong><br>
                <span style="color: #1e3a8a; font-weight: 600;">Admissions Office</span><br>
                Brookfield International School, New Chandigarh
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1e3a8a; padding: 30px; text-align: center; color: #ffffff;">
              <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.6;">
                <strong>Brookfield International School</strong><br>
                New Chandigarh (Near Mullanpur), Punjab<br>
                A CBSE Affiliated School
              </p>
              <p style="margin: 15px 0 0 0; font-size: 12px; color: #cbd5e1;">
                This is an automated message. Please do not reply to this email.<br>
                For inquiries, contact us at <a href="mailto:info@bfis.in" style="color: #acf15c; text-decoration: none;">info@bfis.in</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Get plain text version of the email (fallback for email clients that don't support HTML)
 */
export function getThankYouEmailText(parentName, studentName) {
  return `
Dear ${parentName},

Thank you for submitting your inquiry and showing interest in Brookfield International School, New Chandigarh. We appreciate the time you have taken to learn more about our institution, and we are pleased to assist you further in exploring the best educational pathway for ${studentName || 'your child'}.

At Brookfield International School, we are committed to fostering academic excellence, character development, and holistic growth. Our learning environment is designed to encourage curiosity, confidence, leadership, and global awareness.

KEY HIGHLIGHTS:
• A comprehensive and progressive STEAM-based curriculum
• Highly qualified and experienced faculty
• Modern, well-equipped classrooms and digital learning infrastructure
• Extensive sports, performing arts, and co-curricular programmes
• A safe, nurturing, and value-driven campus environment

DOWNLOAD OUR BROCHURE:
https://www.bfis.in/wp-content/uploads/2024/12/BFIS-Brochure.pdf

OUR ADMISSIONS TEAM WILL REACH OUT TO YOU SHORTLY TO GUIDE YOU THROUGH:
• The admission process and eligibility
• Campus visit scheduling
• Fee structure and available provisions

CONTACT US DIRECTLY:
Phone: +91-9066790662
Email: info@bfis.in
Website: https://www.bfis.in/

We look forward to the opportunity of welcoming your family to the Brookfield community.

Warm regards,
Admissions Office
Brookfield International School, New Chandigarh
  `.trim();
}


