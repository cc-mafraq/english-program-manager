import { filter, orderBy } from "lodash";
import moment from "moment";
import { WaitingListStudent } from "../interfaces";
import { MOMENT_FORMAT } from "./studentFormService";

export const sortWaitingList = (waitingList: WaitingListStudent[]) => {
  return orderBy(
    filter(waitingList, (wl) => {
      return wl.waiting;
    }),
    [
      "highPriority",
      (wls) => {
        return moment(wls.entryDate, MOMENT_FORMAT);
      },
    ],
    ["desc", "asc"],
  );
};
