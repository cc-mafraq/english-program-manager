import { collection } from "firebase/firestore";
import { map } from "lodash";
import { useEffect, useMemo } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db, logout } from "../services";
import { useAppStore } from "./useStores";

interface UseDatabaseParams<T> {
  collectionName: string;
  setData: (data: T[]) => void;
}

export const useDatabase = <T>({ setData, collectionName }: UseDatabaseParams<T>) => {
  const [docs, docsLoading, docsError] = useCollection(collection(db, collectionName));
  const setLoading = useAppStore((state) => {
    return state.setLoading;
  });

  const databaseList = useMemo(() => {
    const newDataList = map(docs?.docs, (d) => {
      return d.data();
    });
    return newDataList as T[];
  }, [docs?.docs]);

  useEffect(() => {
    setData(databaseList);
  }, [setData, databaseList]);

  useEffect(() => {
    if (docsError?.code === "permission-denied") {
      logout();
    }
  }, [docsError]);

  useEffect(() => {
    setLoading(docsLoading);
  }, [docsLoading, setLoading]);

  return databaseList;
};
