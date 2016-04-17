# Step 03: Add some dangerous meteors

It is time to create some meteors, we will need to add more properties to the game componet:

```js
properties: {
    //...
    meteorSprite: {
        default: null,
        type: cc.SpriteFrame,
    },

    meteorSpawnMinX: 0,
    meteorSpawnMaxX: 0,
    meteorSpawnMinY: 0,
    meteorSpawnMaxY: 0,
    meteorMinVelocity: 0,
    meteorMaxVelocity: 0,
},
```

Again add a sprite frame for the meteor to be able to set it from within the Cocos Creator and add some properties to controll the meteor creation process.

Now cache the meteor shape definition based on sprite:

```js
onLoad() {
  ///...
  this.meteorVerts = createVertsFromRect(this.meteorSprite.getRect());
},
```

I use a small helper for it: 

```js
function createVertsFromRect({ width: w, height: h }) {
    return [
        -w/2, -h/2,
        -w/2,  h/2,
        w/2,  h/2,
        w/2, -h/2
    ]; 
}
```

Lets write a method to create a meteor:

```js
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
```

The code look much like the code for bullet creation. But there is one new line of code

```js
shape.setCollisionType(METEOR_SHAPE);
```

To be able to hook collision callbacks we need to assign collision type for the shape. I defined two constants for that:

```
const METEOR_SHAPE = 1;
const BULLET_SHAPE = 2;
```

I want meteors to appear continuously after the game start. One can use setInterval for this, but it is much better to use game timers for that. For the particular case it is very convenient to use a scheduler to schedule a callback.

```js
scheduleCreateMeteor() {
    cc.director.getScheduler().schedule(this.createMeteor, this, 1 + random() * 1, false);
},

createMeteorAndScheduleNext() {
    this.createMeteor();
    this.scheduleCreateMeteor();
},
```

The 'scheduleCreateMeteor' method adds callback to create a meteor to the scheduler with random timeout. And the `createMeteorAndScheduleNext` method create a meteor and schedules next callback.

What is left is to start the meteor rain cycle! We can use component`s 'start' method for it. It is called by the Cocos Creator engine.

```js
start() {
    this.scheduleCreateMeteor();
},
```

Now we are almost set. But we need to create a 'meteor' script and set the bullet collison type.

```js
setBody(body) {
    this.body = body;
},

// called every frame, uncomment this function to activate update callback
update: function (dt) {
    if (!cc.isValid(this.node) || !this.body) return;
    
    const { p: { x, y } , vx, vy } = this.body;
    this.node.x = x;
    this.node.y = y;
},
```

The meteor script has 'setBody' method and updates the node position with accordance to the physic engine body.

Now set the bullet collision type in game component 'createBullet' method:

```js
createBullet(x, y, velocity, angle) {
    //...
    const shape = new cp.PolyShape(body, verts, cp.vzero);
        shape.e = 0.5;
        shape.u = 0.5;
        shape.setCollisionType(BULLET_SHAPE);
        this.space.addShape(shape);
    //...
}
```

Ok, now we have cannon, meteor rain and bullets flying out of the cannon barrel. The bullets even hit meteors, but what we would like instead of hiting - is that bullets destroy meteors.


[Step 04](./step04.md)