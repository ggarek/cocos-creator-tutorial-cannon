# Step 01: Build a cannon, move a barrel

First of all, i assume that you already created an empty Cocos Creator project.
Now we are ready to start.

Let us begin with the cannon. Our cannon consist of body, which i call a tank, and a barrel. So in this step we will create the cannon and make the barrel move.

All the things about the cannon will happen in a script 'assets/scripts/cannon.js'.

To draw the cannon we need to create sprites. Lets define two SpriteFrames for the tank and the barrel as our script component properties:

```js
properties: {
    barrelSprite: {
        default: null,
        type: cc.SpriteFrame,
    },
    tankSprite: {
        default: null,
        type: cc.SpriteFrame,
    },
}
```

When we create the properties in that way, we can set initial values of the properties from within Cocos Creator. In this particular case i defined two properties of type 'SpriteFrame'. So now we can select a node in the Cocos Creator, add a cannon script component to it and drag and drop a tank and a barrel sprites to it. Ok, but how do we use it?

A Component has an onLoad method, which is called upon creation. Lets use it to create those sprites:

```js
onLoad() {
    // Create barrel node
    const barrelNode = this.barrelNode = new cc.Node();
    const barrelSprite = barrelNode.addComponent(cc.Sprite);
    barrelSprite.spriteFrame = this.barrelSprite;
    barrelNode.setAnchorPoint(0.5, 0);
    this.node.addChild(barrelNode);
    
    // Create cannon node
    const tankNode = this.tankNode = new cc.Node();
    const tankSprite = tankNode.addComponent(cc.Sprite);
    tankSprite.spriteFrame = this.tankSprite;
    this.node.addChild(tankNode);
    
    this.barrelPosition = tankNode.height * 0.4;
    
    // Position barrel
    barrelNode.setPosition(0, this.barrelPosition);
},
```

Wow, a lot of things happend, lets review it step by step.

First of all, i create two nodes, each with 'Sprite' componet. The 'Sprite' component is used to render a sprite.
Then both nodes are added to the cannon node.
And one more thing happens here, i change the anchor of the barrel node so it is easier to position it.

For better targeting we will need to move the barrel. Let us create several more properties:

```js
properties: {
    //...
    angle: 0,
    baseAngleSpeed: 0,
    angleSpeed: 0,
    leftMaxAngle: 0,
    rightMaxAngle: 0,
}
```

Once again, all of this properties can be set from within the Cocos Creator. And if you intialize them here, the properties will be overriden with values from the editor.
 
Each component has an 'update' method, wich is called every frame, lets use it to update the barrel position:

```js
update: function (dt) {
    const { angleSpeed } = this;
    if (angleSpeed !== 0) {
        const angle = this.angle = clamp(this.angle + angleSpeed * dt, -1 * this.leftMaxAngle, this.rightMaxAngle);
        const r = this.barrelPosition;
        
        this.barrelNode.setRotation(angle);
        this.barrelNode.setPosition(r * sind(angle), r * cosd(angle));
    }
},
```

Every frame i check if the `angleSpeed` is not zero, and if it is not i update the position of the barrel according to the speed.
But here i restrict the barrel angle with 'leftMaxAngle' and 'rightMaxAngle'. There are several helper functions i use to make code more succinct, here are they (just put it in the very top of the script):

```js
const { cos, sin, PI } = Math;
const rad = deg => deg * PI / 180;
const cosd = deg => cos(rad(deg));
const sind = deg => sin(rad(deg));
const clamp = (val, min, max) => val < min ? min : val > max ? max : val;
```

But nothing will happen yet. Why? Because the 'angleSpeed' is 0. How do we change it? I suppose the best decision would be to use input events to alter the 'angleSpeed'. Lets create a method to hook input events in the cannon component:

```js
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
}
```

Here i add an event listener to the game event amanger. When the left or right key is pressed alter the 'angleSpeed'.
And set it to 0 upon the key release.

Now we should call this method to really hook the events:

```js
onLoad: {
  //...
  
  this.hookInput();
}
```

It is pretty much all. What do we have now? The cannon is displayed, and the barrel is moving! Not bad for the start, but what about shooting?


[Step 02](./step02.md)