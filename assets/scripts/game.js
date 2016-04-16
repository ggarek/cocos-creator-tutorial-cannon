const { cos, sin, PI, random } = Math;
const rad = deg => deg * PI / 180;
const cosd = deg => cos(rad(deg));
const sind = deg => sin(rad(deg));
const clamp = (val, min, max) => val < min ? min : val > max ? max : val;
const rand = (min, max) => min + (max - min) * random();

const METEOR_SHAPE = 1;
const BULLET_SHAPE = 2;
const FLOOR_SHAPE = 3;

function createBody(m, i, userData) {
    const b = new cp.Body(m, i);
    b.userData = userData;
    return b;
}

function createVertsFromRect({ width: w, height: h }) {
    return [
        -w/2, -h/2,
        -w/2,  h/2,
        w/2,  h/2,
        w/2, -h/2
    ]; 
}

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
        meteorSprite: {
            default: null,
            type: cc.SpriteFrame,
        },
        
        bulletMeteorExplosion: {
            default: null,
            type: cc.Prefab,
        },
        
        meteorSpawnMinX: 0,
        meteorSpawnMaxX: 0,
        meteorSpawnMinY: 0,
        meteorSpawnMaxY: 0,
        meteorMinVelocity: 0,
        meteorMaxVelocity: 0,
    },

    // use this for initialization
    onLoad: function () {
        // Create physics space
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, this.gravity);
        
        // Add game floor
        const floor = new cp.SegmentShape(
            this.space.staticBody,
            cp.v(0, 20),
            cp.v(2000, 100),
            10
        );
        floor.setCollisionType(FLOOR_SHAPE);
        this.space.addStaticShape(floor);
        
        // create verts for physics
        this.bulletVerts = createVertsFromRect(this.bulletSprite.getRect());
        this.meteorVerts = createVertsFromRect(this.meteorSprite.getRect());
        
        // create collision handlers
        const shapesToRemove = this.shapesToRemove = [];
        this.space.addCollisionHandler(METEOR_SHAPE, BULLET_SHAPE, (arbiter, space) => {
            const { a, b } = arbiter;

            // We can not remove shapes and bodies just now,
            // it is forbidden during physics space step.
            // So we keep it to remove after physics step is done.            
            shapesToRemove.push(a);
            shapesToRemove.push(b);
            
            // Run animation
            const meteorNode = a.body.userData;
            const node = cc.instantiate(this.bulletMeteorExplosion);
            node.setPosition(meteorNode.position.x, meteorNode.position.y);
            cc.director.getScene().addChild(node);
            node.getComponent(cc.Animation).play();
            return true;
        });

        // Handle case when meteor touches the ground
        this.space.addCollisionHandler(FLOOR_SHAPE, METEOR_SHAPE, (arbiter, space) => {
            const { b } = arbiter;
            shapesToRemove.push(b);
            return true;
        });
    },
    
    start() {
        this.scheduleCreateMeteor();
    },
    
    createBullet(x, y, velocity, angle) {
        console.log('create bulet', {x, y, velocity, angle});
        
        // create bullet node
        const bulletNode = new cc.Node();
        const bulletSprite = bulletNode.addComponent(cc.Sprite);
        bulletSprite.spriteFrame = this.bulletSprite;
        const pos = bulletNode.position = cc.v2(x, y);
        bulletNode.setRotation(angle);
        
        // Create physics
        const verts = this.bulletVerts;
        
        // Body(m, i)
        const body = createBody(1.0, cp.momentForPoly(1.0, verts, cp.vzero), bulletNode);
        body.setPos(bulletNode.position);
        body.setVel(cp.v(sind(angle) * velocity, cosd(angle) * velocity));
        this.space.addBody(body);
        
        // Shape
        const shape = new cp.PolyShape(body, verts, cp.vzero);
        shape.e = 0.5;
        shape.u = 0.5;
        shape.setCollisionType(BULLET_SHAPE);
        this.space.addShape(shape);
        
        // Add bullet script
        bulletNode.addComponent('bullet').setBody(body);
        
        // Finally add bullet to the scene
        cc.director.getScene().addChild(bulletNode);
    },
    
    scheduleCreateMeteor() {
        cc.director.getScheduler().schedule(this.createMeteor, this, 1 + random() * 1, false);
    },
    
    createMeteorAndScheduleNext() {
        this.createMeteor();
        this.scheduleCreateMeteor();
    },
    
    createMeteor() {
        const x = rand(this.meteorSpawnMinX, this.meteorSpawnMaxX);
        const y = rand(this.meteorSpawnMinY, this.meteorSpawnMaxY);
        const angle = 90 + 25 + random() * 20;
        const velocity = rand(this.meteorMinVelocity, this.meteorMaxVelocity);
        
        const node = new cc.Node();
        node.addComponent(cc.Sprite).spriteFrame = this.meteorSprite;
        node.setPosition(cc.v2(x, y));
        
        const verts = this.meteorVerts;
        const body = createBody(1.0, cp.momentForPoly(1.0, verts, cp.vzero), node);
        body.setPos(node.position);
        body.setVel(cp.v(sind(angle) * velocity, cosd(angle) * velocity));
        this.space.addBody(body);
        
        // Shape
        const shape = new cp.PolyShape(body, verts, cp.vzero);
        shape.e = 0.5;
        shape.u = 0.5;
        shape.setCollisionType(METEOR_SHAPE);
        this.space.addShape(shape);
        
        // Add bullet script
        node.addComponent('meteor').setBody(body);
        
        // Finally add bullet to the scene
        cc.director.getScene().addChild(node);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        const { space, shapesToRemove } = this;
        if (space) {
            space.step(dt);
            if (shapesToRemove.length > 0) {
                for (let i = 0; i < shapesToRemove.length; i++) {
                    const shape = shapesToRemove[i];
                    // Remove shapes from space
                    space.removeShape(shape);
                    // Remove bodies from space
                    space.removeBody(shape.body);
                    // Destroy nodes (saved as userData)
                    shape.body.userData.destroy();
                }
                shapesToRemove.length = 0;
            }
        }
    },
});
