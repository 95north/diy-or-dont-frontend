import React from 'react';
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
                <button> Menu Icon Here </button>
                <span> Username Here </span>
                <button onClick={this.onDeleteClick} > Delete Something ? </button>
           

                <button  >  Create a New Project </button>
                ......*~+  +~*   *~+  +~*   *~+  +~*   *~+  +~*   *~+  +~*
                <input type="text" placeholder="Search All Projects" />
            </div>
        )
    }



}
export default NavBar;