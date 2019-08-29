import React from 'react';
import  './Card.css'

class AllProjectCard extends React.Component{

    renderToolLIs = (toolObjsArr) =>{
        let rArr = [];
        if(toolObjsArr.length > 0){
            toolObjsArr.map( tool =>{           //refactor to Each or using Map functionality? 
                rArr.push(<li> {tool.name} </li>)
            })
            return rArr
        } else {
            return <li>No Tools Listed</li>
        }
    }



    render(){
        let project = this.props.project
        console.log("One General Project details: ", project)

        return(
            <div className="card">
                <h3> {project[0].name}</h3>
                <span> Average Difficulty Rating: {project.avgDifficulty} </span><br/>
                <span> Average Fun Rating: {project.avgFun} </span><br/>
                <span> Avg Hours To Complete: {project.avgTime} </span><br/>
                <span> Total Reviews: {project.ratingsCount} </span><br/>
                <div> Tools Required: Pull from store if logged in and check off if user has? <br/>
                    <ul>{this.renderToolLIs(project[2])}</ul>
                </div><br/>

                {/* <p> Difficulty: ??? Show Avg Rating, or User's Review Rating?  Or have link to see Project Info (show pg / 1 card), that has avg. </p>
                <p> Time: ??? ^^^ </p>
                <img className="projectpic" src={this.props.project.image} alt="A project" />
                <p> User Notes: {project[2].usernote}</p>
                <p> Date Added: {project[2].created_at.slice(0, 10)} </p>
                <p> Tools Needed: How work? Check tools in user toolbox? Say either "Have" or "Add to Toolbox" ? Or they check off for each one?</p>
                <h3> {project[3].overview}</h3>  <br/>
                <p> Status:  {project[2].status === "Completed" ? <span> Completed <input type="checkbox" name="completeProject" value="completed" checked={true} /> </span>: project[2].status}</p> */}
                <button onClick={((e)=>this.props.onEditClickHandler(e, this.props.project))} > Read Reviews </button><br/>
                <span> Add to My Projects: <input type="checkbox" name="addToMyProjects" value={"projectID"+project[0].id} defaultChecked={false} /> </span><br/>

                {/* <button onClick={console.log("DELETE CLICK")} > Delete from Your Projects</button> */}
            </div>

        )
    }



}
export default AllProjectCard;