const nodemailer = require("nodemailer");

module.exports = class Worker {
    constructor(mailinfo) {
        this.mailinfo = mailinfo;
        this.email = process.env.EMAIL;
        this.password = process.env.PASSWORD;
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

    sendEmail = async (data) => {
        return new Promise((resolve, reject) => {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: this.email,
                    pass: this.password,
                }
            })
    
            const { $subject, fullname, email, phone, project, about } = data;
    
            const message = `Fullname: ${fullname}\n`
                            + `Email: ${email}\n`
                            + `Phone number: + ${phone}\n`
                            + `Project type: ${project}\n`
                            + `About project: ${about}\n`
    
            const mail_config = {
                from: email,
                to: this.email,
                subject: $subject || `FEAR Contact Form Submission`,
                text: message,
            };
    
            transporter.sendMail(mail_config, function(error, info) {
                if (error) {
                    console.log(error);
                    return reject({ message: `An error has occured: ${error}`});
                }
                return resolve({ message: 'Email sent succesfully!'})
            })
        })
    }
} 