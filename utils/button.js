let Discord = require("discord.js");
module.exports = class button {
  constructor() {
    this.button = { type: 2 };
    this.styles = { blurple: 1, grey: 2, green: 3, red: 4 };
  }
  setStyle(style) {
    if (
      typeof style !== "string" ||
      !["red", "green", "blurple", "grey"].includes(style.toLowerCase())
    )
      throw new TypeError("Invalid style received");
    this.button.style = this.styles[style];
    return this;
  }
  setLabel(text) {
    if (typeof text !== "string") throw new TypeError("Invalid label received");
    this.button.label = text;
    return this;
  }
  setId(id) {
    if (typeof id !== "string") throw new TypeError("Invalid id received");
    this.button.custom_id = id;
    return this;
  }
  setEmoji(emoji) {
    if (typeof emoji !== "string")
      throw new TypeError("Invalid emoji received");
    let { id: emojiId, name: emojiName } = Discord.Util.parseEmoji(emoji);
    this.button.emoji = { id: emojiId, name: emojiName };
    return this;
  }
  setDisabled(boolean) {
    if (typeof boolean !== "boolean")
      throw new TypeError("Invalid type received");
    this.button.disabled = boolean;
    return this;
  }
};
