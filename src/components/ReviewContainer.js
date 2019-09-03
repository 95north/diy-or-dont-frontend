import React from 'react';
import ReviewCard from './ReviewCard.js'
import { Route , withRouter, Redirect} from 'react-router-dom';
import { browserHistory } from 'react-router';
import {connect} from 'react-redux';
import './Sidebar.css'


class ReviewContainer extends React.Component{
    // Generate a sidebar
    // do fetch request, get reviews (& user info for ea) for a given project,
    // ( in store, only have logged in user's reviews )
    // Map each review to a ReviewCard



    state = {
        reviewData: []

    }


    fetchReviews = () =>{
        console.log("props: ", this.props)

        fetch(`http://localhost:3000/reviews/${this.props.project_id}`, {
            method: 'GET'
            // headers: { "Content-Type": "application/json; charset=utf-8", 
            // Accepts: 'application/json' }

            // body: JSON.stringify({
            //     name: this.state.editPonyName,
            //     favorite: this.state.editPonyFavorite,
            //     butt: this.state.editPonyButt,
            //     image: this.state.editPonyImage
            // })
        })
        .then( res => {
            console.log("Resp is: ", res) // gets 200 OK
            res.json(); 
        })
        .then( reviewData => {
            console.log("reviews :", reviewData)
            // this.setState({
            //     reviewData: reviewData
            // })
            // this.renderReviewCards();  
        })
    }


    renderReviewCards = () =>{
        let reviewCardsArr = this.state.reviewData.map( review => {
            return(
                <ReviewCard 
                    review={review} 
                />
            )
        })
    }

    onClickHandlerXButton = ()=>{

    }
 



    render(){
        // console.log(this.props)




        // console.log("State in MY reviews Container", this.state)
        if (this.props.displayReviews){
            this.fetchReviews();
        }

        return(


            <React.Fragment>

                <div className="panel-wrap">
                    <div className="panel">
                        <span onClick={"this.parentElement.style.display='none'"}> X </span>
                        <h1> Reviews: </h1>


                        {/* {reviewCardsArr} */}
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