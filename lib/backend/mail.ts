// @ts-ignore
import nodemailer from "nodemailer";

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp",
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: "skillsbridgeinfo@gmail.com",
    pass: "deva nrkm yres izqz",
  },
});

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `https://app.skillsbridge.eu/password?token=${token}`;

  try {
    // Send mail with defined transport object
    await transporter.sendMail({
      from: "skillsbridgeinfo@gmail.com", // sender address
      to: email, // list of receivers
      subject: "Reset your password", // Subject line
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`, // html body
    });

    console.log("Password reset email sent successfully.");
  } catch (error) {
    console.error("Error occurred while sending password reset email:", error);
  }
};
