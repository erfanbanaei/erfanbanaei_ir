// ignore_for_file: camel_case_types

class Experience {
  final String companyName;
  final String role;
  final String startTime;
  final String endTime;
  final String workType;
  final String duration;
  final bool start;
  final bool end;

  Experience(
      {required this.companyName,
      required this.role,
      required this.startTime,
      required this.endTime,
      required this.workType,
      required this.start,
      required this.end,
      required this.duration});
}

List<Experience> Experiences = [
  Experience(
    role: 'Flutter Developer',
    companyName: 'Holding parse',
    startTime: 'Oct 2024',
    endTime: 'Now',
    workType: '',
    duration: '',
    start: true,
    end: false,
  ),
];
