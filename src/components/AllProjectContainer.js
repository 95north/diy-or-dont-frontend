import React from 'react';
import AllProjectCard from './AllProjectCard.js'

import './Card.css'

class AllProjectContainer extends React.Component{

// check user logged in (token) / get who user is.. 
// fetch all of user's projects.  (hardcode for now)
    state = {
        allProjects: []
    }

    componentDidMount(){
        fetch("http://localhost:3000/allprojects")               // HARD CODED !!! 
        .then( res => res.json() )
        .then( projectsData => {
            console.log("ALL projectsData is :", projectsData)  //ok for hard coded 
            this.setState({allProjects: projectsData})  
        })
    }

    onEditClickHandler = () =>{
        console.log("Edit CLick")
    }



    render(){
        let projectCardsArr = this.state.projects.map( project => <AllProjectCard project={project} onEditClickHandler={this.onEditClickHandler}/>)
        console.log(this.state)

        return(
            <React.Fragment>

                <div className="thecontainer">
                    <h1> Your Projects: </h1>
                    <br></br>
                    {/* <div className={this.state.editInProgress ? "displayEdit" : "hideEdit" }> 
                        <EditForm onEditSubmitHandler={this.onEditSubmitHandler}   
                            onEditFormChangeHandler={this.onEditFormChangeHandler}
                            editPonyId={this.state.editPonyId} 
                            editPonyName={this.state.editPonyName} 
                            editPonyFavorite={this.state.editPonyFavorite} 
                            editPonyButt={this.state.editPonyButt} 
                            editPonyImage={this.state.editPonyImage} 
                        />
                    </div> */}
                    {projectCardsArr}
                </div>

            </React.Fragment>
    
        )
    }



}

export default AllProjectContainer;