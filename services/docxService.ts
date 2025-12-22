
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  AlignmentType, 
  VerticalAlign,
  PageBreak
} from "docx";
// Sử dụng default import cho file-saver để tránh lỗi "does not provide an export named 'saveAs'"
import saveAs from "file-saver";
import { GeneratedTest } from "../types";

const FONT = "Times New Roman";
const SIZE = 26; // 13pt = 26 half-points

export const exportToDocx = async (test: GeneratedTest) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // TRANG 1: MA TRẬN
          createHeader(test.school, "MA TRẬN ĐỀ KIỂM TRA ĐỊNH KÌ"),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `Môn: ${test.subject} - Khối: ${test.grade}`, font: FONT, size: SIZE, italics: true }),
            ],
            spacing: { after: 400 },
          }),
          createMatrixTable(test),
          new Paragraph({ children: [new PageBreak()] }),

          // TRANG 2: BẢNG ĐẶC TẢ
          createHeader(test.school, "BẢNG ĐẶC TẢ KĨ THUẬT ĐỀ KIỂM TRA"),
          createSpecTable(test),
          new Paragraph({ children: [new PageBreak()] }),

          // TRANG 3: ĐỀ KIỂM TRA
          createHeader(test.school, "ĐỀ KIỂM TRA ĐỊNH KÌ"),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `Thời gian làm bài: ${test.time} phút (Không kể thời gian giao đề)`, font: FONT, size: SIZE, italics: true }),
            ],
            spacing: { after: 400 },
          }),
          ...createTestContent(test),
          new Paragraph({ children: [new PageBreak()] }),

          // TRANG 4: ĐÁP ÁN
          createHeader(test.school, "ĐÁP ÁN - HƯỚNG DẪN CHẤM"),
          ...createAnswerContent(test),
          createFooter(),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `De_Kiem_Tra_${test.subject}_K${test.grade}_${test.school.replace(/\s/g, '_')}.docx`;
  
  // Gọi saveAs trực tiếp từ default import
  saveAs(blob, fileName);
};

function createHeader(school: string, title: string) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({ text: school.toUpperCase(), bold: true, font: FONT, size: SIZE }),
      new TextRun({ break: 1, text: title.toUpperCase(), bold: true, font: FONT, size: 28 }),
    ],
    spacing: { after: 200 },
  });
}

