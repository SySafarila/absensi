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
        {/* <Link href="/classes/create">
          <a>Create</a>
        </Link> */}

        {/* </UserDetail> */}
        <div className="bg-gray-100 min-h-screen py-5">
          <div className="max-w-screen-sm mx-auto bg-white min-h-[calc(100vh-2.5rem)] p-10 rounded-xl overflow-clip">
            <nav className="flex justify-center items-center border-b-2 py-4 -mx-10 -mt-10">
              <Link href="/">
                <a>Logo</a>
              </Link>
            </nav>
            <div className="py-5 flex flex-col gap-3">
              {classes.map((doc) => (
                <ShowClasses uid={doc?.class_id} key={doc?.uid} />
              ))}
              {classes.length == 0 ? (
                <Link href="/classes/create">
                  <a className="bg-white w-fit border py-2 px-4 rounded-md hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-semibold">
                    Create Class
                  </a>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </LoginRequired>
    </>
  );
};

export default IndexClass;
