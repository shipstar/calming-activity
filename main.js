import Phaser from "phaser";
import buttonCatImageUrl from "./assets/images/button-cat.svg";
import buttonFoodImageUrl from "./assets/images/button-food.svg";
import catImageUrl from "./assets/images/cat.png";
import cushionImageUrl from "./assets/images/cushion.svg";
import foodImageUrl from "./assets/images/food.svg";
import terraceImageUrl from "./assets/images/terrace.png";
import catMeowSoundUrl from "./assets/audio/animal-cat-meow-quiet-03.mp3";
import bgMusicUrl from "./assets/audio/kf010914-alive-pets.mp3";

let cat;
let sounds = {};
let cursors;

function preload() {
  this.load.image("buttonCat", buttonCatImageUrl);
  this.load.image("buttonFood", buttonFoodImageUrl);
  this.load.image("cushion", cushionImageUrl);
  this.load.image("food", foodImageUrl);
  this.load.image("terrace", terraceImageUrl);

  this.load.spritesheet("cat", catImageUrl, {
    frameWidth: 500,
    frameHeight: 500,
  });

  this.load.audio("meow", catMeowSoundUrl);
  this.load.audio("bgMusic", bgMusicUrl);
}

function create() {
  this.add.image(300, 300, "terrace");
  this.add.image(200, 440, "cushion").setScale(0.7);
  this.add.image(600, 440, "food").setScale(0.5);

  this.add.rectangle(400, 725, 800, 200, 0xb8c2ca);
  this.add.image(150, 710, "buttonCat");
  this.add.image(350, 710, "buttonFood");

  cat = this.add.sprite(500, 320, "cat").setScale(0.5);
  window.cat = cat;

  this.anims.create({
    key: "idle",
    frames: this.anims.generateFrameNumbers("cat", { start: 0, end: 2 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "meow",
    frames: this.anims.generateFrameNumbers("cat", { start: 3, end: 6 }),
    frameRate: 10,
    repeat: 0,
    yoyo: true,
  });

  this.anims.create({
    key: "run",
    frames: this.anims.generateFrameNumbers("cat", { start: 7, end: 12 }),
    frameRate: 10,
    repeat: 0,
  });

  sounds.meow = this.sound.add("meow");
  sounds.bgMusic = this.sound.add("bgMusic", { volume: 0.3, loop: true });

  if (!this.sound.locked) {
    sounds.bgMusic.play();
  } else {
    this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
      sounds.bgMusic.play();
    });
  }

  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (cursors.left.isDown) {
    cat.anims.play("run", true);
    cat.setPosition(cat.x - 10, cat.y);
    cat.flipX = false;
  } else if (cursors.right.isDown) {
    cat.anims.play("run", true);
    cat.setPosition(cat.x + 10, cat.y);
    cat.flipX = true;
  } else if (cursors.space.isDown) {
    cat.anims.play("meow", false);
    sounds.meow.play();
  } else {
    cat.anims.play("idle", true);
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

// player = this.physics.add.sprite(100, 1000, "dude");
// player.setBounce(0.2);
// player.setCollideWorldBounds(true);
// player.body.setGravityY(300);

// this.anims.create({
//   key: "left",
//   frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
//   frameRate: 10,
//   repeat: -1,
// });

// this.anims.create({
//   key: "turn",
//   frames: [{ key: "dude", frame: 4 }],
//   frameRate: 20,
// });

// this.anims.create({
//   key: "right",
//   frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
//   frameRate: 10,
//   repeat: -1,
// });

// // START HERE!!!
// this.physics.add.collider(player, platforms);
// this.physics.add.collider(cat, platforms);

// stars = this.physics.add.group({
//   key: "star",
//   repeat: 11,
//   setXY: { x: 12, y: 0, stepX: 70 },
// });

// stars.children.iterate(function (child) {
//   child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
// });
