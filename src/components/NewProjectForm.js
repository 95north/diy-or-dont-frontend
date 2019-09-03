import React from 'react';
import  './Card.css'
import {connect} from 'react-redux';
import ReviewContainer from './ReviewContainer.js'


class NewProjectForm extends React.Component{
    state ={
        // // Supplies Table: 
        // t.string "name"
        // t.string "description"
        // t.string "image"


        // // Project_supplies Table: 
        // t.integer "quantity"
        // t.string "note"
        // t.boolean "mandatory"
        // t.bigint "supply_id"
        // t.bigint "project_id"


        // // Projects table
        // t.string "name"
        // t.string "overview"
        // t.string "description"
        // t.string "image"

        allSupplies: [],
        newProjectName: "",
        newProjectOverview: "",
        newProjectDescription: "",
        toolCounter: 1
    }


    componentDidMount = () =>{
    // fetchAllTools = () =>{
        fetch(`http://localhost:3000/supplies`, {
                headers: { "Content-Type": "application/json; charset=utf-8",
                    Accepts: 'application/json'
                 },
                method: 'GET',
            }).then(res => res.json() )
            .then(supplyList => {
                this.setState({allSupplies: supplyList})
            })
    }


    changeHandler = (event)=>{
        // console.log("in change handler", event.target.value)
        let inputName = event.target.name
        console.log("inputName", inputName)
        this.setState(
            {[inputName]: event.target.value}
        )
    }


    //refactor to render tool Options. 
    renderSupplySelectOptions = () =>{
        let rArr = [];
        this.state.allSupplies.forEach( tool =>{          
            rArr.push(<option value={tool.id}> {tool.name} </option>)
        })
        return(<select name={"NewProjTool" + this.state.toolCounter} >{rArr}</select> )
    }


    handleAddToMyProjectsCheckboxChange = (e) =>{
        console.log('card props - ', this.props)
        this.setState({ addToProjectsCheckbox: e.target.checked })
        console.log("this.props.user.user_id, ", this.props.user.user_id)
        console.log("this.props.project[0].id , ", this.props.project[0].id )
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



    render(){
        let project = this.props.project

        return(
            <div className="card">
                <h3> {project[0].name}</h3>
                <span> Average Difficulty Rating: {project.avgDifficulty} </span><br/>
                <span> Average Fun Rating: {project.avgFun} </span><br/>
                <span> Avg Hours To Complete: {project.avgTime} </span><br/>
                <span> Total Reviews: {project.ratingsCount} </span><br/>
                <div> Tools Required: Pull from store if logged in and check off if user has? <br/>

                    {this.renderSupplySelectOptions()}

                </div><br/>

                <input id="clicker" type="checkbox" onClick={this.toggleDisplayReviewsState}/>
                <label for="clicker">Show Reviews</label>

                <ReviewContainer displayReviews={this.state.displayReviews} project_id={project[0].id}/> 

                <br/>
                <span> {this.state.addToProjectsCheckbox ? "Already In Your Projects" : "Add to My Projects"}: <input type="checkbox" name="addToMyProjects" value={"projectID"+project[0].id} defaultChecked={false} onChange={((e)=>this.handleAddToMyProjectsCheckboxChange(e))} /> </span><br/>
                

            </div>

        )
    }



}

function mapStateToProps(state){
      return({
          user: state.user

      })
  }
  

export default connect(mapStateToProps, null)(NewProjectForm);