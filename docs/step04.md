# Step 04: A bullet? A meteor? Collide!

Remember that collision types we set to the bullet and the meteor shapes in the previous step? Here how we can use it to hook the callback on collison. But we also need to set the collision type for the floor shape to hook the collision of meteor and the floor.

```js
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
        return true;
    });

    // Handle case when meteor touches the ground
    this.space.addCollisionHandler(FLOOR_SHAPE, METEOR_SHAPE, (arbiter, space) => {
        const { b } = arbiter;
        shapesToRemove.push(b);
        return true;
    });
},
```

Here is the full code. I added to callbacks. One for bullet collision with the meteor and other for the meteor hitting the floor.
The collision callback takes two arguments the 'arbiter' and the 'space'. You can use the 'arbiter' to reach the colliding bodies and shapes.

The important thing here is that we can not simply remove shapes and bodies from the physical space, beacuse we are in the middle of the physics engine step. The solution is pretty simple - remember colliding shapes you would like to remove, and remove it later when the physics step is finished.
I did it in the update method of the game component:

```js
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
```

But to be able to reference back to the cocos engine node we need to store it with the shape, so simply add it as userData field when creating a shape.

```js
shape.userData = node;
```

Wow, everything is flying and colliding. Bullets even destory the meteors! That is a lot of work, but i think we need more special effects to make our game more alive. Lets do it in the next step.


you can checkout git tag step0w to review the code

[Step 05](./step05.md)