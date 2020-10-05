import { React, styled, colors } from "src/imports/react"
import TopNavigation from "src/components/TopNavigation"

const AuthLayout = (props) => {
  return (
    <Auth className={props.className}>
      <TopNavigation />
      {props.children}
    </Auth>
  )
}

const Auth = styled.main`
  min-height: 100vh;
  background-color: ${colors.primary};
  padding: 4.5rem 1rem;
  color: white;
  display: flex;
  flex-direction: column;
`

export default AuthLayout