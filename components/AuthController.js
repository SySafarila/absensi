import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { useRecoilState } from "recoil";
import { UserState } from "./RecoilState";

const AuthController = () => {
  const [user, setUser] = useRecoilState(UserState);

  const auth = getAuth();

  const login = async () => {
    // const auth = getAuth();
    const provider = new GoogleAuthProvider();
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        signInWithPopup(auth, provider)
          .then((res) => {
            const credential = GoogleAuthProvider.credentialFromResult(res);
            const token = credential.accessToken;
            const user = res.user;

            setUser("ada");
          })
          .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  const checkAuth = async () => {
    // const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  };

  const logout = async () => {
    // const auth = getAuth();
    // if (user) {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.log(error);
      });
    // }
  };

  return {
    login,
    logout,
    checkAuth,
  };
};

export default AuthController;
