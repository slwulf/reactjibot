module.exports = class CommandHandler {
    constructor(command) {
        this.command = command
    }

    handle(callback) {
        return callback(`\`\`\`${
            JSON.stringify(this.command, null, 2)
        }\`\`\``)
    }
}
