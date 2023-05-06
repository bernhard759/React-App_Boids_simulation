import { useState, useRef, MutableRefObject, useCallback } from 'react'
import { Button, Input } from './StyledComponents';
import Canvas from './components/Canvas';
import './App.css'


function App() {

  // Running state
  const [running, setRunning] = useState(false);
  const [restart, setRestart] = useState(false);

  // Boid num
  const [boidNum, setBoidNum] = useState(50);
  const boidNumRef = useRef() as MutableRefObject<HTMLInputElement>;

  // Boid color
  const [boidColor, setBoidColor] = useState("#808080");

  // Params state
  const [separation, setSeparation] = useState(0.05);
  const [alignment, setAlignment] = useState(0.05);
  const [cohesion, setCohesion] = useState(0.01);

  // Handle number input
  const handleNumInput = useCallback((val: string) => {
    if (val.length) {
      boidNumRef.current.classList.remove("invalid");
      setBoidNum(Number(val));
    } else {
      boidNumRef.current.classList.add("invalid");
    }
  }, []);

  // Markup
  return (
    <>
      <h1>Boids simulation</h1>
      <div className="boids__controls">

        <div className="boids__controls__row">
          {/* Play button */}
          <Button onClick={() => {
            setRunning(!running);
          }}>{running ? "Pause" : "Play"}</Button>

          {/* Restart button */}
          <Button onClick={() => {
            setRunning(false);
            setRestart(true);
          }}>Restart</Button>

          {/* Number input */}
          <div className="boids__controls__number-wrap">
            <label htmlFor="boid-number">Boid number</label>
            <input id="boid-number" ref={boidNumRef} type="number" step="10" min="10" max="150" defaultValue={boidNum} onChange={(e) => { handleNumInput(e.target.value) }} onBlur={(e) => handleNumInput(e.target.value)} />
          </div>

          {/* Color input */}
          <div className="boids__controls__color">
            <label htmlFor="boid-color">Boid color</label>
            <input type="color" id="boid-color"
              value={boidColor} onChange={(e) => setBoidColor(e.target.value) }></input>
          </div>

        </div>

        <div className="boids__controls__row">
          {/* Slider */}
          <label>Separation <Input type="range"
            min="0" max="1" step="0.05" value={separation} onChange={(e) => { setSeparation(Number(e.target.value)) }}></Input>
          </label>
          {/* Slider */}
          <label>Alignment <Input type="range"
            min="0" max="1" step="0.05" value={alignment} onChange={(e) => { setAlignment(Number(e.target.value)) }}></Input>
          </label>
          {/* Slider */}
          <label>Cohesion <Input type="range"
            min="0" max="0.1" step="0.01" value={cohesion} onChange={(e) => { setCohesion(Number(e.target.value)) }}></Input>
          </label>
        </div>
      </div>

      {/* Boids simulation canvas */}
      <Canvas running={running} restart={restart} boidNum={boidNum} boidColor={boidColor} separation={separation} alignment={alignment} cohesion={cohesion} setRestart={(val: boolean) => setRestart(val)} ></Canvas>

      <div className="boids__info">
        Boids is an artificial life program, developed by Craig Reynolds in 1986, which simulates the flocking behaviour of birds.<br />For more info, see <a href="https://en.wikipedia.org/wiki/Boids">Wiki</a>.
      </div>
    </>
  )
}

export default App
