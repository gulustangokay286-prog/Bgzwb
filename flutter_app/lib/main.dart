import 'package:flutter/material.dart';

import 'widgets/header.dart';
import 'widgets/hero.dart';
import 'widgets/education_levels.dart';
import 'widgets/values.dart';
import 'widgets/stats.dart';
import 'widgets/news.dart';
import 'widgets/cta.dart';
import 'widgets/contact.dart';
import 'widgets/footer.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Boğaziçi Web',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF1B365D)), // Assuming Boğaziçi blue as seed
        useMaterial3: true,
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const Header(), // Custom PreferredSizeWidget
      body: SingleChildScrollView(
        child: Column(
          children: const [
            HeroSection(),
            EducationLevelsSection(),
            ValuesSection(),
            StatsSection(),
            NewsSection(),
            CTASection(),
            ContactSection(),
            FooterSection(),
          ],
        ),
      ),
    );
  }
}