function createMatrixTable(test: GeneratedTest) {
  const matrix = test.matrix || [];
  const rows = [
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ text: "TT", alignment: AlignmentType.CENTER, font: FONT })], rowSpan: 3, verticalAlign: VerticalAlign.CENTER }),
        new TableCell({ children: [new Paragraph({ text: "Chủ đề", alignment: AlignmentType.CENTER, font: FONT })], rowSpan: 3, verticalAlign: VerticalAlign.CENTER }),
        new TableCell({ children: [new Paragraph({ text: "Nội dung kiến thức", alignment: AlignmentType.CENTER, font: FONT })], rowSpan: 3, verticalAlign: VerticalAlign.CENTER }),
        new TableCell({ children: [new Paragraph({ text: "Mức độ đánh giá", alignment: AlignmentType.CENTER, font: FONT })], columnSpan: 6 }),
        new TableCell({ children: [new Paragraph({ text: "Tổng", alignment: AlignmentType.CENTER, font: FONT })], columnSpan: 2, rowSpan: 2 }),
        new TableCell({ children: [new Paragraph({ text: "Tỉ lệ (%)", alignment: AlignmentType.CENTER, font: FONT })], rowSpan: 3, verticalAlign: VerticalAlign.CENTER }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ text: "TNKQ", alignment: AlignmentType.CENTER, font: FONT })], columnSpan: 3 }),
        new TableCell({ children: [new Paragraph({ text: "Tự luận", alignment: AlignmentType.CENTER, font: FONT })], columnSpan: 3 }),
      ],
    }),
    new TableRow({
      children: [
        ...["Biết", "Hiểu", "VD", "Biết", "Hiểu", "VD"].map(t => new TableCell({ children: [new Paragraph({ text: t, alignment: AlignmentType.CENTER, font: FONT })] })),
        new TableCell({ children: [new Paragraph({ text: "Câu", alignment: AlignmentType.CENTER, font: FONT })] }),
        new TableCell({ children: [new Paragraph({ text: "Điểm", alignment: AlignmentType.CENTER, font: FONT })] }),
      ],
    }),
    ...matrix.map(row => new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ text: row.tt?.toString() || "", alignment: AlignmentType.CENTER, font: FONT })] }),
        new TableCell({ children: [new Paragraph({ text: row.topic || "", font: FONT })] }),
        new TableCell({ children: [new Paragraph({ text: row.content || "", font: FONT })] }),
        new TableCell({ children: [new Paragraph({ text: (row.tnkq?.know || 0).toString(), alignment: AlignmentType.CENTER, font: FONT })] }),
        new TableCell({ children: [new Paragraph({ text: (row.tnkq?.understand || 0).toString(), alignment: AlignmentType.CENTER, font: FONT })] }),
        new TableCell({ children: [new Paragraph({ text: (row.tnkq?.apply || 0).toString(), alignment: AlignmentType.CENTER, font: FONT })] }),
        new TableCell({ children: [new Paragraph({ text: (row.essay?.know || 0).toString(), alignment: AlignmentType.CENTER, font: FONT })] }),
        new TableCell({ children: [new Paragraph({ text: (row.essay?.understand || 0).toString(), alignment: AlignmentType.CENTER, font: FONT })] }),
        new TableCell({ children: [new Paragraph({ text: (row.essay?.apply || 0).toString(), alignment: AlignmentType.CENTER, font: FONT })] }),
        new TableCell({ children: [new Paragraph({ text: (row.totalQuestions || 0).toString(), alignment: AlignmentType.CENTER, font: FONT })] }),
        new TableCell({ children: [new Paragraph({ text: (row.totalPoints || 0).toFixed(1), alignment: AlignmentType.CENTER, font: FONT })] }),
        new TableCell({ children: [new Paragraph({ text: `${((row.totalPoints || 0)/5*100).toFixed(0)}%`, alignment: AlignmentType.CENTER, font: FONT })] }),
      ]
    }))
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows,
  });
}

function createSpecTable(test: GeneratedTest) {
  const specTable = test.specTable || [];
  const matrix = test.matrix || [];
  const rows = [
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ text: "TT", bold: true, alignment: AlignmentType.CENTER, font: FONT })] }),
        new TableCell({ children: [new Paragraph({ text: "Chủ đề", bold: true, alignment: AlignmentType.CENTER, font: FONT })] }),
        new TableCell({ children: [new Paragraph({ text: "Nội dung", bold: true, alignment: AlignmentType.CENTER, font: FONT })] }),
        new TableCell({ children: [new Paragraph({ text: "Yêu cầu cần đạt", bold: true, alignment: AlignmentType.CENTER, font: FONT })] }),
        new TableCell({ children: [new Paragraph({ text: "Số câu", bold: true, alignment: AlignmentType.CENTER, font: FONT })] }),
      ],
    }),
    ...specTable.map(row => new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ text: row.tt?.toString() || "", alignment: AlignmentType.CENTER, font: FONT })] }),
        new TableCell({ children: [new Paragraph({ text: row.topic || "", bold: true, font: FONT })] }),
        new TableCell({ children: [new Paragraph({ text: row.content || "", font: FONT })] }),
        new TableCell({ children: [new Paragraph({ text: row.learningOutcomes || "", font: FONT, size: 22 })] }),
        new TableCell({ children: [new Paragraph({ text: "TNKQ: " + (matrix.find(m => m.tt === row.tt)?.totalQuestions || 0), alignment: AlignmentType.CENTER, font: FONT })] }),
      ]
    }))
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows,
  });
}

