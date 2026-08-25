import React, { useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { TOOL_GROUP_META, getToolGroupId, getGroupsForStep } from '../utils/toolGroups';
import { ManualLinkButton } from './ToolManuals';
import { getManualById } from '../data/toolManuals';

/**
 * 카테고리 탭 + 도구 카드 그리드
 */
const ToolGroupGrid = ({
  stepId,
  tools = [],
  completedTools = [],
  onSelectTool,
  onOpenManual,
  style
}) => {
  const groupIds = useMemo(() => getGroupsForStep(stepId, tools), [stepId, tools]);
  const [activeGroup, setActiveGroup] = useState('all');

  const filtered = useMemo(() => {
    if (activeGroup === 'all') return tools;
    return tools.filter(t => getToolGroupId(t.id) === activeGroup);
  }, [tools, activeGroup]);

  const safeGroup = groupIds.includes(activeGroup) ? activeGroup : 'all';

  return (
    <div style={style}>
      {groupIds.length > 1 && (
        <div className="tool-group-tabs" role="tablist" aria-label="도구 분류">
          {groupIds.map(gid => {
            const meta = TOOL_GROUP_META[gid] || { label: gid };
            const count = gid === 'all'
              ? tools.length
              : tools.filter(t => getToolGroupId(t.id) === gid).length;
            const active = safeGroup === gid;
            return (
              <button
                key={gid}
                type="button"
                role="tab"
                aria-selected={active}
                className={`tool-group-tab${active ? ' active' : ''}`}
                onClick={() => setActiveGroup(gid)}
              >
                {meta.label}
                <span className="tool-group-count">{count}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="tool-grid">
        {filtered.map(tool => {
          const done = completedTools.includes(tool.id);
          const hasManual = !!getManualById(tool.id);
          return (
            <div
              key={tool.id}
              className={`tool-card${done ? ' tool-card-done' : ''}`}
              onClick={() => onSelectTool?.(tool.id)}
            >
              {done && (
                <span className="tool-done-badge" title="완료">
                  <CheckCircle2 size={14} />
                </span>
              )}
              <div className="tool-icon-box">{tool.icon}</div>
              <div className="tool-title">{tool.title}</div>
              <div className="tool-desc">{tool.desc}</div>
              {hasManual && onOpenManual && (
                <div className="tool-card-actions" onClick={e => e.stopPropagation()}>
                  <ManualLinkButton toolId={tool.id} onOpen={onOpenManual} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b' }}>
          이 분류에 표시할 도구가 없습니다.
        </div>
      )}
    </div>
  );
};

export default ToolGroupGrid;
