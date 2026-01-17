import { useState, useEffect } from 'react';
import DiffMatchPatch from 'diff-match-patch';
import { DocumentViewer } from './document-viewer';
import { DiffReport, DiffItem } from './diff-report';
import { Button } from '@/app/components/ui/button';
import { Loader2 } from 'lucide-react';
import mammoth from 'mammoth';

interface DocumentComparatorProps {
  fileA: File | null;
  fileB: File | null;
}

interface Difference {
  id: number;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  text: string;
}

export function DocumentComparator({ fileA, fileB }: DocumentComparatorProps) {
  const [contentA, setContentA] = useState('');
  const [contentB, setContentB] = useState('');
  const [differences, setDifferences] = useState<DiffItem[]>([]);
  const [differencesA, setDifferencesA] = useState<Difference[]>([]);
  const [differencesB, setDifferencesB] = useState<Difference[]>([]);
  const [selectedDiffId, setSelectedDiffId] = useState<number | undefined>();
  const [isComparing, setIsComparing] = useState(false);

  // 读取文件内容
  const readFileContent = async (file: File): Promise<string> => {
    const fileType = file.name.split('.').pop()?.toLowerCase();

    if (fileType === 'txt') {
      return await file.text();
    } else if (fileType === 'docx' || fileType === 'doc') {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } else if (fileType === 'pdf') {
      // PDF处理会在后续版本中添加
      return '暂不支持PDF格式的详细对比，请转换为TXT或DOCX格式';
    }

    return '';
  };

  // 加载文件
  useEffect(() => {
    if (fileA) {
      readFileContent(fileA).then(setContentA);
    } else {
      setContentA('');
    }
  }, [fileA]);

  useEffect(() => {
    if (fileB) {
      readFileContent(fileB).then(setContentB);
    } else {
      setContentB('');
    }
  }, [fileB]);

  // 执行对比
  const performComparison = () => {
    if (!contentA || !contentB) return;

    setIsComparing(true);

    setTimeout(() => {
      const dmp = new DiffMatchPatch();
      const diffs = dmp.diff_main(contentA, contentB);
      dmp.diff_cleanupSemantic(diffs);

      const diffItems: DiffItem[] = [];
      const diffsA: Difference[] = [];
      const diffsB: Difference[] = [];
      let diffId = 1;
      let positionA = 0;
      let positionB = 0;

      diffs.forEach((diff) => {
        const [type, text] = diff;

        if (type === -1) {
          // 删除
          diffItems.push({
            id: diffId,
            type: 'deletion',
            textA: text,
            textB: '',
            position: `行 ${Math.floor(positionA / 50) + 1}`,
          });

          diffsA.push({
            id: diffId,
            position: {
              x: 10,
              y: Math.floor(positionA / 50) * 24 + 10,
              width: Math.min(text.length * 8, 600),
              height: 20,
            },
            text,
          });

          positionA += text.length;
          diffId++;
        } else if (type === 1) {
          // 新增
          diffItems.push({
            id: diffId,
            type: 'addition',
            textA: '',
            textB: text,
            position: `行 ${Math.floor(positionB / 50) + 1}`,
          });

          diffsB.push({
            id: diffId,
            position: {
              x: 10,
              y: Math.floor(positionB / 50) * 24 + 10,
              width: Math.min(text.length * 8, 600),
              height: 20,
            },
            text,
          });

          positionB += text.length;
          diffId++;
        } else {
          // 相同
          positionA += text.length;
          positionB += text.length;
        }
      });

      setDifferences(diffItems);
      setDifferencesA(diffsA);
      setDifferencesB(diffsB);
      setIsComparing(false);
    }, 500);
  };

  const handleDifferenceClick = (id: number) => {
    setSelectedDiffId(id);
  };

  const canCompare = fileA && fileB && contentA && contentB;

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">文档对比</h2>
        <Button
          onClick={performComparison}
          disabled={!canCompare || isComparing}
          size="lg"
        >
          {isComparing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isComparing ? '对比中...' : '开始对比'}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <DocumentViewer
          title="文档 A"
          content={contentA || '请上传文档 A'}
          differences={differencesA}
          onDifferenceClick={handleDifferenceClick}
        />
        <DocumentViewer
          title="文档 B"
          content={contentB || '请上传文档 B'}
          differences={differencesB}
          onDifferenceClick={handleDifferenceClick}
        />
      </div>

      <div className="h-80">
        <DiffReport
          differences={differences}
          onItemClick={handleDifferenceClick}
          selectedId={selectedDiffId}
        />
      </div>
    </div>
  );
}
