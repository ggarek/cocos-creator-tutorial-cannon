const { cos, sin, PI } = Math;
const rad = deg => deg * PI / 180;
const cosd = deg => cos(rad(deg));
const sind = deg => sin(rad(deg));
const clamp = (val, min, max) => val < min ? min : val > max ? max : val;

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        barrelSprite: {
            default: null,
            type: cc.SpriteFrame,
        },
        tankSprite: {
            default: null,
            type: cc.SpriteFrame,
        },
        barrelPosition: 0,
        angle: 0,
        baseAngleSpeed: 0,
        angleSpeed: 0,
        leftMaxAngle: 0,
        rightMaxAngle: 0,
    },

    // use this for initialization
    onLoad() {
        // Create barrel node
        const barrelNode = this.barrelNode = new cc.Node('barrel');
        const barrelSprite = barrelNode.addComponent(cc.Sprite);
        barrelSprite.spriteFrame = this.barrelSprite;
        barrelNode.setAnchorPoint(0.5, 0);
        this.node.addChild(barrelNode);
        
        // Create cannon node
        const tankNode = this.tankNode = new cc.Node('tank');
        const tankSprite = tankNode.addComponent(cc.Sprite);
        tankSprite.spriteFrame = this.tankSprite;
        this.node.addChild(tankNode);
        
        this.barrelPosition = tankNode.height * 0.4;
        
        // Position barrel
        barrelNode.setPosition(0, this.barrelPosition);
        
        this.hookInput();
    },
    
    hookInput() {
        const cannon = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed(kcode, e) {
                switch(kcode) {
                    case cc.KEY.left: 
                        cannon.angleSpeed = -1 * cannon.baseAngleSpeed;
                        break;
                    case cc.KEY.right:
                        cannon.angleSpeed = cannon.baseAngleSpeed;
                        break;
                }
            },
            onKeyReleased(kcode, e) {
                switch(kcode) {
                    case cc.KEY.left:
                    case cc.KEY.right:
                        cannon.angleSpeed = 0;
                        break;
                }
            }
        }, this.node);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        const { angleSpeed } = this;
        if (angleSpeed !== 0) {
            const angle = this.angle = clamp(this.angle + angleSpeed * dt, -1 * this.leftMaxAngle, this.rightMaxAngle);
            const r = this.barrelPosition;
            
            this.barrelNode.setRotation(angle);
            this.barrelNode.setPosition(r * sind(angle), r * cosd(angle));
        }
    },
});
