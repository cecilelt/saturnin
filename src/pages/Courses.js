import React, { useState } from "react";
import { saveAs } from "file-saver";
import axios from "axios";

export default function Courses() {
  const [student, setStudent] = useState({
    firstName: "Cécile",
    lastName: "LT",
    email: "email@gmail.com",
    group: "112",
  });

  function createPDF() {
    axios.post("/students/pdf/create-pdf", student).then(() =>
      axios
        .get("/students/pdf/fetch-pdf", { responseType: "blob" })
        .then((res) => {
          const generatedPDF = new Blob([res.data], {
            type: "application/pdf",
          });
          var fileURL = URL.createObjectURL(generatedPDF);
          window.open(fileURL);
        })
    );
  }

  return (
    <div>
      <h1>Courses page</h1>
      <button onClick={createPDF}>Download</button>
    </div>
  );
}
