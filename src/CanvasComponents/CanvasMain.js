import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import UpperPart from './UpperPart'
import AssignmentList from './AssignmentList'
import styled, { keyframes } from 'styled-components'

const MainCont = styled.div`
    transition: width .2s, height .${props => props.o ? "4" : "2"}s, top .2s, right .2s, border-radius .2s, opacity .2s;
    position: absolute;
    border-radius: ${props => props.o ? "0px" : "8px"};
    top: ${props => props.o ? "0px" : "25px"};
    right: ${props => props.o ? "0px" : "25px"};
    height: ${props => props.o ? "100vh" : "70px"};
    width: ${props => props.o ? "30vw" : "70px"};
    opacity: ${props => props.o ? ".8" : ".3"};
    background-color: rgb(60,60,60);
`

const OpacityCont = styled.div`
  transition: opacity ${props => props.o ? ".5s .2s" : ".15s"};
  pointer-events: ${props => props.o ? "all" : "none"};
  opacity: ${props => props.o ? "1" : '0'};
`

export default function CanvasMain() {
  const [currAssignments, setcurrAssignments] = useState([])
  const [open, setOpen] = useState(true)
  const [filters, setFilters] = useState(['assignment'])
  const [jsx, setJsx] = useState([])
  const openRef = useRef(0)


  useEffect(() => {
    fetch('http://127.0.0.1:8000/canvdata').then((response) => response.json()).then((data) => {
      setcurrAssignments(data)
    })
  }, [])
  let handleClicks = (e) => {
    if (openRef.current && !openRef.current.contains(e.target)) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }
  useEffect(() => {
    let newarr = currAssignments.filter((e) => {
      if (filters.includes('announcement')) {
        if (e.Type == "A") {
          return e
        }
      }
      if (filters.includes('assignment')) {
        if ((e.Type == "T") && (e.Submitted == false)) {
          return e
        }
      }
      if (filters.includes('done')) {
        if (e.Submitted) {
          return e
        }
      }
    })
    newarr = newarr.sort((a, b) => {
      if (a.DueDate < b.DueDate) {
        return -1;
      }
    })
    setJsx(newarr)
  }, [filters, currAssignments])
  useEffect(() => {
    document.addEventListener('click', handleClicks)
    return () => {
      document.removeEventListener('click', handleClicks)
    }
  }, [openRef])
  const refresh = () => {
    document.getElementById('refresher').classList.toggle("ref")
    fetch('http://127.0.0.1:8000/refreshdata').then((response) => response.json()).then((data) => {
      if(data == 0){
        fetch('http://127.0.0.1:8000/canvdata').then((response) => response.json()).then((data) => {
          console.log('ref3')
          document.getElementById('refresher').classList.toggle("ref")
          setcurrAssignments(data)
        })
      }else{
        document.getElementById('refresher').classList.toggle("ref")
        console.log('error')
      }
    })
  }
  return (
    <MainCont ref={openRef} id='cont' o={open}>
      <OpacityCont o={open}>
        <UpperPart c={jsx} r={refresh} sf={setFilters} f={filters}></UpperPart>
        {
          open ? (<AssignmentList c={jsx}></AssignmentList>) : null
        }
      </OpacityCont>
    </MainCont>
  )
}
