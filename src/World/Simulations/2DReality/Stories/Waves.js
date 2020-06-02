import React from "react";
import Story from "./Story";
import Matter from "matter-js";
import Render from "../Matter/Render";
import Tone from "tone";
import Splatter from "../Effects/Splatter";
let notes = ["B", "F", "B", "C", "F", "C", "B", "C", "C"];
notes = ["C", "B"];
notes = ["C1", "C2"];
let sampler;
let timeout;
//https://en.wikipedia.org/wiki/Sine_wave
const Waves = ({ initMatter, ...rest }) => {
  const [currentPhase, setCurrentPhase] = React.useState(0);
  const [engine, setEngine] = React.useState();
  const [player, setPlayer] = React.useState();
  const [currentNote, setCurrentNote] = React.useState(0);
  const init = (options) => {
    const { engine, render } = initMatter(
      "waves",
      "waves-container",
      options,
      true,
      {
        render: {
          zIndex: 100,
          fillStyle: "red",
          sprite: {
            // texture: "./assets/game/Tiles/dirt.png",
          },
        },
      }
    );
    let phases = [
      "Waves are everywhere and Math is no exception. Let's explore waves together. Use keys WASD or arrow keys to move the circle around.",
      (x) => {
        x === 50;
        //point arrow in the direction of 100
      },
      `Oops! There is a problem! go to at mile x50 there is a shape in need! Go over there and investigate.`,
      (x) => {
        x === 100;
      },
      (x) => {
        console.log(engine.bodies);
      },
    ];
    let player = Matter.Bodies.circle(400, 100, 50, {
      label: "player",
      restitution: 0.4,
      render: {
        fillStyle: "#000000",
        zIndex: 9000,
      },
    });
    Matter.World.add(engine.world, [player]);
    setEngine({ engine, render: render });
    setPlayer(player);
  };
  React.useEffect(() => {
    init({
      wireframes: false,
      background: "url('/assets/game/starry-background.jpg')",
      // background: "#000000",
      showAngleIndicator: false,
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  return (
    <>
      <Story
        title={"Waves"}
        currentPhase={currentPhase}
        storyCondition={() => {
          if (phases[0]()) {
            setCurrentPhase(currentPhase + 1);
          }
        }}
        playerTitle={"Sin(x)"}
        funcs={[{ label: "Sin(x)", fn: (x) => Math.sin(x) }]}
        boundry={[0, 50]}
        player={player}
        engine={engine && engine.engine}
        Render={Render}
        render={engine && engine.render}
        onUpdateBounds={(bounds) => {
          let note = Math.floor(currentNote & notes.length) + 1;
          // if (player && engine) {
            // let { launch } = Splatter({ engine: engine.engine });
            // launch(player.position.x, player.position.y, 3);
          // }
          if (!sampler) {
            sampler = new Tone.Sampler(
              {
                C1: "/assets/game/audio/loop/bass.mp3",
                // C2: "/assets/game/audio/loop/chords.mp3",
                C3: "/assets/game/audio/loop/kick.mp3",
                C4: "/assets/game/audio/loop/snare.mp3",
              },
              function () {
                setTimeout(function () {
                  // sampler.triggerAttack("C1");
                  // sampler.triggerAttack("C2");
                  Tone.Transport.scheduleRepeat(function (time) {
                    // sampler.triggerAttack("C3");
                    // sampler.triggerRelease("C3");
                  }, "8n");
                  Tone.Transport.scheduleRepeat(function (time) {
                    console.log("hello");
                    // sampler.triggerAttack("C4");
                    // sampler.triggerRelease("C4");
                  }, "4n");
                }, 6000);
              }
            ).toMaster();
            Tone.Transport.start(); //the transport must be started
          }
          setCurrentNote(currentNote + 1);
        }}
        {...rest}
      ></Story>
      <div id={`waves-container`}>
        <canvas id={`waves`}></canvas>
      </div>
    </>
  );
};

export default Waves;
