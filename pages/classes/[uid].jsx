import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useRecoilValue } from "recoil";
import { UserState } from "../../components/RecoilState";
import CreatePresence from "../../components/classes/CreatePresence";
import Presence from "../../components/classes/Presence";

const ShowClass = () => {
  const [classExist, setClassExist] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [presencesLoaded, setPresencesLoaded] = useState(false);
  const [presences, setPresences] = useState([]);
  const [userClassesCheck, setUserClassesCheck] = useState(null);
  const user = useRecoilValue(UserState);
  const router = useRouter();
  const db = getFirestore();
  const { uid } = router.query;

  // get class
  useEffect(() => {
    if (user && uid) {
      console.log(`class_uid : ${uid}`);
      getClass();
      UserClassCheck();
    }

    return () => {
      setClassExist(null);
      setIsAdmin(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, uid]);

  // get presences
  useEffect(() => {
    if (classExist) {
      console.log("getPresences()");
      // getPresences(); // get datas once

      // listening datas
      const q = query(
        collection(db, "presences"),
        where("class_uid", "==", uid),
        orderBy("created_at", "desc")
      );
      const unsubs = onSnapshot(q, (querySnapshot) => {
        let arr = [];
        querySnapshot.forEach((doc) => {
          arr.push({ ...doc.data(), uid: doc.id });
        });
        setPresences(arr);
      });
      setPresencesLoaded(true);

      return () => {
        unsubs();
        setPresences([]);
        setPresencesLoaded(false);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classExist]);

  // get classAdmins
  useEffect(() => {
    if (classExist) {
      getClassAdmins();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classExist]);

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
      setClassExist(docSnap.data());
      // getPresences();
      // getClassAdmins();
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
    const q = query(
      collection(db, "presences"),
      where("class_uid", "==", uid),
      orderBy("created_at", "desc")
    );

    const querySnapshot = await getDocs(q);

    let arr = [];

    querySnapshot.forEach((doc) => {
      // console.log({ ...doc.data(), uid: doc.id });
      arr.push({ ...doc.data(), uid: doc.id });
    });

    setPresences(arr);
    setPresencesLoaded(true);
    // console.log(arr);
  };

  const deleteClass = async () => {
    let conf = confirm("Delete this class ?");
    if (conf) {
      try {
        await deleteDoc(doc(db, "classes", uid));

        deletePresences();
        deleteClassAdmins();
        deleteUserClasses();

        alert("class deleted");
      } catch (err) {
        console.log(err);
      }
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

  const IsAdmin = (props) => {
    if (isAdmin) {
      return <>{props.children}</>;
    } else {
      return null;
    }
  };

  const UserClassCheck = async (props) => {
    const q = query(
      collection(db, "userClasses"),
      where("user_id", "==", user?.uid),
      where("class_id", "==", uid)
    );
    const querySnapshot = await getDocs(q);

    let arr = [];
    querySnapshot.forEach((doc) => {
      arr.push({ ...doc.data(), uid: doc.id });
    });

    if (arr.length > 0) {
      setUserClassesCheck(true);
    } else {
      setUserClassesCheck(false);
    }
  };

  const UserClassCheckMiddleware = (props) => {
    switch (userClassesCheck) {
      case true:
        return <>{props.children}</>;
        break;

      case false:
        return (
          <div>
            <p>you want to join this class ?</p>
            <button onClick={joinClass}>Join</button>
          </div>
        );

      default:
        return <p>Checking...</p>;
        break;
    }
  };

  const joinClass = async () => {
    let conf = confirm("Join this class ?");

    if (conf) {
      const q = query(
        collection(db, "userClasses"),
        where("user_id", "==", user?.uid),
        where("class_id", "==", uid)
      );
      const querySnapshot = await getDocs(q);

      let arr = [];
      querySnapshot.forEach((doc) => {
        arr.push({ ...doc.data(), uid: doc.id });
      });

      if (arr.length == 0) {
        try {
          const docRef = await addDoc(collection(db, "userClasses"), {
            class_id: uid,
            user_id: user?.uid,
          });
          setUserClassesCheck(true);
        } catch (er) {
          setUserClassesCheck(false);
        }
      }
    }
  };

  return (
    <>
      <UserClassCheckMiddleware>
        <IsAdmin>
          <span>You are admin for this class</span>
          <button onClick={deleteClass}>Delete this class</button>
          <CreatePresence class_uid={uid} />
        </IsAdmin>
        <div>
          {presences.map((data, i) => (
            <Presence presence={data} key={i} isAdmin={isAdmin} />
          ))}
        </div>
      </UserClassCheckMiddleware>
    </>
  );
};

export default ShowClass;
