const BotClient = require('./BotClient.js')
const CommandHandler = require('./CommandHandler.js')
const EventHandler = require('./EventHandler.js')

module.exports = class ReactjiBot {
    static configure(config) {
        const client = new BotClient(config)
        return new ReactjiBot(client)
    }

    constructor(client) {
        this.client = client
    }

    start(port) {
        this.client
            .onCommand('/emojilist', command => new CommandHandler(command))
            .onEvent('emoji_changed', event => new EventHandler(event))
            .start(port)
    }
}
