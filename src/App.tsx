import { useState } from 'react'
import { Button, Input } from './StyledComponents';
import Canvas from './components/Canvas';
import './App.css'


function App() {

  // Running state
  const [running, setRunning] = useState(false);
  const [restart, setRestart] = useState(false);

  // Params state
  const [separation, setSeparation] = useState(0.05);
  const [alignment, setAlignment] = useState(0.05);
  const [cohesion, setCohesion] = useState(0.01);

  // Markup
  return (
    <>
      <h1>Boids simulation</h1>
      <div className="boids__controls">

        <Button onClick={() => {
          setRunning(!running);
        }}>{running ? "Pause" : "Play"}</Button>

        <Button onClick={() => {
          setRunning(false);
          setRestart(true);
        }}>Restart</Button>

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

      {/* Boids simulation canvas */}
      <Canvas running={running} restart={restart} separation={separation} alignment={alignment} cohesion={cohesion} setRestart={(val: boolean) => setRestart(val)} ></Canvas>
    
    <div className="boids__info">
    Boids is an artificial life program, developed by Craig Reynolds in 1986, which simulates the flocking behaviour of birds.<br/>For more info, see <a href="https://en.wikipedia.org/wiki/Boids">Wiki</a>
    </div>
    </>
  )
}

export default App
