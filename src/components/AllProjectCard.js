import React from 'react';
import  './Card.css'
import  './Tooltip.css'
import {connect} from 'react-redux';
import ReviewContainer from './ReviewContainer.js'
import { tsObjectKeyword, throwStatement, thisExpression } from '@babel/types';
import { timingSafeEqual } from 'crypto';


class AllProjectCard extends React.Component{
    state ={
        addToProjectsCheckbox: false, 

        displayReviews: false  
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
                rArr.push(<li className="rounded" style={{opacity: "1"}}><b> {tool.name} </b></li>)
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

        if (this.props.userProjects && inToolbox){
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
        } else if (this.props.userProjects && !inToolbox){    
            
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

        } else {                // if not logged in
            return(<li> 
                <span
                    class="tooltip"
                > 
                <span class="tooltiptext">Please login first :) </span> 
                Add to My Toolbox : 
                <input 
                    type="checkbox" 
                    name="addToMyToolbox" 
                    value={"toolboxID"+toolId} 
                    disabled                 
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

        if (this.props.userProjects && inShoppingList) {
            
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

        } else if(this.props.userProjects && !inShoppingList){    
                    
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

        } else {        // if not logged in
            return(<li> 
                <span
                    class="tooltip"
                > 
                <span class="tooltiptext">Please login first :) </span> 
                Add to Shopping List : 
                <input 
                    type="checkbox" 
                    name="addToMyShoppingList" 
                    value={"shoppinID"+toolId} 
                    disabled
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
            })
        }
    }



    handleAddToMyProjectsCheckboxChange = (e) =>{
        e.target.disabled=true;
        this.setState({ addToProjectsCheckbox: e.target.checked })
        if (this.props.user.user_id === undefined || this.props.user.user_id === "undefined" ){
            alert("Login!")
        } else {

            fetch(`http://localhost:3000/newuserproject`, {
                headers: { "Content-Type": "application/json; charset=utf-8",
                    Accepts: 'application/json'
                 },
                method: 'POST',
                body: JSON.stringify({
                    user_id: this.props.user.user_id,
                    project_id: this.props.project[0].id  // GET FROM  THE PROJECT CARD.

                
                })
            }).then(res => res.json() )
            .then(postResp => {
            })
        }
    }



    checkIfUserHasProject = (projectId)=>{   
        console.log("this.props.userProjects :", this.props.userProjects)
        if (this.props.userProjects){
            let returnVal = false
            this.props.userProjects.forEach(function(proj){
                console.log("Proj ---", proj)
                console.log("Proj ---", proj[3]["id"])
                console.log("Proj Id ---", projectId)

                if (proj[3]["id"] === projectId){
                    returnVal = true
                }
            })
            return returnVal;
        } else {
            return false
        }
    }



    renderAddToMyProjectsCheckbox = (projectId)=>{
        if (this.props.userProjects){
            let returnVal = false
            this.props.userProjects.forEach(function(proj){
                if (proj[3]["id"] === projectId){
                    returnVal = true
                } 
            })  

            if (returnVal===true){
                return(
                    <span> Already In Your Projects: 
                    <input type="checkbox" 
                        name="addToMyProjects" 
                        value={"projectID"+projectId} 
                        defaultChecked={true} 
                        disabled
                    /> 
                </span>
                )
            } else {         
                return(
                <span>
                        Add to My Projects: 
                        <input type="checkbox" 
                            name="addToMyProjects" 
                            value={"projectID"+projectId} 
                            defaultChecked={false} 
                            //disabled={isDisabled ? "disabled" : false}
                            onChange={((e)=>this.handleAddToMyProjectsCheckboxChange(e))}
                        /> 
                </span>
                )
            }            
        } else {            // If not logged in
            return (
                <span
                    class="tooltip"
                > 
                <span class="tooltiptext">Please login first :) </span>                
                Add to My Projects: 
                    <input type="checkbox" 
                        name="addToMyProjects" 
                        value={"projectID"+projectId} 
                        defaultChecked={false} 
                        onChange={((e)=>this.handleAddToMyProjectsCheckboxChange(e))} 
                    /> 
                </span>
            )
        }
    }


    render(){
        let project = this.props.project
        let inProjectsCheckbox = this.renderAddToMyProjectsCheckbox(project[0].id)

        return(
            <div className="card">
                <h3> {project[0].name}</h3>
                <span> Average Difficulty Rating: {project.avgDifficulty ? project.avgDifficulty : "Add to Your Projects to be the First to Review!" } </span><br/>
                <span> Average Fun Rating: {project.avgFun ? project.avgFun : "N/A" } </span><br/>
                <span> Avg Hours To Complete: {project.avgTime ? project.avgTime : "N/A" } </span><br/>
                <span> Total Reviews: {project.ratingsCount ? project.ratingsCount : "N/A" } </span><br/><br/>
                <div> Tools Required: <br/>
                    <div className="cardList">
                        
                    <ul className="toolsUl">
                    {this.renderToolLIs(project[2], project[0].name, project[0]["id"])}
                    </ul>
                    </div>
                </div><br/>

                <button
                    type="button"
                    value="Show Reviews Button"
                    onClick={((e)=>this.props.activeProjectIdAddToStore(e, project[0].id))} 
                > Show Reviews </button> 


                <br/>
                {inProjectsCheckbox}                
            </div>

        )
    }



}


function mapDispatchToProps(dispatch){
    return({        
        activeProjectIdAddToStore: (e, projectId)=> dispatch(
            {type: "UPDATE_ACTIVE_PROJECT_ID",
            payload: projectId
        }),

    })
}


function mapStateToProps(state){
      return({
          user: state.user,
          userSupplies: state.userSupplies.userSupplies,
          userProjects: state.userSupplies.projects
      })
  }
  

export default connect(mapStateToProps, mapDispatchToProps)(AllProjectCard);
