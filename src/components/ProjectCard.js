import React from 'react';
import  './Card.css'

class ProjectCard extends React.Component{


    render(){

        return(
            <div className="card">
                <h3> {this.props.project.name}</h3>
                <p> Difficulty: </p>
                <p> Time: </p>
                <img className="projectpic" src={this.props.project.image} alt="A project" />
                <p> User Notes: </p>
                <p> Date Added: </p>
                <p> Tools Needed: </p>
                <h3> {this.props.project.overview}</h3>  <br/>
                <h4> Status:  {this.props.project.status}</h4>
                <button onClick={((e)=>this.props.onEditClickHandler(e, this.props.project))} > Edit </button>
            </div>

        )
    }



}
export default ProjectCard;