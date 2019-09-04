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
                <span> {this.props.user.username ? `Hi ${this.props.user.username}` : <Link to='/login'> Login </Link> } </span>
                <Link to='/home'>All Projects</Link>
                <Link to='/projects'>My Projects</Link>
                <Link to='/mytoolbox'>My Toolbox</Link>


                <button onClick={this.onDeleteClick} > DeleteFunc? </button>
           

                {/* <button  >  i do nothing! </button> */}
                {/* ......*~+  +~*   *~+  +~*   *~+  +~*   *~+  +~*   *~+  +~* */}
                <input type="text" onChange={((e)=> this.props.updateSearchTerm(e))} placeholder="Search All Projects"  name="allProjSearch"/>
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