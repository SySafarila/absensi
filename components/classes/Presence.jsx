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
  getDoc,
} from "firebase/firestore";
// import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { UserState, UserDetail } from "../RecoilState";
import UserData from "./UserData";
import moment from "moment";
import countdown from "../../libs/countdown";
import { useRouter } from "next/router";
import Head from "next/head";
import Script from "next/script";

const Presence = (props) => {
  const [userCheckin, setUserCheckoin] = useState(false);
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [jquery, setJquery] = useState(false);

  const db = getFirestore();
  const user = useRecoilValue(UserState);
  const userDetail = useRecoilValue(UserDetail);
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
      console.log(arr);
    });

    return () => {
      unsubsUserCheckIn();
      unsubsPresenceTypes();
      console.log(`<Presence /> : unmounted ${uid}`);
      setShowUsers(false);
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

  const printTable = (table_id) => {
    var divToPrint = document.getElementById(table_id);
    let newWin = window.open("");
    newWin.document.write(divToPrint.outerHTML);
    newWin.print();
    newWin.close();
  };

  return (
    <div className="border p-2 pb-3 pt-0 rounded-md text-gray-700">
      {/* <Head> */}
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdn.datatables.net/1.12.1/css/jquery.dataTables.css"
      />
      {/* </Head> */}
      <span className="text-[10px]">
        {presence.created_at ? moment(presence.created_at).fromNow() : ""}
      </span>
      <p className="mb-1">{presence.message}</p>
      <div className="flex gap-1">
        {userCheckin ? (
          <button
            onClick={() => checkin("cancel")}
            className="text-[10px] bg-gray-100 px-2 py-1 rounded-full border"
          >
            cancel
          </button>
        ) : userDetail.type == "mahasiswa" ? (
          <>
            <button
              onClick={() => checkin("hadir")}
              className="text-[10px] bg-gray-100 px-2 py-1 rounded-full border"
            >
              Hadir
            </button>
            <button
              onClick={() => checkin("izin")}
              className="text-[10px] bg-gray-100 px-2 py-1 rounded-full border"
            >
              izin
            </button>
            <button
              onClick={() => checkin("sakit")}
              className="text-[10px] bg-gray-100 px-2 py-1 rounded-full border"
            >
              sakit
            </button>
          </>
        ) : null}
        {/* {props.isAdmin ? (
          <button
            onClick={deletePresence}
            className="text-[10px] bg-gray-100 px-2 py-1 rounded-full border border-red-600"
          >
            hapus
          </button>
        ) : null} */}
        {userDetail.type != 'mahasiswa' ? (
          <button
            onClick={deletePresence}
            className="text-[10px] bg-gray-100 px-2 py-1 rounded-full border border-red-600"
          >
            hapus
          </button>
        ) : null}
        {userDetail.type == "mahasiswa" ? (
          <span className="text-gray-300 leading-[21px]">|</span>
        ) : null}
        <span className="text-[10px] bg-gray-100 border px-2 py-1 rounded-full">
          Deadline in : <Realtime time={presence.deadline_at} />
        </span>
      </div>
      {showUsers ? (
        <div className="mt-2 flex flex-col gap-y-2">
          {users.map((user, index) => (
            <div key={index} className="flex flex-col border-b pb-2">
              <UserData
                uid={user?.user_id}
                created_at={user?.created_at}
                late={user?.late}
                type={user?.type}
              />
            </div>
          ))}
        </div>
      ) : null}
      {showUsers ? (
        <div className="flex gap-2">
          <button
            onClick={() => setShowUsers(false)}
            className="block bg-gray-100 border w-full mt-3 rounded-md hover:bg-gray-200 text-sm py-1"
          >
            Close Record
          </button>
          <button
            onClick={() => printTable(`table-${presence.uid}`)}
            className="block bg-gray-100 border w-full mt-3 rounded-md hover:bg-gray-200 text-sm py-1"
          >
            Print
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => setShowUsers(true)}
            className="block bg-gray-100 border w-full mt-3 rounded-md hover:bg-gray-200 text-sm py-1"
          >
            Show Record
          </button>
          <button
            onClick={() => printTable(`table-${presence.uid}`)}
            className="block bg-gray-100 border w-full mt-3 rounded-md hover:bg-gray-200 text-sm py-1"
          >
            Print
          </button>
        </div>
      )}
      {/* onClick={() => printTable(`table-${presence.uid}`)} */}
      <table
        border="1"
        className="w-full border hidden"
        id={`table-${presence.uid}`}
      >
        <thead>
          <tr>
            <th className="border">Nama</th>
            <th className="border">Status</th>
            <th className="border">Telat</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <UserTr uid={user.user_id} late={user?.late} type={user?.type} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const UserTr = ({ uid, created_at, late, type }) => {
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
      {/* <span>{user?.name ?? ""}</span> */}
      <td className="border capitalize">{user?.name ?? ""}</td>
      <td className="border uppercase">{type}</td>
      <td className="border">{late ? "YA" : ""}</td>
    </>
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
      {x ? (x.value >= 0 ? "late" : x.toString()) : ""}
    </span>
  );
  // return x ? x.toString() : null;
};

export default Presence;
