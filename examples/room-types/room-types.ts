import { Reducer } from '../interfaces/reducer'
import { Action } from '../interfaces/action'
import { Dictionary } from './dictionary'
import { ReducerObj } from './combine-reducers'

/**
 * split roomId into [roomType, roomId]
 */
export const roomTypes = (reducerObj: ReducerObj): Reducer => {
  return (state: any = undefined, action: Action): Dictionary => {
    if (!action.$roomId) return state
    const [roomType] = action.$roomId.split('.')
    const reducer = reducerObj[roomType]
    return reducer(state, action)
  }
}