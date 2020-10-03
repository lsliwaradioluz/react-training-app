import {React, colors, styled} from "src/imports/react"

const Header = (props) => {
  return (
    <$Header>{props.children}</$Header>
  )
}

const $Header = styled.h1`
  color: ${colors.headers};
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (min-width: 1024px) {
    font-size: 60px;
  }
`

export default Header