import { useReducer } from 'react';
import TodosContext from './createContext';
import reducer, { initialStateTodos } from './reducer';

const TodosProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialStateTodos);
    return (
        <TodosContext.Provider value={{ state, dispatch }}>
            {children}
        </TodosContext.Provider>
    );
};
export default TodosProvider;
