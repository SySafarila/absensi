import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useRecoilValue } from "recoil";
import { UserState } from "../../components/RecoilState";
import CreatePresence from "../../components/classes/CreatePresence";
import Presence from "./presence";

const ShowClass = () => {
  const [classX, setClassX] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [presences, setPresences] = useState([]);
  const user = useRecoilValue(UserState);
  const router = useRouter();
  const db = getFirestore();
  const { uid } = router.query;

  useEffect(() => {
    if (user && uid) {
      console.log(`class_uid : ${uid}`);
      getClass();
    }

    return () => {
      setClassX(null);
      setIsAdmin(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, uid]);

  useEffect(() => {
    if (isDeleted == true) {
      router.push("/classes");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleted]);

  const getClass = async () => {
    console.log("getClass()");
    const docRef = doc(db, "classes", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setClassX(docSnap.data());
      getPresences();
      getClassAdmins();
    } else {
      console.warn("404 Class not found");
      router.push("/classes");
    }
  };

  const getClassAdmins = async () => {
    console.log("getClassAdmins()");
    const q = query(
      collection(db, "classAdmins"),
      where("class_id", "==", uid)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      //   console.log({ ...doc.data(), uid: doc.id });
      if (doc.data()?.user_id == user?.uid) {
        setIsAdmin(true);
      }
    });
  };

  const getPresences = async () => {
    const q = query(collection(db, "presences"), where("class_uid", "==", uid));

    const querySnapshot = await getDocs(q);

    let arr = [];

    querySnapshot.forEach((doc) => {
      // console.log(doc.data());
      arr.push(doc.data());
    });

    setPresences(arr);
  };

  const deleteClass = async () => {
    try {
      await deleteDoc(doc(db, "classes", uid));

      deletePresences();
      deleteClassAdmins();
      deleteUserClasses();

      alert("class deleted");
    } catch (err) {
      console.log(err);
    }
  };

  const deleteClassAdmins = async () => {
    const q = query(
      collection(db, "classAdmins"),
      where("class_id", "==", uid)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      deleteClassAdmin(doc.id);
    });

    setIsDeleted(true);
  };

  const deletePresences = async () => {
    const q = query(collection(db, "presences"), where("class_uid", "==", uid));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      deletePresence(doc.id);
    });
  };

  const deletePresence = async (uid) => {
    await deleteDoc(doc(db, "presences", uid));
  };

  const deleteClassAdmin = async (uid) => {
    await deleteDoc(doc(db, "classAdmins", uid));
  };

  const deleteUserClasses = async () => {
    const q = query(
      collection(db, "userClasses"),
      where("class_id", "==", uid)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      deleteUserClass(doc.id);
    });
  };

  const deleteUserClass = async (uid) => {
    await deleteDoc(doc(db, "userClasses", uid));
  };

  return (
    <div>
      {isAdmin == true ? "You are admin for this class" : ""} {classX ? <button onClick={deleteClass}>Delete this class</button> : ""}
      {isAdmin ? <CreatePresence class_uid={uid} /> : ""}
      <div>
        {presences.map((presence, index) => (
          <Presence key={index} message={presence.message} />
        ))}
      </div>
    </div>
  );
};

export default ShowClass;
