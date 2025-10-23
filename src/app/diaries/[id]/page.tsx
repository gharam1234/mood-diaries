import DiariesDetail from '@/components/diaries-detail';

interface DiaryDetailPageProps {
  params: {
    id: string;
  };
}

export default function DiaryDetailPage({ params }: DiaryDetailPageProps) {
  return (
    <div>
      <DiariesDetail diaryId={params.id} />
    </div>
  );
}
