import { deleteDoc, doc, getFirestore, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";

const Presence = (props) => {
  const db = getFirestore();
  let presence = props.presence;
  let { uid } = presence;

  useEffect(() => {
    console.log(`presence : mounted ${uid}`);
    // const unsub = onSnapshot(doc(db, "presences", uid), (doc) => {
    //   console.count(uid);
    // });

    // return () => {
    //   console.log(`unsub ${uid}`);
    //   unsub();
    // };
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

  return (
    <div>
      <p>{presence.message}</p>
      <button>Hadir</button>
      <button>izin</button>
      <button>sakit</button>
      {props.isAdmin ? <button onClick={deletePresence}>hapus</button> : null}
    </div>
  );
};

export default Presence;
