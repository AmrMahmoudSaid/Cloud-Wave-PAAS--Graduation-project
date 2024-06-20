const nodemailer = require("nodemailer");
const pug = require('pug')
const path = require('path')
const { convert } = require('html-to-text')

export class Emails {
    to: string;
    name:string;
    url?:string;
    from:string;
    reason?:string;



    constructor(email:string,name:string,url?:string, reason?:string) {
        this.to = email;
        this.name =name.split(' ')[0];
        this.url = url;
        // this.from = `Cloud Wave <${process.env.GMAIL_EMAIL}>`;
        this.from = 'Cloud-Wave-PAAS amrmahmoud1900@gmail.com';
        this.reason = reason;
    }
    creatTransport(){
        return nodemailer.createTransport({
        //     Server	smtp.sendgrid.net
        //     Ports
        //     25, 587	(for unencrypted/TLS connections)
        // 465	(for SSL connections)
        // Username	apikey
        // Password	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
            host: 'smtp.sendgrid.net',
            port: 587,
            // secure: false,
            auth: {
                user: 'apikey',
                pass: ""
            }
        });
    }
    async send(templateName:string,subject:string,reason?:string){  // templateName which is a put we send a nice formatted email
        //1 Render HTML based on a pug template
        let html;
        if (templateName==='welcome'){
            html =pug.renderFile(`${__dirname}/../src/email/welcome.pug`,{
                firstName: this.name,
                url: this.url,
                subject
            })
        }
        //2 define email options
        const emailOptions = { // we have to give this option to the email transporter so it could be sent
            from: this.from,
            to: this.to,
            subject,
            html,
            text: convert(html)
        };
        //crate a transport and send email
        await this.creatTransport().sendMail(emailOptions); // sendMail is a transport object function which takes the options and should awaited
    }
    async sendWelcome(){
        await this.send('welcome','Welcome to the Cloud wave Family', 'User create')
    }
}