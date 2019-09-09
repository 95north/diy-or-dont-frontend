import React from 'react';
import { Route , withRouter, Redirect} from 'react-router-dom';
import { browserHistory } from 'react-router';
import {connect} from 'react-redux';
import './Sidebar.css'
import ToolboxDisplay from './ToolboxDisplay.js';
import ShoppingList from './ShoppingList.js';


class NewReviewContainer extends React.Component{
    state = {
        // arbitraryReRender: ""
    }



    componentDidMount(){
        console.log("in TOOL Cont, props.user is : ", this.props.user)
        
        if (this.props.user.user_id !== "undefined" && this.props.user.user_id > 0 && this.props.user.user_id !== undefined){
            fetch(`http://localhost:3000/projects/${this.props.user.user_id}`)              
            .then( res => {
                console.log("TOOL Container json fetch resp: ", res)
                return res.json() 
            })
            .then( projectsData => {
                console.log("TOOL Container json fetch resp: ", projectsData)
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
            // ^^Source:   https://scotch.io/courses/using-react-router-4/authentication-with-redirect
            // this.props.history.push('/login')  Need to pass down history to use
        }
    }

    changeHandler = (event)=>{
        // console.log("in change handler", event.target.value)
        let inputName = event.target.name
        console.log("inputName", inputName)
        this.setState(
            {[inputName]: event.target.value}
        )
    }


    // triggerReRender =()=>{     //GETS CALLED BUT DOESN'T TRIGGER RE-RENDER
    //     console.log("ARBITRARY RE RENDER  ARBITRARY RE RENDER  ARBITRARY RE RENDER ")
    //     this.setState({arbitraryReRender: Math.random()})
    // }




    render(){
        console.log("props in ToolContainer ", this.props)
        if (this.props.userSupplies.userSupplies !== "undefined" && this.props.userSupplies.userSupplies !== [] && this.props.userSupplies.userSupplies !== undefined){
            return(
                <> 
                    ~*+ Tool Display +*~
                    <ShoppingList triggerReRender={this.triggerReRender}/>
                    <ToolboxDisplay triggerReRender={this.triggerReRender}/>
                    <br/>
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