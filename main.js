import Phaser from "phaser";
import buttonCatImageUrl from "./assets/images/button-cat.svg";
import buttonFoodImageUrl from "./assets/images/button-food.svg";
import buttonSleepImageUrl from "./assets/images/button-sleep.svg";
import buttonToyImageUrl from "./assets/images/button-toy.svg";
import blackCatImageUrl from "./assets/images/black-cat.png";
import whiteLuckyCatImageUrl from "./assets/images/white-lucky-cat.png";
import cushionImageUrl from "./assets/images/cushion.svg";
import foodImageUrl from "./assets/images/food.svg";
import heartImageUrl from "./assets/images/heart.svg";
import terraceImageUrl from "./assets/images/terrace.png";
import catMeowSoundUrl from "./assets/audio/animal-cat-meow-quiet-03.mp3";
import catEatSoundUrl from "./assets/audio/animal-cat-eat-smack-sequence-02.mp3";
import catPurrSoundUrl from "./assets/audio/cat-purring-68797.mp3";
import bgMusicUrl from "./assets/audio/kf010914-alive-pets.mp3";

let cat;
const skins = ["black", "whiteLucky"];
let skin = "black";
let sounds = {};
let eating = false;

function preload() {
  this.load.image("buttonCat", buttonCatImageUrl);
  this.load.image("buttonFood", buttonFoodImageUrl);
  this.load.image("buttonSleep", buttonSleepImageUrl);
  this.load.image("buttonToy", buttonToyImageUrl);
  this.load.image("cushion", cushionImageUrl);
  this.load.image("food", foodImageUrl);
  this.load.image("heart", heartImageUrl);
  this.load.image("terrace", terraceImageUrl);

  this.load.spritesheet("blackCat", blackCatImageUrl, {
    frameWidth: 500,
    frameHeight: 500,
  });

  this.load.spritesheet("whiteLuckyCat", whiteLuckyCatImageUrl, {
    frameWidth: 500,
    frameHeight: 500,
  });

  this.load.audio("meow", catMeowSoundUrl);
  this.load.audio("eat", catEatSoundUrl);
  this.load.audio("purr", catPurrSoundUrl);
  this.load.audio("bgMusic", bgMusicUrl);
}

