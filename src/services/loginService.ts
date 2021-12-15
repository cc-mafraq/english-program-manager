import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { app, db } from ".";

const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  const auth = getAuth(app);
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    // The signed-in user info.
    const { user } = result;
    setDoc(
      doc(collection(db, "users"), user.uid),
      {
        email: user.email,
        name: user.displayName,
        uid: user.uid,
      },
      { merge: true },
    );
    // ...
  } catch (error) {
    console.log(error);
    // Handle Errors here.
    // const errorCode = error.code;
    // const errorMessage = error.message;
    // // The email of the user's account used.
    // const { email } = error;
    // // The AuthCredential type that was used.
    // const credential = GoogleAuthProvider.credentialFromError(error);
    // // ...
  }
};

export const logout = async () => {
  const auth = getAuth(app);
  await signOut(auth);
};
