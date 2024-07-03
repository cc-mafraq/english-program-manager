import { getAuth } from "firebase/auth";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useRole } from "../hooks";
import { app } from "../services";

interface AuthorizationProps {
  children: React.ReactNode;
}

export const Authorization: React.FC<AuthorizationProps> = ({ children }) => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const [user, authLoading] = useAuthState(auth);
  useRole();

  // const students = useStudentStore((state) => {
  //   return state.students;
  // });

  // const setStudents = useStudentStore((state) => {
  //   return state.setStudents;
  // });

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [user, authLoading, navigate]);

  // const [docs] = useCollectionOnce(collection(db, "students"));

  // useEffect(() => {
  //   user &&
  //     docs?.docs &&
  //     students.length === 0 &&
  //     setStudents(
  //       map(docs?.docs, (d) => {
  //         return d.data();
  //       }) as Student[],
  //     );
  // }, [docs?.docs, setStudents, students.length, user]);

  return <>{children}</>;
};
