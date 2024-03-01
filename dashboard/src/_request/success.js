//import { notification } from "antd";

import codeMessage from "./message";

const success = (response, typeNotification = {}) => {
  if (!response.data) {
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

  return response;
};

export default success;
