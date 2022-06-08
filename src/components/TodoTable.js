import React, { useContext } from 'react';
import clsx from 'clsx';
import styles from './Todo.module.css';
import moment from 'moment';
import { db } from '../firebase';
import { payloads, TodosContext } from '../store';

function TodoTable({ todos, year, month, day, handleDay }) {
    const { dispatch } = useContext(TodosContext);
    const handleDelete = (id) => {
        const isConfirm = window.confirm(
            'Are you sure you want to delete this task?'
        );
        if (isConfirm) {
            db.collection('todos').doc(id).delete();
        }
    };
    const handleUpdate = (id) => {
        db.collection('todos')
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.id === id) {
                        const data = doc.data();
                        const { todo, deadline } = data;
                        dispatch(
                            payloads.setTodo({
                                todo,
                                deadline:
                                    moment(deadline).format('YYYY-MM-DDTHH:mm'),
                            })
                        );
                        dispatch(payloads.toogleButtonUpdate(true));
                        dispatch(payloads.setIdUpdated(id));
                    }
                });
            });
    };
    const handleDone = (id) => {
        console.log('id: ', id);
        db.collection('todos').doc(id).set(
            {
                complete: true,
            },
            { merge: true }
        );
    };
    return (
        <div className={`${clsx(styles.todo_table_container)} w-100`}>
            <table className='table table-responsive-sm table-responsive-md table-responsive-lg text-center w-100'>
                <thead>
                    <tr>
                        <th scope='col'>ID</th>
                        <th scope='col'>Nhiệm vụ</th>
                        <th scope='col'>Ngày lên kế hoạch</th>
                        <th scope='col'>Ngày deadline</th>
                        <th scope='col'>Trạng thái</th>
                        <th scope='col'>Số ngày còn lại</th>
                        <th scope='col'>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {todos && todos.length > 0 ? (
                        todos.map((todo, index) => (
                            <tr
                                key={index}
                                className={`${
                                    handleDay(todo.deadline) <= 0
                                        ? clsx(styles.tr_disabled)
                                        : todo.complete && clsx(styles.tr_done)
                                }`}
                                s
                            >
                                <th scope='row'>{index + 1}</th>
                                <td>{todo.todo}</td>
                                <td>
                                    {moment(todo.createdAt).format(
                                        'DD/MM/YYYY'
                                    )}
                                </td>
                                <td>
                                    {moment(todo.deadline).format('DD/MM/YYYY')}
                                </td>
                                {!todo.complete ? (
                                    <td>
                                        {handleDay(todo.deadline) > 3 ? (
                                            <span className='badge badge-primary'>
                                                Đang làm
                                            </span>
                                        ) : handleDay(todo.deadline) > 0 &&
                                          handleDay(todo.deadline) <= 3 ? (
                                            <span className='badge badge-warning'>
                                                Sắp hết hạn
                                            </span>
                                        ) : isNaN(handleDay(todo.deadline)) ? (
                                            <span className='badge badge-info'>
                                                Cảnh báo
                                            </span>
                                        ) : (
                                            <span className='badge badge-danger'>
                                                Hết hạn
                                            </span>
                                        )}
                                    </td>
                                ) : (
                                    <td>
                                        <span className='badge badge-success'>
                                            Hoàn thành
                                        </span>
                                    </td>
                                )}

                                <td>{handleDay(todo.deadline)}</td>
                                <td>
                                    <button
                                        className={`${clsx(
                                            styles.btn_custom,
                                            !todo.complete
                                                ? styles.btn_done
                                                : styles.btn_info_disabled
                                        )} mr-2`}
                                        onClick={() => handleDone(todo.id)}
                                        disabled={todo.complete}
                                    >
                                        Hoàn tất
                                    </button>
                                    <button
                                        className={`${clsx(
                                            styles.btn_custom,
                                            todo.complete
                                                ? styles.btn_info_disabled
                                                : handleDay(todo.deadline) >
                                                      0 ||
                                                  isNaN(
                                                      handleDay(todo.deadline)
                                                  )
                                                ? styles.btn_info
                                                : ''
                                        )} mr-1`}
                                        onClick={() => handleUpdate(todo.id)}
                                        disabled={
                                            handleDay(todo.deadline) <= 0 ||
                                            todo.complete
                                        }
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className={`${clsx(
                                            styles.btn_custom,
                                            styles.btn_error
                                        )} ml-1`}
                                        onClick={() => handleDelete(todo.id)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7}>Không có dữ liệu</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default TodoTable;
