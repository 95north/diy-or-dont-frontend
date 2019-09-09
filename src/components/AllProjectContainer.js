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
        displayReviewFlag: true,
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

    toggleReviewToDisplay =(project_id)=>{
        console.log(" All PROJ cont  state before", this.state)

        if (this.state.reviewToDisplay === project_id){
            this.setState({reviewToDisplay: project_id, displayReviewFlag: false})
        } else {
            this.setState({reviewToDisplay: project_id, displayReviewFlag: true})
        }
        console.log(" All PROJ cont  state After", this.state)

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
                    project={project} 
                    onEditClickHandler={this.onEditClickHandler}  
                    toggleReviewToDisplay={this.toggleReviewToDisplay}
                    />
            })
        }



        return(
            <React.Fragment>

                <div className="thecontainer">
                    <h1> Showing All Projects: </h1>
                    {/* <Link to="/createproject">Don't See It? Create a New Project</Link> */}
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


                        {(displayProjectsCardArr && displayProjectsCardArr.length>0)? displayProjectsCardArr : 
                        <div className="card"><Link to="/createproject">Don't See It? Create a New Project</Link></div> }

                        {/* Was in child, moved to parent! */}

                        <ReviewContainer 
                        
                        displayReviews={this.state.reviewToDisplay}
                        reviewToDisplay={this.state.reviewToDisplay}
                        //className={this.state.displayReviewFlag ? "newToolShow" : "newToolHide"}
                        
                        >
                          <h1> ReviewContainer </h1> 
                        </ReviewContainer> 
                        
                </div>
                <br/>
                <br/>
                <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>

            </React.Fragment>
        )
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
        addNeedTool: ()=> dispatch({type: "ADD_TOOL_NEED"}),
        unNeedTool: ()=> dispatch({type: "UN_NEED_TOOL"})
    })
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
  

export default connect(mapStateToProps, mapDispatchToProps)(AllProjectContainer);