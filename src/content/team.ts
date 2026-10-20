import type { WikiPage } from '../site-data';
import type { TeamMember } from './types';

// Display given name first, as on the 2025 members page. The three requested
// leaders appear first; everyone else is sorted by family and given-name pinyin.
const byName = (a: TeamMember, b: TeamMember) =>
  `${a.familyName} ${a.givenName}`.localeCompare(`${b.familyName} ${b.givenName}`, 'en');
const leaderPriority: Record<string, number> = { 'Xin Xiong': 0, 'Hongyi Wang': 1, 'Kaiting Wei': 2 };
const byLeaderOrder = (a: TeamMember, b: TeamMember) =>
  (leaderPriority[`${a.givenName} ${a.familyName}`] ?? 3) -
  (leaderPriority[`${b.givenName} ${b.familyName}`] ?? 3) || byName(a, b);

export const groupLeaders: TeamMember[] = [
  { givenName: 'Linjintao', familyName: 'Chen', major: 'Biological Science', src: '/figures/team/linjintao-chen.webp' },
  { givenName: 'Zhutian', familyName: 'Mao', major: 'Biological Science', src: '/figures/team/zhutian-mao.webp' },
  { givenName: 'Yongyuan', familyName: 'Mi', major: 'Ecology', src: '/figures/team/yongyuan-mi.webp' },
  { givenName: 'Hongyi', familyName: 'Wang', major: 'Biological Science', src: '/figures/team/hongyi-wang.webp' },
  { givenName: 'Kaiting', familyName: 'Wei', major: 'Biological Science', src: '/figures/team/kaiting-wei.webp' },
  { givenName: 'Xin', familyName: 'Xiong', major: 'Biological Science', src: '/figures/team/xin-xiong.webp' },
  { givenName: 'Furong', familyName: 'Yang', major: 'Biological Science', src: '/figures/team/furong-yang.webp' },
  { givenName: 'Qingying', familyName: 'Zhao', major: 'Biological Science', src: '/figures/team/qingying-zhao.webp' },
  { givenName: 'Tianyu', familyName: 'Zhou', major: 'Computational Biology', src: '/figures/team/tianyu-zhou.webp' },
].sort(byLeaderOrder);

export const teamMembers: TeamMember[] = [
  { givenName: 'Jiaxuan', familyName: 'Chen', major: 'Materials Engineering', src: '/figures/team/jiaxuan-chen.webp' },
  { givenName: 'Hengyu', familyName: 'Dai', major: 'Biological Science', src: '/figures/team/hengyu-dai.webp' },
  { givenName: 'Yihan', familyName: 'Dai', major: 'Biological Science', src: '/figures/team/yihan-dai.webp' },
  { givenName: 'Yuheng', familyName: 'Gao', major: 'Biological Science', src: '/figures/team/yuheng-gao.webp' },
  { givenName: 'Zhiyan', familyName: 'Ge', major: 'Computational Biology', src: '/figures/team/zhiyan-ge.webp' },
  { givenName: 'Hengwei', familyName: 'Liang', major: 'Biological Science', src: '/figures/team/hengwei-liang.webp' },
  { givenName: 'Keyu', familyName: 'Liu', major: 'Computational Biology', src: '/figures/team/keyu-liu.webp' },
  { givenName: 'Yuyang', familyName: 'Lu', major: 'Biological Science', src: '/figures/team/yuyang-lu.webp' },
  { givenName: 'Yujia', familyName: 'Peng', major: 'Biological Science', src: '/figures/team/yujia-peng.webp' },
  { givenName: 'Hao', familyName: 'Wang', major: 'Pharmacy', src: '/figures/team/hao-wang.webp' },
  { givenName: 'Jianye', familyName: 'Wang', major: 'Biological Science', src: '/figures/team/jianye-wang.webp' },
  { givenName: 'Xinyu', familyName: 'Wang', major: 'Biological Science', src: '/figures/team/xinyu-wang.webp' },
  { givenName: 'Yinuo', familyName: 'Wang', major: 'Computational Science', src: '/figures/team/yinuo-wang.webp' },
  { givenName: 'Ziqi', familyName: 'Wang', major: 'Biological Science', src: '/figures/team/ziqi-wang.webp' },
  { givenName: 'Yusen', familyName: 'Wu', major: 'Biological Science', src: '/figures/team/yusen-wu.webp' },
  { givenName: 'Yanping', familyName: 'Yang', major: 'Biological Science', src: '/figures/team/yanping-yang.webp' },
  { givenName: 'Ziyang', familyName: 'Zhou', major: 'Biological Science', src: '/figures/team/ziyang-zhou.webp' },
].sort(byName);

export const team: WikiPage = {
  title: 'The people behind DunaTerp',
  eyebrow: 'Team',
  intro: `Meet SCU-China 2026: ${groupLeaders.length} group leaders and ${teamMembers.length} team members working together on DunaTerp.`,
  status: 'team-draft',
  sections: [
    { title: 'Group Leaders', body: '', blocks: [{ kind: 'member-grid', members: groupLeaders }] },
    { title: 'Team Members', body: '', blocks: [{ kind: 'member-grid', members: teamMembers }] },
    {
      title: 'Team Photos', body: '',
      blocks: [{ kind: 'figure', src: '/figures/team/scu-china-2026.webp', alt: 'SCU-China 2026 team together at Sichuan University', caption: 'SCU-China 2026' }],
    },
  ],
};
