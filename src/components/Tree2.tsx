import { Tree, Menu } from 'antd';
import { useState, useRef, useEffect } from 'react';
import type { DataNode, TreeProps } from 'antd/es/tree';

const treeData: DataNode[] = [
  {
    title: '中国',
    key: '0',
    children: [
      {
        title: '江苏',
        key: '0-0',
        children: [
          {
            title: '南京',
            key: '0-0-0',
          },
          {
            title: '扬州',
            key: '0-0-1',
          },
        ],
      },
      {
        title: '上海',
        key: '0-1',
        children: [
          {
            title: '长宁区',
            key: '0-1-0',
          },
          {
            title: '徐汇区',
            key: '0-1-1',
          },
        ],
      },
    ],
  },
];

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

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.antgroup.com"
            >
              新增
            </a>
          ),
        },
        {
          key: '2',
          label: (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.aliyun.com"
            >
              删除
            </a>
          ),
        },
        {
          key: '3',
          label: (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.luohanacademy.com"
            >
              编辑
            </a>
          ),
        },
      ]}
    />
  );

  const renderMenu = () => {
    console.log('pageX', pageX);
    console.log('pageY', pageY);

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
