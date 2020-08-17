"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const Customer = require("../models/customer.model")

/**
 * customers service
 * mongodb://mongo:27017/irdb"
 */
module.exports = {

	name: "customers",

	mixins: [DbService],
	adapter: new MongooseAdapter(process.env.MONGO_URI),
	model: Customer,

	/**
	 * Service settings
	 */
	settings: {
		fileds: ["_id", "id", "name", "credit_limit"]
	},

	/**
	 * Service metadata
	 */
	metadata: {},

	/**
	 * Service dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		hello: {
			async handler(ctx) {
				return "Hello Moleculer";
			}
		}
	},

	/**
	 * Events
	 */
	events: {
		"order.created"(payload) {
			this.logger.info("order.created", payload);
			this.check_customer_credit_limit(payload.customer_id, payload.total);
		},
		async "some.thing"(ctx) {
			this.logger.info("Something happened", ctx.params);
		}
	},

	/**
	 * Methods
	 */
	methods: {
		seedDB() {
			this.logger.info("Seed Customers...");

			return Promise.resolve()
				.then(() => this.adapter.insert({
					id: 1,
					name: "Matheos",
					credit_limit: 90000
				}))
				.then(() => this.adapter.insert({
					id: 2,
					name: "Evandro",
					total: 10000
				}))
				.then(customers => {
					this.logger.info(`Generated ${customers.length} customers`);
				})
		},

		check_customer_credit_limit(customer_id, total){

			Customer.findOne({id : customer_id}, (err, foundCustomer) => {
				if(err)
					this.logger.error("Error connect to Customers DB");

				const credit_limit = foundCustomer.credit_limit;

				if(total <= credit_limit )
					this.broker.emit("creditReserved", "Under Customer Credit Limit, Can proceed the orders");
				else	
					this.broker.emit("creditLimitExceed", "Exceed Customer Credit Limit, Can not proceed the orders");
			});

		}

	},

	afterConnected(){
		return this.adapter.count().then(count => {
			if (count == 0){
				this.seedDB();
			}
		});
	},
	
	/**
	 * Service created lifecycle event handler
	 */
	created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
