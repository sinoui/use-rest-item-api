/**
 * 返回值接口
 */
export interface DataSource<T> {
  /**
   * 数据
   */
  data: T;
  /**
   * 是否加载中的状态
   */
  isLoading: boolean;
  /**
   * 是否加载错误的状态
   */
  isError: boolean;
  /**
   * 保存数据。将数据提交给后端的创建API或者更新API，成功后更新data状态。
   */
  save(newData: T): Promise<T>;
  /**
   * 删除数据。与后端的删除API交互。
   */
  delete(): Promise<void>;
  /**
   * 重新加载数据
   */
  reload(): void;

  /**
   * 更新数据状态
   */
  setData: (newData: T) => void;
}

/**
 * 配置接口
 */
export interface Options<T> {
  /**
   * 默认数据
   */
  defaultData?: T;
  /**
   * 是否加载初始化数据。如果为`true`，且`id`为空时，会向后端发送一个`${baseUrl}/_init`的请求，获取初始化数据。默认为`false`。
   */
  loadInitData?: boolean;
  /**
   * 数据中唯一键属性名。默认为`id`。
   */
  idPropertyName?: string;
}

export interface StrictOptions<T> {
  /**
   * 默认数据
   */
  defaultData: T;
  /**
   * 是否加载初始化数据。如果为`true`，且`id`为空时，会向后端发送一个`${baseUrl}/_init`的请求，获取初始化数据。默认为`false`。
   */
  loadInitData: boolean;
  /**
   * 数据中唯一键属性名。默认为`id`。
   */
  idPropertyName: string;
}
