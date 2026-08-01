import React, { useState } from 'react';
import { Search, Plus, Package, AlertTriangle, ArrowDownToLine, ShoppingCart, Edit, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';
import { Modal } from '../components/Modal';

export function Inventory() {
  const { inventoryItems, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'all'|'critical'|'orders'>('all');

  // Form states
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('İlaçlar');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');

  const resetForm = () => {
    setEditingId(null);
    setName(''); setCategory('İlaçlar'); setStock(''); setPrice('');
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    setName(item.name);
    setCategory(item.category);
    setStock(item.stock.toString());
    setPrice(item.price.replace('₺', ''));
    setIsEditModalOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !stock || !price) {
      toast.error('Lütfen zorunlu alanları doldurun.');
      return;
    }
    
    addInventoryItem({
      name,
      category,
      stock: parseInt(stock, 10),
      minStock: 10,
      unit: 'Adet',
      price: `₺${price}`,
      status: parseInt(stock, 10) < 10 ? 'Kritik' : 'Yeterli'
    });
    
    toast.success('Ürün stoka başarıyla eklendi!');
    setIsModalOpen(false);
    resetForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId === null) return;
    
    const existing = inventoryItems.find(i => i.id === editingId);
    if (!existing) return;

    updateInventoryItem({
      ...existing,
      name,
      category,
      stock: parseInt(stock, 10),
      price: `₺${price}`,
      status: parseInt(stock, 10) < existing.minStock ? 'Kritik' : 'Yeterli'
    });
    
    toast.success('Ürün başarıyla güncellendi!');
    setIsEditModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: number | string) => {
    if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      deleteInventoryItem(id);
      toast.success('Ürün stoktan silindi.');
    }
  };

  const exportCsv = () => {
    if (inventoryItems.length === 0) {
      toast.error('İndirilecek stok verisi yok.');
      return;
    }
    const headers = ['Ürün Adı', 'Kategori', 'Stok', 'Birim', 'Durum', 'Birim Fiyat'];
    const rows = inventoryItems.map(i => [
      i.name, i.category, i.stock.toString(), i.unit, i.status, i.price
    ]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `envanter_${new Date().toLocaleDateString('tr-TR')}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success('Envanter listesi başarıyla indirildi.');
  };

  let filteredItems = inventoryItems.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  if (filterMode === 'critical') {
    filteredItems = filteredItems.filter(i => i.status === 'Kritik');
  } else if (filterMode === 'orders') {
    filteredItems = filteredItems.filter(i => i.stock === 0);
  }

  const criticalCount = inventoryItems.filter(i => i.status === 'Kritik').length;
  const zeroStockCount = inventoryItems.filter(i => i.stock === 0).length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Depo ve Stok Yönetimi</h2>
          <p className="mt-1 text-sm text-gray-500">
            Aşı, ilaç ve sarf malzemelerinizi takip edin. Kritik stok uyarılarını görün.
          </p>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-xl bg-[#1B4332] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#122c21] transition-all shadow-[#1B4332]/30">
            <Plus className="h-4 w-4" />
            Stok Girişi Yap
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className={`bg-white rounded-3xl p-5 border shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-all duration-300 cursor-pointer ${filterMode === 'all' ? 'border-[#1B4332] shadow-[#1B4332]/20' : 'border-gray-100'}`} onClick={() => setFilterMode('all')}>
          <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
            <Package className="h-7 w-7 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Toplam Ürün Çeşidi</p>
            <p className="text-2xl font-bold text-gray-900">{inventoryItems.length}</p>
          </div>
        </div>
        <div className={`bg-white rounded-3xl p-5 border shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-all duration-300 cursor-pointer ${filterMode === 'critical' ? 'border-red-500 shadow-red-500/20' : 'border-red-100'}`} onClick={() => setFilterMode('critical')}>
          <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-7 w-7 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Kritik Stok Uyarısı</p>
            <p className="text-2xl font-bold text-gray-900">{criticalCount}</p>
          </div>
        </div>
        <div className={`bg-white rounded-3xl p-5 border shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-all duration-300 cursor-pointer ${filterMode === 'orders' ? 'border-green-500 shadow-green-500/20' : 'border-green-100'}`} onClick={() => setFilterMode('orders')}>
          <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
            <ShoppingCart className="h-7 w-7 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tükenenler (Sipariş)</p>
            <p className="text-2xl font-bold text-gray-900">{zeroStockCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <h3 className="font-semibold text-gray-900">Stok Listesi</h3>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Ürün Ara..." className="w-full border rounded-lg border-gray-300 text-sm focus:ring-[#1B4332] focus:border-[#1B4332] py-2 pl-9 pr-3" />
            </div>
            {filterMode !== 'all' && (
              <button onClick={() => setFilterMode('all')} className="flex items-center justify-center rounded-lg bg-gray-100 px-3 py-2 text-gray-600 hover:bg-gray-200 transition-colors" title="Filtreyi Temizle">
                <X className="h-4 w-4" />
              </button>
            )}
            <button onClick={exportCsv} className="flex items-center justify-center rounded-lg bg-white px-3 py-2 text-gray-500 hover:text-gray-700 shadow-sm border border-gray-200 transition-colors" title="Excel İndir">
              <ArrowDownToLine className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün Adı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok Miktarı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birim Fiyat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlem</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredItems.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Aranan kriterlere uygun ürün bulunamadı.</td></tr>
              ) : filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${
                        item.status === 'Kritik' ? 'text-red-600' :
                        item.status === 'Azalıyor' ? 'text-amber-600' :
                        'text-gray-900'
                      }`}>
                        {item.stock}
                      </span>
                      <span className="text-xs text-gray-500">{item.unit}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {item.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${
                      item.status === 'Kritik' ? 'bg-red-100 text-red-800' :
                      item.status === 'Azalıyor' ? 'bg-amber-100 text-amber-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-[#1B4332] hover:bg-green-50 rounded-lg transition-colors" title="Düzenle">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Sil">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Stok Girişi Yap" description="Depoya yeni ürün girişi yapmak için formu doldurun.">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı *</label>
              <input required value={name} onChange={e => setName(e.target.value)} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]" placeholder="Örn: Karma Aşı" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]">
                <option>Aşılar</option><option>İlaçlar</option><option>Sarf Malzeme</option><option>Mama / Diyet</option>
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Miktar *</label>
              <input required value={stock} onChange={e => setStock(e.target.value)} type="number" min="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]" placeholder="Örn: 50" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Birim Fiyatı (₺) *</label>
              <input required value={price} onChange={e => setPrice(e.target.value)} type="number" min="0" step="0.01" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]" placeholder="Örn: 250" />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">İptal</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#1B4332] rounded-xl hover:bg-[#122c21] shadow-sm shadow-[#1B4332]/30">Stoka Ekle</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); resetForm(); }} title="Ürünü Düzenle" description="Ürün bilgilerini ve stok miktarını güncelleyin.">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı *</label>
              <input required value={name} onChange={e => setName(e.target.value)} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]">
                <option>Aşılar</option><option>İlaçlar</option><option>Sarf Malzeme</option><option>Mama / Diyet</option>
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Miktar *</label>
              <input required value={stock} onChange={e => setStock(e.target.value)} type="number" min="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Birim Fiyatı (₺) *</label>
              <input required value={price} onChange={e => setPrice(e.target.value)} type="number" min="0" step="0.01" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]" />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
            <button type="button" onClick={() => { setIsEditModalOpen(false); resetForm(); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">İptal</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#1B4332] rounded-xl hover:bg-[#122c21] shadow-sm shadow-[#1B4332]/30">Güncelle</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
