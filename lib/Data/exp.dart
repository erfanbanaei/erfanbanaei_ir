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
    companyName: 'Prase Holding',
    startTime: 'Oct 2024',
    endTime: 'Now',
    workType: '',
    duration: '',
    start: true,
    end: false,
  ),
  Experience(
    role: 'Flutter Developer',
    companyName: 'Freelancer',
    startTime: 'Oct 2022',
    endTime: 'Oct 2024',
    workType: '',
    duration: '',
    start: false,
    end: false,
  ),
  Experience(
    role: 'Python Developer',
    companyName: 'Freelancer',
    startTime: 'Feb 2018',
    endTime: 'Oct 2022',
    workType: '',
    duration: '',
    start: false,
    end: true,
  ),
];
