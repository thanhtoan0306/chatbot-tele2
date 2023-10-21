const TelegramBot = require("node-telegram-bot-api");
const token = "6960124967:AAHvCr9g4yoY0g5cgEKcD6Efv-3NXUgiehE";
const axios = require("axios");
const https = require("https");
// Create an HTTPS agent with a minimum DH key size
const agent = new https.Agent({
  minDHSize: 2048, // Adjust the minimum key size as needed
});

// Helper function to format the date as DD/MM/YYYY
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

async function makeRequest(callback) {
  const url = "https://www.evnhcmc.vn/Tracuu/ajax_dienNangTieuThuTheoNgay";
  const headers = {
    Accept: "application/json, text/javascript, */*; q=0.01",
    "Accept-Language": "vi,en-US;q=0.9,en;q=0.8,vi-VN;q=0.7,ja-JP;q=0.6,ja;q=0.5,fr-FR;q=0.4,fr;q=0.3",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    Cookie:
      "evn_session=rp27pdsl7c7rq5aadh7hpr46vso667f1; LG=45c4d64fe9a7ae55bc31cb11683ebdd4d48fb275a1520f0275c7807cc3bff9f4330176783994574fc28197b6e91c2ba0fbaaec28f4d05d736dd6a13192ec06acpCpvvdZCP9kwnJ4XOeeUk1l1a7rZrRZQaq0sgXrwujLOm3e%2BI%2FRiLXM0wFYD%2Fq8CWg2H92gKITkj8PvD%2Bd2AsQ%3D%3D; TS01128427=018b6f63b41bf67668ae5285ecc13b362e927dfec4f8e105ff847cd72ed14b12cc155ae09e861f77e05cec358fa36830248b571723df21b3fec261426d94d0711f6fcf97b0",
    Origin: "https://www.evnhcmc.vn",
    Pragma: "no-cache",
    Referer: "https://www.evnhcmc.vn/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest",
    "sec-ch-ua": '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    httpsAgent: agent
  };
  // Get the current date
  const today = new Date();

  // Get the first day of the current month
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Format the dates as DD/MM/YYYY
  const firstDayFormatted = formatDate(firstDayOfMonth);
  const todayFormatted = formatDate(today);

  const data = `token=&input_makh=PE03000086905&input_tungay=${firstDayFormatted}&input_denngay=${todayFormatted}`;

  try {
    const response = await axios.post(url, data, { headers });
    console.log(response.data);
    callback(response.data);
  } catch (error) {
    console.error(error);
  }
}

makeRequest((msg) => {
  console.log(msg, msg?.data?.sanluong_tong?.Tong);
});

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
    makeRequest((msg) => {
      console.log(msg, msg?.data?.sanluong_tong?.Tong);
      bot.sendMessage(chatId, `Chatbot của thanhtoan 🤖. Chỉ số điện tiêu thụ hiện tại là: ${msg?.data?.sanluong_tong?.Tong}`);
    });
  }, delay);

  // Send a confirmation message to the user
  bot.sendMessage(chatId, `Bạn sẽ nhận tin nhắn Chỉ số điện tiêu thụ mỗi ngày vào ${time}.`);
});
