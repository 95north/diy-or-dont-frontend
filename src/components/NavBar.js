import React from 'react';
import { Route, Switch, withRouter, BrowserRouter as Router, Link } from 'react-router-dom';
import {connect} from 'react-redux';
// import { Link } from 'react-router';  Doesn't like this.
import './NavBar.css'


class NavBar extends React.Component{
    
    state={
        deleteInProgress: false
    }
    
    
    onDeleteClick = () =>{
        this.setState({deleteInProgress: true})
        console.log("DELETE")
    }
    
    hideDeleteForm = () => {
        this.setState({deleteInProgress: false})
    }
    
    render(){
        console.log("NavBar props: ", this.props)


        return(
            <div className="topnav" >
                {/* <button> Menu Icon </button> */}
                <span>  {this.props.user.username ? <span className="linear-wipeNav">  Hi {this.props.user.username}!  </span> : <Link to='/login'> Login </Link> } </span>
                <Link to='/home'>All Projects</Link>
                {this.props.user.user_id ? <Link to='/projects'>My Projects</Link> : null}
                {this.props.user.user_id ? <Link to='/mytoolbox'>My Toolbox + Shopping List</Link>: null}


                {/* <button onClick={this.onDeleteClick} > DeleteFunc? </button> */}
                <div className="linear-wipeNav">
                    <div > DIY or Don't </div>
                </div>

                {/* <button  >  i do nothing! </button> */}
                {/* ......*~+  +~*   *~+  +~*   *~+  +~*   *~+  +~*   *~+  +~* */}
                <input type="text" onChange={((e)=> this.props.updateSearchTerm(e))} placeholder="Search All Projects"  name="allProjSearch"/>
                <span>  {this.props.user.username ? <button onClick={this.props.logOut} > Log Out </button>  : null } </span>

            </div>
        )
    }
}


    function mapDispatchToProps(dispatch){
        return({
            updateSearchTerm: (e)=> dispatch({
                type: "UPDATE_SEARCH_TERM",
                payload:({
                    formFieldName: e.target.name,
                    value:e.target.value
                }) 
            }),
        })
    }

    function mapStateToProps(state){
        return({
            userSupplies: state.userSupplies,
            user: state.user
        })
    }





export default connect(mapStateToProps, mapDispatchToProps)(NavBar);