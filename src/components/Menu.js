import React from 'react';
import './NavBar.css'


class Menu extends React.Component{
    
    state={
        deleteInProgress: false
    }
    
    
    // onDeleteClick = () =>{
    //     this.setState({deleteInProgress: true})
    //     console.log("DELETE")
    // }
    
    // hideDeleteForm = () => {
    //     this.setState({deleteInProgress: false})
    // }
    
    render(){

        return(
            <div className="menu" className={(true)? "hideElement" : "displayElement"} >
                <Link to="/">Home</Link>
                <Link to="/">My Projects</Link>
                <Link to="/">My Shopping List</Link>
                <Link to="/">My ToolBox</Link>
                <Link to="/">Browse All Projects</Link>

                <Link to="/">Logout</Link>
            </div>
        )
    }



}
export default Menu;