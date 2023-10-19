const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const openai = require('openai');
const openaiClient = new openai({ key: process.env.OPEN_AI_KEY });
// console.log(openaiClient)


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/webhook', async (req, res) => {
  const incomingMessage = req.body.Body;
  const senderWhatsAppNumber = req.body.From;
  const chatHistory = [];

  // Implement DALL·E image generation here or call an image generation service.
  // Replace the following line with code to generate the image URL.
  const imageGenerationResult = await generateImageWithDALLE(incomingMessage);

  chatHistory.push({ sender: senderWhatsAppNumber, message: incomingMessage ,imageurl:imageGenerationResult});
  

  // Send the generated image as a reply
  const message = await client.messages.create({
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NO}`,
    body: 'Here is the image you requested:',
    mediaUrl: [imageGenerationResult], // Replace with the actual image URL
    to: senderWhatsAppNumber,
  });
  console.log(chatHistory);
  console.log(`Sent image to ${senderWhatsAppNumber}: ${message.sid}`);

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('Webhook server is listening on port 3000');
});

// Implement DALL·E image generation function or integrate with a service.
async function generateImageWithDALLE(text) {
  // Implement image generation logic here.
  // This function should return the URL of the generated image.
  // You can use external APIs or services to generate images.
  // Replace this placeholder with the actual implementation.
  console.log(text)
  const response = await openaiClient.images.generate({
    prompt: text,
    n: 1,
    size: "1024x1024",
  });
  image_url = response.data[0].url;
  console.log(image_url)
  return image_url;
}
