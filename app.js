import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";

dotenv.config();

let token = process.env.token;
const keys = [
  "BIKE-WNF-Y48Z-Y897-NAR",
  "BIKE-WNF-V6PA-YJ7Q-DPT",
  "BIKE-XN3-STBJ-YC9G-YKN",
  "BIKE-XNF-TL1P-YT8P-SMF",
  "BIKE-WMQ-SMVH-YW7G-Y7K",
  "BIKE-ZM7-ZQBK-Y49P-338",
  "BIKE-YNK-X12G-YL9G-TNB",
  "BIKE-XM7-SY5B-YT78-JSC",
];

const bot = new TelegramBot(token, {
  polling: true,
});

//  -------------- COMANDS -----------
const commands = [
  {
    command: "start",
    description: "Запуск бота",
  },
  {
    command: "key",
    description: "Получить ключи",
  },
];
bot.setMyCommands(commands);

//  -------------- GAME MENU -----------
//  -------------- GAME MENU -----------
bot.onText(/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `Hello ${msg.chat.first_name}`, {
    reply_markup: {
      keyboard: [[{ text: "key" }]],
      resize_keyboard: true,
    },
  });
});

bot.onText(/key/, (msg) => {
  bot.sendMessage(msg.chat.id, `Pick the game`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🤖 My Clone Army", callback_data: "clone" },
          { text: "🧑‍🍳 Merge Away", callback_data: "merge" },
        ],
        [
          { text: "🎲 Chain Cube", callback_data: "cube" },
          { text: "🏃 Twerk Race", callback_data: "twerk" },
        ],
        [
          { text: "🚂 Train Miner", callback_data: "train" },
          { text: "🐋 Polysphere", callback_data: "poly" },
        ],
        [
          { text: "🚴‍♂️ Riding Extreme", callback_data: "bike" },
          { text: "🧑‍🌾 Mow and Trim", callback_data: "mow" },
        ],
        [{ text: "🏎️ Mud Racing", callback_data: "mud" }],
      ],
    },
  });
});
// ----------------- GENERATION SOURCE ------------
// ----------------- GENERATION SOURCE ------------
// ----------------- GENERATION SOURCE ------------
const config = {
  clone: {
    name: "clone",
    APP_TOKEN: "74ee0b5b-775e-4bee-974f-63e7f4d5bacb",
    PROMO_ID: "fe693b26-b342-4159-8808-15e3ff7f8767",
    EVENTS_DELAY: 120000,
  },
  bike: {
    name: "bike",
    APP_TOKEN: "d28721be-fd2d-4b45-869e-9f253b554e50",
    PROMO_ID: "43e35910-c168-4634-ad4f-52fd764a843f",
    EVENTS_DELAY: 20000,
  },
  train: {
    name: "train",
    APP_TOKEN: "82647f43-3f87-402d-88dd-09a90025313f",
    PROMO_ID: "c4480ac7-e178-4973-8061-9ed5b2e17954",
    EVENTS_DELAY: 120000,
  },
  cube: {
    name: "cube",
    APP_TOKEN: "d1690a07-3780-4068-810f-9b5bbf2931b2",
    PROMO_ID: "b4170868-cef0-424f-8eb9-be0622e8e8e3",
    EVENTS_DELAY: 20000,
  },
  merge: {
    name: "merge",
    APP_TOKEN: "8d1cc2ad-e097-4b86-90ef-7a27e19fb833",
    PROMO_ID: "dc128d28-c45b-411c-98ff-ac7726fbaea4",
    EVENTS_DELAY: 20000,
  },
  twerk: {
    name: "twerk",
    APP_TOKEN: "61308365-9d16-4040-8bb0-2f4a4c69074c",
    PROMO_ID: "61308365-9d16-4040-8bb0-2f4a4c69074c",
    EVENTS_DELAY: 20000,
  },

  mud: {
    name: "mud racing",
    APP_TOKEN: "8814a785-97fb-4177-9193-ca4180ff9da8",
    PROMO_ID: "8814a785-97fb-4177-9193-ca4180ff9da8",
    EVENTS_DELAY: 20000,
  },
  mow: {
    name: "mow trim",
    APP_TOKEN: "ef319a80-949a-492e-8ee0-424fb5fc20a6",
    PROMO_ID: "ef319a80-949a-492e-8ee0-424fb5fc20a6",
    EVENTS_DELAY: 20000,
  },
  poly: {
    name: "polysphere",
    APP_TOKEN: "2aaf5aee-2cbc-47ec-8a3f-0962cc14bc71",
    PROMO_ID: "2aaf5aee-2cbc-47ec-8a3f-0962cc14bc71",
    EVENTS_DELAY: 3000,
  },
};

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const userSelection = query.data;

  bot.sendMessage(chatId, `Picked: ${userSelection}`);
  if (config[userSelection]) {
    const selectedConfig = config[userSelection];
    await handleProcess(chatId, selectedConfig);
  } else {
    bot.sendMessage(chatId, "Неверный выбор. Пожалуйста, попробуйте снова.");
  }
});

async function handleProcess(chatId, selectedConfig) {
  try {
    let progress = 0;
    const keyCount = 4  ;

    const updateProgress = (increment) => {
      progress += increment;
      // bot.sendMessage(chatId, `Progress: ${Math.round(progress)}%`);
    };
   
    


    const keys = await Promise.all(
      Array.from({ length: keyCount }, () =>
        generateKeyProcess(selectedConfig, updateProgress)
      )
    );
    // const validKeys = keys.filter((key) => key).join("\n");

    keys.filter((key) => key).forEach((key) => {
      bot.sendMessage(chatId, `\`${key}\``, {
        parse_mode: "MarkdownV2",
      });
    });
    // bot.sendMessage(chatId, `Generated keys:\n${validKeys}`);
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
}

async function generateKeyProcess(selectedConfig, updateProgress) {
  const clientId = generateClientId();
  let clientToken;

  try {
    clientToken = await login(selectedConfig.APP_TOKEN, clientId);
  } catch (error) {
    throw new Error(`Login failed: ${error.message}`);
  }

  for (let i = 0; i < 7; i++) {
    await sleep(selectedConfig.EVENTS_DELAY * delayRandom());
    const hasCode = await emulateProgress(clientToken, selectedConfig.PROMO_ID);
    updateProgress(10 / 4); // Обновляем прогресс
    if (hasCode) {
      break;
    }
  }

  try {
    const key = await generateKey(clientToken, selectedConfig.PROMO_ID);
    updateProgress(30 / 4); // Финализация прогресса
    return key;
  } catch (error) {
    throw new Error(`Key generation failed: ${error.message}`);
  }
}

function generateClientId() {
  const timestamp = Date.now();
  const randomNumbers = Array.from({ length: 19 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  return `${timestamp}-${randomNumbers}`;
}

async function login(appToken, clientId) {
  const response = await fetch("https://api.gamepromo.io/promo/login-client", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ appToken, clientId, clientOrigin: "deviceid" }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to login");
  }
  return data.clientToken;
}

async function emulateProgress(clientToken, promoId) {
  const response = await fetch(
    "https://api.gamepromo.io/promo/register-event",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${clientToken}`,
      },
      body: JSON.stringify({
        promoId,
        eventId: crypto.randomUUID(),
        eventOrigin: "undefined",
      }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to register event");
  }
  return data.hasCode;
}

async function generateKey(clientToken, promoId) {
  const response = await fetch("https://api.gamepromo.io/promo/create-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${clientToken}`,
    },
    body: JSON.stringify({ promoId }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to generate key");
  }
  return data.promoCode;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function delayRandom() {
  return Math.random() / 3 + 1;
}
