import { useState } from 'react'
import '../css/PathFindingVisualiser.css'
const PathFindingVisualiser = () => {
  const [algo ,setAlgo]=useState(1)
  return (
    <main>
        <section className="optionsSection" id='pathFindingOptions'>
            <div className='pathFindingOption' id='resetDefault'>
              <button>Reset</button>
            </div>
            <div className='pathFindingOption'>
              <p>Maze</p>
            </div>
            <div className='pathFindingOption'>
              <p>Animation speed</p>
            </div>
            <div className='pathFindingOption' id='pathFindingAlgoritms'>
              <p>Algorithm:</p>
              <div>
                <p style={{ borderBottomColor: algo === 1 ? 'var(--colorScale2)' : '' }} onClick={() => setAlgo(1)}>dijkstra's</p>
                <p style={{ borderBottomColor: algo === 2 ? 'var(--colorScale2)' : '' }} onClick={() => setAlgo(2)}>A star</p>
              </div>
            </div>
            <div className='pathFindingOption'>
              <button>Find path !</button>
            </div>
        </section>
        <section id='pathFindingSection'>
        </section>
    </main>
  )
}

export default PathFindingVisualiser