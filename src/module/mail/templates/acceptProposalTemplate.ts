// src/mail/templates/proposal-accepted.template.ts

export interface ProposalAcceptedProps {
  traderName: string;
  proposalTitle: string;
  acceptedBy: string;
}

export const proposalAcceptedTemplate = (props: ProposalAcceptedProps) => `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
    
    <!-- Header -->
    <div style="background-color: #0d6efd; color: white; padding: 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px;">🎉 Proposal Accepted!</h1>
    </div>

    <!-- Body -->
    <div style="padding: 25px; color: #333;">
      <p style="font-size: 16px;">Hello <strong>${props.traderName}</strong>,</p>
      
      <p style="font-size: 16px; line-height: 1.6;">
        Your proposal <strong>"${props.proposalTitle}"</strong> has been <span style="color: #198754; font-weight: bold;">accepted</span> by <strong>${props.acceptedBy}</strong>.
      </p>

      <p style="font-size: 16px; line-height: 1.6;">
        We are excited to see your collaboration move forward. Keep up the great work!
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="#" style="background-color: #0d6efd; color: white; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold;">View Proposal</a>
      </div>

      <p style="font-size: 14px; color: #777;">If you have any questions, feel free to contact our support team.</p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8f9fa; color: #555; padding: 15px; text-align: center; font-size: 12px;">
      JDADZOK Team &copy; ${new Date().getFullYear()} | All rights reserved
    </div>
  </div>
`;
