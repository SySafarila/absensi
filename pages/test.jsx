import { useEffect, useState } from "react";

const Test = () => {
  const [TestState, setTestState] = useState(1);

  useEffect(() => {
    console.count("Test mounted");
  }, []);

  return (
    <>
      <p onClick={() => setTestState(TestState + 1)}>asd {TestState}</p>
      <X />
    </>
  );
};

const X = () => {
  useEffect(() => {
    console.count("x mounted");
  }, []);
  return <p>x</p>;
};

export default Test;
