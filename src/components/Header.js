import {React, styled, colors} from "src/imports/react"

const Header = (props) => {
  return (
    <Hdr>{props.children}</Hdr>
  )
}

const Hdr = styled.h1`
  font-family: 'Teko', sans-serif;
  font-size: 48px;
  margin: 0 0 1rem 0; 
  color: ${colors.headers};
  font-weight: 300;
  line-height: 1.1;
  letter-spacing: 0.2px;
  text-align: left;
`

export default Header