import './App.css'
import Header from './components/custom/Header.jsx'
import { Toaster } from './components/ui/sonners.jsx'
import Hero from './components/custom/Hero.jsx'
function App() {
  return (
    <>
      <Header />
      <Toaster />
      <Hero />
      {/* Uncomment to use Hero component */}
      {/* <Hero /> */}
    </>
  )
}

export default App
