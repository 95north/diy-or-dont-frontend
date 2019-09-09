import React from 'react';
import  './Card.css'
import {connect} from 'react-redux';
import ReviewContainer from './ReviewContainer.js'


class AllProjectCard extends React.Component{
    state ={
        addToProjectsCheckbox: false, 

        displayReviews: false
    }




    renderToolLIs = (toolObjsArr, projectName) =>{

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
            projectName: projectName
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
            projectName: projectName
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



    handleAddToMyProjectsCheckboxChange = (e) =>{
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
            .then(postResp => console.log(postResp))
        }
    }


    toggleDisplayReviewsState = () => {
        this.setState({displayReviews: this.props.project[0].id})
        console.log("toggled state on READ REVIEWS, id is--", this.props.project[0].id)
    }


    render(){
        let project = this.props.project
        console.log("ALLPROJ CARD - One General Project details: ", project[0].id)

        return(
            <div className="card">
                <h3> {project[0].name}</h3>
                <span> Average Difficulty Rating: {project.avgDifficulty ? project.avgDifficulty : "Add to Your Projects to be the First to Review!" } </span><br/>
                <span> Average Fun Rating: {project.avgFun ? project.avgFun : "N/A" } </span><br/>
                <span> Avg Hours To Complete: {project.avgTime ? project.avgTime : "N/A" } </span><br/>
                <span> Total Reviews: {project.ratingsCount ? project.ratingsCount : "N/A" } </span><br/><br/>
                <div> Tools Required: <br/>
                    <ul>{this.renderToolLIs(project[2], project[0].name)}</ul>
                </div><br/>

                {/* <label for="clicker" id="expand-btn"> Read Reviews? </label> */}
                {/* <input type="hidden" id="clicker" type="checkbox" onClick={this.toggleDisplayReviewsState}></input> */}
                {/* <button className="" onClick={this.toggleDisplayReviewsState}> Show Reviews </button><br/> */}
                {/* { this.state.displayReviews ? <ReviewContainer/> : null } */}
            

                <input id="clicker" type="checkbox" onClick={this.toggleDisplayReviewsState}/>
                <label for="clicker">Show Reviews</label>

                <ReviewContainer displayReviews={this.state.displayReviews} project_id={project[0].id}/> 

                <br/>
                <span> {this.state.addToProjectsCheckbox ? "Already In Your Projects" : "Add to My Projects"}: <input type="checkbox" name="addToMyProjects" value={"projectID"+project[0].id} defaultChecked={false} onChange={((e)=>this.handleAddToMyProjectsCheckboxChange(e))} /> </span><br/>
                





                {/* <p> Difficulty: ??? Show Avg Rating, or User's Review Rating?  Or have link to see Project Info (show pg / 1 card), that has avg. </p>
                <p> Time: ??? ^^^ </p>
                <img className="projectpic" src={this.props.project.image} alt="A project" />
                <p> User Notes: {project[2].usernote}</p>
                <p> Date Added: {project[2].created_at.slice(0, 10)} </p>
                <p> Tools Needed: How work? Check tools in user toolbox? Say either "Have" or "Add to Toolbox" ? Or they check off for each one?</p>
                <h3> {project[3].overview}</h3>  <br/>
                <p> Status:  {project[2].status === "Completed" ? <span> Completed <input type="checkbox" name="completeProject" value="completed" checked={true} /> </span>: project[2].status}</p> */}

                {/* <button onClick={((e)=>this.props.onEditClickHandler(e, this.props.project))} > Edit Reviews </button><br/> */}
                {/* <button onClick={console.log("DELETE CLICK")} > Delete from Your Projects</button> */}            
            </div>

        )
    }



}



function mapStateToProps(state){
    // console.log("state argument in MSP in aPP: ", state)  An empty obj.
    // console.log("Called mapStateToPRops! ")   CORRECT, this gets called!
      return({
          user: state.user,
          userSupplies: state.userSupplies.userSupplies
      })
  }
  

export default connect(mapStateToProps, null)(AllProjectCard);
