import useDataApi from '@sinoui/use-data-api';
import http from '@sinoui/http';
import useRestItemApi, { getFetchRecordUrl } from './index';

jest.mock('@sinoui/use-data-api');
jest.mock('@sinoui/http');

beforeEach(() => {
  (useDataApi as jest.Mock).mockReset();
});

it('创建加载数据的链接', () => {
  expect(getFetchRecordUrl('/users', undefined, false)).toBeUndefined();
  expect(getFetchRecordUrl('/users', '1')).toBe('/users/1');
  expect(getFetchRecordUrl('/users', undefined, true)).toBe('/users/_init');
});

it('加载数据', () => {
  const initialData = { userName: '张三' };
  (useDataApi as jest.Mock).mockReturnValue({ data: initialData });

  const dataSource = useRestItemApi('/users', undefined, {
    defaultData: initialData,
  });

  expect(dataSource.data).toBe(initialData);
  expect(useDataApi).toHaveBeenCalledWith(undefined, initialData);
});

it('有isLoading, isError, setData', () => {
  const isLoading = true;
  const isError = false;
  const setData = jest.fn();
  const doFetch = jest.fn();

  (useDataApi as jest.Mock).mockReturnValue({
    data: { id: '1' },
    isLoading,
    isError,
    setData,
    doFetch,
  });
  const dataSource = useRestItemApi('/users', '1');

  expect(dataSource.isLoading).toBe(isLoading);
  expect(dataSource.isError).toBe(isError);
  expect(dataSource.setData).toBe(setData);

  dataSource.reload();

  expect(doFetch).toHaveBeenCalledWith('/users/1');
});

it('数据创建后再重新加载', () => {
  const doFetch = jest.fn();
  (useDataApi as jest.Mock).mockReturnValue({ data: { id: '2' }, doFetch });
  const dataSource = useRestItemApi('/users', undefined);

  dataSource.reload();
  expect(doFetch).toHaveBeenCalledWith('/users/2');
});

it('创建数据', async () => {
  const response = {
    id: '1',
    userName: '张三',
  };
  const newData = {
    userName: '张三',
  };
  (http.post as jest.Mock).mockResolvedValue(response);
  const setData = jest.fn();
  (useDataApi as jest.Mock).mockReturnValue({
    data: {},
    setData,
  });

  const { save } = useRestItemApi('/users', undefined);

  const result = await save(newData);

  expect(http.post).toHaveBeenCalledWith('/users', newData);
  expect(setData).toHaveBeenCalledWith(response);
  expect(result).toEqual(response);
});

it('更新数据', async () => {
  const newData = {
    id: '1',
    userName: '李四',
  };
  const data = { id: '1', userName: '张三' };
  (http.put as jest.Mock).mockResolvedValue(newData);
  const setData = jest.fn();
  (useDataApi as jest.Mock).mockReturnValue({
    data,
    setData,
  });

  const { save } = useRestItemApi('/users', undefined);

  const result = await save(newData);

  expect(http.put).toHaveBeenCalledWith('/users/1', newData);
  expect(setData).toHaveBeenCalledWith(newData);
  expect(result).toEqual(newData);
});

it('删除数据', async () => {
  const defaultData = { userName: '张三' };
  (http.delete as jest.Mock).mockResolvedValue(null);
  const setData = jest.fn();
  (useDataApi as jest.Mock).mockReturnValue({
    data: { id: '1', userName: '张三' },
    setData,
  });

  const { delete: remove } = useRestItemApi('/users', undefined, {
    defaultData,
  });

  await remove();

  expect(http.delete).toHaveBeenCalledWith('/users/1');
  expect(setData).toHaveBeenCalledWith(defaultData);
});

it('不存在的数据，不需要删除', async () => {
  expect.assertions(1);

  (useDataApi as jest.Mock).mockReturnValue({
    data: {},
  });

  const { delete: remove } = useRestItemApi('/users', undefined);

  await expect(remove()).rejects.toThrow('不存在的数据，不需要删除');
});

it('加载失败后再重新加载', () => {
  const doFetch = jest.fn();
  (useDataApi as jest.Mock).mockReturnValue({
    isError: true,
    doFetch,
  });

  const dataSource = useRestItemApi('/users', '1');

  dataSource.reload();
  expect(doFetch).toHaveBeenCalledWith('/users/1');
});
