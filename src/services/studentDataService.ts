import { collection, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, getMetadata, ref, StorageReference } from "firebase/storage";
import { map, toString } from "lodash";
import { cleanStudent, db, storage } from ".";
import { Student } from "../interfaces";

export const setStudentData = async (student: Student) => {
  const cleanedStudent: Student = cleanStudent(
    student as unknown as Record<string, unknown>,
  ) as unknown as Student;
  try {
    const res = await setDoc(
      doc(collection(db, "students"), toString(student.epId)),
      cleanedStudent,
    );
    console.log(res);
  } catch (error) {
    console.log(error);
    console.log(cleanedStudent);
  }
};

const imageExtensions = [".jpeg", ".jpg", ".png", ".jfif", ".JPG"];
const imageFolderName = "studentPics/";

export const getStudentImage = async (student: Student): Promise<string> => {
  const setImageName = async (imageRef: StorageReference) => {
    student.imageName = (await getMetadata(imageRef)).fullPath;
  };

  if (student.imageName) {
    return getDownloadURL(ref(storage, student.imageName));
  }

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
  setStudentData(student);
  return downloadURL;
};
