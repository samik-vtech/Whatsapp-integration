const {
    WABAClient,
    WebhookClient,
    WABAEventType
} = require("whatsapp-business");
const crypto = require('crypto');


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


app.get('/whatsapp/webhook', (req, res) => {
    console.log(req);
    
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Check if the mode and token parameters exist
    if (mode && token) {
        if (mode === 'subscribe' && token === process.env.SECRET_TOKEN ) {
            console.log('Webhook verified');
            res.status(200).send(challenge);

        } else {
            console.log("NOT VERIFIED")
            // Verification failed
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(400);
    }
});

app.post('/whatsapp/webhook', (req, res) => {
    console.log(req.body);
    
    const payload = req.body;


    // console.log(req.body.entry[0].changes[0]);
    // console.log(req.body.entry[0].changes[0].value.contacts[0])

    console.log("this is sender Id",req.body.entry[0].id)
    
    console.log(req.body.entry[0].changes[0].value.messages[0].from);
    

    const payloaddata= req.body.entry[0].changes[0].value.messages[0]

    // console.log(payloaddata);

    let type =req.body.entry[0].changes[0].value.messages[0].type
        console.log("Received Type>>",type)

        if(type==="image")
        {
            axios.get(`https://graph.facebook.com/v18.0/${payloaddata.image.id}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.API_TOKEN}`
                }
            })
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
                return res.status(500).json({
                    error: error
                });
            });
        }

    res.status(200).send('OK');
});




//The token and path must match the values you set on the application management

// const webhookClient = new WebhookClient({
//     token: process.env.SECRET_TOKEN,
//     path: "/whatsapp/webhook",
//     expressApp: {
//         shouldStartListening: true,
//         app: app,

//     },
//     debug: true,

// });
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



const subscriptionUrl = `https://graph.facebook.com/${process.env.CLIENT_ID}/subscriptions`;
// const app_access_token ="637948068419483|Xf7Rv2Lx_ljfgzs2BsblqMMuPKs";
 axios.get(`https://graph.facebook.com/oauth/access_token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=client_credentials`).then((response)=>{
    const app_access_token= response.data.access_token;
console.log(app_access_token);
    const postData = {
        object: 'whatsapp_business_account',
        callback_url: 'https://f17f-182-50-67-125.ngrok-free.app/whatsapp/webhook',
        fields: ['messages'],
        verify_token: process.env.SECRET_TOKEN,
        access_token: app_access_token,
      };
      
      app.post("/subscribe",async(req, res)=>{
      
      await axios.post(subscriptionUrl, postData)
        .then(response => {
          console.log('Subscription successful:', response.data);
          return res.status(200).json(response.data)
        })
        .catch(error => {
          console.error('Subscription failed:', error);
        });
      
      })

 }).catch(err=>{
    console.log(err);
 });





const url = `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&set_token_expires_in_60_days=${process.env.EXPIRES_TOKEN}&fb_exchange_token=${process.env.API_TOKEN}`;

const appSecret = process.env.CLIENT_SECRET;
const accessToken = process.env.API_TOKEN;


app.get('/getaccesstoken', (req, res) => {
    axios.get(url)
        .then((response) => {
            res.json(response.data);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
});


// Make the GET request to the API
app.get('/refreshtoken', (req, res) => {
    axios.get(url)
        .then((response) => {
            res.json(response.data);
        })
        .catch((error) => {
            res.status(500).json({
                error: error
            });
        });
});



// sendMessageGraphAPIMessageTemplate();

app.use("/", sendmessageRouter);

const foo = async () => {
    try {
        const res = await wabaClient.getBusinessPhoneNumbers();
        res.data.map(item=>console.log(item))
    } catch (err) {
        const error = err;
        console.error(error.message);
    }
};

foo();

// //Starts a server and triggers the received functions based on the webhook event type
// webhookClient.initWebhook({
//     //if express app is not set then this will get triggered
//     onStartListening: () => {
//         console.log("Server started listening");
//     },
    


//     onTextMessageReceived: receiveMessage,

//     onMessageReceived: receiveMessage
// });

app.listen(3000, () => {
    console.log("server is listening at 3000");
})