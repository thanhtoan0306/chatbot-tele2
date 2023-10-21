const TelegramBot = require("node-telegram-bot-api");
const schedule = require("node-schedule");
const token = "6960124967:AAHvCr9g4yoY0g5cgEKcD6Efv-3NXUgiehE";

// Create a new bot instance
const bot = new TelegramBot(token, { polling: true });
let timeoutId = null;
bot.onText(/\/start (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const time = match[1];

  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }

  // Extract hours and minutes from the specified time
  const [hours, minutes] = time.split(":");

  // Calculate the delay in milliseconds until the specified time
  const now = new Date();
  const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
  const delay = targetTime - now;

  // Schedule the "Good morning" message at the specified time
  timeoutId = setTimeout(() => {
    bot.sendMessage(chatId, "Good morning!");
  }, delay);

  // Send a confirmation message to the user
  bot.sendMessage(chatId, `You will receive a "Good morning" message every day at ${time}.`);
});
