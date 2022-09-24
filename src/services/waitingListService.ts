import { filter, orderBy } from "lodash";
import moment from "moment";
import { WaitingListEntry } from "../interfaces";
import { MOMENT_FORMAT } from "./studentFormService";

export const sortWaitingList = (waitingList: WaitingListEntry[], shouldFilter?: boolean) => {
  return orderBy(
    filter(waitingList, (wl) => {
      return shouldFilter !== true || wl.waiting;
    }),
    [
      "waiting",
      "highPriority",
      (wle) => {
        return moment(wle.entryDate, MOMENT_FORMAT);
      },
    ],
    ["desc", "desc", "asc"],
  );
};
