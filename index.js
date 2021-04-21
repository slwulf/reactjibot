const ReactjiBot = require('./src/ReactjiBot.js')
const bot = ReactjiBot.configure({
    platform: 'slack',
    SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
    SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN
})

bot.start(process.env.PORT || 3000)
