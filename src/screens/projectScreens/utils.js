export const studentCreateNewProject = async ({ values, token }) => {
  try {
    console.log(values.deadline, "values");
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const formdata = new FormData();
    formdata.append("assignmentTitle", values.assignmentTitle);
    formdata.append("subject", values.subject);
    formdata.append("description", values.description);
    formdata.append("style", values.style);
    formdata.append(
      "deadline",
      new Date("2024-12-10T11:01:00.000Z").toISOString()
    );
    formdata.append("sPayment", "0");
    formdata.append("englishLevel", values.englishLevel);
    formdata.append("additionalNotes", values.additionalNotes);

    if (values.files && Array.isArray(values.files)) {
      console.log("Files array length:", values.files.length); // Log the number of files
      values.files.forEach((item, index) => {
        console.log(`Processing file #${index + 1}:`, item); // Log each file object
        if (item.uri && item.type && item.name) {
          console.log("File has uri, type, and name:", item);
          const file = {
            uri: item.uri,
            type: item.type,
            name: item.name,
          };
          formdata.append("files", file);
        } else {
          console.log("File missing some properties:", item);
        }
      });
    } else {
      console.log("No files found or files is not an array");
    }

    formdata.append("amount", "0");

    if (values.documentType.length === 1) {
      values.documentType.forEach((item) => {
        formdata.append("documentType", item);
        formdata.append("documentType", "extra");
      });
    } else {
      values.documentType.forEach((item) => {
        formdata.append("documentType", item);
      });
    }

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    const response = await fetch(
      "https://backend.mymegaminds.com/api/project/student-upload",
      requestOptions
    );

    if (!response.ok) {
      // If response is not OK, throw an error
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json(); // Parse JSON response

    // Return a success indicator
    return { success: true, message: "Project created successfully!", result };
  } catch (error) {
    // Return a failure indicator
    return { success: false, message: "Failed to create project.", error };
  }
};
