import Phaser from "phaser";

let cat;
let sounds = {};
let cursors;

function preload() {
  this.load.image("terrace", "assets/images/terrace.png");
  this.load.image("star", "assets/images/star.png");
  this.load.spritesheet("cat", "assets/images/cat-meow.png", {
    frameWidth: 500,
    frameHeight: 500,
  });

  this.load.audio("meow", "assets/audio/animal-cat-meow-quiet-03.mp3");
}

function create() {
  this.add.image(400, 300, "terrace");

  cat = this.add.sprite(100, 420, "cat").setScale(0.5);
  window.cat = cat;

  this.anims.create({
    key: "meow",
    frames: this.anims.generateFrameNumbers("cat", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: 0,
    yoyo: true,
  });

  sounds["meow"] = this.sound.add("meow");

  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (cursors.left.isDown) {
    cat.setPosition(cat.x - 10, cat.y);
  } else if (cursors.right.isDown) {
    cat.setPosition(cat.x + 10, cat.y);
  }
  if (cursors.space.isDown) {
    cat.anims.play("meow", true);
    sounds.meow.play();
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
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
