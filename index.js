const TelegramBot = require("node-telegram-bot-api");
const token = "6960124967:AAHvCr9g4yoY0g5cgEKcD6Efv-3NXUgiehE";

// Create a new bot instance
const bot = new TelegramBot(token, { polling: true });

// Handle text messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  // Process the message and send a reply
  const reply = `You said: ${messageText}`;
  bot.sendMessage(chatId, reply);
});