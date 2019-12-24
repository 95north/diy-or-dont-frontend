import React from 'react';
import AllProjectCard from './AllProjectCard.js'
import ReviewContainer from './ReviewContainer.js'
import NewProjectForm from './NewProjectForm.js'
import { Route, Switch, withRouter, BrowserRouter as Router, Link, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import CarouselConfiguration from './CarouselConfiguration.js';

import './Card.css'

class AllProjectContainer extends React.Component{

// check user logged in (token) / get who user is.. 
// fetch all of user's projects.  (hardcode for now)
    state = {
        allProjects: [],
        reviewToDisplay: 0,
        displayReviewFlag: false,
        displayReviews: true
    }

    componentDidMount = ()=>{
        fetch("http://localhost:3000/allprojects")               
        .then( res => res.json() )
        .then( projectsData => {
            // console.log("ALL projectsData is :", projectsData)  //ok for hard coded 
            this.setState({allProjects: projectsData})  
            // Add to store: 
            
        })
        if (this.props.user.user_id !== "undefined" && this.props.user.user_id > 0 ){
            fetch(`http://localhost:3000/projects/${this.props.user.user_id}`)              
            .then( res => {
                console.log("PROJECt Container json fetch resp: ", res)
                return res.json() 
            })
            .then( projectsData => {
                console.log("PROJECt Container json fetch resp: ", projectsData)
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
            // ^^Source:   https://scotch.io/courses/using-react-router-4/authentication-with-redirect
            // this.props.history.push('/login')  Need to pass down history to use
        }


    }

    toggleReviewToDisplay =(project_id)=>{  /// NOT USING, CHANGED TO STORE
        // console.log(" All PROJ cont  toggleReviewToDisplay   state before", this.state)

        if (this.state.reviewToDisplay === project_id){

            this.setState({reviewToDisplay: project_id, displayReviewFlag: !this.state.displayReviewFlag})
        } else {
            this.setState({reviewToDisplay: project_id, displayReviewFlag: true})
        }
        console.log(" All PROJ cont   toggleReviewToDisplay   state After", this.state)

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
        // console.log("porj (for Averages) in AllProjectContainer -", proj)
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

                return <AllProjectCard 
                    displayReviewFlag={this.state.displayReviewFlag}  // change w toggleReviewToDisplay
                    project={project} 
                    onEditClickHandler={this.onEditClickHandler}  
                    toggleReviewToDisplay={this.toggleReviewToDisplay}
                    // does not pass down project ID, bc that is given as prop to ea. CARD
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
                        {/* <br/> */}
    
                        <ReviewContainer 
                            // className={this.props.displayReviewFlag ?  "panel-wrap" : "go-none" }
                            //  ^^ Was getting passed down as a Prop...
                            toggleReviewToDisplay={this.toggleReviewToDisplay}
                            displayReviews={this.state.reviewToDisplay}
                            reviewToDisplay={this.state.reviewToDisplay}
                            displayReviewFlag={this.state.displayReviewFlag}
                        />

                            {(displayProjectsCardArr && displayProjectsCardArr.length>0)? displayProjectsCardArr :  
                            // <div className="card"><Link to="/createproject">Don't See It? Create a New Project</Link></div> }
                            <div className="card">
                            <button onClick={this.props.activeNewProjectVoidInStore}>
                                Don't See It? Create a New Project
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
                                // <div className="card"><Link to="/createproject">Don't See It? Create a New Project</Link></div> }
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
    // console.log("state argument in MSP in aPP: ", state)  An empty obj.
    // console.log("Called mapStateToPRops! ")   CORRECT, this gets called!
    console.log("in AllProjectContainer mapStateToPRops!  state is:  ", state )   // Id + token, CORRECT!   
      return({
          user: state.user,
          searchTerm: state.searchTerm,
          activeProjectId: state.activeProjectId,
          activeReviewId: state.activeReviewId
      })
  }
  

export default connect(mapStateToProps, mapDispatchToProps)(AllProjectContainer);