const config = require('config');
const { Configuration, OpenAIApi } = require("openai");
const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const telegramBotToken = config.get('TelegramBotToken');
const openiaToken = config.get('OpeniaToken');

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(telegramBotToken, {polling: true});

//#region   telegrambot

 // messages.
 bot.on('message', async (msg) => {
 const chatId = msg.chat.id;
 console.log(msg.text)
 var result = "";
 if(msg.text == "/start"){
 result = "Hoşgeldin, ingilizce hatalı cümle yaz doğrusunu öğren :) , örnek: what your name " 
 }
 else {
 result = await correctToGrammer(msg.text);
 }

 // send a message to the chat acknowledging receipt of their message
 bot.sendMessage(chatId, result);
});


//#endregion

//#region  openia
const configuration = new Configuration({
 apiKey: openiaToken,
});
const openai = new OpenAIApi(configuration);

const correctToGrammer = async(question) => { 
 try{
 const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "Correct this to standard English:\n\n"+question,
    max_tokens: 4000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
 });
    
 return response.data.choices[0].text;

 }
catch(error){

 if (error.response) {
 console.log(error.response.status);
 console.log(error.response.data);
 } else {
 console.log(error.message);
}
 }
} 
//#endregion
