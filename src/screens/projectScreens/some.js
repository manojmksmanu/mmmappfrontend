{
  "assignmentTitle": "local try",
  "subject": "English",
  "documentType": ["word", "extra"],
  "englishLevel": "basic",
  "style": "Apa",
  "deadline": "2024-12-05T13:35",
  "description": "a",
  "additionalNotes": ".",
  "amount": "0",
  "files": "",
  "numberOfSlides": "0",
  "numberOfPages": "0",
  "numberOfWords": "0",
  "Miscellaneous": "",
  "sPayment": "0",
  "status": "Un-Paid"
}

http://localhost:5000/api/project/student-upload

export const studentCreateNewProject = async ({ values }) => {
  console.log(values)
  try {
    const formData = new FormData();
    for (let d in values) {
      if (d === "files") {
        values[d].forEach((item) => {
          formData.append(d, item);
        });
      }
      if (d === "additionalNotes") {
        if (values[d] === "") {
          values[d] = ".";
        }
      }
      if (d === "documentType") {
        if (values[d].length === 1) {
          values[d].forEach((item) => {
            formData.append(d, item);
            formData.append(d, "extra");
          });
        } else {
          values[d].forEach((item) => {
            formData.append(d, item);
          });
        }
      } else {
        formData.append(d, values[d]);
      }
    }
    console.log(formData,'form data')
    let res = await api.post("/project/student-upload", formData, {
      headers: { Authorization: getAccessToken() },
    });
    return res.data;
  } catch (error) {
    return new Error(error);
  }
};
