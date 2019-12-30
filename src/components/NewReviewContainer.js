import React from 'react';
import { Route , withRouter, Redirect} from 'react-router-dom';
import { browserHistory } from 'react-router';
import {connect} from 'react-redux';
import ReactDOM from 'react-dom';
import './Sidebar.css'
import NewReviewForm from './NewReviewForm';


class NewReviewContainer extends React.Component{
    // Generate a sidebar
    // do fetch request, get reviews (& user info for ea) for a given project,
    // ( in store, only have logged in user's reviews )
    // Map each review to a ReviewCard


constructor(props){
    super(props);

    this.state = {
        status: "",
        usernote:"",
        reviewDifficulty:"",
        reviewFun:"",
        reviewTime:"",
        reviewText:"",
        completedDate: "",
        displayReviewForm: false   // NEW
    }
    this.changeHandler = this.changeHandler.bind(this);

}


    // renderNewReviewForm = () => {

    // }


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


    changeHandler = (event, eventVal)=>{
        // console.log("in change handler", event.target.value)
       
        // let inputName = event.target.name;

        console.log("inputName in NewReviewContainer change handler: ", event)
        // console.log("inputName in NewReviewContainer change handler: ", inputName)

        this.setState(                               //commented out to test for bug
            // {[inputName]: event.target.value}
            // {inputName: event.target.value}
            {event: eventVal}
        , ()=>{console.log("change handler set state callback: ")} );
    }




    // onSubmitReviewForm = (e)=>{
    //         e.preventDefault();
    //         this.props.activeReviewIdVoidInStore()
    //         // this.toggleDisplayReviewFormState()
    //         // Need User_Project Id! 
    
    //         console.log(this.props.userProject_id)
    //         fetch(`http://localhost:3000/review/${this.props.userProject_id}`, {
    //             method: 'PATCH',                                // UserProject already exists, update review part
    //             headers: { "Content-Type": "application/json; charset=utf-8", 
    //             accepts: 'application/json' },
    //             body: JSON.stringify({
    //                 status: this.state.status,
    //                 reviewDifficulty: this.state.reviewDifficulty,
    //                 reviewFun: this.state.reviewFun,
    //                 reviewTime: this.state.reviewTime,
    //                 reviewText: this.state.reviewText,
    //                 completedDate: this.state.completedDate
    //             })                
    //         })
    //         .then( res => {
    //             console.log("Resp is: ", res) //
    //             return res.json(); 
    //         })
    //         .then( reviewData => {
    //             console.log("review :", reviewData)
    //             // this.setState({
    //             //     reviewData: reviewData
    //             // })
    //             // this.renderReviewCards();  
    //         })
    // }
 



    render(){
        // console.log("New Review Containter props: USER PROJECT ID??  ", this.props)
        return (
            <NewReviewForm 
                changeHandler={this.changeHandler}
                status={this.state.status}
                usernote={this.state.usernote}
                reviewDifficulty={this.state.reviewDifficulty}
                reviewFun={this.state.reviewFun}
                reviewTime={this.state.reviewTime}
                reviewText={this.state.reviewText}
                completedDate={this.state.completedDate}
                userProject_id={this.props.userProject_id} 
                userProject_name={this.props.userProject_name}
            />
        );
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