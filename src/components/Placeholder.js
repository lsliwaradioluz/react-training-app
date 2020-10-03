import {React, styled, keyframes, colors} from "src/imports/react"

const Placeholder = props => {
  const elements = []
  for (let i = 0; i < 5; i++) {
    elements.push(<$PlaceholderElement key={i} />)
  }

  return (
    <$Placeholder>
      {elements}
    </$Placeholder>
  )
}

const blink = keyframes`
  0% {
    opacity: 0.7;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 0.7;
  }
`

const $Placeholder = styled.div`
  opacity: 0.5;
  animation: ${blink} 1s infinite;
`

const $PlaceholderElement = styled.div`
  height: 5rem;
  background-color: ${colors.secondary};
  margin-bottom: 0.5rem;
  &:first-child {
    height: 10rem;
  }
  &:nth-child(2) {
    height: 3rem;
  }
`

export default Placeholder