import { useRouter } from "next/router";
import { useEffect } from "react";

const ShowClass = () => {
  const router = useRouter();
  const { uid } = router.query;

  useEffect(() => {
    if (uid) {
      console.log(uid);
    }
  }, [uid]);

  return (
    <div>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed
        accusantium veritatis labore eveniet, error perspiciatis quam iure
        cumque doloribus ipsam voluptatem ad a nostrum repellendus deleniti
        provident voluptatibus et soluta.
      </p>
    </div>
  );
};

export default ShowClass;
