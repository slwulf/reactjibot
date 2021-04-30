# ReactjiBot
_A chat bot for creating and managing custom emojis._

### Usage

```js
const ReactjiBot = require('reactjibot')
const bot = ReactjiBot.configure({
    platform: 'slack', // maybe one day i'll support discord too
    SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
    SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN
})

bot.start(process.env.PORT || 3000)
```

I'll put more usage notes here when this is an actual library, promise.

### Todos
- `/reactjibot tools <emojitools cli>`
- `/reactjibot list <add|remove|alias> <name> [url|alias]`
