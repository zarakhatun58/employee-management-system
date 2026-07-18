import nodemailer from "nodemailer";
import { config } from "../config/env";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailOptions): Promise<void> {
  await transporter.sendMail({
    from: `"Employee Management System" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
    text,
  });
}

export function forgotPasswordTemplate(
  name: string,
  resetLink: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Password Reset</title>
</head>

<body style="font-family:Arial;background:#f5f5f5;padding:30px;">

<div style="max-width:600px;background:white;margin:auto;padding:40px;border-radius:8px;">

<h2>Password Reset</h2>

<p>Hello <strong>${name}</strong>,</p>

<p>
We received a request to reset your password.
</p>

<p>
Click the button below to create a new password.
</p>

<p style="margin:30px 0;">
<a
href="${resetLink}"
style="
background:#2563eb;
color:white;
padding:14px 24px;
text-decoration:none;
border-radius:6px;
display:inline-block;
">
Reset Password
</a>
</p>

<p>
This link expires in <strong>30 minutes</strong>.
</p>

<p>
If you didn't request this, simply ignore this email.
</p>

<hr>

<p style="font-size:12px;color:#888;">
Employee Management System
</p>

</div>

</body>
</html>
`;
}

export function welcomeTemplate(name: string): string {
  return `
<!DOCTYPE html>
<html>

<body style="font-family:Arial">

<h2>Welcome ${name}</h2>

<p>
Your Employee Management System account has been created successfully.
</p>

<p>
You can now log in using your assigned credentials.
</p>

</body>

</html>
`;
}