import React, {useCallback} from 'react'
import './App.css'
import {TodoList} from "./TodoList"
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    AddTodoListAC,
    ChangeTodoListFilterAC,
    ChangeTodoListTitleAC,
    RemoveTodoListAC
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function AppWithRedux() {
    //BLL

    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const todoLists = useSelector<AppRootStateType, Array<TodoListType>>(state => state.todolists)

    const dispatch = useDispatch()





    const removeTask = useCallback((taskID: string, todoListID: string) => {

        dispatch(removeTaskAC(taskID, todoListID))
    },[])

    const addTask = useCallback((title: string, todoListID: string) => {

        dispatch(addTaskAC(title, todoListID))
    },[])

    const changeTaskStatus = useCallback((taskID: string, newIsDoneValue: boolean, todoListID: string) => {

        dispatch(changeTaskStatusAC(taskID, newIsDoneValue, todoListID))
    },[])

    const changeTaskTitle = useCallback((taskID: string, newTitle: string, todoListID: string) => {

        dispatch(changeTaskTitleAC(taskID, newTitle, todoListID))
    },[])

    // todolist:
    const changeFilter = useCallback((value: FilterValuesType, todoListID: string) => {

        dispatch(ChangeTodoListFilterAC(value, todoListID))
    },[])

    const changeTodoListTitle = useCallback((title: string, todoListID: string) => {

        dispatch(ChangeTodoListTitleAC(title, todoListID))
    },[])

    const removeTodoList = useCallback((todoListID: string) => {

        dispatch(RemoveTodoListAC(todoListID))
    }, [])

    const addTodoList = useCallback((title: string) => {

        dispatch(AddTodoListAC(title))
    },[])


    //UI



    console.log(tasks)
    const todoListComponents = todoLists.map(tl => {
        const allTodolistTask = tasks[tl.id]
        return (
            <Grid item key={tl.id}>
                <Paper elevation={7} style={{padding: '20px', borderRadius: '5px'}}>
                    <TodoList

                        todolistID={tl.id}
                        title={tl.title}
                        tasks={allTodolistTask}
                        filter={tl.filter}
                        removeTask={removeTask}
                        changeFilter={changeFilter}
                        addTask={addTask}
                        changeTaskStatus={changeTaskStatus}
                        removeTodoList={removeTodoList}
                        changeTaskTitle={changeTaskTitle}
                        changeTodoListTitle={changeTodoListTitle}
                    />

                </Paper>
            </Grid>
        )
    })
    return (
        <div className="App">
            <AppBar position={'static'}>
                <Toolbar style={{justifyContent: 'space-between'}}>
                    <IconButton color={'inherit'}>
                        <Menu/>

                    </IconButton>
                    <Typography variant={'h5'}>
                        Todolists
                    </Typography>
                    <Button
                        color={'inherit'}
                        variant={"outlined"}>
                        Login
                    </Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: '20px 0'}}>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container spacing={3}>
                    {todoListComponents}
                </Grid>


            </Container>
        </div>
    )
}


export default AppWithRedux