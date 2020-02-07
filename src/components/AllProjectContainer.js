import React from 'react';
import AllProjectCard from './AllProjectCard.js'
import ReviewContainer from './ReviewContainer.js'
import NewProjectForm from './NewProjectForm.js'
import { Route, Switch, withRouter, BrowserRouter as Router, Link, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import CarouselConfiguration from './CarouselConfiguration.js';

import './Card.css'

class AllProjectContainer extends React.Component{

    state = {
        allProjects: [],
        reviewToDisplay: 0,
        displayReviewFlag: false,
        displayReviews: true
    }

    componentDidMount = ()=>{
        fetch("http://localhost:3000/allprojects",
        {method: "GET",
            headers: {"Authorization": `${this.props.user.user_token}`}}
        )               
        .then( res => res.json() )
        .then( projectsData => {
            this.setState({allProjects: projectsData})  
        })
        if (this.props.user.user_id !== "undefined" && this.props.user.user_id > 0 ){ 
            fetch(`http://localhost:3000/projects/${this.props.user.user_id}`,
            {method: "GET",
            headers: {"Authorization": `${this.props.user.user_token}`}})              
            .then( res => {
                console.log("Project Container json fetch resp: ", res)
                return res.json() 
            })
            .then( projectsData => {
                console.log("Project Container json fetch resp: ", projectsData)
                let rawDataCopy = [...projectsData]
                rawDataCopy.pop()            
                this.setState({
                    projects: rawDataCopy,
                    userSupplies: projectsData[projectsData.length-1][0], 
                    relevantSupplyObjs: projectsData[projectsData.length-1][1] 
                })  

                this.props.addUserAppDataToStore({ 
                    projects: rawDataCopy,
                    userSupplies: projectsData[projectsData.length-1][0], 
                    relevantSupplyObjs: projectsData[projectsData.length-1][1]

                });
            })
        } else {
            return <Redirect to="/login" />
        }


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
            if (review["reviewDifficulty"] && review["reviewDifficulty"] !== "" && review["reviewDifficulty"] !== null){
                difficultyTotal = difficultyTotal + review["reviewDifficulty"];
                difficultyCounter += 1;
            }
            if (review["reviewFun"] && review["reviewFun"] !== "" && review["reviewFun"] !== null){
                funTotal += review["reviewFun"];
                funCounter += 1;
                funRatings.push(review["reviewFun"])
            }
            if (review["reviewTime"] && review["reviewTime"] !== ""  && review["reviewTime"] !== null){
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
            if (proj[0].name.toLowerCase().includes(searchTermCopy)){
                returnArr.push(proj[0].name)
            }
        })
        return returnArr;
    }

    
    
    render(){

        // finish filtering projects, then create Project Card.
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

                return <AllProjectCard 
                        displayReviewFlag={this.state.displayReviewFlag}  
                        project={project} 
                        onEditClickHandler={this.onEditClickHandler}  
                        toggleReviewToDisplay={this.toggleReviewToDisplay}
                    />
            })
        }


        if (this.props.activeProjectId){
            return(
                <React.Fragment>
                    <div className="headerDiv">
                        <div className="headerText"> Showing All Projects: </div>
                    </div>
                    
                    <div className="thecontainer">
    
                        <ReviewContainer 
                            toggleReviewToDisplay={this.toggleReviewToDisplay}
                            displayReviews={this.state.reviewToDisplay}
                            reviewToDisplay={this.state.reviewToDisplay}
                            displayReviewFlag={this.state.displayReviewFlag}
                        />

                            {(displayProjectsCardArr && displayProjectsCardArr.length>0)? displayProjectsCardArr :  
                            <div className="card">
                            <button onClick={this.props.activeNewProjectVoidInStore}>
                                Don't See It?  a New Project
                            </button>
                            </div> 
                            }

                    <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                    </div>
            
                </React.Fragment>
            )
        } else {
            return (
                    <React.Fragment>
        
                    <div className="headerDiv">
                        <div className="headerText"> Showing All Projects: </div>
                    </div>
                    
                        <div className="thecontainer">
                            <br/>
        
                                {(displayProjectsCardArr && displayProjectsCardArr.length>0)? displayProjectsCardArr : 
                                <div className="card">
                                    <button onClick={this.props.activeNewProjectVoidInStore}>
                                        Don't See It? Create a New Project
                                    </button>
                                </div> }
        
        
                        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                        </div>
                    <NewProjectForm/>
                    </React.Fragment>
            )
        }
    }
}

                                // Below: flickity carousel. Don't like. 
                                {/* 
                                {displayProjectsCardArr ? 
                                <CarouselConfiguration
                                    options={{
                                    // autoPlay: 4000,
                                    // pauseAutoPlayOnHover: true,
                                    wrapAround: true,
                                    fullscreen: true,
                                    adaptiveHeight: false,  // was true
                                    }}
                                >
                                    {displayProjectsCardArr}

                                </CarouselConfiguration>
                                : 
                                // <div className="card">
                                    <Link to="/createproject">Don't See It? Create a New Project</Link>
                                
                                */}




function mapDispatchToProps(dispatch){
    return({        
        addUserAppDataToStore: (projectsUserSuppliesAndUserSupplyObjs)=> dispatch(
            {type: "ADD_USER_APP_DATA",
            payload: projectsUserSuppliesAndUserSupplyObjs
        }),
        activeNewProjectVoidInStore: ()=> dispatch(
            {type: "ACTIVATE_NEW_PROJECT_FORM_FLAG",
        })

    })
}
                                

function mapStateToProps(state){
      return({
          user: state.user,
          searchTerm: state.searchTerm,
          activeProjectId: state.activeProjectId,
          activeReviewId: state.activeReviewId
      })
  }
  

export default connect(mapStateToProps, mapDispatchToProps)(AllProjectContainer);