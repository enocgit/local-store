import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY environment variable is not set");
}

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  emailType: EmailType;
}

type EmailType = "WELCOME" | "ORDER_CONFIRMATION" | "SUPPORT" | "SUBSCRIPTION";

const getFromEmail = (emailType: EmailType): string => {
  const address = (() => {
    switch (emailType) {
      case "WELCOME":
        return (
          process.env.EMAIL_FROM_HELLO || "hello@tropikalfoodsbradford.com"
        );
      case "ORDER_CONFIRMATION":
        return (
          process.env.EMAIL_FROM_ORDERS || "orders@tropikalfoodsbradford.com"
        );
      case "SUPPORT":
        return (
          process.env.EMAIL_FROM_SUPPORT || "support@tropikalfoodsbradford.com"
        );
      case "SUBSCRIPTION":
        return (
          process.env.EMAIL_FROM_HELLO || "hello@tropikalfoodsbradford.com"
        );
      default:
        return (
          process.env.EMAIL_FROM_HELLO || "hello@tropikalfoodsbradford.com"
        );
    }
  })();

  const name = (() => {
    switch (emailType) {
      case "WELCOME":
        return "Tropikal Foods";
      case "ORDER_CONFIRMATION":
        return "Tropikal Foods Orders";
      case "SUPPORT":
        return "Tropikal Foods Support";
      case "SUBSCRIPTION":
        return "Tropikal Foods Subscriptions";
      default:
        return "Tropikal Foods";
    }
  })();

  return `${name} <${address}>`;
};

// Validate required environment variables
["EMAIL_FROM_HELLO", "EMAIL_FROM_ORDERS", "EMAIL_FROM_SUPPORT"].forEach(
  (envVar) => {
    if (!process.env[envVar]) {
      console.warn(
        `Warning: ${envVar} environment variable is not set, using default value`,
      );
    }
  },
);

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  emailType,
}: EmailData) => {
  try {
    const { data, error } = await resend.emails.send({
      from: getFromEmail(emailType),
      to,
      subject,
      text: text || "",
      html: html || "",
    });

    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};

export const sendWelcomeEmail = async (userEmail: string, userName: string) => {
  const subject = "Welcome to Tropikal Foods Bradford!";
  const text = `    
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

  return sendEmail({
    to: userEmail,
    subject,
    text,
    html,
    emailType: "WELCOME",
  });
};

export const sendOrderConfirmationEmail = async ({
  email,
  orderId,
  items,
  total,
  deliveryFee,
  firstName,
  lastName,
  address,
  deliveryDate,
  deliveryTime,
}: {
  email: string;
  orderId: string;
  items: any[]; // Consider creating a proper type for this
  total: number;
  deliveryFee: number;
  firstName: string;
  lastName: string;
  address: any; // Consider creating a proper type for this
  deliveryDate: Date;
  deliveryTime: string;
}) => {
  const subject = `Order Confirmation #${orderId}`;

  const text = `
    Order Confirmation #${orderId}
    
    Hello ${firstName} ${lastName},
    
    Thank you for your order at Tropikal Foods Bradford! We're preparing your delivery.
    
    Order Details:
    ${items
      .map(
        (item) => `
    - ${item.name}
      Quantity: ${item.quantity}
      Price: £${item.price.toFixed(2)}
      Subtotal: £${(item.price * item.quantity).toFixed(2)}
    `,
      )
      .join("\n")}
    
    Subtotal: £${(total - deliveryFee).toFixed(2)}
    Delivery Fee: £${deliveryFee.toFixed(2)}
    Total: £${total.toFixed(2)}
    
    Delivery Address:
    ${address.address1}
    ${address.address2 ? address.address2 + "\n" : ""}${address.city}
    ${address.postcode}
    
    Delivery Date: ${deliveryDate.toLocaleDateString()}
    Delivery Time: ${deliveryTime}
    
    If you have any questions about your order, please reply to this email.
    
    Best regards,
    The Tropikal Foods Bradford Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Order Confirmation #${orderId}</h1>
      <p>Hello ${firstName} ${lastName},</p>
      <p>Thank you for your order at Tropikal Foods Bradford! We're preparing your delivery.</p>
      
      <h2>Order Details:</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #f8f9fa;">
          <th style="padding: 10px; text-align: left; border: 1px solid #dee2e6;">Item</th>
          <th style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">Quantity</th>
          <th style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">Price</th>
          <th style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">Subtotal</th>
        </tr>
        ${items
          .map(
            (item) => `
          <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${item.name}</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">${item.quantity}</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">£${item.price.toFixed(2)}</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">£${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `,
          )
          .join("")}
        <tr>
          <td colspan="3" style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">Subtotal:</td>
          <td style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">£${(total - deliveryFee).toFixed(2)}</td>
        </tr>
        <tr>
          <td colspan="3" style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">Delivery Fee:</td>
          <td style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">£${deliveryFee.toFixed(2)}</td>
        </tr>
        <tr style="background-color: #f8f9fa; font-weight: bold;">
          <td colspan="3" style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">Total:</td>
          <td style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">£${total.toFixed(2)}</td>
        </tr>
      </table>
      
      <h2>Delivery Details:</h2>
      <p>
        ${address.address1}<br>
        ${address.address2 ? address.address2 + "<br>" : ""}
        ${address.city}<br>
        ${address.postcode}
      </p>
      
      <p>
        <strong>Delivery Date:</strong> ${deliveryDate.toLocaleDateString()}<br>
        <strong>Delivery Time:</strong> ${deliveryTime}
      </p>
      
      <p>If you have any questions about your order, please reply to this email.</p>
      <p>Best regards,<br>The Tropikal Foods Bradford Team</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    text,
    html,
    emailType: "ORDER_CONFIRMATION",
  });
};

