import { useEffect, useMemo, useRef } from 'react'
import { useState } from 'react'
import { useFrequency } from 'react-frequency'
import '../css/SortingVisualiser.css'
const SortingVisualiser = () => {
    const [bars, setBars] = useState([])
    // sorting algos
    // merge sort
    const merge = (array, animations, firstParams, secondParams) => {
        // indicators to check the left and right sides of the array comparing them in the procces
        let leftIndicator = 0
        let rightIndicator = firstParams.e - firstParams.s
        // the point in the array where correct position values would go
        let arrayPosition = firstParams.s
        // a temporary array to hold the current section and avoid duplicate values in the final array
        let tempArr = array.slice(firstParams.s, secondParams.e)
        // a loop that runs until one of the indicators reached the end of its array
        while (leftIndicator + firstParams.s < firstParams.e && rightIndicator + firstParams.s < secondParams.e) {
            // add a frame of comparison to the animations
            animations.push({ type: 'compare', A: leftIndicator + firstParams.s, B: rightIndicator + firstParams.s })
            // look for the smaller value between the left and right side and sort it 
            if (tempArr[leftIndicator] < tempArr[rightIndicator]) {
                // save a frame of change to the animation
                animations.push({ type: 'change', index: arrayPosition, value: tempArr[leftIndicator] })
                array[arrayPosition] = tempArr[leftIndicator]
                leftIndicator++
            } else {
                // save a frame of change to the animation
                animations.push({ type: 'change', index: arrayPosition, value: tempArr[rightIndicator] })
                array[arrayPosition] = tempArr[rightIndicator]
                rightIndicator++
            }
            // increment the position for the next value
            arrayPosition++
        }
        // pick up leftover values and add them to the already sorted array
        while (leftIndicator + firstParams.s < firstParams.e) {
            animations.push({ type: 'change', index: arrayPosition, value: tempArr[leftIndicator] })
            array[arrayPosition] = tempArr[leftIndicator]
            leftIndicator++
            arrayPosition++
        }
        while (rightIndicator + firstParams.s < secondParams.e) {
            animations.push({ type: 'change', index: arrayPosition, value: tempArr[rightIndicator] })
            array[arrayPosition] = tempArr[rightIndicator]
            rightIndicator++
            arrayPosition++
        }
        // look for the actual end of the function to return the animations array
        if (tempArr.length === array.length) {
            // save the moment the sorting ended
            setAlgoTimer(prev=>{
                return {
                ...prev,
                end:Date.now()}
            })
            return [array ,...animations]
        } else {
            return { s: firstParams.s, e: secondParams.e }
        }
    }
    const mergeSort = (array, animations = [], s = 0, e = array.length) => {
        const currentArray = array.slice(s, e)
        // break point to avoid infinite recursion
        if (currentArray.length < 2) return { s: s, e: e }
        // middle index of the array
        const midPoint = Math.floor(currentArray.length / 2)
        // create a recursion to cut down the array as small as possible then re-assemble it using the merge function
        return merge(array, animations, mergeSort(array, animations, s, s + midPoint), mergeSort(array, animations, s + midPoint, e))
    }
    // bubble sort
    const swap = (array, a, b) => {
        const temp = array[a]
        array[a] = array[b]
        array[b] = temp
    }
    const bubbleSort = (array) => {
        const animations = []
        let totalRuns = 0
        let runPerBar = 0
        // loop through the array length
        while (totalRuns < array.length) {
            // for every run loop through the arrays length ignoring previous runs
            while (runPerBar + totalRuns < array.length - 1) {
                // store a compare frame
                animations.push({ type: 'compare', A: runPerBar, B: runPerBar + 1 })
                // check if the value is bigger the the next one and swap if true
                if (array[runPerBar] > array[runPerBar + 1]) {
                    // store a swap frame
                    animations.push({ type: 'swap', A: { index: runPerBar, value: array[runPerBar] }, B: { index: runPerBar + 1, value: array[runPerBar + 1] } })
                    // run a swap function
                    swap(array, runPerBar, runPerBar + 1)
                }
                runPerBar++
            }
            // get the loop ready for the next run
            runPerBar = 0
            totalRuns++
        }
        // return an array of frames
        // save the moment the sorting ended
        setAlgoTimer(prev=>{
            return {
            ...prev,
            end:Date.now()}
        })
        return [array ,...animations]
    }
    // quick sort
    const quickSort = (array, animations = [], s = 0, e = array.length) => {
        // end the function when the array width is < 2
        if (e - 1 === s) return
        const pivotIndx = e - 1
        const pivotVal = array[pivotIndx]
        let currIndex = s
        let swapIndx = s - 1
        // loop through the array length incrementing the var currIndex each run
        while (currIndex < array.length) {
            // is true when the value is smaller than the pivot
            if (array[currIndex] <= pivotVal) {
                swapIndx++
                // save a compare frame
                animations.push({ type: 'compare', A: currIndex, B: swapIndx })
                // is true when the value is bigger than the pivot
                if (array[swapIndx] > array[currIndex]) {
                    // save a swap frame
                    animations.push({ type: 'swap', A: { index: currIndex, value: array[currIndex] }, B: { index: swapIndx, value: array[swapIndx] } })
                    swap(array, swapIndx, currIndex)
                }
            }
            currIndex++
        }
        // if the swapIndx exeeds the end of the array it means its the last index
        if (swapIndx >= e) swapIndx = e - 1
        // recursively feed the function the unsorted left and right side
        // check if the array is empty or not
        if (swapIndx !== s) {
            // unsorted left (smaller nums)
            quickSort(array, animations, s, swapIndx)
        }
        // check if the array is empty or not
        if (e !== swapIndx) {
            // unsorted right (bigger nums)
            quickSort(array, animations, swapIndx, e)
        }
        // save the moment the sorting ended
        setAlgoTimer(prev=>{
            return {
            ...prev,
            end:Date.now()}
        })
        return [array ,...animations]
    }
    // heap sort
    const maxNum=(array ,animations ,lastUnsortedIndex ,parent)=>{
        // find the left and right children of the parent node
        const leftChild=parent+parent+1
        const rightChild=parent+parent+2
        // if the node is not a parent break the recursion
        if(!leftChild && !rightChild) return
        // if the right child is within the unsorted area and is bigger than its parent swap them
        if(rightChild<lastUnsortedIndex+1){
            animations.push({ type: 'compare', A: rightChild, B: parent })
            if(array[rightChild]>array[parent]){
                animations.push({ type: 'swap', A: { index: parent, value: array[parent] }, B: { index: rightChild, value: array[rightChild] } })
                swap(array ,parent ,rightChild)
                // create a recursion heap logic aplies to all parent nodes
                maxNum(array ,animations ,lastUnsortedIndex ,rightChild)
            }
        }
        // if the left child is within the unsorted area and is bigger than its parent swap them
        if(leftChild<lastUnsortedIndex+1){
            animations.push({ type: 'compare', A: leftChild, B: parent })
            if(array[leftChild]>array[parent]){
                animations.push({ type: 'swap', A: { index: parent, value: array[parent] }, B: { index: leftChild, value: array[leftChild] } })
                swap(array ,parent ,leftChild)
                // create a recursion heap logic aplies to all parent nodes
                maxNum(array ,animations ,lastUnsortedIndex ,leftChild)
            }
        }
        }
    const heapSort=(array ,animations=[])=>{
            // get all the parent nodes in on array
        const parentNodes=[]
        for(let i=Math.floor(array.length/2)-1;i>=0;i--){
            parentNodes.push(i)
        }
        // the index where all values after it are sorted
        let lastUnsortedIndex=array.length-1
        // loop until the sorted side is the arrays length
        while(lastUnsortedIndex>=0){
            // loop until heap logic aplies to all nodes
            parentNodes.map(parent=>{
                maxNum(array ,animations ,lastUnsortedIndex ,parent)
            })
            // swap the first value by the last unsoted one
            animations.push({ type: 'swap', A: { index: 0, value: array[0] }, B: { index: lastUnsortedIndex, value: array[lastUnsortedIndex] } })
            swap(array ,0 ,lastUnsortedIndex)
            // decrease the unsorted section in the array
            lastUnsortedIndex--
        }
        // save the moment the sorting ended
        setAlgoTimer(prev=>{
            return {
            ...prev,
            end:Date.now()}
        })
        return [array ,...animations]
    }

    // end
    const [frequency, setFrequency] = useState(1)
    const { start, stop, playing } = useFrequency({
        hz: frequency
      })
    const [algoTimer, setAlgoTimer] = useState({
        start: null,
        end: null
    })
    const [width, setWidth] = useState(4)
    const [mainArray, setMainArray] = useState([])
    const [max, setMax] = useState(100)
    const [algo, setAlgo] = useState(1)
    const [isAnimating, setIsAnimating] = useState(false)
    const graphRef = useRef()
    const maxNumber = 400 //400 for best proformence
    const minNumber = 4   //4 for best proformence
    // run the chosen sorting algo which return animation frames and create timeouts for each frame
    const animationFunc = (arr) => {
        // the number of mileseconds in between every frame
        let factor = width < 15 ? 500 : width < 20 ? 100 : width < 100 ? 50 : width < 150 ? 12 : width < 200 ? 4 : 2
        // history of the last time out to create a consitent flow 
        let i = 0
        // save the moment the function started
        setAlgoTimer({
            start:Date.now(),
            end:null
        })
        // get animatins from the chosen algorithm
        const animations = algo === 1 ? mergeSort(arr) : algo === 2 ? quickSort(arr) : algo === 3 ? heapSort(arr) : bubbleSort(arr)
        const sortedArr=animations.splice(0 ,1)[0]
        // check if the starting array was already sorted
        if(JSON.stringify(mainArray)===JSON.stringify(sortedArr)){
            // a timeout to restore default values at the end of the animation
            setTimeout(() => {
                setFrequency(0)
                setIsAnimating(false)
            }, mainArray.length * factor)
            // loop over all bars creating a "array sorted" animation
            sortedArr.map((val,index)=>{
                if(!playing) start()        
                setTimeout(()=>{
                    setFrequency(val+100)
                    bars[index].style.backgroundColor='#00ff00'
                    setTimeout(()=>{
                        bars[index].style.backgroundColor='var(--colorScale3)'
                    },factor)
                },i)
                i+=factor
            })
        }else{
        setTimeout(() => {
            // a timeout to restore default values at the end of the animation
            setFrequency(0)
            setIsAnimating(false)
            setMainArray(sortedArr)
        }, animations.length * factor)
        // loop through the frames and set timeouts accodingly
        animations.map(frame => {
            if(!playing) start()
            // a frame comparing two values and changing their color to red
            if (frame.type === 'compare') {
                setTimeout(() => {
                    // create a sound for the greater value
                    if(Number(bars[frame.A].title)>Number(bars[frame.B].title)){
                        setFrequency(Number(bars[frame.A].title))
                    }else{
                        setFrequency(Number(bars[frame.B].title))
                    }
                    // make compared values red
                    bars[frame.A].style.backgroundColor = 'red'
                    bars[frame.B].style.backgroundColor = 'red'
                    setTimeout(() => {
                        // restore original color on the next frame
                        bars[frame.A].style.backgroundColor = ''
                        bars[frame.B].style.backgroundColor = ''
                    }, factor - factor / 10)
                }, i)
                // a frame swaping two values
            } else if (frame.type === 'swap') {
                setTimeout(() => {
                    // create a sound for the greater value
                    if(frame.A.value>frame.B.value){
                        setFrequency(frame.A.value+100)
                    }else{
                        setFrequency(frame.B.value+100)
                    }
                    bars[frame.A.index].style.backgroundColor = '#00ff00'
                    bars[frame.A.index].style.height = `${frame.B.value}px`
                    bars[frame.A.index].title = frame.B.value
                    bars[frame.B.index].style.backgroundColor = '#00ff00'
                    bars[frame.B.index].style.height = `${frame.A.value}px`
                    bars[frame.B.index].title = frame.A.value
                    setTimeout(() => {
                        bars[frame.A.index].style.backgroundColor = ''
                        bars[frame.B.index].style.backgroundColor = ''
                    }, factor - factor / 10)
                }, i)
                // a frame changing the height of a value
            } else if (frame.type === 'change') {
                setTimeout(() => {
                    // create a sound for value
                    setFrequency(Math.floor(frame.value)+100)
                    bars[frame.index].title = frame.value
                    bars[frame.index].style.height = `${frame.value}px`
                    bars[frame.index].style.backgroundColor = `#00ff00`
                    setTimeout(() => {
                        bars[frame.index].style.backgroundColor = `var(--colorScale3)`
                    }, factor)
                }, i)
            }
            i+=factor
        })
    }}
    // create an array with a chosen length with random values between min and max
    const newArray = () => {
        const arr = []
        for (let i = 0; i < width; i++) {
            arr.push(Math.floor(Math.random() * (maxNumber - minNumber + 1) + minNumber))
        }
        return arr
    }
    useEffect(() => {
        setMainArray(newArray())
    }, [width])
    useEffect(() => {
        // stop the sound when the animation is done
        if(frequency===0) stop()
        if(!isAnimating) stop()
    }, [frequency])
    useEffect(() => {
        setBars(document.querySelectorAll('.bar'))
    }, [mainArray])
    useEffect(() => {
        setMax(Math.floor((graphRef.current.clientWidth - 60) / 4))
        start()
        setTimeout(()=>{setFrequency(0)},1000)
    }, [])
    return (
        <main>
            <section id="sortingOptionsBar">
                <div className="sortingOption" id="generateArrayOption">
                    <button
                        style={{
                            background: isAnimating && '#a00000',
                            cursor: isAnimating && 'not-allowed'
                        }}
                        onClick={() => {
                            if (isAnimating) return
                            setMainArray(newArray())
                        }}>Generate New Array</button>
                </div>
                <div className="sortingOption" id="silderOption">
                    <p>alter array size and sorting speed</p>
                    <input
                        style={{
                            background: isAnimating && '#a00000',
                            cursor: isAnimating && 'not-allowed'
                        }}
                        id='widthRange'
                        type='range'
                        min={minNumber}
                        max={max}
                        value={width}
                        onChange={e => {
                            if (isAnimating) return
                            setWidth(Number(e.target.value))
                        }}
                    />
                </div>
                <div className="sortingOption" id="alogorithmOption">
                    <p style={{ borderBottomColor: algo === 1 ? 'var(--colorScale2)' : '' }} onClick={() => setAlgo(1)}>merge</p>
                    <p style={{ borderBottomColor: algo === 2 ? 'var(--colorScale2)' : '' }} onClick={() => setAlgo(2)}>Quick</p>
                    <p style={{ borderBottomColor: algo === 3 ? 'var(--colorScale2)' : '' }} onClick={() => setAlgo(3)}>Heap</p>
                    <p style={{ borderBottomColor: algo === 4 ? 'var(--colorScale2)' : '' }} onClick={() => setAlgo(4)}>Bubble</p>
                </div>
                <div className="sortingOption" id="sortOption">
                    <button
                        style={{
                            background: isAnimating && '#a00000',
                            cursor: isAnimating && 'not-allowed'
                        }}
                        onClick={() => {
                            if (isAnimating) return
                            setIsAnimating(true)
                            const array=[...mainArray]
                            animationFunc(array)
                        }}>sort !</button>
                </div>
            </section>
            <section id="sortingSection" ref={graphRef}>
                {algoTimer.end && <p id='algoTimer'>time to sort: {algoTimer.end - algoTimer.start >= 1 ? algoTimer.end - algoTimer.start : 'less then 1'}ms</p>}
                <p
                    style={{
                        color: isAnimating && '#a00000',
                        cursor: isAnimating && 'not-allowed'
                    }}
                    onClick={() => {
                    if(isAnimating) return
                    if(width+1>max) return
                    setWidth(prev => { return prev + 1 }) }} id='numOfBars'
                >
                    {width === 1 ? `${width} bar` : `${width} bars`}
                </p>
                {mainArray.length ? mainArray.map((value, indx) => {
                    return (
                        <div className='bar' key={indx} title={value} style={{ height: `${value}px` }}></div>
                    )
                }) : <p>error</p>}
            </section>
        </main>
    )
}

export default SortingVisualiser