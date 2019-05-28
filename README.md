# @sinoui/use-rest-item-api

与单条数据的 RESTful 风格的增删改查 API 交互的状态管理 React Hook。

## 安装

```shell
yarn add @sinoui/use-rest-item-api
```

或者：

```shell
npm i --save @sinoui/use-rest-item-api
```

## 方法说明

```ts
import useRestItemApi from '@sinoui/use-rest-item-api';

const dataSource = useRestItemApi('/users', '1');

console.log('加载中状态', dataSource.isLoading);
console.log('加载失败状态', dataSource.isError);
console.log('数据', dataSource.data);

// 保存：save方法会根据数据中是否有id来判断调用后端的创建API还是更新API
dataSource.save({
  userName: '张三',
  sex: 'female',
});

// 删除
dataSource.delete();

// 只更新数据状态，而不向后端发送保存请求
dataSource.updateData({
  userName: '李四',
});
```

函数语法：

```ts
/**
 * 返回值接口
 */
interface DataSource<T> {
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
  reload(): Promise<T>;

  /**
   * 更新数据状态
   */
  updateData: (newData: T) => void;
}

/**
 * 配置接口
 */
interface Options<T> {
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
): DataSource<T>;
```
