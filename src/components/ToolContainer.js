import React from 'react';
import { Route , withRouter, Redirect} from 'react-router-dom';
import { browserHistory } from 'react-router';
import {connect} from 'react-redux';
import './Sidebar.css'
import ToolboxDisplay from './ToolboxDisplay.js';
import ShoppingList from './ShoppingList.js';


class NewReviewContainer extends React.Component{
    state = {
    }


    changeHandler = (event)=>{
        // console.log("in change handler", event.target.value)
        let inputName = event.target.name
        console.log("inputName", inputName)
        this.setState(
            {[inputName]: event.target.value}
        )
    }





    render(){
        console.log("props in ToolContainer ", this.props)

        return(
            <> 
                ~*+ Tool Display +*~
                <ShoppingList />
                <ToolboxDisplay />
                <br/>
            </>
        )
    }
}



function mapDispatchToProps(dispatch){
    return({
        // addNeedTool: ()=> dispatch({type: "ADD_TOOL_NEED"}),
        // unNeedTool: ()=> dispatch({type: "UN_NEED_TOOL"})
    })
}


function mapStateToProps(state){
    return({
        userSupplies: state.userSupplies,
        user: state.user
    })
}


export default connect(mapStateToProps, mapDispatchToProps)(NewReviewContainer);