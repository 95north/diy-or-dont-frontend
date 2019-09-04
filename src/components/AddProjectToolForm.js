import React from 'react';
import {connect} from 'react-redux';


class addProjectToolForm extends React.Component{
    state ={
        toolCounter : 0,
        tools: []
    }


    // componentDidMount = () =>{
    //     console.log("props in addProjectToolForm: ", this.props)
    //     this.setState({tools: [this.props.tools]})
    // }
    
    renderSupplySelectOptions = (index) =>{
       
        console.log("props in addProjectToolForm renderSupplySelectOptions: ", this.props)
        let rArr = [];
            rArr.push(<option selected="selected" disabled="disabled">Select Tool/Supply</option>)

        this.props.allSupplies.forEach( tool =>{          
            rArr.push(<option value={`toolId${tool.id}`} > {tool.name} </option>)
        })
        //this.setState({toolCounter: this.state.toolCounter += 1}) crashes it. 
        rArr.push(<option value="trashMe">Oops Don't Need Another Tool Disregard</option>)
        
        return(<select className="name" id={"NewProjTool" + index} data-id={index}>{rArr}</select> )
    }


    render(){

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
                        <label htmlFor={toolId}>{`Tool #${index+1}`}</label>
                        
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