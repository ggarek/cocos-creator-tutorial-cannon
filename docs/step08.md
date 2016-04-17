# Step 08: I am not deaf!

Our game look almost greate now, but someting is missing... I know, there is not a sound yet, we need some.

Lets add some. (I used sfxr editor to create the sounds)

What we need is to add some properties to the game component.

```js
proeprties: {
  meteorExplodeInTheAirSFX: {
      default: null,
      url: cc.AudioClip,            
  },
  meteorHitTheGroundSFX: {
      default: null,
      url: cc.AudioClip,
  },
}
```

Here is something new. Remember we used 'cc.url.raw' to get the asset path in rutime. As i promised here is the better solution. We can create properties `url: cc.AudioClip` to get the url of the audio clip asset in runtime. Now just drag and drop the audio clip in the property in Cocos Creator.

To actually play the sound you need to call play method of the clip:

```js
cc.audioEngine.playEffect(this.meteorHitTheGroundSFX, false);
cc.audioEngine.playEffect(this.meteorExplodeInTheAirSFX, false);
```

Add this lines to corresponding collision callbacks and you are done!

[Conculsion](./conclusion.md)