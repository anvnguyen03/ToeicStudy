import nodemailer from "nodemailer"
import dotenv from "dotenv"
import colors from "colors"

dotenv.config()

export const sendEmail = async (email: string, subject: string, message: string) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: message
    }

    try {
        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.log(colors.red(`Failed to send email: ${error}`))
    }
}