import React from 'react';
import { Route , withRouter, Redirect} from 'react-router-dom';
import { browserHistory } from 'react-router';
import {connect} from 'react-redux';
import './Sidebar.css'
import './Table.css'


class ToolboxDisplay extends React.Component{
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
 

    renderTableRows = () => { 
        let filteredUserSupplies = this.props.userSupplies.userSupplies.filter(function(supply){
            return (supply.intoolbox === true  || supply.intoolbox === "true" )
        })    // Checked, this works! 

        let allRelevantSupplyObjs = this.props.userSupplies.relevantSupplyObjs 
        let allUserSupplies = this.props.userSupplies.userSupplies

        return filteredUserSupplies.map(function ( supply ){

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

            let supply_in_shoppingList = (supply_id) =>{          //look if have item in toolbox 
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
                        {/* <td>{String(supply.userneeds)} </td> */}
                        <td>{haveSupplyInshoppingList ? "yes" : "no"} </td>
                        {/* <td>{this.formatDate(userSupply.updated_at)} </td> */}
                        {/* <td>{supply.updated_at} </td>                      */}
                        <td>{date} </td>  
                    </tr>
                )
        })

        // let allUserSupplies = this.props.userSupplies.userSupplies
        // return this.props.userSupplies.relevantSupplyObjs.map(function ( supply ){
        //     // let userSupply = this.props.userSupplies.userSupplies.find( us => us.supply_id === supply.id);
        //     //  ^ Can't nest this.props bc scope issues!   this.props undefined. 
    }



    render(){
        console.log("Toolbox props:   ", this.props)
        let tableRows = this.renderTableRows();
        console.log("tableRows in render: ", tableRows)


        return(
            <> 
            <br/><br/>  TOOLBOX
            <table>
            {/* <table style="width:100%"> */}
                <tr>
                    <th> Tool/Supply Name </th>
                    <th> Description </th>
                    <th> Quantity </th> 
                    <th> Measurement </th>
                    <th> On Shopping List? </th>
                    <th> Supply Last Updated </th>
                </tr>
                {tableRows}
            </table>
            </>
        )
    }

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


export default connect(mapStateToProps, mapDispatchToProps)(ToolboxDisplay);