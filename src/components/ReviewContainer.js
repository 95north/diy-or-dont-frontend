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

    shouldComponentUpdate(nextProps) {
        const diffDisplayReviews = this.state.displayReviews !== nextProps.displayReviews
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
        fetch(`http://localhost:3000/reviews/${this.props.activeProjectId}`, {
            method: 'GET'
        })
        .then( res => {
            return res.json(); 
        })
        .then( reviewData => {
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
            } else {
                return null
            }
        }
    }

 

    render(){
        if(this.props.activeProjectId){
            this.fetchReviews();
        }

        if(this.props.activeProjectId){
        return(
                <React.Fragment>
                        <div id="mypanel">
                        <div>
                            <span onClick={((e)=>this.props.activeProjectIdVoidInStore(this.props.project_id))}> X </span>
                            <h1> Reviews: </h1>
                            {this.state.reviewCardsArr}
                        </div>
                    </div>
                </React.Fragment>
            )
        } else {
            return( null )
        }
    }

} 



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
        user: state.user,
        activeProjectId: state.activeProjectId
    })
}


export default connect(mapStateToProps, mapDispatchToProps)(ReviewContainer);