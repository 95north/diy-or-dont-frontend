import {combineReducers} from 'redux';

const defaultState ={
    // user_token: null, 			// returned from Login fetch request
	// user_id: null, 			// returned from Login fetch request
    // username: 'Nancy',
    // userLocation:  'atop red bicycle',
    user: {},
    user_id: '',
	userProjects: [],   //  [  [(user_proj/“reviews”,  proj,  proj_supplies], … ]
	userSupplies: [],   //  [ user_supplyObj  + name:supply.name,   … ] 
	searchTerm: ''	
}


// only extracts/manipulates the user portion of state
function userReducer(state=defaultState.user, action){   //App
    console.log("State (arg) in userReducer: ", state) // emptyObj {}
    console.log("action payload : ", action.payload) // now id&token showing undefined after log in 
    switch(action.type){
        // toggle have / need tool.
        case "LOGGED_IN":
            return action.payload   // is ONLY: {user_id: x, user_token: x}

            //return([...state, state.user:state]);
        default: 
            return state
    }
}


function projectContainerReducer(state=defaultState.userProjects, action){
    switch(action.type){
        // toggle have / need tool.
        case "ADD_TOOL_NEED":
            return({...state});
        case "UN_NEED_TOOL":
            return({...state});
        default: 
            return state
    }
}


function searchTermReducer(state=defaultState.searchTerm, action){   //App
    console.log("action payload  SEARCH TERM: ", action.payload) // now id&token showing undefined after log in 
    switch(action.type){
        // toggle have / need tool.
        case "UPDATE_SEARCH_TERM":
            return action.payload   // is ONLY: {user_id: x, user_token: x}

        default: 
            return state
    }
}



const reducer=combineReducers({
    userSupplies: projectContainerReducer,
    user: userReducer,
    searchTerm: searchTermReducer
})

export default reducer;