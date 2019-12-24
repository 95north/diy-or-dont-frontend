import React from 'react';
import './components/LoginSignup.css'

class SignUp extends React.Component{
    state={
        username:"",
        password:""
    }

    //  For Dogs Squirrels, this was in form. 
    changeHandler = (event)=>{
        // console.log("in change handler", event.target.value)
        let inputName = event.target.name
        console.log("inputName", inputName)
        this.setState(
            {[inputName]: event.target.value}
            )
    }





    render(){
        return(
            <React.Fragment>
                <div className="loginSignup" >

                <div className="diyTitle"> DIY or Don't </div>
                <div className="sticky" >
                <div className="loginForm" >
                <h1>Sign Up Below: </h1>
                <form onSubmit={e => this.props.submitHandler(e, this.state)} >
                    <input 
                        type = "text" 
                        name = "username"
                        placeholder="Username" 
                        value={this.state.username} 
                        onChange={this.changeHandler}
                    />
                    <input 
                        type = "text" 
                        name = "password"
                        placeholder="Create Password" 
                        value={this.state.password} 
                        onChange={this.changeHandler}
                    />
                    <button>Sign Up</button>
                </form>
                </div>
                </div>
                </div>

            </React.Fragment>
        )
    }


} export default SignUp;