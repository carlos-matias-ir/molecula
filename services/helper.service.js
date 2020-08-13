module.exports = {
    name: "helper",
    
    actions: {
        random() {
            return Math.round(Math.random()*100);
        }
    },

    events: {
        "hello.called"(payload) {
            this.logger.info("Helper Service Caugth an Event");
            this.logger.info(payload);
        }
    }
}