const nodemailer = require("nodemailer");
require('dotenv').config();
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
        // this.from = Cloud Wave <${process.env.GMAIL_EMAIL}>;
        // @ts-ignore
        this.from =  'shadyamr101010@gmail.com';
        this.reason = reason;
    }
    creatTransport(){
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'shadyamr101010@gmail.com',
                pass: 'gtgzycokbqdffdwt'
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