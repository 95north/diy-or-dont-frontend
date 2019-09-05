import React from 'react';
import { Route , withRouter, Redirect} from 'react-router-dom';
import { browserHistory } from 'react-router';
import {connect} from 'react-redux';
import './Sidebar.css'


class ReviewCard extends React.Component{



    render(){
        let user = this.props.review[1]
        let review = this.props.review[0]

        console.log("props in ReviewCard: ", this.props)
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


export default connect(mapStateToProps, mapDispatchToProps)(ReviewCard);