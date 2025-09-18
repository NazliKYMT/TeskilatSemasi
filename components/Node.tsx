
import React, { useState, useEffect, useRef } from 'react';
import { TreeNode, ColorTheme, OrgEntity, Person } from '../types';

interface NodeProps {
  node: TreeNode;
  theme: ColorTheme;
  editingNodeId: string | null;
  setEditingNodeId: (id: string | null) => void;
  onUpdateEntity: (entity: OrgEntity) => void;
  onAddSecretary: (managerId: string) => void;
  isSearchResult: boolean;
  isCurrentResult: boolean;
  searchResults: string[];
  currentResultId: string | null;
}

const Node: React.FC<NodeProps> = (props) => {
  const { node, theme, editingNodeId, setEditingNodeId, onUpdateEntity, onAddSecretary, isSearchResult, isCurrentResult, searchResults, currentResultId } = props;
  const isEditing = node.id === editingNodeId;
  const isPerson = node.type === 'person';

  const [editedName, setEditedName] = useState(node.name);
  const [editedTitle, setEditedTitle] = useState(isPerson ? (node as Person).title : '');
  const nameInputRef = useRef<HTMLInputElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isCurrentResult) {
      nodeRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  }, [isCurrentResult]);

  useEffect(() => {
    if (isEditing) {
      setEditedName(node.name);
      if (isPerson) {
        setEditedTitle((node as Person).title);
      }
      setTimeout(() => {
        nameInputRef.current?.focus();
        nameInputRef.current?.select();
      }, 0);
    }
  }, [isEditing, node, isPerson]);

  const handleSave = () => {
    if (isPerson) {
      const personNode = node as Person;
      if (personNode.name !== editedName || personNode.title !== editedTitle) {
        onUpdateEntity({ ...personNode, name: editedName.trim(), title: editedTitle.trim() });
      }
    } else {
      if (node.name !== editedName) {
        onUpdateEntity({ ...node, name: editedName.trim() });
      }
    }
    setEditingNodeId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditingNodeId(null);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingNodeId(node.id);
  };
  
  const cardBaseClasses = `border-2 rounded-xl shadow-lg px-6 inline-block z-10 transition-all duration-300 cursor-pointer`;
  const themeClasses = `${theme.border} ${isPerson ? `${theme.bg} py-3 min-w-[180px]` : `${theme.departmentBg} py-4 min-w-[220px]`}`;
  const searchHighlightClasses = isCurrentResult 
    ? 'ring-4 ring-offset-2 ring-amber-500 animate-pulse z-20 transform scale-105' 
    : isSearchResult 
    ? 'ring-2 ring-amber-400 z-20' 
    : '';

  const cardClasses = `${cardBaseClasses} ${themeClasses} ${searchHighlightClasses}`;
  const nameClasses = `font-bold text-lg transition-colors duration-300 ${theme.nameText}`;
  const titleClasses = `text-sm transition-colors duration-300 ${theme.titleText}`;

  const inputNameClasses = `w-full bg-transparent text-center font-bold text-lg outline-none border-b border-transparent focus:border-current ${theme.nameText}`;
  const inputTitleClasses = `w-full bg-transparent text-center text-sm outline-none border-b border-transparent focus:border-current ${theme.titleText}`;

  return (
    <div className="inline-flex flex-col items-center text-center">
      <div className="relative">
        <div 
          ref={nodeRef}
          className={cardClasses}
          onDoubleClick={handleDoubleClick}
          title="Düzenlemek için çift tıkla"
        >
          {isEditing ? (
            <div className="flex flex-col gap-1">
              <input
                ref={nameInputRef}
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className={inputNameClasses}
                onClick={(e) => e.stopPropagation()}
              />
              {isPerson && (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={handleSave}
                  onKeyDown={handleKeyDown}
                  className={inputTitleClasses}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          ) : (
            <>
              <p className={nameClasses}>{node.name || (isPerson ? 'İsimsiz' : 'Bölümsüz')}</p>
              {isPerson && <p className={titleClasses}>{(node as Person).title || 'Ünvansız'}</p>}
            </>
          )}
        </div>
        
        {isPerson && (node.secretary || node.reportsTo === null) && (
          <div className="absolute top-1/2 -translate-y-1/2 left-[calc(100%+2.5rem)]">
            <div className={`absolute top-1/2 -left-10 h-0.5 w-10 bg-gray-400 z-0 ${!node.secretary ? 'export-hidden' : ''}`} />
            {node.secretary ? (
              <Node {...props} node={node.secretary} />
            ) : (
              node.reportsTo === null && (
                <button
                  onClick={() => onAddSecretary(node.id)}
                  title="Sekreter Ekle"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-500 rounded-full w-8 h-8 flex items-center justify-center transition-all focus:outline-none focus:ring-2 ring-offset-2 ring-sky-500 print:hidden export-hidden"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              )
            )}
          </div>
        )}
         {/* Vertical line dropping from the parent node */}
        {node.children && node.children.length > 0 && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gray-400" />
        )}
      </div>

      {node.children && node.children.length > 0 && (
        <ul className="flex mt-6 relative">
          {node.children.map((childNode, index) => {
            const isFirst = index === 0;
            const isLast = index === node.children.length - 1;
            const hasSiblings = node.children.length > 1;

            return (
              <li key={childNode.id} className="px-5 relative">
                {/* Horizontal connection line segment */}
                <div
                  className={`absolute top-0 h-0.5 bg-gray-400
                    ${hasSiblings && isFirst ? 'left-1/2 right-0' : ''}
                    ${hasSiblings && isLast ? 'left-0 right-1/2' : ''}
                    ${hasSiblings && !isFirst && !isLast ? 'left-0 right-0' : ''}
                    ${!hasSiblings ? 'hidden' : ''}
                  `}
                />
                {/* Vertical line from horizontal line to the child's top position */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gray-400" />

                 {/* The child node itself, with margin-top to clear the lines */}
                <div className="mt-6">
                  <Node 
                    {...props}
                    node={childNode} 
                    isSearchResult={searchResults.includes(childNode.id)}
                    isCurrentResult={childNode.id === currentResultId}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Node;
