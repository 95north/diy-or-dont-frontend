import React from 'react';
import { Route , withRouter, Redirect} from 'react-router-dom';
import { browserHistory } from 'react-router';
import {connect} from 'react-redux';
import './Sidebar.css'


class ReviewCard extends React.Component{

    render(){
        let user = this.props.review[1]
        let review = this.props.review[0]
        let review_id = this.props.review[0]["id"]
        console.log("userProject_id props in ReviewCard: ", this.props.userProject_id)
        console.log("activeReviewId store  props in ReviewCard: ", this.props.activeReviewId )

 

        return(
            <div>
                <div>
                    <h2> Review </h2>
                    {user["username"]}  from  {user.location} <br/>
                    on  {review.updated_at}<br/>
    
                    Project Difficulty: {review.reviewDifficulty}<br/>
                    Project Miserable / Fun Rating: {review.reviewFun}<br/>
                    {user["username"]}'s time to Complete: {review.reviewTime}<br/>
                    User's review: <br/> {review.reviewText}<br/>
                    User's Project Status: {review.status}<br/>

                </div>
            </div>
        )
    }
}




function mapDispatchToProps(dispatch){
    return({
    })
}


function mapStateToProps(state){
    return({
        user: state.user,
        activeReviewId: state.activeReviewId
    })
}


export default connect(mapStateToProps, mapDispatchToProps)(ReviewCard);