import React, { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import icon from './icons:images/settings.png'

const Cont = styled.div`
  position: absolute;
  left: 25px;
  top: 25px;
`

const spinAnim = keyframes`
  0%{
    transform: rotate(180deg);
  }
  100%{
    transform: rotate(300deg);
  }
`

const Icon = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  height: 50px;
  width: 50px;
  background-size: cover;
  background-image: url(${props => props.b});
  transition-duration: .3s;
  ${props => props.o ? "transform: rotate(180deg);" : null}
  :hover{
    ${props => props.o ? null : "transform: rotate(20deg);"}
  }
  animation: .8s ease infinite ${props => props.t ? spinAnim : null};
`

const Window = styled.div`
  padding-top: 10px;
  position: relative;
  top: ${props => props.o ? "70px" : "0px"};
  height: ${props => props.o ? "100px" : "60px"};
  width: ${props => props.o ? "300px" : "70px"};
  opacity: ${props => props.o ? "1" : ".3"};
  background-color: rgba(40,40,40, 0.5);
  border-radius: 10px;
  ${props => props.o ? null : 'pointer-events: none;'}
  ${props => props.o ? "transition: opacity .2s, height .35s, width .5s, top .25s;" : "transition: opacity .2s, height .2s, width .2s, top .2s;"}
`

const openAnim = keyframes`
  0%{
    opacity: 0%;
  }
  100%{
    opacity: 100%;
  }
`

const WindowBtn = styled.div`
  animation: .4s .2s both ${openAnim};
  border-radius: 8px;
  font-family: sans-serif;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10%;
  width: 80%;
  height: 40px;
  background-color: rgba(255,255,255,.7);
  cursor: pointer;
  :hover{
    background-color: rgba(255,255,255,1)
  }
`

const WindowIcos = styled.div`
  animation: .4s .25s both ${openAnim};
  width: 80%;
  margin-left: 10%;
  height: 50px;
  display:flex;
  justify-content: space-between;
  align-items: center;
`

const Ico = styled.div`
  height: 25px;
  width: 25px;
  border-radius: 25px;
  background: ${props => props.g};
  transition-duration: .2s;
  border-width: ${props => props.s ? "5px" : "0px"};
  border-color: white;
  border-style: solid;
  cursor: pointer;
`

export default function BackgManager(props) {
  const [windowOpen, setWindowOpen] = useState(false)
  const windowRef = useRef(null);
  let it = parseInt(props.bt.split(' ')[1])
  const gradList = [
    'linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)',
    'linear-gradient(45deg, #85FFBD 0%, #FFFB7D 100%)',
    'linear-gradient(62deg, #FBAB7E 0%, #F7CE68 100%)',
    'linear-gradient(45deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(45deg, #fdfcfb 0%, #e2d1c3 100%)']

  const handleClickOutside = (e) => {
    if(windowRef.current && !windowRef.current.contains(e.target)){
      setWindowOpen(false)
    }
  }

  const unspClickHandler = () => {
    if(props.bt.split(' ')[0] == 'color'){
      if(props.t){

      }else{
        props.btf('image')
      }
    }else{
      if(props.t){

      }else{
        fetch("https://api.unsplash.com/photos/random?orientation=landscape&query=Nature", {
          headers: {
            Authorization: "Client-ID YNM7p9VDoIgTtc6pEkpinAXWUZdUadOS6VuRD4mC4gE"
          }
        })
          .then(response => response.json())
          .then(data => {
            const imageUrl = data.urls.full;
            props.urlc(imageUrl);
          });
              }
    }
  }

  const btnClickHandler = (e) => {
    if(props.t){

    }else{
      it = e
      props.btf('color ' + e)
    }
  }
  useEffect(() => {
    document.addEventListener('mouseup', handleClickOutside)
    return () => {
      document.removeEventListener('mouseup', handleClickOutside)
    }
  }, [])
  

  return (
    <Cont>
      <Icon t={props.t} o={windowOpen} b={icon} onClick={() => {setWindowOpen(!windowOpen)}}></Icon>
      <Window ref={windowRef} o={windowOpen}>
        {windowOpen ? (
          <div>
            <WindowBtn onClick={unspClickHandler}>{props.bt.split(' ')[0] == "color" ? "Change to Image" : "New Unsplash Image"}</WindowBtn>
            <WindowIcos>
              <Ico g={gradList[0]} s={it == 0 ? true : false} onClick={() => {btnClickHandler(0)}}></Ico>
              <Ico g={gradList[1]} s={it == 1 ? true : false} onClick={() => {btnClickHandler(1)}}></Ico>
              <Ico g={gradList[2]} s={it == 2 ? true : false} onClick={() => {btnClickHandler(2)}}></Ico>
              <Ico g={gradList[3]} s={it == 3 ? true : false} onClick={() => {btnClickHandler(3)}}></Ico>
              <Ico g={gradList[4]} s={it == 4 ? true : false} onClick={() => {btnClickHandler(4)}}></Ico>
            </WindowIcos>
          </div>
        ) : null}
      </Window>
    </Cont>
  )
}
