import useDataApi from '@sinoui/use-data-api';
import http from '@sinoui/http';
import { DataSource, Options, StrictOptions } from './types';

const DEFAULT_DATA = {};
const DEFAULT_OPTIONS = {
  loadInitData: false,
  idPropertyName: 'id',
  defaultData: DEFAULT_DATA,
};

/**
 * 获取加载数据的链接
 *
 * @param {string} baseUrl 基础url
 * @param {string} [id] 数据id
 * @param {boolean} [loadInitData] 是否访问初始化API获取默认数据
 * @returns
 */
export function getFetchRecordUrl(
  baseUrl: string,
  id?: string,
  loadInitData?: boolean,
) {
  if (id) {
    return `${baseUrl}/${id}`;
  }
  if (loadInitData) {
    return `${baseUrl}/_init`;
  }
  return undefined;
}

/**
 * 与单条数据的 RESTful 风格的增删改查 API 交互的状态管理 hook。
 *
 * @param {string} url RESTful API的资源集合url，即基础url，如`/users`
 * @param {string} [id] 需要加载数据的id。可以是`undefined`，这时可能表示的是用户刚打开创建表单。
 * @param {Options} [options] 选项。
 * @returns {DataSource}
 */
function useRestItemApi<T>(
  url: string,
  id?: string,
  options?: Options<T>,
): DataSource<T> {
  const innerOptions: StrictOptions<T> = {
    ...(DEFAULT_OPTIONS as StrictOptions<T>),
    ...options,
  };
  const defaultUrl = getFetchRecordUrl(url, id, innerOptions.loadInitData);
  const { data, isLoading, isError, updateData, doFetch } = useDataApi<T>(
    defaultUrl,
    innerOptions.defaultData as T,
  );

  const reload = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataId: string = (data as any)[innerOptions.idPropertyName];
    doFetch(getFetchRecordUrl(url, dataId, innerOptions.loadInitData));
  };

  const save = async (newData: T) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataId: string = (data as any)[innerOptions.idPropertyName];
    let result: T;
    if (!dataId) {
      result = await http.post<T>(url, newData);
    } else {
      result = await http.put<T>(`${url}/${dataId}`, newData);
    }
    updateData(result);
    return result;
  };

  const remove = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataId: string = (data as any)[innerOptions.idPropertyName];
    if (dataId) {
      await http.delete(`${url}/${dataId}`);
      updateData(innerOptions.defaultData);
    } else {
      throw new Error(`不存在的数据，不需要删除`);
    }
  };

  return { data, isLoading, isError, updateData, reload, save, delete: remove };
}

export default useRestItemApi;
