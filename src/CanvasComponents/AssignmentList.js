import React from 'react'
import styled, { keyframes } from 'styled-components'

const openAnim = keyframes`
    0%{
        height: 0%;
    }
    100%{
        height: calc(100% - 5px);
    }
`


const Cont = styled.div`
    height: 84vh;
    width: 90%;
    padding: 0px 5% 0px 5%;
    margin:0px;
    position: absolute;
`
const List = styled.div`
    margin: 0px;
    width: 100%;
    padding-top: 10px;
    height: calc(100% - 5px);
    overflow: scroll;
    animation: ${openAnim} 1s .3s backwards ease;
`
const Object = styled.div`
    height: 90px;
    width: calc(100% - 10px);
    margin-bottom: 10px;
    padding: 5px;
    border-radius: 5px;
    cursor: pointer;
    :hover{
        background-color: rgba(255,255,255,.1)
    }
    .classTitle{
        margin:0px;
        font-family: 'Poppins';
        font-size: 11pt;
        font-weight: 600;
        color: rgb(200,200,200);
    }
    .title{
        margin:0px;
        color: white;
        font-family: 'Open Sans';
        font-size: 12pt;
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .Points{
        margin:0px;
        font-family: 'Open Sans';
        font-size: 12pt;
        font-weight: 400;
        color: rgb(200,200,200);
    }
    .DueTime{

        margin:0px 0px 0px 10px;
        font-family: 'Poppins';
        font-size: 11pt;
        font-weight: 600;
        color: rgb(200,200,200);
    }
    .cls{
        display:flex;
        width: 100%;
        justify-contents: space-between;
    }
`

export default function AssignmentList(props) {
    const determineDue = (t) => {
        let timeDiff = t - Date.now()
        if(timeDiff > 60000){
            let days = Math.trunc(timeDiff/86400000)
            let hours = Math.trunc(timeDiff/3600000)
            let mins = Math.trunc(timeDiff/60000)
            if(days >= 1){
                return "Due in " + days + " days"
            }else if(hours >= 1){
                return "Due in " + hours + " hours"
            }else{
                return "Due in " + mins + " minutes"
            }
        }else if(timeDiff < -60000){
            return "Overdue"
        }else{
            return "Due now"
        }
    }
  return (
    <Cont>
        <List className='noscroll'>
            {props.c.map((e,i) => {
                return (
                    <Object key={'a' + i}>
                        <span className='cls'>
                            <p className='classTitle'>{e.Class + (e.Type == "T" ? " - ✏️" : " - 📢")}</p>
                            {e.Type == "T" ? <p className='DueTime'>{determineDue(e.DueDate)}</p> : null}
                        </span>
                        <p className='title'>{e.Title}</p>
                        {e.Type == "A" ? null : (<p className='Points'>{e.Points + " pts."}</p>)}
                    </Object>
                )
            })}
        </List>
    </Cont>
  )
}
