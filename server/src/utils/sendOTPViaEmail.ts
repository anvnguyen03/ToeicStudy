import nodemailer from "nodemailer"
import dotenv from "dotenv"
import colors from "colors"

dotenv.config()

export const sendOTPViaMail = async (email: string, otp: string) => {
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
        subject: "Here is your OTP for registration",
        text: `Your OTP: ${otp}`
    }

    try {
        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.log(colors.red(`Failed to send email: ${error}`))
    }
}