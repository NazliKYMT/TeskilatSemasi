
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { OrgEntity, TreeNode, ColorTheme, Department, Person } from './types';
import InputPanel from './components/InputPanel';
import OrgChart from './components/OrgChart';
import SearchBar from './components/SearchBar';
import UserGuide from './components/UserGuide';

declare const htmlToImage: any;

const ceoId = '4f8a1b9a-2e4d-4e2c-8b8a-9f0e1d2c3b4a';
const techDirectorId = 'b1d2c3e4-5f6a-4b7c-8d9e-0f1a2b3c4d5e';
const marketingDirectorId = 'c5e6f7a8-9b0c-4d1e-8f2a-3b4c5d6e7f8a';
const devLeadId = 'd9e0f1a2-b3c4-4d5e-8f6a-7b8c9d0e1f2a';
// FIX: Corrected typo from 't' to 'const' for variable declaration.
const seniorDevId = 'e3f4a5b6-c7d8-4e9f-8a0b-1c2d3e4f5a6b';
const digitalMarketingId = 'f7a8b9c0-d1e2-4f3a-8b4c-5d6e7f8a9b0c';
const softwareUnitId = 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6';
const marketingUnitId = 'g8h9i0j1-k2l3-m4n5-o6p7-q8r9s0t1u2v3';
const socialMediaId = 'a4b5c6d7-e8f9-a0b1-c2d3-e4f5a6b7c8d9';

const initialOrgData: OrgEntity[] = [
  // CEO
  { id: ceoId, name: 'Ayşe Yılmaz', title: 'Genel Müdür', reportsTo: null, type: 'person' },
  
  // Pazarlama Departmanı ve çalışanları
  { id: marketingUnitId, name: 'Pazarlama Birimi', reportsTo: ceoId, type: 'department' },
  { id: marketingDirectorId, name: 'Fatma Kaya', title: 'Pazarlama Direktörü', reportsTo: marketingUnitId, type: 'person' },
  { id: digitalMarketingId, name: 'Hasan Çelik', title: 'Dijital Pazarlama Uzmanı', reportsTo: marketingDirectorId, type: 'person' },
  { id: socialMediaId, name: 'Elif Demir', title: 'Sosyal Medya Uzmanı', reportsTo: marketingDirectorId, type: 'person' },
  
  // Yazılım Departmanı ve çalışanları
  { id: softwareUnitId, name: 'Yazılım Birimi', reportsTo: ceoId, type: 'department' },
  { id: techDirectorId, name: 'Mehmet Öztürk', title: 'Teknoloji Direktörü', reportsTo: softwareUnitId, type: 'person' },
  { id: devLeadId, name: 'Ali Vural', title: 'Yazılım Geliştirme Lideri', reportsTo: softwareUnitId, type: 'person' },
  { id: seniorDevId, name: 'Zeynep Şahin', title: 'Kıdemli Yazılım Müh.', reportsTo: devLeadId, type: 'person' },
];


const themes: ColorTheme[] = [
  {
    name: 'sky',
    label: 'Gökyüzü Mavisi',
    bg: 'bg-sky-100',
    departmentBg: 'bg-sky-200',
    border: 'border-sky-500',
    nameText: 'text-sky-800',
    titleText: 'text-sky-600',
    ring: 'ring-sky-500',
  },
  {
    name: 'emerald',
    label: 'Zümrüt Yeşili',
    bg: 'bg-emerald-100',
    departmentBg: 'bg-emerald-200',
    border: 'border-emerald-500',
    nameText: 'text-emerald-800',
    titleText: 'text-emerald-600',
    ring: 'ring-emerald-500',
  },
  {
    name: 'indigo',
    label: 'Çivit Mavisi',
    bg: 'bg-indigo-100',
    departmentBg: 'bg-indigo-200',
    border: 'border-indigo-500',
    nameText: 'text-indigo-800',
    titleText: 'text-indigo-600',
    ring: 'ring-indigo-500',
  },
  {
    name: 'slate',
    label: 'Kurşun Grisi',
    bg: 'bg-slate-200',
    departmentBg: 'bg-slate-300',
    border: 'border-slate-500',
    nameText: 'text-slate-800',
    titleText: 'text-slate-600',
    ring: 'ring-slate-500',
  },
];

