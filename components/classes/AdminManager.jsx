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

const AdminManager = (props) => {
  const [admins, setAdmins] = useState([]);
  const [userClasses, setUserClasses] = useState([]);
  let user = useRecoilValue(UserState);
  let class_uid = props.class_uid;
  const db = getFirestore();

  //   get admins
  useEffect(() => {
    const q = query(
      collection(db, "classAdmins"),
      where("class_id", "==", class_uid)
    );

    const unsubs = onSnapshot(q, (querySnapshot) => {
      let arr = [];
      querySnapshot.forEach((data) => {
        arr.push({ ...data.data(), uid: data.id });
      });
      setAdmins(arr);
      console.log("Admins : ", arr);
    });

    // console.log(user);

    return () => {
      unsubs();
    };
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
      console.log("userClasses : ", arr);
    });

    return () => {
      unsubs();
    };
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
      where("class_id", "==", class_uid)
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

  return (
    <div style={{ background: "#e9e9e9" }}>
      <p>Admin Manager</p>
      <ul>
        <li>
          <span>Admin</span>
          <ul>
            {admins.map((admin, index) => (
              <li key={index}>
                <span>
                  {admin.user_id} {admin.user_id == user.uid ? "- you" : ""}
                </span>
                {admin.user_id == user.uid ? (
                  ""
                ) : (
                  <button onClick={() => deleteAdmin(admin.user_id)}>
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        </li>
        <li>
          <span>Users</span>
          <ul>
            {userClasses.map((userX, index) => (
              <li key={index}>
                <span>
                  {userX.user_id} {userX.user_id == user.uid ? "- you" : ""}
                </span>
                {userX.user_id == user.uid ? (
                  ""
                ) : (
                  <>
                    <button onClick={() => setAsAdmin(userX.user_id)}>
                      Set as Admin
                    </button>
                    <button onClick={() => deleteUser(userX.user_id)}>
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default AdminManager;
