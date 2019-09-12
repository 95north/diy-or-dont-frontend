import React from 'react';
import { Route , withRouter, Redirect} from 'react-router-dom';
import { browserHistory } from 'react-router';
import {connect} from 'react-redux';
import './Sidebar.css'
import './Display.css'


class ShoppingList extends React.Component{
    state = {
        textMessage: "false",
        phoneNumber: ""
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
            this.props.deleteUserSupplyFromShoppingList({
                userSupplyId: userSupplyId
            })
            return res.json(); 
        })
        .then( dData => {
            console.log("deleted Tooxbox item resp:", dData)
            console.log("deleted Tooxbox item userSupplyId:", userSupplyId)
            // this.props.triggerReRender()  // GETS CALLED, BUT DOESNT WORK
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
            this.props.moveFromShoppingListToToolbox({
                userSupplyId: userSupplyId
            })
            // this.props.triggerReRender()
        })
    }


    renderTableRows = () => {
        let allUserSupplies = this.props.userSupplies.userSupplies
        let relevantCommoditySupplies = this.props.userSupplies.relevantSupplyObjs
        // console.log("this.props.userSupplies.userSupplies", this.props.userSupplies.userSupplies)
        // console.log("this.props.userSupplies.relevantSupplyObjs", this.props.userSupplies.relevantSupplyObjs)
        if (allUserSupplies!== "undefined" && allUserSupplies!== undefined ) {  
            console.log("Shopping list All User Supplies: ", allUserSupplies)
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
            })  // ends .map
        } else {
            return (
                null
            )
        }
    }


    onSendTextMessageButtonClick = (e)=>{
        e.preventDefault();
        console.log("Clicked Send Text MESSAGE !! ")
        this.setState({textMessage: "true"})
    }


    changeHandler =(event)=>{
        let inputName = event.target.name
        console.log("inputName", inputName)
        this.setState(
            {[inputName]: event.target.value}
        )
    }

    sendTextMessage = (e) =>{
        e.preventDefault()
        let textBody = this.renderShoppingListTextMessageBody();
        let toPhone = "1" + this.state.phoneNumber.toString()

        fetch(`http://localhost:3000/text_shopping_list`, {
            method: 'POST',                                // UserProject already exists, update review part
            headers: { "Content-Type": "application/json; charset=utf-8", 
            accepts: 'application/json' },
            body: JSON.stringify({
                to: toPhone,
                text: textBody
            })                
        })
        .then( res => {
            console.log("Resp is: ", res) //
            this.setState({textMessage: "false"})
        })
    }


    renderShoppingListTextMessageBody = () => {
        let allUserSupplies = this.props.userSupplies.userSupplies
        let relevantCommoditySupplies = this.props.userSupplies.relevantSupplyObjs

        return allUserSupplies.map(( uSupply ) => {

            // for each relevantSupplyCommodity, find the userSupply record. 
            let supplyCommodity = relevantCommoditySupplies.find( s => uSupply.supply_id === s.id);            
            
            if(uSupply.userneeds === true || uSupply.userneeds === "true"){  // only display if in shopping list

                let supply_in_toolbox = (supply_id) =>{          //look if have item in toolbox 
                    return allUserSupplies.find( us => {
                        return (us.supply_id === supply_id && us.intoolbox)
                    })
                }
                let haveSupplyInToolbox = supply_in_toolbox(supplyCommodity.id)


                return(
                    [supplyCommodity.name, 
                        supplyCommodity.description, 
                        (uSupply.quantity ? uSupply.quantity : 1), 
                        (!uSupply.measurement ?  "No measurement note" : uSupply.measurement ), 
                        // ((uSupply.project_name === "" || uSupply.project_name === undefined) ?  "No Project Listed" : uSupply.project_name ), 
                        (!uSupply.project_name ?  "No Project Listed" : uSupply.project_name ), 
                        
                        (haveSupplyInToolbox ? "Is In My Toolbox" : "Not in My Toolbox") 
                    ]
                )
                } 
        })  // ends map allUserSupplies, which is returned 
    }




    render(){
        console.log("STATE is Shopping List   ", this.state)

        // console.log("shopping list  props:   ", this.props)
        let tableRows = this.renderTableRows();
        // console.log("tableRows in render Shopping List: ", tableRows)


        return(
            <> 
            <br/><br/>  
            <div className="toolboxHeaderDiv">
                <div className="headerText"> 
                SHOPPING LIST
                </div>
            </div>
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

            <br/>
            <button onClick={((e)=>this.onSendTextMessageButtonClick(e))}> Text Me My Shopping List!  </button>

            {/* <div className="newToolHide">   NO Idea why it doesn't like this className but newToolHide works..*/}
            <div className={this.state.textMessage==="false" ? "newToolHide" : "newToolShow" } >                    
                <form onSubmit={(e=>this.sendTextMessage(e))}>
                    Enter Your 10 digit Phone Number (no 1 US Code), no dashes or spaces: <br/>
                    <input type="number" name="phoneNumber" onChange={this.changeHandler} value={this.state.phoneNumber} min="2000000000" max="9999999999" placeholder="enter 10 digit US phone number, no spaces or dashes"></input>
                    <input type="submit" value=" Send Text " />
                </form>
            </div>

            <br/>
            <br/>
            </>
        )
    } // render


}



function mapDispatchToProps(dispatch){
    return({
        deleteUserSupplyFromShoppingList: (userSupplyId)=> dispatch(
            {type: "DELETE_USER_SUPPLY",
            payload: userSupplyId
        }),
        moveFromShoppingListToToolbox: (userSupplyId)=> dispatch(
            {type: "MOVE_FROM_SHOPPING_LIST_TO_TOOLBOX",
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


export default connect(mapStateToProps, mapDispatchToProps)(ShoppingList);