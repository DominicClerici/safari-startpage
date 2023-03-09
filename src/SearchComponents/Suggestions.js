import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import styled from 'styled-components'

const SrcResultCont = styled.div`
    pointer-events: auto;
    height: ${props => props.f ? "40%" : "0%"};
    width: ${props => props.f ? "calc(35vw + 20px)" : "30vw"};
    padding: ${props => props.f ? "1%" : "0%"} 0px 0px 0px;
    background-color: rgb(30,30,30);
    position:absolute;
    z-index:1;
    top: ${props => props.a ? "90%" : "calc(40% + 35px)"};
    transition: height .3s, width .25s, padding .1s, top .3s;
    border-radius: 0px 0px 10px 10px;
    display:flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
`

const Suggestion = styled.div`
    width: 100%;
    margin: 0px 5% 0px 5%;
    display:flex;
    align-items:center;
    padding-left: 30px;
    background-color: transparent;
    height: 14%;
    font-family: "Open Sans";
    font-size: 15pt;
    color: rgb(200,200,200);
    cursor: pointer;
`


export default function Suggestions(props) {
    const [sugg, setSugg] = useState([])
    const [active, setActive] = useState(false)
    const [arrowPos, setArrowPos] = useState(-1)
    const prev = useRef(null)
    const jsx = useRef((<div></div>))

    // use this code and make it better so that it watched for changes and when there is a change it updates the state accordingly.
    // also make sure to put it in a useffect b/c it is creating too many observers.
    // useEffect(() => {
    //     let e = document.getElementById('watch')
    //     var config = { characterData: false, attributes: false, childList: true, subtree: false };
    //     const callback = () => {
    //         console.log(e.innerText.split(",").filter((de) => {
    //             return de.startsWith(props.v)
    //         }).splice(0,6))
    //     };
    //     // Create an observer instance linked to the callback function
    //     const observer = new MutationObserver(callback);
    //     // Start observing the target node for configured mutations
    //     observer.observe(e, config);
    // // Later, you can stop observing
    //     return () => {
    //         observer.disconnect();
    //     }
    // }, [])
    const keypressFunc = (e) => {
        if(e.key == "ArrowUp"){
            if(arrowPos > 0){
                setArrowPos(arrowPos-1)
            }
        }else if(e.key == "ArrowDown"){
            if(arrowPos < (sugg.length-1)){
                setArrowPos(arrowPos+1)
            }
        }
    }
    const openPage = (url) => {
        window.open("https://www.google.com/search?q=" + url)
    }
    const stylize = (e) => {
        if(prev.current != null){
            destyle()
        }
        if(e.target != null) {
            prev.current = e.target
            e.target.style.backgroundColor = "rgba(255,255,255,.1)"
        }else{
            prev.current = e
            e.style.backgroundColor = "rgba(255,255,255,.1)"
        }
    }
    const destyle = () => {
        prev.current.style.backgroundColor = "transparent"
    }
    useEffect(() => {
        if((arrowPos != -1) && (active == true)){
            stylize(document.getElementById("s" + arrowPos))
        }
        return () => {
            if(prev.current != null){
                destyle()
            }
        }
    }, [arrowPos])
    const enterFunc = (e) => {
        if((e.key == 'Enter') && (active)){
            if(arrowPos != -1){
                openPage(document.getElementById("s" + arrowPos).innerText)
            }else{
                openPage(props.v)
            }
        }
    }
    useEffect(() => {
        document.addEventListener('keydown', enterFunc)
        document.addEventListener('keydown', keypressFunc)
        return () => {
            document.removeEventListener('keydown', enterFunc)
            document.removeEventListener('keydown', keypressFunc)
        }
    }, [keypressFunc])

    useEffect(() => {
        if(props.v.trim().length >= 1){
            setArrowPos(-1)
            let e = document.getElementById('watch')
            var config = { characterData: false, attributes: false, childList: true, subtree: false };
            const callback = () => {
                setSugg(e.innerText.split(",").filter((de) => {
                    return de.startsWith(props.v)
                }).splice(0,7))
            };
            // Create an observer instance linked to the callback function
            const observer = new MutationObserver(callback);
            // Start observing the target node for configured mutations
            observer.observe(e, config);
            let externalScript = document.createElement('script');
            externalScript.src = `https://www.google.com/complete/search?client=safari&q=${props.v}&callback=getSuggestions`
            // externalScript.src = `https://www.google.com/complete/search?client=safari&q=y&callback=getSuggestions`
            externalScript.async = true;
            document.head.appendChild(externalScript)
            if((sugg.length > 0) && (!props.a)){
                setActive(true)
            }else{
                setActive(false)
            }
            return () => {
              observer.disconnect();
              document.head.removeChild(externalScript)
            }
        }else{
            setActive(false)
        }
    }, [props.v, props.a])
    return (
        <SrcResultCont f={active} a={props.a}>
            {sugg.map((e,i) => {
                return (
                    <Suggestion onMouseEnter={stylize} onMouseLeave={destyle} onClick={() => {openPage(e)}} id={'s' + i} key={'s' + i}>
                        {e}
                    </Suggestion>
                )
            })}
        </SrcResultCont>
    )
}
