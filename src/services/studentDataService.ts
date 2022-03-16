import { collection, doc, setDoc, SetOptions } from "firebase/firestore";
import { deleteObject, getDownloadURL, getMetadata, ref, StorageReference, uploadBytes } from "firebase/storage";
import { isEmpty, map, omit, toString } from "lodash";
import { db, storage } from ".";
import { Student } from "../interfaces";

export const setStudentData = async (student: Student, options?: SetOptions) => {
  await setDoc(doc(collection(db, "students"), toString(student.epId)), student, options ?? {});
};

const imageExtensions = [".jpeg", ".jpg", ".png", ".jfif", ".JPG"];
const imageFolderName = "studentPics/";

export const getStudentImage = async (student: Student): Promise<string> => {
  const setImageName = async (imageRef: StorageReference) => {
    student.imageName = (await getMetadata(imageRef)).fullPath;
  };

  if (!isEmpty(student.imageName)) {
    return getDownloadURL(ref(storage, student.imageName));
  }
  if (student.imageName === undefined) {
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
    setStudentData(student, { merge: true });
    return downloadURL;
  }
  return "";
};

export const deleteStudentImage = async (student: Student, shouldNotSetStudent?: boolean) => {
  const storageRef = ref(storage, student.imageName);
  await deleteObject(storageRef);
  if (shouldNotSetStudent) return;
  await setStudentData(omit(student, "imageName"));
};

export const setStudentImage = async (student: Student, file: File | null) => {
  if (file === null) return;
  const imagePath = `${imageFolderName}${student.epId}${file.name.slice(file.name.indexOf("."))}`;
  const storageRef = ref(storage, imagePath);
  student.imageName && (await deleteStudentImage(student, true));
  await uploadBytes(storageRef, file);
  student.imageName = imagePath;
  await setStudentData(student, { merge: true });
};
