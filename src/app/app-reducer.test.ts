import {AppInitialStateType, appReducer, setAppErrorAC, setAppStatusAC} from "./app-reducer";

let startState: AppInitialStateType

beforeEach(() => {
    startState = {
        error: null,
        status: 'idle'
    }
})

test('correct error message should be set', () => {
    const endState = appReducer(startState, setAppErrorAC('some error'))

    expect(endState.error).toBe('some error')
})

test('correct status should be set', () => {
    const endState = appReducer(startState,setAppStatusAC('loading'))

    expect(endState.status).toBe('loading')
})


