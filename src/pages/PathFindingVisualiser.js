import { useEffect, useMemo, useRef, useState } from 'react'
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
  const [dragedDestination,setDragedDestination]=useState({
    movingNode:null,
    newIndex:null
  })
  const [destinationsPositions ,setDestinationsPositions]=useState({
    start:null,
    end:null
  })
  const [algo ,setAlgo]=useState(1)
  const [nodesJSX ,setNodesJSX]=useState([])
  const [gridValues ,setGridValues]=useState({
    total:null,
    x:null,
    y:null
  })
  const gridDOM=useRef()
  const dijkstras=()=>{
    const nodesDOM=document.querySelectorAll('.node')
    const unvisitedNodes=[destinationsPositions.start]
    const visitedNodes=[]
    let endNode=null
    const factor=10
    let j=0
    for(let i=0;i<unvisitedNodes.length && !endNode;i++){
      const currentNodeIndex=unvisitedNodes[i]
      const currentNodeDOM=nodesDOM[currentNodeIndex]
      // if wall node or already visited do nothing
      if(!visitedNodes.includes(currentNodeIndex)){
        // if the current node is end node finish the loop
        if([...currentNodeDOM.classList].includes('end')){
          endNode=currentNodeDOM
        }else{
        // save it as a visited node
        visitedNodes.push(currentNodeIndex)
        if([...currentNodeDOM.classList].length<2){
          setTimeout(()=>{
            currentNodeDOM.classList.add('visited')
          },j+=factor)
        }
        //push the current nodes's valid neighbors to the unvisited array
        const neighborNodes=JSON.parse(currentNodeDOM.dataset.location)
        Object.values(neighborNodes).map(index=>{
          // if null return
          if(index===null) return
          const neighborDOM=nodesDOM[index]
          // if wall return
          if([...neighborDOM.classList].includes('wall')) return
          // if visited return
          if(visitedNodes.includes(index)) return
          unvisitedNodes.push(index)
        })
      }
    }
  }
  console.log(endNode)
}
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
      setTimeout(() => {
        nodesDOM[index].classList.remove('wall')
      }, 0)
    } else {
      setTimeout(() => {
        nodesDOM[index].classList.add('wall')
      }, 0)
    }
  }
  const handleDestinationsMove=(currNodeIndex ,DnodeDragged)=>{
    const nodesDOM=document.querySelectorAll('.node')
    const currentNodeDOM=nodesDOM[currNodeIndex]
    if([...currentNodeDOM.classList].length<2){
      if(DnodeDragged==='start'){
        const prevNodeDOM=nodesDOM[dragedDestination.movingNode]
        setDestinationsPositions(prev=>{
          return {
            ...prev,
            start:currNodeIndex
          }
        })
        setDragedDestination(prev=>{
          return {
            ...prev,
            movingNode:currNodeIndex
          }
        })
        prevNodeDOM.classList.remove('start')
        currentNodeDOM.classList.add('start')
      }else{
        const prevNodeDOM=nodesDOM[dragedDestination.movingNode]
        setDestinationsPositions(prev=>{
          return {
            ...prev,
            end:currNodeIndex
          }
        })
        setDragedDestination(prev=>{
          return {
            ...prev,
            movingNode:currNodeIndex
          }
        })
        prevNodeDOM.classList.remove('end')
        currentNodeDOM.classList.add('end')
  
      }
    }
  }
  const handleMouseEvent=()=>{
    const nodesDOM=document.querySelectorAll('.node')
    const movingNode=nodesDOM[dragedDestination.movingNode]
    const targetNode=dragedDestination.newIndex
    if(targetNode===null || !movingNode) return
    const movingNodeClasses=movingNode.classList
    const DnodeDragged=[...movingNodeClasses].includes('start') ? 'start' : [...movingNodeClasses].includes('end') ? 'end' : ''
    if(DnodeDragged.length){
      // move destination node
      handleDestinationsMove(targetNode ,DnodeDragged)
    }else{
      // create wall
      handleWallCreation(targetNode)
    }
  }
  useEffect(()=>{
    handleMouseEvent()
  },[dragedDestination])
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
      if(destinationsPositions.start===null){
        setDestinationsPositions({
          start:startNode,
          end:endNode
        })
      }else{
        startNode=destinationsPositions.start
        endNode=destinationsPositions.end  
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
            onClick={()=>{
              setDragedDestination(prev=>{
                return {
                  ...prev,
                  newIndex:i
                }
              })
            }}
            onMouseOver={(e)=>{
              if(e.buttons<1) return
                setDragedDestination(prev=>{
                  return {
                    ...prev,
                    newIndex:i
                  }
                })
          }}
          onMouseDown={(e)=>{
              e.preventDefault()
              setDragedDestination({
                movingNode:i,
                newIndex:i
              })
          }}
          onMouseUp={()=>{
              setDragedDestination({
                movingNode:null,
                newIndex:null
              })
            
          }}
        >
        </div>
        )
    }
    setNodesJSX(result)
  }
  const clearGrid=()=>{
    const nodesDOM=document.querySelectorAll('.node')
    nodesDOM.forEach(node=>{
      const classes=node.classList
      if([...classes].length>1 && ![...classes].includes('start') && ![...classes].includes('end')){
        node.classList.remove('wall')
        node.classList.remove('visited')
      }
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
              >clear board</button>
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
              <button onClick={dijkstras}>Find path !</button>
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
          {nodesJSX.length ? nodesJSX.map(node=>{
            return node
          }) : ''}
        </section>
    </main>
  )
}

export default PathFindingVisualiser