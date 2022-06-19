import { get } from "lodash";
import React, { useCallback, useRef } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList as List, VariableSizeList } from "react-window";
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
    console.log(sizeMap.current);
  }, []);

  const getSize = (index: number): number => {
    return get(sizeMap.current, index) || 600;
  };

  // const Row = ({index, style} => {

  // })

  return (
    <AutoSizer>
      {({ height, width }) => {
        return (
          <List
            ref={listRef}
            height={height}
            itemCount={studentsPage.length}
            itemData={studentsPage}
            itemSize={getSize}
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
          </List>
        );
      }}
    </AutoSizer>
  );
};