// Add subscription verification email function
export const sendSubscriptionVerificationEmail = async (
  userEmail: string,
  token: string,
) => {
  const subject = "Verify your Tropikal Foods subscription";
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-subscription?token=${token}`;
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?email=${encodeURIComponent(userEmail)}`;

  const text = `
    Thank you for subscribing to Tropikal Foods!
    
    Please verify your subscription by clicking the link below:
    ${verificationUrl}
    
    If you didn't request this subscription, you can safely ignore this email.
    
    Best regards,
    The Tropikal Foods Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Verify Your Subscription</h1>
      <p>Thank you for subscribing to Tropikal Foods Bradford!</p>
      <p>Please verify your subscription by clicking the button below:</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" 
           style="background-color: #e11d48; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          Verify Subscription
        </a>
      </p>
      <p style="color: #666; font-size: 0.9em;">
        If you didn't request this subscription, you can safely ignore this email.
      </p>
      <p>Best regards,<br>The Tropikal Foods Bradford Team</p>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
        <p>
          Don't want to receive these emails? 
          <a href="${unsubscribeUrl}" style="color: #666; text-decoration: underline;">
            Unsubscribe here
          </a>
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: userEmail,
    subject,
    text,
    html,
    emailType: "SUBSCRIPTION",
  });
};

export const sendMarketingEmail = async (
  userEmail: string,
  subject: string,
  content: string,
) => {
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?email=${encodeURIComponent(userEmail)}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      ${content}
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
        <p>
          Don't want to receive these emails? 
          <a href="${unsubscribeUrl}" style="color: #666; text-decoration: underline;">
            Unsubscribe here
          </a>
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: userEmail,
    subject,
    html,
    emailType: "SUBSCRIPTION",
  });
};

export async function sendAdminOrderNotificationEmail({
  email,
  orderId,
  items,
  total,
  customerName,
  deliveryDate,
  deliveryTime,
}: {
  email: string;
  orderId: string;
  items: any[];
  total: number;
  customerName: string;
  deliveryDate: Date;
  deliveryTime: string;
}) {
  const formattedItems = items
    .map((item) => `${item.quantity}x ${item.name}`)
    .join("\n");

  const emailContent = `
    New Order Received!
    
    Order ID: ${orderId}
    Customer: ${customerName}
    Total: £${(total / 100).toFixed(2)}
    Delivery Date: ${deliveryDate.toLocaleDateString()}
    Delivery Time: ${deliveryTime}
    
    Items:
    ${formattedItems}
  `;

  // Use your email sending implementation here
  // Example with Resend:
  await sendEmail({
    to: email,
    subject: `New Order #${orderId}`,
    text: emailContent,
    emailType: "ORDER_CONFIRMATION",
  });
}
