const EmojiList = require('./EmojiList.js')
const EmojiTools = require('./EmojiTools.js')

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

        if (
            EmojiList.isEnabled() &&
            this.command.command === "/emojitools"
        ) {
            return EmojiTools.handleCommand(this.command)
        }

        return sendMessage(
            "Sorry, this feature isn't enabled! Please ask your ReactjiBot admin to turn it on.",
            { channel: this.command.channel_id }
        )
    }
}
