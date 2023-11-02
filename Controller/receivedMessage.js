const {
    WABAClient
} = require("whatsapp-business");

const wabaClient = new WABAClient({
    accountId: process.env.ACCOUNT_ID,
    phoneId: process.env.PHONE_ID,
    apiToken: process.env.API_TOKEN,
});



exports.receiveMessage = async (payload, contact) => {
    try {
        const messageId = payload.id.toString();


        console.log(payload);

        console.log(contact);
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