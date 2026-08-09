import 'package:flutter/material.dart';

class FooterSection extends StatelessWidget {
  const FooterSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF0F172A), // var(--blue-darker)
      padding: const EdgeInsets.symmetric(vertical: 60, horizontal: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.school, color: Color(0xFF1B365D)),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'BOĞAZİÇİ',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                      letterSpacing: 1,
                    ),
                  ),
                  Text(
                    'EĞİTİM KURUMLARI',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                      color: Colors.white70,
                      letterSpacing: 2,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Text(
            'Geleceğiniz için...',
            style: TextStyle(
              fontSize: 18,
              fontStyle: FontStyle.italic,
              color: Colors.white54,
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            'Çorum Boğaziçi Koleji olarak öğrencilerimize en iyi eğitimi sunmak ve onları geleceğe hazırlamak için çalışıyoruz.',
            style: TextStyle(color: Colors.white70, height: 1.5),
          ),
          const SizedBox(height: 32),
          
          _buildLinksColumn('Hızlı Bağlantılar', ['Anasayfa', 'Hakkımızda', 'Eğitim Programları', 'Haberler', 'İletişim']),
          const SizedBox(height: 24),
          _buildLinksColumn('Eğitim', ['Sayısal Program', 'Eşit Ağırlık Program', 'Sözel Program', 'Dil Programı', 'YKS Hazırlık']),
          const SizedBox(height: 24),
          
          const Text(
            'İletişim',
            style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          _buildContactRow(Icons.location_on, 'Yavruturna Mah. Esnafevleri 6.Sk. No:12 Merkez/Çorum'),
          const SizedBox(height: 12),
          _buildContactRow(Icons.phone, '0 364 666 05 00'),
          const SizedBox(height: 12),
          _buildContactRow(Icons.mail, 'info@corumbogazici.com'),
          
          const SizedBox(height: 24),
          Row(
            children: [
              _buildSocialIcon(Icons.camera_alt), // instagram
              const SizedBox(width: 8),
              _buildSocialIcon(Icons.facebook),
              const SizedBox(width: 8),
              _buildSocialIcon(Icons.alternate_email), // twitter
              const SizedBox(width: 8),
              _buildSocialIcon(Icons.play_circle_fill), // youtube
            ],
          ),
          
          const SizedBox(height: 48),
          const Divider(color: Colors.white24),
          const SizedBox(height: 16),
          Text(
            '© ${2026} Çorum Boğaziçi Koleji. Tüm hakları saklıdır.',
            style: const TextStyle(color: Colors.white54, fontSize: 12),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildLinksColumn(String title, List<String> links) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        ...links.map((link) => Padding(
          padding: const EdgeInsets.only(bottom: 12.0),
          child: Text(link, style: const TextStyle(color: Colors.white70)),
        )),
      ],
    );
  }

  Widget _buildContactRow(IconData icon, String text) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 18, color: const Color(0xFFD61A2B)),
        const SizedBox(width: 12),
        Expanded(child: Text(text, style: const TextStyle(color: Colors.white70))),
      ],
    );
  }

  Widget _buildSocialIcon(IconData icon) {
    return Container(
      width: 36,
      height: 36,
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(18),
      ),
      child: Icon(icon, size: 18, color: Colors.white),
    );
  }
}
