class Education {
  final String institutionName;
  final String department;
  final String startTime;
  final String endTime; // Nullable end time
  final String grade;
  final bool start;
  final bool end; // Nullable grade

  Education(
      {required this.institutionName,
      required this.department,
      required this.startTime,
      required this.endTime,
      required this.grade,
      required this.start,
      required this.end});
}

List<Education> educations = [
  Education(
    institutionName: 'Azad University',
    startTime: 'Jan 2025',
    endTime: 'Now',
    department: 'Computer Engineer',
    grade: '',
    start: true,
    end: true,
  ),
];
