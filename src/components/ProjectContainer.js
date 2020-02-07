import React from 'react';
import ProjectCard from './ProjectCard.js'
import NewReviewForm from './NewReviewForm.js'
import { Route , withRouter, Redirect} from 'react-router-dom';
import { browserHistory } from 'react-router';
import {connect} from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import './Carousel.css'
import './Card.css'
import { isParenthesizedExpression, throwStatement } from '@babel/types';


class ProjectContainer extends React.Component{

    constructor(props) {
        super(props)
        this.reviewContRef = React.createRef()
        this.state = {
            projects: [],
            userSupplies: [],
            relevantSupplyObjs: []
        }
    }



    componentDidMount(){
        console.log("this.props.user_token", this.props.user.user_token)
        console.log("this.props.user.user_token", this.props.user.user_token)
        if (this.props.user.user_id !== "undefined" && this.props.user.user_id > 0 ){
            fetch(`http://localhost:3000/projects/${this.props.user.user_id}`
            ,{method: 'GET',
            headers: {authorization: `${this.props.user.user_token}`}
            })              
            .then( res => {
                return res.json() 
            })
            .then( projectsData => {
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
        let activeReview = (this.props.activeReviewId > 0)? true : false;
        let slideIndexCounter = -1
        let projectCardsArr;

            if (this.state.projects){   
                projectCardsArr = this.state.projects.map( project => {
                    slideIndexCounter += 1;
                    return(         
                    <Slide index={slideIndexCounter}>
                        <ProjectCard
                            project={project} 
                            addNeedTool={this.props.addNeedTool}
                            unNeedTool={this.props.unNeedTool}
                            onEditClickHandler={this.onEditClickHandler}
                            onDeleteUserProjectClick={this.onDeleteUserProjectClick}
                        >
                        </ProjectCard>
                    // </Slide>
                    )
                })
            }

            if(activeReview === true) {
                return(                     // returned if you are logged in AND clicked a review button
                    <React.Fragment>

                        <div className="headerDiv">
                            <div className="headerText"> Your Projects: </div>
                        </div>

                        <div className="bgpic">
                            <div  className="theContainerCarouselReviewOpen" >
                            {/* <div className="thecontainer"> */}

                                    <CarouselProvider       
                                        naturalSlideWidth={250}
                                        naturalSlideHeight={950}
                                        totalSlides={projectCardsArr.length}
                                        visibleSlides={3}
                                        dragEnabled={false}
                                        touchEnabled={false}
                                        infinite={true}
                                    >
                                    <span  id="leftNextButton"> <ButtonBack>  👈🏽  </ButtonBack> </span> 
                                    <span  id="rightNextButton"> <ButtonNext> 👉🏼 </ButtonNext> </span> 

                                        <Slider className={activeReview ? "" : "" } ref={this.reviewContRef}>
                                            {projectCardsArr}
                                        </Slider>

                                    </CarouselProvider>

                                    {/* <NewReviewContainer/> */}
                                    <NewReviewForm/>

                                
                            {/* </div> */}
                            </div>
                        </div>
                    </React.Fragment>
                )
            } else if (activeReview === false ) {                        

                return(                   
                    <React.Fragment>
                        <div className="headerDiv">
                            <div className="headerText"> Your Projects: </div>
                        </div>
                        <div className="bgpic">
                            
                            <div  className="thecarouselcontainer" >
                            {/* <div className="thecontainer"> */}

                                    <CarouselProvider       
                                        naturalSlideWidth={250}
                                        naturalSlideHeight={950}
                                        totalSlides={projectCardsArr.length}
                                        visibleSlides={4}
                                        dragEnabled={false}
                                        touchEnabled={false}
                                        infinite={true}
                                    >
                                        <span  id="leftNextButton"> <ButtonBack>  👈🏽  </ButtonBack> </span> 
                                        <span  id="rightNextButton"> <ButtonNext> 👉🏼 </ButtonNext> </span> 

                                        <Slider className={activeReview ? "" : "" } ref={this.reviewContRef}>
                                            {projectCardsArr}
                                        </Slider>
                                    </CarouselProvider>

                            </div>
                            {/* </div> */}
                        </div>
                    </React.Fragment>
                )
        

        } else {
            return(
                <h2> Login! </h2>
            )
        }
    } 

} 



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
        user: state.user,
        activeReviewId: state.activeReviewId // added Dec 14. projCd adds it to store
    })
}


export default connect(mapStateToProps, mapDispatchToProps)(ProjectContainer);