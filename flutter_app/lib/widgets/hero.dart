import 'package:flutter/material.dart';
import 'dart:async';

class HeroSection extends StatefulWidget {
  const HeroSection({super.key});

  @override
  State<HeroSection> createState() => _HeroSectionState();
}

class _HeroSectionState extends State<HeroSection> {
  final PageController _pageController = PageController();
  int _currentPage = 0;
  Timer? _timer;

  final List<Map<String, String>> slides = [
    {
      'title': 'Daha iyi bir gelecek için\n',
      'highlight': 'Boğaziçi',
      'desc': 'Çorum Boğaziçi Koleji olarak öğrencilerimizi üniversiteye ve hayata en iyi şekilde hazırlıyoruz.',
    },
    {
      'title': 'Başarıya giden yolda\n',
      'highlight': 'Yanınızdayız',
      'desc': 'Deneyimli kadromuz, modern eğitim anlayışımız ve bireysel takip sistemimizle her öğrencimizin potansiyelini ortaya çıkarıyoruz.',
    },
    {
      'title': 'YKS\'de hedefine\n',
      'highlight': 'Ulaş',
      'desc': 'Planlı çalış, hedefine odaklan. Kendine güven, potansiyeline inan. Güzel bir gelecek seni bekliyor.',
    },
  ];

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 5), (Timer timer) {
      if (_currentPage < slides.length - 1) {
        _currentPage++;
      } else {
        _currentPage = 0;
      }
      if (_pageController.hasClients) {
        _pageController.animateToPage(
          _currentPage,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
        );
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 500, // 70vh alternative
      color: const Color(0xFF1B365D), // var(--blue-main)
      child: Stack(
        children: [
          PageView.builder(
            controller: _pageController,
            onPageChanged: (int page) {
              setState(() {
                _currentPage = page;
              });
            },
            itemCount: slides.length,
            itemBuilder: (context, index) {
              final slide = slides[index];
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Text.rich(
                      TextSpan(
                        children: [
                          TextSpan(
                            text: slide['title'],
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 28,
                              fontStyle: FontStyle.italic,
                            ),
                          ),
                          TextSpan(
                            text: slide['highlight'],
                            style: const TextStyle(
                              color: Color(0xFFD61A2B), // var(--red-main)
                              fontSize: 40,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ],
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Geleceğiniz için...',
                      style: TextStyle(
                        color: Colors.white70,
                        fontSize: 20,
                        fontStyle: FontStyle.italic, // cursive
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      slide['desc']!,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(height: 32),
                    Column(
                      children: [
                        ElevatedButton(
                          onPressed: () {},
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFD61A2B),
                            minimumSize: const Size(200, 48),
                          ),
                          child: const Text('Ön Kayıt', style: TextStyle(color: Colors.white)),
                        ),
                        const SizedBox(height: 12),
                        OutlinedButton(
                          onPressed: () {},
                          style: OutlinedButton.styleFrom(
                            foregroundColor: Colors.white,
                            side: const BorderSide(color: Colors.white),
                            minimumSize: const Size(200, 48),
                          ),
                          child: const Text('Bizi Tanıyın'),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
          Positioned(
            bottom: 20,
            left: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                slides.length,
                (index) => Container(
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  width: 12,
                  height: 12,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: _currentPage == index ? const Color(0xFFD61A2B) : Colors.white30,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
