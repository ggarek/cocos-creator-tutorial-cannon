const { cos, sin, PI } = Math;
const rad = deg => deg * PI / 180;
const cosd = deg => cos(rad(deg));
const sind = deg => sin(rad(deg));
const clamp = (val, min, max) => val < min ? min : val > max ? max : val;

cc.Class({
    extends: cc.Component,

    properties: {
        /**
         * Chipminky physics space
         */
        space: null,
        /**
         * World gravity
         */
        gravity: 0,
        bulletSprite: {
            default: null,
            type: cc.SpriteFrame,
        },
    },

    // use this for initialization
    onLoad: function () {
        // Create physics space
        this.space = new cp.Space();
        this.space.gavity = cp.v(0, this.gravity);
        
        // Add game floor
        const floor = new cp.SegmentShape(
            this.space.staticBody,
            cp.v(0, 20),
            cp.v(2000, 100),
            10
        );
        this.space.addStaticShape(floor);
    },
    
    createBullet(x, y, velocity, angle) {
        console.log('create bulet', {x, y, velocity, angle});
        
        // create bullet node
        const bulletNode = new cc.Node();
        const bulletSprite = bulletNode.addComponent(cc.Sprite);
        bulletSprite.spriteFrame = this.bulletSprite;
        const pos = bulletNode.position = cc.v2(x, y);
        bulletNode.setRotation(angle);
        
        // Finally add bullet to the scene
        cc.director.getScene().addChild(bulletNode);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this.space) {
            this.space.step(dt);
        }
    },
});
