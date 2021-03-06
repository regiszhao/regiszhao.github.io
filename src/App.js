import './App.css';
import Navbar from './components/Navbar/Navbar.js'
import Home from './components/Home/Home.js'
import AboutMe from './components/AboutMe/AboutMe';
import Projects from './components/Projects/Projects'
import Photography from './components/Photography/Photography';
import Footer from './components/Footer/Footer';

function App({navlinks}) {
  const name = 'REGIS ZHAO'

  return(
    <>
      <Navbar navlinks={navlinks}/>
      <Home name={name}/>
      <AboutMe />
      <Projects />
      <Photography />
      <Footer />
    </>
  )
}

export default App;
