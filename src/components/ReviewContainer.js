import React from 'react';
import ReviewCard from './ReviewCard.js'
import { Route , withRouter, Redirect} from 'react-router-dom';
import { browserHistory } from 'react-router';
import {connect} from 'react-redux';
import './Sidebar.css'
import { throwStatement } from '@babel/types';


class ReviewContainer extends React.Component{
    // Generate a sidebar
    // do fetch request, get reviews (& user info for ea) for a given project,
    // ( in store, only have logged in user's reviews )
    // Map each review to a ReviewCard

    constructor(props) {
        super(props)

        this.state = {
            displayReviews: "",
            reviewData: [], 
            reviewCardsArr : []
        }
        // console.log("Review container props: ", this.props)
    }

    // componentDidMount = () =>{
    //     console.log("props in reviews", this.props.displayReviews === this.props.project_id)
        
    // }

    shouldComponentUpdate(nextProps) {
        //const diffDisplayReviews = this.props.displayReviews !== nextProps.displayReviews
        const diffDisplayReviews = this.state.displayReviews !== nextProps.displayReviews
        console.log("this.props.displayReviews", this.props.displayReviews )
        console.log("nextProps.displayReviews", nextProps.displayReviews )

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
        fetch(`http://localhost:3000/reviews/${this.props.reviewToDisplay}`, {
        // fetch(`http://localhost:3000/reviews/${this.props.project_id}`, {
            method: 'GET'
        })
        .then( res => {
            console.log("Resp is: ", res) // gets 200 OK
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


    onClickHandlerXButton = (e)=>{
        e.target.parentElement.style.display='none'   
        // AND UNCHECK THE BOX !!!! 
    }
 

    render(){
        this.fetchReviews();
        console.log("Props in Review Container Render:: ", this.props)

        //if (this.props.displayReviews === this.props.project_id){  //Before Refactor
        if (this.props.displayReviews === this.props.reviewToDisplay){  //Before Refactor

            console.log("Called Fetch Reviews! ")
            this.fetchReviews();
        }
        // console.log(this.props)
        // console.log("State in MY reviews Container", this.state)



        return(


            <React.Fragment>

                <div className="panel-wrap">
                    <div className="panel">
                        
                        <span onClick={((e)=>this.onClickHandlerXButton(e))}> X </span>
                        {/* <span onClick={"this.parentElement.style.display='none'"}> X </span> */}
                        {/*  ^^^ Get error message onClick is string, not a function!! */}

                        <h1> Reviews: </h1>


                        {this.state.reviewCardsArr}
                    </div>
                </div>

            </React.Fragment>
    
        )
    }

}



function mapDispatchToProps(dispatch){
    return({
        // addNeedTool: ()=> dispatch({type: "ADD_TOOL_NEED"}),
        // unNeedTool: ()=> dispatch({type: "UN_NEED_TOOL"})
    })
}


function mapStateToProps(state){
    return({
        // userSupplies: state.userSupplies,
        user: state.user
    })
}


export default connect(mapStateToProps, mapDispatchToProps)(ReviewContainer);