import {combineReducers} from 'redux';
import cloneDeep from 'lodash/cloneDeep';

const defaultState ={
    // user_token: null, 			// returned from Login fetch request
	// user_id: null, 			// returned from Login fetch request
    // username: 'Nancy',
    // userLocation:  'atop red bicycle',
    user: {},
    user_id: '',
	userProjects: [],       //  IS NOT USED HERE??  Is just PROJECTS[  [(user_proj/“reviews”,  proj,  proj_supplies], … ]
    userSupplies: [],       //  user’s user_supplies     — set in ProjectContainer 
    relevantSupplyObjs: [], //  Supply DB Table objects that user has    — set in ProjectContainer
    searchTerm: '',
    activeProjectId: false,
    activeReviewId: false,
    newProjectFormFlag: false,


}


// only extracts/manipulates the user portion of state
function userReducer(state=defaultState.user, action){   //App
    console.log(" userReducer on login action payload : ", action.payload) // now id&token showing undefined after log in 
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
    // console.log("user App Data - action payload : ", action.payload) // now id&token showing undefined after log in 

    switch(action.type){
        // toggle have / need tool.
        // need to update store - trigger re-render
        case "ADD_USER_APP_DATA":
            return action.payload;
        case "DELETE_USER_SUPPLY":
            // console.log("in Reducer DELETE_USER_SUPPLY")
            let userSuppliesCopy = state.userSupplies
            let eliminate= userSuppliesCopy.find(us => us.id === action.payload.userSupplyId)
            let returnArr = userSuppliesCopy.filter(function (us){
                return (us.id !== eliminate.id);
            })
            return ({...state, userSupplies: returnArr}) // is ONLY: {user_id: x, user_token: x}
        case "MOVE_FROM_SHOPPING_LIST_TO_TOOLBOX":
            let userSuppliesLocal = state.userSupplies
            let toToolbox= userSuppliesLocal.find(us => us.id === action.payload.userSupplyId)
            toToolbox.userneeds = false
            toToolbox.intoolbox = true
            return ({...state, userSupplies: userSuppliesLocal}) // is ONLY: {user_id: x, user_token: x}
        case "DELETE_USER_PROJECT":   // NOT USED!!! THIS IN REGULAR STATE OF PROJ CONTAINER!!! 
            let userProjectsCopy= cloneDeep(state.projects);
            let returnArray = []; 
            userProjectsCopy.forEach( function (proj){
                if (proj[2]["id"]!== action.payload.userProjectIdToDelete){
                    returnArray.push(proj)
                } else {
                }
            })
            return ({...state, projects: returnArray}) // is ONLY: {user_id: x, user_token: x}
        
        default: 
            return state
    }
}


function searchTermReducer(state=defaultState.searchTerm, action){   //App
    // console.log("action payload  SEARCH TERM: ", action.payload) // now id&token showing undefined after log in 
    switch(action.type){
        case "UPDATE_SEARCH_TERM":
            return action.payload   // is ONLY: {user_id: x, user_token: x}
        default: 
            return state
    }
}


function activeProjectIdReducer(state=defaultState.activeProjectId, action){
    switch(action.type){
        case "UPDATE_ACTIVE_PROJECT_ID":
            // console.log("UPDATE_ACTIVE_PROJECT_ID in the redcer", action.payload)
            // OK- allProjectsCont + ReviewsCont both getting this in props
            return action.payload   
        case "VOID_ACTIVE_PROJECT_ID":
            return false  
        default: 
            return state
    }
}


function activeReviewIdReducer(state=defaultState.activeReviewId, action){
    switch(action.type){
        case "UPDATE_ACTIVE_REVIEW_ID":
            return action.payload   
        case "VOID_ACTIVE_REVIEW_ID":
            return false 
        default: 
            return state
    }
}


function newProjectFormFlagReducer(state=defaultState.activeReviewId, action){
    switch(action.type){
        case "ACTIVATE_NEW_PROJECT_FORM_FLAG":
            console.log("ACTIVATE_NEW_PROJECT_FORM_FLAGin the redcer")
            return true   
        case "VOID_NEW_PROJECT_FORM_FLAG":
            return false  
        default: 
            return state
    }
}



// function UserSupplyReducer(state= defaultState.userSupplies){

// }


const reducer=combineReducers({
    userSupplies: projectContainerReducer,
    user: userReducer,
    searchTerm: searchTermReducer,
    activeProjectId: activeProjectIdReducer,
    activeReviewId: activeReviewIdReducer,
    newProjectFormFlag: newProjectFormFlagReducer

})

export default reducer;