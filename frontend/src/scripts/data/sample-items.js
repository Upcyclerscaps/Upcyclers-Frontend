/* eslint-disable linebreak-style */
const ITEMS = [
  {
    id: 'besi-1',
    name: 'Besi Bekas',
    category: 'Logam',
    quantity: '100 kg',
    location: 'Jakarta Selatan',
    price: '5.000',
    image: 'https://storage.googleapis.com/a1aa/image/6jtw6yBdKuZOLddZoZOeSnqfweZiR0pvM70HJUK9ZSegzff8E.jpg',
    // Additional details for product page
    postedTime: '2 hari yang lalu',
    mainImage: 'https://storage.googleapis.com/a1aa/image/RQkNEVT1KHJ5C5zItsv2zaKjsWZzN0P5oLOawTSJTZGGzA9E.jpg',
    images: [
      'https://storage.googleapis.com/a1aa/image/jWi6kddUkmpeJKZWGqn7d1fYsTFbCNWzLDG1Qdx5ZEepYGonA.jpg',
      'https://storage.googleapis.com/a1aa/image/tQx8YAKJrWIlD5I28I0HfSqmm078mQx5f54QfCs8QEDyYGonA.jpg',
      'https://storage.googleapis.com/a1aa/image/2T3HLGOeRftI0ETuU6J8fLOege0qfE8dFSwbGhWaekhTJmB6JA.jpg',
      'https://storage.googleapis.com/a1aa/image/lnrHHn7mJaLAJhUQBKHKL1lnLDDhefHnZFeBMheuZehDiZgeE.jpg'
    ],
    description: 'Besi bekas berkualitas tinggi, cocok untuk didaur ulang. Tersedia dalam berbagai bentuk seperti pipa, plat, dan potongan besi konstruksi. Kondisi masih bagus dan bebas karat. Minimal pembelian 10 kg. Harga dapat dinegosiasikan untuk pembelian dalam jumlah besar.',
    seller: {
      name: 'Ahmad Subarjo',
      image: 'https://storage.googleapis.com/a1aa/image/Ck1h1DsaU65LK5SVIkVwTDKOCneOx0fzI6rWimBZOKYdMD0TA.jpg',
      joinDate: 'Januari 2024',
      rating: 4.5,
      phone: '6281234567890'
    },
    minPrice: 5000,
    maxPrice: 5000,
    reviews: [
      {
        name: 'Budi Santoso',
        image: 'https://storage.googleapis.com/a1aa/image/1.jpg',
        rating: 5.0,
        comment: 'Produk sangat bagus, sesuai dengan deskripsi. Penjual sangat responsif dan ramah. Pengiriman cepat dan barang diterima dalam kondisi baik.'
      },
      {
        name: 'Siti Aisyah',
        image: 'https://storage.googleapis.com/a1aa/image/2.jpg',
        rating: 4.5,
        comment: 'Barang sesuai dengan deskripsi, kualitas bagus. Penjual sangat membantu dan pengiriman cepat. Akan membeli lagi di sini.'
      }
    ]
  },
  {
    id: 'plastik-1',
    name: 'Botol Plastik',
    category: 'Plastik',
    quantity: '50 kg',
    location: 'Bandung',
    price: '2.500',
    image: 'https://storage.googleapis.com/a1aa/image/yXsRugfDiy2neEZCg5ekUCaP49HQcHhmbElEwQcXHQlv5fPPB.jpg',
    postedTime: '1 hari yang lalu',
    mainImage: 'https://storage.googleapis.com/a1aa/image/yXsRugfDiy2neEZCg5ekUCaP49HQcHhmbElEwQcXHQlv5fPPB.jpg',
    images: [
      'https://storage.googleapis.com/a1aa/image/yXsRugfDiy2neEZCg5ekUCaP49HQcHhmbElEwQcXHQlv5fPPB.jpg'
    ],
    description: 'Botol plastik bekas minuman, bersih dan sudah disortir. Tersedia dalam jumlah besar. Minimal pembelian 10 kg.',
    seller: {
      name: 'Sarah Wijaya',
      image: 'https://storage.googleapis.com/a1aa/image/B6i22Co7GhbeJaUDIov4W6GEfIR40D2lsAJespCzB2qeAMQPB.jpg',
      joinDate: 'Desember 2023',
      rating: 4.7,
      phone: '6281234567891'
    },
    minPrice: 2500,
    maxPrice: 2500
  },
  {
    id: 'kertas-1',
    name: 'Kardus Bekas',
    category: 'Kertas',
    quantity: '200 kg',
    location: 'Surabaya',
    price: '1.800',
    image: 'https://storage.googleapis.com/a1aa/image/n6CmkW4uNooOA9fcsCVWXl2iEW6Rv9YbGf14rQI6rxi68fnnA.jpg',
    postedTime: '3 hari yang lalu',
    mainImage: 'https://storage.googleapis.com/a1aa/image/n6CmkW4uNooOA9fcsCVWXl2iEW6Rv9YbGf14rQI6rxi68fnnA.jpg',
    images: [
      'https://storage.googleapis.com/a1aa/image/n6CmkW4uNooOA9fcsCVWXl2iEW6Rv9YbGf14rQI6rxi68fnnA.jpg'
    ],
    description: 'Kardus bekas dalam kondisi baik, cocok untuk didaur ulang. Tersedia dalam berbagai ukuran. Minimal pembelian 50 kg.',
    seller: {
      name: 'Budi Santoso',
      image: 'https://storage.googleapis.com/a1aa/image/jlieyFhcV1UMUq6bMKGTzMNM6kppf7lrSjrfQebbzgV1AMQPB.jpg',
      joinDate: 'November 2023',
      rating: 4.8,
      phone: '6281234567892'
    },
    minPrice: 1800,
    maxPrice: 1800
  },
  {
    id: 'elektronik-1',
    name: 'Komputer Bekas',
    category: 'Elektronik',
    quantity: '5 unit',
    location: 'Semarang',
    price: '500.000',
    image: 'https://storage.googleapis.com/a1aa/image/2pxeAGNuxs0VciDGUPI3FNSpJqBBDe3qrysEJ01VSwP88fnnA.jpg',
    postedTime: '4 hari yang lalu',
    mainImage: 'https://storage.googleapis.com/a1aa/image/2pxeAGNuxs0VciDGUPI3FNSpJqBBDe3qrysEJ01VSwP88fnnA.jpg',
    images: [
      'https://storage.googleapis.com/a1aa/image/2pxeAGNuxs0VciDGUPI3FNSpJqBBDe3qrysEJ01VSwP88fnnA.jpg'
    ],
    description: 'Komputer bekas lengkap dengan monitor dan keyboard. Kondisi masih berfungsi dengan baik. Unit terbatas.',
    seller: {
      name: 'Andi Wijaya',
      image: 'https://storage.googleapis.com/a1aa/image/3.jpg',
      joinDate: 'Oktober 2023',
      rating: 4.6,
      phone: '6281234567893'
    },
    minPrice: 500000,
    maxPrice: 500000
  }
];

export default ITEMS;