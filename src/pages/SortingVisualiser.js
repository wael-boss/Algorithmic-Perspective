import { useEffect, useMemo, useRef } from 'react'
import { useState } from 'react'
import '../css/SortingVisualiser.css'
const SortingVisualiser = () => {
    // sorting algos
    // merge sort
    const merge=(firstHalf ,secondHalf)=>{
        const result=[]
        while(firstHalf.length && secondHalf.length){
            if(firstHalf[0]<secondHalf[0]){
                result.push(firstHalf.shift())
            }else{
                result.push(secondHalf.shift())
            }
        }
        return [...result ,...firstHalf ,...secondHalf]
    }
    const mergeSort=(array)=>{
        if(array.length<2) return array
        const midPoint=Math.floor(array.length/2)
        const firstHalf=array.splice(0 ,midPoint)
        return merge(mergeSort(firstHalf) ,mergeSort(array))
    }
    // bubble sort
    const bubbleSort=(array)=>{
    if(array.length<2) return array
    let result=array
    for(let i=0;i<result.length;i++){
        for(let j=0;j<result.length-i;j++){
            if(result[j]>result[j+1]){
                const big=result[j]
                result[j]=result[j+1]
                result[j+1]=big
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
    const [width ,setWidth]=useState(4)
    const [mainArray ,setMainArray]=useState([])
    const [max ,setMax]=useState(100)
    const [algo ,setAlgo]=useState(1)
    const graphRef=useRef()
    const maxNumber=400 //400 for best proformence
    const minNumber=4   //4 for best proformence
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
        setMax(Math.floor((graphRef.current.clientWidth-60) / 4))
    },[])
  return (
    <main>
        <section id="sortingOptionsBar">
            <div className="sortingOption" id="generateArrayOption">
                <button onClick={()=>setMainArray(newArray())}>Generate New Array</button>
            </div>
            <div className="sortingOption" id="silderOption">
                <p>alter array size and sorting speed</p>
                <input 
                type='range'
                min='4'
                max={max}
                value={width}
                onChange={e=>setWidth(e.target.value)}
                />
            </div>
            <div className="sortingOption" id="alogorithmOption">
                <p style={{borderBottomColor:algo===1? 'var(--colorScale2)' : ''}} onClick={()=>setAlgo(1)}>merge</p>
                <p style={{borderBottomColor:algo===2? 'var(--colorScale2)' : ''}} onClick={()=>setAlgo(2)}>Quick</p>
                <p style={{borderBottomColor:algo===3? 'var(--colorScale2)' : ''}} onClick={()=>setAlgo(3)}>Heap</p>
                <p style={{borderBottomColor:algo===4? 'var(--colorScale2)' : ''}} onClick={()=>setAlgo(4)}>Bubble</p>
            </div>
            <div className="sortingOption" id="sortOption">
                <button onClick={
                ()=>setMainArray(
                    algo===1 ? mergeSort(mainArray) : 
                    algo===2 ? quickSort(mainArray):
                    algo===3 ? {/*heap */}:
                    bubbleSort(mainArray)
                )
                }>sort !</button>
            </div>
        </section>
        <section id="sortingSection" ref={graphRef}>
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