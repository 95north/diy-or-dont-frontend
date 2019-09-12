import React from 'react';
import ProjectCard from './ProjectCard.js'
import { Route , withRouter, Redirect} from 'react-router-dom';
import { browserHistory } from 'react-router';
import {connect} from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import './Carousel.css'
import './Card.css'

// import cloneDeep from 'lodash/cloneDeep'


class ProjectContainer extends React.Component{

// check user logged in (token) / get who user is.. 
// fetch all of user's projects. 
    state = {
        projects: [],
        userSupplies: [],
        relevantSupplyObjs: []
    }


    componentDidMount(){
        // console.log("in ProjCont, props.user is : ", this.props.user.user_id)
        
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


    onDeleteUserProjectClick=(userProjectIdToDelete)=>{
        let userProjectsCopy= cloneDeep(this.state.projects);
        let returnArray = []; 
            
        userProjectsCopy.forEach( function (proj){
            if (proj[2]["id"]!== userProjectIdToDelete){
                returnArray.push(proj)
            } else {
            }
        })
        this.setState({projects: returnArray})
    }




    onEditClickHandler = () =>{
        console.log("Edit CLick")

    }



    render(){
        let slideIndexCounter = -1
        if (this.state.projects){
            let projectCardsArr = this.state.projects.map( project => {
                slideIndexCounter += 1;
               // {/* <ProjectCard /> */}
                return(
                // <Slide index={slideIndexCounter}>
                    <ProjectCard

                    project={project} 
                    addNeedTool={this.props.addNeedTool}
                    unNeedTool={this.props.unNeedTool}
                    onEditClickHandler={this.onEditClickHandler}
                    onDeleteUserProjectClick={this.onDeleteUserProjectClick}
                    //toggleReviewToDisplay={this.toggleReviewToDisplay}
                    >
                    </ProjectCard>
                // </Slide>
                )
            })


            return(
                <React.Fragment>

                    {/* <div className="carousel-container"> */}
                    <div className="headerDiv">
                        <div className="headerText"> Your Projects: </div>
                    </div>
                    
                    <div className="thecontainer">

                    {/* <br/> */}
                    
                        {/* <br></br> */}
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


                            {/* <CarouselProvider       
                                naturalSlideWidth={250}
                                naturalSlideHeight={950}
                                totalSlides={projectCardsArr.length}
                                visibleSlides={4}
                            >
                            <span  id="leftNextButton"> <ButtonBack>  👈🏽  </ButtonBack> </span> 
                            <span  id="rightNextButton"> <ButtonNext> 👉🏼 </ButtonNext> </span> 

                                <Slider className="carousel">
                                    {projectCardsArr}
                                </Slider>
                            </CarouselProvider> */}

                            {projectCardsArr}

                        {/* MESSED UP REFACTOR, DONT NEED THIS HERE */}
                        {/* <ReviewContainer 
                        reviewToDisplay={this.state.reviewToDisplay} 
                        className={this.state.displayReviewFlag ? "newToolShow" : "newToolHide"}
                        />  */}

                    </div>

                </React.Fragment>
        
            )
        } else {
            return(
                <h2> Login! </h2>
            )
        }
    } // ends render

} // ends class



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
    return({
        userSupplies: state.userSupplies,
        user: state.user
    })
}


export default connect(mapStateToProps, mapDispatchToProps)(ProjectContainer);