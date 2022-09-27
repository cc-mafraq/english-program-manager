import { AppAction, AppState } from "../interfaces";

/*
  Provides a function to perform multiple setState updates
  at once that depend on each other.
  Can be initialized with a callback to be performed on
  any completed action.
*/
export const reducer = (state: AppState, action: AppAction): AppState => {
  const newState: AppState = {
    loading: action.payload.loading === undefined ? state.loading : action.payload.loading,
    role: action.payload.role || state.role,
    selectedStudent:
      action.payload.selectedStudent === undefined ? state.selectedStudent : action.payload.selectedStudent,
    selectedWaitingListEntry:
      action.payload.selectedWaitingListEntry === undefined
        ? state.selectedWaitingListEntry
        : action.payload.selectedWaitingListEntry,
    studentFilter: action.payload.studentFilter || state.studentFilter,
    students: action.payload.students || state.students,
    waitingList: action.payload.waitingList || state.waitingList,
    waitingListFilter: action.payload.waitingListFilter || state.waitingListFilter,
  };
  return newState;
};
