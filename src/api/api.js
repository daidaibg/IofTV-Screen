import axios from "axios";
import UtilVar from "@/config/UtilVar";

export const baseUrl = UtilVar.baseUrl;

// 统一使用同一个 axios 实例，避免请求配置散落在各个业务文件里。
const service = axios.create({
  baseURL: baseUrl,
});

// 部分接口保留 enc 标记，后续如果切换加密方式只需要改这里。
const withEncHeaders = () => ({
  headers: {
    enc: UtilVar.ENC,
  },
});

// 登录态和通用请求头在这里集中补齐，业务层只关心参数本身。
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

    // 按项目约定把业务态异常统一挡在请求层，页面里直接处理结果即可。
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

// GET/POST/PUT/DELETE 最终都走这里，减少重复 try/catch 和实例调用代码。
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

// 地图 geojson 这类静态资源不走业务 baseURL，所以保留一个无前缀请求方法。
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

// 上传接口额外提供取消上传和进度回调，方便页面做上传反馈。
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

// 下载接口保留 method / responseType 可配置，兼容文件流和导出场景。
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
