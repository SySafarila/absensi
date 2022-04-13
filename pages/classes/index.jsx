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
        collection(db, "classes"),
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
      {/* <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga,
        voluptas. Quam omnis maiores quas? Culpa modi maxime labore distinctio
        nemo corporis velit quis? Quidem debitis, laborum ratione ducimus
        impedit quas?
      </p> */}
      <Link href="/classes/create">
        <a>Create</a>
      </Link>
      {classes.map((doc) => (
        <div key={doc.uid} style={{ borderBottom: "1px solid black" }}>
          <p>uid : {doc.uid}</p>
          <p>name : {doc.name}</p>
          <p>course : {doc.course}</p>
          <p>university : {doc.university}</p>
          <p>semester : {doc.semester}</p>
          <Link href={`/classes/${doc.uid}`}>
            <a className="asd">Get In</a>
          </Link>
        </div>
      ))}
    </>
  );
};

export default IndexClass;
