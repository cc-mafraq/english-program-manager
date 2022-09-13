import { collection, deleteDoc, doc, setDoc, SetOptions } from "firebase/firestore";
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { find, forEach, get, map, omit, set, toString } from "lodash";
import { db, storage } from ".";
import { Student } from "../interfaces";

export const setStudentData = async (student: Student, options?: SetOptions) => {
  try {
    await setDoc(doc(collection(db, "students"), toString(student.epId)), student, options ?? {});
  } catch (e) {
    // eslint-disable-next-line no-alert
    alert(`The following error occurred. Please try again:\n${e}`);
  }
};

export const deleteStudentData = async (student: Student) => {
  await deleteDoc(doc(collection(db, "students"), toString(student.epId)));
};

export const setImages = async (
  students: Student[],
  imagePath: string,
  folderName: string,
): Promise<Student[]> => {
  try {
    const storageFiles = await listAll(ref(storage, folderName));
    const fileNames = await Promise.all(
      map(storageFiles.items, async (file) => {
        return getDownloadURL(file);
      }),
    );
    forEach(students, (student) => {
      const imageURL = find(fileNames, (name) => {
        if (name.includes(`${folderName.slice(0, -1)}%2F${student.epId}`)) return true;
        return false;
      });
      set(student, imagePath, imageURL || "");
    });
  } catch (e) {
    console.error(e);
  }
  return students;
};

export const deleteImage = async (student: Student, imagePath: string, shouldNotSetStudent?: boolean) => {
  const storageRef = ref(storage, get(student, imagePath));
  await deleteObject(storageRef);
  set(student, imagePath, "");
  if (shouldNotSetStudent) return;
  await setStudentData(omit(student, imagePath) as Student);
};

export const uploadImage = async (epId: Student["epId"], file: File | null, folderName: string) => {
  if (file === null) return "";
  const fullImagePath = `${folderName}${epId}${file.name.slice(file.name.indexOf("."))}`;
  const storageRef = ref(storage, fullImagePath);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const setImage = async (student: Student, file: File | null, imagePath: string, folderName: string) => {
  const imageURL = await uploadImage(student.epId, file, folderName);
  set(student, imagePath, imageURL);
  await setStudentData(student, { merge: true });
};
