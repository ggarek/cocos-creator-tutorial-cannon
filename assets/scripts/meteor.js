cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        
    },
    
    setBody(body) {
        this.body = body;
    },
    
    setTail(node) {
        this.tail = node;
        this.node.addChild(node);
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (!cc.isValid(this.node) || !this.body) return;
        
        const { p: { x, y } , vx, vy } = this.body;
        this.node.x = x;
        this.node.y = y;
    },
});
