import NewChapter from '@/modules/admin/courses/edit-course/chapters/new-chapter';

interface Props {
  params: {
    id: string;
  };
}
const NewChapterPage = async ({
  params,
}: Props) => {
  const id = (await params).id;
  return <NewChapter courseId={id} />;
};

export default NewChapterPage;
