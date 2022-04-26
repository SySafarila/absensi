import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import Link from "next/link";

const ShowClasses = (props) => {
  const [classX, setClassX] = useState(false);
  const db = getFirestore();
  let uid = props.uid;

  useEffect(() => {
    console.log(uid);
    if (uid) {
      getClass(uid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  const getClass = async (uid) => {
    const docRef = doc(db, "classes", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(docSnap.data());
      setClassX({ ...docSnap.data(), uid: docSnap.id });
    }
  };

  const ClassExist = (props) => {
    if (classX) {
      return <>{props.children}</>;
    } else {
      return null;
    }
  };

  return (
    <>
      <ClassExist>
        <div style={{ borderBottom: "1px solid black" }}>
          <p>uid : {classX.uid}</p>
          <p>name : {classX.name}</p>
          <p>course : {classX.course}</p>
          <p>university : {classX.university}</p>
          <p>semester : {classX.semester}</p>
          <Link href={`/classes/${classX.uid}`}>
            <a className="asd">Get In</a>
          </Link>
        </div>
      </ClassExist>
    </>
  );
};

export default ShowClasses;
