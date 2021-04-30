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

const infoMsg = ({name, isAlias, alias, author, created}) => `
:${name}: \`:${name}:\` was added by <@${author}> on ${created}.${
    isAlias ? ` It is an alias for \`:${alias}:\`` : ''
}
`.trim()

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

const getInfo = async (emoji) => {
    const fetcher = fetchMatch(emoji)
    const result = await fetcher(getClient())
    const [match] = result.emoji
    if (!match || result.emoji.length === 0) return

    return {
        name: match.name,
        created: (new Date(match.created * 1000))
            .toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
        isAlias: Boolean(match.is_alias),
        alias: match.alias_for,
        author: match.user_id
    }
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

            const icon = update.type === 'add'
                ? `:${update.alias || update.name}:`
                : undefined

            client.sendMessage(message, {icon})
        })
    }

    static async handleCommand(event) {
        const client = BotClient.fromSlackClient(getClient())
        const [subcommand, ...args] = event.text.split(' ')
        const opts = {
            channel: event.channel_id,
            user: event.user_id
        }

        switch (subcommand) {
            case 'info':
                const emoji = (args[0] || '').replace(/:/g, '')
                const info = await getInfo(emoji)
                const msg = info ? infoMsg(info) : "Sorry, I couldn't find that emoji."
                return client.sendInvisibleMessage(msg, opts)
            default:
                return client.sendInvisibleMessage("Sorry, I don't know that one.", opts)
        }
    }

    static async getEmojiForName(name) {
        const fetcher = fetchMatch(name.replace(/:/g, ''))
        const result = await fetcher(getClient())
        const [match] = result.emoji
        return match
    }
}
