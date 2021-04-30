const Bolt = require('@slack/bolt')
const {DEFAULTS, BOT_NAME} = require('./constants.js')

const platforms = {
    slack: 'Slack',
    discord: 'Discord'
}

const getIcon = icon => ({
    [icon.indexOf('http') === 0 ? 'icon_url' : 'icon_emoji'] : icon
})

const getMessage = msg => ({
    [Array.isArray(msg) ? 'attachments' : 'text']: msg
})

const methods = (app, platform) => ({
    async start(port) {
        const plat = platforms[platform] || 'Unknown Chat App'

        if (app !== null) {
            await app.start(port)
            console.log(`ReactjiBot is running ${plat} on port ${port}.`)
        } else {
            console.log(`ReactjiBot doesn't support ${plat} yet!`)
        }
    },

    sendMessage(client, message, {
        channel = DEFAULTS.CHANNEL,
        icon = DEFAULTS.ICON
    } = {}) {
        return client.chat.postMessage({
            ...getMessage(message),
            channel,
            username: BOT_NAME,
            ...getIcon(icon)
        })
    },

    sendInvisibleMessage(client, message, {
        channel = DEFAULTS.CHANNEL,
        icon = DEFAULTS.ICON,
        user
    }) {
        return client.chat.postEphemeral({
            ...getMessage(message),
            channel,
            user,
            username: BOT_NAME,
            ...getIcon(icon)
        })
    },

    onCommand(commandName, createHandler) {
        if (platform !== 'slack') return this

        app.command(commandName, async args => {
            const handler = createHandler(args.command)
            await args.ack()
            try {
                await handler.handle(
                    this.sendMessage.bind(this, args.client)
                )
            } catch (err) {
                console.error(err)
            }
        })

        return this
    },

    onEvent(eventName, createHandler) {
        if (platform !== 'slack') return this

        app.event(eventName, async args => {
            const handler = createHandler(args.event)
            try {
                await handler.handle(
                    this.sendMessage.bind(this, args.client)
                )
            } catch (error) {
                console.error(error)
            }
        })

        return this
    }
})

function BotClient(config) {
    const {
        platform = 'slack',
        SLACK_SIGNING_SECRET,
        SLACK_BOT_TOKEN
    } = config

    const app = platform === 'slack' ? (
        new Bolt.App({
            signingSecret: SLACK_SIGNING_SECRET,
            token: SLACK_BOT_TOKEN
        })
    ) : null

    return methods(app, platform)
}

BotClient.fromSlackClient = client => {
    const botClient = methods(null, 'slack')
    const sendMessage = botClient.sendMessage.bind(botClient, client)
    const sendInvisibleMessage = botClient.sendInvisibleMessage.bind(botClient, client)
    return { sendMessage, sendInvisibleMessage }
}

module.exports = BotClient
