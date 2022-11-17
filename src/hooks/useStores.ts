import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { FilterValue, Student, WaitingListEntry } from "../interfaces";

interface StudentState {
  filter: FilterValue<Student>[];
  selectedStudent: Student | null;
  setFilter: (filter: StudentState["filter"]) => void;
  setSelectedStudent: (selectedStudent: StudentState["selectedStudent"]) => void;
  setStudents: (students: StudentState["students"]) => void;
  students: Student[];
}

export const useStudentStore = create<StudentState>()(
  subscribeWithSelector((set) => {
    return {
      filter: [],
      selectedStudent: null,
      setFilter: (filter: StudentState["filter"]) => {
        return set(() => {
          return { filter };
        });
      },
      setSelectedStudent: (selectedStudent: StudentState["selectedStudent"]) => {
        return set(() => {
          return { selectedStudent };
        });
      },
      setStudents: (students: StudentState["students"]) => {
        return set(() => {
          return { students };
        });
      },
      students: [],
    };
  }),
);

interface WaitingListState {
  filter: FilterValue<WaitingListEntry>[];
  selectedWaitingListEntry: WaitingListEntry | null;
  setFilter: (filter: WaitingListState["filter"]) => void;
  setSelectedWaitingListEntry: (selectedWaitingListEntry: WaitingListState["selectedWaitingListEntry"]) => void;
  setWaitingList: (waitingList: WaitingListState["waitingList"]) => void;
  waitingList: WaitingListEntry[];
}

export const useWaitingListStore = create<WaitingListState>()(
  subscribeWithSelector((set) => {
    return {
      filter: [],
      selectedWaitingListEntry: null,
      setFilter: (filter: WaitingListState["filter"]) => {
        return set(() => {
          return { filter };
        });
      },
      setSelectedWaitingListEntry: (selectedWaitingListEntry: WaitingListState["selectedWaitingListEntry"]) => {
        return set(() => {
          return { selectedWaitingListEntry };
        });
      },
      setWaitingList: (waitingList: WaitingListState["waitingList"]) => {
        return set(() => {
          return { waitingList };
        });
      },
      waitingList: [],
    };
  }),
);

interface AppState {
  loading: boolean;
  role: "admin" | "faculty" | "staff";
  setLoading: (loading: AppState["loading"]) => void;
  setRole: (role: AppState["role"]) => void;
}

export const useAppStore = create<AppState>()(
  subscribeWithSelector((set) => {
    return {
      loading: true,
      role: "staff",

      setLoading: (loading: AppState["loading"]) => {
        return set(() => {
          return { loading };
        });
      },
      setRole: (role: AppState["role"]) => {
        return set(() => {
          return { role };
        });
      },
    };
  }),
);
