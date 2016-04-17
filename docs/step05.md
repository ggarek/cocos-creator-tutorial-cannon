# Step 05: What if...? Boom!

In this step i took an explosion animation from the opengameart.org. Cropped it to the frames and added it as textures to the Cocos Creator.
Then i created `AnimationClip` of it and created to nodes on the scene. Then i used the node to create a Prefab. 
Prefab is a very useful concept in Cocos Creator. It is prefabricated node and you can use it to instantiate exact copies of the node in runtime.

So now, when we have our animation clip created and we have also a prefab, lets add it to the game.

First of all, add one new property to the game conponent

```js
bulletMeteorExplosion: {
    default: null,
    type: cc.Prefab,
},
```

We will use it to set an explosion prefab from within the Cocos Creator.

Next update an 'onLoad' method of the game to add the explosion when collsion happens:

```js
onLoad() {
    //...
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
    //...
```

Here you can see how to create a new node using a prefab. After the node with animtion is created, get the Animation component of it and call the play method to run the explosion animation.

Thats it. Now when a bullet meets a meteor an explosion occurs.

[Step 06](./step06.md)
