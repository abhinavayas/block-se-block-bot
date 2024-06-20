const express = require("express");
const expressApp = express();
const axios = require("axios");
const path = require("path");
var striptags = require("striptags");

const port = process.env.PORT || 3000;
expressApp.use(express.static("static"));
expressApp.use(express.json());
require("dotenv").config();

const { Telegraf } = require("telegraf");
const BOT_TOKEN = `7100307300:AAE4iqNIO055bgYWpkRa3jwHyamhr_l8fAI`;
const bot = new Telegraf(BOT_TOKEN);

expressApp.get("/", (req, res) => {
  res.status(200).json({
    message: "Running",
  });
});

bot.command("start", (ctx) => {
  console.log(ctx.from);
  bot.telegram.sendMessage(
    ctx.chat.id,
    "Hello there! Welcome to the Code Capsules telegram bot.\nI respond to /ethereum. Please try it",
    {}
  );
});

bot.command("active", (ctx) => {
  console.log(ctx.from);
  axios
    .get(
      `https://api.blockseblock.com/api/v1/hackathon?search=&hackathonStatus=Active&page=1&limit=10`
    )
    .then((response) => {
      let hackathons_info = `Hello ${ctx.from.first_name} ${ctx.from.last_name} (@${ctx.from.username}) check out these  active Hackathons
on https://blockseblock.com/ \n
      `;
      let added = 0;
      for (let i = 0; i < response.data.data.length; i++) {
        if (response.data.data[i].hackathon_status == "Active") {
          if (added == 4) break;
          added++;
          hackathons_info =
            hackathons_info +
            "\n" +
            `${i + 1}. ${response.data.data[i].hackathon_name}
${striptags(response.data.data[i].hackathon_description).slice(0, 500)}...
LINK :https://blockseblock.com/${striptags(
              response.data.data[i].hackathon_id
            ).slice(0, 500)}
Resources : ${response.data.data[i].hackathon_resource_link}
            `;
        }
      }
      const message = `${hackathons_info}`;
      bot.telegram.sendMessage(ctx.chat.id, message, {});
    });
});

bot.command("about", (ctx) => {
  console.log(ctx.from);
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Hello ${ctx.from.first_name} ${ctx.from.last_name} (@${ctx.from.username}) \n
Blockseblock is a dynamic platform designed to empower individuals and organizations to launch and participate in hackathons worldwide. Whether youre an aspiring organizer or a passionate participant, our platform has something for everyone\n
Check out : https://blockseblock.com/`,
    {}
  );
});

bot.command("contact", (ctx) => {
  console.log(ctx.from);
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Hello ${ctx.from.first_name} ${ctx.from.last_name} (@${ctx.from.username}) \n
Contact Us at:
Phone:+91 89682-32722
Email: partnerships@blockseblock.com\n
Check out : https://blockseblock.com/`,
    {}
  );
});

bot.command("help", (ctx) => {
  console.log(ctx.from);
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Hello ${ctx.from.first_name} ${ctx.from.last_name} (@${ctx.from.username}) \n
type /help for help.\n
/active : Get a list of latest active hackathons.
/about : Get information about us.
/contact : Get ou contact info.\n
Check out : https://blockseblock.com/`,
    {}
  );
});

bot.launch();
