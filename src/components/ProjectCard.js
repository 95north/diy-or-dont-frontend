import React from 'react';
import NewReviewForm from './NewReviewForm'

import {connect} from 'react-redux';


import  './Card.css'

class ProjectCard extends React.Component{
    state ={
    }


    renderToolLIs = (toolObjsArr, projectName, projectId) =>{

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
            toolObjsArr.map( tool =>{           
                rArr.push(<li><b> {tool.name} </b></li>)
                rArr.push(this.generateAddToToolboxCheckbox(toolbox, tool.id, projectName, projectId) )
                rArr.push(this.generateAddToShoppingListCheckbox(shoppingList, tool.id, projectName, projectId) )
            })
            return rArr
        } else {
            return <li>No Tools Listed</li>
        }
    }  



    generateAddToToolboxCheckbox =(toolbox, toolId, projectName, projectId)=>{
        let inToolbox= false;
        
        if(toolbox.includes(toolId)){
            inToolbox= true
        } 

        if ( inToolbox){
            return(<li> 
                <span> 
                In Your Toolbox!: 
                <input 
                    type="checkbox" 
                    name="addToMyToolbox" 
                    value={"toolboxID"+toolId} 
                    defaultChecked="true"
                    disabled
                /> 
                </span>
            </li>)
        } else if ( !inToolbox){    
            
                return(<li> 
                    <span> Add to My Toolbox : 
                    <input 
                        type="checkbox" 
                        name="addToMyToolbox" 
                        value={"toolboxID"+toolId} 
                        onChange={((e)=>this.handleAddToToolboxCheckboxChange(e, projectName, projectId))} 
                    /> 
                    </span>
                </li>) 

        } 
    }


    generateAddToShoppingListCheckbox =(shoppingList, toolId, projectName, projectId)=>{
        let inShoppingList = false;
        
        if(shoppingList.includes(toolId)){
            inShoppingList= true
        } 

        if (inShoppingList) {
            
            return(<li> 
                <span> 
                In Your Shopping List : 
                <input 
                    type="checkbox" 
                    name="addToMyShoppingList" 
                    value={"shoppinID"+toolId} 
                    disabled
                    defaultChecked={inShoppingList} 
                /> 
                </span>
            </li>)

        } else if(!inShoppingList){    
                    
            return(<li> 
                <span> 
                Add To Shopping List : 
                <input 
                    type="checkbox" 
                    name="addToMyShoppingList" 
                    value={"shoppinID"+toolId} 
                    defaultChecked={inShoppingList}
                    onChange={((e)=>this.handleAddToShoppingListCheckboxChange(e, projectName, projectId))} 
                /> 
                </span>
            </li>)

        }
    }





    handleAddToToolboxCheckboxChange = (e, projectName, projectId) =>{
        e.target.disabled=true;

        let postbody={
            userId: this.props.user.user_id,
            supplyId: parseInt(e.target.value.slice(9, e.target.value.length)),
            intoolbox: "true",
            project_name: projectName,
            project_id: projectId
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



    handleAddToShoppingListCheckboxChange = (e, projectName, projectId) =>{
        e.target.disabled=true;

        let postbody={
            userId: this.props.user.user_id,
            supplyId: parseInt(e.target.value.slice(9, e.target.value.length)),
            userneeds: "true",
            project_name: projectName,
            project_id: projectId
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
        }).then(res => {
            this.props.onDeleteUserProjectClick(userProjectIdToDelete);
            return res.json() 
        })
        .then(postResp => {
            console.log("deleteFromMyProjectsClick  ", postResp)
        })
    }



    render(){
        let project = this.props.project

        return(
            <div className="card">
                <h3> {project[3].name}</h3> <br/>
                <div>  User Notes: {project[2].usernote}</div> <br/>
                <div>  Date Added: {project[2].created_at.slice(0, 10)} </div><br/>


                <div> <b> Tools Required: </b> </div>
                <ul>{this.renderToolLIs(project[4], project[3].name, project[3].id )}</ul>
                
                <h3> {project[3].overview}</h3>  <br/>
                <div>  Status:  {project[2].status === "Completed" ? <span> Completed <input type="checkbox" name="completeProject" value="completed" defaultChecked={true} disabled/> </span>: project[2]["status"]}</div><br/>
                
                <button 
                    onClick={((e)=>this.props.activeReviewIdAddToStore(e, project[2].id))} > 
                    Leave Review  OR Edit Your Review 
                </button>

                {/* <NewReviewContainer 
                    userProject_id={project[2].id} 
                    userProject_name={project[3].name}
                />  */}
                <NewReviewForm
                    userProject_id={project[2].id} 
                    userProject_name={project[3].name}
                /> 

                <br/>
                <br/>               
                <button onClick={(e)=>this.deleteFromMyProjectsClick(e, project[2].id)} > Delete from Your Projects</button>
            </div>

        )
    }



}



function mapDispatchToProps(dispatch){
    return({   
        deleteUserProject: (userProjectIdToDelete)=> dispatch(
            {type: "DELETE_USER_PROJECT",
            payload: userProjectIdToDelete
        }),
        activeReviewIdAddToStore: (e, projectId)=> dispatch(
            {type: "UPDATE_ACTIVE_REVIEW_ID",
            payload: projectId
        }),
    })
}


function mapStateToProps(state){
    return({
        userSupplies: state.userSupplies.userSupplies,
        user: state.user,
        activeReviewId: state.activeReviewId
    })
}


export default connect(mapStateToProps, mapDispatchToProps)(ProjectCard);