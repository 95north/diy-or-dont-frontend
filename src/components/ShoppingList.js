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
            method: 'DELETE',                   
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
            method: 'PATCH',                                
            headers: { "Content-Type": "application/json; charset=utf-8", 
            accepts: 'application/json' },
            body: JSON.stringify({
                userSupplyId: "BLAH"
            })                
        })
        .then( res => {
            console.log("Resp is: ", res) 
            return res.json(); 
        })
        .then( patchJSON => {
            console.log("patchJSON  :", patchJSON)
            this.props.moveFromShoppingListToToolbox({
                userSupplyId: userSupplyId
            })
        })
    }


    renderTableRows = () => {
        let allUserSupplies = this.props.userSupplies.userSupplies
        let relevantCommoditySupplies = this.props.userSupplies.relevantSupplyObjs
        if (allUserSupplies!== "undefined" && allUserSupplies!== undefined ) {  
            console.log("Shopping list All User Supplies: ", allUserSupplies)
            return allUserSupplies.map(( uSupply ) => {

            let supplyCommodity = relevantCommoditySupplies.find( s => uSupply.supply_id === s.id);            
            
            if(uSupply.userneeds === true || uSupply.userneeds === "true"){  
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


                    let supply_in_toolbox = (supply_id) =>{         
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
                            <td>{haveSupplyInToolbox ? "yes" : "no"} </td>
                            <td>{date} </td>       
                            <td> {uSupply.id} </td>
                            <td> <button onClick={(e)=>this.onDeleteItemClick(e, uSupply.id) }> Delete </button> </td>
                            <td> <button onClick={(e)=>this.moveUserSupplyFromShoppingListToToolbox(e, uSupply.id)}> Move To Toolbox </button> </td>
                        </tr>
                    )
                } 
            }) 
        } else {
            return (
                null
            )
        }
    }


    onSendTextMessageButtonClick = (e)=>{
        e.preventDefault();
        this.setState({textMessage: "true"})
    }


    changeHandler =(event)=>{
        let inputName = event.target.name
        this.setState(
            {[inputName]: event.target.value}
        )
    }

    sendTextMessage = (e) =>{
        e.preventDefault()
        let textBody = this.renderShoppingListTextMessageBody();
        let toPhone = "1" + this.state.phoneNumber.toString()

        fetch(`http://localhost:3000/text_shopping_list`, {
            method: 'POST',                                
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
            let supplyCommodity = relevantCommoditySupplies.find( s => uSupply.supply_id === s.id);            
            
            if(uSupply.userneeds === true || uSupply.userneeds === "true"){  

                let supply_in_toolbox = (supply_id) =>{          
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
                        (!uSupply.project_name ?  "No Project Listed" : uSupply.project_name ), 
                        
                        (haveSupplyInToolbox ? "Is In My Toolbox" : "Not in My Toolbox") 
                    ]
                )
                } 
        })  // ends map allUserSupplies, which is returned 
    }




    render(){
        let tableRows = this.renderTableRows();

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
    } 

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