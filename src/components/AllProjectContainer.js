import React from 'react';
import AllProjectCard from './AllProjectCard.js'
import {connect} from 'react-redux';

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
            // console.log("ALL projectsData is :", projectsData)  //ok for hard coded 
            this.setState({allProjects: projectsData})  
        })
    }

    onEditClickHandler = () =>{
        console.log("Edit CLick")
    }

    calculateAvgs = (proj) =>{
        let difficultyTotal = 0;
        let difficultyCounter = 0;
        let funTotal = 0;
        let funCounter = 0;
        let funRatings =[]
        let timeTotal = 0;
        let timeCounter = 0;
        for (let review of proj[1]) {
            if (review["reviewDifficulty"] ){
                difficultyTotal = difficultyTotal + review["reviewDifficulty"];
                difficultyCounter += 1;
            }
            if (review["reviewFun"] ){
                funTotal += review["reviewFun"];
                funCounter += 1;
                funRatings.push(review["reviewFun"])
            }
            if (review["reviewTime"] ){
                timeTotal += review["reviewTime"];
                timeCounter += 1;
            } 
        }
        proj["avgDifficulty"] = difficultyTotal / difficultyCounter
        proj["avgFun"] = funTotal / funCounter
        proj["avgTime"] = timeTotal / timeCounter
        proj["ratingsCount"] = funCounter;
        proj["funRatings"] = funRatings;
    }

    filterProjectsBySearchTerm = ()=>{
        let returnArr = []
        let searchTermCopy = this.props.searchTerm.value
        if (searchTermCopy === "undefined" || searchTermCopy === undefined ){
            searchTermCopy = ""
        }

        this.state.allProjects.forEach( proj =>{
            // console.log("search Filter proj: ", proj[0].name)
            // let p = proj[0].name.toLowerCase()
            // p.includes(this.props.searchTerm.value)
            if (proj[0].name.toLowerCase().includes(searchTermCopy)){
                // returnArr.push(proj)
                returnArr.push(proj[0].name)
            }
        })
        return returnArr;
    }

    
    
    render(){

        // finish filtering projects (should refactor, chunky), then create Project Card.
        let displayProjectsCardArr 
        let filteredProjectsName = this.filterProjectsBySearchTerm();
        let filteredProjectsCardArr = [];

        if (this.state.allProjects.length > 0){
            this.state.allProjects.forEach( proj => {
                if (filteredProjectsName.includes(proj[0].name)){
                    filteredProjectsCardArr.push(proj)
                }
            })
            displayProjectsCardArr = filteredProjectsCardArr.map( project => {
                project[0]["reviewDifficultyAvg"]=this.calculateAvgs(project)

                return <AllProjectCard project={project} onEditClickHandler={this.onEditClickHandler}/>
            })
        }



        return(
            <React.Fragment>

                <div className="thecontainer">
                    <h1> Showing All Projects: </h1>
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
                    {displayProjectsCardArr ? displayProjectsCardArr : null}
                </div>

            </React.Fragment>
        )
    }



}


function mapStateToProps(state){
    // console.log("state argument in MSP in aPP: ", state)  An empty obj.
    // console.log("Called mapStateToPRops! ")   CORRECT, this gets called!
    console.log("in AllProjectContainer mapStateToPRops!  state is:  ", state )   // Id + token, CORRECT!   
      return({
          user: state.user,
          searchTerm: state.searchTerm
      })
  }
  

export default connect(mapStateToProps, null)(AllProjectContainer);