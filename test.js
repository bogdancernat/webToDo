var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "webtodopp@gmail.com",
        pass: "localhost"
    }
});
// setup e-mail data with unicode symbols
var mailOptions = {
    from: "Continental Corporation Iași ✔ <foo@blurdybloop.com>", // sender address
    to: "emil.grigore@info.uaic.ro", // list of receivers
    subject: "Stagiu Continental Iași", // Subject line
    text: "Bună seara," + '\n' + "în urma interviului am ajuns la concluzia că nu sunteți potrivit pentru nici unul dintre stagiile oferite de compania noastră." + '\n' + "O seară bună," + '\n' +"SRL Continental Corporation Iași", // plaintext body
}




var cronJob = require('cron').CronJob;



    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }
    });   
