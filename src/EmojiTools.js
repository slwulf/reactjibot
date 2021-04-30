const Emojitools = require('@slwulf/emojitools')
const Slack = require('@slack/web-api')
const BotClient = require('./BotClient.js')
const EmojiList = require('./EmojiList.js')

const getClient = () => new Slack.WebClient(process.env.SLACK_BOT_TOKEN)

const swapEmojiForUrl = async text => {
    const regex = /:([^:\s]*):/g
    const emojis = text.match(regex) || []
    const urls = await Promise.all(emojis.reduce(async (obj, emoji) => {
        const result = await EmojiList.getEmojiForName(emoji)
        return { ...obj, [emoji]: result.url }
    }, {}))

    return text.replace(regex, emoji => urls[emoji])
}

module.exports = class EmojiTools {
    static async handleCommand(event) {
        const client = BotClient.fromSlackClient(getClient())
        const emoji = await Emojitools.fromCommandLineInput(event.text)

        if (emoji.message) {
            return client.sendInvisibleMessage(emoji.message, {
                channel: event.channel,
                user: event.user_id
            })
        }

        return client.uploadFile(await emoji.saveToReadStream(), {
            channels: [event.channel],
            text: 'Success!'
        })
    }
}
