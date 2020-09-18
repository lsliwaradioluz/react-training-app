import {React, styled, colors} from "src/imports/react"

const CarouselContainer = props => {
  return (
    <$CarouselContainer>
      {props.children}
    </$CarouselContainer>
  )
}

const $CarouselContainer = styled.div`
  margin-left: -1rem;
  padding: 1rem;
  width: calc(100% + 2rem);
  background-color: ${colors.secondary};
`

export default CarouselContainer