import React from 'react';
import { Route , withRouter, Redirect} from 'react-router-dom';
import { browserHistory } from 'react-router';
import {connect} from 'react-redux';
import './Sidebar.css'


class NewReviewContainer extends React.Component{
    // Generate a sidebar
    // do fetch request, get reviews (& user info for ea) for a given project,
    // ( in store, only have logged in user's reviews )
    // Map each review to a ReviewCard



    state = {
        status: "",
        usernote:"",
        reviewDifficulty:"",
        reviewFun:"",
        reviewTime:"",
        reviewText:"",
        completedDate: ""
    }


    // fetchReview = () =>{                                // USE FOR *EDIT* ?
    //     console.log("props: ", this.props)
    //     // Need User_Project Id! 

    //     fetch(`http://localhost:3000/review/${this.props.USERPROJECTID!!!!!}`, {
    //         method: 'GET',
    //         headers: { "Content-Type": "application/json; charset=utf-8", 
    //         Accepts: 'application/json' }
    //     })
    //     .then( res => {
    //         console.log("Resp is: ", res) // gets 200 OK
    //         res.json(); 
    //     })
    //     .then( reviewData => {
    //         console.log("review :", reviewData)
    //         // this.setState({
    //         //     reviewData: reviewData
    //         // })
    //         // this.renderReviewCards();  
    //     })
    // }


    changeHandler = (event)=>{
        // console.log("in change handler", event.target.value)
        let inputName = event.target.name
        console.log("inputName", inputName)
        this.setState(
            {[inputName]: event.target.value}
        )
    }


    onSubmitReviewForm = (e)=>{
            e.preventDefault();
            // Need User_Project Id! 
    
            console.log(this.props.userProject_id)
            fetch(`http://localhost:3000/review/${this.props.userProject_id}`, {
                method: 'PATCH',                                // UserProject already exists, update review part
                headers: { "Content-Type": "application/json; charset=utf-8", 
                accepts: 'application/json' },
                body: JSON.stringify({
                    status: this.state.status,
                    reviewDifficulty: this.state.reviewDifficulty,
                    reviewFun: this.state.reviewFun,
                    reviewTime: this.state.reviewTime,
                    reviewText: this.state.reviewText,
                    completedDate: this.state.completedDate
                })                
            })
            .then( res => {
                console.log("Resp is: ", res) //
                res.json(); 
            })
            .then( reviewData => {
                console.log("review :", reviewData)
                // this.setState({
                //     reviewData: reviewData
                // })
                // this.renderReviewCards();  
            })
    }
 



    render(){
        console.log("New Review Containter props: USER PROJECT ID??  ", this.props)

        return(

            <div className="panel-wrap">
                <div className="panel">
                    <form onSubmit={((e)=>this.onSubmitReviewForm(e))}>
                        <span onClick={"this.parentElement.style.display='none'"}> X </span><br/><br/>
                            Review:  {this.props.userProject_name} <br/><br/>

                            Status: 
                            <select
                                name="status" 
                                value={this.state.status} 
                                onChange={this.changeHandler}
                            >
                                <option value="Not Started"> Not Started </option>
                                <option value="In Progress"> In Progress </option>
                                <option value="Completed"> Completed </option>
                            </select><br/>

                            Difficulty of Project: <br/>
                            <select
                                name="reviewDifficulty" 
                                value={this.state.reviewDifficulty} 
                                onChange={this.changeHandler}
                            >
                                <option value="1"> 1 (Very Easy) </option>
                                <option value="2"> 2 </option>
                                <option value="3"> 3 </option>
                                <option value="4"> 4 </option>
                                <option value="5"> 5 (Difficult) </option>
                            </select><br/>

                           Miserable or Fun? : <br/>
                            <select
                                name="reviewFun" 
                                value={this.state.reviewFun} 
                                onChange={this.changeHandler}
                            >
                                <option value="1"> 1 (Miserable) </option>
                                <option value="2"> 2 </option>
                                <option value="3"> 3 </option>
                                <option value="4"> 4 </option>
                                <option value="5"> 5 (Fun) </option>
                            </select><br/>

                            Time to Complete Project: <br/>
                            <input 
                                type="text" 
                                name="reviewTime" 
                                value={this.state.reviewTime} 
                                placeholder="# Hours to Complete?" 
                                onChange={this.changeHandler}
                            /><br/>

                            Add Notes:  <br/>
                            <input 
                                type="text" 
                                name="reviewText" 
                                value={this.state.reviewText} 
                                placeholder="Enter review text here" 
                                onChange={this.changeHandler}
                            /><br/>

                            Completed Date <br/><br/>

                            <input 
                                type="submit" 
                                value=" Submit "
                                
                            /><br/>

                    </form>
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


export default connect(mapStateToProps, mapDispatchToProps)(NewReviewContainer);