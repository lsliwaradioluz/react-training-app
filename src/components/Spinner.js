import {React, Fragment, styled, keyframes} from "src/imports/react"
import {Icon} from "src/imports/components"

const Spinner = props => {
  return (
    <Fragment>
      <$Spinner name="counterclockwise" />
      <$SpinnerCaption>
        Operacja w toku...
      </$SpinnerCaption>
    </Fragment>
  )
}

const spin = keyframes`
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
` 

const $Spinner = styled(Icon)`
  font-size: 32px;
  animation: ${spin} 1.5s linear infinite;
`

const $SpinnerCaption = styled.p`
  margin-bottom: 0;
  margin-top: .5rem;
  font-size: .8rem;
  text-align: center;
`

export default Spinner 