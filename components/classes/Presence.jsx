import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
// import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { UserState } from "../RecoilState";
import UserData from "./UserData";
import moment from "moment";
import countdown from "../../libs/countdown";

const Presence = (props) => {
  const [userCheckin, setUserCheckoin] = useState(false);
  const [users, setUsers] = useState([]);

  const db = getFirestore();
  const user = useRecoilValue(UserState);
  let presence = props.presence;
  let { uid } = presence;

  useEffect(() => {
    console.log(`<Presence /> : mounted ${uid}`);

    // check userCheckIn
    const q = query(
      collection(db, "presenceTypes"),
      where("presence_id", "==", uid),
      where("user_id", "==", user?.uid)
    );

    const unsubsUserCheckIn = onSnapshot(q, (querySnapshot) => {
      let arr = [];

      querySnapshot.forEach((doc) => {
        arr.push({ ...doc.data(), uid: doc.id });
      });

      setUserCheckoin(arr[0]);
    });

    // get presenceTypes records
    const q2 = query(
      collection(db, "presenceTypes"),
      where("presence_id", "==", uid),
      orderBy("created_at", "asc")
    );

    const unsubsPresenceTypes = onSnapshot(q2, (querySnapshot) => {
      let arr = [];

      querySnapshot.forEach((doc) => {
        arr.push({ ...doc.data(), uid: doc.id });
      });

      setUsers(arr);
    });

    return () => {
      unsubsUserCheckIn();
      unsubsPresenceTypes();
      console.log(`<Presence /> : unmounted ${uid}`);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

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

        if (type == "cancel") {
          return;
        }

        const DocRef = await addDoc(collection(db, "presenceTypes"), {
          user_id: user?.uid,
          presence_id: uid,
          type: type,
          class_id: presence.class_uid,
          created_at: new Date().getTime(),
          late: new Date().getTime() > presence.deadline_at ? true : false,
        });
      } else {
        if (type == "cancel") {
          return;
        }

        const DocRef = await addDoc(collection(db, "presenceTypes"), {
          user_id: user?.uid,
          presence_id: uid,
          type: type,
          class_id: presence.class_uid,
          created_at: new Date().getTime(),
          late: new Date().getTime() > presence.deadline_at ? true : false,
        });
      }
    } catch (er) {
      console.log(er);
    }
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span>
          {presence.message} | {users.length} records |{" "}
          {userCheckin ? userCheckin.type : ""}
        </span>
        <span>
          Deadline : <Realtime time={presence.deadline_at} />
        </span>
        {users.map((user, index) => (
          <div
            key={index}
            style={{ borderLeft: "2px solid #00c900", paddingLeft: "4px" }}
          >
            <UserData
              uid={user?.user_id}
              created_at={user?.created_at}
              late={user?.late}
            />
          </div>
        ))}
      </div>
      <div style={{ marginTop: "1rem" }}>
        {userCheckin ? (
          <button onClick={() => checkin("cancel")}>cancel</button>
        ) : (
          <>
            <button onClick={() => checkin("hadir")}>Hadir</button>
            <button onClick={() => checkin("izin")}>izin</button>
            <button onClick={() => checkin("sakit")}>sakit</button>
          </>
        )}
        {props.isAdmin ? <button onClick={deletePresence}>hapus</button> : null}
      </div>
    </div>
  );
};

const Realtime = ({ time }) => {
  const [x, setX] = useState(null);
  // const cd = countdown(time);
  useEffect(() => {
    const interval = setInterval(() => {
      // console.log(countdown(time));
      setX(countdown(time));
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [x]);

  // return <>{x.days ? `${x.days} days` : ""} {x.hours ? `${x.hours} hours` : ""} {x.minutes ? `${x.minutes} minutes` : ""} {x.seconds ? `${x.seconds} seconds` : ""}</>;
  return (
    <span style={{ color: x ? (x.value >= 0 ? "red" : "") : "" }}>
      {x ? (x.value >= 0 ? "late" : x.toString()) : time}
    </span>
  );
  // return x ? x.toString() : null;
};

export default Presence;
