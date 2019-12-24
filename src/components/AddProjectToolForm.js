import React from 'react';
import './Display.css'
import {connect} from 'react-redux';


class addProjectToolForm extends React.Component{

    constructor(props) {
        super(props)
    
        // Create the ref     HARD CODED!!!  Not using. 
        // this.newTool0 = React.createRef()

        this.state={
            toolCounter : 0,
            tools: [],
            showNewTool: false
        }
      } 

    

    renderSupplySelectOptions = (index) =>{
        let rArr = [];
        rArr.push(<option selected="selected" disabled="disabled">Select Tool/Supply</option>)

        this.props.allSupplies.forEach( tool =>{          
            rArr.push(<option value={`toolId${tool.id}`} > {tool.name} </option>)
        })
        
        rArr.push(<option value="trashMe">Oops Don't Need Another Tool Disregard</option>)
        rArr.push(<option value="newTool" >Create A New Tool</option>)

        return(<select className="name" id={"NewProjTool" + index} data-id={index}>{rArr}</select> )
    }










    render(){
        console.log("this.props.showNewTool :" )
        let toolsCopy=this.props.tools
        console.log("toolsCopy --", toolsCopy)
        
        {/* TOOLS IS NOT DEFINED !  */}
        if (toolsCopy.length > 0){
        return(               
             toolsCopy.map((tool, index)=>{
                let toolId = `tool${index}`, quantityId = `quantity${index}`,
                    noteId = `note${index}`, mandatoryId = `mandatory${index}`
                return (
                    <div key={index}>
                        <label htmlFor={toolId}>{`Tool #${index}`}</label>
                        
                        Tool: {this.renderSupplySelectOptions(index)} <br/>

                        Quantity: <input 
                            type="number"
                            name={"NewProjToolQuantity" + index}
                            data-id={index} 
                            id = {toolId}
                            // value={this.props.tool[index].quantity}
                            value={toolsCopy[index].quantity}
                            className="quantity"
                            min="1" 
                            max="999"
                            placeholder=" # "

                            ></input><br/>
                        Note: <input 
                            type="text" 
                            name={"NewProjToolNote" + index}
                            data-id={index} 
                            id = {toolId}
                            value={toolsCopy[index].note}
                            className="note"
                            placeholder="Measurement info, substitutes, tips, etc."

                            /> <br/>
                        Mandatory: <input 
                            type="checkbox" 
                            name={"NewProjToolMandatory" + index} 
                            data-id={index} 
                            id = {toolId}
                            value={toolsCopy[index].mandatory}
                            className="mandatory"

                            /><br/>
                        
                        <div className={this.props.showNewTool.includes(index.toString()) ? "newToolShow" : "newToolHide"} ref={this.newTool0}> 

                        New Tool Name: <input 
                            type="text" 
                            name={"NewProjToolNewToolName" + index} 
                            data-id={index} 
                            id = {toolId}
                            value={toolsCopy[index].NewProjToolNewToolName}
                            placeholder= "New Tool Name"
                            className="NewProjToolNewToolName"
                            // ref={ function(node){ this.inputValue = node }.bind(this) }
                            // className={`newTool${index}`}
                            // className="newToolHide"
                            // style={display:'none'}

                        /><br/>
                        New Tool Description: <input 
                            type="text" 
                            name={"NewProjToolNewToolDescription" + index} 
                            data-id={index} 
                            id = {toolId}
                            value={toolsCopy[index].NewProjToolNewToolDescription}
                            placeholder= "New Tool Description- Not Project Specific"
                            className="NewProjToolNewToolDescription"
                        /><br/>
                        </div>

                    <br/>
                    </div>
                )
            })
        

        )
        } else {
            return(
                null
            )
        }
    }



}

function mapStateToProps(state){
      return({
          user: state.user

      })
  }
  

export default connect(mapStateToProps, null)(addProjectToolForm);