import {React, styled, css} from "src/imports/react"

const DateView = props => {
  const getDay = () => {
    const date = new Date(props.date)
    let day = date.getDate()
    return day < 10 ? `0${day}` : day
  }
  
  const getMonth = () => {
    const date = new Date(props.date)
    let month = date.getMonth() + 1
    return month < 10 ? `0${month}` : month
  }

  return (
    <$Date>
      <$Day>{getDay()}</$Day>
      <$Month>{getMonth()}</$Month>
    </$Date>
  )
}

const $Date = styled.div`
  height: 40px;
  width: 40px;
  display: flex;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  margin-left: 1rem;
  align-self: flex-start;
  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    height: 1.5px;
    width: 100px;
    background-color: white;
    transform: rotate(-46deg);
    transform-origin: 0;
  }
`

const numberStyle = css`
  width: 50%;
  height: 100%;
  color: white;
  margin: 0;
  display: flex;
  line-height: 1;
`

const $Day = styled.h4`
  ${numberStyle}
  justify-content: flex-start;
  align-items: flex-start;
`

const $Month = styled.h4`
  ${numberStyle}
  justify-content: flex-end;
  align-items: flex-end;
`

export default DateView