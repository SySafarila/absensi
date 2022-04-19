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

const Presence = (props) => {
  const [userCheckin, setUserCheckoin] = useState(false);

  const db = getFirestore();
  const user = useRecoilValue(UserState);
  let presence = props.presence;
  let { uid } = presence;

  useEffect(() => {
    console.log(`Presence : mounted ${uid}`);

    const q = query(
      collection(db, "presenceTypes"),
      where("presence_id", "==", uid),
      where("user_id", "==", user?.uid)
    );

    const unsubs = onSnapshot(q, (querySnapshot) => {
      let arr = [];
      querySnapshot.forEach((doc) => {
        arr.push({ ...doc.data(), uid: doc.id });
      });
      if (arr.length > 0) {
        setUserCheckoin(arr[0]);
      }
    });

    return () => {
      unsubs();
    };
  }, []);

  const deletePresence = async () => {
    let conf = confirm("Delete this presence ?");
    if (conf) {
      try {
        await deleteDoc(doc(db, "presences", uid));
        console.log(`${uid} deleted`);
      } catch (er) {
        console.warning(er);
      }
    }
  };

  const checkin = async (type) => {
    console.log(`checkin for ${type}`);

    const q = query(
      collection(db, "presenceTypes"),
      where("presence_id", "==", uid),
      where("user_id", "==", user?.uid)
    );

    try {
      const querySnapshot = await getDocs(q);
      let arr = [];
      querySnapshot.forEach((doc) => {
        arr.push({ ...doc.data(), uid: doc.id });
      });

      if (arr.length > 0) {
        await deleteDoc(doc(db, "presenceTypes", arr[0].uid));
        const DocRef = await addDoc(collection(db, "presenceTypes"), {
          user_id: user?.uid,
          presence_id: uid,
          type: type,
          class_id: presence.class_uid,
          created_at: new Date().getTime(),
        });
      } else {
        const DocRef = await addDoc(collection(db, "presenceTypes"), {
          user_id: user?.uid,
          presence_id: uid,
          type: type,
          class_id: presence.class_uid,
          created_at: new Date().getTime(),
        });
      }
    } catch (er) {
      console.log(er);
    }

    // try {
    //   const DocRef = await addDoc(collection(db, "presenceTypes"), {
    //     user_id: user?.uid,
    //     presence_id: uid,
    //     type: type,
    //     class_id: presence.class_uid,
    //     created_at: new Date().getTime(),
    //   });
    // } catch (er) {
    //   console.log(er);
    // }
  };

  return (
    <>
      <p>
        {presence.message} | {userCheckin ? userCheckin.type : ""}
      </p>
      <button onClick={() => checkin("hadir")}>Hadir</button>
      <button onClick={() => checkin("izin")}>izin</button>
      <button onClick={() => checkin("sakit")}>sakit</button>
      {props.isAdmin ? <button onClick={deletePresence}>hapus</button> : null}
    </>
  );
};

export default Presence;
