const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS
    }
})


const sendResetEmail = async (email,token)=>{
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`

    await transporter.sendMail({
        from : `"support" <${process.env.EMAIL_USER}>`,
        to : email,
        html : `
        <h3>Reset Password</h3>
        <p>Click the link below to reset password</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Expires in 15 minutes</p>
        `
    })
}

module.exports = sendResetEmail;
