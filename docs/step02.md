# Step 02: Bullets should be shot

It is time to add some bullets!

Create a new node in Cocos Creator, call it 'game'. We will use it to control game logic.
Now create new script 'assets/scripts/game.js'.

Our bullet needs a sprite, and it should also honor physics while flying. For the purpose the Cocos Creator has the Chipmunk physics engine integrated.

Lets create some properties for the 'game' component:

```js
properties: {
    /**
     * World gravity
     */
    gravity: 0,
    bulletSprite: {
        default: null,
        type: cc.SpriteFrame,
    },
},
```

Here are two properties, one to set the physics space gravity from within the Cocos Creator, and another for the bullet sprite.

To make physics work we need to create a space. Lets do it in 'onLoad' method:

```js
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
    this.space.addStaticShape(floor);
    
    // create bullet verts
    const { width: bw, height: bh } = this.bulletSprite.getRect();
    this.bulletVerts = [
        -bw/2, -bh/2,
        -bw/2,  bh/2,
        bw/2,  bh/2,
        bw/2, -bh/2
    ];
},
```

As of moment of writing, the Chipmank library is exposed as 'window.cp'. Here i create a physics space and set it a gravity. Then i create a static shape to serve as a floor. So all physical bodies falling from the skyes will hit the floor. Last thing is to create a bullet shape description, we will use it for physics later.

The 'cp.v(x, y)' is a factory method for vector creation.

The physics engine is separated from the game engine, but it needs to get called to perform simulation. So lets call it in the update method of the 'game' component:


```js
update: function (dt) {
    if (this.space) {
        this.space.step(dt);
    }
},
```

Thats it. Now add a method for bullet creation:


```js
createBullet(x, y, velocity, angle) {
    // create bullet node
    const bulletNode = new cc.Node();
    const bulletSprite = bulletNode.addComponent(cc.Sprite);
    bulletSprite.spriteFrame = this.bulletSprite;
    const pos = bulletNode.position = cc.v2(x, y);
    bulletNode.setRotation(angle);
    
    // Create physics
    const verts = this.bulletVerts;
    
    // Body(m, i)
    const body = new cp.Body(1.0, cp.momentForPoly(1.0, verts, cp.vzero));
    body.setPos(bulletNode.position);
    body.setVel(cp.v(sind(angle) * velocity, cosd(angle) * velocity));
    this.space.addBody(body);
    
    // Shape
    const shape = new cp.PolyShape(body, verts, cp.vzero);
    shape.e = 0.5;
    shape.u = 0.5;
    this.space.addShape(shape);
    
    // Add bullet script
    bulletNode.addComponent('bullet').setBody(body);
    
    // Finally add bullet to the scene
    cc.director.getScene().addChild(bulletNode);
},
```

Step by step. Create a node, add a sprite component, set the sprite frame of the sprite, set position and rotation of the new bullet. Then create a body and a shape and add them to our physics space. Add a script component to controll bullet behaviour and add the node to the scene.

Now create a 'assets/scripts/bullet' script:

```js
properties: {
    body: null,
    timeToLive: 0,
},

// use this for initialization
onLoad: function () {
    this.timeToLive = 10000;
    this.lifeTime = 0;
},

setBody(body) {
    this.body = body;
}
```

The component has two properties, one to keep physics body and another - a maximum live time for the bullet. Since the bullets will be created dynamically initialize the properties in 'onLoad' method. And add a method to set the body.

Finally add an update method:

```js

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
```

First of all, check if the node is valid and if it has body. A node can be present some time after you call destroy method, so we need to make sure that it is not handled during that time.

Every update we need to sync the position and rotation of the node with the physical body. And increase the current live time. When the live time runs out - destroy the node.


The bullet is ready. But someone should create it. It is time to udpate the cannon component. Make the cannon shoot when the spacebar is pressed:

```js
hookInput() {
    const cannon = this;
    cc.eventManager.addListener({
        event: cc.EventListener.KEYBOARD,
        onKeyPressed(kcode, e) {
            switch(kcode) {
                //...
                case cc.KEY.space:
                    const cpos = cannon.barrelNode.convertToWorldSpaceAR(cc.v2(0, 0));
                    const angle = cannon.barrelNode.rotation;
                    const h = cannon.barrelNode.height;
                    cpos.x += h * sind(angle);
                    cpos.y += h * cosd(angle);
                    cc.find('/game').getComponent('game').createBullet(cpos.x, cpos.y, 400, angle);
                    break;
            }
        },
        //...
    }, this.node);
},
```

When the space is pressed calculate the point on the top of the barrel in world space and set it as starting point for the bullet.

In this line of code i look for the 'game' node, then i get its 'game' component and call the method on it.

```js
cc.find('/game').getComponent('game').createBullet(cpos.x, cpos.y, 400, angle);
```

Perfect! The cannon can shoot! But there is no target yet, lets create one!


[Step 03](./step03.md)