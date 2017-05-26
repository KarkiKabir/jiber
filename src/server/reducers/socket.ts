import * as ws from 'ws'
import store from '../store'
import { Action, Reducer, stateDictionary } from '../../core/index'

// Setup
const keyName = 'socketId'
interface ClientState {
  connection?: ws,                                                              // WebSocket client instance
  connectedAt: number,                                                          // When the socket connected
  lastSentAt: number,                                                           // When the socket last sent a message
  lastReceivedAt: number,                                                       // When the socket last received a message
  period: number,                                                               // Current block of time that is being rate limited
  messageCount: number                                                          // Total messages received in the current block of time
}

const defaultClientState = {
  connection: undefined,
  connectedAt: 0,
  lastSentAt: 0,
  lastReceivedAt: 0,
  period: 0,
  messageCount: 0
}

// Actions
const INIT = 'hope/socket/INIT'
const SEND = 'hope/socket/SEND'
const RECEIVE = 'hope/socket/RECEIVE'
const LOGIN = 'hope/socket/LOGIN'
const REMOVE = 'hope/socket/REMOVE'

// Reducer
function reducer (
  state: ClientState = defaultClientState,
  action: Action
): ClientState {
  switch (action.type) {
    case INIT:
      return {
        ...state,
        connection: action.connection,
        connectedAt: action.timeMs
      }

    case SEND:
      return {
        ...state,
        lastSentAt: action.timeMs
      }

    case RECEIVE:
      const globalState = store.getState()
      const timeMs = action.timeMs
      const period = Math.floor(timeMs / globalState.options.rateLimit.periodMs)
      const isSamePeriod = (period === state.period)
      const messageCount = isSamePeriod ? (state.messageCount + 1) : 1
      return {
        ...state,
        period,
        messageCount,
        lastReceivedAt: timeMs
      }

    default:
      return state
  }
}

export default stateDictionary(reducer, {keyName})

// Action Creators
export function socketInit (socketId: string, connection: ws): Action {
  return {type: INIT, socketId, connection, timeMs: new Date().getTime()}
}

export function socketSend (socketId: string): Action {
  return {type: SEND, socketId, timeMs: new Date().getTime()}
}

export function socketReceive (socketId: string): Action {
  return {type: RECEIVE, socketId, timeMs: new Date().getTime()}
}

export function socketRemove (socketId: string): Action {
  return {type: REMOVE, socketId}
}