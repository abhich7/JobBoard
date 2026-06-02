const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Welcome Email
const sendWelcomeEmail = async (to, name) => {
  await transporter.sendMail({
    from: `"JobBoard" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Welcome to JobBoard! 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2563eb; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Welcome to JobBoard!</h1>
        </div>
        <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1e293b;">Hi ${name}! 👋</h2>
          <p style="color: #64748b;">Your account has been created successfully.</p>
          <p style="color: #64748b;">Start exploring thousands of job opportunities today!</p>
          <a href="http://localhost:5173/jobs" 
             style="display: inline-block; background: #2563eb; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px;">
            Browse Jobs
          </a>
        </div>
      </div>
    `,
  });
};

// Application Submitted Email
const sendApplicationEmail = async (to, name, jobTitle) => {
  await transporter.sendMail({
    from: `"JobBoard" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Application Submitted: ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2563eb; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Application Submitted!</h1>
        </div>
        <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1e293b;">Hi ${name}! 👋</h2>
          <p style="color: #64748b;">Your application for <strong>${jobTitle}</strong> has been submitted successfully.</p>
          <p style="color: #64748b;">Track your application status in your dashboard.</p>
          <a href="http://localhost:5173/seeker/applied-jobs"
             style="display: inline-block; background: #2563eb; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px;">
            View Applications
          </a>
        </div>
      </div>
    `,
  });
};

// Status Update Email
const sendStatusUpdateEmail = async (to, name, jobTitle, status) => {
  const colors = {
    Shortlisted: "#16a34a",
    Rejected: "#dc2626",
    Pending: "#d97706",
  };

  await transporter.sendMail({
    from: `"JobBoard" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Application Update: ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2563eb; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Application Update</h1>
        </div>
        <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1e293b;">Hi ${name}! 👋</h2>
          <p style="color: #64748b;">Your application for <strong>${jobTitle}</strong> has been updated.</p>
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: ${colors[status] || "#2563eb"};">
              Status: ${status}
            </p>
          </div>
          <a href="http://localhost:5173/seeker/applied-jobs"
             style="display: inline-block; background: #2563eb; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            View Applications
          </a>
        </div>
      </div>
    `,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendApplicationEmail,
  sendStatusUpdateEmail,
};