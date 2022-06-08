import moment from 'moment';
import {
    SET_TODO,
    ADD_TODO,
    TOOGLE_BUTTON_UPDATE,
    SET_ID_UPDATE,
    SET_TODO_SEARCH,
    SET_TODO_TABLE_SORT,
} from './actions';
const initialStateTodos = {
    todoItem: {
        todo: '',
        deadline: moment(new Date().toISOString()).format('YYYY-MM-DDTHH:mm'),
        todoSearch: '',
        todoTableSort: 0,
    },
    todos: [],
    toogleButtonUpdate: false,
    idUpdateTodo: '',
};
const setTodo = (payload) => {
    return {
        type: SET_TODO,
        payload,
    };
};

const addTodo = (payload) => {
    return {
        type: ADD_TODO,
        payload,
    };
};

const toogleButtonUpdate = (payload) => {
    return {
        type: TOOGLE_BUTTON_UPDATE,
        payload,
    };
};

const setIdUpdated = (payload) => {
    return {
        type: SET_ID_UPDATE,
        payload,
    };
};

const setTodoSearch = (payload) => {
    return {
        type: SET_TODO_SEARCH,
        payload,
    };
};
const setTodoTableSort = (payload) => {
    return {
        type: SET_TODO_TABLE_SORT,
        payload,
    };
};

const reducer = (state, action) => {
    switch (action.type) {
        case SET_TODO:
            const todoSet = {
                ...state,
                todoItem: {
                    ...state.todoItem,
                    ...action.payload,
                },
            };
            return todoSet;
        case ADD_TODO:
            return {
                ...state,
                todos: [...state.todos, action.payload],
            };
        case TOOGLE_BUTTON_UPDATE:
            return {
                ...state,
                toogleButtonUpdate: action.payload,
            };
        case SET_ID_UPDATE:
            return {
                ...state,
                idUpdateTodo: action.payload,
            };
        case SET_TODO_SEARCH:
            return {
                ...state,
                todoItem: {
                    ...state.todoItem,
                    todoSearch: action.payload,
                },
            };
        case SET_TODO_TABLE_SORT:
            return {
                ...state,
                todoItem: {
                    ...state.todoItem,
                    todoTableSort: action.payload,
                },
            };
        default:
            return state;
    }
};
export {
    setTodo,
    addTodo,
    toogleButtonUpdate,
    setIdUpdated,
    initialStateTodos,
    setTodoSearch,
    setTodoTableSort,
};
export default reducer;
