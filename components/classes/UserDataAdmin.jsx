import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc, getFirestore } from "firebase/firestore";
// import moment from "moment";

const UserDataAdmin = ({ uid }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const class_id = router.query.uid;
  const db = getFirestore();

  useEffect(() => {
    console.count(`user ${uid} from admin manager`);
    getUser();

    return () => {
      setUser(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  const getUser = async () => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUser(docSnap.data());
      // console.log(docSnap.data());
    } else {
      //
    }
  };

  return user?.name ?? "";
};

export default UserDataAdmin;
