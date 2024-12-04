/* eslint-disable linebreak-style */
const AboutPage = {
  async render() {
    return `
        <section class="pt-24 pb-16 bg-primary-600 text-white">
          <div class="container mx-auto px-4 text-center">
            <h1 class="text-4xl font-bold mb-4">Tentang Upcyclers</h1>
            <p>Membangun masa depan yang lebih berkelanjutan melalui pengelolaan sampah yang cerdas dan inovatif.</p>
          </div>
        </section>
  
        <section class="py-16 bg-white">
          <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div class="bg-primary-50 p-8 rounded-lg">
                <h2 class="text-2xl font-bold mb-4">Visi Kami</h2>
                <p>Menjadi platform terdepan dalam mendigitalisasi industri daur ulang di Indonesia, menciptakan ekosistem yang berkelanjutan untuk pengelolaan sampah, dan memberikan dampak positif bagi lingkungan dan masyarakat.</p>
              </div>
              <div class="bg-primary-50 p-8 rounded-lg">
                <h2 class="text-2xl font-bold mb-4">Misi Kami</h2>
                <ul class="list-disc pl-5 space-y-2">
                  <li>Menghubungkan penjual dan pembeli barang rongsok secara efisien dan transparan</li>
                  <li>Meningkatkan kesadaran masyarakat tentang pentingnya daur ulang</li>
                  <li>Mendorong ekonomi sirkular melalui teknologi digital</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
  
        <section class="py-16 bg-gray-50">
          <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-12">Tim Kami</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              ${this._teamMembers.map((member) => this._renderTeamMember(member)).join('')}
            </div>
          </div>
        </section>
  
        <section class="py-16 bg-white">
          <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-12">Pencapaian Kami</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              ${this._achievements.map((achievement) => this._renderAchievement(achievement)).join('')}
            </div>
          </div>
        </section>
      `;
  },

  _teamMembers: [
    {
      name: 'Zaidan Rivandani',
      role: 'CEO & Founder',
      description: 'Berpengalaman 10 tahun dalam industri daur ulang dan teknologi.',
      image: 'https://storage.googleapis.com/a1aa/image/QxAxVq5Q7K4GNhIQtBZWiq2aFzNugRR1DlXB7BhauaoDwA9E.jpg'
    },
    {
      name: 'Zaidan Rivandani',
      role: 'CTO',
      description: 'Ahli teknologi dengan fokus pada pengembangan platform berkelanjutan.',
      image: 'https://storage.googleapis.com/a1aa/image/B6i22Co7GhbeJaUDIov4W6GEfIR40D2lsAJespCzB2qeAMQPB.jpg'
    },
    {
      name: 'Zaidan Rivandani',
      role: 'COO',
      description: 'Spesialis operasional dengan pengalaman di manajemen rantai pasok.',
      image: 'https://storage.googleapis.com/a1aa/image/jlieyFhcV1UMUq6bMKGTzMNM6kppf7lrSjrfQebbzgV1AMQPB.jpg'
    }
  ],

  _achievements: [
    { number: '50K+', text: 'Pengguna Aktif' },
    { number: '100+', text: 'Kota Terjangkau' },
    { number: '1000+', text: 'Transaksi per Hari' },
    { number: '500+', text: 'Pengepul Terverifikasi' }
  ],

  _renderTeamMember(member) {
    return `
        <div class="bg-white p-6 rounded-lg shadow-md text-center">
          <img src="${member.image}" 
               alt="${member.name}" 
               class="w-32 h-32 rounded-full mx-auto mb-4 object-cover">
          <h3 class="text-xl font-bold mb-2">${member.name}</h3>
          <p class="text-primary-600 mb-2">${member.role}</p>
          <p>${member.description}</p>
        </div>
      `;
  },

  _renderAchievement(achievement) {
    return `
        <div class="p-6">
          <div class="text-4xl font-bold text-primary-600 mb-2">${achievement.number}</div>
          <div>${achievement.text}</div>
        </div>
      `;
  }
};

export default AboutPage;