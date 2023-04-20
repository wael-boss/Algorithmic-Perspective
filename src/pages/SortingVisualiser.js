import { useEffect, useMemo, useRef } from 'react'
import { useState } from 'react'
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
            return animations
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
        return animations
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
        return animations
    }
    // heap sort
    // const lowerMaxNum=(array ,animations ,lastUnsortedIndex ,parent=0 )=>{
    //     console.log(array)
    //     let smallerIndx=parent
    //     const leftChild=parent+parent+1
    //     const rightChild=parent+parent+2
    //     if(array[leftChild]>array[rightChild]){
    //         smallerIndx=rightChild
    //     }else{
    //         smallerIndx=leftChild
    //     }
    //     console.log(smallerIndx ,lastUnsortedIndex)
    //     if(smallerIndx<=lastUnsortedIndex){
    //         swap(array ,parent ,smallerIndx)
    //         lowerMaxNum(array ,animations ,lastUnsortedIndex ,smallerIndx)
    //     }
    // }
    const maxNum=(array ,animations ,lastUnsortedIndex ,parent)=>{
        const leftChild=parent+parent+1
        const rightChild=parent+parent+2
        if(!leftChild && !rightChild) return
        if(rightChild<lastUnsortedIndex+1){
            animations.push({ type: 'compare', A: rightChild, B: parent })
            if(array[rightChild]>array[parent]){
                animations.push({ type: 'swap', A: { index: parent, value: array[parent] }, B: { index: rightChild, value: array[rightChild] } })
                swap(array ,parent ,rightChild)
                maxNum(array ,animations ,lastUnsortedIndex ,rightChild)
            }
        }
        if(leftChild<lastUnsortedIndex+1){
            animations.push({ type: 'compare', A: leftChild, B: parent })
            if(array[leftChild]>array[parent]){
                animations.push({ type: 'swap', A: { index: parent, value: array[parent] }, B: { index: leftChild, value: array[leftChild] } })
                swap(array ,parent ,leftChild)
                maxNum(array ,animations ,lastUnsortedIndex ,leftChild)
            }
        }
        }
        const heapSort=(array ,animations=[])=>{
        const parentNodes=[]
        for(let i=Math.floor(array.length/2)-1;i>=0;i--){
            parentNodes.push(i)
        }
        let lastUnsortedIndex=array.length-1
        while(lastUnsortedIndex>=0){
            parentNodes.map(parent=>{
                maxNum(array ,animations ,lastUnsortedIndex ,parent)
            })
            animations.push({ type: 'swap', A: { index: 0, value: array[0] }, B: { index: lastUnsortedIndex, value: array[lastUnsortedIndex] } })
            swap(array ,0 ,lastUnsortedIndex)
            lastUnsortedIndex--
        }
        console.log(array)
        return animations
    }

    // end
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
    const animationFunc = (arr) => {
        // the number of mileseconds in between every frame
        let factor = width < 15 ? 500 : width < 20 ? 100 : width < 100 ? 50 : width < 150 ? 10 : 5
        // history of the last time out to create a consitent flow 
        let i = factor
        // get animatins from the chosen algorithm
        const animations = algo === 1 ? mergeSort(arr) : algo === 2 ? quickSort(arr) : algo === 3 ? heapSort(arr) : bubbleSort(arr)
        setTimeout(() => {
            setIsAnimating(false)
        }, animations.length * factor)
        // loop through the frames and set timeouts accodingly
        animations.map(frame => {
            // a frame comparing two values and changing their color to red
            if (frame.type === 'compare') {
                setTimeout(() => {
                    bars[frame.A].style.backgroundColor = 'red'
                    bars[frame.B].style.backgroundColor = 'red'
                    setTimeout(() => {
                        bars[frame.A].style.backgroundColor = ''
                        bars[frame.B].style.backgroundColor = ''
                    }, factor - factor / 10)
                }, i)
                // a frame swaping two values
            } else if (frame.type === 'swap') {
                setTimeout(() => {
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
                    bars[frame.index].title = frame.value
                    bars[frame.index].style.height = `${frame.value}px`
                    bars[frame.index].style.backgroundColor = `#00ff00`
                    setTimeout(() => {
                        bars[frame.index].style.backgroundColor = `var(--colorScale3)`
                    }, factor)
                }, i)
            }
            i += factor
        })
    }
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
        setBars(document.querySelectorAll('.bar'))
        if (algoTimer.end === null && algoTimer.start !== null) {
            setAlgoTimer({ ...algoTimer, end: Date.now() })
        }
    }, [mainArray])
    useEffect(() => {
        setMax(Math.floor((graphRef.current.clientWidth - 60) / 4))
    }, [])
    return (
        <main>
            <section id="sortingOptionsBar">
                <div className="sortingOption" id="generateArrayOption">
                    <button
                        style={{ backgroundColor: isAnimating ? '#a00000' : '' }}
                        onClick={() => {
                            if (isAnimating) return
                            setMainArray(newArray())
                        }}>Generate New Array</button>
                </div>
                <div className="sortingOption" id="silderOption">
                    <p>alter array size and sorting speed</p>
                    <input
                        style={{ background: isAnimating ? '#a00000' : '' }}
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
                        style={{ backgroundColor: isAnimating ? '#a00000' : '' }}
                        onClick={() => {
                            if (isAnimating) return
                            // setIsAnimating(true) sorts the array before the animations
                            animationFunc(mainArray)
                        }}>sort !</button>
                </div>
            </section>
            <section id="sortingSection" ref={graphRef}>
                {algoTimer.end && <p id='algoTimer'>time to sort: {algoTimer.end - algoTimer.start >= 1 ? algoTimer.end - algoTimer.start : 'less then 1'}ms</p>}
                <p onClick={() => { setWidth(prev => { return prev + 1 }) }} id='numOfBars'>{width === 1 ? `${width} bar` : `${width} bars`}</p>
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