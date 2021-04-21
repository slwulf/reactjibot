# ReactjiBot
## A Slack bot for creating and managing custom emojis.

blah blah insert blurb here about high-level shit

what do it do?
- emojitools
    - lib needs to be modified to take in a url and output an image blob that can be consumed
- emojilist
    - announce emoji additions, removals, and renaming, with configuration options to turn off each individually
    - need to figure out how to tie authors, maybe we can hit and cache the server list still?
    - also ?emojilist add/remove/alias require that weird browser API key which isn't ideal but, eh -- figure out a workaround for this
        - maybe allow inputting that API key in the config and if it's not there these commands are disabled?

how it do?
- probably as slash commands
- `/reactjibot tools <emojitools api>`
- `/reactjibot list <command> [inputs]`
    - `/reactjibot list set-channel (channel)`
        - by default, sets to current channel
    - `/reactjibot list announce [add|remove|alias] [on|off]`
    - `/reactjibot list [add|remove|alias] [name] (url|alias)`
