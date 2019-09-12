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
        // console.log("this.props.review[0][ id ]  props in ReviewCard: ", this.props.review[0]["id"])
        console.log("userProject_id props in ReviewCard: ", this.props.userProject_id)
        console.log("activeReviewId store  props in ReviewCard: ", this.props.activeReviewId )

 

       //if( this.props.activeReviewId === this.props.userProject_id){

      
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
                    {/* User notes on project: {review.usernote}<br/> */}
                    User's Project Status: {review.status}<br/>

                </div>
            </div>

        )
    // } else {
    //     return null
    // }

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
        user: state.user,
        activeReviewId: state.activeReviewId
    })
}


export default connect(mapStateToProps, mapDispatchToProps)(ReviewCard);