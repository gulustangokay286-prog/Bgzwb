import 'package:flutter/material.dart';

class CTASection extends StatelessWidget {
  const CTASection({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF1B365D), // Dark blue background
      padding: const EdgeInsets.symmetric(vertical: 60, horizontal: 24),
      child: Column(
        children: [
          const Text(
            'Boğaziçi Kolejini yakından tanımak ister misiniz?',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.w800,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'Okulumuz hakkında detaylı bilgi almak, kampüsümüzü ziyaret etmek veya ön kayıt yaptırmak için hemen iletişime geçin.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 16,
              color: Colors.white70,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 32),
          Column(
            children: [
              ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFD61A2B),
                  minimumSize: const Size(double.infinity, 48),
                ),
                child: const Text('Ön Kayıt Yap', style: TextStyle(color: Colors.white)),
              ),
              const SizedBox(height: 16),
              OutlinedButton(
                onPressed: () {},
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.white,
                  side: const BorderSide(color: Colors.white),
                  minimumSize: const Size(double.infinity, 48),
                ),
                child: const Text('0 364 666 05 00'),
              ),
            ],
          )
        ],
      ),
    );
  }
}
