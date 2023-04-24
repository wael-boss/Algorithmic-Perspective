import { useEffect, useRef, useState } from 'react'
import '../css/PathFindingVisualiser.css'
const PathFindingVisualiser = () => {
  const maze=()=>{
    setIsAnimating(true)
    const nodesDOM=document.querySelectorAll('.node')
    const factor=10
    let j=10
    for(let i=0;i<nodesDOM.length;i++){
      const node=nodesDOM[i]
      const num=Math.floor(Math.random()*10)
      const nodeClasses=node.classList
      if(num<3 && ![...nodeClasses].includes('wall') && ![...nodeClasses].includes('start') && ![...nodeClasses].includes('end')){
        setTimeout(()=>{node.classList.add('wall')},j)
        j+=factor
      }
    }
    setTimeout(()=>{
      setIsAnimating(false)
    },j)
  }
  const Yaxis=500
  const nodeScale=20
  const [isAnimating ,setIsAnimating]=useState(false)
  const [algo ,setAlgo]=useState(1)
  const [nodesJSX ,setNodesJSX]=useState([])
  const [gridValues ,setGridValues]=useState({
    total:null,
    x:null,
    y:null
  })
  const gridDOM=useRef()
  const createGrid=()=>{
    const XaxisLength=gridDOM.current.clientWidth
    const XNodeAmount=Math.floor(XaxisLength/nodeScale)
    const YNodeAmount=Math.floor(Yaxis/nodeScale)
    setGridValues({
      total:XNodeAmount*YNodeAmount,
      x:XNodeAmount,
      y:YNodeAmount
    })
  }
  const handleWallCreation=(index)=>{
    const nodesDOM=document.querySelectorAll('.node')
    if(!nodesDOM.length) return
    const classes=nodesDOM[index].classList
    if([...classes].includes('start') || [...classes].includes('end')) return
    if([...classes].includes('wall')){
      nodesDOM[index].classList.remove('wall')
    }else{
    nodesDOM[index].classList.add('wall')
  }
  }
  const createNodes=()=>{
      const result=[]
      let startNode=Math.floor(Math.random()*gridValues.total)
      let endNode=Math.floor(Math.random()*gridValues.total)
      if(startNode===endNode && startNode===gridValues.total-1){
        endNode=0
      }
      if(startNode===endNode && startNode===0){
        endNode=gridValues.total-1
      }
      for(let i=0;i<gridValues.total;i++){
        const line=Math.floor(i/gridValues.x)+1
        const up=i<gridValues.x ? null : i-gridValues.x
        const down=i+1>gridValues.x*gridValues.y-gridValues.x ? null : i+gridValues.x
        const right=i+1>=gridValues.total || line*gridValues.x===i+1 ? null : i+1
        const left=i-1 <0 || line*gridValues.x-gridValues.x-1===i-1? null : i-1
        const location={up:up,right:right,down:down,left:left}
        result.push(
        <div
          key={i}
          className={`node ${i===startNode ? 'start' : ''} ${i===endNode ? 'end' : ''} `}
          style=
          {{
            width:`${nodeScale}px`
          }}
          data-location={JSON.stringify(location)}
          onClick={()=>{handleWallCreation(i)}}
          onMouseOver={(e)=>{
            if (e.buttons<1) return
            handleWallCreation(i)
          }}
        ></div>
        )
    }
    setNodesJSX(result)
  }
  const clearGrid=()=>{
    const nodesDOM=document.querySelectorAll('.node')
    nodesDOM.forEach(node=>{
      const classes=node.classList
      if([...classes].length>1 && ![...classes].includes('wall')) return
      node.classList.remove('wall')
    })
  }
  useEffect(()=>{
    createGrid()
  },[])
  useEffect(()=>{
    if(gridValues.total!==null) createNodes()
  },[gridValues])
  return (
    <main>
        <section className="optionsSection" id='pathFindingOptions'>
            <div className='pathFindingOption' id='resetDefault'>
              <button
              style={{
                background: isAnimating && '#a00000'
              }}
              onClick={clearGrid}
              >Reset</button>
            </div>
            <div className='pathFindingOption'>
              <p onClick={maze}>Maze</p>
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
        id='pathFindingSection'
        ref={gridDOM}
        style={{
          width:gridValues.x!==null ? `${gridValues.x*nodeScale}px` : ``,
          height:`${Yaxis}px`,
          gridTemplateColumns:gridValues.x!==null ? `repeat(${gridValues.x},${nodeScale}px)` : ``
        }}
        >
          {nodesJSX.length ? nodesJSX : 'error'}
        </section>
    </main>
  )
}

export default PathFindingVisualiser