# Step 07: Every meteor needs a tail!

I decided to make our meteors feel more alive. The best thing to make any meteor look happier is a tail.

Lets use some particles to make a meteor tail.
I used an 'Apparticle' particle editor to make the tail. Then i added the particles file to the project and create a Prefab of it.

Now add a new property to keep the prefab in the game component:

```js
properties: {
    meteorTailParticles: {
        default: null,
        type: cc.Prefab,
    },
}
```

Then add 'ParticleSystem' component to the meteor node upon creation in the game component:

```js
createMeteor() {
    //...
    const node = new cc.Node();
    // Add particle emitter        
    node.addComponent(cc.ParticleSystem).file = cc.url.raw('/particles/meteor-tail-particles.plist');;
    // Add sprite
    node.addComponent(cc.Sprite).spriteFrame = this.meteorSprite;
    node.setPosition(cc.v2(x, y));  
    ///...
},
```

The 'cc.url.raw' method is used to resolve the asset path in runtime. (There is a more clean way to pass the url to the component via properties. Please look the final code for it)

Now our meteors are the happiest meteors in the world, because they have pretty tails!

[Step 08](./step08.md)