import React from 'react';

import {connect} from 'react-redux';
import ReactDOM from 'react-dom';
import './Sidebar.css'


class NewReviewForm extends React.Component{

    constructor(props){
        super(props);
        this.state = {
        }

    }


    componentWillReceiveProps(nextProps){           // gets logged 6 times, once for each MyProjCard
        // get a log for this after close each OPEN review, too, with the result of API fetch for user's review.
        // ie. 6xm reviews each all hit componentWillUpdateProps
        console.log("Inside componentWillReceiveProps, nextProps is: ", nextProps)
        console.log("nextProps.value !== this.props.value : ", nextProps.value !== this.props.value);

        if(nextProps.value !== this.props.value){
            if(typeof(this.props.changeHandler) === 'function'){
                this.props.changeHandler(nextProps.name, nextProps.value)
            }
        }
    }
    
    handleOnChange=(e)=> {
        console.log("In NewReviewForm, handleOnChange")
        let key = e.target.name
        let value = e.target.value;
        
        if(typeof(this.props.changeHandler) === 'function'){
        this.props.changeHandler(key, value)
        }
    }

    changeHandler=()=>{console.log("Not Crashing, good")}
  
// render() {
//     return (
//       <input 
//         onChange={this.handleOnChange.bind(this)}
//         type={this.props.type}
//         name={this.props.name}
//         value={this.props.value}/>
//     )
//   }
// }

    renderNewReviewForm = () => {
        if(this.props.activeReviewId === this.props.userProject_id){
            console.log("Active Review Id New Review Form is: ", this.props.activeReviewId ); //check only 1 active @ time
            return(
                // <div className={ this.state.displayReviewForm ? null : "go-away"}> 
                // ^^ Makes it super buggy, and review forms align with cards roughly (but staggered)
                // <div className="panel-wrap">
                //     <div className="panel">
                    <div id="myreviewpanel">
    
                        <form onSubmit={((e)=>this.onSubmitReviewForm(e))}>
                        <span onClick={((e)=>this.props.activeReviewIdVoidInStore(this.props.project_id))}> X </span>
                            <br/>
                                Review:  {this.props.userProject_name} <br/><br/>
    
                                Status: 
                                <select
                                    name="status" 
                                    onChange={this.handleOnChange.bind(this)}
                                    defaultValue={this.props.status}  // got error: `value` prop on `select` should not be null..  It should be ""  ??!
                                    // onChange={() => console.log("onChange in status")}
                                    // onMouseEnter={() => console.log("onMouseEnter in status")} // works!!! bubbles ok
                                >
                                    <option value="" selected="selected" disabled> Choose One </option>
                                    {/* <option value="" selected="selected" disabled> Choose One </option> Commenting this out made no diff!  */}
                                    <option value="Not Started"> Not Started </option>
                                    <option value="In Progress"> In Progress </option>
                                    <option value="Completed"> Completed </option>
                                    <option value="Gave Up"> I Gave Up </option>
                                </select><br/>
    
                                Difficulty of Project: <br/>
                                <select
                                    name="reviewDifficulty" 
                                    onChange={(e)=>{this.handleOnChange(e)}}
                                    defaultValue={this.props.reviewDifficulty} 
                                    // onChange={() => console.log("onChange in status")}
                                >
                                    <option value="" selected="selected" disabled> Choose One </option>
                                    <option value="1"> 1 (Very Easy) </option>
                                    <option value="2"> 2 </option>
                                    <option value="3"> 3 </option>
                                    <option value="4"> 4 </option>
                                    <option value="5"> 5 (Difficult) </option>
                                </select><br/>
    
                               Miserable or Fun? : <br/>
                                <select
                                    name="reviewFun" 
                                    value={this.props.reviewFun} 
                                    onChange={(e)=>{this.handleOnChange(e)}}
                                    // onChange={this.handleOnChange}
                                >
                                    <option value="" selected="selected" disabled> Choose One </option>
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
                                    value={this.props.reviewTime} 
                                    placeholder="# Hours to Complete?" 
                                    onChange={(e)=>{this.handleOnChange(e)}}
                                /><br/>
    
                                Add Notes:  <br/>
                                <input 
                                    type="text" 
                                    name="reviewText" 
                                    value={this.props.reviewText} 
                                    placeholder="Enter review text here" 
                                    onChange={((e)=>this.handleOnChange(e))}
                                /><br/>
    
                                Completed Date <br/><br/>
    
                                <input 
                                    type="submit" 
                                    value=" Submit "
                                    
                                /><br/>
    
                        </form>
                    </div>
            )
            } else {
                return(null)
            }
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
        console.log("Props in NewReviewForm", this.props)
        // console.log("New Review Containter props: USER PROJECT ID??  ", this.props)
        return ReactDOM.createPortal(this.renderNewReviewForm(), document.getElementById('root'));
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


export default connect(mapStateToProps, mapDispatchToProps)(NewReviewForm);