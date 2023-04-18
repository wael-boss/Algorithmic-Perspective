import { useEffect, useMemo, useRef } from 'react'
import { useState } from 'react'
import '../css/SortingVisualiser.css'
import { type } from '@testing-library/user-event/dist/type'
const SortingVisualiser = () => {
    const [bars ,setBars]=useState([])
    // sorting algos
    // merge sort
    const merge=(array ,animations ,firstParams ,secondParams)=>{
        // indicators to check the left and right sides of the array comparing them in the procces
        let leftIndicator=0
        let rightIndicator=firstParams.e-firstParams.s
        // the point in the array where correct position values would go
        let arrayPosition=firstParams.s
        // a temporary array to hold the current section and avoid duplicate values in the final array
        let tempArr=array.slice(firstParams.s ,secondParams.e)
        // a loop that runs until one of the indicators reached the end of its array
        while(leftIndicator+firstParams.s<firstParams.e && rightIndicator+firstParams.s<secondParams.e){
            // add a frame of comparison to the animations
            animations.push({type:'compare',A:leftIndicator+firstParams.s,B:rightIndicator+firstParams.s})
            // look for the smaller value between the left and right side and sort it 
            if(tempArr[leftIndicator]<tempArr[rightIndicator]){
                // save a frame of change to the animation
                animations.push({type:'change',index:arrayPosition,value:tempArr[leftIndicator]})
                array[arrayPosition]=tempArr[leftIndicator]
                leftIndicator++
            }else{
                // save a frame of change to the animation
                animations.push({type:'change',index:arrayPosition,value:tempArr[rightIndicator]})
                array[arrayPosition]=tempArr[rightIndicator]
                rightIndicator++
            }
            // increment the position for the next value
            arrayPosition++
        }
        // pick up leftover values and add them to the already sorted array
        while(leftIndicator+firstParams.s<firstParams.e){
            animations.push({type:'change',index:arrayPosition,value:tempArr[leftIndicator]})
            array[arrayPosition]=tempArr[leftIndicator]
            leftIndicator++
            arrayPosition++
        }
        while(rightIndicator+firstParams.s<secondParams.e){
            animations.push({type:'change',index:arrayPosition,value:tempArr[rightIndicator]})
            array[arrayPosition]=tempArr[rightIndicator]
            rightIndicator++
            arrayPosition++
        }
        // look for the actual end of the function to return the animations array
        if(tempArr.length===array.length){
            return animations
        }else{
            return {s:firstParams.s,e:secondParams.e}
        }
}
    const mergeSort=(array, animations=[] ,s=0 ,e=array.length)=>{
        const currentArray=array.slice(s ,e)
        // break point to avoid infinite recursion
        if(currentArray.length<2) return {s:s,e:e}
        // middle index of the array
        const midPoint=Math.floor(currentArray.length/2)
        // create a recursion to cut down the array as small as possible then re-assemble it using the merge function
        return merge(array ,animations ,mergeSort(array ,animations ,s ,s+midPoint),mergeSort(array ,animations ,s+midPoint ,e)) 
    }
    // bubble sort
    const bubbleSort=(array)=>{
    if(array.length<2) return array
    let result=array
    for(let i=0;i<result.length;i++){
        for(let j=0;j<result.length-i;j++){
            if(result[j]>result[j+1]){
                [result[j] ,result[j+1]]=[result[j+1],result[j]]
            }
        }
    }
    return result
    }
    // quick sort
    function quickSort(array) {
        if(array.length<2) return array
        const pivot=array[0]
        const unsortedLeftSide=[]
        const unsortedRightSide=[]
        for(let i=1 ;i<array.length ;i++){
            if(array[i]<pivot){
                unsortedLeftSide.push(array[i])
            }else{
                unsortedRightSide.push(array[i])
            }
        }
        const sortedLeftSide=quickSort(unsortedLeftSide)
        const sortedRightSide=quickSort(unsortedRightSide)
        return [...sortedLeftSide ,pivot ,...sortedRightSide]
    } 
    // end
    const [algoTimer ,setAlgoTimer]=useState({
        start:null,
        end:null
    })
    const [width ,setWidth]=useState(4)
    const [mainArray ,setMainArray]=useState([])
    const [max ,setMax]=useState(100)
    const [algo ,setAlgo]=useState(1)
    const [isAnimating ,setIsAnimating]=useState(false)
    const graphRef=useRef()
    const maxNumber=400 //400 for best proformence
    const minNumber=4   //4 for best proformence
    const animationFunc=(arr)=>{
        // the number of mileseconds in between every frame
        let factor=width<10 ? 500 : width<20 ? 100 : width<50 ? 50 : 10
        // history of the last time out to create a consitent flow 
        let i=factor
        // get animatins from the chosen algorithm
        const animations=algo===1 ? mergeSort(arr) : algo===2 ? quickSort(arr) : algo===3 ? {/*heap */}: bubbleSort(arr)
        setTimeout(()=>{
            setIsAnimating(false)
        },animations.length*factor)
        // loop through the frames and set timeouts accodingly
        animations.map(frame=>{
            // a frame comparing two values and changing their color to red
            if(frame.type==='compare'){
                setTimeout(()=>{
                    bars[frame.A].style.backgroundColor='red'
                    bars[frame.B].style.backgroundColor='red'
                    setTimeout(()=>{
                        bars[frame.A].style.backgroundColor=''
                        bars[frame.B].style.backgroundColor=''
                    },factor)
                },i)
            // a frame swaping two values
            }else if(frame.type==='swap'){
            // a frame changing the height of a value
            }else if(frame.type==='change'){
                setTimeout(()=>{
                    bars[frame.index].title=frame.value
                    bars[frame.index].style.height=`${frame.value}px`
                    bars[frame.index].style.backgroundColor=`green`
                    setTimeout(()=>{
                        bars[frame.index].style.backgroundColor=`var(--colorScale3)`
                    },factor)
                },i)
            }
            i+=factor
        })
    }
    const newArray=()=>{
        const arr=[]
        for(let i=0;i<width;i++){
            arr.push(Math.floor(Math.random() * (maxNumber - minNumber + 1) + minNumber))
        }
        return arr
    }
    useEffect(()=>{
        setMainArray(newArray())
    },[width])
    useEffect(()=>{
        setBars(document.querySelectorAll('.bar'))
        if(algoTimer.end===null && algoTimer.start!==null){
            setAlgoTimer({...algoTimer, end:Date.now()})
        }
    },[mainArray])
    useEffect(()=>{
        setMax(Math.floor((graphRef.current.clientWidth-60) / 4))
    },[])
  return (
    <main>
        <section id="sortingOptionsBar">
            <div className="sortingOption" id="generateArrayOption">
                <button
                style={{backgroundColor:isAnimating ? 'var(--colorScale5)' : ''}}
                onClick={()=>{
                    if(isAnimating) return
                    setMainArray(newArray())
                    }}>Generate New Array</button>
            </div>
            <div className="sortingOption" id="silderOption">
                <p>alter array size and sorting speed</p>
                <input 
                style={{background:isAnimating ? 'var(--colorScale5)' : ''}}
                id='widthRange'
                type='range'
                min={minNumber}
                max={max}
                value={width}
                onChange={e=>{
                    if(isAnimating) return
                    setWidth(Number(e.target.value))
                }}
                />
            </div>
            <div className="sortingOption" id="alogorithmOption">
                <p style={{borderBottomColor:algo===1? 'var(--colorScale2)' : ''}} onClick={()=>setAlgo(1)}>merge</p>
                <p style={{borderBottomColor:algo===2? 'var(--colorScale2)' : ''}} onClick={()=>setAlgo(2)}>Quick</p>
                <p style={{borderBottomColor:algo===3? 'var(--colorScale2)' : ''}} onClick={()=>setAlgo(3)}>Heap</p>
                <p style={{borderBottomColor:algo===4? 'var(--colorScale2)' : ''}} onClick={()=>setAlgo(4)}>Bubble</p>
            </div>
            <div className="sortingOption" id="sortOption">
                <button
                style={{backgroundColor:isAnimating ? 'var(--colorScale5)' : ''}}
                onClick={()=>{
                    if(isAnimating) return
                    // setIsAnimating(true) sorts it before the animation
                    animationFunc(mainArray)
                    }}>sort !</button>
            </div>
        </section>
        <section id="sortingSection" ref={graphRef}>
            {algoTimer.end && <p id='algoTimer'>time to sort: {algoTimer.end-algoTimer.start>=1 ? algoTimer.end-algoTimer.start : 'less then 1'}ms</p>}
            <p onClick={()=>{setWidth(prev=>{return prev+1})}} id='numOfBars'>{width===1 ? `${width} bar` : `${width} bars`}</p>
            {mainArray.length ? mainArray.map((value ,indx)=>{
                return(
                    <div className='bar' key={indx} title={value} style={{height:`${value}px`}}></div>
                )
            }) : <p>error</p>}
        </section>
    </main>
  )
}

export default SortingVisualiser