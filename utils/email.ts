import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is not set');
}

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  emailType: EmailType;
}

type EmailType = 'WELCOME' | 'ORDER_CONFIRMATION' | 'SUPPORT' | 'ADMIN';

const getFromEmail = (emailType: EmailType): string => {
  switch (emailType) {
    case 'WELCOME':
      return process.env.EMAIL_FROM_HELLO || 'hello@tropikalfoodsbradford.com';
    case 'ORDER_CONFIRMATION':
      return process.env.EMAIL_FROM_ORDERS || 'orders@tropikalfoodsbradford.com';
    case 'SUPPORT':
      return process.env.EMAIL_FROM_SUPPORT || 'support@tropikalfoodsbradford.com';
    case 'ADMIN':
      return process.env.EMAIL_FROM_ADMIN || 'admin@tropikalfoodsbradford.com';
    default:
      return process.env.EMAIL_FROM_HELLO || 'hello@tropikalfoodsbradford.com';
  }
};

// Validate required environment variables
['EMAIL_FROM_HELLO', 'EMAIL_FROM_ORDERS', 'EMAIL_FROM_SUPPORT', 'EMAIL_FROM_ADMIN'].forEach((envVar) => {
  if (!process.env[envVar]) {
    console.warn(`Warning: ${envVar} environment variable is not set, using default value`);
  }
});

export const sendEmail = async ({ to, subject, text, html, emailType }: EmailData) => {
  try {
    const { data, error } = await resend.emails.send({
      from: getFromEmail(emailType),
      to,
      subject,
      text: text || '',
      html: html || '',
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};

// Example welcome email function
export const sendWelcomeEmail = async (userEmail: string, userName: string) => {
  const subject = 'Welcome to Tropikal Foods Bradford!';
  const text = `
    Welcome to Tropikal Foods Bradford!
    
    Hello ${userName},
    
    Thank you for signing up! We're excited to have you as part of our community.
    
    At Tropikal Foods Bradford, you'll find:
    - A wide selection of authentic African and Caribbean foods
    - Fresh ingredients and quality products
    - Great deals and promotions
    
    If you have any questions, feel free to reply to this email.
    
    Best regards,
    The Tropikal Foods Bradford Team
  `;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Welcome to Tropikal Foods Bradford!</h1>
      <p>Hello ${userName},</p>
      <p>Thank you for signing up! We're excited to have you as part of our community.</p>
      <p>At Tropikal Foods Bradford, you'll find:</p>
      <ul>
        <li>A wide selection of authentic African and Caribbean foods</li>
        <li>Fresh ingredients and quality products</li>
        <li>Great deals and promotions</li>
      </ul>
      <p>If you have any questions, feel free to reply to this email.</p>
      <p>Best regards,<br>The Tropikal Foods Bradford Team</p>
    </div>
  `;

  return sendEmail({ to: userEmail, subject, text, html, emailType: 'WELCOME' });
};

// Example order confirmation email
export const sendOrderConfirmationEmail = async (
  userEmail: string,
  userName: string,
  orderNumber: string,
  orderDetails: { name: string; quantity: number; price: number }[]
) => {
  const subject = `Order Confirmation #${orderNumber}`;
  const total = orderDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const text = `
    Order Confirmation #${orderNumber}
    
    Hello ${userName},
    
    Thank you for your order at Tropikal Foods Bradford! We're preparing your items for collection.
    
    Order Details:
    ${orderDetails.map(item => `
    - ${item.name}
      Quantity: ${item.quantity}
      Price: £${item.price.toFixed(2)}
      Subtotal: £${(item.price * item.quantity).toFixed(2)}
    `).join('\n')}
    
    Total: £${total.toFixed(2)}
    
    We'll notify you when your order is ready for collection.
    
    If you have any questions about your order, please reply to this email.
    
    Best regards,
    The Tropikal Foods Bradford Team
  `;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Order Confirmation #${orderNumber}</h1>
      <p>Hello ${userName},</p>
      <p>Thank you for your order at Tropikal Foods Bradford! We're preparing your items for collection.</p>
      
      <h2>Order Details:</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #f8f9fa;">
          <th style="padding: 10px; text-align: left; border: 1px solid #dee2e6;">Item</th>
          <th style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">Quantity</th>
          <th style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">Price</th>
          <th style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">Subtotal</th>
        </tr>
        ${orderDetails.map(item => `
          <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${item.name}</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">${item.quantity}</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">£${item.price.toFixed(2)}</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">£${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `).join('')}
        <tr style="background-color: #f8f9fa; font-weight: bold;">
          <td colspan="3" style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">Total:</td>
          <td style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">£${total.toFixed(2)}</td>
        </tr>
      </table>
      
      <p>We'll notify you when your order is ready for collection.</p>
      <p>If you have any questions about your order, please reply to this email.</p>
      <p>Best regards,<br>The Tropikal Foods Bradford Team</p>
    </div>
  `;

  return sendEmail({ to: userEmail, subject, text, html, emailType: 'ORDER_CONFIRMATION' });
};
