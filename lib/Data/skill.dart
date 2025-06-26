class Skill {
  final String svgPath;
  final String name;

  Skill({required this.svgPath, required this.name});
}

final List<Skill> skills = [
  Skill(svgPath: 'assets/svg/flutter.svg', name: 'Flutter'),
  Skill(svgPath: 'assets/svg/dart.svg', name: 'Dart'),
  Skill(svgPath: 'assets/svg/python.svg', name: 'Python'),
  Skill(svgPath: 'assets/svg/mysql.svg', name: 'MySQL'),
  Skill(svgPath: 'assets/svg/mongodb.svg', name: 'MongoDB'),
  Skill(svgPath: 'assets/svg/figma.svg', name: 'Figma'),
  Skill(svgPath: 'assets/svg/linux.svg', name: 'Linux'),
  Skill(svgPath: 'assets/svg/git.svg', name: 'Git'),
  Skill(svgPath: 'assets/svg/bash.svg', name: 'Bash'),
];
