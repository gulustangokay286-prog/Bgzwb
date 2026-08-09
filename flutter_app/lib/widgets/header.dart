import 'package:flutter/material.dart';
import '../screens/learning_hub.dart' as learning_hub;

class Header extends StatelessWidget implements PreferredSizeWidget {
  const Header({super.key});

  @override
  Size get preferredSize => const Size.fromHeight(110);

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      child: SafeArea(
        child: Column(
          children: [
            // Top Bar
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                border: Border(bottom: BorderSide(color: Colors.grey.shade200)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(Icons.mail, size: 14, color: Colors.grey.shade700),
                      const SizedBox(width: 6),
                      Text(
                        'info@corumbogazici.com',
                        style: TextStyle(fontSize: 12, color: Colors.grey.shade700),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      Icon(Icons.facebook, size: 14, color: Colors.grey.shade700),
                      const SizedBox(width: 8),
                      // Normally use font_awesome_flutter for Instagram/Twitter
                      Icon(Icons.camera_alt, size: 14, color: Colors.grey.shade700),
                    ],
                  )
                ],
              ),
            ),
            // Main Nav
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      // Placeholder for logo
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: const Color(0xFF1B365D),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.school, color: Colors.white),
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
                              color: Color(0xFF1B365D),
                              letterSpacing: 1,
                            ),
                          ),
                          Text(
                            'EĞİTİM KURUMLARI',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                              color: Colors.grey.shade600,
                              letterSpacing: 2,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                    Row(
                      children: [
                        ElevatedButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (context) => const learning_hub.LearningHubScreen()),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFD61A2B),
                            minimumSize: const Size(100, 36),
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                          ),
                          child: const Text('Öğrenci Girişi', style: TextStyle(color: Colors.white, fontSize: 12)),
                        ),
                        IconButton(
                          icon: Icon(Icons.search, color: Colors.grey.shade600),
                          onPressed: () {},
                        ),
                        IconButton(
                          icon: Icon(Icons.menu, color: const Color(0xFF1B365D)),
                          onPressed: () {
                            // TODO: Open Drawer or Menu
                          },
                        ),
                      ],
                    )
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
