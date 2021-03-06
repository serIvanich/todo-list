import {
    changeTodoListEntityStatus,
    changeTodoListFilter,
    FilterValuesType,
    TodolistDomainType,

} from "./todolists-reducer";
import {v1} from "uuid"

import {todoListActions, todoListsReducer} from "./index";
import {RequestStatusType} from "../application/types";


let todoListId_1: string
let todoListId_2: string


let startState: Array<TodolistDomainType>

beforeEach(() => {
    todoListId_1 = v1()
    todoListId_2 = v1()
    startState = [
        {id: todoListId_1, addedDate: '2020', order: 4, title: "one todolist", filter: 'all', entityStatus: 'idle'},
        {id: todoListId_2, addedDate: '2021', order: 5, title: "two todolist", filter: 'all', entityStatus: 'idle'}
    ]
})

test('correct todolist should be removed', () => {
    const action = todoListActions.removeTodoList.fulfilled({todoListId: todoListId_1}, 'requestId', {todoListId: todoListId_1})
    const endState = todoListsReducer(startState, action)

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todoListId_2)
})

test('correct todolist should be added', () => {

    let newTodolistTitle = "New TodoList";
    const todoList = {id: "todolistId3", addedDate: '2021', order: 5, title: newTodolistTitle, filter: 'all'}
    const action = todoListActions.addTodoList.fulfilled({todoList}, 'requestId',  newTodolistTitle)
    const endState = todoListsReducer(startState, action)
    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(newTodolistTitle);
})

test('correct todolist should change its name', () => {

    let newTodolistTitle = "New TodoList";

    const action = todoListActions.changeTodoListTitle.fulfilled(
        {todoListId: todoListId_2, title: newTodolistTitle}, 'requestId',
            {todoListId: todoListId_2, title: newTodolistTitle} )
    const endState = todoListsReducer(startState, action);

    expect(endState[0].title).toBe("one todolist");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValuesType = "completed";
    const endState = todoListsReducer(startState, changeTodoListFilter({value: newFilter, todoListId: todoListId_2}));

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});

test('correct entity status of todolist should be changed', () => {

    let entityStatus: RequestStatusType = "loading";
    const endState = todoListsReducer(startState, changeTodoListEntityStatus({id: todoListId_2, entityStatus}));

    expect(endState[0].entityStatus).toBe("idle");
    expect(endState[1].entityStatus).toBe('loading');
});




