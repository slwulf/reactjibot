const {ICONS} = require('./constants.js')

module.exports = class EventHandler {
    constructor(event) {
        this.event = event
    }

    getChannel() {
        return 'reactjibot'
    }

    getIcon() {
        const icon = this.event.subtype === 'add'
            ? this.event.name
            : ICONS.DEFAULT

        const key = icon.indexOf('http') === 0
            ? 'icon_url'
            : 'icon_emoji'

        return { [key]: icon }
    }

    handle(client) {
        const channel = this.getChannel()
        const text = this.event.subtype === 'add'
            ? this.onAdd()
            : this.onRemove()

        return client.chat.postMessage({
            channel,
            text,
            ...this.getIcon()
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
