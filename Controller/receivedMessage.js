const {
    WABAClient
} = require("whatsapp-business");
const express = require("express");
const app = express();

const axios = require("axios");

const wabaClient = new WABAClient({
    accountId: process.env.ACCOUNT_ID,
    phoneId: process.env.PHONE_ID,
    apiToken: process.env.API_TOKEN,
});



exports.receiveMessage = async (payload, contact ,metadata) => {
   
    try {
        const messageId = payload.id.toString();


        console.log(payload);
        if(payload.type== "contacts")
        {
            console.log(payload.contacts[0].name[0]);
            console.log(payload.contacts[0].phones[0])
        }
        if(payload.type=== "image")
        {
            axios.get(`https://graph.facebook.com/v18.0/${payload.image.id}`, {
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
        
        
        const contactNumber = contact.wa_id;
        //Mark message as read
        await wabaClient.markMessageAsRead(messageId);
        //React to message
        await wabaClient.sendMessage({
            to: contactNumber,
            type: "reaction",
            reaction: {
                message_id: messageId,
                emoji: "😄"
            },
        });
        //Respond to message
        await wabaClient.sendMessage({
            type: "text",
            to: contactNumber,
            text: {
                body: "Ok!"
            },
            //This is optional, it enables reply-to feature
            context: {
                message_id: messageId,
            },
        });
    } catch (err) {
        console.log(err);
    }
};