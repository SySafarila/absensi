import { useRouter } from "next/router";
import { useEffect } from "react";

const UserData = ({ uid }) => {
  const router = useRouter();
  const class_id = router.query.uid;

  useEffect(() => {
    console.count(`user ${uid} from ${class_id} presence`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  return <>{uid}</>;
};

export default UserData;
