import { first, get } from "lodash";
import React, { Attributes, ComponentType, useCallback, useEffect, useRef } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { ListChildComponentProps, VariableSizeList } from "react-window";
import { useWindowResize } from "../../../hooks";

interface VirtualizedListProps<T> {
  children: React.ReactNode;
  defaultSize: number;
  idPath: string;
  listData: T[];
  scrollToIndex?: number;
  setScrollToIndex?: (scrollToIndex: number | undefined) => void;
}

export const VirtualizedList = <T,>({
  listData,
  idPath,
  defaultSize,
  scrollToIndex,
  setScrollToIndex,
  children,
}: VirtualizedListProps<T>) => {
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

  const getSize = useCallback(
    (index: number): number => {
      return Number(get(sizeMap.current, index)) + 16 || defaultSize;
    },
    [defaultSize],
  );

  useEffect(() => {
    if (scrollToIndex === undefined) return;
    listRef.current?.scrollToItem(scrollToIndex);
    setScrollToIndex && setScrollToIndex(undefined);
  }, [scrollToIndex, setScrollToIndex]);

  const Row = ({ data, index, style }: { data: T[]; index: number; style: React.CSSProperties | undefined }) => {
    const id = get(data[index], idPath);
    return first(
      React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            data: data[index],
            id,
            index,
            key: id,
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
  };

  return (
    <AutoSizer>
      {({ height, width }) => {
        return (
          <VariableSizeList
            ref={listRef}
            // subtract menu bar and toolbar height
            height={height - (2 * 64 + height / 100)}
            itemCount={listData?.length}
            itemData={listData}
            itemSize={getSize}
            style={{ overflowX: "hidden" }}
            width={width}
          >
            {Row as unknown as ComponentType<ListChildComponentProps<T>>}
          </VariableSizeList>
        );
      }}
    </AutoSizer>
  );
};

VirtualizedList.defaultProps = {
  scrollToIndex: undefined,
  setScrollToIndex: undefined,
};
