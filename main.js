import Phaser from "phaser";
import buttonCatImageUrl from "./assets/images/button-cat.svg";
import buttonFoodImageUrl from "./assets/images/button-food.svg";
import catImageUrl from "./assets/images/cat.png";
import cushionImageUrl from "./assets/images/cushion.svg";
import foodImageUrl from "./assets/images/food.svg";
import terraceImageUrl from "./assets/images/terrace.png";
import catMeowSoundUrl from "./assets/audio/animal-cat-meow-quiet-03.mp3";
import catEatSoundUrl from "./assets/audio/animal-cat-eat-smack-sequence-02.mp3";
import bgMusicUrl from "./assets/audio/kf010914-alive-pets.mp3";

let cat;
let sounds = {};

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
  this.load.audio("eat", catEatSoundUrl);
  this.load.audio("bgMusic", bgMusicUrl);
}

function create() {
  window.scene = this;

  this.terrace = this.add.image(300, 300, "terrace").setInteractive();
  this.cushion = this.add.image(200, 440, "cushion").setScale(0.7);
  this.cushion.visible = false;
  this.food = this.add.image(600, 440, "food").setScale(0.5);
  this.food.visible = false;

  this.add.rectangle(400, 725, 800, 200, 0xb8c2ca);
  this.buttonCat = this.add.image(150, 710, "buttonCat").setInteractive();
  this.buttonFood = this.add.image(350, 710, "buttonFood").setInteractive();

  this.buttonCat.on("pointerup", (pointer) => {
    console.log("clicked cat button");
  });

  this.buttonFood.on("pointerup", (pointer) => {
    this.food.visible = true;
    const newPosition = {
      x: this.food.x + 100,
      y: this.food.y - 50,
    };
    const callback = () => {
      sounds.eat.play();
      this.time.addEvent({
        delay: 4000,
        callback: () => {
          sounds.eat.stop();
          this.food.visible = false;
        },
      });
    };
    moveTo(this, newPosition, callback);
  });

  cat = this.physics.add.sprite(500, 320, "cat").setScale(0.5).refreshBody();
  window.cat = cat;

  this.meowTicks = 0;

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
    repeat: -1,
  });

  sounds.eat = this.sound.add("eat");
  sounds.meow = this.sound.add("meow");
  sounds.bgMusic = this.sound.add("bgMusic", { volume: 0.05, loop: true });

  if (!this.sound.locked) {
    sounds.bgMusic.play();
  } else {
    this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
      sounds.bgMusic.play();
    });
  }

  this.terrace.on("pointerup", (pointer) => {
    moveTo(this, pointer);
  });

  cat.anims.play("idle");
}

function update() {
  cat.flipX = cat.body.velocity.x > 0;

  if (this.target) {
    const tolerance = 4;
    const distance = Phaser.Math.Distance.BetweenPoints(cat, this.target);
    if (cat.body.speed > 0) {
      if (distance < tolerance) {
        cat.body.reset(this.target.x, this.target.y);
        cat.play("idle");

        if (this.moveFinished) {
          this.moveFinished();
        }
      }
    }
  }

  const rand = Math.random();
  if (this.meowTicks > 500 && rand > 0.99 && cat.anims.getName() === "idle") {
    cat.anims.play("meow").chain("idle");
    sounds.meow.play();
    this.meowTicks = 0;
  }

  this.meowTicks += 1;
}

const moveTo = (scene, target, callback = null) => {
  scene.target = new Phaser.Math.Vector2();
  scene.target.x = Phaser.Math.Clamp(target.x, 100, 700);
  scene.target.y = Phaser.Math.Clamp(target.y, 300, 520);

  scene.moveFinished = callback;

  scene.physics.moveToObject(cat, scene.target, 100);
  cat.anims.play("run", true);
};

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  physics: {
    default: "arcade",
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
