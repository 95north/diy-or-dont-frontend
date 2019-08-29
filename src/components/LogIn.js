import React from 'react';

class LogIn extends React.Component{
    state={
        username:"",
        password:""
    }

    //  For Dogs Squirrels, this was in form. 
    changeHandler = (event)=>{
        // console.log("in change handler", event.target.value)
        let inputName = event.target.name
        // console.log("inputName", inputName)
        this.setState(
            {[inputName]: event.target.value}
            )
    }





    render(){
        return(
            <React.Fragment>
                <h1>Log In Below: </h1>
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
                        placeholder="Password" 
                        value={this.state.password} 
                        onChange={this.changeHandler}
                    />
                    <button>Login</button>
                </form>
                <br/><br/>
                New Here?  <a href="/signup"> Sign Up!</a>

            </React.Fragment>
        )
    }


} export default LogIn;