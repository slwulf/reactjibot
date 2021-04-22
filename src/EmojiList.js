const Slack = require('@slack/web-api')
const BotClient = require('./BotClient.js')

const getClient = () => new Slack.WebClient(process.env.SLACK_BOT_TOKEN)

const fetchList = (overrides = {}) => client => client.apiCall('emoji.adminList', {
    token: process.env.SLACK_WEB_TOKEN,
    count: 10000,
    ...overrides
})

const fetchMatch = query => fetchList({
    queries: [query],
    user_ids: [],
})

const addMsg = ({name, isAlias, alias, author}) => `
*New ${
    isAlias ? 'alias' : 'emoji'
} added${
    author ? ` by <@${author}>:` : ':'
}* :${name}: \`:${name}:\` ${
    isAlias ? `(alias of \`:${alias}:\`)` : ''
}
`.trim()

const removeMsg = update => `*Emoji removed:* \`:${update.name}:\``

const getUpdatesFromEvent = event => {
    const {name, value = '', names = []} = event
    const isAlias = value.indexOf('alias:') === 0
    const [,alias] = value.split(':')

    return names.length > 0
        ? names.map(name => ({ type: 'remove', name }))
        : [{ type: 'add', name, alias, isAlias }]
}

const getUpdates = event => {
    return getUpdatesFromEvent(event).map(async update => {
        if (update.type === 'remove') return update

        const {name} = update
        const fetcher = name ? fetchMatch(name) : fetchList()
        const result = await fetcher(getClient())
        const [match] = result.emoji
        const author = match ? match.user_id : undefined

        return { ...update, author }
    })
}

module.exports = class EmojiList {
    static isEnabled() {
        return process.env.SLACK_WEB_TOKEN !== undefined
    }

    static async handleEvent(event) {
        const client = BotClient.fromSlackClient(getClient())
        const updates = await Promise.all(getUpdates(event))

        updates.forEach(update => {
            const message = update.type === 'add'
                ? addMsg(update)
                : removeMsg(update)

            client.sendMessage(message)
        })
    }
}
