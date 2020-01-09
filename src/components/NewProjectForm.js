import React from 'react';
import  './Card.css'
import  './Display.css'
import {connect} from 'react-redux';
import AddProjectToolForm from './AddProjectToolForm.js'


class NewProjectForm extends React.Component{
    state ={
        allSupplies: [],    
        newProjectName: "",
        newProjectOverview: "",
        newProjectDescription: "",
        tools: [ {name: "", quantity:"", note: "", mandatory: "", NewProjToolNewToolName:"", NewProjToolNewToolDescription:"" } ], //tools used on new project
        showNewTool: []
    }


    componentDidMount = () =>{     
    
        fetch(`http://localhost:3000/supplies`, {
                headers: { "Content-Type": "application/json; charset=utf-8",
                    Accepts: 'application/json'
                 },
                method: 'GET',
            }).then(res => res.json() )
            .then(supplyList => {
                this.setState({allSupplies: supplyList})
            })
    }


    changeHandler = (event)=>{
        let inputName = event.target.name

        if (["name", "quantity", "note", "NewProjToolNewToolName", "NewProjToolNewToolDescription"].includes(event.target.className)) {
            if (event.target.value === "newTool"){
                console.log("In new tool!")
                this.setState({showNewTool : [...this.state.showNewTool, event.target.dataset.id]})

            } else {
                let tools = [...this.state.tools]
                tools[event.target.dataset.id][event.target.className]= event.target.value;
                this.setState({tools}, ()=> console.log("State! changeHandler for TOOLS ", this.state.tools))
            }
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
        } else if (event.target.className.includes("newTool")) {

            let stateToolArrayIndex = event.target.dataset.id[11..event.target.dataset.id.length]
            let refId = "newTool" + stateToolArrayIndex
            
            this.setState({showNewTool : [...this.state.showNewTool, event.target.dataset.id]})
        } else {
                this.setState(
                    {[inputName]: event.target.value}
                )
            }
        }


    addTool = (e) => {
        this.setState({
            tools: [...this.state.tools, {name: "", quantity:"", note: "", mandatory: "", NewProjToolNewToolName:"", NewProjToolNewToolDescription:"" }]
        })
    }



    newProjectFormSubmitHandler = (e) =>{
        e.preventDefault();

        let localTools = []
        this.state.tools.forEach( function(tool){
            if (tool["name"] !== "trashMe" ){
                localTools.push(tool)
            }
        })

        fetch(`http://localhost:3000/projects`, {
                headers: { "Content-Type": "application/json; charset=utf-8",
                    Accepts: 'application/json'
                 },
                method: 'POST',
                body: JSON.stringify({
                    newProjectName: this.state.newProjectName,
                    newProjectOverview: this.state.newProjectOverview,
                    newProjectDescription: this.state.newProjectDescription,
                    tools: localTools
                })
            }).then(res => res.json() )
            .then(postResp => {
                console.log(postResp)
                this.props.activeNewProjectVoidInStore();
                alert("Created Okay!")
            })
    }



    render(){
        let project = this.props.project
        if(this.props.newProjectFormFlag ){
            return(
                <>
                {/* <div className="panel-wrap"> */}
                    {/* <div className="panel"> */}
                    <div id="mypanel">
                    <span onClick={this.props.activeNewProjectVoidInStore}> X </span>
                        <h1> Create New Project: </h1>
                            <form 
                                onChange={( (e)=>this.changeHandler(e) )} 
                                onSubmit={((e)=>this.newProjectFormSubmitHandler(e))}
                            >
                                Project Name: <input type="text" placeholder="Eg. Hang a Shelf, Replace Crown Molding, Fix Leaky Toilet" name="newProjectName" onChange={this.changeHandler}/> <br/>
                                Project Overview / Description:<input type="text" placeholder="Eg. Hang a Shelf Using Brackets and Nails or Screws" name="newProjectOverview" onChange={this.changeHandler}/> <br/>
                                Project Instructions: <input type="text" placeholder="Detailed Instructions for how to complete project, plus any tips" name="newProjectDescription" onChange={this.changeHandler}/> <br/>

                                <br/>
                                <AddProjectToolForm 
                                    tools={this.state.tools} 
                                    allSupplies={this.state.allSupplies} 
                                    showNewTool={this.state.showNewTool}
                                /><br/> 
                                <button type="button" onClick={this.addTool} >Add Another Tool to this Project</button><br/>


                                <br/>
                                <input type="submit" value="Create New Project"/>


                            </form>
                    </div>
                {/* </div> */}
                </>
            )
            } else {
                return null
            } 
    }

}

function mapDispatchToProps(dispatch){
    return({        
        activeNewProjectVoidInStore: ()=> dispatch(
            {type: "VOID_NEW_PROJECT_FORM_FLAG",
        }),
    })
}



function mapStateToProps(state){
      return({
          user: state.user,
          newProjectFormFlag: state.newProjectFormFlag          
      })
  }
  

export default connect(mapStateToProps, mapDispatchToProps)(NewProjectForm);