import Tree1 from '@/components/Tree1';
import Tree2 from '@/components/Tree2';

import { Col, Row } from 'antd';

export default function IndexPage() {
  return (
    <Row>
      <Col span={12}>
        <h2>方法一:</h2>
        <Tree1 />
      </Col>
      <Col span={12}>
        <h2>方法二:</h2>
        <Tree2 />
      </Col>
    </Row>
  );
}
