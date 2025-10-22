import DiariesDetail from '@/components/diaries-detail';

interface DiaryDetailPageProps {
  params: {
    id: string;
  };
}

export default function DiaryDetailPage({ params }: DiaryDetailPageProps) {
  return (
    <div data-testid="diary-detail-container">
      <DiariesDetail diaryId={params.id} />
    </div>
  );
}
