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

        displayReviews: false  // Orig 
    }




    renderToolLIs = (toolObjsArr, projectName, projectId) =>{

        // console.log("props in allProjectCAarD: ", this.props)
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
                // console.log("ALLPROJECTCARD tool is -- ", tool)
                // console.log(" ALLPROJECTCARD  toolbox.includes(tool.id)", toolbox.includes(tool.id))

                rArr.push(<li className="rounded"><b> {tool.name} </b></li>)
                rArr.push(this.generateAddToToolboxCheckbox(toolbox, tool.id, projectName, projectId) )
                rArr.push(this.generateAddToShoppingListCheckbox(shoppingList, tool.id, projectName, projectId) )

                // rArr.push(<li> 
                //     <span> {shoppingList.includes(tool.id) ? 
                //     "In Your Shopping List" : "Add to Shopping List"} : 
                //     <input 
                //         type="checkbox" 
                //         name="addToMyShoppingList" 
                //         value={"shoppinID"+tool.id} 
                //         defaultChecked={shoppingList.includes(tool.id)} 
                //         onChange={((e)=>this.handleAddToShoppingListCheckboxChange(e, projectName))} 
                //     /> 
                //     </span>
                // </li>)

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
                        //defaultChecked={toolbox.includes(toolId)}
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
                    // defaultChecked={toolbox.includes(toolId)}
                    disabled
                    // onChange={((e)=>this.handleAddToToolboxCheckboxChange(e, projectName))} 
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
                    // onClick="this.disabled=true"
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
                // console.log(postResp)
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
                // console.log(postResp)
            })
        }
    }



    handleAddToMyProjectsCheckboxChange = (e) =>{
        e.target.disabled=true;
        // console.log('card props - ', this.props)
        this.setState({ addToProjectsCheckbox: e.target.checked })
        // console.log("this.props.user.user_id, ", this.props.user.user_id)
        // console.log("this.props.project[0].id , ", this.props.project[0].id )
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
                // console.log(postResp)
            })
        }
    }


    // toggleDisplayReviewsState = () => {    // NOT CURRENTLY BEING USED
    //     // BEFORE REFACTOR, THOUGHT ABOUT:  if (this.state.displayReviews !== this.props.project[0].id)

    //     // Refactor attempt  @ 5PM Monday:
    //     this.setState({displayReviews: this.props.project[0].id})
    //     // console.log("toggled state on READ REVIEWS, id is--", this.props.project[0].id)

    //     //Orig:  branch addNewProjAddNewTool
    //     // console.log("toggled state on READ REVIEWS")
    //     // this.setState({displayReviews: !this.state.displayReviews})
    // }

    checkIfUserHasProject = (projectId)=>{   // REFACTORED, NOT USING!
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
        // console.log("this.props.userProjects :", this.props.userProjects)
        if (this.props.userProjects){
            let returnVal = false
            this.props.userProjects.forEach(function(proj){
                // console.log("Proj ---", proj)
                // console.log("Proj ---", proj[3]["id"])
                // console.log("Proj Id ---", projectId)

                if (proj[3]["id"] === projectId){
                    returnVal = true
                } 
            })  // end forEach

            if (returnVal===true){
                return(
                    <span> Already In Your Projects: 
                    <input type="checkbox" 
                        name="addToMyProjects" 
                        value={"projectID"+projectId} 
                        //defaultChecked={false} 
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
                            //defaultChecked={false} 
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
                        //defaultChecked={false} 
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
        // console.log("ALLPROJ CARD - One General Project details: ", project[0].id)

        return(
            <div className="card">
                <h3> {project[0].name}</h3>
                <span> Average Difficulty Rating: {project.avgDifficulty ? project.avgDifficulty : "Add to Your Projects to be the First to Review!" } </span><br/>
                <span> Average Fun Rating: {project.avgFun ? project.avgFun : "N/A" } </span><br/>
                <span> Avg Hours To Complete: {project.avgTime ? project.avgTime : "N/A" } </span><br/>
                <span> Total Reviews: {project.ratingsCount ? project.ratingsCount : "N/A" } </span><br/><br/>
                <div> Tools Required: <br/>
                    <div className="yo">
                    <ul>
                    {this.renderToolLIs(project[2], project[0].name, project[0]["id"])}
                    </ul>
                    </div>
                </div><br/>



                {/* <label for="clicker" id="expand-btn"> Read Reviews? </label> */}
                {/* <input type="hidden" id="clicker" type="checkbox" onClick={this.toggleDisplayReviewsState}></input> */}
                {/* <button className="" onClick={this.toggleDisplayReviewsState}> Show Reviews </button><br/> */}
                {/* { this.state.displayReviews ? <ReviewContainer/> : null } */}
            
                

                {/* BELOW- using This (not parent) component's:  toggleDisplayReviewsState} */}


                {/* <input id="clicker" type="checkbox" onClick={(()=>this.props.toggleReviewToDisplay(project[0].id))}/>
                <label for="clicker">Show Reviews</label> */}

                {/* Original Way:  */}

                {/* <input id="clicker" type="checkbox" onClick={this.toggleDisplayReviewsState} checked={this.props.displayReviewFlag}/> */}
               
                {/* <input id="displayOneProjectReviewsCheckbox" 
                        type="checkbox" 
                        onClick={((e)=>this.props.toggleReviewToDisplay(project[0].id))} 
                />        
                <label for="displayOneProjectReviewsCheckbox">Show Reviews</label>
                */}

                <button
                    type="button"
                    value="Show Reviews Button"
                    onClick={((e)=>this.props.activeProjectIdAddToStore(e, project[0].id))} 
                    //onClick={((e)=>this.props.toggleReviewToDisplay(project[0].id))} 
                > Show Reviews </button> 


                <br/>

                {inProjectsCheckbox}
                {/*    REFACTORED checkIfUserHasProject, not using this!             
                <span> {this.state.addToProjectsCheckbox ? 
                    "Already In Your Projects" : "Add to My Projects"}: 
                    <input type="checkbox" 
                        name="addToMyProjects" 
                        value={"projectID"+project[0].id} 
                        //defaultChecked={false} 
                        defaultChecked={this.checkIfUserHasProject(project[0].id)} 
                        //disabled={isDisabled ? "disabled" : false}
                        onChange={((e)=>this.handleAddToMyProjectsCheckboxChange(e))} 
                    /> 
                </span><br/> */}
                
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
    // console.log("state argument in MSP in aPP: ", state)  An empty obj.
    // console.log("Called mapStateToPRops! ")   CORRECT, this gets called!
      return({
          user: state.user,
          userSupplies: state.userSupplies.userSupplies,
          userProjects: state.userSupplies.projects
      })
  }
  

export default connect(mapStateToProps, mapDispatchToProps)(AllProjectCard);
