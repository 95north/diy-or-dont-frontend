import React from 'react';
import { Route , withRouter, Redirect} from 'react-router-dom';
import { browserHistory } from 'react-router';
import {connect} from 'react-redux';
import './Sidebar.css'
import './Table.css'
import './ToolContainer.css'


class ToolboxDisplay extends React.Component{
    constructor (props){
        super(props);
      
        this.state = {
            triggerRender: ""
          };      
    }


    onDeleteItemClick111= (e, userSupplyId) =>{     // UNUSED, refactor map() to use THIS to access this
        e.preventDefault();
        fetch(`http://localhost:3000/user_supplies/${userSupplyId}`, {
            method: 'DELETE',                   
            headers: { "Content-Type": "application/json; charset=utf-8", 
            accepts: 'application/json' },
            body: JSON.stringify({
               userSupplyIdToDelete: userSupplyId
            })                
        })
        .then( res => {
            console.log("Resp is: ", res) //
            res.json(); 
        })
        .then( dData => {
            console.log("deleted Tooxbox item resp:", dData)
        })
    }


    formatDate = (input) => {
        if (input) {
            let d = input.toString()     
            let output = []
            let deMilitarizedHour;
            let amPm = "AM"

                if (parseInt([d[11], d[12]].join("")) > 12 ) {
                    deMilitarizedHour = parseInt([d[11], d[12]].join("")) - 12
                    amPm = "PM"
                } else {
                    deMilitarizedHour = parseInt( [d[11], d[12]].join(""))
                }

            output.push(d[5],d[6], "-", d[8],d[9], "-", d[0],d[1],d[2],d[3], "    ", deMilitarizedHour,":",d[14],d[15], " ", amPm )
            return(output.join(""))
        } else {
            return("")
        }
    }
 

    onDeleteItemClick= (e, userSupplyId) =>{
        e.preventDefault();
        fetch(`http://localhost:3000/user_supplies/${userSupplyId}`, {
            method: 'DELETE',                 
            headers: { "Content-Type": "application/json; charset=utf-8", 
            accepts: 'application/json' },
            body: JSON.stringify({
               userSupplyIdToDelete: userSupplyId
            })                
        })
        .then( res => {
            res.json(); 
        })
        .then( dData => {
            this.props.deleteUserSupplyFromToolbox({
                userSupplyId: userSupplyId
            })
        })
    }



     renderTableRows=()=>  { 
        console.log("This in ToolboxDisplay renderTableRows: ", this) // is ToolboxDisplay class.. 

        let filteredUserSupplies = this.props.userSupplies.userSupplies.filter(function(supply){
            return (supply.intoolbox === true  || supply.intoolbox === "true" )
        })    

        let allRelevantSupplyObjs = this.props.userSupplies.relevantSupplyObjs 
        let allUserSupplies = this.props.userSupplies.userSupplies

        return filteredUserSupplies.map(( supply ) => {
            let relevantSupplyObj = allRelevantSupplyObjs.find( s => s.id === supply.supply_id);

            let formatDate = (input) => {
                if (input) {
                    let d = input.toString()     
                    let output = []
                    let deMilitarizedHour;
                    let amPm = "AM"
                        if (parseInt([d[11], d[12]].join("")) > 12 ) {
                            deMilitarizedHour = parseInt([d[11], d[12]].join("")) - 12
                            amPm = "PM"
                        } else {
                            deMilitarizedHour = parseInt( [d[11], d[12]].join(""))
                        }
                    output.push(d[5],d[6], "-", d[8],d[9], "-", d[0],d[1],d[2],d[3], "    ", deMilitarizedHour,":",d[14],d[15], " ", amPm )
                    return(output.join(""))
                } else {
                    return("")
                }
            }
            let date = formatDate(supply.updated_at)

            let supply_in_shoppingList = (supply_id) =>{          
                return allUserSupplies.find( us => {
                    return (us.supply_id === supply_id && us.userneeds)                
                })
            }
            let haveSupplyInshoppingList = supply_in_shoppingList(supply.supply_id)


                return(
                    <tr>
                        <td>{relevantSupplyObj.name}</td>
                        <td>{relevantSupplyObj.description}</td>
                        <td>{supply.quantity} </td>
                        <td>{supply.measurement}</td>
                        <td>{supply.project_name ? supply.project_name : "No Info" }</td>
                        <td>{haveSupplyInshoppingList ? "yes" : "no"} </td>
                        <td>{date} </td> 
                        <td><button onClick={(e)=>this.onDeleteItemClick(e, supply.id)} > Delete </button> </td>            
                    </tr>
                )
        })
    }



    render(){
        let tableRows = this.renderTableRows();

        return(
            <> 
            <br/><br/>  
            <div className="toolboxHeaderDiv"> 
                <div className="headerText"> 
                TOOLBOX 
                </div>
            </div>
            <table>
            {/* <table style="width:100%"> */}
                <tr>
                    <th> Tool/Supply Name </th>
                    <th> Description </th>
                    <th> Quantity </th> 
                    <th> Measurement </th>
                    <th> Added From Project: </th>
                    <th> On Shopping List? </th>
                    <th> Supply Last Updated </th>
                    <th> Remove Item? </th>
                </tr>
                {tableRows}
            </table>
            <br/>
            </>
        )
    }

}



function mapDispatchToProps(dispatch){
    return({
        deleteUserSupplyFromToolbox: (userSupplyId)=> dispatch(
            {type: "DELETE_USER_SUPPLY",
            payload: userSupplyId
          }),
    })
}


function mapStateToProps(state){
    return({
        userSupplies: state.userSupplies,
        user: state.user
    })
}


export default connect(mapStateToProps, mapDispatchToProps)(ToolboxDisplay);