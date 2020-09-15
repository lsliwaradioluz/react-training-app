import {React, colors, styled} from "src/imports/react"

const Header = (props) => {
  return (
    <Hdr>{props.children}</Hdr>
  )
}

const Hdr = styled.h1`
  color: ${colors.headers};
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export default Header