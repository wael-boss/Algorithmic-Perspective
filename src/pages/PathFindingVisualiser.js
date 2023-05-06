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
  const [notFound ,setNotFound]=useState(false)
  const [gridValues ,setGridValues]=useState({total:null,x:null,y:null})
  const [runProperties ,setRunProperties]=useState({
    time:{s:null ,e:null},
    visits:null,
    paths:null,
  })
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
  const randomMaze=()=>{
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
  const randomNum=(val)=>{
    const num=Math.floor(Math.random()*val)
    return num
  }
  const recursiveDivision=()=>{
    const nodesDOM=document.querySelectorAll('.node')
    const nodesOnX=gridValues.x
    const nodesOnY=gridValues.y
    let x=[Math.floor(Math.random()*nodesOnX)]
    let y=[(Math.floor(Math.random()*nodesOnY))*nodesOnX]
    let xEnd=false
    let yEnd=false
    let intersection=null
    while(xEnd===false){
      if(![...nodesDOM[x[x.length-1]].classList].includes('start') && ![...nodesDOM[x[x.length-1]].classList].includes('end')){
        nodesDOM[x[x.length-1]].classList='node wall'
      }
      const location=JSON.parse(nodesDOM[x[x.length-1]].dataset.location)
      if(location.down===null){
        xEnd=true
      }else{
        x.push(x[x.length-1]+nodesOnX)
      }
    }
    while(yEnd===false){
      if([...nodesDOM[y[y.length-1]].classList].includes('wall')){
        intersection=y[y.length-1]
      }
      if(![...nodesDOM[y[y.length-1]].classList].includes('start') && ![...nodesDOM[y[y.length-1]].classList].includes('end')){
        nodesDOM[y[y.length-1]].classList='node wall'
      }
      const location=JSON.parse(nodesDOM[y[y.length-1]].dataset.location)
      if(location.right===null){
        yEnd=true
      }else{
        y.push(y[y.length-1]+1)
      }
    }
    const walls=[]
    if(y.slice(0 ,y.indexOf(intersection)).length>0) walls.push(y.slice(0 ,y.indexOf(intersection)))
    if(y.slice(y.indexOf(intersection)+1 ,y.length).length>0) walls.push(y.slice(y.indexOf(intersection)+1 ,y.length))
    if(x.slice(0 ,x.indexOf(intersection)).length>0) walls.push(x.slice(0 ,x.indexOf(intersection)))
    if(x.slice(x.indexOf(intersection)+1 ,x.length).length>0) walls.push(x.slice(x.indexOf(intersection)+1 ,x.length))
    if(walls.length>3) walls.splice(Math.floor(Math.random()*walls.length) ,1)
    walls.map(wall=>{
      const Rnum=Math.floor(Math.random()*wall.length)
      if(![...nodesDOM[wall[Rnum]].classList].includes('start') && ![...nodesDOM[wall[Rnum]].classList].includes('end')) nodesDOM[wall[Rnum]].classList='node'
    })
  }
  // mazes
  const spiralMaze=()=>{
    const nodesDOM=document.querySelectorAll('.node')
    const spiralDirections=['right','down','left','up']
    const wallNodes=[]
    let currNodeIndex=gridValues.x
    let currNodeLocation=JSON.parse(nodesDOM[currNodeIndex].dataset.location)
    let running=true
    let direction='right'
    while(running===true){
      wallNodes.push(currNodeIndex)
      // check if in 2 moves nothing 
      const neighborInDirectionIndex=currNodeLocation[direction]
      const neighborInDirectionDOM=nodesDOM[neighborInDirectionIndex]
      let nextNextIndex=JSON.parse(neighborInDirectionDOM.dataset.location)[direction]
      if(nextNextIndex===null || wallNodes.includes(nextNextIndex)){
        // change direction
        const currDirectionIndex=spiralDirections.indexOf(direction)
        if(currDirectionIndex===spiralDirections.length-1){
          direction=spiralDirections[0]
        }else{
          direction=spiralDirections[currDirectionIndex+1]
        }
        nextNextIndex=JSON.parse(nodesDOM[currNodeLocation[direction]].dataset.location)[direction]
        if(nextNextIndex===null || wallNodes.includes(nextNextIndex)){
          running=false
        }
      }else{
      // keep going
      currNodeIndex=neighborInDirectionIndex
      currNodeLocation=JSON.parse(nodesDOM[currNodeIndex].dataset.location)}
    }
    let i=0
    let factor=factorGenerate()
    setTimeout(()=>{
      setIsAnimating(false)
    },factor*wallNodes.length)
    wallNodes.map(index=>{
      setTimeout(()=>{
        if(index!==destinationsPositions.start && index!==destinationsPositions.end) nodesDOM[index].classList='node wall'
      },i+=factor)
    })
  }
  // algos
  const neighborNodes=(index ,nodesDOM ,visitedNodes)=>{
    const currentNodeDOM=nodesDOM[index]
    const location=JSON.parse(currentNodeDOM.dataset.location)
    const validNeighbors=[]
    Object.values(location).map(index=>{
      if(index===null) return
      const neighborDOM=nodesDOM[index]
      if(visitedNodes.includes(index) || [...neighborDOM.classList].includes('wall')) return
      validNeighbors.push(index)
    })
    return validNeighbors
  }
  const distance=(curr ,end)=>{
  // const dx =curr.x-end.x
  // const dy =curr.y-end.y
  // return Math.sqrt(dx*dx + dy*dy)
  let xDistance=end.x-curr.x
  if(xDistance<0){
    xDistance*=-1
  }
  let yDistance=Math.floor(end.y/gridValues.x)-Math.floor(curr.y/gridValues.x)
  if(yDistance<0){
    yDistance*=-1
  }
const hypotenuse=Math.sqrt(xDistance**2+yDistance**2).toFixed(2)
return Number(hypotenuse)
}
const locatorFunc=(nodeIndx)=>{
    const lines=Math.floor(nodeIndx/gridValues.x)
    const xNode=nodeIndx-(lines*gridValues.x)
    const yNode=lines*gridValues.x
    return {
      x:xNode,
      y:yNode
    }
  }
  const estimateCalc=(index)=>{
    const endLocators=locatorFunc(destinationsPositions.end)
    return distance(locatorFunc(index),endLocators)
  }
  const getBestSugg=(suggestions)=>{
    let bestSugg=suggestions[0]
    let index=0
    suggestions.map((val ,i)=>{
      if(val.total<bestSugg.total){
        bestSugg=val
        index=i
      }
    })
    return suggestions.splice(index ,1)[0].index
  }
  const Astar = () => {
    const nodesDOM = document.querySelectorAll('.node')
    const startIndex = destinationsPositions.start
    const animation=[]
    const visitedNodes=[]
    const history={}
    history[startIndex]={
      visitedFrom:undefined,
      path:0,
      estimate:estimateCalc(startIndex),
    }
    const suggestions=[{
      index:startIndex,
      total:history[startIndex].path+history[startIndex].estimate
    }]
    let currNodeIndex=null
    let endNode=null
    while(endNode===null && suggestions.length>0){
      // find the best node on the suggestions
      currNodeIndex=getBestSugg(suggestions)
      const currNodeDOMClasses=nodesDOM[currNodeIndex].classList
      if([...currNodeDOMClasses].includes('end')){
        endNode=currNodeIndex
      }else{
      visitedNodes.push(currNodeIndex)
      if(currNodeIndex!==startIndex) animation.push({index:currNodeIndex,class:'visited'})
      // get the neighbor estimates and push them to the suggestions
      const neighbors=neighborNodes(currNodeIndex ,nodesDOM ,visitedNodes)
      // neighbors are indexes that are not wall ,not null ,not visited
      neighbors.map(neighbor=>{
        if(history[neighbor]===undefined){
          history[neighbor]={
            visitedFrom:currNodeIndex,
            path:history[currNodeIndex].path+1,
            estimate:estimateCalc(neighbor),
          }
        }
        const amount=suggestions.filter(obj=>obj.index===neighbor)
        if(amount.length<1){
        suggestions.push({
          index:neighbor,
          total:history[neighbor].path+history[neighbor].estimate
        })
      }
      })
    }
  }
    if(endNode!==null){
      const temp=[]
      let i=endNode
      while(i!==startIndex){
        i=history[i].visitedFrom
        if(i!==startIndex) temp.unshift({index:i,class:'path'})
      }
      animation.push(...temp)
    }
    return animation
  }
  const dijkstrasLogic=(validNeighbors ,history)=>{
    validNeighbors.map(neighborIndex=>{
      // get the current neighbor history tab
      let curr=history[neighborIndex]
      if(history[curr.lastVisitor].shortestPath<curr.shortestPath){
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
    for(let i=0;i<unvisitedNodes.length && endNode===null;i++){
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
        // const neighborNodes=JSON.parse(currentNodeDOM.dataset.location)
        const validNeighbors=neighborNodes(currentNodeIndex ,nodesDOM ,visitedNodes)
        validNeighbors.map(index=>{
          unvisitedNodes.push(index)
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
    setNotFound(true)
    return animation
  }else{
  setNotFound(false)
  let lastVisitor=history[endNode].lastVisitor
  const tempArr=[]
  while(lastVisitor!==startIndex){
    tempArr.unshift({index:history[lastVisitor].index,class:'path'})
    lastVisitor=history[lastVisitor].lastVisitor
  }
  return [...animation ,...tempArr]
}
  }
  const depthFirstSeacrh=()=>{
  const nodesDOM=document.querySelectorAll('.node')
  const startIndex=destinationsPositions.start
  const unvisitedNodes=[startIndex]
  const stack=[startIndex]
  const visitedNodes=[]
  const animation=[]
  let endIndex=null
  for(let i=0;i<unvisitedNodes.length && endIndex===null && stack.length>0;i++){
    const currentNodeIndex=unvisitedNodes[i]
    const currentNodeDOM=nodesDOM[currentNodeIndex]
    const currentNodeClasses=currentNodeDOM.classList
    if([...currentNodeClasses].includes('end')){
      // end loop
      endIndex=currentNodeIndex
    }else{
      // mark as visited
      visitedNodes.push(currentNodeIndex)
      stack.push(currentNodeIndex)
      if(currentNodeIndex!==startIndex) animation.push({index:currentNodeIndex,class:'visited'})
      // keep searching
      const validNeighbors=neighborNodes(currentNodeIndex ,nodesDOM ,visitedNodes)
      if(validNeighbors.length===0){
        let neighbors=0
        while(neighbors<1 && stack.length>0){
          const i=stack[stack.length-1]
          const response=neighborNodes(i ,nodesDOM ,visitedNodes)
          neighbors=response.length
          if(neighbors>0){
            const num=Math.floor(Math.random()*response.length)
            unvisitedNodes.push(response[0])
          }else{

            stack.pop()
          }
        }
      }else{
        const num=Math.floor(Math.random()*validNeighbors.length)
        unvisitedNodes.push(validNeighbors[0])
      }
    }
  }
  if(endIndex===null){
    setNotFound(true)
  }else{
    setNotFound(false)
    stack.map(index=>{
      if(index!==startIndex) animation.push({index:index,class:'path'})
    })
  }
  return animation
  }
  // end
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
    const startOfRun=Date.now()
    const animations=algo===1 ? dijkstras() : algo===2 ? depthFirstSeacrh() : Astar()
    const endOfRun=Date.now()
    const visits=animations.filter(frame=>frame.class==='visited')
    const paths=animations.filter(frame=>frame.class==='path')
    setRunProperties({
      time:{s:startOfRun ,e:endOfRun},
      visits:visits.length,
      paths:paths.length
    })
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
  const checkForMess=()=>{
    const pathDOM=document.querySelectorAll('.path')
    const visitsDOM=document.querySelectorAll('.visited')
    return pathDOM.length+visitsDOM.length
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
                const state=checkForMess()
                if(!state){
                  clearGrid()
                }else{
                  clearVisits()
                }
              }}
              >Clear board</button>
            </div>
            <div className='pathFindingOption'>
            </div>
            <div className='pathFindingOption' id='speedOption'>
                <p>{animationSpeed===1 ? 'very slow' : animationSpeed===2 ? 'slow' : animationSpeed===3 ? 'mid' :animationSpeed===4 ? 'fast' : 'no'} animating</p>
              <div id='speedRangeContainer'>
                <AiOutlineMinus
                onClick={()=>{if (!isAnimating && animationSpeed>1) setAnimationSpeed(animationSpeed-1)}}
                />
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
                <AiOutlinePlus
                onClick={()=>{if (!isAnimating && animationSpeed<5) setAnimationSpeed(animationSpeed+1)}}
                />
              </div>
            </div>
            <div className='pathFindingOption' id='pathFindingAlgoritms'>
              <p>Algorithm:</p>
              <div>
                <p style={{ borderBottomColor: algo === 1 ? 'var(--colorScale2)' : '' }} onClick={() => setAlgo(1)}>Dijkstra's</p>
                <p style={{ borderBottomColor: algo === 2 ? 'var(--colorScale2)' : '' }} onClick={() => setAlgo(2)}>Depth-first</p>
                <p style={{ borderBottomColor: algo === 3 ? 'var(--colorScale2)' : '' }} onClick={() => setAlgo(3)}>A star</p>
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
                      onClick={randomMaze}>random</p>
                      <p
                      style={{
                        background: isAnimating && '#a00000'
                      }}
                      onClick={()=>{
                        clearGrid()
                        recursiveDivision()
                      }}
                      >Recursive division</p>
                      <p
                      style={{
                        background: isAnimating && '#a00000'
                      }}
                      onClick={()=>{
                        setIsAnimating(true)
                        clearGrid()
                        spiralMaze()
                      }}
                      >spiral</p>
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
          <div>
            {runProperties.visits===null ? <p>no visits yet.</p> : <p>visited <span style={{color:'#ff8400'}}>{runProperties.visits}</span> nodes.</p>}
            {runProperties.paths===null ? <p>no no paths yet.</p> : <p><span style={{color:'#ffdd00'}}>{runProperties.paths}</span> path nodes.</p>}
          </div>
          <div>
            <p>{animateOnDmove ? <span style={{color:'#0f0'}}>Instantly</span> : <span style={{color:'#f00'}}>Don't</span>} path find on (start/end) node deplacement.</p>
            {
            algo===1 ? <p>Dijkstra's algorithm <strong style={{color:'#0f0'}}>guarantees</strong> shortest path.</p> :
            algo===2 ? <p>Depth-first search algorithm <strong style={{color:'#f00'}}>does not guarantee</strong> shortest path.</p> :
            <p>A star algorithm <strong style={{color:'#0f0'}}>guarantees</strong> shortest path.</p>}
          </div>
          <div>
            {runProperties.time.e!==null ? <p>run time: <span style={{color:'var(--colorScale5)'}}>{runProperties.time.e-runProperties.time.s}</span> ms.</p> : <p>no timer yet.</p>}
            {notFound && <strong style={{color:'#f00'}}>end is not in reach.</strong>}
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