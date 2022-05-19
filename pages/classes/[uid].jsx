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
import AdminManager from "../../components/classes/AdminManager";
import LoginRequired from "../../components/LoginRequired";
import moment from "moment";
import Main from "../../components/layouts/Main";

const ShowClass = () => {
  const [classExist, setClassExist] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  // const [presencesLoaded, setPresencesLoaded] = useState(false);
  const [presences, setPresences] = useState([]);
  // const [userClassesCheck, setUserClassesCheck] = useState(null);
  const user = useRecoilValue(UserState);
  const router = useRouter();
  const db = getFirestore();
  const { uid } = router.query;

  // get class
  useEffect(() => {
    if (user && uid) {
      console.log(`class_uid : ${uid}`);
      getClass();
      // UserClassCheck();
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
      // setPresencesLoaded(true);

      return () => {
        unsubs();
        setPresences([]);
        // setPresencesLoaded(false);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classExist]);

  // get classAdmins
  useEffect(() => {
    if (classExist) {
      // getClassAdmins();
      console.log("getClassAdmins()");
      const q = query(
        collection(db, "classAdmins"),
        where("class_id", "==", uid),
        where("user_id", "==", user.uid)
      );

      const unsubs = onSnapshot(q, (querySnapshot) => {
        let arr = [];

        querySnapshot.forEach((doc) => {
          if (doc.data()?.user_id == user?.uid) {
            arr.push(doc.data());
          }
          // console.log(doc.data());
        });

        if (arr.length > 0) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      });

      return () => {
        unsubs();
      };
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

  const deleteClass = async () => {
    let conf = confirm("Delete this class ?");
    if (conf) {
      try {
        await deleteDoc(doc(db, "classes", uid));

        deletePresences();
        deleteUserClasses();
        deletePresenceTypes();
        deleteClassAdmins();

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

  const deletePresenceTypes = async () => {
    const q = query(
      collection(db, "presenceTypes"),
      where("class_id", "==", uid)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      deletePresenceType(doc.id);
    });
  };

  const deletePresenceType = async (uid) => {
    await deleteDoc(doc(db, "presenceTypes", uid));
  };

  const leaveClass = async () => {
    const q = query(
      collection(db, "userClasses"),
      where("class_id", "==", uid),
      where("user_id", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);

    let id;
    querySnapshot.forEach((doc) => {
      id = doc.id;
    });
    await deleteDoc(doc(db, "userClasses", id));
  };

  return (
    <>
      <LoginRequired>
        <UserClassCheckMiddleware>
          <Main
            class_name={classExist?.name ?? ""}
            leave={leaveClass}
            deleteClass={deleteClass}
            isAdmin={isAdmin}
          >
            <IsAdmin>
              <AdminManager />
              <CreatePresence />
            </IsAdmin>
            <div className="flex flex-col gap-y-5">
              {presences.map((data, i) => (
                <Presence presence={data} key={i} isAdmin={isAdmin} />
              ))}
            </div>
          </Main>
        </UserClassCheckMiddleware>
      </LoginRequired>
    </>
  );
};

const IsAdmin = (props) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const db = getFirestore();
  const router = useRouter();
  const { uid } = router.query;
  const user = useRecoilValue(UserState);

  // isAdmin
  useEffect(() => {
    console.log("<isAdmin />");
    const q = query(
      collection(db, "classAdmins"),
      where("class_id", "==", uid),
      where("user_id", "==", user.uid)
    );

    const unsubs = onSnapshot(q, (querySnapshot) => {
      let arr = [];

      querySnapshot.forEach((doc) => {
        if (doc.data()?.user_id == user?.uid) {
          arr.push(doc.data());
        }
        // console.log(doc.data());
      });

      if (arr.length > 0) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      unsubs();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isAdmin) {
    return <>{props.children}</>;
  } else {
    return null;
  }
};

const UserClassCheckMiddleware = (props) => {
  const [userClassesCheck, setUserClassesCheck] = useState(null);
  const db = getFirestore();
  const user = useRecoilValue(UserState);
  const router = useRouter();
  const { uid } = router.query;

  // userClassCheck
  useEffect(() => {
    console.count("<UserClassCheckMiddleware />");
    const q = query(
      collection(db, "userClasses"),
      where("user_id", "==", user?.uid),
      where("class_id", "==", uid)
    );

    const unsubs = onSnapshot(q, (querySnapshot) => {
      let arr = [];

      querySnapshot.forEach((doc) => {
        arr.push(doc.data());
      });

      if (arr.length > 0) {
        setUserClassesCheck(true);
      } else {
        setUserClassesCheck(false);
      }
    });
    return () => {
      unsubs();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      return "loading";
      break;
  }
};

export default ShowClass;
