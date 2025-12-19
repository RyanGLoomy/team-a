export const OPTIONS = {
  size: [
    { id: "30-60", label: "30/60", base: 280_000_000 },
    { id: "40-72", label: "40/72", base: 360_000_000 },
    { id: "45-85", label: "45/85", base: 420_000_000 },
  ],
  foundation: [
    { id: "batu_kali", label: "Batu Kali", price: 6000000, pros: ["Ekonomis untuk rumah 1 lantai", "Mudah dikerjakan & material mudah didapat", "Cocok untuk tanah relatif stabil/keras"], cons: ["Kurang ideal untuk tanah sangat lembek", "Daya dukung terbatas untuk beban sangat besar", "Perlu drainase yang baik agar tidak lembap"] },
    { id: "cakar_ayam", label: "Cakar Ayam", price: 14000000, pros: ["Sangat kuat & stabil", "Cocok untuk tanah lembek/berair", "Mengurangi risiko penurunan bangunan"], cons: ["Biaya paling tinggi", "Butuh perhitungan struktur yang baik", "Waktu pengerjaan cenderung lebih lama"] },
    { id: "plat_jalur", label: "Plat Jalur", price: 10000000, pros: ["Stabil untuk dinding memanjang", "Biaya menengah", "Pekerjaan rapi dan terukur"], cons: ["Butuh tanah dengan daya dukung cukup", "Perlu kontrol retak & sambungan", "Kurang ideal untuk pergerakan tanah ekstrem"] },
    { id: "rollag", label: "Pondasi Rollag", price: 4500000, pros: ["Cepat dan ekonomis", "Cukup untuk bangunan ringan", "Cocok untuk pagar/partisi ringan"], cons: ["Tidak cocok untuk beban besar", "Kurang aman di tanah lembek", "Lebih rentan retak bila ada penurunan"] },
  ],
  walls: [
    { id: "batako", label: "Batako", price: 3500000, pros: ["Harga relatif murah", "Pemasangan mudah", "Cukup kuat untuk dinding rumah sederhana"], cons: ["Menyerap air (perlu waterproofing)", "Finishing/plester biasanya lebih tebal", "Dimensi kurang presisi dibanding hebel"] },
    { id: "bata_ringan", label: "Bata Ringan (Hebel)", price: 9000000, pros: ["Ringan sehingga beban struktur berkurang", "Presisi tinggi (dinding lebih rapi)", "Isolasi panas/suara lebih baik"], cons: ["Harga material lebih tinggi", "Perlu perekat/lem khusus", "Lebih rapuh terhadap benturan keras"] },
    { id: "bata_merah", label: "Bata Merah", price: 5000000, pros: ["Kuat dan tahan panas", "Material mudah didapat", "Cocok untuk dinding masif"], cons: ["Pemasangan lebih lama", "Bobot lebih berat", "Butuh plester lebih tebal untuk rata"] },
  ],
  floor: [
    { id: "keramik", label: "Keramik", price: 4000000, pros: ["Banyak pilihan motif & ukuran", "Mudah dibersihkan", "Harga fleksibel dari ekonomis sampai premium"], cons: ["Nat perlu perawatan berkala", "Bisa terasa dingin", "Kualitas sangat bervariasi (pilih grade baik)"] },
    { id: "granit", label: "Granit", price: 8000000, pros: ["Tampilan mewah & rapi", "Tahan gores dan awet", "Pori rendah (lebih tahan noda)"], cons: ["Harga lebih tinggi", "Pemasangan harus presisi", "Bisa licin jika glossy"] },
    { id: "marmer", label: "Marmer", price: 15000000, pros: ["Kesan premium dan unik", "Nyaman & sejuk", "Nilai estetika tinggi"], cons: ["Perawatan tinggi (sealing)", "Mudah tergores/terkena noda", "Biaya material & pemasangan mahal"] },
    { id: "batu_alam", label: "Batu Alam", price: 9000000, pros: ["Tampilan natural", "Cenderung anti slip (tergantung jenis)", "Tahan cuaca untuk area tertentu"], cons: ["Permukaan tidak selalu seragam", "Perlu sealant agar tidak mudah berlumut", "Bobot cukup berat"] },
  ],
  frame: [
    { id: "baja_ringan", label: "Kanal Baja Ringan", price: 7500000, pros: ["Anti rayap & tidak lapuk", "Presisi dan pemasangan cepat", "Bobot ringan mengurangi beban atap"], cons: ["Butuh desain sambungan yang baik", "Bisa berisik bila tanpa insulasi", "Kualitas material harus dipilih yang bagus"] },
    { id: "kayu", label: "Kaso Kayu", price: 5500000, pros: ["Mudah dibentuk dan diperbaiki", "Estetis untuk desain tertentu", "Isolasi panas lebih baik"], cons: ["Rentan rayap/jamur jika tanpa treatment", "Perlu perawatan berkala", "Kualitas tergantung jenis kayu"] },
  ],
  roof: [
    { id: "metal_roof", label: "Metal Roof", price: 7000000, pros: ["Ringan dan pemasangan cepat", "Tahan lama", "Minim perawatan"], cons: ["Bising saat hujan tanpa insulasi", "Bisa panas tanpa lapisan peredam", "Perlu sekrup & flashing berkualitas"] },
    { id: "spandek", label: "Spandek", price: 5000000, pros: ["Ekonomis dan ringan", "Pemasangan cepat", "Cocok untuk desain modern-industrial"], cons: ["Cenderung panas tanpa insulasi", "Bising saat hujan", "Butuh rangka lebih rapat"] },
    { id: "tanah_liat", label: "Genteng Tanah Liat", price: 6000000, pros: ["Sejuk & sirkulasi udara baik", "Tampilan klasik", "Perawatan relatif mudah"], cons: ["Berat (butuh rangka kuat)", "Mudah pecah saat pemasangan", "Waktu pemasangan lebih lama"] },
    { id: "ondvilla", label: "Onduvilla", price: 10000000, pros: ["Lebih senyap saat hujan", "Ringan dan rapi", "Tampilan modern dengan tekstur"], cons: ["Harga menengah–tinggi", "Pemasangan perlu detail", "Ketersediaan tergantung daerah"] },
    { id: "keramik", label: "Genteng Keramik", price: 12000000, pros: ["Sangat awet & warna tahan lama", "Tampilan premium", "Lebih sejuk dibanding metal"], cons: ["Sangat berat (butuh rangka kuat)", "Harga paling tinggi", "Pemasangan butuh tenaga berpengalaman"] },
  ],
  ceiling: [
    { id: "pvc", label: "PVC", price: 5500000, pros: ["Tahan air & lembap", "Anti rayap", "Mudah dibersihkan"], cons: ["Tampilan bisa terlihat 'plastik' jika kualitas rendah", "Pemuaian jika pemasangan kurang tepat", "Harga menengah"] },
    { id: "grc", label: "GRC", price: 6000000, pros: ["Tahan lembap (cocok area basah)", "Lebih kuat dari gipsum", "Tahan jamur bila finishing baik"], cons: ["Lebih berat", "Finishing sambungan perlu rapi", "Biaya pemasangan bisa lebih tinggi"] },
    { id: "gipsum", label: "Gipsum", price: 4500000, pros: ["Tampilan rapi & halus", "Mudah dibentuk (drop ceiling)", "Akustik lebih baik"], cons: ["Tidak tahan air", "Bisa retak jika rangka kurang baik", "Perlu perawatan bila lembap"] },
    { id: "triplek", label: "Triplek", price: 2500000, pros: ["Murah dan cepat dipasang", "Mudah didapat", "Cocok untuk budget ekonomis"], cons: ["Rentan lembap dan rayap", "Umur pakai lebih pendek", "Perlu finishing cat/laminasi"] },
  ],
  doors: [
    { id: "kayu_jati", label: "Kayu Jati", price: 12000000, pros: ["Sangat awet & kuat", "Lebih tahan rayap", "Kesan premium"], cons: ["Harga tinggi", "Bobot berat", "Perlu finishing/perawatan agar tetap bagus"] },
    { id: "kayu_meranti", label: "Kayu Meranti", price: 5000000, pros: ["Lebih ekonomis", "Mudah dikerjakan", "Tampilan kayu tetap natural"], cons: ["Ketahanan lebih rendah dari jati", "Perlu treatment anti rayap", "Bisa melengkung jika kualitas rendah"] },
    { id: "aluminium", label: "Aluminium", price: 7000000, pros: ["Tahan cuaca & tidak lapuk", "Minim perawatan", "Tampilan modern"], cons: ["Isolasi panas/suara perlu tambahan", "Bisa penyok/lecet", "Kualitas tergantung profil & aksesoris"] },
  ],
  electricity: [
    { id: "900", label: "900 Watt", price: 1000000, pros: ["Biaya abonemen lebih rendah", "Cukup untuk kebutuhan dasar", "Cocok untuk rumah kecil/sederhana"], cons: ["Terbatas untuk banyak perangkat", "Kurang nyaman jika pakai AC + alat besar bersamaan", "Perlu manajemen beban"] },
    { id: "1300", label: "1300 Watt", price: 1400000, pros: ["Lebih fleksibel untuk perangkat rumah tangga", "Umumnya cukup untuk 1 AC", "Balance biaya & kebutuhan"], cons: ["Biaya abonemen lebih tinggi dari 900", "Tetap perlu manajemen beban jika banyak alat besar", "Upgrade instalasi mungkin diperlukan"] },
    { id: "2200", label: "2200 Watt", price: 2200000, pros: ["Nyaman untuk banyak perangkat", "Cocok untuk rumah lebih besar", "Lebih aman untuk pemakaian bersamaan"], cons: ["Biaya abonemen lebih tinggi", "Perlu instalasi & MCB yang sesuai", "Tagihan bisa meningkat"] },
  ],
  fence: [
    { id: "hollow_galv", label: "Hollow Galvanis", price: 8000000, pros: ["Lebih tahan karat", "Kuat dan rapi", "Cocok outdoor dengan perawatan minim"], cons: ["Harga lebih tinggi dari hollow hitam", "Finishing cat/powder coating tetap disarankan", "Kualitas galvanis bervariasi"] },
    { id: "hollow_hitam", label: "Hollow Hitam", price: 6000000, pros: ["Lebih ekonomis", "Mudah dilas & dibentuk", "Cocok untuk banyak desain pagar"], cons: ["Rentan karat bila outdoor", "Perlu cat/anti karat berkala", "Umur pakai tergantung perawatan"] },
    { id: "stainless", label: "Hollow Stainless Steel", price: 12000000, pros: ["Paling tahan karat", "Tampilan premium", "Perawatan minim"], cons: ["Paling mahal", "Pengerjaan harus rapi agar tidak baret", "Material & aksesoris harus sekelas"] },
  ],
};

export function getById(list, id) {
  return list.find((x) => x.id === id);
}

export function getBuildArea(sizeId) {
  const n = Number(String(sizeId ?? "").split("-")[0]);
  return Number.isFinite(n) ? n : 30;
}

export function getSizeMultiplier(sizeId) {
  // baseline: tipe 30/60
  return getBuildArea(sizeId) / 30;
}

export function getOptionPrice(cat, optionId, sizeId) {
  const opt = getById(OPTIONS[cat] ?? [], optionId);
  const base = opt?.price ?? 0;
  const m = getSizeMultiplier(sizeId);
  // pembulatan ke ribuan agar rapi
  return Math.round((base * m) / 1000) * 1000;
}


export function calcMaterialsTotal(sel) {
  // sel: { size, foundation, walls, floor, frame, roof, ceiling, doors, electricity, fence }
  const size = getById(OPTIONS.size, sel.size)?.base ?? 0;
  const sum = (cat) => getOptionPrice(cat, sel[cat], sel.size);

  const materials =
    sum("foundation") + sum("walls") + sum("floor") + sum("frame") + sum("roof") +
    sum("ceiling") + sum("doors") + sum("electricity") + sum("fence");

  return { base: size, materials, total: size + materials };
}