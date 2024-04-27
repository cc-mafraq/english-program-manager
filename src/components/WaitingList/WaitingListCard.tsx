import React from "react";
import { CorrespondenceList, CustomCard, WaitingListCardHeader, WaitingListEntryInfo } from "..";
import { useAppStore } from "../../hooks";
import { emptyWaitingListEntry, WaitingListEntry } from "../../interfaces";
import { WaitingListTimeStats } from "../../services";

interface WaitingListCardProps {
  handleWLEntryDialogOpen: () => void;
  waitingListTimeStats: WaitingListTimeStats;
}

const WaitingListEntryInfoMemo: React.FC<{ data: WaitingListEntry }> = React.memo(({ data }) => {
  return <WaitingListEntryInfo data={data} />;
});
WaitingListEntryInfoMemo.displayName = "Waiting List Entry Info";

export const WaitingListCard: React.FC<WaitingListCardProps> = (props) => {
  const role = useAppStore((state) => {
    return state.role;
  });
  const { handleWLEntryDialogOpen, waitingListTimeStats } = props;

  return (
    <CustomCard
      data={emptyWaitingListEntry}
      header={
        <WaitingListCardHeader
          data={emptyWaitingListEntry}
          handleEditEntryClick={handleWLEntryDialogOpen}
          waitingListTimeStats={waitingListTimeStats}
        />
      }
      noTabs={role !== "admin"}
      tabContents={[
        { component: <WaitingListEntryInfoMemo data={emptyWaitingListEntry} />, label: "Entry" },
        {
          component: <CorrespondenceList collectionName="waitingList" data={emptyWaitingListEntry} idPath="id" />,
          hidden: role !== "admin",
          label: "Correspondence",
        },
      ]}
      {...props}
    />
  );
};
