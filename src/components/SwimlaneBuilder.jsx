import React, { useState } from 'react';
import { Trash2, GripVertical, ChevronRight } from 'lucide-react';

const SwimlaneBuilder = ({ data, onChange }) => {
  // Ensure data exists
  const safeData = data || { lanes: [] };
  const lanes = safeData.lanes || [];

  const [draggedCard, setDraggedCard] = useState(null);

  // Add Lane
  const addLane = () => {
    const newLanes = [...lanes, { id: Date.now().toString(), title: '새 부서/역할', cards: [] }];
    onChange({ ...safeData, lanes: newLanes });
  };

  // Delete Lane
  const deleteLane = (laneId) => {
    if (!window.confirm('정말 이 레인을 삭제하시겠습니까? (내부 업무도 삭제됩니다)')) return;
    onChange({ ...safeData, lanes: lanes.filter(l => l.id !== laneId) });
  };

  // Update Lane Title
  const updateLaneTitle = (laneId, newTitle) => {
    onChange({
      ...safeData,
      lanes: lanes.map(l => l.id === laneId ? { ...l, title: newTitle } : l)
    });
  };

  // Add Card to Lane
  const addCard = (laneId) => {
    onChange({
      ...safeData,
      lanes: lanes.map(l => {
        if (l.id === laneId) {
          return {
            ...l,
            cards: [...(l.cards || []), { id: Date.now().toString() + Math.random(), text: '새 업무', type: 'process' }]
          };
        }
        return l;
      })
    });
  };

  // Delete Card
  const deleteCard = (laneId, cardId) => {
    onChange({
      ...safeData,
      lanes: lanes.map(l => {
        if (l.id === laneId) {
          return { ...l, cards: l.cards.filter(c => c.id !== cardId) };
        }
        return l;
      })
    });
  };

  // Update Card Text
  const updateCardText = (laneId, cardId, text) => {
    onChange({
      ...safeData,
      lanes: lanes.map(l => {
        if (l.id === laneId) {
          return {
            ...l,
            cards: l.cards.map(c => c.id === cardId ? { ...c, text } : c)
          };
        }
        return l;
      })
    });
  };

  // Update Card Type
  const updateCardType = (laneId, cardId, type) => {
    onChange({
      ...safeData,
      lanes: lanes.map(l => {
        if (l.id === laneId) {
          return {
            ...l,
            cards: l.cards.map(c => c.id === cardId ? { ...c, type } : c)
          };
        }
        return l;
      })
    });
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, laneId, card) => {
    setDraggedCard({ laneId, card });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetLaneId, dropIndex) => {
    e.preventDefault();
    if (!draggedCard) return;

    const { laneId: sourceLaneId, card } = draggedCard;
    
    // Create new copy
    let newLanes = JSON.parse(JSON.stringify(lanes));

    // Remove from source
    const sourceLane = newLanes.find(l => l.id === sourceLaneId);
    if (!sourceLane) return; // safety
    sourceLane.cards = sourceLane.cards.filter(c => c.id !== card.id);

    // Add to target
    const targetLane = newLanes.find(l => l.id === targetLaneId);
    if (!targetLane) return;

    if (dropIndex !== undefined) {
       targetLane.cards.splice(dropIndex, 0, card);
    } else {
       targetLane.cards.push(card);
    }

    onChange({ ...safeData, lanes: newLanes });
    setDraggedCard(null);
  };

  const getCardStyle = (type) => {
    switch(type) {
      case 'start': return { background: '#ef4444', color: 'white', borderRadius: '20px' };
      case 'end': return { background: '#10b981', color: 'white', borderRadius: '20px' };
      case 'decision': return { background: '#fef3c7', color: '#b45309', border: '2px solid #fde68a', borderRadius: '4px' };
      default: return { background: '#e0f2fe', color: '#0369a1', border: '1px solid #7dd3fc', borderRadius: '8px' };
    }
  };

  return (
    <div className="swimlane-builder" style={{ width: '100%', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.2rem' }}>직접 그리는 화이트보드 템플릿</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>부서를 추가하고 담당 업무 포스트잇을 붙여 다이어그램을 완성하세요.</p>
        </div>
        <button className="btn btn-primary" onClick={addLane} style={{ padding: '0.5rem 1rem' }}>+ 부서(레인) 추가</button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: '850px', display: 'flex', flexDirection: 'column', gap: '4px', background: '#cbd5e1', padding: '4px', borderRadius: '8px' }}>
          {lanes.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', background: 'white', color: '#64748b', borderRadius: '4px' }}>
              상단의 '+ 부서(레인) 추가' 버튼을 눌러 작업을 시작하세요. 프로세스맵일 경우 1개의 업무 흐름 레인만 추가하셔도 됩니다.
            </div>
          )}
          
          {lanes.map((lane) => (
            <div key={lane.id} style={{ display: 'flex', background: 'white', minHeight: '130px', borderRadius: '4px', overflow: 'hidden' }}>
              {/* Lane Header */}
              <div style={{ width: '150px', padding: '1rem', background: '#f1f5f9', borderRight: '2px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
                <textarea 
                  value={lane.title} 
                  onChange={(e) => updateLaneTitle(lane.id, e.target.value)} 
                  style={{ fontWeight: 'bold', width: '100%', border: '1px solid transparent', background: 'transparent', padding: '4px', color: '#334155', resize: 'none', height: '50px', outline: 'none' }} 
                  title="클릭하여 부서명 수정"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <button onClick={() => addCard(lane.id)} style={{ fontSize: '0.8rem', padding: '4px', background: '#e2e8f0', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#0f172a' }}>+ 업무 추가</button>
                  <button onClick={() => deleteLane(lane.id)} style={{ fontSize: '0.8rem', color: '#ef4444', padding: '4px', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16}/></button>
                </div>
              </div>

              {/* Drop Zone */}
              <div 
                style={{ flex: 1, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', position: 'relative' }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, lane.id)}
              >
                {(lane.cards || []).map((card, index) => (
                  <React.Fragment key={card.id}>
                    <div 
                      draggable
                      onDragStart={(e) => handleDragStart(e, lane.id, card)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => {
                        e.stopPropagation(); // prevent lane drop catching it
                        handleDrop(e, lane.id, index);
                      }}
                      style={{ 
                        ...getCardStyle(card.type),
                        padding: '0.5rem',
                        minWidth: '140px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        cursor: 'grab',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        position: 'relative',
                        zIndex: 2,
                        transition: 'transform 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <GripVertical size={16} color="inherit" style={{ opacity: 0.6, cursor: 'grab' }} />
                        <button onClick={() => deleteCard(lane.id, card.id)} style={{ background: 'none', border: 'none', color: 'inherit', opacity: 0.6, cursor: 'pointer', fontSize: '1.2rem', padding: 0, lineHeight: 1 }}>&times;</button>
                      </div>
                      <textarea 
                        value={card.text}
                        onChange={(e) => updateCardText(lane.id, card.id, e.target.value)}
                        style={{ background: 'transparent', border: 'none', color: 'inherit', resize: 'none', width: '100%', outline: 'none', textAlign: 'center', fontWeight: 'bold', minHeight: '40px', fontFamily: 'inherit' }}
                        placeholder="업무 내용"
                      />
                      <select 
                        value={card.type} 
                        onChange={(e) => updateCardType(lane.id, card.id, e.target.value)}
                        style={{ background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '4px', fontSize: '0.75rem', padding: '2px', color: '#1e293b', outline: 'none' }}
                      >
                        <option value="process">일반 업무 (사각)</option>
                        <option value="decision">의사결정 (마름모형)</option>
                        <option value="start">시작 (빨강)</option>
                        <option value="end">결과 (초록)</option>
                      </select>
                    </div>
                    {/* Visual Connector inside lane */}
                    {index < (lane.cards.length - 1) && (
                       <ChevronRight size={20} color="#94a3b8" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.85rem' }}>
        💡 <b>작성 팁:</b> 카드의 왼쪽 그립(<GripVertical size={12}/>)을 길게 클릭하여 다른 부서 레인이나 순서로 드래그 앤 드롭 할 수 있습니다. 
      </div>
    </div>
  );
};

export default SwimlaneBuilder;
