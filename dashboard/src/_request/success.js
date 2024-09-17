

const success = (response) => {
  console.log('SUCCESS DATA :: ', response);
  if (!response.data.result) {
    response = {
      ...response,
      status: 404,
      url: null,
      success: false,
      result: null,
    };
  } 

  return response;
};

export default success;
