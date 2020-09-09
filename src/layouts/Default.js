import { React, styled, colors } from "src/imports/react"
import BottomNavigation from "src/components/BottomNavigation"
import TopNavigation from "src/components/TopNavigation"

const DefaultLayout = (props) => {
  return (
    <Default>
      <TopNavigation />
      {props.children}
      <BottomNavigation />
    </Default>
  )
}

const Default = styled.main`
  min-height: 100vh;
  background-color: ${colors.primary};
  padding: 4.5rem 1rem;
  color: white;
`

export default DefaultLayout