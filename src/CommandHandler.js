module.exports = class CommandHandler {
    constructor(command) {
        this.command = command
        /*
{
  "token": "qNGUz6Wtid25DqHrqgAS8rjb",
  "team_id": "TAYKJDZDH",
  "team_domain": "giftcrabs",
  "channel_id": "C01V65GJRPW",
  "channel_name": "reactjibot",
  "user_id": "UD69358AY",
  "user_name": "atwulf",
  "command": "/reactjibot",
  "text": "",
  "api_app_id": "A01UKA6P415",
  "is_enterprise_install": "false",
  "response_url": "https://hooks.slack.com/commands/TAYKJDZDH/1987376271075/W7IBZIEB3peyJ5foL6hRhAx6",
  "trigger_id": "1999779912449.372664475459.cd5224761e97707620ec3b9f3aa601c7"
}
        */
    }

    handle(sendMessage) {
        const response = `Hi! I'm not quite fully implemented yet. Head on over to #emoji for the time being!`
        return sendMessage(response, {
            channel: this.command.channel_id
        })
    }
}
