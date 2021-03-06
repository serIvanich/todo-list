import {todolistApi} from "../../api/todolist-api";
import {RequestStatusType} from "../application";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleAsyncServerAppError, handleAsyncServerNetworkError} from "../../utils/error-utils";
import {ThunkError} from "../../utils/types";
import {TodolistType} from "../../api/types";
import {appActions} from "../common-action/App";



const fetchTodolist = createAsyncThunk<{ todoLists: TodolistType [] }, undefined, ThunkError>
('todoLists/fetchTodoList', async (param, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatus({status: 'loading'}))

    try {

        const data = await todolistApi.getTodo()
        thunkAPI.dispatch(appActions.setAppStatus({status: 'succeeded'}))
        return {todoLists: data}

    } catch (e) {

        return handleAsyncServerNetworkError(e, thunkAPI)
    }
})
const removeTodoList = createAsyncThunk<{ todoListId: string }, { todoListId: string }, ThunkError>
('todoLists/removeTodoList', async (param: { todoListId: string }, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatus({status: 'loading'}))
    try {
        thunkAPI.dispatch(changeTodoListEntityStatus({id: param.todoListId, entityStatus: 'loading'}))
        const data = await todolistApi.deleteTodo(param.todoListId)

        if (data.resultCode === 0) {
            thunkAPI.dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {todoListId: param.todoListId}
        } else {
            return handleAsyncServerAppError(data, thunkAPI)
        }
    } catch (e) {
        return handleAsyncServerNetworkError(e, thunkAPI)
    }
})
const addTodoList = createAsyncThunk<{ todoList: TodolistType }, string, ThunkError>
('todoLists/addTodoList',
    async (title, thunkAPI) => {
        thunkAPI.dispatch(appActions.setAppStatus({status: 'loading'}))
        try {
            const data = await todolistApi.createTodo(title)
            if (data.resultCode === 0) {
                thunkAPI.dispatch(appActions.setAppStatus({status: 'succeeded'}))
                return {todoList: data.data.item}
            } else {
                return handleAsyncServerAppError(data, thunkAPI, false)
            }
        } catch (e) {


            return handleAsyncServerNetworkError(e, thunkAPI, false)
        }
    })
const changeTodoListTitle = createAsyncThunk<{ todoListId: string, title: string }, { todoListId: string, title: string }, ThunkError>
('todoLists/updateTodoList', async (param, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatus({status: 'loading'}))
    try {
        const data = await todolistApi.updateTodo(param.todoListId, param.title)
        if (data.resultCode === 0) {
            thunkAPI.dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {todoListId: param.todoListId, title: param.title}
        } else {
            return handleAsyncServerAppError(data, thunkAPI, false)
        }
    } catch (e) {
        return handleAsyncServerNetworkError(e, thunkAPI)

    }
})

export const asyncActions = {
    fetchTodolist,
    removeTodoList,
    addTodoList,
    changeTodoListTitle
}

export const slice = createSlice({
    name: 'todoLists',
    initialState: [] as Array<TodolistDomainType>,
    reducers: {

        changeTodoListFilter(state, action: PayloadAction<{ value: FilterValuesType, todoListId: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId)
            state[index].filter = action.payload.value
        },
        changeTodoListEntityStatus(state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.entityStatus
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTodolist.fulfilled, (state, action) => {
            return action.payload.todoLists.map((tl: TodolistType) => ({...tl, filter: 'all', entityStatus: "idle"}))
        })
        builder.addCase(removeTodoList.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId)
            if (index > -1) {
                state.splice(index, 1)
            }
        })
        builder.addCase(addTodoList.fulfilled, (state, action) => {
            state.unshift({...action.payload.todoList, filter: 'all', entityStatus: "idle"})
        })
        builder.addCase(changeTodoListTitle.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId)
            state[index].title = action.payload.title
        })
    }
})

export const {
    changeTodoListFilter, changeTodoListEntityStatus
} = slice.actions


// type


export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}


// const initialState = [
//     // {id: todoListID_1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
//     // {id: todoListID_2, title: 'What to buy', filter: 'all', addedDate: '', order: 0},
// ] as Array<TodolistDomainType>
//     state: InitialStateType = initialState, action: TodoListActionType): InitialStateType => {
//     switch (action.type) {
//
//         case "SET-TODOLIST":
//
//
//         case 'REMOVE-TODOLIST':
//             return state.filter(tl => tl.id !== action.todoListID)
//
//         case "ADD-TODOLIST":
//             return [{...action.todoList, filter: 'all', entityStatus: "idle"}, ...state]
//
//         case 'CHANGE-TODOLIST-TITLE':
//             return state.map(tl => tl.id === action.todoListID ? {...tl, title: action.title} : tl)
//
//         case "CHANGE-TODOLIST-FILTER":
//             return state.map(tl => tl.id === action.todoListID ? {...tl, filter: action.value} : tl)
//
//         case "CHANGE-TODOLIST-ENTITY-STATUS":
//             return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.entityStatus} : tl)
//
//         default:
//             return state
//     }
// }

