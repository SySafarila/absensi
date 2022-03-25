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

const ShowClass = () => {
  const [classX, setClassX] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const user = useRecoilValue(UserState);
  const router = useRouter();
  const db = getFirestore();
  const { uid } = router.query;

  useEffect(() => {
    if (user && uid) {
      console.log(uid);
      getClass();
    }

    return () => {
      setClassX(null);
      setIsAdmin(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, uid]);

  const getClass = async () => {
    console.log("getClass()");
    const docRef = doc(db, "classes", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setClassX(docSnap.data());
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

  const deleteClass = async () => {
    try {
      await deleteDoc(doc(db, "classes", uid));

      deleteClassAdmins();

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
  };

  const deleteClassAdmin = async (uid) => {
    await deleteDoc(doc(db, "classAdmins", uid));
  };

  return (
    <div>
      {isAdmin == true ? "You are admin for this class" : ""}
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed
        accusantium veritatis labore eveniet, error perspiciatis quam iure
        cumque doloribus ipsam voluptatem ad a nostrum repellendus deleniti
        provident voluptatibus et soluta.
      </p>
      {classX ? <button onClick={deleteClass}>Delete this class</button> : ""}
    </div>
  );
};

export default ShowClass;
