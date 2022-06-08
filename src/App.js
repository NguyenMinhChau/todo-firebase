/* eslint-disable array-callback-return */
import { useEffect, useState } from 'react';
import { TodoInput, TodoTable } from './components';
import { TodosContextHook } from './customHooks';
import moment from 'moment';
import { db } from './firebase';
import './App.css';

function App() {
    const { state } = TodosContextHook();
    const { todoSearch, todoTableSort } = state.todoItem;
    const [todos, setTodos] = useState([]);
    useEffect(() => {
        db.collection('todos')
            .orderBy('createdAt', 'desc')
            .get()
            .then((doc) => {
                let data,
                    datas = [],
                    dataFiltered = [];
                if (todoSearch) {
                    doc.docs.map((item) => {
                        if (
                            item
                                .data()
                                .todo.toLowerCase()
                                .includes(todoSearch.toLowerCase())
                        ) {
                            datas.push({
                                ...item.data(),
                                id: item.id,
                            });
                        }
                    });
                    setTodos(datas);
                } else if (todoTableSort) {
                    switch (todoTableSort) {
                        // mới nhất
                        case '1':
                            const dataNew = doc.docs.sort((a, b) => {
                                return (
                                    moment(b.data().createdAt).unix() -
                                    moment(a.data().createdAt).unix()
                                );
                            });
                            dataNew.map((item) => {
                                dataFiltered.push({
                                    ...item.data(),
                                    id: item.id,
                                });
                            });
                            break;
                        // cũ nhất
                        case '2':
                            const dataOld = doc.docs.sort((a, b) => {
                                return (
                                    moment(a.data().createdAt).unix() -
                                    moment(b.data().createdAt).unix()
                                );
                            });
                            dataOld.map((item) => {
                                dataFiltered.push({
                                    ...item.data(),
                                    id: item.id,
                                });
                            });
                            break;
                        // gần hạn nhất
                        case '3':
                            doc.docs.map((item) => {
                                if (
                                    handleDay(item.data().deadline) <= 3 &&
                                    !item.data().complete
                                ) {
                                    dataFiltered.push({
                                        ...item.data(),
                                        id: item.id,
                                    });
                                }
                            });
                            break;
                        // hết Hạn
                        case '4':
                            doc.docs.map((item) => {
                                if (
                                    handleDay(item.data().deadline) <= 0 &&
                                    !item.data().complete
                                ) {
                                    dataFiltered.push({
                                        ...item.data(),
                                        id: item.id,
                                    });
                                }
                            });
                            break;
                        // done
                        case '5':
                            doc.docs.map((item) => {
                                if (item.data().complete) {
                                    dataFiltered.push({
                                        ...item.data(),
                                        id: item.id,
                                    });
                                }
                            });
                            break;
                        // all
                        default:
                            doc.docs.map((item) => {
                                dataFiltered.push({
                                    ...item.data(),
                                    id: item.id,
                                });
                            });
                            break;
                    }
                    setTodos(dataFiltered);
                } else {
                    data = doc.docs.map((item) => ({
                        ...item.data(),
                        id: item.id,
                    }));
                    setTodos(data);
                }
            })
            .catch((err) => alert(err));
    });
    const year = (date) => {
        return Number(moment(date).format('YYYY'));
    };
    const month = (date) => {
        return Number(moment(date).format('MM'));
    };
    const day = (date) => {
        return Number(moment(date).format('DD'));
    };
    var b = moment([year(new Date()), month(new Date()), day(new Date())]);
    const handleDay = (deadline) => {
        const a = moment([year(deadline), month(deadline), day(deadline)]);
        const diff = a.diff(b, 'days');
        if (diff < 0) {
            return 0;
        } else if (isNaN(diff)) {
            return 'Mục tiêu quá 176 ngày';
        } else {
            return diff;
        }
    };
    return (
        <div className='app'>
            <h4 className='title'>Danh sách ghi chú</h4>
            <TodoInput setTodos={setTodos} handleDay={handleDay} />
            <TodoTable
                todos={todos}
                year={year}
                month={month}
                day={day}
                handleDay={handleDay}
            />
        </div>
    );
}

export default App;
