import React from 'react';
import ReviewCard from './ReviewCard.js'
import { Route , withRouter, Redirect} from 'react-router-dom';
import { browserHistory } from 'react-router';
import {connect} from 'react-redux';
import './Sidebar.css'
import { throwStatement } from '@babel/types';


class ReviewContainer extends React.Component{

    constructor(props) {
        super(props)

        this.state = {
            displayReviews: "",
            reviewData: [], 
            reviewCardsArr : []
        }
    }

    // componentDidMount = () =>{
    //     console.log("props in reviews", this.props.displayReviews === this.props.project_id)
        
    // }

    shouldComponentUpdate(nextProps) {
        //const diffDisplayReviews = this.props.displayReviews !== nextProps.displayReviews
        const diffDisplayReviews = this.state.displayReviews !== nextProps.displayReviews
        // console.log("this.props.displayReviews", this.props.displayReviews )
        // console.log("nextProps.displayReviews", nextProps.displayReviews )
        console.log("shouldComponentUpdate",  diffDisplayReviews)
        return diffDisplayReviews 
    }

    // componentWillUpdate(nextProps, nextState){
    //     if (this.props.displayReviews === this.props.project_id){
    //         this.fetchReviews();
    //     }
    //     console.log("this.state.reviewCardsArr ", this.state.reviewCardsArr)
    //     console.log("nextState.reviewCardsArr ", nextState.reviewCardsArr)
    //     console.log("this.state.reviewData ", this.state.reviewData)

    //     const diffDisplayReviews = this.props.displayReviews !== nextProps.displayReviews
    //     // diffDisplayReviews -  project index passed in as props
    //     //const diffReviewCardsArr = this.state.reviewCardsArr !== nextState.reviewCardsArr
    //     // 
    //     const diffReviewCardsArr = nextState.reviewCardsArr !== this.state.reviewCardsArr
    //     // const diffReviewCardsArr = (this.state.reviewData[0][0][project_id] ? this.state.reviewData[0][0][project_id] : [] )!== nextProps.displayReviews

    //     console.log("componentWillUpdate",  diffReviewCardsArr)
    //     return diffReviewCardsArr && diffDisplayReviews
    // }


    fetchReviews = () =>{
        // console.log("props: ", this.props)
        fetch(`http://localhost:3000/reviews/${this.props.activeProjectId}`, {
        // fetch(`http://localhost:3000/reviews/${this.props.project_id}`, {
            method: 'GET'
        })
        .then( res => {
            // console.log("Resp is: ", res) // gets 200 OK
            return res.json(); 
        })
        .then( reviewData => {
            console.log("reviewDATA :", reviewData)
            this.renderReviewCards(reviewData)
        })
    }


    renderReviewCards = (reviewData) =>{
        if (reviewData !== this.state.reviewData){
            if (reviewData !== [] ){

                let reviewCardsArr = reviewData.map( review => {
                    return(
                        <ReviewCard 
                            review={review}
                            userProject_id ={this.props.userProject_id}

                        />
                    )
                })
                
                this.setState({reviewCardsArr: reviewCardsArr,
                    reviewData : reviewData,
                    displayReviews: this.props.displayReviews
                })
                // console.log("reviewCardsArr in renderRevCards, called in render", reviewCardsArr)
            } else {
                return null
            }
        }
    }


    onClickHandlerXButton = (e, project_id)=>{          // should now not be used.
        this.props.toggleReviewToDisplay(project_id)
        // e.target.parentElement.style.display='none'   
        // AND UNCHECK THE BOX !!!! 
    }
 

    render(){
        // this.fetchReviews();
        console.log("Props in Review Container Render (does project_id = displayreviews?):: ", this.props)

        //if (this.props.displayReviews === this.props.project_id){  
        //  ^^ Before Refactor. project_id only comes from the CARD

        // if (this.props.displayReviews === this.props.reviewToDisplay){ 
        //     this.fetchReviews();
        // }

        if(this.props.activeProjectId){
            this.fetchReviews();
        }


        if(this.props.activeProjectId){
        return(
                <React.Fragment>
                    {/* className={this.props.displayReviewFlag ?  null : "go-none" } */}
                    {/* The ReviewContainer in AllProjectContainer is rendering, not AllPCard!  */}
                    {/* <div className="panel-wrap" className={this.props.displayReviewFlag ?  "display-it" : "go-none" } > */}
                    

                    {/* <div className={(this.props.displayReviews) ?  null : "go-away" }  > */}
                    {/* ^^^ Makes varying height review containers show, one for ea AllProjCard */}
                    {/* ^^ For Button to Work bc. unchecked pseudoclass for Checkbox only */}
                    
                    {/* <div className="panel-wrap"> */}
                        {/* <div className="panel"> */}
                        <div id="mypanel">
                        <div>
                        {/* <div className={this.props.activeProjectId ? "display-block" : null }> */}
                            
                            <span onClick={((e)=>this.props.activeProjectIdVoidInStore(this.props.project_id))}> X </span>
                            {/* <span onClick={((e)=>this.onClickHandlerXButton(e, this.props.project_id))}> X </span> */}
                            {/* <span onClick={"this.parentElement.style.display='none'"}> X </span> */}
                            {/*  ^^^ Get error message onClick is string, not a function!! */}

                            <h1> Reviews: </h1>


                            {this.state.reviewCardsArr}
                        </div>
                        {/* </div> */}
                    </div>
                    {/* </div> */}
                </React.Fragment>
            )
        } else {
            return( null )
        }
    }

} // end class



function mapDispatchToProps(dispatch){
    return({        
        activeProjectIdVoidInStore: (projectId)=> dispatch(
            {type: "VOID_ACTIVE_PROJECT_ID",
            payload: projectId
        }),

    })
}

function mapStateToProps(state){
    return({
        // userSupplies: state.userSupplies,
        user: state.user,
        activeProjectId: state.activeProjectId
    })
}


export default connect(mapStateToProps, mapDispatchToProps)(ReviewContainer);