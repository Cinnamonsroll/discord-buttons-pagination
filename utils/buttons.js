let buttonClass = require("./button.js");
module.exports = class buttons {
  constructor() {
    this.components = [];
  }
  addComponent() {
    if (this.components.length === 5)
      throw new RangeError("Max components reached");
    this.components.push({ type: 1, components: [] });
    return this;
  }
  addButton(row, button) {
    this.components[row - 1].components.push(button);
    return this;
  }
  async send(content, client, message, options = {}) {
    let theMessage = await client.api
      .channels(message.channel.id)
      .messages.post({
        data: {
          content,
          embed: options.embed,
          components: this.components,
          flags: options.flags || 0
        }
      });
    this.components = [];
    return theMessage;
  }
};
