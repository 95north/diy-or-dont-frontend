import React from 'react';
import { Route , withRouter, Redirect} from 'react-router-dom';
import { browserHistory } from 'react-router';
import {connect} from 'react-redux';
import './Sidebar.css'


class ShoppingList extends React.Component{
    state = {
    }


    changeHandler = (event)=>{
        // console.log("in change handler", event.target.value)
        let inputName = event.target.name
        console.log("inputName", inputName)
        this.setState(
            {[inputName]: event.target.value}
        )
    }


    onSubmitReviewForm = (e)=>{
            e.preventDefault();
            // Need User_Project Id! 
    
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
                res.json(); 
            })
            .then( reviewData => {
                console.log("review :", reviewData)
                // this.setState({
                //     reviewData: reviewData
                // })
                // this.renderReviewCards();  
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


    checkForSupplyInToolbox = (xx) =>{
        console.log( "TEST ", xx)
    }


    renderTableRows = () => {
        let allUserSupplies = this.props.userSupplies.userSupplies
        let relevantCommoditySupplies = this.props.userSupplies.relevantSupplyObjs
        console.log("this.props.userSupplies.userSupplies", this.props.userSupplies.userSupplies)
        console.log("this.props.userSupplies.relevantSupplyObjs", this.props.userSupplies.relevantSupplyObjs)

        return allUserSupplies.map(function ( uSupply ){

            // for each relevantSupplyCommodity, find the userSupply record. 
            let supplyCommodity = relevantCommoditySupplies.find( s => uSupply.supply_id === s.id);
            // console.log("supply in Shopping List: ", supply)
            // console.log("userSupply in Shopping List: ", userSupply)
            
            
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
                        console.log("supply_id ", supply_id  )
                        console.log("us.supply_id", us.supply_id )
                        return (us.supply_id === supply_id && us.intoolbox)
                            return true
                        
                    })
                }
                
                let haveSupplyInToolbox = supply_in_toolbox(supplyCommodity.id)
                console.log("haveSupplyInToolbox", haveSupplyInToolbox )
                
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
                    </tr>
                )
                } 
        })
    }



    render(){
        console.log("shopping list  props:   ", this.props)
        let tableRows = this.renderTableRows();
        console.log("tableRows in render Shopping List: ", tableRows)


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