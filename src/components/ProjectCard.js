import React from 'react';
import NewReviewContainer from './NewReviewContainer'
import {connect} from 'react-redux';

import  './Card.css'

class ProjectCard extends React.Component{
    state ={
        displayReviewForm: false,
    }


    toggleDisplayReviewsState = () => {
        console.log("toggled state on New / Edit A  REVIEW, ", this.state.displayReviewForm)
        this.setState({displayReviewForm: !this.state.displayReviewForm})
    }


    renderToolLIs = (toolObjsArr, projectName) =>{

        let toolbox = []
        let shoppingList = []

        if (this.props.userSupplies){
            this.props.userSupplies.forEach(
                (s)=>{
                    if(s.userneeds ){
                        shoppingList.push(s.supply_id)
                    }
                    if (s.intoolbox){
                        toolbox.push(s.supply_id)
                    }
                }
            )
        }

        let rArr = [];
        if(toolObjsArr.length > 0){
            toolObjsArr.map( tool =>{           //refactor to Each or using Map functionality? 
                rArr.push(<li><b> {tool.name} </b></li>)

                rArr.push(<li> 
                    <span> {toolbox.includes(tool.id) ? 
                    "In Your Toolbox!" : "Add to My Toolbox"} : 
                    <input 
                        type="checkbox" 
                        name="addToMyToolbox" 
                        value={"toolboxID"+tool.id} 
                        defaultChecked={toolbox.includes(tool.id)} 
                        onChange={((e)=>this.handleAddToToolboxCheckboxChange(e, projectName))} 
                    /> 
                    </span>
                </li>)

                rArr.push(<li> 
                    <span> {shoppingList.includes(tool.id) ? 
                    "In Your Shopping List" : "Add to Shopping List"} : 
                    <input 
                        type="checkbox" 
                        name="addToMyShoppingList" 
                        value={"shoppinID"+tool.id} 
                        defaultChecked={shoppingList.includes(tool.id)} 
                        onChange={((e)=>this.handleAddToShoppingListCheckboxChange(e, projectName))} 
                    /> 
                    </span>
                </li>)
            })
            return rArr
        } else {
            return <li>No Tools Listed</li>
        }
    }


    handleAddToToolboxCheckboxChange = (e, projectName) =>{
        let postbody={
            userId: this.props.user.user_id,
            supplyId: parseInt(e.target.value.slice(9, e.target.value.length)),
            intoolbox: "true",
            project_name: projectName
        }
        if (this.props.user.user_id === undefined || this.props.user.user_id === "undefined" ){
            alert("Login!")
        } else {
            fetch('http://localhost:3000/addtomytoolbox', {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify(
                    postbody
                )
            }).then(res => res.json() )
            .then(postResp => {
                console.log(postResp)
            })
        }
    }



    handleAddToShoppingListCheckboxChange = (e, projectName) =>{
        let postbody={
            userId: this.props.user.user_id,
            supplyId: parseInt(e.target.value.slice(9, e.target.value.length)),
            userneeds: "true",
            project_name: projectName
        }
        if (this.props.user.user_id === undefined || this.props.user.user_id === "undefined" ){
            alert("Login!")
        } else {
            fetch('http://localhost:3000/add_to_shopping_list', {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify(
                    postbody
                )
            }).then(res => res.json() )
            .then(postResp => {
                console.log(postResp)
            })
        }
    }



    deleteFromMyProjectsClick = (e, userProjectIdToDelete) =>{
        e.preventDefault();

        fetch(`http://localhost:3000/user_projects/${userProjectIdToDelete}`, {
            method: 'DELETE',
            headers: { 
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                userProjectIdToDelete: userProjectIdToDelete 
            })
        }).then(res => res.json() )
        .then(postResp => {
            console.log(postResp)
        })
    }



    render(){
        let project = this.props.project
        // console.log("MYYY PROJ CARD - One General Project details: ", project)


        return(
            <div className="card">
                <h3> {project[3].name}</h3>
                <img className="projectpic" src={this.props.project.image} alt="A project" />
                <div>  User Notes: {project[2].usernote}</div> <br/>
                <div>  Date Added: {project[2].created_at.slice(0, 10)} </div><br/>


                <div> <b> Tools Required: </b> </div>
                <ul>{this.renderToolLIs(project[4], project[3].name)}</ul>
                
                <h3> {project[3].overview}</h3>  <br/>
                <div>  Status:  {project[2].status === "Completed" ? <span> Completed <input type="checkbox" name="completeProject" value="completed" defaultChecked={this.state.displayReviewForm} /> </span>: project[2].status}</div><br/>
                 {/* ^^^ Change so Edit form displays if user wants to complete */}


                <input id="clicker" type="checkbox" onClick={this.toggleDisplayReviewsState}/>
                <label for="clicker">Leave New Review  OR Edit Your Review </label>

                <NewReviewContainer 
                    displayReviewForm={this.state.displayReviewForm} 
                    userProject_id={project[2].id} 
                    userProject_name={project[3].name}
                    toggleDisplayReviewsState = {this.toggleDisplayReviewsState}
                /> 
                <br/>

                {/* <button 
                    onClick={((e)=>this.props.onEditClickHandler(e, this.props.project))} > 
                    Leave Review  OR Edit Your Review 
                </button> */}
               
                <button onClick={(e)=>this.deleteFromMyProjectsClick(e, project[2].id)} > Delete from Your Projects</button>
            </div>

        )
    }



}



function mapDispatchToProps(dispatch){
    return({        
    })
}


function mapStateToProps(state){
    return({
        userSupplies: state.userSupplies.userSupplies,
        user: state.user
    })
}


export default connect(mapStateToProps, mapDispatchToProps)(ProjectCard);