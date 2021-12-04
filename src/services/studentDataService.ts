import { getDownloadURL, getMetadata, ref, StorageReference } from "firebase/storage";
import { map } from "lodash";
import { storage } from ".";
import { Student } from "../interfaces";

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
  return downloadURL;
};
