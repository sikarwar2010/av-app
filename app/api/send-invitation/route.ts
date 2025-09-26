import { type NextRequest, NextResponse } from "next/server"

interface InvitationEmailData {
    email: string
    role: string
    inviterName: string
    companyName: string
    inviteLink: string
    expiresAt: string
}

export async function POST(request: NextRequest) {
    try {
        const { email, role, inviterName, companyName, inviteLink, expiresAt }: InvitationEmailData = await request.json()

        // For now, we'll simulate email sending and log the details
        // In production, you would integrate with an email service like:
        // - Resend (recommended for Next.js)
        // - SendGrid
        // - AWS SES
        // - Nodemailer with SMTP

        console.log("[v0] Sending invitation email:", {
            to: email,
            role,
            inviterName,
            companyName,
            inviteLink,
            expiresAt,
        })

        // Simulate email template
        const emailTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>You're invited to join ${companyName}</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; color: white; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">You're Invited!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Join ${companyName}'s CRM workspace</p>
          </div>
          
          <div style="padding: 30px 0;">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
              Hi there! 👋
            </p>
            
            <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;">
              <strong>${inviterName}</strong> has invited you to join <strong>${companyName}</strong> as a <strong>${role.charAt(0).toUpperCase() + role.slice(1)}</strong> in their CRM workspace.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteLink}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Accept Invitation
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; line-height: 1.6;">
              This invitation will expire on <strong>${new Date(expiresAt).toLocaleDateString()}</strong>. 
              If you don't want to join this workspace, you can safely ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999; text-align: center;">
              This invitation was sent by ${companyName}. If you have any questions, please contact your administrator.
            </p>
          </div>
        </body>
      </html>
    `

        // In production, replace this with actual email sending:
        /*
        const emailResult = await resend.emails.send({
          from: `${companyName} <noreply@yourcompany.com>`,
          to: [email],
          subject: `You're invited to join ${companyName}`,
          html: emailTemplate,
        })
        */

        // For demo purposes, we'll return success
        return NextResponse.json({
            success: true,
            message: `Invitation email sent to ${email}`,
            // In production, you might return the email service response
            emailId: `demo_${Date.now()}`,
        })
    } catch (error) {
        console.error("[v0] Error sending invitation email:", error)
        return NextResponse.json({ success: false, error: "Failed to send invitation email" }, { status: 500 })
    }
}
