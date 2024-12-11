const nodemailer = require("nodemailer");

module.exports = class Worker {
    constructor(mailinfo) {
        this.mailinfo = mailinfo;
        this.email = mailinfo.smtp.auth.user;
    }

    /**
     * Send a message.
     *
     * @param  options An object containing to, from, subject and text properties (matches the IContact interface,
     *                   but can't be used since the type comes from nodemailer, not app code).
     * @return           A Promise that eventually resolves to a string (null for success, error message for an error).
     */
    sendMessage = async (options) => { 
        return new Promise((res, req) => {
            const transport = nodemailer.createTransport(this.mailinfo.smtp);
            
            transport.sendMail( options, (error, info) => { 
                if (error) return reject(error);
                return resolve();  
            });
        });
    }

    sendProjectEmail = async (data) => {
        return new Promise((resolve, reject) => {
            let transporter = nodemailer.createTransport(this.mailinfo.smtp);

            const { $subject, fullname, company, email, phone, budget, about } = data;
    
            const message = `Fullname: ${fullname}\n`
                            + `Email: ${email}\n`
                            + `Budget: ${budget}\n`
                            + `Phone number: + ${phone}\n`
                            + `Company: ${company}\n`
                            + `About project: ${about}\n`
    
            const options = {
                from: email,
                to: this.email,
                subject: $subject || `Gfolio Contact Form Submission`,
                text: message,
            };
    
            transporter.sendMail(options, function(error, info) {
                if (error) {
                    return reject({ message: `An error has occured: ${error}`});
                }
                return resolve({ message: 'Email sent succesfully!'})
            })
        })
    }

    sendContactEmail = async (data) => {
        return new Promise((resolve, reject) => {
            let transport = nodemailer.createTransport(this.mailinfo.smtp);
            const { $subject, email, message } = data;

            const options = {
                from: this.email,
                to: this.email,
                subject:"Contact Form Submission from " + email,
                text: message,
            }

            transport.sendMail(options, function(error, info) {
                if (error) {
                    console.log(error);
                    return reject({ message: `An error has occured: ${error}`});
                }
                return resolve({ message: 'Email sent succesfully!'})
            })
        })
    }
} 