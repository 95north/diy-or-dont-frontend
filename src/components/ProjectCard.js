import React from 'react';
import NewReviewContainer from './NewReviewContainer'
import {connect} from 'react-redux';

import  './Card.css'

class ProjectCard extends React.Component{
    state ={
        displayReviewForm: false,
    }


    toggleDisplayReviewsState = () => {
        console.log("toggled state on New / Edit A  REVIEW")
        this.setState({displayReviewForm: !this.state.displayReviewForm})
    }


    renderToolLIs = (toolObjsArr) =>{

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
                        onChange={((e)=>this.handleAddToToolboxCheckboxChange(e))} 
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
                        onChange={((e)=>this.handleAddToShoppingListCheckboxChange(e))} 
                    /> 
                    </span>
                </li>)
            })
            return rArr
        } else {
            return <li>No Tools Listed</li>
        }
    }


    handleAddToToolboxCheckboxChange = (e) =>{
        let postbody={
            userId: this.props.user.user_id,
            supplyId: parseInt(e.target.value.slice(9, e.target.value.length)),
            intoolbox: "true"
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


    handleAddToShoppingListCheckboxChange = (e) =>{
        let postbody={
            userId: this.props.user.user_id,
            supplyId: parseInt(e.target.value.slice(9, e.target.value.length)),
            userneeds: "true"
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





    render(){
        let project = this.props.project
        // console.log("MYYY PROJ CARD - One General Project details: ", project)


        return(
            <div className="card">
                <h3> {project[3].name}</h3>
                <img className="projectpic" src={this.props.project.image} alt="A project" />
                <p> User Notes: {project[2].usernote}</p>
                <p> Date Added: {project[2].created_at.slice(0, 10)} </p>


                <p> Tools Required: </p>
                <ul>{this.renderToolLIs(project[4])}</ul>
                
                <h3> {project[3].overview}</h3>  <br/>
                <p> Status:  {project[2].status === "Completed" ? <span> Completed <input type="checkbox" name="completeProject" value="completed" defaultChecked={true} /> </span>: project[2].status}</p>
                 {/* ^^^ Change so Edit form displays if user wants to complete */}


                <input id="clicker" type="checkbox" onClick={this.toggleDisplayReviewsState}/>
                <label for="clicker">Leave New Review  OR Edit Your Review </label>

                <NewReviewContainer 
                    displayReviewForm={this.state.displayReviewForm} 
                    userProject_id={project[2].id} 
                    userProject_name={project[3].name}
                /> 
                <br/>

                {/* <button 
                    onClick={((e)=>this.props.onEditClickHandler(e, this.props.project))} > 
                    Leave Review  OR Edit Your Review 
                </button> */}
               
                <button onClick={console.log("DELETE CLICK")} > Delete from Your Projects</button>
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