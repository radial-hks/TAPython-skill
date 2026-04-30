import {
  ApiOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  CloudDownloadOutlined,
  CodeOutlined,
  DiffOutlined,
  FileSearchOutlined,
  InfoCircleOutlined,
  SafetyCertificateOutlined,
  UploadOutlined
} from '@ant-design/icons';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Empty,
  Flex,
  Input,
  Layout,
  List,
  Select,
  Segmented,
  Space,
  Statistic,
  Table,
  Tabs,
  Tag,
  Timeline,
  Typography
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { categories, riskLevels, statuses, tools } from './data/registry';
import type { FileDiffRow, ManifestDiffRow, ToolFileManifest, ToolManifest, ToolRecord, ToolVersion } from './types';

const { Header, Content } = Layout;
const { Paragraph, Text, Title } = Typography;

type ViewMode = 'tools' | 'detail' | 'compare' | 'submit';

const riskColor: Record<string, string> = {
  low: 'green',
  medium: 'orange',
  high: 'red'
};

const statusColor: Record<string, string> = {
  approved: 'green',
  pending: 'gold',
  draft: 'default',
  rejected: 'red',
  deprecated: 'volcano',
  archived: 'default'
};

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('tools');
  const [selectedSlug, setSelectedSlug] = useState(tools[0]?.slug ?? '');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>();
  const [riskLevel, setRiskLevel] = useState<string>();
  const [status, setStatus] = useState<string>();

  const selectedTool = tools.find((tool) => tool.slug === selectedSlug) ?? tools[0];

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return tools.filter((tool) => {
      const searchText = [
        tool.name,
        tool.displayName,
        tool.description,
        tool.category,
        tool.author,
        tool.ownerTeam,
        ...tool.tags,
        ...tool.summary.unrealApis,
        ...tool.summary.widgetAkas
      ]
        .join(' ')
        .toLowerCase();

      return (
        (!normalizedQuery || searchText.includes(normalizedQuery)) &&
        (!category || tool.category === category) &&
        (!riskLevel || tool.riskLevel === riskLevel) &&
        (!status || tool.status === status)
      );
    });
  }, [category, query, riskLevel, status]);

  return (
    <Layout className="app-shell">
      <Header className="app-header">
        <Flex align="center" justify="space-between" gap={16} wrap="wrap">
          <Space direction="vertical" size={0}>
            <Text className="eyebrow">TAPython Tool Hub</Text>
            <Title level={3}>编辑器工具分享站</Title>
          </Space>
          <Segmented
            value={viewMode}
            onChange={(value) => setViewMode(value as ViewMode)}
            options={[
              { label: '工具库', value: 'tools', icon: <AppstoreOutlined /> },
              { label: '详情', value: 'detail', icon: <FileSearchOutlined /> },
              { label: '版本对比', value: 'compare', icon: <DiffOutlined /> },
              { label: '投稿', value: 'submit', icon: <UploadOutlined /> }
            ]}
          />
        </Flex>
      </Header>
      <Content className="app-content">
        <OverviewStats />
        {viewMode === 'tools' && (
          <ToolCatalog
            filteredTools={filteredTools}
            query={query}
            category={category}
            riskLevel={riskLevel}
            status={status}
            setQuery={setQuery}
            setCategory={setCategory}
            setRiskLevel={setRiskLevel}
            setStatus={setStatus}
            onOpenTool={(tool) => {
              setSelectedSlug(tool.slug);
              setViewMode('detail');
            }}
          />
        )}
        {viewMode === 'detail' && selectedTool && <ToolDetail tool={selectedTool} />}
        {viewMode === 'compare' && selectedTool && <CompareView tool={selectedTool} />}
        {viewMode === 'submit' && <SubmitGuide />}
      </Content>
    </Layout>
  );
}

