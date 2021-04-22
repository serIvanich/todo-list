import React, {useState, KeyboardEvent, ChangeEvent} from 'react'
import {FilterValuesType, TaskType} from './App'


type TodoListPropsType = {
    title: string
    tasks: Array<TaskType>
    filter: FilterValuesType
    removeTask: (taskID: string) => void
    changeFilter: (value: FilterValuesType) => void
    addTask: (title: string) => void
    changeTaskStatus: (askID: string, newIsDoneValue: boolean) => void
}

export const TodoList: React.FC<TodoListPropsType> = (props) => {
    const filter = props.filter
    const [title, setTitle] = useState<string>('')
    const [error, setError] = useState<boolean>(false)
    const tasks = props.tasks.map(t => {
        const removeTask = () => props.removeTask(t.id)
        const chengeTaskStatus = (e: ChangeEvent<HTMLInputElement>                                     ) => {
            props.changeTaskStatus(t.id, e.currentTarget.checked)
        }

        return (
            <li className={t.isDone ? 'is-done' : ''}>
                <input
                    onChange={chengeTaskStatus}
                    type='checkbox'
                    checked={t.isDone}/>
                <span>{t.title}</span>
                <button onClick={removeTask}>x</button>
            </li>)
    })
    const onClickAddTask = () => {
        const trimmerTitle = title.trim()
        if(trimmerTitle){
            props.addTask(title)
        }else{
            setError(true)
        }

        setTitle('')
    }
    const onKeyPressAddTask = (e: KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter'){
            onClickAddTask()
        }
    }
    const errorMessage = error ? <div style={{color: 'red'}}>'text is required'</div>: null
    const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        setError(false)

    }


    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input className={error ? 'error' : ''}
                       value={title}
                       onChange={onChangeTitle}
                       onKeyPress={onKeyPressAddTask}/>
                <button onClick={onClickAddTask}>+</button>
                {errorMessage}
            </div>
            <ul>
                {tasks}
            </ul>
            <div>
                <button className={filter === 'all' ? 'active-filter' : ''} onClick={() => props.changeFilter('all')}>All</button>
                <button className={filter === 'active' ? 'active-filter' : ''} onClick={() => props.changeFilter('active')}>Active</button>
                <button className={filter === 'completed' ? 'active-filter' : ''} onClick={() => props.changeFilter('completed')}>Completed</button>
            </div>
        </div>

    )
}
