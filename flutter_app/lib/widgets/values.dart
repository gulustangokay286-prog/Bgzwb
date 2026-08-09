import 'package:flutter/material.dart';

class ValuesSection extends StatelessWidget {
  const ValuesSection({super.key});

  final List<Map<String, String>> valuesLeft = const [
    {'title': 'Bilgili', 'desc': 'Farklı disiplinleri bir arada kullanıyor, bilgiyi keşfederek kavramsal anlayışı geliştiriyoruz.'},
    {'title': 'Evrensel', 'desc': 'Dünya vatandaşları yetiştiriyor, tüm kültürlere oryante olabilecek bireyler yetiştiriyoruz.'},
    {'title': 'Duyarlı', 'desc': 'Empati kuruyor, şefkat gösteriyor ve sonsuz saygı duyuyoruz. Çevremizdeki dünya üzerinde olumlu bir fark yaratmak üzere hareket ediyoruz.'},
  ];

  final List<Map<String, String>> valuesRight = const [
    {'title': 'Düşünen', 'desc': 'Problemleri analiz etmek ve bunlarla ilgili sorumluluk sahibi eylemlerde bulunmak için eleştirel ve yaratıcı düşünme becerilerini keşfediyoruz.'},
    {'title': 'Açık Fikirli', 'desc': 'Kendi kültürümüz ve kişisel geçmişimizin yanı sıra, diğer kültürel değer ve geleneklerine de önem veriyoruz.'},
    {'title': 'İşbirlikçi', 'desc': 'Kişisel gelişimimizi destekleyecek güçlü ve güçsüz yanlarımızı anlamak için çaba sarf ediyoruz.'},
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 60, horizontal: 20),
      color: Colors.white,
      child: Column(
        children: [
          const Text(
            'DAHA İYİ BİR GELECEK İÇİN',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: Color(0xFF1B365D),
            ),
          ),
          const Text(
            'BOĞAZİÇİ',
            style: TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.w800,
              color: Color(0xFFD61A2B),
            ),
          ),
          const SizedBox(height: 40),
          
          // Image
          Container(
            width: 200,
            height: 200,
            decoration: BoxDecoration(
              shape: BoxShape.circle, // Alternative to diamond frame for simplicity in Flutter, or use Transform.rotate
              border: Border.all(color: const Color(0xFFD61A2B), width: 4),
              image: const DecorationImage(
                image: AssetImage('assets/values-student.png'), // Will throw error if not added to pubspec and assets, but good for placeholder
                fit: BoxFit.cover,
              ),
            ),
            child: const Icon(Icons.person, size: 80, color: Colors.grey), // Fallback
          ),
          const SizedBox(height: 40),

          // Items
          ...valuesLeft.map((v) => _buildValueItem(v)),
          ...valuesRight.map((v) => _buildValueItem(v)),
        ],
      ),
    );
  }

  Widget _buildValueItem(Map<String, String> v) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            margin: const EdgeInsets.only(top: 4, right: 16),
            padding: const EdgeInsets.all(4),
            decoration: const BoxDecoration(
              color: Color(0xFFD61A2B),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.check, size: 14, color: Colors.white),
          ),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  v['title']!,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF1B365D),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  v['desc']!,
                  style: const TextStyle(
                    fontSize: 14,
                    color: Colors.black87,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
