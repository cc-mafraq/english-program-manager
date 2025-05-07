import React from "react";
import { useDatabase, useWaitingListStore } from "../../hooks";

interface WaitingListDatabaseWrapperProps {
  children: React.ReactNode;
}

export const WaitingListDatabaseWrapper: React.FC<WaitingListDatabaseWrapperProps> = ({ children }) => {
  const setWaitingList = useWaitingListStore((state) => {
    return state.setWaitingList;
  });
  useDatabase({ collectionName: "waitingList", setData: setWaitingList });

  return <>{children}</>;
};
