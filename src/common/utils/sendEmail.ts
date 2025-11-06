import { createTransport, SendMailOptions } from "nodemailer";


export const sendEmail = async (data: SendMailOptions) => {
    // Create a test account or replace with real credentials.
    const transporter = createTransport({
        host: "smtp.gmail.com",
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
            user: process.env.NodeMailerEmail,
            pass: process.env.NodeMailerPass,
        },
    });


    const info = await transporter.sendMail({
        from: `"Akram Elgyar" <${process.env.NodeMailerEmail}>`,
        to: data.to,
        subject: data.subject,
        text: data.text,
        html: data.html
    });

    console.log("Message sent:", info);
};
