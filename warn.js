const Discord = require("discord.js");
const fs = require("fs");
let warns = JSON.parse(fs.readFileSync("./warns.json", ));
module.exports.run = async (bot, message, args) => {
     
             let WUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]))
             if(!WUser) return message.reply("merci de mentionner un utilisateur");
             if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("vous devez disposer de permissions pour effectuer cette commande");
             if(WUser.hasPermission("MANAGE_MESSAGES")) return message.reply("Il est impossible de warn cet utilisateur");
            let Wreason = args.join(" ").slice(3);
             if(!warns[WUser.id]) warns[WUser.id] = {
              warns: 0
               };
              warns[WUser.id].warns++;
              fs.writeFile("./warns.json", JSON.stringify(warns), (err) => {
             if(err) console.log(err);
              });

             let warnembed = new Discord.RichEmbed()

           .setTitle("AVERTISSEMENT")
           .setColor("#fc6400")
           .addField("Utilisateur :", WUser.user.tag)
           .addField("Modérateur :", message.author.username)
           .addField("Channel :" ,message.channel.name)
           .addField("Nombre total d\'avertissements:", warns[WUser.id].warns )
           .addField("Raison :", Wreason);

           let warnchannel = message.guild.channels.find('name', "warn-info");
           if(!warnchannel) return message.channel.send("Je ne trouve pas le channel warn-info");
            warnchannel.send(warnembed);
            console.log(`${WUser.user.username}has been warn by ${message.author.username} from the server ${message.guild.name} for ${Wreason} `);

          message.channel.send(`*${WUser} viens d\être avertis'`);

          //3 warns = muted from the server, you can change that by editing the number after 'warns == 3'
if(warns[WUser.id].warns == 3){
                let muterole = message.guild.roles.find('name', "muted");
                if(!muterole) return message.reply("vous devez créer un role nommé 'muted'");

                let mutetime = "1m";
                await(WUser.addRole(muterole.id));
                message.channel.send(`${WUser.user.tag} viens de se faire mute`);

                setTimeout(function(){
                    WUser.removeRole(muterole.id)
                    message.channel.send(`${WUser} peut désormais écrire`)
                })
                
          //10 warns = getting banned from the server, you can change that by editing the number after 'warns == 10'
            }
            if(warns[WUser.id].warns == 100000000){
               message.guild.member(WUser).ban(Wreason);
               message.channel.send(`${WUser.user.tag} viens d\'être bannis du serveur`)
            }







}

module.exports.help = {
    name: "warn"

}
