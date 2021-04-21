const {ICONS} = require('./constants.js')

module.exports = class CommandHandler {
    constructor(command) {
        this.command = command
    }

    getIcon() {
        const icon = ICONS.DEFAULT

        const key = icon.indexOf('http') === 0
            ? 'icon_url'
            : 'icon_emoji'

        return { [key]: icon }
    }

    handle(client) {
        return client.chat.postMessage({
            ...this.getIcon(),
            channel: this.command.channel_id,
            text: `\`\`\`${
                JSON.stringify(this.command, null, 2)
            }\`\`\``
        })
    }
}
