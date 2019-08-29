import {combineReducers} from 'redux';

const defaultState ={
    username: 'Nancy',
	userLocation:  'atop red bicycle',
	userProjects: [],   //  [  [(user_proj/“reviews”,  proj,  proj_supplies], … ]
	userSupplies: [],   //  [ user_supplyObj  + name:supply.name,   … ] 
	searchTerm: ''	
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


const reducer=combineReducers({
    userSupplies: projectContainerReducer
})

export default reducer;