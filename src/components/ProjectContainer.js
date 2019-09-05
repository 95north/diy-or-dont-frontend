import React from 'react';
import ProjectCard from './ProjectCard.js'
import { Route , withRouter, Redirect} from 'react-router-dom';
import { browserHistory } from 'react-router';
import {connect} from 'react-redux';
// import cloneDeep from 'lodash/cloneDeep'
import './Card.css'


class ProjectContainer extends React.Component{

// check user logged in (token) / get who user is.. 
// fetch all of user's projects. 
    state = {
        projects: [],
        userSupplies: [],
        relevantSupplyObjs: []

    }

    componentDidMount(){
        // console.log("in ProjCont, props.user is : ", this.props.user.user_id)
        
        if (this.props.user.user_id !== "undefined" && this.props.user.user_id > 0 ){
            fetch(`http://localhost:3000/projects/${this.props.user.user_id}`)              
            .then( res => {
                console.log("PROJECt Container json fetch resp: ", res)
                return res.json() 
            })
            .then( projectsData => {
                console.log("PROJECt Container json fetch resp: ", projectsData)
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


    onEditClickHandler = () =>{
        console.log("Edit CLick")
    }



    render(){
        let projectCardsArr = this.state.projects.map( project => {
            return(
            <ProjectCard 
                project={project} 
                addNeedTool={this.props.addNeedTool}
                unNeedTool={this.props.unNeedTool}
                onEditClickHandler={this.onEditClickHandler}
            />
            )
        })


        return(
            <React.Fragment>

                <div className="thecontainer">
                    <h1> Your Projects: </h1>
                    <br></br>
                    {/* <div className={this.state.editInProgress ? "displayEdit" : "hideEdit" }> 
                        <EditForm onEditSubmitHandler={this.onEditSubmitHandler}   
                            onEditFormChangeHandler={this.onEditFormChangeHandler}
                            editPonyId={this.state.editPonyId} 
                            editPonyName={this.state.editPonyName} 
                            editPonyFavorite={this.state.editPonyFavorite} 
                            editPonyButt={this.state.editPonyButt} 
                            editPonyImage={this.state.editPonyImage} 
                        />
                    </div> */}
                    {projectCardsArr}
                </div>

            </React.Fragment>
    
        )
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


export default connect(mapStateToProps, mapDispatchToProps)(ProjectContainer);