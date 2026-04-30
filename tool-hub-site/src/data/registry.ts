import actorRenameTool from '../../data/tools/actor-rename-tool.json';
import type { ToolRecord } from '../types';

export const tools = [actorRenameTool as ToolRecord];

export const categories = Array.from(new Set(tools.map((tool) => tool.category))).sort();
export const riskLevels = Array.from(new Set(tools.map((tool) => tool.riskLevel))).sort();
export const statuses = Array.from(new Set(tools.map((tool) => tool.status))).sort();
