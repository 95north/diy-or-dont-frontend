import React from 'react';
import { Route, Switch, withRouter, BrowserRouter as Router, Redirect, Link } from 'react-router-dom';
import './App.css';
import './components/Sidebar.css';
import SignUp from './SignUp';
import LogIn from './components/LogIn.js';
import Home from './components/Home.js';
import ProjectContainer from './components/ProjectContainer';
import AllProjectContainer from './components/AllProjectContainer';
import NewProjectForm from './components/NewProjectForm';
import ToolContainer from './components/ToolContainer';
import NavBar from './components/NavBar';
import {connect} from 'react-redux';



class App extends React.Component {

  state={
    user_token: null,     // refactoring to put to Store
    user_id: null,         // refactoring to put to Store
    appstateLOLOLO : null
    
  }




    componentDidMount() {
      let token = localStorage.getItem('token');
      console.log("Token in frontend App.js: ", token)
      console.log("Token === undefined?  ", token== "undefined")  // undefined FALSE "undefined" TRUE

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
        });
      }


    }  // end componentDidMount
  



    signUpSubmit = (e, user) => {
      e.preventDefault();
      fetch('http://localhost:3000/signup', {
       method: 'POST',
       headers: {
        'Content-Type': 'application/json',
        Accepts: 'application/json'
       },
       body: JSON.stringify({
        user: {
         username: user.username,
         password:  user.password 
        }
       })
      })
       .then(resp => resp.json())
       .then(data => {
        localStorage.setItem('token', data.token);
        this.setState({ user: data.user });
        alert("Creation successful. Please log in.")
        this.props.history.push('/login'); 
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
        .then(resp => resp.json())
        .then(user => {
          localStorage.setItem('token', user.token);

          this.setState({ user_token: user.token,
          user_id: user.user_id});

          this.props.loggedInAddIdToStore({ user_token: user.token,
            user_id: user.user_id,
            username: user.user_name,
            location: user.user_location,
          
          });
          this.props.history.push('/home');  
        });  
      }
    }

    logOut = (e, user) =>{
      localStorage.clear();
      this.setState({ user: null });
      this.props.logOutRemoveFromStore({ 
      });
      this.props.history.push('/login');
    }


  render(){

    return (

      
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
                <NavBar 
                  logOut={this.logOut}
                />
                <AllProjectContainer />
              </React.Fragment>
            } 
        />


        <Route
            path="/projects" 
            render={() => 
              <React.Fragment>
                <NavBar 
                  logOut={this.logOut}
                />
                <ProjectContainer />
              </React.Fragment>
            }
        />


        <Route
            path="/mytoolbox" 
            render={() => 
              <React.Fragment>
                <NavBar 
                    logOut={this.logOut}
                />
                <ToolContainer />
              </React.Fragment>
            }
        />  

        <Route
            path="/createproject" 
            render={() => 
              <React.Fragment>
                <NavBar 
                  logOut={this.logOut}
                />
                <NewProjectForm />
              </React.Fragment>
            }
        />  

        <Route 
            path="/" 
            component={NavBar} 
        />


      </Switch>

    );
  }
} // end class





  function mapDispatchToProps(dispatch){
    return({
        addUserAppDataToStore: (projectsUserSuppliesAndUserSupplyObjs)=> dispatch(
          {type: "ADD_USER_APP_DATA",
          payload: projectsUserSuppliesAndUserSupplyObjs
        }),
        loggedInAddIdToStore: (userinfo)=> dispatch(
          {type: "LOGGED_IN",
          payload: userinfo    
        }),
        logOutRemoveFromStore: ()=> dispatch(
          {type: "LOGGED_OUT"}
        )

    })
}


function mapStateToProps(state){
 
    return({
        user: state.user,
    })
}






export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
