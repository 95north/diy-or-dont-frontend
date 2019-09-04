import React from 'react';
import  './Card.css'
import {connect} from 'react-redux';
import ReviewContainer from './ReviewContainer.js'
import AddProjectToolForm from './AddProjectToolForm.js'


class NewProjectForm extends React.Component{
    state ={
        allSupplies: [],    // list of all extant tools
        newProjectName: "",
        newProjectOverview: "",
        newProjectDescription: "",
        tools: [{name: "", quantity:"", note: "", mandatory: ""}] //tools used on new project
    }


    componentDidMount = () =>{
    // fetchAllTools = () =>{
        fetch(`http://localhost:3000/supplies`, {
                headers: { "Content-Type": "application/json; charset=utf-8",
                    Accepts: 'application/json'
                 },
                method: 'GET',
            }).then(res => res.json() )
            .then(supplyList => {
                console.log("allSupplies in New Project Form: ", supplyList)
                this.setState({allSupplies: supplyList})
            })
    }


    changeHandler = (event)=>{
        // console.log("in change handler", event.target.value)
        let inputName = event.target.name
        console.log("New Project Form change handler: inputName---", inputName)
        console.log("New Project Form change handler: event target value---", event.target.value)
        console.log("New Project Form change handler: TypeOf target value---", typeof event.target.value)
        console.log("New Project Form change handler: event target---", event.target)
        console.log("New Project Form change handler: event.target.dataset.id---", event.target.dataset.id)
        console.log("New Project Form change handler: event.target.className---", event.target.className)


        if (["name", "quantity", "note"].includes(event.target.className)) {
            let tools = [...this.state.tools]
            tools[event.target.dataset.id][event.target.className]= event.target.value;
            this.setState({tools}, ()=> console.log("State! changeHandler for TOOLS ", this.state.tools))
        } else if (event.target.className === "mandatory") {
            let theBooleanVal;

            if (event.target.value === undefined || event.target.value === "" ||  event.target.value === "false"){
                theBooleanVal = false
            } else {
                theBooleanVal = true
            }

            let tools = [...this.state.tools]
            tools[event.target.dataset.id][event.target.className]= !theBooleanVal;
            this.setState({tools}, ()=> console.log("State! changeHandler for TOOLS ", this.state.tools))
        } else {
            this.setState(
                {[inputName]: event.target.value}
            )
        }
    }


    addTool = (e) => {
        this.setState({
            tools: [...this.state.tools, {name: "", quantity:"", note: "", mandatory: ""}]
        })
    }

    //refactor to render tool Options. 
    // renderSupplySelectOptions = () =>{
    //     let rArr = [];
    //     this.state.allSupplies.forEach( tool =>{          
    //         rArr.push(<option value={tool.id}> {tool.name} </option>)
    //     })
    //     return(<select name={"NewProjTool" + this.state.toolCounter}>{rArr}</select> )
    // }


    // returnAdditionalToolForm = () =>{
        
    //     this.setState({toolCounter : this.state.toolCounter+=1})
    //     console.log("tool counter in return addl form: ", this.state.toolCounter)
    //     return(
    //         <>
    //         Tool: {this.renderSupplySelectOptions()} <br/>
    //         Quantity: <input type="number" name={"NewProjToolQuantity" + this.state.toolCounter} min="1" max="999"></input><br/>
    //         Note: <input type="text" name={"NewProjToolNote" + this.state.toolCounter}/> <br/>
    //         Mandatory: <input name={"NewProjToolMandatory" + this.state.toolCounter} type="checkbox" onClick={this.changeHandler}/><br/>

    //         <button type="button" onClick={this.changeHandler} >Add Another Tool to this Project</button><br/>
    //         </>   
    //     )
    // }


    newProjectFormSubmitHandler = (e) =>{
        e.preventDefault();
        console.log("state in new project form SUBMIT: ", this.state)

        console.log("this.props.user.user_id, ", this.props.user.user_id)
        // if (this.props.user.user_id === undefined || this.props.user.user_id === "undefined" ){
        //     alert("Login!")
        // } 


            fetch(`http://localhost:3000/projects`, {
                headers: { "Content-Type": "application/json; charset=utf-8",
                    Accepts: 'application/json'
                 },
                method: 'POST',
                body: JSON.stringify({
                    newProjectName: this.state.newProjectName,
                    newProjectOverview: this.state.newProjectOverview,
                    newProjectDescription: this.state.newProjectDescription,
                    tools: this.state.tools
                })
            }).then(res => res.json() )
            .then(postResp => console.log(postResp))
        
    }



    render(){
        let project = this.props.project

        return(
            <>
            <input id="clicker" type="checkbox" onClick={this.toggleDisplayReviewsState}/>
            <label for="clicker">Show New Project Form</label>
            <div className="panel-wrap">
                <div className="panel">
                    <span onClick={"this.parentElement.style.display='none'"}> X </span>
                    <h1> Create New Project: </h1>
                        <form onChange={( (e)=>this.changeHandler(e) )} onSubmit={((e)=>this.newProjectFormSubmitHandler(e))}>
                            Project Name: <input type="text" placeholder="Eg. Hang a Shelf, Replace Crown Molding, Fix Leaky Toilet" name="newProjectName" onChange={this.changeHandler}/> <br/>
                            Project Overview / Description:<input type="text" placeholder="Eg. Hang a Shelf Using Brackets and Nails or Screws" name="newProjectOverview" onChange={this.changeHandler}/> <br/>
                            Project Instructions: <input type="text" placeholder="Detailed Instructions for how to complete project, plus any tips" name="newProjectDescription" onChange={this.changeHandler}/> <br/>

                            <br/>
                            {/* Tool: {this.renderSupplySelectOptions()} <br/>
                            Quantity: <input type="number" name={"NewProjToolQuantity" + this.state.toolCounter} min="1" max="999"></input><br/>
                            Note: <input type="text" name={"NewProjToolNote" + this.state.toolCounter}/> <br/>
                            Mandatory: <input name={"NewProjToolMandatory" + this.state.toolCounter} type="checkbox" onClick={this.changeHandler}/><br/> */}

                            
                            {/* TOOLS IS NOT DEFINED !  */}
                            {/* { tools.map((tool, index)=>{
                                let toolId = `tool${index}`, quantityId = `quantity${index}`,
                                 noteId = `note${index}`, mandatoryId = `mandatory${index}`
                                return (
                                    <div key={index}>
                                        <label htmlFor={toolId}>{`Tool #${index+1}`}</label>
                                        Tool: {this.renderSupplySelectOptions()} <br/>
                                        Quantity: <input type="number" name={"NewProjToolQuantity" + this.state.toolCounter} min="1" max="999"></input><br/>
                                        Note: <input type="text" name={"NewProjToolNote" + this.state.toolCounter}/> <br/>
                                        Mandatory: <input name={"NewProjToolMandatory" + this.state.toolCounter} type="checkbox" onClick={this.changeHandler}/><br/>

                                    </div>
                                )
                            })} */}
                            <AddProjectToolForm tools={this.state.tools} allSupplies={this.state.allSupplies} /><br/> 
                            <button type="button" onClick={this.addTool} >Add Another Tool to this Project</button><br/>


                            <br/>
                            <input type="submit" value="Create New Project"/>


                        </form>
                </div>
            </div>

            </>



            // <div className="card">
  
            // </div>

        )
    }



}

function mapStateToProps(state){
      return({
          user: state.user

      })
  }
  

export default connect(mapStateToProps, null)(NewProjectForm);