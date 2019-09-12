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
        completedDate: "",
        displayReviewForm: false   // NEW
    }



    toggleDisplayReviewFormState = () => {   // NOT USED, NOW IN STORE
        // console.log("toggled state on New / Edit A  REVIEW", this.state.displayReviewForm)
        this.setState({displayReviewForm: !this.state.displayReviewForm})
    }



    componentDidMount = () =>{             // fetch own review to edit. 
        fetch(`http://localhost:3000/review/${this.props.userProject_id}`, {
            method: 'GET',
            headers: { "Content-Type": "application/json; charset=utf-8", 
            Accepts: 'application/json' }
        })
        .then( res => {
            console.log("componentDidMount Resp is: ", res) // gets 200 OK
            return res.json(); 
        })
        .then( reviewData => {
            console.log(" componentDidMount review Show :", reviewData)
            this.setState({
                // initialFormData: reviewData
                status: reviewData.status,
                usernote: reviewData.usernote,
                reviewDifficulty: reviewData.reviewDifficulty,
                reviewFun: reviewData.reviewFun,
                reviewText: reviewData.reviewTime,
                reviewText: reviewData.reviewText,
            })
            // this.renderReviewCards();  
        })
    }


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
            this.props.activeReviewIdVoidInStore()
            // this.toggleDisplayReviewFormState()
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
                return res.json(); 
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
        // console.log("New Review Containter props: USER PROJECT ID??  ", this.props)
        if(this.props.activeReviewId === this.props.userProject_id){
        return(
            // <div className={ this.state.displayReviewForm ? null : "go-away"}> 
            // ^^ Makes it super buggy, and review forms align with cards roughly (but staggered)
            // <div className="panel-wrap">
            //     <div className="panel">
                <div id="mypanel">

                    <form onSubmit={((e)=>this.onSubmitReviewForm(e))}>
                    <span onClick={((e)=>this.props.activeReviewIdVoidInStore(this.props.project_id))}> X </span>
                        <br/>
                        {/* Was:   */}
                        {/* <span onClick={"this.parentElement.style.display='none'"}> X </span><br/><br/> */}
                            Review:  {this.props.userProject_name} <br/><br/>

                            Status: 
                            <select
                                name="status" 
                                value={this.state.status} 
                                onChange={this.changeHandler}
                            >
                                <option value="" selected="selected" disabled> Chose One </option>
                                <option value="Not Started"> Not Started </option>
                                <option value="In Progress"> In Progress </option>
                                <option value="Completed"> Completed </option>
                                <option value="Gave Up"> I Gave Up </option>
                            </select><br/>

                            Difficulty of Project: <br/>
                            <select
                                name="reviewDifficulty" 
                                value={this.state.reviewDifficulty} 
                                onChange={this.changeHandler}
                            >
                                <option value="" selected="selected" disabled> Chose One </option>
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
                                <option value="" selected="selected" disabled> Chose One </option>
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
            // </div>
            // </div>
        )
        } else {
            return(null)
        }
    }
}



function mapDispatchToProps(dispatch){
    return({        
        activeReviewIdAddToStore: (e, projectId)=> dispatch(
            {type: "UPDATE_ACTIVE_REVIEW_ID",
            payload: projectId
        }),
        activeReviewIdVoidInStore: (e, projectId)=> dispatch(
            {type: "VOID_ACTIVE_REVIEW_ID",
            payload: projectId
        }),

    })
}



function mapStateToProps(state){
    return({
        // userSupplies: state.userSupplies,
        user: state.user,
        activeReviewId: state.activeReviewId

    })
}


export default connect(mapStateToProps, mapDispatchToProps)(NewReviewContainer);