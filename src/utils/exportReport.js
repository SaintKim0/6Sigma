import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { buildProjectStoryline } from './projectStoryline';

/**
 * 프로젝트 요약 PDF 생성 (스토리라인 + 핵심 필드)
 */
export async function exportProjectPdf({ data, methodology, completedTools, industryName, elementId }) {
  // Prefer capturing a DOM node if provided
  if (elementId) {
    const el = document.getElementById(elementId);
    if (el) {
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = pageW - 16;
      const imgH = (canvas.height * imgW) / canvas.width;
      let hLeft = imgH;
      let position = 8;
      pdf.addImage(img, 'PNG', 8, position, imgW, imgH);
      hLeft -= pageH - 16;
      while (hLeft > 0) {
        position = hLeft - imgH + 8;
        pdf.addPage();
        pdf.addImage(img, 'PNG', 8, position, imgW, imgH);
        hLeft -= pageH - 16;
      }
      const title = data?.define?.projectTitle || '6sigma_report';
      pdf.save(`${sanitize(title)}.pdf`);
      return;
    }
  }

  const story = buildProjectStoryline({ data, methodology, completedTools, industryName });
  const pdf = new jsPDF('p', 'mm', 'a4');
  const margin = 14;
  let y = margin;

  const line = (text, size = 11, style = 'normal') => {
    pdf.setFont('helvetica', style);
    pdf.setFontSize(size);
    const lines = pdf.splitTextToSize(String(text || ''), pdf.internal.pageSize.getWidth() - margin * 2);
    lines.forEach(l => {
      if (y > 280) { pdf.addPage(); y = margin; }
      pdf.text(l, margin, y);
      y += size * 0.45 + 2;
    });
  };

  line(`SigmaLab Report`, 16, 'bold');
  line(`${story.methodology} | ${story.title}`, 12, 'bold');
  if (story.industryName) line(`Industry: ${story.industryName}`, 10);
  line(story.oneLiner, 10);
  y += 4;

  story.phases.forEach(ph => {
    line(`[${ph.title}] ${ph.done ? 'DONE' : 'WIP'}`, 12, 'bold');
    if (!ph.bullets.length) line('- (no notes yet)', 10);
    ph.bullets.forEach(b => line(`- ${b}`, 10));
    y += 2;
  });

  if (story.evidence.length) {
    line('Evidence', 12, 'bold');
    story.evidence.forEach(e => line(`- ${e.label}: ${e.text}`, 10));
  }
  if (story.actions.length) {
    y += 2;
    line('Actions', 12, 'bold');
    story.actions.forEach(a => line(`- ${a}`, 10));
  }

  y += 6;
  line(`Tools completed: ${story.progress.completedTools}`, 9);
  line(`Generated: ${new Date().toLocaleString()}`, 9);

  pdf.save(`${sanitize(story.title)}.pdf`);
}

/** A3 DOM → PDF */
export async function exportElementPdf(elementId, filename = 'a3_report.pdf') {
  const el = document.getElementById(elementId);
  if (!el) throw new Error('내보낼 화면을 찾을 수 없습니다.');
  const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
  const img = canvas.toDataURL('image/png');
  const pdf = new jsPDF('l', 'mm', 'a4');
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const ratio = Math.min((pageW - 10) / canvas.width, (pageH - 10) / canvas.height);
  const w = canvas.width * ratio;
  const h = canvas.height * ratio;
  pdf.addImage(img, 'PNG', (pageW - w) / 2, (pageH - h) / 2, w, h);
  pdf.save(filename);
}

/** PPT 대체: 스토리라인 텍스트 슬라이드용 Markdown/HTML 다운로드 */
export function exportProjectPptOutline({ data, methodology, completedTools, industryName }) {
  const story = buildProjectStoryline({ data, methodology, completedTools, industryName });
  const slides = [
    `# ${story.title}`,
    `${story.methodology} | ${story.industryName || ''}`.trim(),
    '',
    '## One-liner',
    story.oneLiner,
    '',
    ...story.phases.flatMap(ph => [
      `## ${ph.title} (${ph.done ? '완료' : '진행'})`,
      ...(ph.bullets.length ? ph.bullets.map(b => `- ${b}`) : ['- (메모 없음)']),
      ''
    ]),
    '## Evidence',
    ...story.evidence.map(e => `- **${e.label}**: ${e.text}`),
    '',
    '## Actions',
    ...story.actions.map(a => `- ${a}`),
    '',
    '_PowerPoint에 붙여넣어 슬라이드로 변환하세요._'
  ].join('\n');

  const blob = new Blob([slides], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitize(story.title)}_slides.md`;
  a.click();
  URL.revokeObjectURL(url);
}

function sanitize(s) {
  return String(s || 'report').replace(/[\\/:*?"<>|]/g, '_').slice(0, 60);
}
