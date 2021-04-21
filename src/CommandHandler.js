const {ICONS} = require('./constants.js')

module.exports = class CommandHandler {
    constructor(command) {
        this.command = command
    }

    handle(client) {
        return client.chat.postMessage({
            channel: this.command.channel_id,
            icon_emoji: ICONS.DEFAULT,
            text: `\`\`\`${
                JSON.stringify(this.command, null, 2)
            }\`\`\``
        })
    }
}
