import { collection, deleteDoc, doc, setDoc, SetOptions } from "firebase/firestore";
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { find, forEach, get, map, omit, set, toString } from "lodash";
import { db, storage } from ".";
import { Student } from "../interfaces";

export const setStudentData = async (student: Student, options?: SetOptions) => {
  await setDoc(doc(collection(db, "students"), toString(student.epId)), student, options ?? {});
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

export const getImage = async (student: Student, imagePath: string): Promise<string> => {
  const imageName = get(student, imagePath);
  return imageName ? getDownloadURL(ref(storage, imageName)) : "";
};

export const deleteImage = async (student: Student, imagePath: string, shouldNotSetStudent?: boolean) => {
  const storageRef = ref(storage, get(student, imagePath));
  await deleteObject(storageRef);
  if (shouldNotSetStudent) return;
  await setStudentData(omit(student, imagePath) as Student);
};

export const setImage = async (
  student: Student,
  file: File | null,
  imagePath: string,
  folderName: string,
): Promise<string> => {
  if (file === null) return "";
  const fullImagePath = `${folderName}${student.epId}${file.name.slice(file.name.indexOf("."))}`;
  const storageRef = ref(storage, fullImagePath);
  get(student, imagePath) && (await deleteImage(student, imagePath, true));
  await uploadBytes(storageRef, file);
  set(student, imagePath, fullImagePath);
  await setStudentData(student, { merge: true });
  return fullImagePath;
};
