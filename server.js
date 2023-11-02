const {
    WABAClient,
    WebhookClient,
    WABAEventType
} = require("whatsapp-business");

const express = require("express");
const app = express();
const dotenv = require("dotenv");

const axios = require("axios");
const sendmessageRouter = require("./routes/sendmessage.routes");
const {
    receiveMessage
} = require("./Controller/receivedMessage");

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


//The token and path must match the values you set on the application management

const webhookClient = new WebhookClient({
    token: process.env.SECRET_TOKEN,
    path: "/whatsapp/webhook",
    expressApp: {
        shouldStartListening: true,
        app: app,

    },
    debug: true,

});
const wabaClient = new WABAClient({
    accountId: process.env.ACCOUNT_ID,
    phoneId: process.env.PHONE_ID,
    apiToken: process.env.API_TOKEN,
});

async function sendMessageGraphAPIMessageTemplate() {
    axios({
        method: "POST",
        url: "https://graph.facebook.com/v12.0/143699005494984/messages?access_token=" + process.env.API_TOKEN,
        data: {
            messaging_product: "whatsapp",
            to: "9779863706770",
            type: "template",
            template: {
                "name": "hello_world",
                language: {
                    "code": "en_US"
                }
            },
        },
        headers: {
            "Content-Type": "application/json"
        },
    });
}


// sendMessageGraphAPIMessageTemplate();

app.use("/", sendmessageRouter);

const foo = async () => {
    try {
        const res = await wabaClient.getBusinessPhoneNumbers();
        console.log(res);
    } catch (err) {
        const error = err;
        console.error(error.message);
    }
};

foo();

//Starts a server and triggers the received functions based on the webhook event type
webhookClient.initWebhook({
    //if express app is not set then this will get triggered
    onStartListening: () => {
        console.log("Server started listening");
    },


    onTextMessageReceived: receiveMessage
});

app.listen(3000, () => {
    console.log("server is listening at 3000");
})