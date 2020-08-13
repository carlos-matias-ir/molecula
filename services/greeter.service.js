"use strict";

const fs = require("fs").promises;

module.exports = {
  name: "greeter",

  /**
   * Service settings
   */
  settings: {},

  /**
   * Service dependencies
   */
  dependencies: [],

  /**
   * Actions
   */
  actions: {
    /**
     * Say a 'Hello'
     *
     * @returns
     */
    async hello(ctx) {
      const payload = `Hello from greeter@${this.broker.nodeID}`;
      
      ctx.emit("hello.called", payload );  
      return payload;
    },
    async randomhello(ctx) {
      const payload = `Random Hello from greeter@${this.broker.nodeID}`;
      
      const number = await ctx.call("helper.random");

      ctx.emit("hello.called", { payload, number });  
      return { payload, number };
    },

    /**
     * Welcome a username
     *
     * @param {String} name - User name
     */
    welcome: {
      params: {
        name: "string"
      },
      handler(ctx) {
        return `Welcome, ${ctx.params.name}`;
      }
    },
    async readDir(ctx) {
      const dirToRead = ctx.params.dir;
      const res = await fs.readdir(dirToRead);
      return res;
    },
    async registry(ctx) {
      const nodes = await this.broker.call("$node.list");

      return nodes.map(node => {
        return {
          id: node.id,
          instanceID: node.instanceID,
          hostname: node.hostname,
          available: node.available
        };
      });
    }
  },

  /**
   * Events
   */
  events: {},

  /**
   * Methods
   */
  methods: {},

  /**
   * Service created lifecycle event handler
   */
  created() {},

  /**
   * Service started lifecycle event handler
   */
  started() {},

  /**
   * Service stopped lifecycle event handler
   */
  stopped() {}
};
