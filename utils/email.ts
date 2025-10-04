import siteMeta from "@/data/site-meta";
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

type EmailType =
  | "WELCOME"
  | "ORDER_CONFIRMATION"
  | "SUPPORT"
  | "SUBSCRIPTION"
  | "RATING_REQUEST";

const SITE_NAME = siteMeta.site_name || "Local Store";

const getFromEmail = (emailType: EmailType): string => {
  const address = (() => {
    switch (emailType) {
      case "WELCOME":
        return process.env.EMAIL_FROM_HELLO || `hello@${siteMeta.email_domain}`;
      case "ORDER_CONFIRMATION":
        return (
          process.env.EMAIL_FROM_ORDERS || `orders@${siteMeta.email_domain}`
        );
      case "SUPPORT":
        return (
          process.env.EMAIL_FROM_SUPPORT || `support@${siteMeta.email_domain}`
        );
      case "SUBSCRIPTION":
        return process.env.EMAIL_FROM_HELLO || `hello@${siteMeta.email_domain}`;
      case "RATING_REQUEST":
        return process.env.EMAIL_FROM_HELLO || `hello@${siteMeta.email_domain}`;
      default:
        return process.env.EMAIL_FROM_HELLO || `hello@${siteMeta.email_domain}`;
    }
  })();

  const name = (() => {
    switch (emailType) {
      case "WELCOME":
        return SITE_NAME;
      case "ORDER_CONFIRMATION":
        return `${SITE_NAME} Orders`;
      case "SUPPORT":
        return `${SITE_NAME} Support`;
      case "SUBSCRIPTION":
        return `${SITE_NAME} Subscriptions`;
      case "RATING_REQUEST":
        return `${SITE_NAME} Rating Requests`;
      default:
        return SITE_NAME;
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
  const subject = `Welcome to ${SITE_NAME}!`;
  const text = `    
    Hello ${userName},
    
    Thank you for signing up! We're excited to have you as part of our community.
    
    At ${SITE_NAME}, you'll find:
    - A wide selection of authentic African and Caribbean foods
    - Fresh ingredients and quality products
    - Great deals and promotions
    
    If you have any questions, feel free to reply to this email.
    
    Best regards,
    The ${SITE_NAME} Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <p>Hello ${userName},</p>
      <p>Thank you for signing up! We're excited to have you as part of our community.</p>
      <p>At ${SITE_NAME}, you'll find:</p>
      <ul>
        <li>A wide selection of authentic African and Caribbean foods</li>
        <li>Fresh ingredients and quality products</li>
        <li>Great deals and promotions</li>
      </ul>
      <p>If you have any questions, feel free to reply to this email.</p>
      <p>Best regards,<br>The ${SITE_NAME} Team</p>
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
    
    Thank you for your order at ${SITE_NAME}! We're preparing your delivery.
    
    Order Details:
    ${items
      .map(
        (item) => `
    - ${item.product.name}
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
    ${address.postcode.toUpperCase()}
    
    Delivery Date: ${deliveryDate.toLocaleDateString()}
    Delivery Time: ${deliveryTime}
    
    If you have any questions about your order, please reply to this email.
    
    Best regards,
    The ${SITE_NAME} Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Order Confirmation #${orderId}</h1>
      <p>Hello ${firstName} ${lastName},</p>
      <p>Thank you for your order at ${SITE_NAME}! We're preparing your delivery.</p>
      
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
            <td style="padding: 10px; border: 1px solid #dee2e6;">${item.product.name}</td>
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
        ${address.postcode.toUpperCase()}
      </p>
      
      <p>
        <strong>Delivery Date:</strong> ${deliveryDate.toLocaleDateString()}<br>
        <strong>Delivery Time:</strong> ${deliveryTime}
      </p>
      
      <p>If you have any questions about your order, please reply to this email.</p>
      <p>Best regards,<br>The ${SITE_NAME} Team</p>
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
  const subject = `Verify your ${SITE_NAME} subscription`;
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-subscription?token=${token}`;
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?email=${encodeURIComponent(userEmail)}`;

  const text = `
    Thank you for subscribing to ${SITE_NAME}!
    
    Please verify your subscription by clicking the link below:
    ${verificationUrl}
    
    If you didn't request this subscription, you can safely ignore this email.
    
    Best regards,
    The ${SITE_NAME} Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Verify Your Subscription</h1>
      <p>Thank you for subscribing to ${SITE_NAME}!</p>
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
      <p>Best regards,<br>The ${SITE_NAME} Team</p>
      
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
    .map((item) => `${item.quantity}x ${item.product.name}`)
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

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>New Order Received!</h1>
      
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Customer:</strong> ${customerName}</p>
      <p><strong>Total:</strong> £${(total / 100).toFixed(2)}</p>
      <p><strong>Delivery Date:</strong> ${deliveryDate.toLocaleDateString()}</p>
      <p><strong>Delivery Time:</strong> ${deliveryTime}</p>

      <h2>Items:</h2>
      <ul>
        ${items.map((item) => `<li>${item.quantity}x ${item.product.name}</li>`).join("")}
      </ul>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: `New Order #${orderId}`,
    text: emailContent,
    html,
    emailType: "ORDER_CONFIRMATION",
  });
}

export async function sendDeliveryReminderEmail({
  email,
  orderId,
  items,
  deliveryDate,
  deliveryTime,
  customerName,
}: {
  email: string;
  orderId: string;
  items: any[];
  deliveryDate: Date;
  deliveryTime: string;
  customerName: string;
}) {
  const subject = `Your Order #${orderId} Delivery Reminder`;

  const text = `
Delivery Reminder

Hello ${customerName},

Your order #${orderId} is scheduled for delivery:

Please ensure someone is available to receive the delivery.
Keep your phone handy - our driver may need to contact you.

Date: ${deliveryDate.toLocaleDateString()}
Time: ${deliveryTime}

Order Items:
${items.map((item) => `${item.quantity}x ${item.product.name}`).join("\n")}

Thank you for choosing ${SITE_NAME}!
`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Delivery Reminder</h2>
      <p>Hello ${customerName},</p>
      <p>Your order #${orderId} is scheduled for delivery:</p>
      <p>Please ensure someone is available to receive the delivery</p>
      <p>Keep your phone handy - our driver may need to contact you</p>
      <p>
        <strong>Date:</strong> ${deliveryDate.toLocaleDateString()}<br>
        <strong>Time:</strong> ${deliveryTime}
      </p>
      
      <h3>Order Items:</h3>
      <ul>
        ${items
          .map(
            (item) => `
          <li>${item.quantity}x ${item.product.name}</li>
        `,
          )
          .join("")}
      </ul>
      
      <p>Thank you for choosing ${SITE_NAME}!</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    text,
    html,
    emailType: "ORDER_CONFIRMATION",
  });
}

export async function sendRatingRequestEmail({
  email,
  orderId,
}: {
  email: string;
  orderId: string;
}) {
  const subject = `How was your order?`;
  const ratingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/rate-order/${orderId}`;

  const text = `
We'd love to hear your feedback!

Please rate your recent order from ${SITE_NAME}.
Rate your order here: ${ratingLink}

Thank you for choosing ${SITE_NAME}!
    `;

  const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>How was your order?</h2>
        <p>We'd love to hear your feedback about your recent order from ${SITE_NAME}.</p>
        <p style="margin: 30px 0; text-align: center;">
          <a href="${ratingLink}" 
             style="padding: 12px 24px; 
                    background: #4CAF50; 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 5px;
                    display: inline-block;">
            Rate Your Order
          </a>
        </p>
        <p>Thank you for choosing ${SITE_NAME}!</p>
      </div>
    `;

  return sendEmail({
    to: email,
    subject,
    text,
    html,
    emailType: "RATING_REQUEST",
  });
}
