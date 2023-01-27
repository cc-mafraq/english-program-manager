import { useMediaQuery, useTheme } from "@mui/material";
import { first, get, isNaN } from "lodash";
import React, { Attributes, RefObject, useEffect, useRef } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { useWindowResize } from "../../../hooks";

interface VirtualizedListProps<T> {
  children: React.ReactNode;
  idPath: string;
  listData: T[];
  menuRef?: RefObject<HTMLDivElement>;
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
  menuRef,
}: VirtualizedListProps<T>) => {
  const listRef = useRef<VirtuosoHandle>(null);
  const tabValues = useRef({});
  const [, windowHeight] = useWindowResize();
  const theme = useTheme();
  const greaterThanSmall = useMediaQuery(theme.breakpoints.up("sm"));
  const menuHeight = menuRef?.current?.clientHeight;

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
      increaseViewportBy={overscan}
      itemContent={Row}
      style={{
        height:
          // Subtract menu heights (and an extra few pixels to prevent the scrollbar from appearing) from window height to fill the screen with the list
          // Subtract 2 menu heights if it's on computer and 1 if it's on mobile
          windowHeight - (greaterThanSmall ? 2 : 1) * (isNaN(menuHeight) || !menuHeight ? 64 : menuHeight) - 7,
      }}
    />
  ) : (
    <></>
  );
};

VirtualizedList.defaultProps = {
  menuRef: undefined,
  overscan: undefined,
  scrollToIndex: undefined,
  setScrollToIndex: undefined,
};
