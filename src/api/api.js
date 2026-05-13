import axios from "axios";
import UtilVar from "@/config/UtilVar";

export const baseUrl = UtilVar.baseUrl;

const service = axios.create({
  baseURL: baseUrl,
});

const withEncHeaders = () => ({
  headers: {
    enc: UtilVar.ENC,
  },
});

const withAuthHeaders = (config = {}) => {
  const token = localStorage.getItem("token");

  return {
    ...config,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      token,
      ...(config.headers || {}),
    },
  };
};

service.interceptors.request.use(
  (config) => withAuthHeaders(config),
  (error) => Promise.reject(error)
);

service.interceptors.response.use(
  (response) => {
    if (response.status !== 200) {
      return Promise.reject(response);
    }

    if (response.data.code === UtilVar.code) {
      return Promise.reject(response.data);
    }

    return response.data;
  },
  (error) =>
    Promise.reject(
      error || {
        success: false,
        msg: "未知异常，请联系管理员！",
      }
    )
);

const request = async (method, url, { params, data, config } = {}) => {
  try {
    return await service.request({
      method,
      url,
      params,
      data,
      ...withEncHeaders(),
      ...(config || {}),
    });
  } catch (error) {
    return error;
  }
};

export const GET = (url, params) => request("get", url, { params });

export const GETNOBASE = async (url, params) => {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const POST = (url, params) => request("post", url, { data: params });

export const PUT = (url, params) => request("put", url, { data: params });

export const DELETE = (url, params) =>
  request("delete", url, {
    data: params,
  });

export const FILESubmit = async (url, params, config = {}) => {
  try {
    return await service.post(url, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      cancelToken: new axios.CancelToken((cancel) => {
        if (config.setCancel) {
          config.setCancel(cancel);
        }
      }),
      onUploadProgress: (event) => {
        if (event.total > 0) {
          event.percent = (event.loaded / event.total) * 100;
        }

        if (config.onProgress) {
          config.onProgress(event);
        }
      },
    });
  } catch (error) {
    return error;
  }
};

export const FILE = async (config = {}, body, params) => {
  try {
    return await service.request({
      method: config.method || "get",
      url: config.url,
      data: body,
      params,
      responseType: config.responseType || "blob",
      onDownloadProgress: config.onProgress,
    });
  } catch (error) {
    return error;
  }
};
