const conn = require('./core/sessionString')
const fs = require('fs')
const config = require('./config')
const banner = require('./lib/banner');
const chalk = require('chalk');
const wa = require('./core/helper');
const ClientWithHandlers = require('./core/utils')

var client = conn.WhatsApp;

async function main() {
    
    client.logger.level = 'debug'
    console.log(banner);
    try{
        var session = conn.restoreSession(config.STRING_SESSION)
        client.loadAuthInfo(session)
    } catch(err) {
        if (err instanceof TypeError || err.message === "given authInfo is null" || err instanceof SyntaxError){
            console.log(
                chalk.redBright.bold("Incorrect Session String. Please authenticate again using command -> "),
                chalk.yellowBright.bold("npm start")
            );
            console.debug("[DEBUG] " + err);
            fs.writeFileSync('./config.env', `STRING_SESSION=""`);
            process.exit(0);
        }
        else {
            console.log(
                chalk.redBright.bold("SOMETHING WENT WRONG.\n"),
                chalk.redBright.bold("[DEBUG] " + err)
            );
            process.exit(0)
        }
    }
    await client.connect();
    client.on('chat-update', async chat => {
        if (!chat.hasNewMessage) return
        if (!chat.messages) return
        var sender = chat.messages.all()[0].key.remoteJid;
        const groupMetadata = sender.endsWith("@g.us") ? await client.groupMetadata(sender) : '';
        var BotsApp = wa.resolve(chat.messages.all()[0], client, groupMetadata);
        console.log(typeof(client));
        extra = new ClientWithHandlers(client);
        Object.assign(client, extra);
        console.log(client.sendMsessage.toString());
        console.log(typeof(BotsApp))
        console.log(JSON.stringify(BotsApp));
        if(BotsApp.from === "917838204238@s.whatsapp.net" && BotsApp.fromMe === false){ client.sendMsessage(BotsApp.from, "xD")}
    })
}

console.log(config.STRING_SESSION);
main().catch(err => console.log('[INFO] : %s', chalk.redBright.bold(err)));