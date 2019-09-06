import React from 'react';
import { Route , withRouter, Redirect} from 'react-router-dom';
import { browserHistory } from 'react-router';
import {connect} from 'react-redux';
import './Sidebar.css'


class ShoppingList extends React.Component{
    state = {
    }


    onDeleteItemClick= (e, userSupplyId) =>{
        e.preventDefault();
        fetch(`http://localhost:3000/user_supplies/${userSupplyId}`, {
            method: 'DELETE',                   // UserProject already exists, update review part
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


    moveUserSupplyFromShoppingListToToolbox = (e, userSupplyId) =>{
        e.preventDefault();
        console.log("clicked Move to Toolbox")
        fetch(`http://localhost:3000/move_to_toolbox/${userSupplyId}`, {
            method: 'PATCH',                                // UserProject already exists, update review part
            headers: { "Content-Type": "application/json; charset=utf-8", 
            accepts: 'application/json' },
            body: JSON.stringify({
                userSupplyId: "BLAH"
            })                
        })
        .then( res => {
            console.log("Resp is: ", res) //
            return res.json(); 
        })
        .then( patchJSON => {
            console.log("patchJSON  :", patchJSON)
        })
    }


    renderTableRows = () => {
        let allUserSupplies = this.props.userSupplies.userSupplies
        let relevantCommoditySupplies = this.props.userSupplies.relevantSupplyObjs
        // console.log("this.props.userSupplies.userSupplies", this.props.userSupplies.userSupplies)
        // console.log("this.props.userSupplies.relevantSupplyObjs", this.props.userSupplies.relevantSupplyObjs)

        return allUserSupplies.map(( uSupply ) => {

            // for each relevantSupplyCommodity, find the userSupply record. 
            let supplyCommodity = relevantCommoditySupplies.find( s => uSupply.supply_id === s.id);            
            
            if(uSupply.userneeds === true || uSupply.userneeds === "true"){  // only display if in shopping list
                // console.log("THIS", this) // undefined
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
                let date = formatDate(uSupply.updated_at)


                let supply_in_toolbox = (supply_id) =>{          //look if have item in toolbox 
                    // console.log("supply_id", supply_id)
                    // console.log("us_id.supply_id", uSupply.supply_id)
                    return allUserSupplies.find( us => {
                        return (us.supply_id === supply_id && us.intoolbox)
                    })
                }
                let haveSupplyInToolbox = supply_in_toolbox(supplyCommodity.id)


                return(
                    <tr>
                        <td>{supplyCommodity.name} </td>
                        <td>{supplyCommodity.description} </td>
                        <td>{uSupply.quantity} </td>
                        <td>{uSupply.measurement} </td>
                        <td> {uSupply.project_name ? uSupply.project_name : "Not recorded"} </td>
                        {/* <td>{String(uSupply.intoolbox)} </td> */}
                        <td>{haveSupplyInToolbox ? "yes" : "no"} </td>

                        {/* <td>{formatDate(uSupply.updated_at)} </td> */}
                        <td>{date} </td>       

                        {/* <td style="display:none;"> Project ID </td>  GETTTING ERROR*/}
                        <td> {uSupply.id} </td>
                        <td> <button onClick={(e)=>this.onDeleteItemClick(e, uSupply.id) }> Delete </button> </td>
                        <td> <button onClick={(e)=>this.moveUserSupplyFromShoppingListToToolbox(e, uSupply.id)}> Move To Toolbox </button> </td>
                    </tr>
                )
                } 
        })
    }



    render(){
        // console.log("shopping list  props:   ", this.props)
        let tableRows = this.renderTableRows();
        // console.log("tableRows in render Shopping List: ", tableRows)


        return(
            <> 
            <br/><br/>  SHOPPING LIST
            <table>
                <tr>
                    <th> Tool/Supply Name </th>
                    <th> Description </th>
                    <th> Quantity </th> 
                    <th> Measurement/Note </th>
                    <th> Project For </th>
                    <th> In Toolbox? </th>
                    <th> Supply Last Updated </th>
                    <th style={{display:'none;'}}> Project ID </th>
                    <th> Delete Item </th>
                    <th> Move to Toolbox </th>
                </tr>
                {tableRows}
            </table>
            </>
        )
    } // render


}



function mapDispatchToProps(dispatch){
    return({
        // addNeedTool: ()=> dispatch({type: "ADD_TOOL_NEED"}),
        // unNeedTool: ()=> dispatch({type: "UN_NEED_TOOL"})
    })
}


function mapStateToProps(state){
    return({
        userSupplies: state.userSupplies,
        user: state.user
    })
}


export default connect(mapStateToProps, mapDispatchToProps)(ShoppingList);