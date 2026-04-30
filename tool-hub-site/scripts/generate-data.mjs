import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const toolDataRoot = path.join(root, 'data', 'tools');
const publicRoot = path.join(root, 'public');
const apiRoot = path.join(publicRoot, 'api', 'tools');
const downloadRoot = path.join(publicRoot, 'downloads');

async function main() {
  await fs.mkdir(apiRoot, { recursive: true });
  await fs.mkdir(downloadRoot, { recursive: true });

  const fileNames = (await fs.readdir(toolDataRoot)).filter((fileName) => fileName.endsWith('.json'));
  const tools = [];

  for (const fileName of fileNames) {
    const sourcePath = path.join(toolDataRoot, fileName);
    const tool = JSON.parse(await fs.readFile(sourcePath, 'utf8'));
    tools.push(tool);
    await writeToolApi(tool);
    await writeDownloads(tool);
  }

  tools.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));

  const index = {
    schemaVersion: '1.0.0',
    generatedAt: new Date().toISOString(),
    total: tools.length,
    tools: tools.map((tool) => ({
      slug: tool.slug,
      name: tool.name,
      displayName: tool.displayName,
      description: tool.description,
      category: tool.category,
      author: tool.author,
      ownerTeam: tool.ownerTeam,
      status: tool.status,
      riskLevel: tool.riskLevel,
      tags: tool.tags,
      compatibility: tool.compatibility,
      mountPoint: tool.mountPoint,
      installPath: tool.installPath,
      latestVersion: tool.versions[0]?.version ?? '',
      updatedAt: tool.updatedAt,
      apiUrl: `/api/tools/${tool.slug}.json`,
      downloads: tool.downloads
    }))
  };

  await writeJson(path.join(apiRoot, 'index.json'), index);
  console.log(`Generated ${tools.length} tool API record(s).`);
}

async function writeToolApi(tool) {
  const payload = {
    schemaVersion: '1.0.0',
    generatedAt: new Date().toISOString(),
    tool
  };
  await writeJson(path.join(apiRoot, `${tool.slug}.json`), payload);
}

async function writeDownloads(tool) {
  for (const version of tool.versions) {
    const versionRoot = path.join(downloadRoot, tool.slug, version.version);
    await fs.mkdir(versionRoot, { recursive: true });
    await writeJson(path.join(versionRoot, 'manifest.json'), version.manifest);
    await fs.writeFile(path.join(versionRoot, 'README.md'), buildReadme(tool, version), 'utf8');
  }
}

function buildReadme(tool, version) {
  return `# ${tool.displayName} ${version.version}\n\n${tool.description}\n\n## Install\n\n${tool.summary.installSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}\n\n## Risk Notes\n\n${tool.summary.riskNotes.map((note) => `- ${note}`).join('\n')}\n\n## Change Summary\n\n${version.changeSummary}\n`;
}

async function writeJson(filePath, payload) {
  await fs.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
