import "../components/firebase";
import { RecoilRoot } from "recoil";
import Container from "../components/Container";

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <Container>
        <Component {...pageProps} />
      </Container>
    </RecoilRoot>
  );
}

export default MyApp;
