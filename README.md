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

**第二种方法可以利用 onBlur 事件实现。**

HTML标签提供了 tabIndex 属性。

```
tabindex 指示某个元素是否可以聚焦，以及它是否/在何处参与顺序键盘导航（通常使用Tab键，因此得名）
```

它接受一个整数作为值，具有不同的结果，具体取决于整数的值：

- tabindex=负值 (通常是 tabindex=“-1”)，表示元素是可聚焦的，但是不能通过键盘导航来访问到该元素，用 JS 做页面小组件内部键盘导航的时候非常有用。
- tabindex="0" ，表示元素是可聚焦的，并且可以通过键盘导航来聚焦到该元素，它的相对顺序是当前处于的 DOM 结构来决定的。
- tabindex=正值，表示元素是可聚焦的，并且可以通过键盘导航来访问到该元素；它的相对顺序按照tabindex 的数值递增而滞后获焦。如果多个元素拥有相同的 `tabindex`，它们的相对顺序按照他们在当前 DOM 中的先后顺序决定

结合上面的介绍，第二种实现 `Tree` 组件的思路就有了。

我们给一个菜单添加一个div容器，并且给这个容器加上 `tabindex` 属性，值设为 -1，这样，这个容器以及容器包裹的菜单就具备了可以聚焦和失去焦点的特性。

当鼠标右键点击菜单的时候，会记录下当前右键事件的坐标值，利用这个坐标就可以定位右键菜单的坐标，通过 `css` 属性设置，将菜单设置为可视，并且触发div容器的 `focus` 事件。

因为菜单的div容器已经触发 `focus` 事件，此时，点击菜单之外的任意位置就会触发菜单的 `onBlur` 事件，在 `onBlur` 事件里，设置菜单的 `css` 属性值设置为 `display=none`，隐藏菜单。

核心代码如下：

```ts
export default function IndexPage() {
  const [pageX, setPageX] = useState(0);
  const [pageY, setPageY] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const dropdownElement: React.RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    focusDropdown();
  }, [showMenu]);

  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  const focusDropdown = () => {
    if (dropdownElement.current) {
      dropdownElement.current?.focus();
    }
  };

  const renderMenu = () => {
    if (pageX && pageY) {
      return (
        <div
          tabIndex={-1}
          style={{
            display: showMenu ? 'inherit' : 'none',
            position: 'fixed',
            left: pageX - 16,
            top: pageY + 8,
          }}
          ref={dropdownElement}
          onBlur={(e) => {
            e.stopPropagation();
            setShowMenu(false);
          }}
        >
          {menu}
        </div>
      );
    }
    return null;
  };

  const handleRightClick = ({ event, node }: any) => {
    event.stopPropagation();
    setPageX(event.pageX);
    setPageY(event.pageY);
    setShowMenu(true);
  };

  return (
    <div>
      <Tree
        onRightClick={handleRightClick}
        defaultExpandedKeys={['0-0', '0-1']}
        onSelect={onSelect}
        treeData={treeData}
      />
      {renderMenu()}
    </div>
  );
}
```

## 总结

以上两种方式，均可以实现给 `antd` 的 `Tree` 组件添加右键菜单，第一种方式比较常规，直接利用 `antd` 提供的现成的组件即可实现。第二种方式比较通用，并且主要是利用了 `HTML` 提供的属性来实现，不依赖于任意组件库，两种方式各有利弊，大家可以根据自己的需要随意选中。