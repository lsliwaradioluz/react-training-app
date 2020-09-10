import {React, colors, styled} from "src/imports/react"

const Header = (props) => {
  return (
    <Hdr>{props.children}</Hdr>
  )
}

const Hdr = styled.h1`
  color: ${colors.headers};
`

export default Header