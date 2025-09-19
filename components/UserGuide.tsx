
import React from 'react';

interface UserGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuideSection: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
  <div className="mb-6">
    <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
      <span className="mr-3 text-sky-600">{icon}</span>
      {title}
    </h3>
    <div className="pl-9 text-gray-600 space-y-2 prose prose-sm max-w-none">
      {children}
    </div>
  </div>
);

const UserGuide: React.FC<UserGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-5 border-b sticky top-0 bg-white rounded-t-xl">
          <h2 className="text-2xl font-bold text-gray-800">Kullanım Kılavuzu</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-full p-1"
            aria-label="Kılavuzu kapat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        <main className="p-6 overflow-y-auto">
          <GuideSection title="Sisteme Genel Bakış" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
            <p>Bu sistem, birimlerin ve kişilerin hiyerarşik yapılarını kolayca görselleştirmenizi sağlayan bir teşkilat şeması oluşturma aracıdır.</p>
            <p>Oluşturduğunuz şemaları, <strong>"Görsel İndir"</strong> butonunu kullanarak yüksek çözünürlüklü bir resim dosyası (.png) olarak bilgisayarınıza indirebilirsiniz. Bu dosyayı, birimlerinizin web sitelerindeki <strong>"Teşkilat Şeması"</strong> menüsü altına kolayca ekleyerek güncel ve profesyonel bir görünüm sağlayabilirsiniz.</p>
          </GuideSection>

          <GuideSection title="Temel İşlemler" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}>
            <p>Sol paneldeki "Organizasyon Yapısı" bölümünü kullanarak şemanızı oluşturun:</p>
            <ul>
              <li><strong>Yeni Kişi/Bölüm Ekle:</strong> İlgili butonları kullanarak şemaya yeni elemanlar ekleyin.</li>
              <li><strong>Bilgileri Güncelle:</strong> Her karttaki form alanlarını (isim, ünvan, bağlı olduğu birim) doldurarak bilgileri güncelleyebilirsiniz. Değişiklikler anında şemaya yansır.</li>
              <li><strong>Silme:</strong> Bir kartın sağ üst köşesindeki <code className="font-mono bg-gray-200 px-1 rounded">X</code> simgesine tıklayarak ilgili kişiyi veya bölümü silebilirsiniz.</li>
               <li><strong>Sekreter Rolü:</strong> Bir kişiyi sekreter olarak atamak için "Sekreter Rolü" kutucuğunu işaretleyin. Bu, kişinin şemadaki görünümünü ve yerleşimini değiştirir.</li>
            </ul>
          </GuideSection>

          <GuideSection title="Şema Üzerinde Hızlı Düzenleme" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>}>
            <p>Şemadaki bir kartın üzerine <strong>çift tıklayarak</strong> isim ve ünvan bilgilerini doğrudan düzenleyebilirsiniz.</p>
            <ul>
              <li>Değişikliği kaydetmek için <strong>Enter</strong> tuşuna basın veya başka bir yere tıklayın.</li>
              <li>İptal etmek için <strong>Escape</strong> tuşuna basın.</li>
            </ul>
          </GuideSection>
          
          <GuideSection title="Sekreter Ekleme" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>}>
             <p>Bağlı olduğu kimse olmayan (en üst düzey) bir yöneticinin yan tarafında çıkan <code className="font-mono bg-gray-200 p-1 rounded-full">+</code> butonuna tıklayarak o kişiye doğrudan bir sekreter ekleyebilirsiniz. </p>
          </GuideSection>

          <GuideSection title="Veri Yönetimi" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7s0 0 0 0m16 0s0 0 0 0M12 11a4 4 0 110-8 4 4 0 010 8z" /></svg>}>
            <p>Sol panelin altındaki "Veri Yönetimi" bölümünü kullanın:</p>
            <ul className="space-y-4">
               <li>
                <strong>CSV'den Yükle:</strong>
                <p className="mt-1">
                  Mevcut organizasyon yapınızı bir kerede yüklemek için bu özelliği kullanabilirsiniz. Microsoft Excel, Google E-Tablolar veya benzeri bir programda hazırladığınız verileri kolayca içeri aktarabilirsiniz.
                </p>
                <p className="font-semibold mt-2">Adım 1: Veri Tablosu Hazırlama (Örnek)</p>
                <p>
                  Excel gibi bir programda aşağıdaki sütunları içeren bir tablo oluşturun:
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse my-2 table-auto">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2 font-semibold">id</th>
                            <th className="border p-2 font-semibold">name</th>
                            <th className="border p-2 font-semibold">title</th>
                            <th className="border p-2 font-semibold">reportsTo</th>
                            <th className="border p-2 font-semibold">type (isteğe bağlı)</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="border p-2 font-mono">4f8a1...</td>
                            <td className="border p-2">Ayşe Yılmaz</td>
                            <td className="border p-2">Genel Müdür</td>
                            <td className="border p-2 text-gray-500 italic">[Boş bırakın]</td>
                            <td className="border p-2 font-mono">person</td>
                        </tr>
                        <tr>
                            <td className="border p-2 font-mono">g8h9i...</td>
                            <td className="border p-2">Pazarlama Birimi</td>
                            <td className="border p-2 text-gray-500 italic">[Boş bırakın]</td>
                            <td className="border p-2 font-mono">4f8a1...</td>
                            <td className="border p-2 font-mono">department</td>
                        </tr>
                        <tr>
                           <td className="border p-2 font-mono">c5e6f...</td>
                            <td className="border p-2">Fatma Kaya</td>
                            <td className="border p-2">Pazarlama Direktörü</td>
                            <td className="border p-2 font-mono">g8h9i...</td>
                            <td className="border p-2 font-mono">person</td>
                        </tr>
                         <tr>
                           <td className="border p-2 font-mono">f7a8b...</td>
                            <td className="border p-2">Hasan Çelik</td>
                            <td className="border p-2">Dijital Pazarlama Uzmanı</td>
                            <td className="border p-2 font-mono">c5e6f...</td>
                            <td className="border p-2 font-mono">person</td>
                        </tr>
                        <tr>
                           <td className="border p-2 font-mono">a4b5c...</td>
                            <td className="border p-2">Elif Demir</td>
                            <td className="border p-2">Sosyal Medya Uzmanı</td>
                            <td className="border p-2 font-mono">c5e6f...</td>
                            <td className="border p-2 font-mono">person</td>
                        </tr>
                        <tr>
                            <td className="border p-2 font-mono">a1b2c...</td>
                            <td className="border p-2">Yazılım Birimi</td>
                            <td className="border p-2 text-gray-500 italic">[Boş bırakın]</td>
                             <td className="border p-2 font-mono">4f8a1...</td>
                            <td className="border p-2 font-mono">department</td>
                        </tr>
                         <tr>
                           <td className="border p-2 font-mono">b1d2c...</td>
                            <td className="border p-2">Mehmet Öztürk</td>
                            <td className="border p-2">Teknoloji Direktörü</td>
                            <td className="border p-2 font-mono">a1b2c...</td>
                            <td className="border p-2 font-mono">person</td>
                        </tr>
                         <tr>
                           <td className="border p-2 font-mono">d9e0f...</td>
                            <td className="border p-2">Ali Vural</td>
                            <td className="border p-2">Yazılım Geliştirme Lideri</td>
                            <td className="border p-2 font-mono">a1b2c...</td>
                            <td className="border p-2 font-mono">person</td>
                        </tr>
                         <tr>
                           <td className="border p-2 font-mono">e3f4a...</td>
                            <td className="border p-2">Zeynep Şahin</td>
                            <td className="border p-2">Kıdemli Yazılım Müh.</td>
                            <td className="border p-2 font-mono">d9e0f...</td>
                            <td className="border p-2 font-mono">person</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                    <li><strong>id:</strong> Her kişi/bölüm için benzersiz bir numara veya metin olmalıdır. (Örnekteki '...' ID'lerin devamı olduğunu belirtir.)</li>
                    <li><strong>name:</strong> Kişinin veya bölümün adını girin.</li>
                    <li><strong>title:</strong> Kişinin ünvanını girin. Bölümler için boş bırakılabilir.</li>
                    <li><strong>reportsTo:</strong> Bu kişinin kime rapor verdiğini belirtir. Buraya, bağlı olduğu yöneticinin <strong>id</strong>'sini yazmalısınız. En üst yönetici için bu alanı boş bırakın.</li>
                    <li><strong>type:</strong> Satırın 'person' mı yoksa 'department' mı olduğunu belirtir. Bu sütun olmasa bile sistem, ünvan ve isimden türü tahmin etmeye çalışacaktır.</li>
                </ul>
                <p className="font-semibold mt-3">Adım 2: Dosyayı CSV Olarak Kaydetme</p>
                <p>
                    Tablonuzu hazırladıktan sonra, Excel'de "Farklı Kaydet" seçeneğini kullanarak dosya türünü <strong>"CSV (Virgülle Ayrılmış) (*.csv)"</strong> veya <strong>"CSV UTF-8 (Virgülle Ayrılmış) (*.csv)"</strong> olarak seçin ve kaydedin.
                </p>
                <p className="mt-2">
                    Artık bu dosyayı "CSV'den Yükle" butonuyla seçerek tüm şemanızı otomatik olarak oluşturabilirsiniz.
                </p>
              </li>
              <li><strong>JSON İndir:</strong> Mevcut şema yapısını daha sonra tekrar yüklemek veya yedeklemek için <code className="font-mono bg-gray-200 px-1 rounded">.json</code> dosyası olarak kaydedin.</li>
              <li><strong>Görsel İndir:</strong> Oluşturduğunuz şemayı sunum veya raporlarda kullanmak üzere yüksek çözünürlüklü <code className="font-mono bg-gray-200 px-1 rounded">.png</code> formatında indirin.</li>
              <li><strong>Şemayı Sıfrla:</strong> Tüm mevcut veriyi siler ve başlangıçtaki örnek şemayı yükler. <strong>Bu işlem geri alınamaz.</strong></li>
            </ul>
          </GuideSection>

          <GuideSection title="Görünüm ve Arama" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}>
            <p>Sağdaki şema alanının üst kısmındaki kontrolleri kullanın:</p>
            <ul>
                <li><strong>Görünüm Ayarları:</strong> Farklı renk temaları arasından seçim yaparak şemanızın görünümünü kişiselleştirin.</li>
                <li><strong>Şemada Ara:</strong> Arama kutusuna kişi adı veya ünvanı yazarak şemada arama yapın. Bulunan sonuçlar arasında ok butonları ile gezinebilirsiniz. Mevcut sonuç şemada vurgulanacaktır.</li>
            </ul>
          </GuideSection>
        </main>
      </div>
    </div>
  );
};

export default UserGuide;