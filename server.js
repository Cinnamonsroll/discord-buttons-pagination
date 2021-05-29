const Discord = require("discord.js");
const client = new Discord.Client();
let pages = require("./utils/pages.js");
client.pagination = new Map();
client.on("ready", () => {
  console.log("Client started");
});
client.on("message", async message => {
  if (message.content === "-pages") {
    let moment = require("moment");
    await message.guild.members.fetch({
      withPresences: true
    });
    let members = message.guild.members.cache.sort(
      (a, b) => a.joinedTimestamp - b.joinedTimestamp
    );
    let joins = members.array();

    let embeds = members
      .array()
      .map(
        (m, c) =>
          `#${c + 1} ${m.user.tag} \`(${
            m.user.bot ? "BOT" : "USER"
          })\` (${moment.utc(m.joinedAt).fromNow()})`
      );
    embeds = Array.from(
      {
        length: Math.ceil(embeds.length / 10)
      },
      (a, r) => embeds.slice(r * 10, r * 10 + 10)
    );
    embeds = embeds.map(e =>
      new Discord.MessageEmbed().setTitle("Join positions").setDescription(e)
    );
    await pages(message, client, { messages: embeds });
  }
});
client.ws.on("INTERACTION_CREATE", async interaction => {
  if (interaction.type !== 3) return;
  let data = client.pagination.get(interaction.message.id);
  if (data && interaction.member.user.id === data.author) {
    if (interaction.data.custom_id === "deleteButton") {
      data.message.channel.messages.cache.get(interaction.message.id).delete();
      client.pagination.delete(interaction.message.id);
    } else {
      if (interaction.data.custom_id === "forwardButton") data.page += 1;
      else if (interaction.data.custom_id === "backwardButton") data.page -= 1;

      let delButton = new (require("./utils/button.js"))()
        .setStyle("red")
        .setEmoji("🗑️")
        .setId("deleteButton").button;
      let bacButton = new (require("./utils/button.js"))()
        .setStyle("blurple")
        .setEmoji("◀️")
        .setId("backwardButton")
        .setDisabled(data.page === 0).button;
      let forButton = new (require("./utils/button.js"))()
        .setStyle("blurple")
        .setEmoji("▶️")
        .setId("forwardButton")
        .setDisabled(data.page === data.pages.length - 1).button;
      await client.api
        .channels(interaction.channel_id)
        .messages(interaction.message.id)
        .patch({
          data: {
            content: interaction.message.content,
            embed: data.pages[data.page],
            components: [
              { type: 1, components: [delButton, bacButton, forButton] }
            ]
          }
        });
      return client.api
        .interactions(interaction.id)
        [interaction.token].callback.post({ data: { type: 6 } });
    }
  }
});
client.login(require("./config.json").token);
