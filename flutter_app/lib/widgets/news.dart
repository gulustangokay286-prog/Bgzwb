import 'package:flutter/material.dart';

class NewsSection extends StatelessWidget {
  const NewsSection({super.key});

  final List<Map<String, String>> newsItems = const [
    {
      'date': '21 Haziran 2026',
      'category': 'Duyuru',
      'title': 'YKS 2026 Sınavına Girecek Öğrencilerimize Başarılar Dileriz',
      'excerpt': 'Emek verdiniz, çalıştınız, hayal kurdunuz. Şimdi, kendinize güvenin, başarınıza inanın. Planlı çalış, hedefine odaklan.',
      'image': 'assets/hero-bg.png',
    },
    {
      'date': '15 Haziran 2026',
      'category': 'Etkinlik',
      'title': '2. Resim Yarışması Sonuçları Açıklandı',
      'excerpt': 'Boğaziçi Koleji\'nin 2025-2026 Eğitim Öğretim Yılı kapsamında düzenlediği 2. Resim Yarışması sonuçlandı.',
      'image': 'assets/hero-bg.png',
    },
    {
      'date': '10 Haziran 2026',
      'category': 'Başarı',
      'title': 'Öğrencilerimiz Bilim Olimpiyatlarında Derece Aldı',
      'excerpt': 'Çorum Boğaziçi Koleji öğrencileri ulusal bilim olimpiyatlarında büyük başarılar elde ederek okulumuzun gururunu yaşattı.',
      'image': 'assets/hero-bg.png',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 60, horizontal: 20),
      color: Colors.white,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const Text(
            'Haberler & Duyurular',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w800,
              color: Color(0xFF1B365D),
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Boğaziçi Koleji\'nden en güncel haberler',
            style: TextStyle(
              fontSize: 16,
              color: Colors.black54,
            ),
          ),
          const SizedBox(height: 40),
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: newsItems.length,
            separatorBuilder: (context, index) => const SizedBox(height: 24),
            itemBuilder: (context, index) {
              final item = newsItems[index];
              return Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      height: 180,
                      decoration: const BoxDecoration(
                        color: Colors.grey, // Placeholder for image
                        borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
                      ),
                      child: Stack(
                        children: [
                          const Center(child: Icon(Icons.image, size: 50, color: Colors.white54)), // Fallback
                          Positioned(
                            top: 12,
                            left: 12,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: const Color(0xFFD61A2B),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                item['category']!,
                                style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            item['date']!,
                            style: TextStyle(color: Colors.grey.shade500, fontSize: 13),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            item['title']!,
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF1B365D),
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            item['excerpt']!,
                            style: const TextStyle(color: Colors.black87, height: 1.5),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'Devamını Oku →',
                            style: TextStyle(color: Colors.blue.shade700, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
