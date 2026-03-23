import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Logic Tree Node Component
const TreeNode = ({ node, onAdd, onDelete, onUpdate, onSelect }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(node.content);

    const handleBlur = () => {
        setIsEditing(false);
        onUpdate(node.id, editText);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleBlur();
        }
    };

    const getNodeColor = (type, isSelected) => {
        const baseColors = {
            'mega-y': '#4299e1', // Blue
            'big-y': '#48bb78', // Green
            'project': '#9f7aea', // Purple
            'default': '#cbd5e0'
        };

        // If selected, return a darker/stronger version or keep base but we will use it for background
        return baseColors[type] || baseColors['default'];
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'mega-y': return 'Mega-Y (전략)';
            case 'big-y': return 'Big-Y (지표)';
            case 'project': return 'Project (과제)';
            default: return 'Node';
        }
    };

    const hasChildren = node.children && node.children.length > 0;
    const isSelected = node.isSelected;
    const borderColor = getNodeColor(node.type, isSelected);

    return (
        <div className="tree-node-wrapper" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="tree-node-card"
                style={{
                    background: isSelected ? `${borderColor}20` : 'white', // Light tint if selected
                    border: `2px solid ${borderColor}`,
                    // Stronger visual for selected
                    boxShadow: isSelected
                        ? `0 0 0 4px ${borderColor}40, 0 4px 6px rgba(0,0,0,0.1)`
                        : '0 4px 6px rgba(0,0,0,0.1)',
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                    borderRadius: '12px',
                    padding: '1rem',
                    minWidth: '200px',
                    maxWidth: '240px',
                    position: 'relative',
                    zIndex: 10,
                    margin: '0.5rem 0',
                    transition: 'all 0.2s ease'
                }}
            >
                <div style={{
                    fontSize: '0.75rem',
                    color: borderColor,
                    fontWeight: 'bold',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span>{getTypeLabel(node.type)}</span>
                    {isSelected && <span style={{ fontSize: '10px', background: borderColor, color: 'white', padding: '2px 6px', borderRadius: '10px' }}>SELECTED</span>}
                </div>

                {isEditing ? (
                    <input
                        autoFocus
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        style={{
                            width: '100%',
                            padding: '0.25rem',
                            border: '1px solid #e2e8f0',
                            borderRadius: '4px'
                        }}
                    />
                ) : (
                    <div
                        onClick={() => setIsEditing(true)}
                        style={{
                            cursor: 'text',
                            minHeight: '1.5rem',
                            fontSize: '0.95rem',
                            fontWeight: isSelected ? '700' : '500',
                            color: node.content ? '#2d3748' : '#a0aec0'
                        }}
                    >
                        {node.content || '내용을 입력하세요...'}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="node-actions" style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    display: 'flex',
                    gap: '4px'
                }}>
                    {/* Select Button (Checkmark) - Available for Big-Y and Project */}
                    {node.type !== 'mega-y' && (
                        <button
                            onClick={() => onSelect(node.id)}
                            style={{
                                background: isSelected ? borderColor : 'white',
                                color: isSelected ? 'white' : borderColor,
                                border: `1px solid ${borderColor}`,
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            title={isSelected ? "선택 해제" : "선택"}
                        >
                            ✓
                        </button>
                    )}

                    {node.type !== 'project' && (
                        <button
                            onClick={() => onAdd(node.id)}
                            style={{
                                background: '#4299e1',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            title="하위 노드 추가"
                        >
                            +
                        </button>
                    )}
                    {node.type !== 'mega-y' && (
                        <button
                            onClick={() => onDelete(node.id)}
                            style={{
                                background: '#fc8181',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            title="삭제"
                        >
                            x
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Children Section */}
            {hasChildren && (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {/* Link from Parent to Spine */}
                    <div style={{ width: '3rem', height: '2px', background: '#cbd5e0' }} />

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {node.children.map((child, index) => {
                            const isFirst = index === 0;
                            const isLast = index === node.children.length - 1;
                            const isOnly = node.children.length === 1;

                            return (
                                <div key={child.id} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    {/* Connector Segment */}
                                    <div style={{ width: '2rem', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', minHeight: '60px' }}>
                                        {/* Horizontal line to node */}
                                        <div style={{ position: 'absolute', left: 0, width: '100%', height: '2px', background: '#cbd5e0', top: '50%' }} />

                                        {/* Vertical Spine segments */}
                                        {!isOnly && (
                                            <div style={{
                                                position: 'absolute',
                                                left: 0,
                                                width: '2px',
                                                background: '#cbd5e0',
                                                top: isFirst ? '50%' : '0',
                                                height: isFirst || isLast ? '50%' : '100%'
                                            }} />
                                        )}
                                    </div>

                                    <TreeNode
                                        node={child}
                                        onAdd={onAdd}
                                        onDelete={onDelete}
                                        onUpdate={onUpdate}
                                        onSelect={onSelect}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

const LogicTreeDiagram = ({ data, setData, onClose, onNodeSelect }) => {
    // Helper to find and modify node
    const updateTree = (tree, targetId, action, payload) => {
        if (tree.id === targetId) {
            if (action === 'add') {
                const newType = tree.type === 'mega-y' ? 'big-y' : 'project';
                const newChild = {
                    id: `node-${Date.now()}`,
                    type: newType,
                    content: '',
                    children: [],
                    isSelected: false
                };
                return { ...tree, children: [...(tree.children || []), newChild] };
            }
            if (action === 'update') {
                return { ...tree, content: payload };
            }
            if (action === 'select') {
                const newSelected = !tree.isSelected;
                if (newSelected && onNodeSelect) onNodeSelect({ ...tree, isSelected: true });
                return { ...tree, isSelected: newSelected };
            }
        }

        if (tree.children) {
            if (action === 'delete') {
                const filteredChildren = tree.children.filter(c => c.id !== targetId);
                if (filteredChildren.length !== tree.children.length) {
                    return { ...tree, children: filteredChildren };
                }
            }

            return {
                ...tree,
                children: tree.children.map(child => updateTree(child, targetId, action, payload))
            };
        }

        return tree;
    };

    const handleAdd = (id) => {
        const newTree = updateTree(data, id, 'add');
        setData(newTree);
    };

    const handleDelete = (id) => {
        const newTree = updateTree(data, id, 'delete');
        setData(newTree);
    };

    const handleUpdate = (id, text) => {
        const newTree = updateTree(data, id, 'update', text);
        setData(newTree);
    };

    const handleSelect = (id) => {
        // Optionally: Enforce single selection per level? 
        // For now, simple toggle is most flexible.
        const newTree = updateTree(data, id, 'select');
        setData(newTree);
    };

    return (
        <div className="logic-tree-container" style={{
            padding: '2rem',
            background: '#f8fafc',
            borderRadius: '16px',
            overflowX: 'auto',
            minHeight: '600px',
            border: '1px solid #e2e8f0',
            position: 'relative'
        }}>
            <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                zIndex: 20
            }}>
                <button
                    onClick={onClose}
                    style={{
                        background: 'white',
                        border: '1px solid #cbd5e0',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        color: '#4a5568'
                    }}
                >
                    닫기
                </button>
            </div>

            <h3 style={{ textAlign: 'center', color: '#2d3748', marginBottom: '3rem' }}>
                🌲 CTQ Logic Tree
            </h3>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <TreeNode
                    node={data}
                    onAdd={handleAdd}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                    onSelect={handleSelect}
                />
            </div>

            <div style={{
                marginTop: '3rem',
                textAlign: 'center',
                color: '#718096',
                fontSize: '0.9rem',
                background: 'white',
                padding: '1rem',
                borderRadius: '8px',
                display: 'inline-block',
                position: 'absolute',
                bottom: '1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                💡 <strong>Tip:</strong> '+' 버튼을 눌러 하위 항목을 추가하고, '✓' 버튼으로 선정된 항목을 표시하세요.
            </div>
        </div>
    );
};

export default LogicTreeDiagram;
