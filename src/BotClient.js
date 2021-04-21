const Bolt = require('@slack/bolt')
const {DEFAULTS, BOT_NAME} = require('./constants.js')

const platforms = {
    slack: 'Slack',
    discord: 'Discord'
}

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

    sendMessage(client, text, {
        channel = DEFAULTS.CHANNEL,
        icon = DEFAULTS.ICON
    } = {}) {
        const iconKey = icon.indexOf('http') === 0
            ? 'icon_url'
            : 'icon_emoji'

        return client.chat.postMessage({
            text,
            channel,
            [iconKey]: icon,
            username: BOT_NAME
        })
    },

    onCommand(commandName, createHandler) {
        if (platform !== 'slack') return this

        app.command(commandName, async args => {
            const handler = createHandler(args.command)
            await args.ack()
            await handler.handle(
                this.sendMessage.bind(this, args.client)
            )
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

module.exports = function BotClient(config) {
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
