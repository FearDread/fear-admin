import codeMessage from "./message";

const success = (response) => {
  if (!response.data.result) {
    response = {
      ...response,
      status: 404,
      url: null,
      data: {
        success: false,
        result: null,
      },
    };
  }
  const { data } = response;

  const message = data && data.message;
  const successText = message || codeMessage[response.status];

  console.log('SUCCESS DATA :: ', data);
  return data;
};

export default success;
