
import React from 'react';
import { TreeNode, ColorTheme, OrgEntity } from '../types';
import Node from './Node';

interface OrgChartProps {
  tree: TreeNode[];
  theme: ColorTheme;
  editingNodeId: string | null;
  setEditingNodeId: (id: string | null) => void;
  onUpdateEntity: (entity: OrgEntity) => void;
  onAddSecretary: (managerId: string) => void;
  searchResults: string[];
  currentResultId: string | null;
}

const OrgChart = React.forwardRef<HTMLDivElement, OrgChartProps>(({ tree, theme, editingNodeId, setEditingNodeId, onUpdateEntity, onAddSecretary, searchResults, currentResultId }, ref) => {
  return (
    <div ref={ref} className="w-full h-full overflow-auto p-4 flex flex-col items-center flex-grow">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 export-hidden">Oluşturulan Şema</h2>
      {tree.length > 0 ? (
        <div className="flex justify-center space-x-8">
            {tree.map(rootNode => (
              <Node 
                key={rootNode.id} 
                node={rootNode} 
                theme={theme} 
                editingNodeId={editingNodeId}
                setEditingNodeId={setEditingNodeId}
                onUpdateEntity={onUpdateEntity}
                onAddSecretary={onAddSecretary}
                isSearchResult={searchResults.includes(rootNode.id)}
                isCurrentResult={rootNode.id === currentResultId}
                searchResults={searchResults}
                currentResultId={currentResultId}
              />
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-xl">Şema oluşturmak için kişi veya bölüm ekleyin.</p>
          <p className="text-sm">Şemanız burada görünecek.</p>
        </div>
      )}
    </div>
  );
});

export default OrgChart;