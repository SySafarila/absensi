import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";

const Presence = (props) => {
  const db = getFirestore();
  let presence = props.presence;
  let { uid } = presence;

  useEffect(() => {
    console.log(`presence : mounted ${uid}`);
    const unsub = onSnapshot(doc(db, "presences", uid), (doc) => {
      console.count(uid);
    });

    return () => {
      console.log(`unsub ${uid}`);
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <p>{presence.message}</p>
      <button>Hadir</button>
      <button>izin</button>
      <button>sakit</button>
      {props.isAdmin ? <button>hapus</button> : null}
    </div>
  );
};

export default Presence;
