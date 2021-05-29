let buttons = new (require("./buttons.js"))();

let Discord = require("discord.js");
module.exports = async function pages(message, client, options = {}) {
  options = {
    messages: Array.isArray(options.messages) ? options.messages : [],
    page: 0
  };
  if (!options.messages.length)
    throw new TypeError("'options.messages' must have at least one element");
  let delButton = new (require("./button.js"))()
    .setStyle("red")
    .setEmoji("🗑️")
    .setId("deleteButton").button;
  let forButton = new (require("./button.js"))()
    .setStyle("blurple")
    .setEmoji("◀️")
    .setId("backwardButton")
    .setDisabled(options.page <= options.messages.length).button;
  let bacButton = new (require("./button.js"))()
    .setStyle("blurple")
    .setEmoji("▶️")
    .setId("forwardButton")
    .setDisabled(options.page >= options.messages.length).button;
  let embedButtons = await buttons
    .addComponent()
    .addButton(1, delButton)
    .addButton(1, forButton)
    .addButton(1, bacButton)
    .send("Pages", client, message, { embed: options.messages[options.page] });
  client.pagination.set(embedButtons.id, {
    page: options.page,
    pages: options.messages,
    author: message.author.id,
    message
  });
};
