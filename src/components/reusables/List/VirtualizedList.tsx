import { first, get } from "lodash";
import React, { Attributes, useEffect, useRef } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { useWindowResize } from "../../../hooks";

interface VirtualizedListProps<T> {
  children: React.ReactNode;
  idPath: string;
  listData: T[];
  overscan?: number;
  scrollToIndex?: number;
  setScrollToIndex?: (scrollToIndex: number | undefined) => void;
}

export const VirtualizedList = <T,>({
  listData,
  idPath,
  scrollToIndex,
  setScrollToIndex,
  children,
  overscan,
}: VirtualizedListProps<T>) => {
  const listRef = useRef<VirtuosoHandle>(null);
  const tabValues = useRef({});
  const [, windowHeight] = useWindowResize();

  const setTabValue = (id: string | number, tabValue: number) => {
    tabValues.current = { ...tabValues.current, [id]: tabValue };
  };

  useEffect(() => {
    if (scrollToIndex === undefined) return;
    listRef.current?.scrollToIndex({ index: scrollToIndex });
    setScrollToIndex && setScrollToIndex(undefined);
  }, [scrollToIndex, setScrollToIndex]);

  const Row = (index: number, data: T) => {
    const id = get(data, idPath);
    return first(
      React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            data,
            id,
            index,
            key: id,
            setTabValue,
            tabValue: get(tabValues.current, id) || 0,
          } as Partial<unknown> & Attributes);
        }
        return child;
      }),
    );
  };

  return listData?.length ? (
    <Virtuoso
      ref={listRef}
      data={listData}
      increaseViewportBy={0}
      itemContent={Row}
      style={{ height: windowHeight - (2 * 64 + windowHeight / 100) }}
    />
  ) : (
    <></>
  );
};

VirtualizedList.defaultProps = {
  overscan: undefined,
  scrollToIndex: undefined,
  setScrollToIndex: undefined,
};
