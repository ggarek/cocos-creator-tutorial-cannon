cc.Class({
    extends: cc.Component,

    properties: {
        body: null,
        timeToLive: 0,
    },

    // use this for initialization
    onLoad: function () {
        this.timeToLive = 4000;
        this.lifeTime = 0;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (!cc.isValid(this.node) || !this.body) return;
        
        const { x, y } = this.body.p
        this.node.x = x;
        this.node.y = y;
        this.lifeTime += dt * 1000;
        
        if (this.lifeTime >= this.timeToLive) {
            this.node.destroy();
        }
    },
    
    setBody(body) {
        this.body = body;
    }
});
