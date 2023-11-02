const WhatsApp = require("whatsapp");

const sendernumber = "+15550703719";
const recipient_number = "+9779863706770"; // Ensure the correct format with the country code

const dotenv = require("dotenv");

dotenv.config();
const encodedEndpoint = encodeURIComponent(process.env.WA_BASE_URL);
const encodedEndpoint1 = encodeURIComponent(process.env.WEBHOOK_ENDPOINT);

const config = {
    "wa_base_url": encodedEndpoint,
    "m4d_app_id": +process.env.M4D_APP_ID,
    "m4d_app_secret": process.env.M4D_APP_SECRET,
    "wa_phone_number_id": +process.env.WA_PHONE_NUMBER_ID,
    "wa_business_account_id": +process.env.WA_BUSINESS_ACCOUNT_ID,
    "cloud_api_version": process.env.CLOUD_API_VERSION,
    "cloud_api_access_token": process.env.CLOUD_API_ACCESS_TOKEN,
    "webhook_endpoint": encodedEndpoint1,
    "webhook_verification_token": process.env.WEBHOOK_VERIFICATION_TOKEN,
    "listener_port": +process.env.LISTENER_PORT,
    "debug": process.env.DEBUG,
    "max_retries_after_wait": +process.env.MAX_RETRIES_AFTER_WAIT,
    "request_timeout": +process.env.REQUEST_TIMEOUT,

}
const wa = new WhatsApp({
    config: config,
});

async function send_message() {
    try {
        const sent_text_message = await wa.messages.text({
            body: "Hello world"
        }, recipient_number);

        console.log(sent_text_message.rawResponse());
    } catch (e) {
        console.error(JSON.stringify(e));
    }
}

send_message();