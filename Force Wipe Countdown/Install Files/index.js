const { Client, Collection, Intents, ActivityType, Discord, EmbedBuilder, WebhookClient, GatewayIntentBits } = require("discord.js");

require("dotenv").config({ path: "./config/.env" });

const schedule = require("node-schedule");

const { DateTime } = require("luxon");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const BOT_TOKEN = process.env.BOT_TOKEN;


function getFirstThursday() {
    const now = DateTime.now().setZone("America/Chicago");
    let firstThursday = now.startOf("month");

    while (firstThursday.weekday !== 4) {
        firstThursday = firstThursday.plus({ days: 1 });
    }

    return firstThursday;
}

function getTimeUntilFirstThursday() {
    const now = DateTime.now().setZone("America/Chicago");
    let firstThursday = getFirstThursday();

    if (now > firstThursday) {
        firstThursday = firstThursday.plus({ months: 1 }).startOf("month");
        while (firstThursday.weekday !== 4) {
            firstThursday = firstThursday.plus({ days: 1 });
        }
    }

    const diff = firstThursday.diff(now, ["days", "hours", "minutes", "seconds"]).toObject();

    return `${Math.floor(diff.days)}D ${Math.floor(diff.hours)}H ${Math.floor(diff.minutes)}M ${Math.floor(diff.seconds)}S`;
}

function updatePresence() {
    const timeUntilFirstThursday = getTimeUntilFirstThursday();
    client.user.setPresence({
        activities: [{
            name: `${timeUntilFirstThursday}`,
            type: ActivityType.Watching
        }],
    });
}

client.once("ready", () => {
    console.log('\x1b[36m%s\x1b[0m', "★ Force Wipe Countdown Bot ★");
    console.log('\x1b[36m%s\x1b[0m', "");
    console.log('\x1b[32m%s\x1b[0m', "Successfully Connected to Hosted BOT.");
    console.log('\x1b[36m%s\x1b[0m', "");
    console.log('\x1b[33m%s\x1b[0m', "Support: https://discord.gg/creedservers");
    console.log('\x1b[36m%s\x1b[0m', "");
    console.log('\x1b[31m%s\x1b[0m', "Created by: K H A K I Z™ | Creed Servers Int.");

    updatePresence();
    setInterval(updatePresence, 1000);

    schedule.scheduleJob({ hour: 13, minute: 0, tz: "America/Chicago" }, () => {
        const today = DateTime.now().setZone("America/Chicago");
        if (today.hasSame(getFirstThursday(), "day")) {
            updatePresence();
            console.log('\x1b[36m%s\x1b[0m', "Updated for Next Force Wipe!");
        }
    });
});

client.login(BOT_TOKEN);