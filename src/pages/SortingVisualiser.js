import { useEffect, useMemo, useRef } from 'react'
import { useState } from 'react'
import '../css/SortingVisualiser.css'
const SortingVisualiser = () => {
    const animations=[]
    const [bars ,setBars]=useState([])
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
    // 


















    const testMerge=(array ,firstParams ,secondParams)=>{
        let leftIndicator=0
        let rightIndicator=firstParams.e-firstParams.s
        let arrayPosition=firstParams.s
        let tempArr=array.slice(firstParams.s ,secondParams.e)
        while(leftIndicator+firstParams.s<firstParams.e && rightIndicator+firstParams.s<secondParams.e){
            console.log(leftIndicator ,rightIndicator)
            console.log(`comparing ${tempArr[leftIndicator]} and ${tempArr[rightIndicator]}`)
            if(tempArr[leftIndicator]<tempArr[rightIndicator]){
                console.log(`was ${array[arrayPosition]} became ${tempArr[leftIndicator]}`)
                array[arrayPosition]=tempArr[leftIndicator]
                leftIndicator++
            }else{
                console.log(`was ${array[arrayPosition]} became ${tempArr[rightIndicator]}`)
                array[arrayPosition]=tempArr[rightIndicator]
                rightIndicator++
            }
            arrayPosition++
        }
        while(leftIndicator+firstParams.s<firstParams.e){
            array[arrayPosition]=tempArr[leftIndicator]
            leftIndicator++
            arrayPosition++
        }
        while(rightIndicator+firstParams.s<secondParams.e){
            array[arrayPosition]=tempArr[rightIndicator]
            rightIndicator++
            arrayPosition++
        }
        console.log(array)
        return {s:firstParams.s,e:secondParams.e}
}
    const testMergeSort=(array ,s=0 ,e=array.length)=>{
        const currentArray=array.slice(s ,e)
        // console.log(currentArray)
        if(currentArray.length<2) return {s:s,e:e}
        const midPoint=Math.floor(currentArray.length/2)
        return testMerge(array ,testMergeSort(array ,s ,s+midPoint),testMergeSort(array ,s+midPoint ,e))
    }










    const animationFunc=()=>{
        let factor=100
        let i=100
        animations.map(frame=>{
            if(frame.type==='compare'){
                setTimeout(()=>{
                    bars[frame.A].classList.add('compared')
                    bars[frame.B].classList.add('compared')
                },i)
                setTimeout(()=>{
                    bars[frame.A].classList.remove('compared')
                    bars[frame.B].classList.remove('compared')
                },i+factor)
            }else if(frame.type==='swap'){
                let result=bars
                const tempStorage=result[frame.A]
                result[frame.A]=result[frame.B]
                result[frame.B]=tempStorage
                setTimeout(()=>{
                    setBars(result)
                },i)
            }
            i+=factor
        })
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
    const graphRef=useRef()
    const maxNumber=400 //400 for best proformence
    const minNumber=4   //4 for best proformence
    const animator=()=>{
        // setInterval(()=>{
            //     setMainArray(frame)
        // },100)
        // )
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
                <button onClick={()=>setMainArray(newArray())}>Generate New Array</button>
            </div>
            <div className="sortingOption" id="silderOption">
                <p>alter array size and sorting speed</p>
                <input 
                id='widthRange'
                type='range'
                min={minNumber}
                max={max}
                value={width}
                onChange={e=>setWidth(Number(e.target.value))}
                />
            </div>
            <div className="sortingOption" id="alogorithmOption">
                <p style={{borderBottomColor:algo===1? 'var(--colorScale2)' : ''}} onClick={()=>setAlgo(1)}>merge</p>
                <p style={{borderBottomColor:algo===2? 'var(--colorScale2)' : ''}} onClick={()=>setAlgo(2)}>Quick</p>
                <p style={{borderBottomColor:algo===3? 'var(--colorScale2)' : ''}} onClick={()=>setAlgo(3)}>Heap</p>
                <p style={{borderBottomColor:algo===4? 'var(--colorScale2)' : ''}} onClick={()=>setAlgo(4)}>Bubble</p>
            </div>
            <div className="sortingOption" id="sortOption">
                <button onClick={()=>{
                    setAlgoTimer({start:Date.now() ,end:null})
                    setMainArray(
                    algo===1 ? mergeSort(mainArray) : 
                    algo===2 ? quickSort(mainArray):
                    algo===3 ? {/*heap */}:
                    bubbleSort(mainArray)
                )
                }}>sort !</button>
                <button onClick={()=>{testMergeSort(mainArray)}}>test merge</button>
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