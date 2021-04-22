const EmojiList = require('./EmojiList.js')

module.exports = class CommandHandler {
    constructor(command) {
        this.command = command
    }

    handle(sendMessage) {
        if (
            EmojiList.isEnabled() &&
            this.command.command === "/emojilist"
        ) {
            return EmojiList.handleCommand(this.command)
        }

        const response = "Sorry, this feature isn't enabled! Please ask your ReactjiBot admin to turn it on."
        return sendMessage(response, {
            channel: this.command.channel_id
        })
    }
}
