import React, { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import Suggestions from './Suggestions'

const Container = styled.div`
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    display:flex;
    flex-direction:column-reverse;
    align-items:center;
    pointer-events: none;
`
const Searchbar = styled.input`
    z-index: 1;
    pointer-events: auto;
    position: absolute;
    top: ${props => props.a ? "85%" : "40%"};
    transition: border-radius .1s, top .35s;
    color: rgb(60,60,60);
    font-weight: bold;
    padding: 0px 10px 0px 10px;
    font-size: 20pt;
    outline: none;
    background-color: rgb(240,240,240);
    border:none;
    border-radius: 12px;
    height: 50px;
    width: 35vw;
    :active{
        border-radius: 20px;
    }
`
const Backdrop = styled.div`
    transition-duration: .5s;
    pointer-events: none;
    position: absolute;
    height: 100vh;
    width: 100vw;
    top: 0px;
    left: 0px;
    background-size: 100% 500%;
    background-position: center ${props => props.a ? "60%" : "100%"};
    background-image: linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(255,255,255,0) 20%);
`

export default function Searchbarscript() {
    const [active, setActive] = useState(true)
    const [content, setContent] = useState("")
    const srcRef = useRef(null);

    const handleClick = (e) => {
        if(srcRef.current && !srcRef.current.contains(e.target)){
            setActive(true)
        }else{
            setActive(false)
        }
    }
    const handleKeys = (e) => {
        if(e.key == "Enter"){
            if(document.activeElement !== srcRef.current){
                setActive(!active)
                srcRef.current.focus()
            }
        }
        if(e.key == "Escape"){
            if(document.activeElement == srcRef.current){
                setActive(!active)
                srcRef.current.blur()
            }
        }
        if(e.key == " "){
            if(document.activeElement !== srcRef.current){
                setActive(!active)
                srcRef.current.focus()
                setTimeout(() => {
                    setContent(content.trim())
                }, 0);
            }
        }
    }
    useEffect(() => {
        document.addEventListener('mouseup', handleClick)
        document.addEventListener('keyup', handleKeys)
        return () => {
            document.removeEventListener('mouseup', handleClick)
            document.removeEventListener('keyup', handleKeys)
        }
    }, [handleKeys, handleClick])
    const handleType = (e) => {
        setContent(e.target.value)
    }
    // let script2 = document.createElement("script")
    // script2.type='text/javascript'
    // script2.innerText = getSuggestions
    // document.appendChild(script2)
    // let script = document.createElement('script');
    // script.type = 'text/javascript';
    // script.src = `https://www.google.com/complete/search?client=safari&q=y&callback=getSuggestions`;
    // document.addEventListener('click', (e) => {
    //     document.body.appendChild(script)
    // })


    return (
        <div>
            <Container>
                <Suggestions r={srcRef} a={active} v={content}></Suggestions>
                <Searchbar value={content} onChange={handleType} a={active} ref={srcRef}></Searchbar>
            </Container>
            <Backdrop a={active}></Backdrop>
        </div>
    )
}
