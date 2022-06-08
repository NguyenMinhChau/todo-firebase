import { useContext } from 'react';
import { TodosContext } from '../store';

export const TodosContextHook = () => {
    const { state, dispatch } = useContext(TodosContext);
    return { state, dispatch };
};
