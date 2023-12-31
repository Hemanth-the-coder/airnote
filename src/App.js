import logo from './logo.svg';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <>
   <Router>
   <Navbar/>
      <Switch>
        <Route exact path="/" ><Home/></Route>
        <Route exact path="/about"> <About/> </Route>
      </Switch>
    </Router>
    </>
 
  
  );
}

export default App;
