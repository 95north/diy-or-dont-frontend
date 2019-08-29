import React from 'react';
import ProjectCard from './ProjectCard.js'
import {connect} from 'react-redux';
import cloneDeep from 'lodash/cloneDeep'
import './Card.css'


class ProjectContainer extends React.Component{

// check user logged in (token) / get who user is.. 
// fetch all of user's projects.  (hardcode for now)
    state = {
        projects: [],
        userSupplies: [],
        relevantSupplyObjs: []

    }

    componentDidMount(){
        fetch("http://localhost:3000/projects/1")               // HARD CODED !!! 
        .then( res => res.json() )
        .then( projectsData => {
            let rawDataCopy = [...projectsData]
            rawDataCopy.pop()            
            this.setState({
                projects: rawDataCopy,
                userSupplies: projectsData[projectsData.length-1][0], 
                relevantSupplyObjs: projectsData[projectsData.length-1][1] 
            })  

        })
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

        console.log("State in MY projects Container", this.state)

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
        addNeedTool: ()=> dispatch({type: "ADD_TOOL_NEED"}),
        unNeedTool: ()=> dispatch({type: "UN_NEED_TOOL"})
    })
}


function mapStateToProps(state){
    return({
        userSupplies: state.userSupplies 
    })
}


export default connect(mapStateToProps, mapDispatchToProps)(ProjectContainer);