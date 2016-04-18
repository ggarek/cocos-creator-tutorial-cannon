const { acos, sqrt, PI } = Math;
const deg = rad => rad * 180 / PI;

cc.Class({
    extends: cc.Component,

    properties: {
        body: null,
        timeToLive: 0,
    },

    // use this for initialization
    onLoad: function () {
        this.timeToLive = 10000;
        this.lifeTime = 0;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (!cc.isValid(this.node) || !this.body) return;
        
        const { p: { x, y } , vx, vy } = this.body;
        this.node.x = x;
        this.node.y = y;
        this.lifeTime += dt * 1000;
        
        // update rotation based on physics
        this.node.setRotation(deg(acos(vy / (sqrt(vx * vx + vy * vy)))));

        if (this.lifeTime >= this.timeToLive) {
            this.node.destroy();
        }
    },
    
    setBody(body) {
        this.body = body;
    }
});