function createTestContent(test: GeneratedTest) {
  const questions = test.questions || [];
  const mcqs = questions.filter(q => q.type === 'MCQ');
  const essays = questions.filter(q => q.type === 'ESSAY');
  
  const content: Paragraph[] = [
    new Paragraph({ text: "PHẦN I. TRẮC NGHIỆM KHÁCH QUAN (3,5 điểm)", bold: true, alignment: AlignmentType.CENTER, font: FONT, spacing: { before: 200, after: 100 } }),
  ];

  mcqs.forEach((q, idx) => {
    content.push(new Paragraph({
      children: [
        new TextRun({ text: `Câu ${idx + 1} (${q.points} điểm): ${q.question}`, bold: true, font: FONT, size: SIZE })
      ],
      spacing: { before: 100 }
    }));
    
    q.options?.forEach((opt, i) => {
      content.push(new Paragraph({
        children: [
          new TextRun({ text: `    ${String.fromCharCode(65 + i)}. ${opt}`, font: FONT, size: SIZE })
        ]
      }));
    });
  });

  content.push(new Paragraph({ text: "PHẦN II. TỰ LUẬN (1,5 điểm)", bold: true, alignment: AlignmentType.CENTER, font: FONT, spacing: { before: 400, after: 100 } }));
  
  essays.forEach((q, idx) => {
    content.push(new Paragraph({
      children: [
        new TextRun({ text: `Câu ${idx + 1} (${q.points} điểm): ${q.question}`, bold: true, font: FONT, size: SIZE })
      ],
      spacing: { before: 100 }
    }));
    content.push(new Paragraph({ text: "..........................................................................................................................................", font: FONT }));
    content.push(new Paragraph({ text: "..........................................................................................................................................", font: FONT }));
  });

  return content;
}

function createAnswerContent(test: GeneratedTest) {
  const questions = test.questions || [];
  const mcqs = questions.filter(q => q.type === 'MCQ');
  const essays = questions.filter(q => q.type === 'ESSAY');

  const content: any[] = [
    new Paragraph({ text: "I. ĐÁP ÁN PHẦN TRẮC NGHIỆM", bold: true, font: FONT, spacing: { before: 200 } }),
  ];

  const answerRows = [
    new TableRow({
      children: mcqs.map((_, i) => new TableCell({ children: [new Paragraph({ text: `Câu ${i + 1}`, bold: true, alignment: AlignmentType.CENTER, font: FONT })] }))
    }),
    new TableRow({
      children: mcqs.map(q => new TableCell({ children: [new Paragraph({ text: q.answer, alignment: AlignmentType.CENTER, font: FONT })] }))
    })
  ];

  content.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: answerRows }));

  content.push(new Paragraph({ text: "II. HƯỚNG DẪN CHẤM TỰ LUẬN", bold: true, font: FONT, spacing: { before: 400 } }));
  
  const essayRows = [
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ text: "Câu", bold: true, alignment: AlignmentType.CENTER, font: FONT })] }),
        new TableCell({ children: [new Paragraph({ text: "Nội dung kiến thức", bold: true, alignment: AlignmentType.CENTER, font: FONT })] }),
        new TableCell({ children: [new Paragraph({ text: "Điểm", bold: true, alignment: AlignmentType.CENTER, font: FONT })] }),
      ]
    }),
    ...essays.map((q, idx) => new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ text: (idx + 1).toString(), alignment: AlignmentType.CENTER, font: FONT })] }),
        new TableCell({ children: [new Paragraph({ text: q.answer, font: FONT })] }),
        new TableCell({ children: [new Paragraph({ text: (q.points || 0).toString(), alignment: AlignmentType.CENTER, font: FONT })] }),
      ]
    }))
  ];

  content.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: essayRows }));

  return content;
}

function createFooter() {
  return new Paragraph({
    alignment: AlignmentType.RIGHT,
    children: [
      new TextRun({ text: "Người ra đề", bold: true, font: FONT, size: SIZE, break: 2 }),
      new TextRun({ text: "(Ký và ghi rõ họ tên)", italics: true, font: FONT, size: 22, break: 1 }),
    ],
    spacing: { before: 400 }
  });
}
