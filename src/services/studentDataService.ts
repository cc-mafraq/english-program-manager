import { collection, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, getMetadata, ref, StorageReference } from "firebase/storage";
import { isEmpty, map, toString } from "lodash";
import { db, storage } from ".";
import { Student } from "../interfaces";

export const setStudentData = async (student: Student) => {
  await setDoc(doc(collection(db, "students"), toString(student.epId)), student, { merge: true });
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
          downloadURL = await getDownloadURL(
            ref(storage, `${imageFolderName}${student.epId}${ext}`),
          );
        } catch (e) {
          // eslint-disable-next-line no-useless-return
          return;
        }
      }),
    );
    student.imageName = student.imageName ? student.imageName : "";
    setStudentData(student);
    return downloadURL;
  }
  return "";
};
