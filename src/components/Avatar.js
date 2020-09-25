import {React, styled, colors} from "src/imports/react"
import defaultAvatar from '../assets/images/person.svg'

const Avatar = props => {
  let source = defaultAvatar
  if (props.url) {
    source = props.url
  }
  return <$Avatar src={source} alt="avatar" />
}

const $Avatar = styled.img`
  height: 160px;
  width: 160px;
  object-fit: cover;
  background-color: ${colors.secondary};
`

export default Avatar