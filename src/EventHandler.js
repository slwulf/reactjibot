const {ICONS} = require('./constants.js')

module.exports = class EventHandler {
    constructor(event) {
        this.event = event
    }

    getChannel() {
        return 'reactjibot'
    }

    getIcon() {
        return this.event.subtype === 'add'
            ? this.event.name
            : ICONS.DEFAULT
    }

    handle(client) {
        const channel = this.getChannel()
        const icon = this.getIcon()
        const text = this.event.subtype === 'add'
            ? this.onAdd()
            : this.onRemove()

        return client.chat.postMessage({
            channel,
            text,
            icon_emoji: icon
        })
    }

    onAdd() {
        const {name, value} = this.event
        const isAlias = value.indexOf('alias:') === 0
        const [,alias] = value.split(':')
        return isAlias
            ? `*New alias added:* :${name}: \`:${name}:\` (alias of \`:${alias}:\`)`
            : `*New emoji added:* :${name}: \`:${name}:\``
    }

    onRemove() {
        const {names} = this.event
        return names.reduce((acc, name) => {
            return acc + `*Emoji removed:* \`:${name}:\`` + "\n"
        }, '')
    }
}
