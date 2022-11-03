import { countBy, filter, findIndex, forEach, get, map, orderBy, slice, sortBy, union } from "lodash";
import moment from "moment";
import { WaitingListEntry } from "../interfaces";
import { MOMENT_FORMAT } from "./studentFormService";

export const sortWaitingList = (waitingList: WaitingListEntry[], shouldFilter?: boolean) => {
  const orderedList = orderBy(
    filter(waitingList, (wl) => {
      return shouldFilter !== true || wl.waiting;
    }),
    [
      "waiting",
      "highPriority",
      (wle) => {
        return moment(wle.entryDate, MOMENT_FORMAT);
      },
      "timestamp",
    ],
    ["desc", "desc", "asc", "asc"],
  );

  // Move duplicate entries next to most current entry
  const duplicateIndexes: { dupIndex: number; originalIndex: number }[] = [];
  forEach(orderedList, (wl, i) => {
    const indexOfOtherEntry = findIndex(orderedList, (e) => {
      return e.primaryPhone !== -1 && e.primaryPhone === wl.primaryPhone;
    });
    if (indexOfOtherEntry !== -1 && indexOfOtherEntry < i) {
      duplicateIndexes.push({ dupIndex: i, originalIndex: indexOfOtherEntry });
    }
  });
  forEach(sortBy(duplicateIndexes, "originalIndex"), (di, i) => {
    orderedList.splice(di.originalIndex + 1 + i, 0, orderedList[di.dupIndex + i]);
  });
  return union(
    filter(orderedList, (e) => {
      return e !== undefined;
    }),
  );
};

export const getPosition = (waitingList: WaitingListEntry[], wlEntry: WaitingListEntry) => {
  const index = findIndex(waitingList, (wle) => {
    return wle.id === wlEntry.id;
  });
  return index + 1 - (get(countBy(map(slice(waitingList, 0, index), "waiting")), "false") || 0);
};
