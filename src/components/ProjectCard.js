import React from 'react';
import  './Card.css'

class ProjectCard extends React.Component{
    
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
                <button onClick={((e)=>this.props.onEditClickHandler(e, this.props.project))} > Leave Review  OR Edit Your Review </button>
                <button onClick={console.log("DELETE CLICK")} > Delete from Your Projects</button>
            </div>

        )
    }



}
export default ProjectCard;