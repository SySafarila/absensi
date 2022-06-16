import { useEffect, useState } from "react";
import Head from "next/head";
import Script from "next/script";

const Test = () => {
  const [jquery, setJquery] = useState(false);
  return (
    <>
      {/* <Head> */}
        {/* <title>ad</title> */}
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.datatables.net/1.12.1/css/jquery.dataTables.css"
        />
      {/* </Head> */}
      <div>
        <table id="table_id" className="display">
          <thead>
            <tr>
              <th>Column 1</th>
              <th>Column 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Row 1 Data 1</td>
              <td>Row 1 Data 2s</td>
            </tr>
            <tr>
              <td>Row 2 Data 1</td>
              <td>Row 2 Data 2</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"
        onLoad={() => setJquery(true)}
      />
      {jquery ? (
        <Script
          src="https://cdn.datatables.net/1.12.1/js/jquery.dataTables.js"
          onLoad={() => $("#table_id").DataTable()}
        />
      ) : null}
    </>
  );
};

export default Test;
