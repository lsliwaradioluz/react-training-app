import { React, styled, colors } from "src/imports/react"
import BottomNavigation from "src/components/BottomNavigation"
import TopNavigation from "src/components/TopNavigation"

const DefaultLayout = (props) => {
  return (
    <Default>
      <BottomNavigation />
      <$MainContent>
        <TopNavigation />
        {props.children}
      </$MainContent>
    </Default>
  )
}

const Default = styled.main`
  min-height: 100vh;
  background-color: ${colors.primary};
  padding: 4.5rem 1rem;
  color: white;
  display: flex; 
  flex-direction: column;
  @media (min-width: 1024px) {
    flex-direction: row;
    padding: 0;
  }
`

const $MainContent = styled.div`
  @media (min-width: 1024px) {
    padding: 2rem;
  }
`

export default DefaultLayout