function OverviewStats() {
  const latestUpdates = tools.filter((tool) => tool.status === 'approved').length;
  const versionCount = tools.reduce((total, tool) => total + tool.versions.length, 0);

  return (
    <section className="stats-grid" aria-label="Tool Hub summary">
      <Card>
        <Statistic title="工具数量" value={tools.length} prefix={<AppstoreOutlined />} />
      </Card>
      <Card>
        <Statistic title="已审核工具" value={latestUpdates} prefix={<CheckCircleOutlined />} />
      </Card>
      <Card>
        <Statistic title="版本快照" value={versionCount} prefix={<DiffOutlined />} />
      </Card>
      <Card>
        <Statistic title="部署模式" value="LAN MVP" prefix={<SafetyCertificateOutlined />} />
      </Card>
    </section>
  );
}

interface ToolCatalogProps {
  filteredTools: ToolRecord[];
  query: string;
  category?: string;
  riskLevel?: string;
  status?: string;
  setQuery: (value: string) => void;
  setCategory: (value?: string) => void;
  setRiskLevel: (value?: string) => void;
  setStatus: (value?: string) => void;
  onOpenTool: (tool: ToolRecord) => void;
}

function ToolCatalog({
  filteredTools,
  query,
  category,
  riskLevel,
  status,
  setQuery,
  setCategory,
  setRiskLevel,
  setStatus,
  onOpenTool
}: ToolCatalogProps) {
  return (
    <Space direction="vertical" size={16} className="full-width">
      <Card>
        <Flex gap={12} wrap="wrap" align="center">
          <Input.Search
            className="search-input"
            placeholder="搜索工具名、标签、作者、Unreal API 或控件 Aka"
            allowClear
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Select
            className="filter-select"
            allowClear
            placeholder="分类"
            value={category}
            onChange={setCategory}
            options={categories.map((value) => ({ value, label: value }))}
          />
          <Select
            className="filter-select"
            allowClear
            placeholder="风险等级"
            value={riskLevel}
            onChange={setRiskLevel}
            options={riskLevels.map((value) => ({ value, label: value }))}
          />
          <Select
            className="filter-select"
            allowClear
            placeholder="审核状态"
            value={status}
            onChange={setStatus}
            options={statuses.map((value) => ({ value, label: value }))}
          />
        </Flex>
      </Card>

      {filteredTools.length === 0 ? (
        <Card>
          <Empty description="没有找到匹配工具" />
        </Card>
      ) : (
        <section className="tool-grid">
          {filteredTools.map((tool) => (
            <Card
              key={tool.slug}
              className="tool-card"
              title={tool.displayName}
              extra={<Tag color={statusColor[tool.status]}>{tool.status}</Tag>}
              actions={[
                <Button type="link" onClick={() => onOpenTool(tool)} key="detail">
                  查看详情
                </Button>,
                <Button type="link" href={tool.downloads.latestManifest} target="_blank" key="manifest">
                  manifest
                </Button>
              ]}
            >
              <Paragraph className="tool-description">{tool.description}</Paragraph>
              <Space wrap size={[4, 8]}>
                <Tag color="blue">{tool.category}</Tag>
                <Tag color={riskColor[tool.riskLevel]}>风险 {tool.riskLevel}</Tag>
                <Tag>{tool.versions[0]?.version}</Tag>
              </Space>
              <Divider />
              <Space direction="vertical" size={8} className="full-width">
                <Text type="secondary">作者：{tool.author}</Text>
                <Text type="secondary">挂载点：{tool.mountPoint}</Text>
                <Text type="secondary">UE：{tool.compatibility.unrealEngine.join(', ')}</Text>
                <Flex gap={4} wrap="wrap">
                  {tool.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </Flex>
              </Space>
            </Card>
          ))}
        </section>
      )}
    </Space>
  );
}

function ToolDetail({ tool }: { tool: ToolRecord }) {
  const latestVersion = tool.versions[0];

  return (
    <Space direction="vertical" size={16} className="full-width">
      <Card>
        <Flex justify="space-between" align="flex-start" gap={16} wrap="wrap">
          <Space direction="vertical" size={8}>
            <Space wrap>
              <Title level={2}>{tool.displayName}</Title>
              <Tag color={riskColor[tool.riskLevel]}>风险 {tool.riskLevel}</Tag>
              <Tag color={statusColor[tool.status]}>{tool.status}</Tag>
            </Space>
            <Paragraph className="detail-summary">{tool.description}</Paragraph>
            <Space wrap>
              {tool.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Space>
          </Space>
          <Space wrap>
            <Button icon={<CloudDownloadOutlined />} href={latestVersion.downloads.readme} target="_blank">
              README
            </Button>
            <Button icon={<ApiOutlined />} href={latestVersion.downloads.manifest} target="_blank">
              manifest
            </Button>
            <Button icon={<CloudDownloadOutlined />} disabled={!latestVersion.downloads.package}>
              ZIP 待生成
            </Button>
          </Space>
        </Flex>
      </Card>

      <Tabs
        items={[
          {
            key: 'overview',
            label: '概览',
            children: <ToolOverview tool={tool} />
          },
          {
            key: 'install',
            label: '安装',
            children: <InstallGuide tool={tool} />
          },
          {
            key: 'manifest',
            label: 'Manifest',
            children: <ManifestPanel manifest={latestVersion.manifest} />
          },
          {
            key: 'versions',
            label: '版本',
            children: <VersionTimeline versions={tool.versions} />
          }
        ]}
      />
    </Space>
  );
}

function ToolOverview({ tool }: { tool: ToolRecord }) {
  return (
    <Card>
      <Descriptions bordered column={{ xs: 1, md: 2 }} size="small">
        <Descriptions.Item label="工具名">{tool.name}</Descriptions.Item>
        <Descriptions.Item label="分类">{tool.category}</Descriptions.Item>
        <Descriptions.Item label="作者">{tool.author}</Descriptions.Item>
        <Descriptions.Item label="团队">{tool.ownerTeam}</Descriptions.Item>
        <Descriptions.Item label="挂载点">{tool.mountPoint}</Descriptions.Item>
        <Descriptions.Item label="入口 JSON">{tool.entryJson}</Descriptions.Item>
        <Descriptions.Item label="安装路径" span={2}>
          {tool.installPath}
        </Descriptions.Item>
        <Descriptions.Item label="Unreal Engine">{tool.compatibility.unrealEngine.join(', ')}</Descriptions.Item>
        <Descriptions.Item label="TAPython">{tool.compatibility.tapython.join(', ')}</Descriptions.Item>
      </Descriptions>
      <Divider />
      <Col className="two-column-list">
        <Card size="small" title="核心功能">
          <List dataSource={tool.summary.features} renderItem={(item) => <List.Item>{item}</List.Item>} />
        </Card>
        <Card size="small" title="Unreal API">
          <List dataSource={tool.summary.unrealApis} renderItem={(item) => <List.Item>{item}</List.Item>} />
        </Card>
      </Col>
    </Card>
  );
}

function InstallGuide({ tool }: { tool: ToolRecord }) {
  const latestManifest = tool.versions[0].manifest;
  return (
    <Card>
      <Alert
        type="warning"
        showIcon
        message="安装前需要预览写入文件和 MenuConfig 合并项"
        description="站点不直接写用户项目目录。手动安装或 Agent 安装都应先确认目标路径、同名工具和 MenuConfig diff。"
      />
      <Divider />
      <Title level={4}>手动安装</Title>
      <Timeline items={tool.summary.installSteps.map((step) => ({ children: step }))} />
      <Title level={4}>Agent 安装入口</Title>
      <Paragraph>
        Agent 应先读取 <Text code>/api/tools/{tool.slug}.json</Text>，再下载 manifest 和工具包，校验后展示安装预览。
      </Paragraph>
      <Title level={4}>MenuConfig 合并项</Title>
      <pre className="code-block">{JSON.stringify(latestManifest.menuConfigMerge.itemsToAdd, null, 2)}</pre>
    </Card>
  );
}

function ManifestPanel({ manifest }: { manifest: ToolManifest }) {
  const fileColumns: ColumnsType<ToolFileManifest> = [
    { title: '文件', dataIndex: 'path', key: 'path' },
    { title: 'SHA256', dataIndex: 'sha256', key: 'sha256' },
    { title: '大小', dataIndex: 'size', key: 'size', render: (value) => `${value} B` }
  ];

  return (
    <Space direction="vertical" size={16} className="full-width">
      <Card>
        <Descriptions bordered column={{ xs: 1, md: 2 }} size="small">
          <Descriptions.Item label="版本">{manifest.version}</Descriptions.Item>
          <Descriptions.Item label="风险">{manifest.riskLevel}</Descriptions.Item>
          <Descriptions.Item label="安装路径" span={2}>
            {manifest.installPath}
          </Descriptions.Item>
          <Descriptions.Item label="挂载点">{manifest.mountPoint}</Descriptions.Item>
          <Descriptions.Item label="入口 JSON">{manifest.entryJson}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="文件清单">
        <Table rowKey="path" columns={fileColumns} dataSource={manifest.files} pagination={false} size="small" />
      </Card>
      <Card title="完整 Manifest">
        <pre className="code-block">{JSON.stringify(manifest, null, 2)}</pre>
      </Card>
    </Space>
  );
}

function VersionTimeline({ versions }: { versions: ToolVersion[] }) {
  return (
    <Card>
      <Timeline
        items={versions.map((version) => ({
          color: version.breaking ? 'red' : 'blue',
          children: (
            <Space direction="vertical" size={4}>
              <Space wrap>
                <Text strong>{version.version}</Text>
                <Text type="secondary">{version.releasedAt}</Text>
                {version.breaking && <Tag color="red">breaking</Tag>}
              </Space>
              <Text>{version.changeSummary}</Text>
              <Space wrap>
                <Button size="small" href={version.downloads.manifest} target="_blank">
                  manifest
                </Button>
                <Button size="small" href={version.downloads.readme} target="_blank">
                  README
                </Button>
              </Space>
            </Space>
          )
        }))}
      />
    </Card>
  );
}

function CompareView({ tool }: { tool: ToolRecord }) {
  const [fromVersion, setFromVersion] = useState(tool.versions[1]?.version ?? tool.versions[0]?.version);
  const [toVersion, setToVersion] = useState(tool.versions[0]?.version);

  const from = tool.versions.find((version) => version.version === fromVersion) ?? tool.versions[0];
  const to = tool.versions.find((version) => version.version === toVersion) ?? tool.versions[0];
  const fieldRows = buildManifestDiff(from.manifest, to.manifest);
  const fileRows = buildFileDiff(from.manifest.files, to.manifest.files);

  const fieldColumns: ColumnsType<ManifestDiffRow> = [
    { title: '字段', dataIndex: 'label', key: 'label', width: 180 },
    { title: `From ${from.version}`, dataIndex: 'fromValue', key: 'fromValue' },
    { title: `To ${to.version}`, dataIndex: 'toValue', key: 'toValue' },
    {
      title: '状态',
      dataIndex: 'changed',
      key: 'changed',
      width: 100,
      render: (changed: boolean) => (changed ? <Tag color="orange">changed</Tag> : <Tag>same</Tag>)
    }
  ];

  const fileColumns: ColumnsType<FileDiffRow> = [
    { title: '文件', dataIndex: 'path', key: 'path' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (value) => <Tag color={value === 'unchanged' ? 'default' : value === 'added' ? 'green' : value === 'removed' ? 'red' : 'orange'}>{value}</Tag>
    },
    { title: 'From Hash', dataIndex: 'fromHash', key: 'fromHash' },
    { title: 'To Hash', dataIndex: 'toHash', key: 'toHash' }
  ];

  return (
    <Space direction="vertical" size={16} className="full-width">
      <Card>
        <Flex gap={12} wrap="wrap" align="center">
          <Text strong>工具：</Text>
          <Tag color="blue">{tool.displayName}</Tag>
          <Select
            className="version-select"
            value={fromVersion}
            onChange={setFromVersion}
            options={tool.versions.map((version) => ({ value: version.version, label: version.version }))}
          />
          <Text>对比到</Text>
          <Select
            className="version-select"
            value={toVersion}
            onChange={setToVersion}
            options={tool.versions.map((version) => ({ value: version.version, label: version.version }))}
          />
        </Flex>
      </Card>
      <Card title="Manifest 字段差异">
        <Table rowKey="key" columns={fieldColumns} dataSource={fieldRows} pagination={false} size="small" />
      </Card>
      <Card title="ZIP 包级文件差异">
        <Table rowKey="path" columns={fileColumns} dataSource={fileRows} pagination={false} size="small" />
      </Card>
    </Space>
  );
}

function SubmitGuide() {
  return (
    <Space direction="vertical" size={16} className="full-width">
      <Card title="MVP 投稿流程">
        <Timeline
          items={[
            { children: '按工具文档规范准备 README、MenuConfig 片段、UI JSON、Python Controller 和 manifest。' },
            { children: '将工具包提交给维护者或放入内网共享目录。' },
            { children: '维护者校验结构、兼容性、风险说明和版本记录。' },
            { children: '构建脚本生成工具索引、静态 API、manifest 快照和下载入口。' }
          ]}
        />
      </Card>
      <Card title="必填检查项">
        <List
          dataSource={[
            '工具名、版本、作者、分类、标签和兼容版本完整。',
            'ZIP 内包含工具目录、README、manifest 和 MenuConfig.snippet.json。',
            '风险等级和不可撤销操作说明清楚。',
            'Agent 安装前必须展示文件写入和 MenuConfig diff。'
          ]}
          renderItem={(item) => <List.Item><InfoCircleOutlined /> {item}</List.Item>}
        />
      </Card>
    </Space>
  );
}

function buildManifestDiff(from: ToolManifest, to: ToolManifest): ManifestDiffRow[] {
  const rows: Array<[keyof ToolManifest, string]> = [
    ['version', '版本'],
    ['description', '描述'],
    ['category', '分类'],
    ['tags', '标签'],
    ['compatibility', '兼容性'],
    ['mountPoint', '挂载点'],
    ['installPath', '安装路径'],
    ['riskLevel', '风险等级'],
    ['preInstallChecks', '安装前检查'],
    ['postInstallSteps', '安装后步骤']
  ];

  return rows.map(([key, label]) => {
    const fromValue = stringifyDiffValue(from[key]);
    const toValue = stringifyDiffValue(to[key]);
    return {
      key: String(key),
      label,
      fromValue,
      toValue,
      changed: fromValue !== toValue
    };
  });
}

function buildFileDiff(fromFiles: ToolFileManifest[], toFiles: ToolFileManifest[]): FileDiffRow[] {
  const fromMap = new Map(fromFiles.map((file) => [file.path, file]));
  const toMap = new Map(toFiles.map((file) => [file.path, file]));
  const paths = Array.from(new Set([...fromMap.keys(), ...toMap.keys()])).sort();

  return paths.map((path) => {
    const fromFile = fromMap.get(path);
    const toFile = toMap.get(path);
    const status: FileDiffRow['status'] = !fromFile
      ? 'added'
      : !toFile
        ? 'removed'
        : fromFile.sha256 === toFile.sha256 && fromFile.size === toFile.size
          ? 'unchanged'
          : 'modified';

    return {
      path,
      status,
      fromHash: fromFile?.sha256 ?? '-',
      toHash: toFile?.sha256 ?? '-',
      fromSize: fromFile?.size,
      toSize: toFile?.size
    };
  });
}

function stringifyDiffValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (value && typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value ?? '');
}

export default App;
