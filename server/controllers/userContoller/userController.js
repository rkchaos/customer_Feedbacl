
const nodemailer = require("nodemailer");

const UserSchema = require('../../models/Userschema');
const dotenv=require('dotenv').config()


const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.PASSWORDEMAIL,
    },
});

exports.storeuser = async (req, res) => {
    try {
        const { email, name, userId } = req.body;
        if (!email || !name || !userId) {
            return res.status(400).json({ msg: "All fields are required" });
        }


        const userStore = await UserSchema.create({
            email,
            name: name || 'User',
            userId,
        });
        if (userStore) {
            const mailOptions = {
                from: `"GetFeedback" <${process.env.EMAIL_USER}>`,
                to: req.body.email,
                subject: "Welcome to Your App!",
                text: `Hi ${req.body.displayname || 'User'},\n\nThank you for signing up for GetFeedback! We’re excited to have you on board.\n\nBest Regards,\nYour GetFeedback`,
            };
            transporter.sendMail(mailOptions)
                .then(() => {
                    console.log("Welcome email sent to:", req.body.email);
                })
                .catch((error) => {
                    console.error("Error sending welcome email:", error);
                });
        }

        res.status(200).json({ msg: "User created successfully" });
    } catch (err) {

        res.status(500).json({ msg: "Error creating user", error: err.message });
    }
};
exports.currentUser = async (req, res) => {
    try {
        let{uid}=req.body
        // console.log(uid)
        if(!uid){
            return res.status(400).json({ msg: "All fields are required" });
        }

        let fetchuid=await UserSchema.findOne({userId:uid})
        if(fetchuid){
            return res.status(200).json({ msg: "fetched succesfully",fetchuid });
        }
        else{
            return res.status(400).json({ msg: "error while fetching" });
        }

    }
    catch (err) {
        res.status(500).json({ msg: "Error creating user", error: err.message });
    }
}







