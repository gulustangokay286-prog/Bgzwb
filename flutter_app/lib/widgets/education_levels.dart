import 'package:flutter/material.dart';

class EducationLevelsSection extends StatelessWidget {
  const EducationLevelsSection({super.key});

  final List<Map<String, dynamic>> programs = const [
    {'name': 'Sayısal', 'icon': Icons.science, 'color': Color(0xFF2196F3)},
    {'name': 'Eşit Ağırlık', 'icon': Icons.balance, 'color': Color(0xFFF0C929)},
    {'name': 'Sözel', 'icon': Icons.menu_book, 'color': Color(0xFFFF7043)},
    {'name': 'Dil', 'icon': Icons.public, 'color': Color(0xFF26A69A)},
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 60, horizontal: 20),
      color: Colors.grey.shade100, // Assuming a slight background for contrast
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Eğitim Programlarımız',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w800,
              color: Color(0xFF1B365D),
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Lise düzeyinde dört farklı alan ile öğrencilerimizi YKS\'ye hazırlıyoruz',
            style: TextStyle(
              fontSize: 16,
              color: Colors.black54,
            ),
          ),
          const SizedBox(height: 32),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2, // 2 columns on mobile
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              childAspectRatio: 1.2,
            ),
            itemCount: programs.length,
            itemBuilder: (context, index) {
              final p = programs[index];
              return Container(
                decoration: BoxDecoration(
                  color: p['color'] as Color,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: (p['color'] as Color).withOpacity(0.4),
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(p['icon'] as IconData, size: 40, color: Colors.white),
                    const SizedBox(height: 12),
                    Text(
                      (p['name'] as String).toUpperCase(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w700,
                        fontSize: 14,
                        letterSpacing: 1,
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
