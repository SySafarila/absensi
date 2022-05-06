import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import ShowClasses from "../../components/classes/ShowClasses";
import LoginRequired from "../../components/LoginRequired";
// import UserDetail from "../../components/middlewares/UserDetail";
import { UserState } from "../../components/RecoilState";

const IndexClass = () => {
  const [classes, setClasses] = useState([]);
  const user = useRecoilValue(UserState);
  const db = getFirestore();

  useEffect(() => {
    if (user && user.uid) {
      getClasses();
    }

    // cleanup
    return () => {
      setClasses([]);
      console.log("cleanup");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getClasses = async () => {
    try {
      const q = query(
        collection(db, "userClasses"),
        where("user_id", "==", user?.uid)
      );

      const querySnapshot = await getDocs(q);

      let arr = [];

      querySnapshot.forEach((doc) => {
        arr.push({ ...doc.data(), uid: doc.id });
      });

      setClasses(arr);
      console.log(arr);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <LoginRequired>
        {/* <UserDetail> */}
          <Link href="/classes/create">
            <a>Create</a>
          </Link>
          {classes.map((doc) => (
            <ShowClasses uid={doc?.class_id} key={doc?.uid} />
          ))}
        {/* </UserDetail> */}
      </LoginRequired>
    </>
  );
};

export default IndexClass;
