
import React, { useRef } from 'react';
import { OrgEntity, Person, Department } from '../types';

interface InputPanelProps {
  orgData: OrgEntity[];
  onAddPerson: () => void;
  onAddDepartment: () => void;
  onUpdateEntity: (entity: OrgEntity) => void;
  onRemoveEntity: (id: string) => void;
  onImportData: (data: OrgEntity[]) => void;
  onExportData: () => void;
  onResetData: () => void;
  onExportImage: () => void;
}

const InputPanel: React.FC<InputPanelProps> = ({ orgData, onAddPerson, onAddDepartment, onUpdateEntity, onRemoveEntity, onImportData, onExportData, onResetData, onExportImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (id: string, field: keyof OrgEntity, value: string) => {
    const entity = orgData.find(e => e.id === id);
    if (entity) {
      onUpdateEntity({ ...entity, [field]: value });
    }
  };

  const handleSelectChange = (id: string, value: string) => {
    const entity = orgData.find(p => p.id === id);
    if (entity) {
      onUpdateEntity({ ...entity, reportsTo: value === 'null' ? null : value });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) {
          throw new Error("Dosya boş veya okunamıyor.");
        }

        const lines = text.trim().split(/\r?\n/);
        const headerLine = lines.shift();
        if (!headerLine) {
          throw new Error("CSV dosyası başlık satırı içermiyor.");
        }
        
        // 1. Auto-detect delimiter
        const commaCount = (headerLine.match(/,/g) || []).length;
        const semicolonCount = (headerLine.match(/;/g) || []).length;
        const delimiter = semicolonCount > commaCount ? ';' : ',';

        // 2. Flexible header mapping (case-insensitive)
        const rawHeaders = headerLine.split(delimiter).map(h => h.trim().toLowerCase().replace(/"/g, ''));
        const headerMap: { [key: string]: number } = {
            id: rawHeaders.indexOf('id'),
            name: rawHeaders.indexOf('name'),
            title: rawHeaders.indexOf('title'),
            reportsTo: rawHeaders.indexOf('reports') !== -1 ? rawHeaders.indexOf('reports') : rawHeaders.indexOf('reportsto'),
            type: rawHeaders.indexOf('type'),
        };

        if (headerMap.id === -1 || headerMap.name === -1) {
            throw new Error(`CSV dosyası 'id' and 'name' başlıklarını içermelidir. Sizin dosyanızda: ${headerLine}`);
        }

        const departmentKeywords = ['müdürlüğü', 'birimi', 'departmanı', 'başkanlığı'];

        const importedData = lines.map(line => {
          if (!line.trim()) return null;

          const values = line.split(delimiter).map(v => v.trim().replace(/^"|"$/g, ''));

          const id = values[headerMap.id];
          const name = values[headerMap.name];
          const title = headerMap.title > -1 ? values[headerMap.title] : '';
          let reportsTo = headerMap.reportsTo > -1 ? values[headerMap.reportsTo] : null;
          let type = headerMap.type > -1 ? values[headerMap.type]?.toLowerCase() : null;

          if (!id || !name) {
            console.warn("Eksik 'id' veya 'name' nedeniyle satır atlandı:", line);
            return null;
          }
          
          if (reportsTo === '' || reportsTo === undefined) {
              reportsTo = null;
          }

          // 3. Infer type if not present
          if (!type) {
            if (title && departmentKeywords.some(keyword => title.toLowerCase().includes(keyword))) {
              type = 'department';
            } else {
              type = 'person';
            }
          }
          
          if (type === 'person') {
            return {
              id,
              name,
              title: title || 'Unvan Belirtilmemiş',
              reportsTo,
              type: 'person',
              isSecretary: false,
            } as Person;
          } else if (type === 'department') {
             // 4. Combine name and title for departments based on user's pattern
            const departmentName = title ? `${name} ${title}` : name;
            return {
              id,
              name: departmentName,
              reportsTo,
              type: 'department',
            } as Department;
          }
          
          console.warn("Geçersiz 'type' veya type belirlenemediği için satır atlandı:", line);
          return null;
        }).filter((item): item is OrgEntity => item !== null);

        if (importedData.length > 0) {
          onImportData(importedData);
        } else {
            alert("CSV dosyasında geçerli veri bulunamadı veya dosya boş.");
        }
      } catch (error) {
        console.error("CSV okuma hatası:", error);
        alert(`Dosya okunurken bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen bir hata.'}\nLütfen dosya formatını ve içeriğini kontrol edin.`);
      } finally {
        if (event.target) {
            event.target.value = '';
        }
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  return (
    <div className="flex flex-col space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2">Organizasyon Yapısı</h2>
      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
        {orgData.map((entity) => {
          const isPerson = entity.type === 'person';
          return (
            <div key={entity.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
              <p className={`font-bold mb-3 ${isPerson ? 'text-gray-600' : 'text-teal-700'}`}>
                {isPerson ? `Kişi: ${entity.name || ''}` : `Bölüm: ${entity.name || ''}`}
              </p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{isPerson ? 'İsim' : 'Bölüm Adı'}</label>
                  <input
                    type="text"
                    placeholder={isPerson ? "Örn: Ahmet Yılmaz" : "Örn: İnsan Kaynakları"}
                    value={entity.name}
                    onChange={(e) => handleInputChange(entity.id, 'name', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                {isPerson && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ünvan</label>
                    <input
                      type="text"
                      placeholder="Örn: Yazılım Mühendisi"
                      value={entity.title}
                      onChange={(e) => onUpdateEntity({ ...entity, title: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bağlı Olduğu Birim</label>
                  <select
                    value={entity.reportsTo || 'null'}
                    onChange={(e) => handleSelectChange(entity.id, e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                  >
                    <option value="null">Kimse (Tepe Yönetici)</option>
                    {orgData.filter(p => p.id !== entity.id).map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.type === 'person' ? (p.isSecretary ? 'Sekreter' : 'Kişi') : 'Bölüm'})</option>
                    ))}
                  </select>
                </div>
                 {isPerson && (
                  <div className="flex items-center pt-1">
                    <input
                      id={`secretary-${entity.id}`}
                      name={`secretary-${entity.id}`}
                      type="checkbox"
                      checked={!!entity.isSecretary}
                      onChange={(e) => onUpdateEntity({ ...entity, isSecretary: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                    />
                    <label htmlFor={`secretary-${entity.id}`} className="ml-2 block text-sm text-gray-900">
                      Sekreter Rolü
                    </label>
                  </div>
                )}
              </div>
              <button
                onClick={() => onRemoveEntity(entity.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-600 disabled:text-gray-300 disabled:cursor-not-allowed"
                title="Kaldır"
                disabled={orgData.length <= 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )
        })}
      </div>
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
        <button
          onClick={onAddPerson}
          className="flex-1 bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-300"
        >
          Yeni Kişi Ekle
        </button>
        <button
          onClick={onAddDepartment}
          className="flex-1 bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-300"
        >
          Yeni Bölüm Ekle
        </button>
      </div>
      <div className="pt-4 border-t">
        <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">Veri Yönetimi</h3>
         <div className="space-y-3">
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              className="hidden"
            />
            <button
              onClick={handleImportClick}
              className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              CSV'den Yükle
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
                Format: id, name, title, reportsTo (başlık dahil). Ayırıcı (,) veya (;) olabilir.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onExportData}
              className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              JSON İndir
            </button>
            <button
              onClick={onExportImage}
              className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.172a2 2 0 01-1.414-.586l-.828-.828A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586l-.828.828A2 2 0 015.172 5H4zm6 8a4 4 0 100-8 4 4 0 000 8zm-2-4a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
              </svg>
              Görsel İndir
            </button>
            <button
              onClick={onResetData}
              className="col-span-2 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
              </svg>
              Şemayı Sıfırla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputPanel;