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

    render(){
        let project = this.props.project

        return(
            <div className="card">
                <h3> {project[3].name}</h3>
                <p> Difficulty: ??? Show Avg Rating, or User's Review Rating?  Or have link to see Project Info (show pg / 1 card), that has avg. </p>
                <p> Time: ??? ^^^ </p>
                <img className="projectpic" src={this.props.project.image} alt="A project" />
                <p> User Notes: {project[2].usernote}</p>
                <p> Date Added: {project[2].created_at.slice(0, 10)} </p>
                <p> Tools Needed: How work? Check tools in user toolbox? Say either "Have" or "Add to Toolbox" ? Or they check off for each one?</p>
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
        userSupplies: state.userSupplies,
        user: state.user
    })
}


export default connect(mapStateToProps, mapDispatchToProps)(ProjectCard);