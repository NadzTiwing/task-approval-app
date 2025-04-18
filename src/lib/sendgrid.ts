import sgMail from "@sendgrid/mail";

// Get base URL from headers in server-side code
const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  // Client-side - get from window.location
  const protocol = window.location.protocol;
  const host = window.location.host;
  return `${protocol}//${host}`;
};

export const sendEmail = async (to: string, token: string, task: string) => {
  sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY!);

  const baseUrl = getBaseUrl();

  const msg = {
    to,
    from: process.env.NEXT_PUBLIC_SENDGRID_SENDER!,
    subject: "Task Approval Request", 
    html: `<div>
    <p>You have a new task: ${task} </p>
    <p>Please review and respond using the link below:</p>
    <a href="${baseUrl}/response?token=${token}">${baseUrl}/response?token=${token}</a>
    </div>`,
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
};
