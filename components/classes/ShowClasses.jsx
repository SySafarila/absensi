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
        <div className="flex flex-col border bg-white p-3 rounded-md">
          <span>Name : {classX.name}</span>
          <span>Course : {classX.course}</span>
          <span>University : {classX.university}</span>
          <span>Semester : {classX.name}semester</span>
          <Link href={`/classes/${classX.uid}`}>
            <a className="bg-gray-200 hover:bg-gray-300 active:bg-gray-400 px-2 py-1 mt-2 w-fit">
              Get In
            </a>
          </Link>
        </div>
      </ClassExist>
    </>
  );
};

export default ShowClasses;