const logoBidb = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAAPoAQMAAABo3TrkAAAABlBMVEUAAAAAAAACrW9ZAAAAAXRSTlMAQObYZgAAAngJREFUeJztwQEBAAAAgiD/r25IQAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADg1wAOoAABhQEHJgAAAABJRU5ErkJggg==';
const logoCaku = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAAPoAQMAAABo3TrkAAAABlBMVEUAAAAAAAACrW9ZAAAAAXRSTlMAQObYZgAAAnBJREFUeJztwQEBAAAAgiD/r25IQAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADg1wAOoAABhQEHJgAAAABJRU5ErkJggg==';


const App: React.FC = () => {
  const [orgData, setOrgData] = useState<OrgEntity[]>(() => {
    try {
      const savedData = localStorage.getItem('orgChartData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          return parsedData;
        }
      }
    } catch (error) {
      console.error("Yerel depolamadan veri okunurken hata oluştu:", error);
    }
    return initialOrgData;
  });
  
  const [selectedTheme, setSelectedTheme] = useState<ColorTheme>(themes[0]);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState<number>(-1);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('orgChartData', JSON.stringify(orgData));
    } catch (error) {
      console.error("Veri yerel depolamaya kaydedilirken hata oluştu:", error);
    }
  }, [orgData]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setCurrentResultIndex(-1);
      return;
    }
    const lowerCaseSearch = searchTerm.toLowerCase();
    const results = orgData
      .filter(entity => {
        if (entity.type === 'person') {
          return entity.name.toLowerCase().includes(lowerCaseSearch) || entity.title.toLowerCase().includes(lowerCaseSearch);
        }
        return entity.name.toLowerCase().includes(lowerCaseSearch);
      })
      .map(entity => entity.id);
    
    setSearchResults(results);
    setCurrentResultIndex(results.length > 0 ? 0 : -1);
  }, [searchTerm, orgData]);

  const handleNextResult = () => {
    if (searchResults.length > 0) {
      setCurrentResultIndex((prevIndex) => (prevIndex + 1) % searchResults.length);
    }
  };

  const handlePrevResult = () => {
    if (searchResults.length > 0) {
      setCurrentResultIndex((prevIndex) => (prevIndex - 1 + searchResults.length) % searchResults.length);
    }
  };

  const handleAddPerson = () => {
    const newPerson: Person = {
      id: crypto.randomUUID(),
      name: 'Yeni Kişi',
      title: 'Ünvan',
      reportsTo: orgData.length > 0 ? orgData[0].id : null,
      type: 'person',
      isSecretary: false,
    };
    setOrgData([...orgData, newPerson]);
  };
  
  const handleAddDepartment = () => {
    const newDepartment: Department = {
      id: crypto.randomUUID(),
      name: 'Yeni Bölüm',
      reportsTo: orgData.length > 0 ? orgData[0].id : null,
      type: 'department',
    };
    setOrgData([...orgData, newDepartment]);
  };

  const handleAddSecretary = (managerId: string) => {
    const newSecretary: Person = {
      id: crypto.randomUUID(),
      name: 'Yeni Sekreter',
      title: 'Sekreter',
      reportsTo: managerId,
      type: 'person',
      isSecretary: true,
    };
    setOrgData([...orgData, newSecretary]);
  };

  const handleUpdateEntity = (updatedEntity: OrgEntity) => {
    setOrgData(orgData.map(e => e.id === updatedEntity.id ? updatedEntity : e));
  };

  const handleRemoveEntity = (idToRemove: string) => {
    if (orgData.length <= 1) return;
    
    const updatedData = orgData
      .filter(e => e.id !== idToRemove)
      .map(e => e.reportsTo === idToRemove ? { ...e, reportsTo: null } : e);
    setOrgData(updatedData);
  };
  
  const handleImportData = (importedData: OrgEntity[]) => {
    setOrgData(importedData);
    alert(`${importedData.length} kayıt başarıyla yüklendi ve şema güncellendi.`);
  };

  const handleExportData = () => {
    try {
      const jsonString = JSON.stringify(orgData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'organizasyon-semasi.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("JSON dışa aktarma hatası:", error);
      alert("Dosya indirilirken bir hata oluştu.");
    }
  };

  const handleExportImage = async () => {
    const chartElement = chartContainerRef.current;
    if (!chartElement) {
      alert("Şema elementi bulunamadı. Lütfen tekrar deneyin.");
      return;
    }
    
    try {
      chartElement.classList.add('is-exporting');
      const dataUrl = await htmlToImage.toPng(chartElement, { 
        pixelRatio: 2,
        backgroundColor: '#f9fafb', // bg-gray-50
      });
      const link = document.createElement('a');
      link.download = 'organizasyon-semasi.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Görsel oluşturma hatası:', error);
      alert('Şema görseli indirilirken bir hata oluştu.');
    } finally {
      chartElement.classList.remove('is-exporting');
    }
  };
  
  const handleResetData = () => {
    if (window.confirm("Mevcut şemayı sıfırlamak ve tüm verileri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
      localStorage.removeItem('orgChartData');
      setOrgData(initialOrgData);
      alert("Şema başarıyla sıfırlandı.");
    }
  };

  const tree = useMemo<TreeNode[]>(() => {
    const entityMap = new Map<string, TreeNode>();
    const roots: TreeNode[] = [];

    orgData.forEach(entity => {
      entityMap.set(entity.id, { ...entity, children: [] });
    });

    entityMap.forEach(node => {
      if (node.reportsTo && entityMap.has(node.reportsTo)) {
        const manager = entityMap.get(node.reportsTo);
        if (manager) {
          if (node.type === 'person' && node.isSecretary) {
            manager.secretary = node;
          } else {
            manager.children.push(node);
          }
        }
      } else {
        roots.push(node);
      }
    });
    
    return roots;
  }, [orgData]);
  
  const currentResultId = currentResultIndex > -1 ? searchResults[currentResultIndex] : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <img src={logoCaku} alt="Çankırı Karatekin Üniversitesi Logosu" className="h-16 w-16 md:h-20 md:w-20" />
          <div className="text-center mx-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
              Çankırı Karatekin Üniversitesi
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Teşkilat Şeması Oluşturma Sistemi
            </p>
          </div>
          <div className="flex items-center gap-4">
            <img src={logoBidb} alt="Bilgi İşlem Daire Başkanlığı Logosu" className="h-16 w-16 md:h-20 md:w-20" />
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-gray-500 hover:text-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 rounded-full p-2 transition-colors"
              title="Kullanım Kılavuzu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg h-fit">
          <InputPanel 
            orgData={orgData}
            onAddPerson={handleAddPerson}
            onAddDepartment={handleAddDepartment}
            onUpdateEntity={handleUpdateEntity}
            onRemoveEntity={handleRemoveEntity}
            onImportData={handleImportData}
            onExportData={handleExportData}
            onResetData={handleResetData}
            onExportImage={handleExportImage}
          />
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg flex flex-col">
          <div className="mb-6 border-b pb-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Görünüm Ayarları</h3>
            <div className="flex flex-wrap gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => setSelectedTheme(theme)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    selectedTheme.name === theme.name
                      ? `${theme.bg} ${theme.border} border-2 ${theme.nameText}`
                      : 'bg-gray-100 border border-gray-300 text-gray-600 hover:bg-gray-200'
                  } ${theme.ring}`}
                  aria-pressed={selectedTheme.name === theme.name}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4 border-b pb-4">
             <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              resultCount={searchResults.length}
              currentIndex={currentResultIndex}
              onPrev={handlePrevResult}
              onNext={handleNextResult}
            />
          </div>
          <OrgChart 
            ref={chartContainerRef}
            tree={tree} 
            theme={selectedTheme} 
            editingNodeId={editingNodeId}
            setEditingNodeId={setEditingNodeId}
            onUpdateEntity={handleUpdateEntity}
            onAddSecretary={handleAddSecretary}
            searchResults={searchResults}
            currentResultId={currentResultId}
            onRemoveEntity={handleRemoveEntity}
            isRemoveDisabled={orgData.length <= 1}
          />
        </div>
      </main>

      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Gemini API ile oluşturulmuştur.</p>
      </footer>
      
      <UserGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
};

export default App;