function create() {
  window.scene = this;

  this.terrace = this.add.image(300, 300, "terrace").setInteractive();
  this.cushion = this.add.image(200, 500, "cushion");
  this.cushion.visible = false;
  this.food = this.add.image(600, 440, "food").setScale(0.5);
  this.food.visible = false;

  this.add.rectangle(400, 725, 800, 200, 0xb8c2ca);
  this.buttonCat = this.add.image(145, 710, "buttonCat").setInteractive();
  this.buttonFood = this.add.image(315, 710, "buttonFood").setInteractive();
  this.buttonToy = this.add.image(485, 710, "buttonToy").setInteractive();
  this.buttonSleep = this.add.image(655, 710, "buttonSleep").setInteractive();

  this.buttonCat.on("pointerup", (pointer) => {
    skin = skin === "black" ? "whiteLucky" : "black";
    cat.anims.play(`idle-${skin}`);
  });

  this.buttonSleep.on("pointerup", (pointer) => {
    this.cushion.visible = true;
    const newPosition = {
      x: this.cushion.x,
      y: this.cushion.y - 100,
    };

    const callback = () => {
      sounds.purr.play();
      const anim = "sleep" + Math.floor(Math.random() * 8 + 1);
      cat.anims.play(`${anim}-${skin}`);
      cat.y = cat.y + 50;
      this.time.addEvent({
        delay: 6000,
        callback: () => {
          sounds.purr.stop();
          this.cushion.visible = false;
          this.heart1 = this.physics.add
            .image(cat.x, cat.y, "heart")
            .setScale(0.2);
          this.heart2 = this.physics.add
            .image(cat.x + 30, cat.y - 30, "heart")
            .setScale(0.2);
          this.heart3 = this.physics.add
            .image(cat.x, cat.y - 60, "heart")
            .setScale(0.2);

          moveTo(this, this.heart1, {
            x: this.heart1.x,
            y: this.heart1.y - 50,
          });
          moveTo(this, this.heart2, {
            x: this.heart2.x,
            y: this.heart2.y - 50,
          });
          moveTo(this, this.heart3, {
            x: this.heart3.x,
            y: this.heart3.y - 50,
          });
          cat.anims.play(`idle-${skin}`);
          cat.y = cat.y - 50;
        },
      });
    };
    moveTo(this, cat, newPosition, callback);
  });

  this.buttonFood.on("pointerup", (pointer) => {
    this.food.visible = true;
    const newPosition = {
      x: this.food.x + 100,
      y: this.food.y - 50,
    };
    const callback = () => {
      sounds.eat.play();
      eating = true;
      this.time.addEvent({
        delay: 4000,
        callback: () => {
          eating = false;
          sounds.eat.stop();
          this.food.visible = false;
          this.heart1 = this.physics.add
            .image(cat.x, cat.y, "heart")
            .setScale(0.2);
          this.heart2 = this.physics.add
            .image(cat.x + 30, cat.y - 30, "heart")
            .setScale(0.2);
          this.heart3 = this.physics.add
            .image(cat.x, cat.y - 60, "heart")
            .setScale(0.2);

          moveTo(this, this.heart1, {
            x: this.heart1.x,
            y: this.heart1.y - 50,
          });
          moveTo(this, this.heart2, {
            x: this.heart2.x,
            y: this.heart2.y - 50,
          });
          moveTo(this, this.heart3, {
            x: this.heart3.x,
            y: this.heart3.y - 50,
          });
        },
      });
    };
    moveTo(this, cat, newPosition, callback);
  });

  cat = this.physics.add
    .sprite(500, 320, "blackCat")
    .setScale(0.5)
    .refreshBody();
  window.cat = cat;

  this.add.image("heart", 200, 200);

  this.meowTicks = 0;

  skins.forEach((skin) => {
    this.anims.create({
      key: `idle-${skin}`,
      frames: this.anims.generateFrameNumbers(`${skin}Cat`, {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: `meow-${skin}`,
      frames: this.anims.generateFrameNumbers(`${skin}Cat`, {
        start: 3,
        end: 6,
      }),
      frameRate: 10,
      repeat: 0,
      yoyo: true,
    });

    this.anims.create({
      key: `run-${skin}`,
      frames: this.anims.generateFrameNumbers(`${skin}Cat`, {
        start: 7,
        end: 12,
      }),
      frameRate: 10,
      repeat: -1,
    });

    for (let i = 1; i <= 8; i++) {
      this.anims.create({
        key: `sleep${i}-${skin}`,
        frames: this.anims.generateFrameNumbers(`${skin}Cat`, {
          start: 12 + i,
          end: 12 + i,
        }),
        frameRate: 10,
        repeat: 0,
      });
    }
  });

  sounds.eat = this.sound.add("eat");
  sounds.meow = this.sound.add("meow");
  sounds.purr = this.sound.add("purr", { volume: 0.3 });
  sounds.bgMusic = this.sound.add("bgMusic", { volume: 0.05, loop: true });

  if (!this.sound.locked) {
    sounds.bgMusic.play();
  } else {
    this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
      sounds.bgMusic.play();
    });
  }

  this.terrace.on("pointerup", (pointer) => {
    moveTo(this, cat, pointer);
  });

  cat.anims.play(`idle-${skin}`);
}

function update() {
  // cat.setTexture(texture, 0);
  cat.flipX = cat.body.velocity.x > 0;

  if (this.target) {
    const tolerance = 4;
    const distance = Phaser.Math.Distance.BetweenPoints(cat, this.target);
    if (cat.body.speed > 0) {
      if (distance < tolerance) {
        cat.body.reset(this.target.x, this.target.y);
        cat.anims.play(`idle-${skin}`);

        if (this.moveFinished) {
          this.moveFinished();
        }
      }
    }
  }

  const rand = Math.random();
  if (this.meowTicks > 500 && rand > 0.99 && cat.anims.getName() === "idle") {
    cat.anims.play(`meow-${skin}`).chain(`idle-${skin}`);
    sounds.meow.play();
    this.meowTicks = 0;
  }

  if (!eating) {
    this.meowTicks += 1;
  }

  if (this.heart1 && this.heart1.y < 200) {
    this.heart1.destroy();
  }
  if (this.heart2 && this.heart2.y < 200) {
    this.heart2.destroy();
  }
  if (this.heart3 && this.heart3.y < 200) {
    this.heart3.destroy();
  }
}

const moveTo = (scene, source, target, callback = null) => {
  scene.target = new Phaser.Math.Vector2();
  scene.target.x = Phaser.Math.Clamp(target.x, 100, 700);
  scene.target.y = Phaser.Math.Clamp(target.y, 300, 520);

  scene.moveFinished = callback;

  scene.physics.moveToObject(source, scene.target, 100);

  if (source === cat) {
    source.anims.play(`run-${skin}`, true);
  }
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
