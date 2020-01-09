import React from 'react';
import { Route , withRouter, Redirect} from 'react-router-dom';
import { browserHistory } from 'react-router';
import {connect} from 'react-redux';
import './Sidebar.css'
import './ToolContainer.css'
import ToolboxDisplay from './ToolboxDisplay.js';
import ShoppingList from './ShoppingList.js';


class NewReviewContainer extends React.Component{
    state = {
    }



    componentDidMount(){
        
        if (this.props.user.user_id !== "undefined" && this.props.user.user_id > 0 && this.props.user.user_id !== undefined){
            fetch(`http://localhost:3000/projects/${this.props.user.user_id}`)              
            .then( res => {
                return res.json() 
            })
            .then( projectsData => {
                let rawDataCopy = [...projectsData]
                rawDataCopy.pop()            
                this.setState({
                    projects: rawDataCopy,
                    userSupplies: projectsData[projectsData.length-1][0], 
                    relevantSupplyObjs: projectsData[projectsData.length-1][1] 
                })  

                this.props.addUserAppDataToStore({ 
                    projects: rawDataCopy,
                    userSupplies: projectsData[projectsData.length-1][0], 
                    relevantSupplyObjs: projectsData[projectsData.length-1][1]

                });
            })
        } else {
            return <Redirect to="/login" />
        }
    }

    changeHandler = (event)=>{
        let inputName = event.target.name
        console.log("inputName", inputName)
        this.setState(
            {[inputName]: event.target.value}
        )
    }



    render(){
        if (this.props.userSupplies.userSupplies !== "undefined" && this.props.userSupplies.userSupplies !== [] && this.props.userSupplies.userSupplies !== undefined){
            return(
                <> 
                    <div className="toolboxContainer">                                  
                    <ShoppingList triggerReRender={this.triggerReRender}/>
                    <ToolboxDisplay triggerReRender={this.triggerReRender}/>
                    <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/>
                    <p></p> <p></p> <p></p> <p></p> <p></p> <p></p> <p></p>
                    </div>
                </>
            )
        } else {
            return (
                null
            )
        }
    }
}



function mapDispatchToProps(dispatch){
    return({        
        addUserAppDataToStore: (projectsUserSuppliesAndUserSupplyObjs)=> dispatch(
            {type: "ADD_USER_APP_DATA",
            payload: projectsUserSuppliesAndUserSupplyObjs
        }),
        addNeedTool: ()=> dispatch({type: "ADD_TOOL_NEED"}),
        unNeedTool: ()=> dispatch({type: "UN_NEED_TOOL"})
    })
}


function mapStateToProps(state){
    return({
        userSupplies: state.userSupplies,
        user: state.user
    })
}


export default connect(mapStateToProps, mapDispatchToProps)(NewReviewContainer);