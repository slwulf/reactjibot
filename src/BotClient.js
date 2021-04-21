const {onlyEvents} = require('@slack/bolt')
const Bolt = require('@slack/bolt')

const platforms = {
    slack: 'Slack',
    discord: 'Discord'
}

const methods = (client, platform) => ({
    async start(port) {
        const plat = platforms[platform] || 'Unknown Chat App'

        if (client !== null) {
            await client.start(port)
            console.log(`ReactjiBot is running ${plat} on port ${port}.`)
        } else {
            console.log(`ReactjiBot doesn't support ${plat} yet!`)
        }
    },

    onCommand(commandName, createHandler) {
        if (platform !== 'slack') return this

        client.command(commandName, async args => {
            const handler = createHandler(args.command)
            await args.ack()
            await handler.handle(args.client)
        })

        return this
    },

    onEvent(eventName, createHandler) {
        if (platform !== 'slack') return this

        client.event(eventName, async args => {
            const handler = createHandler(args.event)
            try {
                await handler.handle(args.client)
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

    const client = platform === 'slack' ? (
        new Bolt.App({
            signingSecret: SLACK_SIGNING_SECRET,
            token: SLACK_BOT_TOKEN
        })
    ) : null

    return methods(client, platform)
}
