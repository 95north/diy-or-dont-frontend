import React from 'react';
import { Route, Switch, withRouter, BrowserRouter as Router, Link } from 'react-router-dom';
import './App.css';
import SignUp from './SignUp';
import LogIn from './components/LogIn.js';
import Home from './components/Home.js';
import ProjectContainer from './components/ProjectContainer';
import AllProjectContainer from './components/AllProjectContainer';
import NavBar from './components/NavBar';
// import NavBar from './NavBar.js'



class App extends React.Component {

  state={
    
  }




  

    componentDidMount() {
      let token = localStorage.getItem('token');
      console.log("Token in frontend App.js: ", token)
      console.log("Token === undefined?  ", token== "undefined")  // undefined FALSE "undefined" TRUE
      console.log("Token t/F: ", token ? "VERDAD" : "FALSO")

      if (token && (token != "undefined")) {
      fetch('http://localhost:3000/retrieve_user', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        Accepts: 'application/json',
        Authorization: `${token}`
        }
      })
        .then(resp => resp.json())
        .then(user => {
        this.setState({ user: user });
        //  this.props.history.push('/dogs');
        });
      }
    }
  

    signUpSubmit = (e, user) => {
      e.preventDefault();
      console.log('Sign Up User:', user);
      fetch('http://localhost:3000/signup', {
       method: 'POST',
       headers: {
        'Content-Type': 'application/json',
        Accepts: 'application/json'
       },
       body: JSON.stringify({
        user: {
         username: user.username,
         password:  user.password //'test'
        }
       })
      })
       .then(resp => resp.json())
       .then(data => {
        console.log('Response Data', data);
        localStorage.setItem('token', data.token);
        this.setState({ user: data.user });
       });
     };


     logInSubmit= (e, user) =>  {
      e.preventDefault();

      if (true) {
      fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accepts: 'application/json'
        },
        body: JSON.stringify({
          user: {
           username: user.username,
           password:  user.password //'test'
          }
        })
      })
          //   Authorization: `${token}`
          //   }
          // })
        .then(resp => resp.json())
        .then(user => {
          console.log('Response Data', user);
          localStorage.setItem('token', user.token);
          this.setState({ user: user.user });

          // REDIRECT TO HOME !!!!!!
          // store the JWT in session storage, 
          // dispatch another action that tells the session reducer we had a successful log in.
          // this.props.history.push('/dogs');
        });
      }
    }


  render(){

    return (

      // <div className="topnav">
      //     <NavBar onDeleteSubmit={this.onDeleteSubmit} ponies={this.state.ponies} />
      // </div>

      <Switch>



        <Route
            path="/signup"
            render={() => <SignUp submitHandler={this.signUpSubmit} />}
        />


        <Route
            path="/login"
            render={() => <LogIn submitHandler={this.logInSubmit} />}
        />


        <Route 
            path="/home" 
            render={() => 
              <React.Fragment>
                <NavBar />
                <AllProjectContainer />
              </React.Fragment>
            } 
        />


        <Route
            path="/projects" 
            // component={NavBar}
            // component={ProjectContainer}
            render={() => 
              <React.Fragment>
                <NavBar />
                <ProjectContainer />
              </React.Fragment>
            }
        />


        <Route 
            // Display on all pages. If @ top, doesn't hit more specific page
            path="/" 
            component={NavBar} 
        />


      </Switch>
    );
  }



}
export default withRouter(App);
