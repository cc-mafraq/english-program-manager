import { get, isEqual, map } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList } from "react-window";
import { StudentCard } from ".";
import { useWindowResize } from "../../hooks";
import { Student } from "../../interfaces";

interface StudentListProps {
  handleEditStudentClick: () => void;
  studentsPage: Student[];
}

export const StudentList: React.FC<StudentListProps> = ({ studentsPage, handleEditStudentClick }) => {
  const listRef = useRef<VariableSizeList>(null);
  const sizeMap = useRef({});
  const [windowWidth] = useWindowResize();
  const [pageIds, setPageIds] = useState(map(studentsPage, "epId"));

  const setSize = useCallback((index, size) => {
    listRef.current?.resetAfterIndex(index);
    sizeMap.current = { ...sizeMap.current, [index]: size };
  }, []);

  const getSize = (index: number): number => {
    return Number(get(sizeMap.current, index)) + 16 || 600;
  };

  useEffect(() => {
    listRef.current?.scrollTo(0);
  }, [pageIds]);

  useEffect(() => {
    const newPageIds = map(studentsPage, "epId");
    !isEqual(newPageIds, pageIds) && setPageIds(newPageIds);
  }, [pageIds, studentsPage]);

  return (
    <AutoSizer>
      {({ height, width }) => {
        return (
          <VariableSizeList
            ref={listRef}
            // subtract menu bar and toolbar height
            height={height - (2 * 64 + height / 100)}
            itemCount={studentsPage.length}
            itemData={studentsPage}
            itemSize={getSize}
            style={{ overflowX: "hidden" }}
            width={width}
          >
            {({ data, index, style }) => {
              return (
                <StudentCard
                  handleEditStudentClick={handleEditStudentClick}
                  index={index}
                  setSize={setSize}
                  student={data[index]}
                  style={style}
                  windowWidth={windowWidth}
                />
              );
            }}
          </VariableSizeList>
        );
      }}
    </AutoSizer>
  );
};
