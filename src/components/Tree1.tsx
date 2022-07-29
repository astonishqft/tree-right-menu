import { Tree, Dropdown, Menu } from 'antd';
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
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
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
        defaultExpandedKeys={['0-0', '0-1']}
        titleRender={titleRender}
        onSelect={onSelect}
        onCheck={onCheck}
        treeData={treeData}
      />
    </div>
  );
}
