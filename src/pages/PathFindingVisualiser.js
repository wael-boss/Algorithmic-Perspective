import { useEffect, useRef, useState } from 'react'
import '../css/PathFindingVisualiser.css'
import {AiOutlinePlus ,AiOutlineMinus} from 'react-icons/ai'
const PathFindingVisualiser = () => {
  const Yaxis=500
  const nodeScale=20
  const [isAnimating ,setIsAnimating]=useState(false)
  const [dragedDestination,setDragedDestination]=useState({movingNode:null,newIndex:null})
  const [destinationsPositions ,setDestinationsPositions]=useState({start:null,end:null})
  const [algo ,setAlgo]=useState(1)
  const [nodesJSX ,setNodesJSX]=useState([])
  const [animateOnDmove ,setAnimateOnDmove]=useState(false)
  const [animationSpeed ,setAnimationSpeed]=useState(4)
  const [gridValues ,setGridValues]=useState({total:null,x:null,y:null})
  const gridDOM=useRef()
  const pathFind=useRef()
  const factorGenerate=()=>{
    let factor=0
    switch(animationSpeed){
      case 1: factor=100
      break
      case 2: factor=50
      break
      case 3: factor=25
      break
      case 4: factor=10
      break
      case 5: factor=0
      break
    }
    return factor
  }
  const maze=()=>{
    setIsAnimating(true)
    const nodesDOM=document.querySelectorAll('.node')
    const factor=factorGenerate()
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
  const dijkstrasLogic=(validNeighbors ,history)=>{
    validNeighbors.map(neighborIndex=>{
      // get the current neighbor history tab
      let curr=history[neighborIndex]
      if(history[curr.lastVisitor].shortestPath<curr.lastVisitor){
        history[neighborIndex]={
          ...history[neighborIndex],
          shortestPath:history[curr.lastVisitor].shortestPath+1,
          lastVisitor:history[curr.lastVisitor].index
        }
      }
    })
  }
  const dijkstras=()=>{
    const nodesDOM=document.querySelectorAll('.node')
    const history={}
    const animation=[]
    const startIndex=destinationsPositions.start
    history[startIndex]={
      index:startIndex,
      shortestPath:0,
      lastVisitor:null,
    }
    const unvisitedNodes=[startIndex]
    const visitedNodes=[]
    let endNode=null
    for(let i=0;i<unvisitedNodes.length && !endNode;i++){
      const currentNodeIndex=unvisitedNodes[i]
      const currentNodeDOM=nodesDOM[currentNodeIndex]
      // if wall node or already visited do nothing
      if(!visitedNodes.includes(currentNodeIndex)){
        // if the current node is end node finish the loop
        if([...currentNodeDOM.classList].includes('end')){
          endNode=currentNodeIndex
        }else{
        // save it as a visited node
        visitedNodes.push(currentNodeIndex)
        if([...currentNodeDOM.classList].length<2){
            animation.push({index:currentNodeIndex,class:'visited'})
        }
        //push the current nodes's valid neighbors to the unvisited array
        const neighborNodes=JSON.parse(currentNodeDOM.dataset.location)
        const validNeighbors=[]
        Object.values(neighborNodes).map(index=>{
          // if null return
          if(index===null) return
          const neighborDOM=nodesDOM[index]
          // if wall return
          // if visited return
          if(visitedNodes.includes(index) || [...neighborDOM.classList].includes('wall')) return
          unvisitedNodes.push(index)
          validNeighbors.push(index)
          history[index]={
            index:index,
            shortestPath:999999,
            lastVisitor:currentNodeIndex,
          }
        })
        dijkstrasLogic(validNeighbors ,history)
      }
    }
  }
  if(endNode===null){
    console.log('not possible')
    return animation
  }else{
  let lastVisitor=history[endNode].lastVisitor
  const tempArr=[]
  while(lastVisitor!==startIndex){
    tempArr.unshift({index:history[lastVisitor].index,class:'path'})
    lastVisitor=history[lastVisitor].lastVisitor
  }
  return [...animation ,...tempArr]
}
  }
const Astar=()=>{

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
    if(![...currentNodeDOM.classList].includes('wall') && ![...currentNodeDOM.classList].includes('start') && ![...currentNodeDOM.classList].includes('end')){
      if(DnodeDragged==='start'){
        if(currNodeIndex===destinationsPositions.start) return
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
        currentNodeDOM.classList=('node start')
      }else{
        if(currNodeIndex===destinationsPositions.end) return
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
        currentNodeDOM.classList=('node end')
  
      }
    }
  }
  const handleMouseEvent=()=>{
    const nodesDOM=document.querySelectorAll('.node')
    const movingNode=nodesDOM[dragedDestination.movingNode]
    const targetNode=dragedDestination.newIndex
    if(targetNode===null || !movingNode || isAnimating) return
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
        node.classList.remove('path')
      }
    })
  }
  const clearVisits=()=>{
    const nodesDOM=document.querySelectorAll('.node')
    nodesDOM.forEach(node=>{
      if([...node.classList].includes('visited')) node.classList.remove('visited')
      if([...node.classList].includes('path')) node.classList.remove('path')
    })
  }
  useEffect(()=>{
    createGrid()
  },[])
  useEffect(()=>{
    if(gridValues.total!==null) createNodes()
  },[gridValues])
  useEffect(()=>{
    if(animateOnDmove){
      animationFunc(false)
    }
  },[destinationsPositions])
  const animationFunc=(normal=true)=>{
    const nodesDOM=document.querySelectorAll('.node')
    setIsAnimating(true)
    clearVisits()
    const animations=algo===1 ? dijkstras() : Astar()
    let factor=factorGenerate()
    if(!normal) factor=0
    if(factor===0){
      animations.map(frame=>{
          nodesDOM[frame.index].classList.add(frame.class)
      })
      setIsAnimating(false)
    }else{
    let i=0
    animations.map(frame=>{
      setTimeout(()=>{
        nodesDOM[frame.index].classList.add(frame.class)
      },i+=factor)
    })
    setTimeout(()=>{
      setIsAnimating(false)
    },i)
  }
  }
  return (
    <main>
        <section className="optionsSection" id='pathFindingOptions'>
            <div className='pathFindingOption' id='resetDefault'>
              <button
              style={{
                background: isAnimating && '#a00000'
              }}
              onClick={()=>{
                if(isAnimating) return
                clearGrid()
              }}
              >Clear board</button>
            </div>
            <div className='pathFindingOption'>
            </div>
            <div className='pathFindingOption' id='speedOption'>
                <p>{animationSpeed===1 ? 'very slow' : animationSpeed===2 ? 'slow' : animationSpeed===3 ? 'mid' :animationSpeed===4 ? 'fast' : 'no'} animating</p>
              <div id='speedRangeContainer'>
                <AiOutlineMinus/>
                <input
                type='range'
                id='widthRange'
                min='1'
                max='5'
                value={animationSpeed}
                style={{
                  background: isAnimating && '#a00000'
                }}
                onChange={(e)=>{
                  if(isAnimating) return
                  setAnimationSpeed(Number(e.target.value))
                }}
                />
                <AiOutlinePlus/>
              </div>
            </div>
            <div className='pathFindingOption' id='pathFindingAlgoritms'>
              <p>Algorithm:</p>
              <div>
                <p style={{ borderBottomColor: algo === 1 ? 'var(--colorScale2)' : '' }} onClick={() => setAlgo(1)}>Dijkstra's</p>
                <p style={{ borderBottomColor: algo === 2 ? 'var(--colorScale2)' : '' }} onClick={() => setAlgo(2)}>A star</p>
              </div>
            </div>
                <div className='pathFindingOption'>
                  <button id='mazeSelection'>
                    <label>Mazes</label>
                    <div id='mazeOptions' onClick={()=>{
                      pathFind.current.focus()
                    }}>
                      <p
                      style={{
                        background: isAnimating && '#a00000'
                      }}
                      onClick={maze}>random</p>
                      <p
                      style={{
                        background: isAnimating && '#a00000'
                      }}
                      >film maze</p>
                    </div>
                  </button>
                </div>
            <div className='pathFindingOption' id='pathFindButtons'>
              <button
              id='findPath'
              ref={pathFind}
              style={{
                background: isAnimating && '#a00000'
              }}
              onClick={()=>{
                if(isAnimating) return
                animationFunc()
              }}>Find path !</button>
              <button
              id='onDeplaceBtn'
              style={{
                background: isAnimating ? '#a00000' : animateOnDmove ? '#00ff00' : '#ff0000',
              }}
              onClick={()=>{
                if(isAnimating) return
                setAnimateOnDmove(!animateOnDmove)
              }}
              ></button>
            </div>
        </section>
        <section id='infoSection'>
          
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