import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { UserState } from "../RecoilState";
import { useRouter } from "next/router";
import UserDataAdmin from "./UserDataAdmin";

const AdminManager = () => {
  const [admins, setAdmins] = useState([]);
  const [adminsUid, setAdminsUid] = useState([]);
  const [userClasses, setUserClasses] = useState([]);
  const [show, setShow] = useState(false);

  let user = useRecoilValue(UserState);
  const router = useRouter();
  let class_uid = router.query.uid;
  const db = getFirestore();

  //   get admins
  useEffect(() => {
    console.count("<AdminManager />");
    const q = query(
      collection(db, "classAdmins"),
      where("class_id", "==", class_uid)
    );

    const unsubs = onSnapshot(q, (querySnapshot) => {
      let arr = [];
      let arrIds = [];

      querySnapshot.forEach((data) => {
        arr.push({ ...data.data(), uid: data.id });
        arrIds.push(data.data().user_id);
      });
      setAdmins(arr);
      setAdminsUid(arrIds);
      // console.log("admins ", arr);
      // console.log("arrIds ", arrIds);
      // console.log("Admins : ", arr);
    });

    // console.log(user);

    return () => {
      unsubs();
      setAdmins([]);
      setAdminsUid([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //   get userClasses
  useEffect(() => {
    const q = query(
      collection(db, "userClasses"),
      where("class_id", "==", class_uid)
    );

    const unsubs = onSnapshot(q, (querySnapshot) => {
      let arr = [];
      querySnapshot.forEach((data) => {
        arr.push({ ...data.data(), uid: data.id });
      });
      setUserClasses(arr);
      // console.log("userClasses : ", arr);
    });

    return () => {
      unsubs();
      setUserClasses([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setAsAdmin = async (user_id) => {
    const q = query(
      collection(db, "classAdmins"),
      where("class_id", "==", class_uid),
      where("user_id", "==", user_id)
    );

    const querySnapshot = await getDocs(q);

    let arr = [];
    querySnapshot.forEach((doc) => {
      arr.push({ ...doc.data(), uid: doc.id });
    });

    if (arr.length == 0) {
      await addDoc(collection(db, "classAdmins"), {
        class_id: class_uid,
        user_id: user_id,
      });
      console.log("set as admin ", user_id);
    }
  };

  const deleteAdmin = async (user_id) => {
    const q = query(
      collection(db, "classAdmins"),
      where("class_id", "==", class_uid),
      where("user_id", "==", user_id)
    );

    const querySnapshot = await getDocs(q);

    let arr = [];
    querySnapshot.forEach((doc) => {
      arr.push({ ...doc.data(), uid: doc.id });
    });

    if (arr.length > 0) {
      console.log(arr[0].uid);
      await deleteDoc(doc(db, "classAdmins", arr[0].uid));
    }
  };

  const deleteUser = async (user_id) => {
    const q = query(
      collection(db, "userClasses"),
      where("class_id", "==", class_uid),
      where("user_id", "==", user_id)
    );

    const querySnapshot = await getDocs(q);

    let arr = [];
    querySnapshot.forEach((doc) => {
      arr.push({ ...doc.data(), uid: doc.id });
    });

    if (arr.length > 0) {
      await deleteDoc(doc(db, "userClasses", arr[0].uid));
      deleteAdmin(arr[0].user_id);
    }
  };

  if (show) {
    return (
      <>
        <p className="font-semibold">Admin Manager</p>
        <div className="py-2">
          <div className="flex gap-2 text-gray-700">
            <span>Admin :</span>
            {admins.map((admin, index) => (
              <span className="bg-gray-200 px-2 py-0.5 rounded-md" key={index}>
                <UserDataAdmin uid={admin.user_id} />{" "}
                {admin.user_id == user.uid ? "- you" : ""}
                {admin.user_id == user.uid ? (
                  ""
                ) : (
                  <button
                    onClick={() => deleteAdmin(admin.user_id)}
                    className="text-sm"
                  >
                    (X)
                  </button>
                )}
              </span>
            ))}
          </div>
          <div className="flex gap-2 text-gray-700 mt-2">
            <span>Users :</span>
            {userClasses.map((userX, index) => (
              <span className="bg-gray-200 px-2 py-0.5 rounded-md" key={index}>
                <UserDataAdmin uid={userX.user_id} />{" "}
                {userX.user_id == user.uid ? "- you" : ""}
                {userX.user_id == user.uid ? (
                  ""
                ) : (
                  <>
                    {!adminsUid.includes(userX.user_id) ? (
                      <button
                        onClick={() => setAsAdmin(userX.user_id)}
                        className="text-sm"
                      >
                        (Set as Admin)
                      </button>
                    ) : (
                      ""
                    )}
                    <button
                      onClick={() => deleteUser(userX.user_id)}
                      className="text-sm"
                    >
                      (X)
                    </button>
                  </>
                )}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={() => setShow(false)}
          className="w-full bg-gray-100 border rounded-md py-1 text-sm text-gray-700 mb-2"
        >
          Hide Admin Panel
        </button>
      </>
    );
  } else {
    return (
      <button
        onClick={() => setShow(true)}
        className="w-full bg-gray-100 border rounded-md py-1 text-sm text-gray-700 mb-2"
      >
        Show Admin Panel
      </button>
    );
  }
};

export default AdminManager;
