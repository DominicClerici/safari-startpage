import React from 'react'
import styled, { keyframes } from 'styled-components'
import img from '../icons:images/assignments.png'
import img2 from '../icons:images/announce.png'
import img3 from '../icons:images/done.png'
import img4 from '../icons:images/refresh.png'

const spinAnim = keyframes`
    0%{
        transform: rotate(0deg);
    }50%{
        transform: rotate(180deg);
    }100%{
        transform: rotate(360deg);
    }
`

const ContBox = styled.div`
    height: 15vh;
    margin: 0% 5% 0% 5%;
    display: flex;
    flex-direction: column;
    border-width: 0px 0px 1px 0px;
    border-color: white;
    border-style:solid;
    overflow:hidden;
    position:relative;
`
const MainTitle = styled.h1`
    padding-left: 2%;
    color: white;
    font-family: 'Poppins', sans-serif;
    margin: 4vh 0px 0px 0px;
    font-size: clamp(10px, calc(0.625rem + ((1vw - 5.74px) * 1.6204)), 24px);
`
const MainSelectorsCont = styled.div`
    height: 40%;
    position: absolute;
    bottom: 0px;
    width: 100%;
    display:flex;
    align-items: center;
    justify-content: space-evenly;
`
const Selector = styled.img`
    cursor: pointer;
    transition: height .1s, margin .1s, filter .2s;
    filter: invert(${props => props.f ? "1" : "0"});
    height: clamp(30px, calc(1.875rem + ((1vw - 5.74px) * 2.3474)), 40px);
    margin: 0%;
    &.ref{
        animation: ${spinAnim} 2s infinite ease;
    }
`


export default function UpperPart(props) {

    // fetch('https://www.google.com/complete/search?client=chrome&q=y&callback=getSuggestions').then((response) => response.json()).then((data) => {
    //     console.log(data)
    // })
    const setFiltersHandler = (e) => {
        if (props.f.includes(e)){
            props.sf(props.f.filter((e2) => {
                return e2 != e
            }))
        }else{
            props.sf(props.f.concat(e))
        }
    }
    console.log(props.c)
    const DetermineTop = () => {
        if(props.c.length > 0){
            let cleaned = props.c.filter(e => e.DueDate > Date.now())
            if(cleaned.length > 0){
                let i = 0
                for (let e in cleaned){
                    if((e.DueDate - 86400000) < Date.now()){
                        i++
                    }
                }
                if(i == 0){
                    return "Next assignment due in " + Math.trunc((cleaned[0].DueDate - Date.now())/86400000) + " days."
                }else{
                    return i + " assignments due today."
                }
            }else{
                return "No assignments."
            }
        }else{
            return "No assignments."
        }
    }
  return (
    <ContBox>
        <MainTitle>{DetermineTop()}</MainTitle>
        <MainSelectorsCont>
            <Selector f={props.f.includes('assignment')} onClick={() => {
                setFiltersHandler('assignment')
            }} src={img}></Selector>
            <Selector f={props.f.includes('announcement')}  onClick={() => {
                setFiltersHandler('announcement')
            }} src={img2}></Selector>
            <Selector f={props.f.includes('done')}  onClick={() => {
                setFiltersHandler('done')
            }} src={img3}></Selector>
            <Selector id='refresher' src={img4} onClick={() => {
                props.r()
            }}></Selector>
        </MainSelectorsCont>
    </ContBox>
  )
}
