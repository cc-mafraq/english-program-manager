import { get } from "lodash";
import React, { useCallback, useRef } from "react";
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

  const setSize = useCallback((index, size) => {
    listRef.current?.resetAfterIndex(index);
    sizeMap.current = { ...sizeMap.current, [index]: size };
  }, []);

  const getSize = (index: number): number => {
    return Number(get(sizeMap.current, index)) + 16 || 600;
  };

  return (
    <AutoSizer>
      {({ height, width }) => {
        return (
          <VariableSizeList
            ref={listRef}
            height={height}
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
