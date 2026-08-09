import 'package:flutter/material.dart';

class StatsSection extends StatelessWidget {
  const StatsSection({super.key});

  final List<Map<String, dynamic>> stats = const [
    {'num': 20, 'suffix': '+', 'label': 'Yıllık Tecrübe'},
    {'num': 98, 'suffix': '%', 'label': 'Üniversiteye Yerleşme'},
    {'num': 1500, 'suffix': '+', 'label': 'Mezun Öğrenci'},
    {'num': 50, 'suffix': '+', 'label': 'Uzman Öğretmen'},
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF0F172A), // var(--blue-dark)
      padding: const EdgeInsets.symmetric(vertical: 50, horizontal: 20),
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2, // 2 items per row on mobile
          childAspectRatio: 1.2,
          crossAxisSpacing: 20,
          mainAxisSpacing: 30,
        ),
        itemCount: stats.length,
        itemBuilder: (context, index) {
          final s = stats[index];
          return Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              TweenAnimationBuilder<int>(
                tween: IntTween(begin: 0, end: s['num'] as int),
                duration: const Duration(seconds: 2),
                builder: (context, value, child) {
                  return Text(
                    '$value${s['suffix']}',
                    style: const TextStyle(
                      fontSize: 40,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                      height: 1,
                    ),
                  );
                },
              ),
              const SizedBox(height: 8),
              Text(
                s['label'] as String,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Colors.white70,
                  letterSpacing: 1,
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
