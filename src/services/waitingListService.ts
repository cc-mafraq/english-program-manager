import { countBy, findIndex, flatten, get, groupBy, map, orderBy, slice, values } from "lodash";
import moment from "moment";
import { WaitingListEntry } from "../interfaces";
import { MOMENT_FORMAT } from "./studentFormService";

export const sortWaitingList = (waitingList: WaitingListEntry[]) => {
  const orderedList = flatten(
    orderBy(
      values(
        groupBy(
          orderBy(
            waitingList,
            [
              "waiting",
              "highPriority",
              (wle) => {
                return moment(wle.entryDate, MOMENT_FORMAT);
              },
              "timestamp",
            ],
            ["desc", "desc", "asc", "asc"],
          ),
          "primaryPhone",
        ),
      ),
      [
        (wle) => {
          return wle[0].waiting;
        },
        (wle) => {
          return wle[0].highPriority;
        },
        (wle) => {
          return moment(wle[0].entryDate, MOMENT_FORMAT);
        },
        (wle) => {
          return wle[0].timestamp;
        },
      ],
      ["desc", "desc", "asc", "asc"],
    ),
  );
  return orderedList;
};

export const getPosition = (waitingList: WaitingListEntry[], wlEntry: WaitingListEntry) => {
  const index = findIndex(waitingList, (wle) => {
    return wle.id === wlEntry.id;
  });
  return index + 1 - (get(countBy(map(slice(waitingList, 0, index), "waiting")), "false") || 0);
};
