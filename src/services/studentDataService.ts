import { collection, deleteDoc, doc, setDoc, SetOptions } from "firebase/firestore";
import { deleteObject, getDownloadURL, getMetadata, ref, StorageReference, uploadBytes } from "firebase/storage";
import { isEmpty, map, omit, toString } from "lodash";
import { db, storage } from ".";
import { Student } from "../interfaces";

export const setStudentData = async (student: Student, options?: SetOptions) => {
  await setDoc(doc(collection(db, "students"), toString(student.epId)), student, options ?? {});
};

export const deleteStudentData = async (student: Student) => {
  await deleteDoc(doc(collection(db, "students"), toString(student.epId)));
};

const imageExtensions = [".jpeg", ".jpg", ".png", ".jfif", ".JPG"];
const imageFolderName = "studentPics/";

export const searchForImage = async (student: Student) => {
  const setImageName = async (imageRef: StorageReference) => {
    student.imageName = (await getMetadata(imageRef)).fullPath;
  };

  let downloadURL = "";
  // https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
  await Promise.all(
    map(imageExtensions, async (ext) => {
      try {
        await setImageName(ref(storage, `${imageFolderName}${student.epId}${ext}`));
        downloadURL = await getDownloadURL(ref(storage, `${imageFolderName}${student.epId}${ext}`));
      } catch (e) {
        // eslint-disable-next-line no-useless-return
        return;
      }
    }),
  );
  student.imageName = student.imageName ? student.imageName : "";
  return downloadURL;
};

export const getStudentImage = async (student: Student): Promise<string> => {
  if (!isEmpty(student.imageName)) {
    return getDownloadURL(ref(storage, student.imageName));
  }

  return "";
};

export const deleteStudentImage = async (student: Student, shouldNotSetStudent?: boolean) => {
  const storageRef = ref(storage, student.imageName);
  await deleteObject(storageRef);
  if (shouldNotSetStudent) return;
  await setStudentData(omit(student, "imageName"));
};

export const setStudentImage = async (student: Student, file: File | null): Promise<string> => {
  if (file === null) return "";
  const imagePath = `${imageFolderName}${student.epId}${file.name.slice(file.name.indexOf("."))}`;
  const storageRef = ref(storage, imagePath);
  student.imageName && (await deleteStudentImage(student, true));
  await uploadBytes(storageRef, file);
  student.imageName = imagePath;
  await setStudentData(student, { merge: true });
  return imagePath;
};
