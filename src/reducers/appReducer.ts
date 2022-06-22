import { AppAction, AppState } from "../interfaces";

/*
  Provides a function to perform multiple setState updates
  at once that depend on each other.
  Can be initialized with a callback to be performed on
  any completed action.
*/
export const reducer = (actionCallback: (item: AppState) => void) => {
  return (state: AppState, action: AppAction): AppState => {
    const newState: AppState = {
      dataVisibility: action.payload.dataVisibility || state.dataVisibility,
      filter: action.payload.filter || state.filter,
      loading: action.payload.loading === undefined ? state.loading : action.payload.loading,
      selectedStudent:
        action.payload.selectedStudent === undefined ? state.selectedStudent : action.payload.selectedStudent,
      students: action.payload.students || state.students,
    };
    actionCallback(newState);
    return newState;
  };
};
