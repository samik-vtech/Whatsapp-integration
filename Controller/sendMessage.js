const {
    WABAClient
} = require("whatsapp-business");
const fs = require('fs');
const dotenv = require("dotenv");
dotenv.config();
const wabaClient = new WABAClient({
    accountId: process.env.ACCOUNT_ID,
    phoneId: process.env.PHONE_ID,
    apiToken: process.env.API_TOKEN,
});

exports.sendMessage = async (req, res) => {

    const {
        texts,
        type,
    } = req.body;
    try {
        console.log("this is send message controller");

        if (type === "text") {
            await wabaClient.sendMessage({
                to: "9779863706770",
                type: "text",
                text: {
                    body: texts
                }
            }).then((response) => {
                console.log(response);

                return res.json({
                    message: "message sent successfully"
                });
            }).catch((err) => {
                console.log(err);
                return res.json({
                    message: "message send failed"
                });
            });
        } else if (type === "image") {
            const imagePath = "G:\\NodeJSPractise\\whatsappNodeIntegration\\Controller\\sportscarr.png";

            const imageBuffer = fs.readFileSync(imagePath);
            console.log(imageBuffer);
            await wabaClient.sendMessage({
                type: "image",
                to: "9779863706770",
                image: {
                    link: "https://images.unsplash.com/photo-1597431842922-d9686a23baa6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY5NzY5NTU2NQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
                    caption: texts
                }


                // image: {
                //     buffer: imageBuffer,
                //     caption: texts
                // }
            }).then((response) => {
                console.log(response);

                return res.json({
                    message: "Image message sent successfully"
                });
            }).catch((err) => {
                console.log(err);
                return res.json({
                    message: "message send failed"
                });
            });
        } else if (type === "document") {
            await wabaClient.sendMessage({
                type: "document",
                to: "9779863706770",
                document: {
                    link: "https://research.nhm.org/pdfs/25380/25380-001.pdf",
                    caption: texts
                }
            }).then((response) => {
                console.log(response);

                return res.json({
                    message: "Document message sent successfully"
                });
            }).catch((err) => {
                console.log(err);
                return res.json({
                    message: "message send failed"
                });
            });
        } else {
            return res.json({
                message: "Message type is invalid should be either text, image or document"
            })
        }



    } catch (err) {
        console.error(err.message);
    }
};