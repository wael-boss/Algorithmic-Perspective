import { useEffect, useRef, useState } from 'react'
import '../css/PathFindingVisualiser.css'
const PathFindingVisualiser = () => {
  const Yaxis=500
  const nodeScale=25
  const [amountOfNodes ,setAmountOfNodes]=useState(0)
  const [nodesOnX ,setNodesOnX]=useState(0)
  const [nodesOnY ,setNodesOnY]=useState(0)
  const [algo ,setAlgo]=useState(1)
  const [nodes ,setNodes]=useState([])
  const gridDOM=useRef()
  const newGrid=()=>{
    const XaxisLength=gridDOM.current.clientWidth
    const XNodeAmount=Math.floor(XaxisLength/nodeScale)
    const YNodeAmount=Math.floor(Yaxis/nodeScale)
    setNodesOnX(XNodeAmount)
    setNodesOnY(YNodeAmount)
    console.log(XNodeAmount ,YNodeAmount ,XNodeAmount*YNodeAmount)
    return(XNodeAmount*YNodeAmount)
  }
  const createNodes=()=>{
    const result=[]
    let i=result.length
    while(result.length<amountOfNodes){
      const line=Math.floor(i/nodesOnX)+1
      const up=i<nodesOnX ? null : i-nodesOnX
      const down=i+1>nodesOnX*nodesOnY-nodesOnX ? null : i+nodesOnX
      const right=i+1>=amountOfNodes || line*nodesOnX===i+1 ? null : i+1
      const left=i-1 <0 || line*nodesOnX-nodesOnX-1===i-1? null : i-1
      const location={up:up,right:right,down:down,left:left}
      result.push(
        <div
        key={i}
        className='node'
        style=
        {{
          width:`${nodeScale}px`
        }}
        data-location={JSON.stringify(location)}
        onClick={()=>{
          const neighbours=[]
          Object.entries(location).map((val ,key)=>{
            if(val[1]!==null) neighbours.push(val[1])
          })
          console.log('existing neighbor nodes',neighbours)
          neighbours.map(index=>{
            nodes[index].style.backgroundColor='red'
            setTimeout(()=>{
              nodes[index].style.backgroundColor=''
            },1000)
          })
        }}
        ></div>
      )
      i++
    }
    return [...result]
  }
  useEffect(()=>{
    setAmountOfNodes(newGrid())
  },[])
  useEffect(()=>{
    setNodes(document.querySelectorAll('.node'))
  },[amountOfNodes])
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
        <section
        style={{
          width:amountOfNodes>0 && `${nodesOnX*nodeScale}px`,
          gridTemplateColumns:`repeat(${nodesOnX} ,${nodeScale}px)`
        }}
        id='pathFindingSection'
        ref={gridDOM}
        >
          {createNodes()}
        </section>
    </main>
  )
}

export default PathFindingVisualiser