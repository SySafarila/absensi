import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import moment from "moment";

const UserData = ({ uid, created_at, late, type }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const class_id = router.query.uid;
  const db = getFirestore();

  useEffect(() => {
    console.count(`user ${uid} from ${class_id} presence`);
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

  return (
    <>
      {user?.name ?? ""} | {type ?? ""} {late ? "| late" : ""} |{" "}
      <Timer created_at={created_at} />
    </>
  );
};

const Timer = ({ created_at }) => {
  const [x, setX] = useState(true);

  useEffect(() => {
    // console.count("timer");
    const interval = setInterval(() => {
      setX(!x);
    }, 1000);

    return () => clearInterval(interval);
  }, [x]);
  return <>{created_at ? moment(created_at).fromNow() : created_at}</>;
};

export default UserData;
