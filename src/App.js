import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import BackgManager from './BackgManager'
import back from './icons:images/defaultBackG.jpg'
import SearchbarScript from './SearchComponents/SearchbarScript'
import CanvasMain from './CanvasComponents/CanvasMain'
import AppSelector from './SideBarStuff/AppSelector'

const GradAnim = keyframes`
  0%{
    background-position: 0 0;
  }
  50%{
    background-position: 100 0;
  }
  100%{
    background-position: 0 0;
  }
`

const Background = styled.div`
  height: 100vh;
  width: 100vw;
`

const fadeIn = keyframes`
  0%{
    opacity: 1;
  }100%{
    opacity: 0;
  }
`

const Gradient = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  background: ${props => props.g};
  background-size: 200%;
  pointer-events: none;
  visibility: visible;
  `
const Gradient2 = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  background: ${props => props.g};
  background-size: 200%;
  pointer-events: none;
  animation: 1s ease ${fadeIn};
  `
  // animation-name: ${fadeIn}, ${GradAnim};
  // animation-duration: 1s, 1s;
  // animation-iteration-count: 1, infinite;
  // animation-fill-mode: forwards, none;

const Image = styled.img`
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100vh;
  width: 100vw;
  object-fit: cover;
  object-position: center center;
  pointer-events: none;
  visibility: visible;
`
const Image2 = styled.img`
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100vh;
  width: 100vw;
  object-fit: cover;
  object-position: center center;
  pointer-events: none;
  animation: 1s ease ${fadeIn};
`


export default function App() {
  const gradList = [
    'linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)',
    'linear-gradient(45deg, #85FFBD 0%, #FFFB7D 100%)',
    'linear-gradient(62deg, #FBAB7E 0%, #F7CE68 100%)',
    'linear-gradient(45deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(45deg, #fdfcfb 0%, #e2d1c3 100%)']
    const [backType, setBackType] = useState('image')
    const [url, setUrl] = useState(back)
    const [first, setFirst] = useState((backType.split(' ')[0] == 'color' ? <Gradient g={gradList[parseInt(backType.split(' ')[1])]}></Gradient> : <Image src={url}></Image>))
    const [next, setNext] = useState(null)
  const handleBackgChange = (e) => {
    setNext((backType.split(' ')[0] == 'color' ? <Gradient2 g={gradList[parseInt(backType.split(' ')[1])]}></Gradient2> : <Image src={url}></Image>))
    setFirst((e.split(' ')[0] == 'color' ? <Gradient g={gradList[parseInt(e.split(' ')[1])]}></Gradient> : <Image src={url}></Image>))
    setBackType(e)
    setTimeout(() => {
      setNext(null)
    }, 800);
  }
  const handleUrlChange = (e) => {
    setNext(<Image2 src={url}></Image2>)
    setFirst(<Image src={e}></Image>)
    setUrl(e)
    setTimeout(() => {
      setNext(null)
    }, 800);
  }
  return (
    <Background>
      {first}
      {next}
      {/* {backType.split(' ')[0] == 'color' ? <Gradient g={gradList[parseInt(backType.split(' ')[1])]}></Gradient> : <Image src={back}></Image>} */}
      <BackgManager t={next == null ? false : true} bt={backType} urlc={handleUrlChange} btf={handleBackgChange}></BackgManager>
      <CanvasMain></CanvasMain>
      <SearchbarScript></SearchbarScript>
      <AppSelector></AppSelector>
    </Background>
  )
}