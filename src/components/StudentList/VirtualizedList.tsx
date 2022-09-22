import { first, get } from "lodash";
import React, { Attributes, ComponentType, useCallback, useEffect, useRef } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { ListChildComponentProps, VariableSizeList } from "react-window";
import { useWindowResize } from "../../hooks";

interface VirtualizedListProps<T> {
  children: React.ReactNode;
  idPath: string;
  page: T[];
}

export const VirtualizedList = <T,>({ page, idPath, children }: VirtualizedListProps<T>) => {
  const listRef = useRef<VariableSizeList>(null);
  const sizeMap = useRef({});
  const [windowWidth] = useWindowResize();
  const tabValues = useRef({});

  const setTabValue = (id: string | number, tabValue: number) => {
    tabValues.current = { ...tabValues.current, [id]: tabValue };
  };

  const setSize = useCallback((index: number, size: number) => {
    listRef.current?.resetAfterIndex(index);
    sizeMap.current = { ...sizeMap.current, [index]: size };
  }, []);

  const getSize = useCallback((index: number): number => {
    return Number(get(sizeMap.current, index)) + 16 || 600;
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo(0);
  }, [page]);

  const Row = useCallback(
    // eslint-disable-next-line react/no-unused-prop-types
    ({ data, index, style }: { data: T[]; index: number; style: React.CSSProperties | undefined }) => {
      const id = get(data[index], idPath);
      return first(
        React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              data: data[index],
              id,
              index,
              setSize,
              setTabValue,
              style,
              tabValue: get(tabValues.current, id) || 0,
              windowWidth,
            } as Partial<unknown> & Attributes);
          }
          return child;
        }),
      );
    },
    // disable exhaustive deps because handleEditStudentClick causes StudentCard to unmount and lose tabValue state
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [idPath, setSize, windowWidth, tabValues],
  );

  return (
    <AutoSizer>
      {({ height, width }) => {
        return (
          <VariableSizeList
            ref={listRef}
            // subtract menu bar and toolbar height
            height={height - (2 * 64 + height / 100)}
            itemCount={page?.length}
            itemData={page}
            itemSize={getSize}
            style={{ overflowX: "hidden" }}
            width={width}
          >
            {Row as ComponentType<ListChildComponentProps<T>>}
          </VariableSizeList>
        );
      }}
    </AutoSizer>
  );
};
