最近在用 `antd` v4 的 `Tree` 组件时，想给 `Tree` 组件添加一个右键菜单功能，最初的想法是看看 `antd` 官方有没有提供现成的方法，遗憾的是，官方并没有给出一个统一的方法，只是建议大家先使用社区提供的组件，无奈，只能自己尝试实现一下此功能。

⚠️注意：以下所有示例都是基于 **antd@4.21.7** 版本。

## 方法一

思路是使用 `antd` 提供的 `Dropdown` 组件和 `Menu` 组件，结合 `Tre`e 组件提供的 `titleRender` 属性来实现，核心代码如下：

```ts
import { Tree, Dropdown, Menu } from 'antd';

export () => {
  const menu = (
    <Menu
      items={[
        {
          key: 'add',
          label: <span>新增</span>,
        },
        {
          key: 'delete',
          label: <span>删除</span>,
        },
        {
          key: 'update',
          label: <span>编辑</span>,
        },
      ]}
    />
  );
  
  const titleRender = (nodeData: DataNode) => {
    return (
      <Dropdown overlay={menu} trigger={['contextMenu']}>
        <div>{nodeData.title}</div>
      </Dropdown>
    );
  };

  return (
    <div>
      <Tree
        defaultExpandedKeys={['0-0-0', '0-0-1']}
        titleRender={titleRender}
        treeData={treeData}
      />
    </div>
  );
}
```

`Tree` 组件的 `titleRender` 方法提供了自定义渲染节点的能力，在每个节点外层包裹`Dropdown` 组件，利用 `Dropdown` 组件提供的 `trigger` 属性来定义触发下拉行为，属性值包括：`click`、`hover` 和 `contextMenu`，其中 `contextMenu` 表示右键触发下拉菜单， `overlay` 传入下拉菜单。

这种方式最简单直接，利用 `antd` 组件库提供的现有组件和api即可实现。

那么除了这种方式之外，还有别的方式可以实现右键菜单呢？

接下来我就介绍下另一个 `antd` `Tree` 组件实现右键菜单的方式。

## 方法二

