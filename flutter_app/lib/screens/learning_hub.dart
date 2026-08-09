import 'package:flutter/material.dart';
import 'dart:ui';

class LearningHubScreen extends StatefulWidget {
  const LearningHubScreen({super.key});

  @override
  State<LearningHubScreen> createState() => _LearningHubScreenState();
}

class _LearningHubScreenState extends State<LearningHubScreen> with TickerProviderStateMixin {
  late AnimationController _pulseController;
  late AnimationController _orbController;

  // Dummy View Model Data
  final int level = 12;
  final int xp = 4500;
  final double xpProgress = 0.65;
  final int streakDays = 14;
  final int todayStudyMinutes = 120;
  final int coins = 350;
  final int completedTaskCount = 3;
  final int totalTaskCount = 5;

  final Map<String, dynamic> strongestSubject = {'subject': 'Matematik', 'proficiency': 85};
  final Map<String, dynamic> weakestSubject = {'subject': 'Fizik', 'proficiency': 45, 'wrongAnswers': 12};

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2000),
    )..repeat(reverse: true);
    
    _orbController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 10),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _orbController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF070B19), // Deepest Navy background
      body: Stack(
        children: [
          // Animated Glow Orbs in Background
          AnimatedBuilder(
            animation: _orbController,
            builder: (context, child) {
              return Stack(
                children: [
                  Positioned(
                    top: -100 + (_orbController.value * 50),
                    left: -50,
                    child: _buildGlowOrb(const Color(0xFFD61A2B), 300), // Red Orb
                  ),
                  Positioned(
                    top: 300 - (_orbController.value * 50),
                    right: -100,
                    child: _buildGlowOrb(const Color(0xFF1B365D), 400), // Blue Orb
                  ),
                  Positioned(
                    bottom: -50 + (_orbController.value * 30),
                    left: 50,
                    child: _buildGlowOrb(const Color(0xFFD61A2B).withOpacity(0.5), 250), // Secondary Red Orb
                  ),
                ],
              );
            },
          ),
          
          // Main Content
          SafeArea(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildHeader(),
                    const SizedBox(height: 30),
                    _buildModulesGrid(),
                    const SizedBox(height: 30),
                    _buildXPHeroCard(),
                    const SizedBox(height: 30),
                    _buildAICoachSection(),
                    const SizedBox(height: 30),
                    _buildProficiencySection(),
                    const SizedBox(height: 30),
                    _buildDailyTasksSection(),
                    const SizedBox(height: 30),
                    _buildLeaderboardPreview(),
                    const SizedBox(height: 30),
                    _buildQuickStatsFooter(),
                    const SizedBox(height: 60),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // MARK: - Background Orbs
  Widget _buildGlowOrb(Color color, double size) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: RadialGradient(
          colors: [
            color.withOpacity(0.4),
            color.withOpacity(0.0),
          ],
        ),
      ),
    );
  }

  // MARK: - Glassmorphism Container Wrapper
  Widget _buildGlassContainer({required Widget child, EdgeInsetsGeometry? padding}) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(24),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 15, sigmaY: 15),
        child: Container(
          padding: padding ?? const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.05),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: Colors.white.withOpacity(0.1), width: 1),
            boxShadow: [
              BoxShadow(color: Colors.black.withOpacity(0.2), blurRadius: 30),
            ],
          ),
          child: child,
        ),
      ),
    );
  }

  // MARK: - Header
  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Akıllı Öğrenim',
                style: TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: 1),
              ),
              const SizedBox(height: 4),
              Text(
                'Boğaziçi Eğitim Ekosistemi',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: Colors.white.withOpacity(0.6), letterSpacing: 0.5),
              ),
            ],
          ),
          Row(
            children: [
              _buildAnimatedBriefingIcon(),
              const SizedBox(width: 16),
              Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(colors: [Color(0xFFD61A2B), Color(0xFF9B131F)]),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(color: const Color(0xFFD61A2B).withOpacity(0.5), blurRadius: 15, offset: const Offset(0, 4)),
                  ],
                ),
                child: const Icon(Icons.psychology, color: Colors.white, size: 28),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildAnimatedBriefingIcon() {
    return ScaleTransition(
      scale: Tween(begin: 0.95, end: 1.15).animate(CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut)),
      child: Container(
        width: 46,
        height: 46,
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.1),
          shape: BoxShape.circle,
          border: Border.all(color: Colors.white.withOpacity(0.2), width: 1),
        ),
        child: const Icon(Icons.graphic_eq, color: Colors.white, size: 22),
      ),
    );
  }

  // MARK: - Modules Grid
  Widget _buildModulesGrid() {
    final modules = [
      {'title': 'AI Soru Bankası', 'sub': 'Adaptif Testler', 'icon': Icons.all_inclusive, 'color': const Color(0xFF5AC8FA)},
      {'title': 'Kavram Kartları', 'sub': 'Aktif Hatırlama', 'icon': Icons.style, 'color': const Color(0xFFD61A2B)},
      {'title': 'Video Kütüphanesi', 'sub': 'Konu Anlatımları', 'icon': Icons.play_circle_fill, 'color': const Color(0xFF007AFF)},
      {'title': 'Beyin Haritası', 'sub': 'Konu Analitikleri', 'icon': Icons.account_tree, 'color': const Color(0xFF34C759)},
      {'title': 'Skor Tablosu', 'sub': 'Okul Sıralaması', 'icon': Icons.emoji_events, 'color': const Color(0xFFFFD700)},
      {'title': 'Gece Etüdü', 'sub': 'Sessiz Sınıf', 'icon': Icons.nightlight_round, 'color': const Color(0xFFFF9500)},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Text('Eğitim Modülleri', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white.withOpacity(0.9))),
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 150,
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            itemCount: modules.length,
            separatorBuilder: (context, index) => const SizedBox(width: 16),
            itemBuilder: (context, index) {
              final m = modules[index];
              final color = m['color'] as Color;
              return ClipRRect(
                borderRadius: BorderRadius.circular(24),
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                  child: Container(
                    width: 140,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.05),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: color.withOpacity(0.3), width: 1),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 52,
                          height: 52,
                          decoration: BoxDecoration(
                            color: color.withOpacity(0.15),
                            shape: BoxShape.circle,
                            boxShadow: [BoxShadow(color: color.withOpacity(0.2), blurRadius: 10)],
                          ),
                          child: Icon(m['icon'] as IconData, color: color, size: 28),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          m['title'] as String,
                          textAlign: TextAlign.center,
                          maxLines: 2,
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          m['sub'] as String,
                          textAlign: TextAlign.center,
                          maxLines: 1,
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: Colors.white.withOpacity(0.5)),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  // MARK: - XP Hero Section
  Widget _buildXPHeroCard() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: _buildGlassContainer(
        child: Column(
          children: [
            Row(
              children: [
                Text('$level', style: const TextStyle(fontSize: 44, fontWeight: FontWeight.w900, color: Colors.white)),
                const SizedBox(width: 16),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Level', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white54)),
                    Text('$xp XP', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFFD61A2B))),
                  ],
                ),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(colors: [const Color(0xFFD61A2B).withOpacity(0.2), Colors.transparent]),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFD61A2B).withOpacity(0.5), width: 1),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.local_fire_department, color: Color(0xFFD61A2B), size: 18),
                      const SizedBox(width: 6),
                      Text('$streakDays', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Colors.white)),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            // Progress Bar
            Stack(
              children: [
                Container(
                  height: 10,
                  decoration: BoxDecoration(color: Colors.white.withOpacity(0.1), borderRadius: BorderRadius.circular(5)),
                ),
                FractionallySizedBox(
                  widthFactor: xpProgress,
                  child: Container(
                    height: 10,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(colors: [Color(0xFFD61A2B), Color(0xFFFF4D4D)]),
                      borderRadius: BorderRadius.circular(5),
                      boxShadow: [BoxShadow(color: const Color(0xFFD61A2B).withOpacity(0.5), blurRadius: 10)],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.timer, size: 16, color: Color(0xFF5AC8FA)),
                    const SizedBox(width: 8),
                    Text('$todayStudyMinutes dk', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Colors.white70)),
                  ],
                ),
                Row(
                  children: [
                    const Icon(Icons.star, size: 16, color: Color(0xFFFFD700)),
                    const SizedBox(width: 8),
                    Text('$coins coin', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Colors.white70)),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // MARK: - AI Coach
  Widget _buildAICoachSection() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: _buildGlassContainer(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFF5AC8FA).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFF5AC8FA).withOpacity(0.5)),
                  ),
                  child: const Icon(Icons.smart_toy, color: Color(0xFF5AC8FA), size: 20),
                ),
                const SizedBox(width: 16),
                const Text('AI Koç Analizi', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white)),
                const Spacer(),
                Icon(Icons.chevron_right, color: Colors.white.withOpacity(0.5)),
              ],
            ),
            const SizedBox(height: 20),
            Text(
              '"${strongestSubject['subject']} alanında %${strongestSubject['proficiency']} ile parlıyorsun! ${weakestSubject['subject']} (%${weakestSubject['proficiency']}) biraz geride — bugün ${weakestSubject['wrongAnswers']} soru çözersen farkı kapatırsın."',
              style: TextStyle(fontSize: 15, color: Colors.white.withOpacity(0.8), height: 1.6, fontStyle: FontStyle.italic),
            ),
            const SizedBox(height: 24),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 14),
              decoration: BoxDecoration(
                gradient: LinearGradient(colors: [const Color(0xFF1B365D).withOpacity(0.8), const Color(0xFF26497C).withOpacity(0.8)]),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white.withOpacity(0.1)),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text('Bilişsel Profilime Git', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Colors.white)),
                  SizedBox(width: 10),
                  Icon(Icons.insights, size: 18, color: Colors.white),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // MARK: - Proficiency
  Widget _buildProficiencySection() {
    final subjects = [
      {'name': 'Matematik', 'prof': 85, 'correct': 120, 'wrong': 15, 'color': const Color(0xFF5AC8FA)},
      {'name': 'Fizik', 'prof': 45, 'correct': 30, 'wrong': 25, 'color': const Color(0xFFD61A2B)},
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Konu Yeterliliklerin', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white.withOpacity(0.9))),
              const Text('Genel Analiz →', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF5AC8FA))),
            ],
          ),
          const SizedBox(height: 16),
          ...subjects.map((sub) => Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: _buildGlassContainer(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Container(
                        width: 50,
                        height: 50,
                        decoration: BoxDecoration(
                          color: (sub['color'] as Color).withOpacity(0.15),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: (sub['color'] as Color).withOpacity(0.3)),
                        ),
                        child: Icon(Icons.book, color: sub['color'] as Color, size: 24),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(sub['name'] as String, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Colors.white)),
                                const SizedBox(width: 10),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                  decoration: BoxDecoration(
                                    color: (sub['color'] as Color).withOpacity(0.15),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text('Seviye A', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: sub['color'] as Color)),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Stack(
                              children: [
                                Container(height: 6, decoration: BoxDecoration(color: Colors.white.withOpacity(0.1), borderRadius: BorderRadius.circular(3))),
                                FractionallySizedBox(
                                  widthFactor: (sub['prof'] as int) / 100,
                                  child: Container(
                                    height: 6,
                                    decoration: BoxDecoration(
                                      color: sub['color'] as Color,
                                      borderRadius: BorderRadius.circular(3),
                                      boxShadow: [BoxShadow(color: (sub['color'] as Color).withOpacity(0.5), blurRadius: 6)],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 20),
                      Text('%${sub['prof']}', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: sub['color'] as Color)),
                    ],
                  ),
                ),
              )),
        ],
      ),
    );
  }

  // MARK: - Daily Tasks
  Widget _buildDailyTasksSection() {
    final tasks = [
      {'title': '10 Matematik Sorusu Çöz', 'xp': 50, 'done': true, 'icon': Icons.calculate},
      {'title': 'Fizik Konu Anlatımı İzle', 'xp': 100, 'done': false, 'icon': Icons.play_circle},
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Günün Görevleri', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white.withOpacity(0.9))),
              Text('$completedTaskCount/$totalTaskCount', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: Color(0xFF34C759))),
            ],
          ),
          const SizedBox(height: 16),
          ...tasks.map((t) {
            final done = t['done'] as bool;
            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: _buildGlassContainer(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Container(
                      width: 46,
                      height: 46,
                      decoration: BoxDecoration(
                        color: done ? const Color(0xFF34C759).withOpacity(0.15) : Colors.white.withOpacity(0.05),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: done ? const Color(0xFF34C759).withOpacity(0.3) : Colors.white.withOpacity(0.1)),
                      ),
                      child: Icon(done ? Icons.check : t['icon'] as IconData, color: done ? const Color(0xFF34C759) : Colors.white70),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            t['title'] as String,
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              decoration: done ? TextDecoration.lineThrough : null,
                              color: done ? Colors.white54 : Colors.white,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            done ? '✓ Tamamlandı' : '+${t['xp']} XP',
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w800,
                              color: done ? const Color(0xFF34C759) : const Color(0xFF5AC8FA),
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (!done) Icon(Icons.chevron_right, color: Colors.white.withOpacity(0.3)),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  // MARK: - Leaderboard
  Widget _buildLeaderboardPreview() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Skor Tablosu', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white.withOpacity(0.9))),
              const Text('Tümü →', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF5AC8FA))),
            ],
          ),
          const SizedBox(height: 16),
          _buildGlassContainer(
            padding: EdgeInsets.zero,
            child: Column(
              children: [
                _buildLeaderboardRow(1, 'Ahmet Y.', 5200, isSelf: false),
                Divider(height: 1, color: Colors.white.withOpacity(0.05)),
                _buildLeaderboardRow(2, 'Sen', 4500, isSelf: true),
                Divider(height: 1, color: Colors.white.withOpacity(0.05)),
                _buildLeaderboardRow(3, 'Zeynep K.', 4100, isSelf: false),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLeaderboardRow(int rank, String name, int xp, {required bool isSelf}) {
    final color = rank == 1 ? const Color(0xFFFFD700) : rank == 2 ? const Color(0xFFC0C0C0) : const Color(0xFFCD7F32);
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      child: Row(
        children: [
          Text('#$rank', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: color)),
          const SizedBox(width: 20),
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: color.withOpacity(0.15),
              shape: BoxShape.circle,
              border: Border.all(color: color.withOpacity(0.5)),
            ),
            alignment: Alignment.center,
            child: Text(name.substring(0, 1), style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: color)),
          ),
          const SizedBox(width: 16),
          Text(name, style: TextStyle(fontSize: 16, fontWeight: isSelf ? FontWeight.w900 : FontWeight.w600, color: isSelf ? const Color(0xFFD61A2B) : Colors.white)),
          const Spacer(),
          Text('$xp XP', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: Color(0xFF5AC8FA))),
        ],
      ),
    );
  }

  // MARK: - Quick Stats
  Widget _buildQuickStatsFooter() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(
        children: [
          _buildQuickStat('345', 'Top. Soru', Icons.fact_check, const Color(0xFF34C759)),
          const SizedBox(width: 16),
          _buildQuickStat('2s', 'Çalışma', Icons.access_time_filled, const Color(0xFF5AC8FA)),
          const SizedBox(width: 16),
          _buildQuickStat('280', 'Doğru', Icons.stars, const Color(0xFFD61A2B)), // Redesigned to use Red
        ],
      ),
    );
  }

  Widget _buildQuickStat(String value, String label, IconData icon, Color color) {
    return Expanded(
      child: _buildGlassContainer(
        padding: const EdgeInsets.symmetric(vertical: 20),
        child: Column(
          children: [
            Icon(icon, color: color, size: 30),
            const SizedBox(height: 12),
            Text(value, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white)),
            const SizedBox(height: 6),
            Text(label, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Colors.white.withOpacity(0.6))),
          ],
        ),
      ),
    );
  }
}
