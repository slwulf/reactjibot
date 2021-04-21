module.exports = class EventHandler {
    constructor(event) {
        this.event = event
    }

    handle(sendMessage) {
        const text = this.event.subtype === 'add'
            ? this.onAdd()
            : this.onRemove()

        return sendMessage(text, {
            icon: this.event.name || undefined
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