// actions

//
// export const setTodosAC = (todoLists: TodolistType[]) =>
//     ({type: 'SET-TODOLIST', todoLists} as const)
// export const removeTodoListAC = (todoListID: string) =>
//     ({type: 'REMOVE-TODOLIST', todoListID} as const)
// export const addTodoListAC = (todoList: TodolistType) =>
//     ({type: 'ADD-TODOLIST', todoList} as const)
// export const changeTodoListTitleAC = (todoListID: string, title: string) =>
//     ({type: 'CHANGE-TODOLIST-TITLE', title, todoListID} as const)
// export const changeTodoListFilterAC = (value: FilterValuesType, todoListID: string) =>
//     ({
//         type: 'CHANGE-TODOLIST-FILTER', value, todoListID
//     } as const)
// export const changeTodoListEntityStatusAC = (id: string, entityStatus: RequestStatusType) =>
//     ({
//         type: 'CHANGE-TODOLIST-ENTITY-STATUS', id, entityStatus
//     } as const)
//


// type InitialStateType = typeof initialState
//
// export type SetTodoListsActionType = ReturnType<typeof setTodosAC>
// export type RemoveTodoListActionType = ReturnType<typeof removeTodoListAC>
// export type AddTodoListActionType = ReturnType<typeof addTodoListAC>
// export type ChangeTodoListEntityStatusActionType = ReturnType<typeof changeTodoListEntityStatusAC>


// export type TodoListActionType =
//     RemoveTodoListActionType
//     | AddTodoListActionType
//     | ReturnType<typeof changeTodoListTitleAC>
//     | ReturnType<typeof changeTodoListFilterAC>
//     | SetTodoListsActionType
//     | ChangeTodoListEntityStatusActionType
// setTodosAC(state, action: PayloadAction<{ todoLists: TodolistType[] }>) {
//     return action.payload.todoLists.map(tl => ({...tl, filter: 'all', entityStatus: "idle"}))
// },
// removeTodoListAC(state, action: PayloadAction<{ todoListID: string }>) {
//     const index = state.findIndex(tl => tl.id === action.payload.todoListID)
//     state.splice(index, 1)
// },
// addTodoListAC(state, action: PayloadAction<{ todoList: TodolistType }>) {
//     state.unshift({...action.payload.todoList, filter: 'all', entityStatus: "idle"})
// },
//
// changeTodoListTitleAC(state, action: PayloadAction<{ todoListId: string, title: string }>) {
//     const index = state.findIndex(tl => tl.id === action.payload.todoListId)
//     state[index].title = action.payload.title
// },
// thunks

// export const fetchTodolistThunk_ = (): AppThunkType => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({status: 'loading'}))
//
//     todolistApi.getTodo()
//         .then(data => {
//             dispatch(setTodosAC({todoLists: data}))
//         })
//
//
//         .catch(e => {
//             handleServerNetworkError(e.message, dispatch)
//         })
//         .finally(() => {
//             dispatch(setAppStatusAC({status: 'succeeded'}))
//         })
// }
// export const addTodoListThunk_ = (title: string): AppThunkType => async dispatch => {
//     try {
//         dispatch(setAppStatusAC({status: 'loading'}))
//         const data = await todolistApi.createTodo(title)
//         if (data.resultCode === 0) {
//             dispatch(addTodoListAC({todoList: data.data.item}))
//             dispatch(setAppStatusAC({status: 'succeeded'}))
//         } else {
//             if (data.messages.length) {
//                 dispatch(setAppErrorAC({error: data.messages[0]}))
//             } else {
//                 dispatch(setAppErrorAC({error: 'Some error occurred'}))
//             }
//             dispatch(setAppStatusAC({status: 'failed'}))
//         }
//     } catch (e) {
//         handleServerNetworkError(e.message, dispatch)
//     }
//
// }
// export const removeTodoListThunk_ = (todoId: string): AppThunkType => async dispatch => {
//     try {
//         dispatch(setAppStatusAC({status: 'loading'}))
//         dispatch(changeTodoListEntityStatusAC({id: todoId, entityStatus: 'loading'}))
//         const data = await todolistApi.deleteTodo(todoId)
//
//         if (data.resultCode === 0) {
//             dispatch(removeTodoListAC({todoListID: todoId}))
//             dispatch(setAppStatusAC({status: 'succeeded'}))
//
//         } else {
//             handleServerAppError(data, dispatch)
//         }
//     } catch (e) {
//         handleServerNetworkError(e.message, dispatch)
//     }
// }
// export const updateTodoListThunk = (todoId: string, title: string): AppThunkType => async dispatch => {
//     try {
//         const data = await todolistApi.updateTodo(todoId, title)
//         if (data.resultCode === 0) {
//             dispatch(changeTodoListTitleAC({todoListID: todoId, title}))
//         }
//     } catch (e) {
//         handleServerNetworkError(e.message, dispatch)
//     }
// }

