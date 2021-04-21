const BotClient = require('./BotClient.js')
const CommandHandler = require('./CommandHandler.js')

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
            .onCommand('/reactjibot', command => new CommandHandler(command))
            .start(port)
    }
}
