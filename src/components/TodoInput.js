/* eslint-disable no-fallthrough */
/* eslint-disable array-callback-return */
import React, { useRef } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import { TodosContextHook } from '../customHooks';
import { payloads } from '../store';
import { db } from '../firebase';
import styles from './Todo.module.css';

function TodoInput({ setTodos, handleDay }) {
    const { state, dispatch } = TodosContextHook();
    const { todo, deadline, todoSearch, todoTableSort } = state.todoItem;
    const refInput = useRef();
    const refInputSearch = useRef();
    const refDate = useRef();
    const handleChange = (e) => {
        dispatch(payloads.setTodo({ [e.target.name]: e.target.value }));
    };
    const handleChangeAddTask = (e) => {
        if (
            moment(state.todoItem.deadline).format('YYYY-MM-DDTHH:mm') <=
            moment(new Date().toISOString()).format('YYYY-MM-DDTHH:mm')
        ) {
            alert('Deadline must be greater than current date');
            refDate.current.focus();
        } else {
            dispatch(payloads.addTodo(state.todoItem));
            db.collection('todos').add({
                createdAt: moment(new Date().toISOString()).format(
                    'YYYY-MM-DDTHH:mm'
                ),
                todo: state.todoItem.todo,
                deadline: moment(state.todoItem.deadline).format(
                    'YYYY-MM-DDTHH:mm'
                ),
                complete: false,
            });
            dispatch(
                payloads.setTodo({
                    todo: '',
                    deadline: moment(new Date().toISOString()).format(
                        'YYYY-MM-DDTHH:mm'
                    ),
                })
            );
            refInput.current.focus();
        }
    };
    const handleKeydown = (e) => {
        if (e.key === 'Enter') {
            handleChangeAddTask();
        }
    };
    const handleChangeUpdateTask = (id) => {
        if (
            moment(state.todoItem.deadline).format('YYYY-MM-DDTHH:mm') <=
            moment(new Date().toISOString()).format('YYYY-MM-DDTHH:mm')
        ) {
            alert('Deadline must be greater than current date');
            refDate.current.focus();
        } else {
            db.collection('todos')
                .doc(id)
                .set(
                    {
                        todo: state.todoItem.todo,
                        deadline: moment(state.todoItem.deadline).format(
                            'YYYY-MM-DDTHH:mm'
                        ),
                    },
                    { merge: true }
                );
            dispatch(
                payloads.setTodo({
                    todo: '',
                    deadline: moment(new Date().toISOString()).format(
                        'YYYY-MM-DDTHH:mm'
                    ),
                })
            );
            dispatch(payloads.toogleButtonUpdate(false));
            dispatch(payloads.setIdUpdated(''));
            alert('C???p nh???t nhi???m v??? th??nh c??ng!');
        }
    };
    const handleCancelUpdate = () => {
        dispatch(
            payloads.setTodo({
                todo: '',
                deadline: moment(new Date().toISOString()).format(
                    'YYYY-MM-DDTHH:mm'
                ),
            })
        );
        dispatch(payloads.toogleButtonUpdate(false));
        dispatch(payloads.setIdUpdated(''));
    };
    return (
        <div className={`${clsx(styles.todo_input_container)} w-100 mt-3`}>
            <div className={`${clsx(styles.todo_input)} form-group`}>
                <div className={`${clsx(styles.input)} mr-1`}>
                    <label>Nhi???m v???</label>
                    <input
                        type='text'
                        className='form-control text-primary text_bold text_capitalized'
                        value={todo}
                        onChange={handleChange}
                        ref={refInput}
                        name='todo'
                        onKeyDown={handleKeydown}
                        autoComplete='off'
                    />
                </div>
                <div className={`${clsx(styles.input)} ml-1`}>
                    <label>H???n</label>
                    <input
                        type='datetime-local'
                        className='form-control text-danger text_bold'
                        value={deadline}
                        onChange={handleChange}
                        onKeyDown={handleKeydown}
                        name='deadline'
                        ref={refDate}
                    />
                </div>
                {!state.toogleButtonUpdate ? (
                    <button
                        className={`${clsx(
                            styles.btn_add
                        )} btn btn-primary ml-2`}
                        onClick={handleChangeAddTask}
                        disabled={!todo}
                    >
                        Th??m vi???c
                    </button>
                ) : (
                    <div className={`${clsx(styles.group_button)}`}>
                        <button
                            className={`${clsx(
                                styles.btn_add
                            )} btn btn-primary ml-2`}
                            onClick={() =>
                                handleChangeUpdateTask(state.idUpdateTodo)
                            }
                            disabled={!todo}
                        >
                            C???p nh???t
                        </button>
                        <button
                            className={`${clsx(
                                styles.btn_add
                            )} btn btn-danger ml-2`}
                            onClick={handleCancelUpdate}
                            disabled={!todo}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
            <div className={`${clsx(styles.todo_input)} form-group`}>
                <div
                    className={`${clsx(
                        styles.input,
                        styles.input_custom
                    )} mr-1`}
                >
                    <div className={`${clsx(styles.input_search)} w-100`}>
                        <label>T??m ki???m</label>
                        <input
                            type='text'
                            className='form-control text-primary text_bold text_capitalized'
                            value={todoSearch}
                            onChange={handleChange}
                            ref={refInputSearch}
                            name='todoSearch'
                            autoComplete='off'
                            // onKeyUp={handleSearch}
                        />
                    </div>
                    <span className={`${clsx(styles.icon_search)}`}>
                        <i className='fas fa-search'></i>
                    </span>
                </div>
                <div className={`${clsx(styles.input)} ml-1`}>
                    <label>B??? l???c</label>
                    <select
                        className='form-control'
                        name='todoTableSort'
                        value={todoTableSort}
                        onChange={handleChange}
                        id='todoTableSort'
                    >
                        <option value='0'>T???t c???</option>
                        <option value='1'>M???i nh???t</option>
                        <option value='2'>C?? nh???t</option>
                        <option value='3'>G???n h???n nh???t</option>
                        <option value='4'>H???t h???n</option>
                        <option value='5'>???? xong</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default TodoInput;
